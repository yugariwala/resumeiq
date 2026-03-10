import { Router } from 'express'

export const authRouter = Router()

// I6: Removed dead POST /api/auth/guest-session route.
// All auth is handled by Supabase client-side.
// This router is kept as a placeholder for future server-side auth routes.
