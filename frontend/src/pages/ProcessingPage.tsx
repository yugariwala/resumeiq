import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, RotateCcw, Clock, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

const STEPS = [
    { icon: '📄', loading: 'Parsing your resume...', done: 'Resume parsed' },
    { icon: '🧠', loading: 'Running NLP analysis...', done: 'Sections identified' },
    { icon: '🔍', loading: 'Extracting skills...', done: 'Skills extracted' },
    { icon: '📊', loading: 'Computing ATS score...', done: 'ATS score calculated' },
    { icon: '🎯', loading: 'Matching job role...', done: 'Role profile matched' },
    { icon: '🏢', loading: 'Evaluating company fit...', done: 'Company profile loaded' },
    { icon: '🤖', loading: 'Predicting selection likelihood...', done: 'Prediction complete' },
    { icon: '✍️', loading: 'Generating your improvement plan...', done: 'Plan ready!' },
]

const SLOW_THRESHOLD = 90  // seconds before showing "taking longer" message
const TIMEOUT = 180         // hard timeout seconds (3 min)

export default function ProcessingPage() {
    const { analysisId } = useParams()
    const navigate = useNavigate()

    const [visibleSteps, setVisibleSteps] = useState(0)
    const [completedSteps, setCompletedSteps] = useState(0)
    const [status, setStatus] = useState<'processing' | 'failed' | 'complete'>('processing')
    const [elapsed, setElapsed] = useState(0)
    const [errorMessage, setErrorMessage] = useState('')
    const hasShownTimeoutToast = useRef(false)

    // Animate step appearance
    useEffect(() => {
        if (visibleSteps >= STEPS.length) return
        const timer = setTimeout(() => setVisibleSteps((v) => v + 1), 1500)
        return () => clearTimeout(timer)
    }, [visibleSteps])

    // Mark step completed shortly after appearing
    useEffect(() => {
        if (completedSteps >= visibleSteps) return
        const timer = setTimeout(() => setCompletedSteps((c) => c + 1), 800)
        return () => clearTimeout(timer)
    }, [visibleSteps, completedSteps])

    const poll = useCallback(async () => {
        if (!analysisId) return
        try {
            const { data: { session } } = await supabase.auth.getSession()
            const res = await fetch(`/api/analysis/${analysisId}`, {
                headers: session?.access_token
                    ? { 'Authorization': `Bearer ${session.access_token}` }
                    : {},
                signal: AbortSignal.timeout(15_000), // 15s timeout per poll
            })
            if (!res.ok) return
            const data = await res.json()

            if (data.status === 'complete') {
                setStatus('complete')
                navigate(`/results/${analysisId}`)
            } else if (data.status === 'failed') {
                setStatus('failed')
                setErrorMessage(data.error || 'The AI engine returned an error.')
            }
        } catch (err: any) {
            // Show timeout toast once, but keep polling
            if (err?.name === 'TimeoutError' && !hasShownTimeoutToast.current) {
                hasShownTimeoutToast.current = true
                toast.warning('Server is taking longer than expected…', {
                    description: 'We\'re still trying. Hang tight!',
                    duration: 5000,
                })
            }
            // Network/timeout errors — silently retry on next poll
        }
    }, [analysisId, navigate])

    useEffect(() => {
        const interval = setInterval(poll, 3000)
        return () => clearInterval(interval)
    }, [poll])

    // Elapsed timer + hard timeout
    useEffect(() => {
        const timer = setInterval(() => {
            setElapsed((e) => {
                const next = e + 1
                if (next >= TIMEOUT) {
                    setStatus('failed')
                    setErrorMessage('Analysis timed out. Please try again.')
                }
                return next
            })
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const isSlow = elapsed >= SLOW_THRESHOLD && status === 'processing'
    const progress = Math.min((completedSteps / STEPS.length) * 100, 100)

    /* ════════ FAILED STATE ════════ */
    if (status === 'failed') {
        return (
            <div className="min-h-screen bg-[#020408] flex items-center justify-center px-4 gradient-mesh-bg dot-grid">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 bg-[#161B22] border border-[#30363D] rounded-2xl p-8 max-w-md w-full text-center"
                >
                    <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={32} className="text-[#EF4444]" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Analysis Failed</h2>
                    <p className="text-[#8B949E] text-sm mb-2">
                        {errorMessage || 'Something went wrong while processing your resume.'}
                    </p>
                    <p className="text-xs text-[#8B949E] mb-6">
                        Make sure the AI engine is running at <code className="text-[#F59E0B]">http://localhost:8000</code>
                    </p>
                    <button
                        onClick={() => navigate('/upload')}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-lg transition-all btn-shimmer"
                    >
                        <RotateCcw size={16} />
                        Try Again
                    </button>
                </motion.div>
            </div>
        )
    }

    /* ════════ PROCESSING STATE ════════ */
    return (
        <div className="min-h-screen bg-[#020408] flex items-center justify-center px-4 py-12 gradient-mesh-bg dot-grid">
            <div className="relative z-10 max-w-lg w-full text-center">

                {/* Ripple Background Behind Ring */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-8 sm:mb-10">
                    {/* Ripple circles */}
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="absolute inset-0 rounded-full border border-blue-500/20"
                            style={{
                                animation: `ripple 3s ease-out ${i * 1}s infinite`,
                            }}
                        />
                    ))}

                    {/* Spinning Gradient Ring */}
                    <div
                        className="absolute inset-0 rounded-full animate-gradient-spin"
                        style={{
                            background: 'conic-gradient(from 0deg, #3B82F6, #10B981, #8B5CF6, #3B82F6)',
                            padding: '3px',
                            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                            maskComposite: 'exclude',
                            WebkitMaskComposite: 'xor',
                        }}
                    />
                    <div className="absolute inset-[3px] rounded-full bg-[#020408] flex items-center justify-center">
                        <span className="text-xl sm:text-2xl font-bold">
                            <span className="text-white">I</span>
                            <span className="text-[#3B82F6]">Q</span>
                        </span>
                    </div>
                </div>

                <h1 className="text-lg sm:text-xl font-bold text-white mb-2">Analysing your resume…</h1>
                <p className="text-sm text-[#8B949E] mb-6">This usually takes 30–60 seconds</p>

                {/* Grand Progress Bar */}
                <div className="w-full max-w-xs mx-auto mb-8">
                    <div className="h-1.5 bg-[#161B22] rounded-full overflow-hidden">
                        <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-emerald-500 to-purple-500"
                            initial={{ width: '0%' }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                    </div>
                    <p className="text-xs text-[#8B949E] mt-2 tabular-nums">{Math.round(progress)}% complete</p>
                </div>

                {/* Step List */}
                <div className="space-y-3 text-left max-w-xs sm:max-w-sm mx-auto">
                    {STEPS.slice(0, visibleSteps).map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center gap-3"
                        >
                            <span className="text-lg w-6 shrink-0">{step.icon}</span>
                            <span className={`text-sm transition-all duration-300 flex-1 ${i < completedSteps ? 'text-[#10B981]' : 'text-[#8B949E]'}`}>
                                {i < completedSteps ? step.done : step.loading}
                            </span>
                            {i < completedSteps ? (
                                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                            ) : (
                                <div className="ml-auto w-4 h-4 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin shrink-0" />
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Slow warning */}
                {isSlow && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 flex items-center justify-center gap-2 px-4 py-3 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-xl text-sm text-[#F59E0B]"
                    >
                        <Clock size={16} className="shrink-0" />
                        Taking longer than usual… AI engine may be warming up.
                    </motion.div>
                )}

                {/* Timer */}
                <p className="text-xs text-[#8B949E]/50 mt-6 tabular-nums">{elapsed}s elapsed</p>
            </div>
        </div>
    )
}
