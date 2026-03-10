import { useState, useEffect, Suspense, lazy } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Star } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/contexts/AuthContext'
import Footer from '@/components/Footer'

const LazyFloatingOrb = lazy(() => import('@/components/FloatingOrb'))

/* ═══════════════════════════════════════ DATA ═══════════════════════════════════════ */

const testimonials = [
    { initials: 'PM', name: 'Priya M.', role: 'Software Engineer', company: 'TCS', quote: 'My ATS score went from 38 to 79 after 2 uploads. Got 3 interview calls within a week.', color: 'bg-blue-500' },
    { initials: 'RK', name: 'Rahul K.', role: 'Data Scientist', company: 'Infosys', quote: 'The skill gap analysis showed me exactly what I was missing. Landed my dream role in 3 weeks.', color: 'bg-emerald-500' },
    { initials: 'AS', name: 'Ananya S.', role: 'Product Manager', company: 'Flipkart', quote: 'Selection prediction said 73% — I got the offer! The improvement tips were incredibly specific.', color: 'bg-purple-500' },
    { initials: 'VR', name: 'Vikram R.', role: 'DevOps Engineer', company: 'Razorpay', quote: 'The JD matching feature helped me tailor my resume perfectly. Got shortlisted in 2 days.', color: 'bg-amber-500' },
    { initials: 'SK', name: 'Sneha K.', role: 'Full Stack Developer', company: 'Swiggy', quote: 'The personalised learning plan was a game-changer. I filled every skill gap in 6 weeks.', color: 'bg-pink-500' },
    { initials: 'AM', name: 'Aditya M.', role: 'ML Engineer', company: 'Google', quote: 'Best resume tool I have used. The AI insights are scarily accurate and genuinely actionable.', color: 'bg-cyan-500' },
]

const features = [
    { icon: '📊', title: 'ATS Score Engine', desc: 'See exactly how ATS machines score your resume across 5 dimensions' },
    { icon: '🎯', title: 'Selection Prediction', desc: 'AI predicts your selection probability for your exact target company' },
    { icon: '🔍', title: 'Skill Gap Analysis', desc: 'Find which skills you have, which you\'re missing, and how critical each gap is' },
    { icon: '🎨', title: 'Resume Highlight Viewer', desc: 'See your resume with colour-coded AI annotations — green, yellow, red' },
    { icon: '📚', title: 'Personalised Learning Plan', desc: 'Week-by-week roadmap to close skill gaps with time estimates and resources' },
    { icon: '📋', title: 'JD Matcher', desc: 'Paste any job description and see your exact match score and keyword gaps' },
]

const monthlyPricing = [
    { name: 'Free', price: '₹0', period: '', features: ['2 analyses/month', 'ATS score', 'Skill gaps', 'No PDF download'], highlight: false, cta: 'Get Started' },
    { name: 'Pro', price: '₹299', period: '/month', features: ['Unlimited analyses', 'Full AI improvement plan', 'PDF report', 'AI bullet rewrites', 'Priority queue'], highlight: true, cta: 'Go Pro', badge: 'Most Popular' },
    { name: 'Pay-per-Use', price: '₹49', period: '/analysis', features: ['No subscription', 'Single analysis', 'Full report'], highlight: false, cta: 'Pay Once' },
]

const yearlyPricing = [
    { name: 'Free', price: '₹0', period: '', features: ['2 analyses/month', 'ATS score', 'Skill gaps', 'No PDF download'], highlight: false, cta: 'Get Started' },
    { name: 'Pro', price: '₹239', period: '/month', features: ['Unlimited analyses', 'Full AI improvement plan', 'PDF report', 'AI bullet rewrites', 'Priority queue'], highlight: true, cta: 'Go Pro', badge: 'Most Popular' },
    { name: 'Pay-per-Use', price: '₹49', period: '/analysis', features: ['No subscription', 'Single analysis', 'Full report'], highlight: false, cta: 'Pay Once' },
]

const howItWorks = [
    { step: 1, icon: '📄', title: 'Upload Resume', desc: 'Drag & drop your PDF or paste text' },
    { step: 2, icon: '🤖', title: 'AI Analyses', desc: 'Six modules run in parallel on your resume' },
    { step: 3, icon: '🎯', title: 'Get Your Plan', desc: 'Actionable roadmap to land your dream job' },
]

/* ═══════════════════════════════════════ HERO WORD ANIMATION ═══════════════════════════════════════ */

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
}

const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

function AnimatedWords({ text, className }: { text: string; className?: string }) {
    return (
        <motion.span variants={containerVariants} initial="hidden" animate="visible" className={className}>
            {text.split(' ').map((word, i) => (
                <motion.span key={i} variants={wordVariants} className="inline-block mr-[0.3em]">
                    {word}
                </motion.span>
            ))}
        </motion.span>
    )
}

/* ═══════════════════════════════════════ PAGE ═══════════════════════════════════════ */

export default function HomePage() {
    const [resumeCount, setResumeCount] = useState(2800)
    const [yearly, setYearly] = useState(false)
    const plans = yearly ? yearlyPricing : monthlyPricing
    const { user } = useAuth()
    const navigate = useNavigate()

    // Animate counter from 2800 to 2847 on mount
    useEffect(() => {
        let count = 2800
        const target = 2847
        const iv = setInterval(() => {
            count += 1
            setResumeCount(count)
            if (count >= target) clearInterval(iv)
        }, 50)
        return () => clearInterval(iv)
    }, [])

    // Slow increment after initial animation
    useEffect(() => {
        const timeout = setTimeout(() => {
            const interval = setInterval(() => {
                setResumeCount((c) => c + Math.floor(Math.random() * 3) + 1)
            }, 8000)
            return () => clearInterval(interval)
        }, 3000)
        return () => clearTimeout(timeout)
    }, [])

    return (
        <div className="min-h-screen bg-[#020408]">
            <Navbar />

            {/* ════════ HERO ════════ */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden gradient-mesh-bg dot-grid">
                <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
                    {/* Left — Text */}
                    <div className="flex-1 text-center lg:text-left max-w-2xl">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 mb-8"
                        >
                            <span className="text-sm font-medium text-blue-400">
                                ✦ AI-Powered Resume Intelligence
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.1] mb-6">
                            <AnimatedWords text="Beat the Algorithm." className="text-white block" />
                            <AnimatedWords text="Land the Job." className="text-gradient block mt-2" />
                        </h1>

                        {/* Sub-headline */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className="text-lg sm:text-xl text-[#8B949E] max-w-[520px] mx-auto lg:mx-0 mb-10 leading-relaxed"
                        >
                            95% of resumes never reach a human.
                            Upload yours — AI tells you exactly why and exactly how to fix it.
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 0.5 }}
                            className="flex flex-col sm:flex-row items-center gap-4 mb-8 lg:justify-start justify-center"
                        >
                            <button
                                onClick={() => navigate(user ? '/upload' : '/signup', user ? undefined : { state: { from: 'hero-cta' } })}
                                className="btn-shimmer group flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
                            >
                                Analyse My Resume Free
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <Link
                                to="/demo"
                                className="flex items-center gap-2 px-8 py-4 text-base font-semibold text-[#C9D1D9] border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl transition-all duration-300"
                            >
                                See Live Demo →
                            </Link>
                        </motion.div>

                        {/* Live Counter */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2, duration: 0.5 }}
                            className="flex items-center gap-2 lg:justify-start justify-center"
                        >
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <p className="text-sm text-[#8B949E]">
                                <span className="font-semibold text-green-400 tabular-nums">
                                    {resumeCount.toLocaleString()}
                                </span>{' '}
                                resumes analysed today
                            </p>
                        </motion.div>
                    </div>

                    {/* Right — 3D Element (desktop only) */}
                    <div className="hidden lg:block w-[500px] h-[500px] flex-shrink-0">
                        <Suspense fallback={<div className="w-full h-full animate-pulse bg-white/5 rounded-full" />}>
                            <LazyFloatingOrb />
                        </Suspense>
                    </div>
                </div>
            </section>

            {/* ════════ TESTIMONIALS MARQUEE ════════ */}
            <section className="py-16 px-4 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    {/* Row 1 — scrolls left */}
                    <div className="overflow-hidden mb-6">
                        <div className="marquee-row marquee-left">
                            {[...testimonials, ...testimonials].map((t, i) => (
                                <div key={i} className="w-[380px] shrink-0 bg-[#161B22] border border-[#30363D] rounded-2xl p-6 card-glow transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-sm font-bold text-white`}>
                                            {t.initials}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">{t.name}</p>
                                            <p className="text-xs text-[#8B949E]">{t.role} · {t.company}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5 mb-3">
                                        {[...Array(5)].map((_, j) => (
                                            <Star key={j} size={13} className="fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-sm text-[#C9D1D9] leading-relaxed">"{t.quote}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Row 2 — scrolls right */}
                    <div className="overflow-hidden">
                        <div className="marquee-row marquee-right">
                            {[...testimonials.slice(3), ...testimonials.slice(0, 3), ...testimonials.slice(3), ...testimonials.slice(0, 3)].map((t, i) => (
                                <div key={i} className="w-[380px] shrink-0 bg-[#161B22] border border-[#30363D] rounded-2xl p-6 card-glow transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-sm font-bold text-white`}>
                                            {t.initials}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">{t.name}</p>
                                            <p className="text-xs text-[#8B949E]">{t.role} · {t.company}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5 mb-3">
                                        {[...Array(5)].map((_, j) => (
                                            <Star key={j} size={13} className="fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-sm text-[#C9D1D9] leading-relaxed">"{t.quote}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════ FEATURES ════════ */}
            <section id="features" className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-14"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Everything you need to beat the ATS
                        </h2>
                        <p className="text-[#8B949E] max-w-xl mx-auto">
                            Six powerful AI modules working together to maximise your chances.
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                className="group bg-[#161B22] border border-[#30363D] rounded-2xl p-6 card-glow transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl mb-4">
                                    {f.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                                <p className="text-sm text-[#8B949E] leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════ HOW IT WORKS ════════ */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-14"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            How it works
                        </h2>
                        <p className="text-[#8B949E]">Three steps to your dream job</p>
                    </motion.div>
                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                        {/* Connecting line */}
                        <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-px border-t-2 border-dashed border-[#30363D] -translate-y-1/2 z-0" />
                        {howItWorks.map((s, i) => (
                            <motion.div
                                key={s.step}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.2 }}
                                className="relative z-10 flex flex-col items-center text-center"
                            >
                                <div className="w-14 h-14 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-2xl mb-4">
                                    {s.icon}
                                </div>
                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center mb-3 -mt-2">
                                    {s.step}
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-1">{s.title}</h3>
                                <p className="text-sm text-[#8B949E] max-w-[200px]">{s.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════ PRICING ════════ */}
            <section id="pricing" className="py-20 px-4">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-10"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Simple, transparent pricing
                        </h2>
                        <p className="text-[#8B949E] mb-6">Start free. Upgrade when you're ready.</p>

                        {/* Monthly / Yearly Toggle */}
                        <div className="inline-flex items-center gap-3 bg-[#161B22] border border-[#30363D] rounded-full p-1">
                            <button
                                onClick={() => setYearly(false)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${!yearly ? 'bg-blue-600 text-white' : 'text-[#8B949E] hover:text-white'}`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setYearly(true)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${yearly ? 'bg-blue-600 text-white' : 'text-[#8B949E] hover:text-white'}`}
                            >
                                Yearly
                                <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400">-20%</span>
                            </button>
                        </div>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {plans.map((plan, i) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                className={`relative rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 ${plan.highlight
                                    ? 'bg-gradient-to-b from-[#3B82F6]/10 to-[#161B22] border-blue-500/50 shadow-lg shadow-blue-500/10'
                                    : 'bg-[#161B22] border-[#30363D] hover:border-[#3B82F6]/40'
                                    }`}
                            >
                                {plan.badge && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-500 to-emerald-500 text-white text-xs font-semibold rounded-full">
                                        {plan.badge}
                                    </div>
                                )}
                                <h3 className="text-lg font-semibold text-white mb-1">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <motion.span
                                        key={plan.price}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-3xl font-bold text-white"
                                    >
                                        {plan.price}
                                    </motion.span>
                                    {plan.period && (
                                        <span className="text-sm text-[#8B949E]">{plan.period}</span>
                                    )}
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feat, j) => (
                                        <li key={j} className="flex items-center gap-2 text-sm text-[#C9D1D9]">
                                            <Check size={16} className="text-[#10B981] shrink-0" />
                                            {feat}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    to="/signup"
                                    className={`block text-center py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${plan.highlight
                                        ? 'bg-[#3B82F6] text-white hover:bg-[#2563EB] shadow-lg shadow-blue-500/20 btn-shimmer'
                                        : 'border border-[#30363D] text-[#C9D1D9] hover:border-[#8B949E] hover:text-white'
                                        }`}
                                >
                                    {plan.cta}
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
