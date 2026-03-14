"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const upload_1 = require("./routes/upload");
const analysis_1 = require("./routes/analysis");
const auth_1 = require("./routes/auth");
// ── Environment variable validation ──────────────────────────────────────────
const REQUIRED_ENV = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_JWT_SECRET', 'AI_ENGINE_URL'];
const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingEnv.forEach((k) => console.error(`   • ${k}`));
    console.error('\nCreate a .env file in backend/ with these variables. See .env.example for reference.');
    process.exit(1);
}
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map(s => s.trim());
app.use((0, cors_1.default)({
    origin: (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin)) {
            cb(null, true);
        }
        else {
            cb(new Error(`CORS blocked for origin: ${origin}`));
        }
    },
    credentials: true,
}));
app.use(express_1.default.json());
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minute
    max: 60,
    message: { error: 'Too many requests', code: 'RATE_LIMITED' },
});
app.use('/api', limiter);
// Routes
app.use('/api', upload_1.uploadRouter);
app.use('/api', analysis_1.analysisRouter);
app.use('/api', auth_1.authRouter);
// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'resumeiq-backend' });
});
// 404 handler
app.use((_req, res) => {
    res.status(404).json({ error: 'Not found', code: 'NOT_FOUND' });
});
// Global error handler
app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
});
app.listen(PORT, () => {
    console.log(`🚀 ResumeIQ backend running on http://localhost:${PORT}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map