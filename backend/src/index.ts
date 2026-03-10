import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { uploadRouter } from './routes/upload'
import { analysisRouter } from './routes/analysis'
import { authRouter } from './routes/auth'

// ── Environment variable validation ──────────────────────────────────────────
const REQUIRED_ENV = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_JWT_SECRET', 'AI_ENGINE_URL'] as const
const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key])
if (missingEnv.length > 0) {
    console.error('❌ Missing required environment variables:')
    missingEnv.forEach((k) => console.error(`   • ${k}`))
    console.error('\nCreate a .env file in backend/ with these variables. See .env.example for reference.')
    process.exit(1)
}

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map(s => s.trim())

app.use(cors({
    origin: (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin)) {
            cb(null, true)
        } else {
            cb(new Error(`CORS blocked for origin: ${origin}`))
        }
    },
    credentials: true,
}))
app.use(express.json())

// Rate limiting
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60,
    message: { error: 'Too many requests', code: 'RATE_LIMITED' },
})
app.use('/api', limiter)

// Routes
app.use('/api', uploadRouter)
app.use('/api', analysisRouter)
app.use('/api', authRouter)

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'resumeiq-backend' })
})

// 404 handler
app.use((_req, res) => {
    res.status(404).json({ error: 'Not found', code: 'NOT_FOUND' })
})

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Unhandled error:', err)
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' })
})

app.listen(PORT, () => {
    console.log(`🚀 ResumeIQ backend running on http://localhost:${PORT}`)
})

export default app
