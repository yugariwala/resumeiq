import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    RefreshCw, ChevronDown, ChevronRight,
    ExternalLink, FileText, Info, Lock
} from 'lucide-react'
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'
import Navbar from '@/components/Navbar'
import { DEMO_RESULT, DEMO_COMPANY_VERDICTS } from '@/data/demoData'

/* ═══════════════ HELPERS (same as ResultsPage) ═══════════════ */
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
    { key: 'keyword_match', label: 'Keyword Match', weight: '30%', tip: 'How well resume keywords match target role requirements.' },
    { key: 'format_structure', label: 'Format & Structure', weight: '25%', tip: 'Clean headers, consistent formatting, ATS-parseable layout.' },
    { key: 'contact_info', label: 'Contact Info', weight: '15%', tip: 'Email, phone, LinkedIn, GitHub, portfolio links.' },
    { key: 'resume_length', label: 'Resume Length', weight: '15%', tip: 'Length appropriate for experience level.' },
    { key: 'consistency', label: 'Consistency', weight: '15%', tip: 'Consistent date formats, bullet styles, tense usage.' },
]

/* ═══════════════════════════════════════ PAGE ═══════════════════════════════════════ */

export default function DemoPage() {
    const data = DEMO_RESULT
    const r = data.results
    const companies = data.target_companies
    const verdicts = DEMO_COMPANY_VERDICTS

    /* ═══ State ═══ */
    const [activeCompany, setActiveCompany] = useState(companies[0])
    const [animatedScore, setAnimatedScore] = useState(0)
    const [barsVisible, setBarsVisible] = useState(false)
    const [skillTab, setSkillTab] = useState<'found' | 'gaps'>('found')
    const [jdExpanded, setJdExpanded] = useState(false)
    const [hoveredTip, setHoveredTip] = useState<number | null>(null)
    const [hoveredHighlight, setHoveredHighlight] = useState<number | null>(null)
    const [milestones, setMilestones] = useState<boolean[]>(r.learning_plan.map(() => false))

    /* ═══ Animation: ATS score ═══ */
    useEffect(() => {
        let frame: number
        const start = performance.now()
        const duration = 1500
        const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setAnimatedScore(Math.round(r.ats_score * eased))
            if (progress < 1) frame = requestAnimationFrame(animate)
        }
        frame = requestAnimationFrame(animate)
        setTimeout(() => setBarsVisible(true), 400)
        return () => cancelAnimationFrame(frame)
    }, [r.ats_score])

    const toggleMilestone = (i: number) => {
        const next = [...milestones]; next[i] = !next[i]; setMilestones(next)
    }

    const verdict = verdicts[activeCompany] || { verdict: 'not_selected', confidence: 71, role: data.target_role }
    const isSelected = verdict.verdict === 'selected'

    /* ═══ Highlight rendering ═══ */
    const highlightCounts = { green: 0, yellow: 0, red: 0 }
    r.highlight_map.forEach((h: any) => { highlightCounts[h.color as HighlightColor]++ })

    const renderHighlightedText = () => {
        const text = r.raw_text
        const segments: { text: string; highlight?: any; index?: number }[] = []
        let lastIdx = 0
        const sortedHighlights = [...r.highlight_map].sort((a: any, b: any) => {
            const idxA = text.indexOf(a.text)
            const idxB = text.indexOf(b.text)
            return idxA - idxB
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
                <span
                    key={i}
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
        <div className="min-h-screen bg-[#0D1117] pb-24">
            <Navbar />

            {/* ════════ DEMO BANNER ════════ */}
            <div className="fixed top-16 left-0 right-0 z-40 bg-gradient-to-r from-[#1C2333] to-[#161B22] border-b border-[#3B82F6]/30 py-2.5 px-4">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-sm text-[#C9D1D9] text-center sm:text-left">
                        📊 This is a <span className="font-semibold text-white">sample analysis</span> — Rahul Sharma's resume results
                    </p>
                    <Link
                        to="/upload"
                        className="shrink-0 px-4 py-1.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-semibold rounded-lg transition-all shadow shadow-blue-500/30"
                    >
                        Analyse your real resume for free →
                    </Link>
                </div>
            </div>

            {/* ════════ SECTION 1: VERDICT BANNER ════════ */}
            <section className="pt-32">
                {companies.length > 1 && (
                    <div className="max-w-7xl mx-auto px-4 pt-4 flex gap-2">
                        {companies.map((c: string) => (
                            <button
                                key={c}
                                onClick={() => setActiveCompany(c)}
                                className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${activeCompany === c
                                    ? 'bg-[#161B22] text-white border border-b-0 border-[#30363D]'
                                    : 'text-[#8B949E] hover:text-white'
                                    }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                )}

                <div
                    className={`mx-4 lg:mx-auto max-w-7xl rounded-2xl p-8 transition-all duration-500 ${isSelected
                        ? 'bg-gradient-to-br from-[#064E3B] to-[#065F46]'
                        : 'bg-gradient-to-br from-[#7F1D1D] to-[#991B1B]'
                        }`}
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
                                    ? `Rahul's profile matches ${activeCompany}'s requirements for ${verdict.role}.`
                                    : `Here's exactly what's holding Rahul back — and the exact plan to fix it.`
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════ MAIN GRID ════════ */}
            <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* ═══ LEFT COLUMN (2/5) ═══ */}
                <div className="lg:col-span-2 space-y-6">

                    {/* ATS SCORE CARD */}
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
                                const val = (r.ats_breakdown as any)[sub.key] || 0
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

                    {/* SKILL ANALYSIS */}
                    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6">
                        <div className="flex bg-[#0D1117] rounded-lg p-1 mb-5">
                            {(['found', 'gaps'] as const).map((tab) => (
                                <button key={tab} onClick={() => setSkillTab(tab)}
                                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${skillTab === tab ? 'bg-[#161B22] text-white shadow' : 'text-[#8B949E] hover:text-white'}`}
                                >
                                    {tab === 'found' ? `Skills Found (${r.skills_found.length})` : `Skill Gaps (${r.skills_missing.length})`}
                                </button>
                            ))}
                        </div>
                        {skillTab === 'found' ? (
                            <div className="flex flex-wrap gap-2">
                                {r.skills_found.map((s: any, i: number) => (
                                    <span key={i}
                                        className="group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#0D1117] text-white border border-[#30363D] hover:-translate-y-0.5 transition-all"
                                    >
                                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: profColor[s.proficiency] || '#8B949E' }} />
                                        {s.name}
                                        <span className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#1C2333] border border-[#30363D] rounded text-[10px] text-[#8B949E] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            {s.proficiency}
                                        </span>
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {r.skills_missing.map((s: any, i: number) => (
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

                {/* ═══ RIGHT COLUMN (3/5) ═══ */}
                <div className="lg:col-span-3 space-y-6">

                    {/* RESUME HIGHLIGHT VIEWER */}
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

            {/* ════════ IMPROVEMENT PLAN ════════ */}
            <div className="max-w-7xl mx-auto px-4 mt-8">
                <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 sm:p-8">
                    {r.category === 'A' ? (
                        <>
                            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">💡 Your Skills Are Strong — Your Resume Isn't Presenting Them</h2>
                            <p className="text-[#8B949E] text-sm mb-8">These specific changes will boost your ATS score and recruiter impression</p>
                            <div className="space-y-5">
                                {r.improvement_tips.map((tip: any, i: number) => {
                                    const imp = impactLabel[tip.impact] || impactLabel.medium
                                    return (
                                        <div key={i} className="rounded-xl border border-[#30363D] hover:border-[#3B82F6]/30 transition-all">
                                            <div className="p-5">
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
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    ) : (
                        /* Category B — Learning Roadmap */
                        <>
                            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">🗺️ Rahul's Personalised Roadmap to Get Selected at {activeCompany}</h2>
                            <p className="text-[#8B949E] text-sm mb-6">Close skill gaps in {r.learning_plan.length * 2} weeks with this structured plan</p>
                            <div className="mb-6">
                                <div className="flex items-center justify-between text-xs text-[#8B949E] mb-2">
                                    <span>{milestones.filter(Boolean).length} of {milestones.length} milestones complete</span>
                                    <span>{Math.round((milestones.filter(Boolean).length / milestones.length) * 100)}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-[#1C2333]">
                                    <div className="h-full rounded-full bg-[#3B82F6] transition-all duration-500"
                                        style={{ width: `${(milestones.filter(Boolean).length / milestones.length) * 100}%` }} />
                                </div>
                            </div>
                            <div className="overflow-x-auto -mx-2 px-2 pb-4">
                                <div className="flex gap-4" style={{ minWidth: `${r.learning_plan.length * 280}px` }}>
                                    {r.learning_plan.map((m: any, i: number) => {
                                        const priColor = impColor[m.priority] || impColor.medium
                                        return (
                                            <div key={i}
                                                className={`shrink-0 w-[260px] rounded-xl border p-5 transition-all ${milestones[i] ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-[#30363D] bg-[#0D1117]'}`}
                                            >
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
                                                <button onClick={() => toggleMilestone(i)}
                                                    className={`mt-3 w-full py-2 rounded-lg text-xs font-semibold transition-all ${milestones[i]
                                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                        : 'bg-[#161B22] text-[#8B949E] border border-[#30363D] hover:text-white hover:border-[#8B949E]'}`}
                                                >
                                                    {milestones[i] ? '✅ Completed' : 'Mark as Complete'}
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* ════════ JD MATCHER (collapsed by default) ════════ */}
            <div className="max-w-7xl mx-auto px-4 mt-8">
                <div className="bg-[#161B22] border border-[#30363D] rounded-2xl overflow-hidden">
                    <button onClick={() => setJdExpanded(!jdExpanded)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-[#1C2333] transition-colors"
                    >
                        <span className="text-lg font-semibold text-white">📋 Match Your Resume to a Specific Job Description</span>
                        {jdExpanded ? <ChevronDown size={20} className="text-[#8B949E]" /> : <ChevronRight size={20} className="text-[#8B949E]" />}
                    </button>
                    {jdExpanded && (
                        <div className="px-6 pb-6">
                            <div className="flex items-center gap-3 p-4 bg-[#3B82F6]/10 border border-[#3B82F6]/20 rounded-xl">
                                <Lock size={16} className="text-[#3B82F6] shrink-0" />
                                <p className="text-sm text-[#C9D1D9]">JD matching is available when you analyse your own resume. <Link to="/upload" className="text-[#3B82F6] hover:underline font-medium">Analyse yours free →</Link></p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ════════ STICKY ACTION BAR ════════ */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#161B22]/90 backdrop-blur-xl border-t border-[#30363D]">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-3 flex-wrap">
                    {/* Demo mode: no PDF download */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#1C2333] text-[#8B949E] text-sm font-medium rounded-lg border border-[#30363D] cursor-not-allowed">
                        <Lock size={14} />
                        <span>Upgrade to get PDF export</span>
                    </div>
                    <Link
                        to="/upload"
                        className="flex items-center gap-2 px-5 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-blue-500/20"
                    >
                        Analyse My Resume Free →
                    </Link>
                    <Link
                        to="/upload"
                        className="flex items-center gap-2 px-4 py-2 border border-[#30363D] text-[#C9D1D9] text-sm font-medium rounded-lg hover:border-[#8B949E] hover:text-white transition-all"
                    >
                        <RefreshCw size={16} /> Try Your Resume
                    </Link>
                </div>
            </div>
        </div>
    )
}
