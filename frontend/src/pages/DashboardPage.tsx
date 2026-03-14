import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    TrendingUp, TrendingDown, PlusCircle, ChevronLeft, ChevronRight,
    BarChart2, Award, Clock, ArrowRight, Upload
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'

/* ═══════════════ TYPES ═══════════════ */
interface AnalysisRow {
    id: string
    created_at: string
    status: 'processing' | 'complete' | 'failed'
    resume_name: string
    target_company: string
    target_role: string
    ats_score: number
    verdict: 'selected' | 'not_selected' | 'unknown'
}

/* ═══════════════ HELPERS ═══════════════ */
const scoreColor = (s: number) =>
    s < 40 ? '#EF4444' : s < 66 ? '#F59E0B' : s < 86 ? '#10B981' : '#3B82F6'

const scoreBg = (s: number) =>
    s < 40 ? 'bg-red-500/20 text-red-400' : s < 66 ? 'bg-yellow-500/20 text-yellow-400' : s < 86 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

const ROWS_PER_PAGE = 10

/* ═══════════════ PAGE ═══════════════ */
export default function DashboardPage() {
    const navigate = useNavigate()
    const [page, setPage] = useState(1)

    /* ─── Auth user ─── */
    const [user, setUser] = useState<any>(null)
    useEffect(() => {
        supabase.auth.getUser().then(({ data }: any) => setUser(data.user))
    }, [])

    /* ─── Analyses data ─── */
    const [analyses, setAnalyses] = useState<AnalysisRow[]>([])
    const [statsLoading, setStatsLoading] = useState(true)

    const fetchAnalyses = useCallback(async () => {
        if (!user) return
        try {
            const { data: { session } } = await supabase.auth.getSession()
            const res = await fetch('/api/analyses', {
                headers: {
                    ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {}),
                },
            })
            if (res.ok) {
                const result = await res.json()
                setAnalyses(result.analyses || [])
            }
        } catch (err) {
            console.error('Failed to fetch analyses:', err)
        } finally {
            setStatsLoading(false)
        }
    }, [user])

    useEffect(() => {
        fetchAnalyses()
    }, [fetchAnalyses])

    /* ─── User display info ─── */
    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there'
    const userPlan: 'free' | 'pro' = user?.user_metadata?.plan || 'free'
    const monthlyUsed = analyses.filter(a => {
        const d = new Date(a.created_at)
        const now = new Date()
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length
    const monthlyLimit = userPlan === 'pro' ? 999 : 2

    /* ─── Stats computation ─── */
    const totalAnalyses = analyses.length
    const bestATS = analyses.length ? Math.max(...analyses.map(a => a.ats_score ?? 0)) : 0
    const latestScore = analyses.length ? (analyses[0]?.ats_score ?? 0) : 0
    const prevScore = analyses.length > 1 ? (analyses[1]?.ats_score ?? latestScore) : latestScore
    const scoreDelta = latestScore - prevScore

    /* ─── Pagination ─── */
    const totalPages = Math.max(Math.ceil(analyses.length / ROWS_PER_PAGE), 1)
    const pageRows = analyses.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)

    /* ─── Score counter animation ─── */
    const [animBest, setAnimBest] = useState(0)
    const [animLatest, setAnimLatest] = useState(0)
    useEffect(() => {
        if (statsLoading) return
        const duration = 1200
        const start = performance.now()
        const animate = (now: number) => {
            const p = Math.min((now - start) / duration, 1)
            const ease = 1 - Math.pow(1 - p, 3)
            setAnimBest(Math.round(bestATS * ease))
            setAnimLatest(Math.round(latestScore * ease))
            if (p < 1) requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)
    }, [bestATS, latestScore, statsLoading])

    const planPercent = Math.round((monthlyUsed / Math.max(monthlyLimit, 1)) * 100)

    return (
        <div className="min-h-screen bg-[#020408]">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">

                {/* ════ HEADER ROW ════ */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                                Welcome back, {userName} 👋
                            </h1>
                            <p className="text-[#8B949E] text-sm mt-1">Here's your resume analysis overview</p>
                        </div>
                        <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${userPlan === 'pro'
                            ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30'
                            : 'bg-[#161B22] text-[#8B949E] border border-[#30363D]'
                            }`}>
                            {userPlan === 'pro' ? '⭐ Pro' : 'Free'}
                        </span>
                    </div>
                    <button
                        onClick={() => navigate('/upload')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 btn-shimmer"
                    >
                        <PlusCircle size={16} /> New Analysis →
                    </button>
                </div>

                {/* ════ STATS ROW ════ */}
                {statsLoading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 animate-pulse">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#30363D]" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 bg-[#30363D] rounded w-20" />
                                        <div className="h-6 bg-[#30363D] rounded w-12" />
                                        <div className="h-3 bg-[#30363D] rounded w-16" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {/* Total Analyses */}
                        <StatCard
                            icon={<BarChart2 size={20} className="text-[#3B82F6]" />}
                            label="Total Analyses"
                            value={totalAnalyses.toString()}
                            sub="all time"
                            accent="#3B82F6"
                        />
                        {/* Best ATS Score */}
                        <StatCard
                            icon={<Award size={20} className="text-[#10B981]" />}
                            label="Best ATS Score"
                            value={animBest.toString()}
                            sub="your highest"
                            accent="#10B981"
                        />
                        {/* Latest Score */}
                        <StatCard
                            icon={<Clock size={20} className="text-[#F59E0B]" />}
                            label="Latest Score"
                            value={animLatest.toString()}
                            sub="most recent"
                            accent="#F59E0B"
                        />
                        {/* Score Change */}
                        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 flex items-center gap-4 hover:border-[#8B949E]/40 transition-all hover:-translate-y-0.5 card-glow">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                style={{ backgroundColor: (scoreDelta >= 0 ? '#10B981' : '#EF4444') + '22' }}
                            >
                                {scoreDelta >= 0
                                    ? <TrendingUp size={20} className="text-emerald-400" />
                                    : <TrendingDown size={20} className="text-red-400" />
                                }
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-[#8B949E] mb-1">Score Change</p>
                                <p className={`text-2xl font-extrabold tabular-nums ${scoreDelta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {scoreDelta >= 0 ? '+' : ''}{scoreDelta}
                                </p>
                                <p className="text-xs text-[#8B949E] truncate">vs previous</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ════ FREE PLAN METER ════ */}
                {userPlan === 'free' && (
                    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-[#C9D1D9]">
                                        {monthlyUsed} of {monthlyLimit} monthly analyses used
                                    </span>
                                    <span className="text-sm font-bold text-red-400">{planPercent}%</span>
                                </div>
                                <div className="h-2.5 rounded-full bg-[#0D1117] overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-red-500 transition-all duration-700"
                                        style={{ width: `${planPercent}%` }}
                                    />
                                </div>
                                {monthlyUsed >= monthlyLimit && (
                                    <p className="text-xs text-red-400 mt-1.5">⚠️ Monthly limit reached</p>
                                )}
                            </div>
                            <Link
                                to="/signup"
                                className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-blue-500/20"
                            >
                                Upgrade to Pro for unlimited → <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                )}

                {/* ════ HISTORY TABLE ════ */}
                <div className="bg-[#161B22] border border-[#30363D] rounded-2xl overflow-hidden card-glow transition-all duration-300">
                    <div className="p-6 border-b border-[#30363D] flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white">Analysis History</h2>
                        <span className="text-xs text-[#8B949E]">{analyses.length} total</span>
                    </div>

                    {analyses.length === 0 ? (
                        /* Empty state */
                        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                            <div className="w-20 h-20 rounded-full bg-[#0D1117] flex items-center justify-center mb-6">
                                <Upload size={32} className="text-[#30363D]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No analyses yet</h3>
                            <p className="text-[#8B949E] text-sm mb-6 max-w-xs">
                                Upload your resume to get your first AI-powered ATS analysis and personalised improvement plan.
                            </p>
                            <Link
                                to="/upload"
                                className="flex items-center gap-2 px-6 py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20"
                            >
                                <Upload size={16} /> Upload your first resume to get started →
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-[#30363D]">
                                            {['Date', 'Resume', 'Company', 'Role', 'ATS Score', 'Verdict', 'Action'].map(h => (
                                                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#8B949E] uppercase tracking-wider whitespace-nowrap">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pageRows.map((row, i) => (
                                            <tr
                                                key={row.id}
                                                className={`border-b border-[#30363D]/50 hover:bg-[#1C2333] transition-colors ${i % 2 === 0 ? '' : 'bg-[#0D1117]/30'}`}
                                            >
                                                <td className="px-4 py-4 text-sm text-[#8B949E] whitespace-nowrap">
                                                    {formatDate(row.created_at)}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className="text-sm text-[#C9D1D9] truncate max-w-[160px] block" title={row.resume_name}>
                                                        {row.resume_name}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-sm font-medium text-white whitespace-nowrap">
                                                    {row.target_company}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-[#C9D1D9] whitespace-nowrap">
                                                    {row.target_role}
                                                </td>
                                                <td className="px-4 py-4">
                                                    {row.status === 'processing' ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/25">
                                                            <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                                            Analysing…
                                                        </span>
                                                    ) : row.status === 'failed' ? (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/25">
                                                            ❌ Failed
                                                        </span>
                                                    ) : (
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold tabular-nums ${scoreBg(row.ats_score)}`}
                                                            style={{ border: `1px solid ${scoreColor(row.ats_score)}33` }}>
                                                            {row.ats_score}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4">
                                                    {row.status === 'processing' ? (
                                                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/25">
                                                            ⏳ Pending
                                                        </span>
                                                    ) : row.status === 'failed' ? (
                                                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/25">
                                                            —
                                                        </span>
                                                    ) : (
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${row.verdict === 'selected'
                                                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                                                            : 'bg-red-500/15 text-red-400 border border-red-500/25'
                                                            }`}>
                                                            {row.verdict === 'selected' ? '✅ Selected' : '❌ Not Selected'}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4">
                                                    {row.status === 'failed' ? (
                                                        <Link
                                                            to="/upload"
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#F59E0B] border border-[#F59E0B]/30 rounded-lg hover:bg-[#F59E0B]/10 transition-all"
                                                        >
                                                            Retry → <ArrowRight size={12} />
                                                        </Link>
                                                    ) : row.status === 'processing' ? (
                                                        <Link
                                                            to={`/processing/${row.id}`}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-400 border border-blue-400/30 rounded-lg hover:bg-blue-400/10 transition-all"
                                                        >
                                                            View → <ArrowRight size={12} />
                                                        </Link>
                                                    ) : (
                                                        <Link
                                                            to={`/results/${row.id}`}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#3B82F6] border border-[#3B82F6]/30 rounded-lg hover:bg-[#3B82F6]/10 transition-all"
                                                        >
                                                            View → <ArrowRight size={12} />
                                                        </Link>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between px-6 py-4 border-t border-[#30363D]">
                                    <span className="text-xs text-[#8B949E]">
                                        Page {page} of {totalPages} · {analyses.length} analyses
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className="p-1.5 rounded-lg border border-[#30363D] text-[#8B949E] hover:text-white hover:border-[#8B949E] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                                            <button
                                                key={n}
                                                onClick={() => setPage(n)}
                                                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${n === page
                                                    ? 'bg-[#3B82F6] text-white'
                                                    : 'text-[#8B949E] hover:text-white border border-[#30363D] hover:border-[#8B949E]'
                                                    }`}
                                            >
                                                {n}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                            className="p-1.5 rounded-lg border border-[#30363D] text-[#8B949E] hover:text-white hover:border-[#8B949E] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div >
    )
}

/* ═══════════════ STAT CARD ═══════════════ */
function StatCard({ icon, label, value, sub, accent }: {
    icon: React.ReactNode
    label: string
    value: string
    sub: string
    accent: string
}) {
    return (
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 flex items-center gap-4 hover:border-[#8B949E]/40 transition-all hover:-translate-y-0.5 card-glow">
            <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: accent + '22' }}
            >
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-xs text-[#8B949E] mb-1">{label}</p>
                <p className="text-2xl font-extrabold text-white tabular-nums">{value}</p>
                <p className="text-xs text-[#8B949E] truncate">{sub}</p>
            </div>
        </div>
    )
}
