"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
exports.authRouter = (0, express_1.Router)();
// I6: Removed dead POST /api/auth/guest-session route.
// All auth is handled by Supabase client-side.
// This router is kept as a placeholder for future server-side auth routes.
//# sourceMappingURL=auth.js.map