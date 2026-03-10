import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const plans = [
    { id: 'guest', name: 'Guest', desc: '1 free analysis', price: 'Free' },
    { id: 'free', name: 'Free', desc: '2 analyses/month', price: '₹0' },
    { id: 'pro', name: 'Pro', desc: 'Unlimited analyses', price: '₹299/mo' },
]

export default function SignupPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const fromCTA = (location.state as any)?.from === 'hero-cta' || (location.state as any)?.from === 'upload-gate'
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [selectedPlan, setSelectedPlan] = useState('free')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleGoogleSignup = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/upload` },
        })
        if (error) setError(error.message)
    }

    const handleEmailSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName, plan: selectedPlan } },
        })
        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            navigate('/upload')
        }
    }

    return (
        <div className="min-h-screen bg-[#020408] flex">
            {/* ═══ LEFT PANEL — Visual ═══ */}
            <div className="hidden lg:flex flex-col justify-center w-[60%] relative gradient-mesh-bg dot-grid px-16">
                <div className="relative z-10 max-w-lg">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl xl:text-5xl font-black text-white leading-tight mb-6"
                    >
                        Start your journey to a{' '}
                        <span className="text-gradient">dream career.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-[#8B949E] text-lg mb-10"
                    >
                        Join thousands of professionals who improved their resumes with AI.
                    </motion.p>

                    {/* Stat pills */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-wrap gap-3"
                    >
                        {['47 ATS factors analysed', '15s average time', 'Free forever'].map((s) => (
                            <span key={s} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-[#C9D1D9]">
                                {s}
                            </span>
                        ))}
                    </motion.div>

                    {/* Floating card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.6 }}
                        className="mt-12 bg-[#161B22] border border-[#30363D] rounded-2xl p-6 max-w-xs animate-float"
                    >
                        <p className="text-xs text-[#8B949E] mb-2">Sample ATS Score</p>
                        <div className="flex items-end gap-3">
                            <span className="text-5xl font-black text-gradient">78</span>
                            <span className="text-sm text-green-400 mb-2">Good ✅</span>
                        </div>
                        <div className="mt-3 h-2 bg-[#0D1117] rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full" style={{ width: '78%' }} />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ═══ RIGHT PANEL — Form ═══ */}
            <motion.div
                initial={{ x: 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="flex-1 flex items-center justify-center px-4 py-12"
            >
                <div className="w-full max-w-md">
                    {/* Hero CTA contextual message */}
                    {fromCTA && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 text-center"
                        >
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <Sparkles size={16} className="text-blue-400" />
                                <span className="text-sm font-semibold text-blue-400">Almost there!</span>
                            </div>
                            <p className="text-sm text-[#C9D1D9]">
                                Create your free account to start your analysis — takes 30 seconds
                            </p>
                        </motion.div>
                    )}
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-flex items-center gap-1.5 select-none">
                            <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
                            <span className="text-3xl font-bold text-white">Resume</span>
                            <span className="text-3xl font-bold text-[#3B82F6]">IQ</span>
                        </Link>
                        <p className="text-[#8B949E] mt-2 text-sm">Create your account to get started.</p>
                    </div>

                    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-8">
                        {/* Plan selector */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-[#C9D1D9] mb-3">Choose your plan</label>
                            <div className="grid grid-cols-3 gap-2">
                                {plans.map((plan) => (
                                    <button
                                        key={plan.id}
                                        type="button"
                                        onClick={() => setSelectedPlan(plan.id)}
                                        className={`p-3 rounded-xl border text-center transition-all duration-200 ${selectedPlan === plan.id
                                            ? 'border-[#3B82F6] bg-[#3B82F6]/10 shadow-lg shadow-blue-500/10'
                                            : 'border-[#30363D] hover:border-[#8B949E]'
                                            }`}
                                    >
                                        <p className="text-xs font-semibold text-white">{plan.name}</p>
                                        <p className="text-[10px] text-[#8B949E] mt-0.5">{plan.desc}</p>
                                        <p className="text-xs font-bold text-[#3B82F6] mt-1">{plan.price}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Google OAuth */}
                        <button
                            onClick={handleGoogleSignup}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-gray-100 text-gray-800 font-medium rounded-xl transition-all duration-200 mb-6"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex-1 h-px bg-[#30363D]" />
                            <span className="text-xs text-[#8B949E]">or</span>
                            <div className="flex-1 h-px bg-[#30363D]" />
                        </div>

                        {/* Email form */}
                        <form onSubmit={handleEmailSignup} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#C9D1D9] mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 bg-[#0D1117] border border-[#30363D] rounded-lg text-white text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#C9D1D9] mb-1.5">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 bg-[#0D1117] border border-[#30363D] rounded-lg text-white text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#C9D1D9] mb-1.5">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-2.5 bg-[#0D1117] border border-[#30363D] rounded-lg text-white text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

                            {error && (
                                <div className="text-sm text-[#EF4444] bg-[#EF4444]/10 px-3 py-2 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed btn-shimmer"
                            >
                                {loading ? 'Creating account...' : 'Create Account'}
                            </button>
                        </form>

                        {/* Plan perks */}
                        <div className="mt-4 p-3 rounded-lg bg-[#0D1117] border border-[#30363D]">
                            <div className="flex items-center gap-2 text-xs text-[#10B981]">
                                <Check size={14} />
                                <span>
                                    {selectedPlan === 'guest' && '1 free analysis, no account needed'}
                                    {selectedPlan === 'free' && '2 analyses per month, ATS score + skill gaps'}
                                    {selectedPlan === 'pro' && 'Unlimited analyses, full AI reports, priority queue'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-sm text-[#8B949E] mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#3B82F6] hover:underline font-medium">
                            Log in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
