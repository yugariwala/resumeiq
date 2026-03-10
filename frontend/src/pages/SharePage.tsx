import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
    ChevronDown, ChevronRight, ExternalLink, FileText, Info
} from 'lucide-react'
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'
import Navbar from '@/components/Navbar'
import { MOCK_RESULT, MOCK_COMPANY_VERDICTS } from '@/data/mockResults'

/* ═══════════════ HELPERS ═══════════════ */
type HighlightColor = 'green' | 'yellow' | 'red'

const scoreColor = (s: number) =>
    s < 40 ? '#EF4444' : s < 66 ? '#F59E0B' : s < 86 ? '#10B981' : '#3B82F6'

const scoreGrade = (s: number) =>
    s < 40 ? 'Poor 🔴' : s < 66 ? 'Fair 🟡' : s < 86 ? 'Good 🟢' : 'Excellent 💎'

const profColor: Record<string, string> = {
    expert: '#10B981', advanced: '#3B82F6', intermediate: '#F59E0B', beginner: '#8B949E',
}
const impColor: Record<string, { bg: string; text: string }> = {
    critical: { bg: 'bg-red-500/20', text: 'text-red-400' },
    high: { bg: 'bg-orange-500/20', text: 'text-orange-400' },
    medium: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
}
const impactLabel: Record<string, { bg: string; text: string; label: string }> = {
    high: { bg: 'bg-orange-500/20', text: 'text-orange-400', label: 'HIGH IMPACT' },
    medium: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'MEDIUM' },
    quick_win: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'QUICK WIN' },
}
const highlightBg: Record<HighlightColor, string> = {
    green: 'bg-emerald-500/15 border-b-2 border-emerald-500/50',
    yellow: 'bg-yellow-500/15 border-b-2 border-yellow-500/50',
    red: 'bg-red-500/15 border-b-2 border-red-500/50',
}

const SUB_SCORES = [
    { key: 'keyword_match', label: 'Keyword Match', weight: '30%', tip: 'How well your resume keywords match the target role requirements.' },
    { key: 'format_structure', label: 'Format & Structure', weight: '25%', tip: 'Clean headers, consistent formatting, ATS-parseable layout.' },
    { key: 'contact_info', label: 'Contact Info', weight: '15%', tip: 'Email, phone, LinkedIn, GitHub, and portfolio links.' },
    { key: 'resume_length', label: 'Resume Length', weight: '15%', tip: 'Length appropriate for experience level.' },
    { key: 'consistency', label: 'Consistency', weight: '15%', tip: 'Consistent date formats, bullet styles, tense.' },
]

/* ═══════════════════════════════════════ PAGE ═══════════════════════════════════════ */

export default function SharePage() {
    const { token } = useParams<{ token: string }>()

    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [activeCompany, setActiveCompany] = useState('')
    const [animatedScore, setAnimatedScore] = useState(0)
    const [barsVisible, setBarsVisible] = useState(false)
    const [skillTab, setSkillTab] = useState<'found' | 'gaps'>('found')
    const [jdExpanded, setJdExpanded] = useState(false)
    const [hoveredTip, setHoveredTip] = useState<number | null>(null)
    const [hoveredHighlight, setHoveredHighlight] = useState<number | null>(null)

    /* ─── Fetch by token ─── */
    useEffect(() => {
        const fetchByToken = async () => {
            setLoading(true)

            // Dev fallback — match token against mock data
            if (token === MOCK_RESULT.share_token) {
                const result = MOCK_RESULT
                setData(result)
                setActiveCompany(result.target_companies[0])
                setLoading(false)
                return
            }

            // In production: query Supabase for public RLS-accessible record
            try {
                const { supabase } = await import('@/lib/supabase')
                const { data: rows, error } = await supabase
                    .from('analyses')
                    .select('*, analysis_results(*)')
                    .eq('share_token', token)
                    .maybeSingle()

                if (error || !rows) {
                    setNotFound(true)
                } else {
                    setData(rows)
                    setActiveCompany(rows.target_companies?.[0] || '')
                }
            } catch {
                setNotFound(true)
            }
            setLoading(false)
        }

        fetchByToken()
    }, [token])

    /* ─── SEO: set page title + og meta ─── */
    useEffect(() => {
        if (!data) return
        const role = data.target_role || 'Software Engineer'
        const company = data.target_companies?.[0] || 'Top Company'
        document.title = `Resume Analysis — ${role} at ${company} | ResumeIQ`

        // og:description
        let metaDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement
        if (!metaDesc) {
            metaDesc = document.createElement('meta')
            metaDesc.setAttribute('property', 'og:description')
            document.head.appendChild(metaDesc)
        }
        metaDesc.content = `AI-powered resume analysis for ${role} at ${company}. ATS Score, Skills Gap, and Personalised Improvement Plan — powered by ResumeIQ.`
    }, [data])

    /* ─── ATS animation ─── */
    useEffect(() => {
        if (!data) return
        const score = data.results?.ats_score ?? 0
        let frame: number
        const start = performance.now()
        const duration = 1500
        const animate = (now: number) => {
            const p = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - p, 3)
            setAnimatedScore(Math.round(score * eased))
            if (p < 1) frame = requestAnimationFrame(animate)
        }
        frame = requestAnimationFrame(animate)
        setTimeout(() => setBarsVisible(true), 400)
        return () => cancelAnimationFrame(frame)
    }, [data])

    /* ─── Loading ─── */
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
                <Navbar />
                <div className="text-center mt-20">
                    <div className="w-12 h-12 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[#8B949E] text-sm">Loading analysis…</p>
                </div>
            </div>
        )
    }

    /* ─── 404 ─── */
    if (notFound || !data) {
        return (
            <div className="min-h-screen bg-[#0D1117] flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center px-4">
                    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-10 max-w-md w-full text-center">
                        <div className="text-6xl mb-6">🔗</div>
                        <h1 className="text-2xl font-bold text-white mb-3">Link Not Found</h1>
                        <p className="text-[#8B949E] text-sm mb-8">
                            This analysis link has expired or doesn't exist. Links are valid for 30 days after creation.
                        </p>
                        <Link
                            to="/upload"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20"
                        >
                            Analyse My Resume Free →
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const r = data.results
    const companies: string[] = data.target_companies || []
    // Derive verdicts from results or fall back to mock
    const verdicts: Record<string, { verdict: string; confidence: number; role: string }> =
        MOCK_COMPANY_VERDICTS // In production this would come from the fetched data

    const verdict = verdicts[activeCompany] || { verdict: r.selection_verdict, confidence: r.selection_confidence, role: data.target_role }
    const isSelected = verdict.verdict === 'selected'

    /* ─── Highlight rendering ─── */
    const highlightCounts = { green: 0, yellow: 0, red: 0 }
    r.highlight_map?.forEach((h: any) => { highlightCounts[h.color as HighlightColor]++ })

    const renderHighlightedText = () => {
        if (!r.raw_text) return null
        const text = r.raw_text
        const segments: { text: string; highlight?: any; index?: number }[] = []
        let lastIdx = 0
        const sortedHighlights = [...(r.highlight_map || [])].sort((a: any, b: any) => {
            return text.indexOf(a.text) - text.indexOf(b.text)
        })
        sortedHighlights.forEach((h: any, i: number) => {
            const idx = text.indexOf(h.text, lastIdx)
            if (idx === -1) return
            if (idx > lastIdx) segments.push({ text: text.slice(lastIdx, idx) })
            segments.push({ text: h.text, highlight: h, index: i })
            lastIdx = idx + h.text.length
        })
        if (lastIdx < text.length) segments.push({ text: text.slice(lastIdx) })
        return segments.map((seg, i) => {
            if (!seg.highlight) return <span key={i}>{seg.text}</span>
            return (
                <span key={i}
                    className={`relative inline cursor-pointer px-0.5 rounded-sm transition-all ${highlightBg[seg.highlight.color as HighlightColor]}`}
                    onMouseEnter={() => setHoveredHighlight(seg.index!)}
                    onMouseLeave={() => setHoveredHighlight(null)}
                >
                    {seg.text}
                    {hoveredHighlight === seg.index && (
                        <span className="absolute z-30 bottom-full left-0 mb-2 w-72 p-3 bg-[#1C2333] border border-[#30363D] rounded-lg shadow-xl text-xs text-[#C9D1D9] leading-relaxed pointer-events-none">
                            {seg.highlight.tooltip}
                        </span>
                    )}
                </span>
            )
        })
    }

    const chartData = [
        { name: 'score', value: animatedScore, fill: scoreColor(r.ats_score) },
        { name: 'bg', value: 100, fill: '#161B22' },
    ]

    return (
        <div className="min-h-screen bg-[#0D1117] pb-32">
            <Navbar />

            {/* ════ SHARED BANNER ════ */}
            <div className="fixed top-16 left-0 right-0 z-40 bg-[#161B22]/95 border-b border-[#30363D] py-2.5 px-4 backdrop-blur-md">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-sm text-[#8B949E]">
                        👁️ You are viewing a <span className="text-white font-medium">shared analysis</span> — read-only mode
                    </p>
                    <Link to="/upload"
                        className="shrink-0 px-4 py-1.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-semibold rounded-lg transition-all">
                        Analyse My Resume Free →
                    </Link>
                </div>
            </div>

            {/* ════ VERDICT BANNER ════ */}
            <section className="pt-32">
                {companies.length > 1 && (
                    <div className="max-w-7xl mx-auto px-4 pt-4 flex gap-2">
                        {companies.map((c: string) => (
                            <button key={c} onClick={() => setActiveCompany(c)}
                                className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${activeCompany === c
                                    ? 'bg-[#161B22] text-white border border-b-0 border-[#30363D]'
                                    : 'text-[#8B949E] hover:text-white'}`}
                            >{c}</button>
                        ))}
                    </div>
                )}
                <div className={`mx-4 lg:mx-auto max-w-7xl rounded-2xl p-8 transition-all duration-500 ${isSelected
                    ? 'bg-gradient-to-br from-[#064E3B] to-[#065F46]'
                    : 'bg-gradient-to-br from-[#7F1D1D] to-[#991B1B]'}`}
                >
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="text-5xl">{isSelected ? '✅' : '❌'}</div>
                        <div className="text-center sm:text-left">
                            <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                                    {isSelected ? 'LIKELY SELECTED' : 'NOT SELECTED — YET'}
                                </h1>
                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${isSelected ? 'bg-emerald-500/30 text-emerald-300' : 'bg-red-500/30 text-red-300'}`}>
                                    {verdict.confidence}% Confidence
                                </span>
                            </div>
                            <p className="mt-2 text-white/70 text-sm sm:text-base">
                                {isSelected
                                    ? `This candidate's profile matches ${activeCompany}'s requirements.`
                                    : `Here's what's holding this candidate back — and the plan to fix it.`}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ════ MAIN GRID ════ */}
            <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* LEFT (2/5) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* ATS Score Card */}
                    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6">
                        <div className="text-center mb-2">
                            <span className="text-sm font-semibold" style={{ color: scoreColor(r.ats_score) }}>
                                {scoreGrade(r.ats_score)}
                            </span>
                        </div>
                        <div className="relative h-40 -mb-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart cx="50%" cy="100%" innerRadius="70%" outerRadius="100%" startAngle={180} endAngle={0} data={chartData} barSize={14}>
                                    <RadialBar dataKey="value" cornerRadius={8} background={{ fill: '#1C2333' }} />
                                </RadialBarChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                                <span className="text-5xl font-extrabold text-white tabular-nums">{animatedScore}</span>
                                <span className="text-xs text-[#8B949E] mt-1">ATS Score</span>
                            </div>
                        </div>
                        <div className="mt-8 space-y-3">
                            {SUB_SCORES.map((sub, i) => {
                                const val = (r.ats_breakdown as any)?.[sub.key] || 0
                                return (
                                    <div key={sub.key} className="group relative"
                                        onMouseEnter={() => setHoveredTip(i)}
                                        onMouseLeave={() => setHoveredTip(null)}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-[#C9D1D9] flex items-center gap-1">
                                                {sub.label}
                                                <Info size={12} className="text-[#8B949E] opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </span>
                                            <span className="text-xs font-bold tabular-nums" style={{ color: scoreColor(val) }}>{val}%</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-[#1C2333] overflow-hidden">
                                            <div className="h-full rounded-full transition-all ease-out"
                                                style={{ width: barsVisible ? `${val}%` : '0%', backgroundColor: scoreColor(val), transitionDuration: '0.8s', transitionDelay: `${i * 0.1}s` }}
                                            />
                                        </div>
                                        {hoveredTip === i && (
                                            <div className="absolute z-20 left-0 top-full mt-1 w-64 p-3 bg-[#1C2333] border border-[#30363D] rounded-lg shadow-xl text-xs text-[#C9D1D9] leading-relaxed">
                                                <span className="text-[#8B949E]">{sub.weight} weight — </span>{sub.tip}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Skill Analysis */}
                    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6">
                        <div className="flex bg-[#0D1117] rounded-lg p-1 mb-5">
                            {(['found', 'gaps'] as const).map((tab) => (
                                <button key={tab} onClick={() => setSkillTab(tab)}
                                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${skillTab === tab ? 'bg-[#161B22] text-white shadow' : 'text-[#8B949E] hover:text-white'}`}
                                >
                                    {tab === 'found' ? `Skills Found (${r.skills_found?.length || 0})` : `Skill Gaps (${r.skills_missing?.length || 0})`}
                                </button>
                            ))}
                        </div>
                        {skillTab === 'found' ? (
                            <div className="flex flex-wrap gap-2">
                                {(r.skills_found || []).map((s: any, i: number) => (
                                    <span key={i} className="group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#0D1117] text-white border border-[#30363D] hover:-translate-y-0.5 transition-all">
                                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: profColor[s.proficiency] || '#8B949E' }} />
                                        {s.name}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {(r.skills_missing || []).map((s: any, i: number) => (
                                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[#0D1117] border border-[#30363D]">
                                        <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${impColor[s.importance]?.bg} ${impColor[s.importance]?.text}`}>{s.importance}</span>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-white">{s.name}</p>
                                            <p className="text-xs text-[#8B949E] mt-0.5">{s.reason}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT (3/5) */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Resume Highlights</h3>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#C9D1D9] border border-[#30363D] rounded-lg hover:border-[#8B949E] transition-all">
                                <FileText size={14} /> View Original PDF
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-4 mb-4 p-3 bg-[#0D1117] rounded-lg">
                            <span className="text-xs text-[#10B981]">🟢 Strong ({highlightCounts.green})</span>
                            <span className="text-xs text-[#F59E0B]">🟡 Improvable ({highlightCounts.yellow})</span>
                            <span className="text-xs text-[#EF4444]">🔴 Weak ({highlightCounts.red})</span>
                        </div>
                        <div className="bg-[#0D1117] rounded-xl p-5 max-h-[600px] overflow-y-auto text-sm text-[#C9D1D9] leading-relaxed whitespace-pre-wrap font-mono">
                            {renderHighlightedText()}
                        </div>
                    </div>
                </div>
            </div>

            {/* ════ IMPROVEMENT PLAN ════ */}
            <div className="max-w-7xl mx-auto px-4 mt-8">
                <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 sm:p-8">
                    {r.category === 'A' ? (
                        <>
                            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">💡 Skills Are Strong — Resume Needs Polish</h2>
                            <p className="text-[#8B949E] text-sm mb-8">These changes will boost the ATS score and recruiter impression</p>
                            <div className="space-y-5">
                                {(r.improvement_tips || []).map((tip: any, i: number) => {
                                    const imp = impactLabel[tip.impact] || impactLabel.medium
                                    return (
                                        <div key={i} className="rounded-xl border border-[#30363D] p-5">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${imp.bg} ${imp.text}`}>{imp.label}</span>
                                                <h4 className="text-sm font-semibold text-white">{tip.title}</h4>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="rounded-lg bg-red-500/5 border border-red-500/20 p-3">
                                                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Current</span>
                                                    <p className="text-xs text-[#C9D1D9] mt-1.5 leading-relaxed">{tip.current_text}</p>
                                                </div>
                                                <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3">
                                                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Improved</span>
                                                    <p className="text-xs text-[#C9D1D9] mt-1.5 leading-relaxed">{tip.improved_text}</p>
                                                </div>
                                            </div>
                                            <p className="text-xs text-[#8B949E] mt-3">{tip.explanation}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">🗺️ Personalised Roadmap to Get Selected at {activeCompany}</h2>
                            <p className="text-[#8B949E] text-sm mb-6">A structured plan to close skill gaps</p>
                            <div className="overflow-x-auto -mx-2 px-2 pb-4">
                                <div className="flex gap-4" style={{ minWidth: `${(r.learning_plan || []).length * 280}px` }}>
                                    {(r.learning_plan || []).map((m: any, i: number) => {
                                        const priColor = impColor[m.priority] || impColor.medium
                                        return (
                                            <div key={i} className="shrink-0 w-[260px] rounded-xl border border-[#30363D] bg-[#0D1117] p-5">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-xs font-bold text-[#3B82F6]">{m.week}</span>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${priColor.bg} ${priColor.text}`}>{m.priority}</span>
                                                </div>
                                                <h4 className="text-base font-bold text-white mb-2">{m.skill}</h4>
                                                <p className="text-xs text-[#8B949E] mb-3">{m.why}</p>
                                                <a href={m.resource} target="_blank" rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs text-[#3B82F6] hover:underline mb-2">
                                                    Learning resource <ExternalLink size={10} />
                                                </a>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-[10px] text-[#8B949E] bg-[#161B22] px-2 py-0.5 rounded">~{m.hours} hours</span>
                                                </div>
                                                <p className="text-xs text-[#C9D1D9] italic mt-2">Build: {m.project}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* ════ JD MATCHER (collapsed) ════ */}
            <div className="max-w-7xl mx-auto px-4 mt-8">
                <div className="bg-[#161B22] border border-[#30363D] rounded-2xl overflow-hidden">
                    <button onClick={() => setJdExpanded(!jdExpanded)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-[#1C2333] transition-colors"
                    >
                        <span className="text-lg font-semibold text-white">📋 Job Description Match</span>
                        {jdExpanded ? <ChevronDown size={20} className="text-[#8B949E]" /> : <ChevronRight size={20} className="text-[#8B949E]" />}
                    </button>
                    {jdExpanded && (
                        <div className="px-6 pb-6">
                            <p className="text-sm text-[#8B949E]">Sign in and analyse your own resume to use the JD matcher tool. <Link to="/upload" className="text-[#3B82F6] hover:underline">Analyse free →</Link></p>
                        </div>
                    )}
                </div>
            </div>

            {/* ════ STICKY BOTTOM BAR ════ */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#161B22]/90 backdrop-blur-xl border-t border-[#30363D]">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-3 flex-wrap">
                    <Link to="/upload"
                        className="flex items-center gap-2 px-5 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-blue-500/20">
                        Analyse My Resume Free →
                    </Link>
                </div>

                {/* Watermark footer */}
                <div className="border-t border-[#30363D]/50 py-2 text-center">
                    <p className="text-xs text-[#8B949E]">
                        Analysed by <Link to="/" className="text-[#3B82F6] hover:underline">ResumeIQ.ai</Link> — <Link to="/upload" className="text-[#3B82F6] hover:underline">Get your free resume analysis →</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
