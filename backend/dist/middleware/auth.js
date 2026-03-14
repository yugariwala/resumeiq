"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalJWT = optionalJWT;
exports.validateJWT = validateJWT;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
// ── JWKS client for ES256 (asymmetric) Supabase tokens ──
const supabaseUrl = process.env.SUPABASE_URL || '';
const client = (0, jwks_rsa_1.default)({
    jwksUri: `${supabaseUrl}/auth/v1/.well-known/jwks.json`,
    cache: true,
    cacheMaxAge: 600_000, // 10 minutes
    rateLimit: true,
});
function getSigningKey(header) {
    return new Promise((resolve, reject) => {
        if (!header.kid) {
            reject(new Error('JWT has no kid header'));
            return;
        }
        client.getSigningKey(header.kid, (err, key) => {
            if (err) {
                reject(err);
                return;
            }
            const signingKey = key?.getPublicKey();
            if (!signingKey) {
                reject(new Error('No signing key found'));
                return;
            }
            resolve(signingKey);
        });
    });
}
const getHmacSecret = () => {
    return process.env.SUPABASE_JWT_SECRET || null;
};
/**
 * Optional JWT middleware — extracts user if token present, allows guests through.
 * Use this for routes that support both authenticated and guest users (e.g. upload).
 */
function optionalJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        // No token — guest user, proceed without userId
        next();
        return;
    }
    // Token present — validate it (delegates to validateJWT)
    validateJWT(req, res, next);
}
function validateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Missing authorization token', code: 'UNAUTHORIZED' });
        return;
    }
    const token = authHeader.split(' ')[1];
    // Decode header to determine algorithm
    const headerB64 = token.split('.')[0];
    let alg = 'HS256';
    let kid;
    try {
        const header = JSON.parse(Buffer.from(headerB64, 'base64url').toString());
        alg = header.alg || 'HS256';
        kid = header.kid;
    }
    catch { /* default to HS256 */ }
    if (alg === 'ES256' && kid && supabaseUrl) {
        // ── ES256: Verify with JWKS public key ──
        getSigningKey({ alg: 'ES256', kid })
            .then(publicKey => {
            const decoded = jsonwebtoken_1.default.verify(token, publicKey, { algorithms: ['ES256'] });
            req.user = decoded;
            req.userId = decoded.sub;
            next();
        })
            .catch(err => {
            console.error('JWT ES256 Verification Error:', err.message);
            res.status(401).json({ error: 'Invalid or expired token', code: 'UNAUTHORIZED' });
        });
    }
    else {
        // ── HS256: Verify with HMAC secret (legacy Supabase projects) ──
        try {
            const secret = getHmacSecret();
            if (!secret) {
                throw new Error('SUPABASE_JWT_SECRET not set and token is not ES256');
            }
            let decoded;
            try {
                decoded = jsonwebtoken_1.default.verify(token, secret, { algorithms: ['HS256'] });
            }
            catch (firstErr) {
                // Fallback: Base64-decoded secret
                if (secret.length > 40) {
                    const decodedSecret = Buffer.from(secret, 'base64');
                    decoded = jsonwebtoken_1.default.verify(token, decodedSecret, { algorithms: ['HS256'] });
                }
                else {
                    throw firstErr;
                }
            }
            req.user = decoded;
            req.userId = decoded.sub;
            next();
        }
        catch (err) {
            console.error('JWT HS256 Verification Error:', err.message);
            if (err.message?.includes('SUPABASE_JWT_SECRET')) {
                res.status(500).json({ error: 'Server auth misconfigured', code: 'AUTH_CONFIG_ERROR' });
            }
            else {
                res.status(401).json({ error: 'Invalid or expired token', code: 'UNAUTHORIZED' });
            }
        }
    }
}
//# sourceMappingURL=auth.js.map