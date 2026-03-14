import { Request, Response, NextFunction } from 'express';
export interface AuthRequest extends Request {
    userId?: string;
    user?: {
        sub: string;
        email?: string;
        role?: string;
        [key: string]: any;
    };
}
/**
 * Optional JWT middleware — extracts user if token present, allows guests through.
 * Use this for routes that support both authenticated and guest users (e.g. upload).
 */
export declare function optionalJWT(req: AuthRequest, res: Response, next: NextFunction): void;
export declare function validateJWT(req: AuthRequest, res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.d.ts.map