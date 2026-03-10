import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { jsPDF } from 'jspdf'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
    Download, RefreshCw, Share2, PlusCircle, ChevronDown, ChevronRight,
    ExternalLink, Check, X, FileText, Info, AlertTriangle, Loader2,
} from 'lucide-react'
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'

/* ═══════════════ TYPES ═══════════════ */
type HighlightColor = 'green' | 'yellow' | 'red'

/* ═══════════════ HELPERS ═══════════════ */
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
    { key: 'keyword_match', label: 'Keyword Match', weight: '30%', tip: 'Measures how well your resume keywords match the target role requirements. ATS systems scan for specific terms.' },
    { key: 'format_structure', label: 'Format & Structure', weight: '25%', tip: 'Evaluates clean section headers, consistent formatting, and ATS-parseable layout (no tables/columns).' },
    { key: 'contact_info', label: 'Contact Info', weight: '15%', tip: 'Checks for email, phone, LinkedIn, GitHub, and portfolio links — all fields expected by recruiters.' },
    { key: 'resume_length', label: 'Resume Length', weight: '15%', tip: 'Assesses whether resume length matches experience level (1 page for <5yr, 2 pages for 5yr+).' },
    { key: 'consistency', label: 'Consistency', weight: '15%', tip: 'Checks for consistent date formats, bullet styles, tense usage, and font sizing throughout.' },
]

/* ═══════════════════════════════════════ PAGE ═══════════════════════════════════════ */

export default function ResultsPage() {
    const { analysisId } = useParams()
    const navigate = useNavigate()

    /* ═══ Data fetching state ═══ */
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchResults = useCallback(async () => {
        if (!analysisId) return
        setLoading(true)
        setError(null)
        try {
            const { data: { session } } = await supabase.auth.getSession()
            const response = await fetch(`/api/analysis/${analysisId}`, {
                headers: {
                    ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {}),
                },
            })
            if (!response.ok) throw new Error('Failed to fetch results')
            const result = await response.json()
            setData(result)
        } catch (err: any) {
            setError(err.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }, [analysisId])

    useEffect(() => {
        fetchResults()
    }, [fetchResults])

    /* ═══ Derived data (safe) ═══ */
    const r = data?.results
    const companies: string[] = data?.target_companies ?? []
    const verdicts: Record<string, { verdict: string; confidence: number; role: string }> = r?.company_verdicts ?? {}

    /* ═══ State ═══ */
    const [activeCompany, setActiveCompany] = useState('')
    const [animatedScore, setAnimatedScore] = useState(0)
    const [barsVisible, setBarsVisible] = useState(false)
    const [skillTab, setSkillTab] = useState<'found' | 'gaps'>('found')
    const [jdExpanded, setJdExpanded] = useState(false)
    const [jdText, setJdText] = useState('')
    const [jdLoading, setJdLoading] = useState(false)
    const [jdResults, setJdResults] = useState<any>(null)
    const [copied, setCopied] = useState(false)
    const [hoveredTip, setHoveredTip] = useState<number | null>(null)
    const [hoveredHighlight, setHoveredHighlight] = useState<number | null>(null)
    const [pdfModal, setPdfModal] = useState(false)
    const [pdfLoading, setPdfLoading] = useState(false)
    const [milestones, setMilestones] = useState<boolean[]>([])

    /* ═══ Set active company & milestones once data loads ═══ */
    useEffect(() => {
        if (data && companies.length > 0 && !activeCompany) {
            setActiveCompany(companies[0])
        }
    }, [data, companies, activeCompany])

    useEffect(() => {
        if (r?.learning_plan) {
            const saved = localStorage.getItem(`milestones-${analysisId}`)
            setMilestones(saved ? JSON.parse(saved) : r.learning_plan.map(() => false))
        }
    }, [r?.learning_plan, analysisId])

    /* ═══ PDF Export ═══ */
    const handlePdfDownload = async () => {
        setPdfLoading(true)
        await new Promise(r => setTimeout(r, 100)) // allow UI to update

        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
        const W = 210, H = 297
        const margin = 18
        const today = new Date().toISOString().split('T')[0]
        const totalPages = 5

        // ── HELPERS ──────────────────────────────────────────────────────────
        const addFooter = (pageNum: number) => {
            doc.setFontSize(8)
            doc.setTextColor(120, 120, 140)
            doc.text(`ResumeIQ | AI Resume Intelligence | Page ${pageNum} of ${totalPages}`, W / 2, H - 10, { align: 'center' })
            doc.setDrawColor(48, 54, 61)
            doc.line(margin, H - 14, W - margin, H - 14)
        }
        const hexToRgb = (hex: string) => {
            const r2 = parseInt(hex.slice(1, 3), 16)
            const g = parseInt(hex.slice(3, 5), 16)
            const b = parseInt(hex.slice(5, 7), 16)
            return { r: r2, g, b }
        }
        const scoreHex = scoreColor(r?.ats_score ?? 0)
        const scoreRgb = hexToRgb(scoreHex)

        // ════════════════════════════════════════════════════════════════════
        // PAGE 1 — COVER
        // ════════════════════════════════════════════════════════════════════
        doc.setFillColor(13, 17, 23)
        doc.rect(0, 0, W, H, 'F')

        // Top accent bar
        doc.setFillColor(59, 130, 246)
        doc.rect(0, 0, W, 4, 'F')

        // Logo
        doc.setFontSize(28)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(255, 255, 255)
        doc.text('Resume', W / 2 - 12, 60, { align: 'right' })
        doc.setTextColor(59, 130, 246)
        doc.text('IQ', W / 2 + 2, 60, { align: 'left' })

        // Title
        doc.setFontSize(20)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(180, 190, 210)
        doc.text('Analysis Report', W / 2, 78, { align: 'center' })

        // Divider
        doc.setDrawColor(59, 130, 246)
        doc.setLineWidth(0.5)
        doc.line(margin + 30, 86, W - margin - 30, 86)

        // Candidate Name (from raw text first line)
        const candidateName = (r?.raw_text ?? '').split('\n')[0].trim() || 'Candidate'
        doc.setFontSize(22)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(255, 255, 255)
        doc.text(candidateName, W / 2, 104, { align: 'center' })

        // Meta info
        doc.setFontSize(11)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(139, 148, 158)
        doc.text(`Date: ${today}`, W / 2, 118, { align: 'center' })
        doc.text(`Target Company: ${activeCompany}`, W / 2, 128, { align: 'center' })
        doc.text(`Role: ${verdict?.role ?? ''}`, W / 2, 138, { align: 'center' })

        // ATS score preview circle
        doc.setFillColor(22, 27, 34)
        doc.circle(W / 2, 178, 28, 'F')
        doc.setDrawColor(scoreRgb.r, scoreRgb.g, scoreRgb.b)
        doc.setLineWidth(2)
        doc.circle(W / 2, 178, 28, 'S')
        doc.setFontSize(30)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(scoreRgb.r, scoreRgb.g, scoreRgb.b)
        doc.text(String(r?.ats_score ?? 0), W / 2, 186, { align: 'center' })
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(139, 148, 158)
        doc.text('ATS SCORE', W / 2, 196, { align: 'center' })

        // Confidential watermark
        doc.setFontSize(9)
        doc.setTextColor(80, 90, 100)
        doc.text('CONFIDENTIAL', W / 2, H - 22, { align: 'center' })

        addFooter(1)

        // ════════════════════════════════════════════════════════════════════
        // PAGE 2 — ATS SCORE SUMMARY
        // ════════════════════════════════════════════════════════════════════
        doc.addPage()
        doc.setFillColor(13, 17, 23)
        doc.rect(0, 0, W, H, 'F')
        doc.setFillColor(59, 130, 246)
        doc.rect(0, 0, W, 4, 'F')

        doc.setFontSize(18)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(255, 255, 255)
        doc.text('ATS Score Summary', margin, 26)

        // Big score
        doc.setFontSize(52)
        doc.setTextColor(scoreRgb.r, scoreRgb.g, scoreRgb.b)
        doc.text(String(r?.ats_score ?? 0), margin, 60)
        doc.setFontSize(13)
        doc.setTextColor(180, 190, 210)
        doc.text(scoreGrade(r?.ats_score ?? 0).replace(/[^a-zA-Z ]/g, '').trim(), margin + 42, 52)

        // Sub-score table
        const subRows = [
            ['Keyword Match', '30%', String(r?.ats_breakdown?.keyword_match ?? 0) + '%'],
            ['Format & Structure', '25%', String(r?.ats_breakdown?.format_structure ?? 0) + '%'],
            ['Contact Info', '15%', String(r?.ats_breakdown?.contact_info ?? 0) + '%'],
            ['Resume Length', '15%', String(r?.ats_breakdown?.resume_length ?? 0) + '%'],
            ['Consistency', '15%', String(r?.ats_breakdown?.consistency ?? 0) + '%'],
        ]
        let y = 76
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(139, 148, 158)
        doc.text('Category', margin, y)
        doc.text('Weight', margin + 90, y)
        doc.text('Score', margin + 130, y)
        y += 4
        doc.setDrawColor(48, 54, 61)
        doc.line(margin, y, W - margin, y)
        y += 8

        subRows.forEach(([label, weight, score]) => {
            const scoreNum = parseInt(score)
            const rgb = hexToRgb(scoreColor(scoreNum))
            doc.setFont('helvetica', 'normal')
            doc.setTextColor(201, 209, 217)
            doc.text(label, margin, y)
            doc.setTextColor(139, 148, 158)
            doc.text(weight, margin + 90, y)
            doc.setTextColor(rgb.r, rgb.g, rgb.b)
            doc.setFont('helvetica', 'bold')
            doc.text(score, margin + 130, y)
            y += 4
            doc.setDrawColor(30, 37, 45)
            doc.line(margin, y, W - margin, y)
            y += 7
        })

        addFooter(2)

        // ════════════════════════════════════════════════════════════════════
        // PAGE 3 — SELECTION VERDICT
        // ════════════════════════════════════════════════════════════════════
        doc.addPage()
        doc.setFillColor(13, 17, 23)
        doc.rect(0, 0, W, H, 'F')
        doc.setFillColor(59, 130, 246)
        doc.rect(0, 0, W, 4, 'F')

        doc.setFontSize(18)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(255, 255, 255)
        doc.text('Selection Verdict', margin, 26)

        // Verdict banner
        const isSelectedV = verdict.verdict === 'selected'
        if (isSelectedV) doc.setFillColor(6, 78, 59)
        else doc.setFillColor(127, 29, 29)
        doc.roundedRect(margin, 36, W - margin * 2, 30, 4, 4, 'F')

        doc.setFontSize(16)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(255, 255, 255)
        doc.text(isSelectedV ? 'LIKELY SELECTED' : 'NOT SELECTED', W / 2, 53, { align: 'center' })
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(200, 220, 200)
        doc.text(`Confidence: ${verdict.confidence}%`, W / 2, 61, { align: 'center' })

        // Category label
        y = 82
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(255, 255, 255)
        doc.text(`Category ${r?.category ?? 'A'}: ${(r?.category ?? 'A') === 'A' ? 'Skills strong, resume needs polish' : 'Skill gaps need to be closed'}`, margin, y)
        y += 12

        const verdictText = isSelectedV
            ? `Your profile matches ${activeCompany}'s requirements for ${verdict.role}.`
            : `There are gaps in your profile for ${activeCompany}'s ${verdict.role} role. See the improvement plan.`
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(139, 148, 158)
        const lines = doc.splitTextToSize(verdictText, W - margin * 2)
        doc.text(lines, margin, y)

        addFooter(3)

        // ════════════════════════════════════════════════════════════════════
        // PAGE 4 — SKILLS ANALYSIS
        // ════════════════════════════════════════════════════════════════════
        doc.addPage()
        doc.setFillColor(13, 17, 23)
        doc.rect(0, 0, W, H, 'F')
        doc.setFillColor(59, 130, 246)
        doc.rect(0, 0, W, 4, 'F')

        doc.setFontSize(18)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(255, 255, 255)
        doc.text('Skills Analysis', margin, 26)

        const halfW = (W - margin * 2 - 8) / 2

        // Found header
        doc.setFontSize(11)
        doc.setTextColor(16, 185, 129)
        doc.text('Skills Found', margin, 40)
        // Missing header
        doc.setTextColor(239, 68, 68)
        doc.text('Skills Missing', margin + halfW + 8, 40)

        y = 50
        const foundSkills = (r?.skills_found ?? []).slice(0, 18)
        const missingSkills = r?.skills_missing ?? []
        const maxRows = Math.max(foundSkills.length, missingSkills.length)

        for (let i = 0; i < maxRows && y < H - 30; i++) {
            if (foundSkills[i]) {
                doc.setFontSize(9)
                doc.setFont('helvetica', 'normal')
                doc.setTextColor(201, 209, 217)
                doc.text(`• ${foundSkills[i].name} (${foundSkills[i].proficiency})`, margin, y)
            }
            if (missingSkills[i]) {
                doc.setTextColor(201, 209, 217)
                doc.text(`• ${missingSkills[i].name}`, margin + halfW + 8, y)
            }
            y += 8
        }

        addFooter(4)

        // ════════════════════════════════════════════════════════════════════
        // PAGE 5 — IMPROVEMENT PLAN
        // ════════════════════════════════════════════════════════════════════
        doc.addPage()
        doc.setFillColor(13, 17, 23)
        doc.rect(0, 0, W, H, 'F')
        doc.setFillColor(59, 130, 246)
        doc.rect(0, 0, W, 4, 'F')

        doc.setFontSize(18)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(255, 255, 255)
        doc.text('Improvement Plan', margin, 26)

        y = 38
        if ((r?.category ?? 'A') === 'A') {
            // Tips list
            ; (r?.improvement_tips ?? []).forEach((tip: any, idx: number) => {
                if (y > H - 40) return
                doc.setFontSize(10)
                doc.setFont('helvetica', 'bold')
                doc.setTextColor(59, 130, 246)
                doc.text(`${idx + 1}. ${tip.title}`, margin, y)
                y += 6
                doc.setFont('helvetica', 'normal')
                doc.setTextColor(139, 148, 158)
                const expLines = doc.splitTextToSize(tip.explanation, W - margin * 2)
                doc.text(expLines.slice(0, 2), margin, y)
                y += expLines.slice(0, 2).length * 5 + 6
            })
        } else {
            // Learning plan table
            doc.setFontSize(10)
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(139, 148, 158)
            doc.text('Week', margin, y)
            doc.text('Skill', margin + 28, y)
            doc.text('Hours', margin + 100, y)
            doc.text('Priority', margin + 130, y)
            y += 4
            doc.setDrawColor(48, 54, 61)
            doc.line(margin, y, W - margin, y)
            y += 7

                ; (r?.learning_plan ?? []).forEach((m: any) => {
                    if (y > H - 30) return
                    doc.setFont('helvetica', 'normal')
                    doc.setTextColor(201, 209, 217)
                    doc.text(m.week, margin, y)
                    doc.text(m.skill, margin + 28, y)
                    doc.text(String(m.hours) + 'h', margin + 100, y)
                    doc.setFont('helvetica', 'bold')
                    doc.setTextColor(59, 130, 246)
                    doc.text(m.priority, margin + 130, y)
                    y += 7
                    doc.setDrawColor(30, 37, 45)
                    doc.setFont('helvetica', 'normal')
                    doc.line(margin, y - 2, W - margin, y - 2)
                })
        }

        addFooter(5)

        // ── SAVE ──────────────────────────────────────────────────────────────
        const filename = `ResumeIQ_${activeCompany.replace(/\s+/g, '_')}_${today}.pdf`
        doc.save(filename)
        setPdfLoading(false)
    }

    /* ═══ Animation: ATS score ═══ */
    const atsScore = r?.ats_score ?? 0
    useEffect(() => {
        if (!r) return
        let frame: number
        const start = performance.now()
        const duration = 1500
        const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3) // ease out cubic
            setAnimatedScore(Math.round(atsScore * eased))
            if (progress < 1) frame = requestAnimationFrame(animate)
        }
        frame = requestAnimationFrame(animate)
        setTimeout(() => setBarsVisible(true), 400)
        return () => cancelAnimationFrame(frame)
    }, [atsScore, r])

    /* ═══ Milestone toggle ═══ */
    const toggleMilestone = (i: number) => {
        const next = [...milestones]
        next[i] = !next[i]
        setMilestones(next)
        localStorage.setItem(`milestones-${analysisId}`, JSON.stringify(next))
    }

    /* ═══ JD Match ═══ */
    const handleJDMatch = async () => {
        if (!jdText.trim()) return
        setJdLoading(true)
        try {
            const { data: { session } } = await supabase.auth.getSession()
            const res = await fetch(`/api/analysis/${analysisId}/job-match`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {}),
                },
                body: JSON.stringify({ jobDescription: jdText }),
            })
            const data = await res.json()
            setJdResults(data)
        } catch {
            toast.error('Job description matching failed. Please try again.')
        }
        setJdLoading(false)
    }

    /* ═══ Share ═══ */
    const handleShare = () => {
        const url = `${window.location.origin}/share/${data?.share_token ?? ''}`
        navigator.clipboard.writeText(url)
            .then(() => toast.success('Link copied to clipboard! ✅'))
            .catch(() => toast.error('Could not copy — try manually'))
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
    }

    const verdict = verdicts[activeCompany] || { verdict: 'unknown', confidence: 0, role: data?.target_role ?? '' }
    const isSelected = verdict.verdict === 'selected'

    /* ═══ Highlight rendering ═══ */
    const highlightCounts = { green: 0, yellow: 0, red: 0 }
        ; (r?.highlight_map ?? []).forEach((h: any) => { highlightCounts[h.color as HighlightColor]++ })

    const renderHighlightedText = () => {
        let text = r?.raw_text ?? ''
        const segments: { text: string; highlight?: any; index?: number }[] = []
        let lastIdx = 0
        const sortedHighlights = [...(r?.highlight_map ?? [])].sort((a: any, b: any) => {
            const idxA = text.indexOf(a.text, lastIdx === 0 ? 0 : undefined)
            const idxB = text.indexOf(b.text, lastIdx === 0 ? 0 : undefined)
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

    /* ═══════════════ CHART DATA ═══════════════ */
    const chartData = [
        { name: 'score', value: animatedScore, fill: scoreColor(atsScore) },
        { name: 'bg', value: 100, fill: '#161B22' },
    ]

    /* ═══════════════ EARLY RETURNS: Loading / Error / Processing / Failed ═══════════════ */

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020408]">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 pt-24 space-y-6">
                    {/* Verdict skeleton */}
                    <div className="rounded-2xl bg-[#161B22] border border-[#30363D] p-8 animate-pulse">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-full bg-[#30363D]" />
                            <div className="space-y-3 flex-1">
                                <div className="h-7 bg-[#30363D] rounded-lg w-64" />
                                <div className="h-4 bg-[#30363D] rounded w-96" />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {/* ATS score skeleton */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 animate-pulse">
                                <div className="h-40 flex items-end justify-center pb-2">
                                    <div className="w-24 h-24 rounded-full bg-[#30363D]" />
                                </div>
                                <div className="mt-8 space-y-4">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i}>
                                            <div className="flex justify-between mb-1">
                                                <div className="h-3 bg-[#30363D] rounded w-24" />
                                                <div className="h-3 bg-[#30363D] rounded w-8" />
                                            </div>
                                            <div className="h-2 bg-[#1C2333] rounded-full" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Skills skeleton */}
                            <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 animate-pulse">
                                <div className="h-8 bg-[#30363D] rounded-lg mb-5" />
                                <div className="flex flex-wrap gap-2">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                        <div key={i} className="h-7 bg-[#30363D] rounded-full" style={{ width: `${60 + i * 12}px` }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Highlights skeleton */}
                        <div className="lg:col-span-3">
                            <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 animate-pulse">
                                <div className="h-5 bg-[#30363D] rounded w-40 mb-4" />
                                <div className="bg-[#0D1117] rounded-xl p-5 space-y-3">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                        <div key={i} className="h-3 bg-[#30363D] rounded" style={{ width: `${70 + (i % 3) * 10}%` }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#020408]">
                <Navbar />
                <div className="max-w-lg mx-auto px-4 pt-32">
                    <div className="bg-[#161B22] border border-red-500/30 rounded-2xl p-8 text-center">
                        <AlertTriangle size={48} className="mx-auto mb-4 text-red-400" />
                        <h2 className="text-xl font-bold text-white mb-2">Failed to Load Results</h2>
                        <p className="text-sm text-[#8B949E] mb-6">{error}</p>
                        <button
                            onClick={fetchResults}
                            className="px-6 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-lg transition-all"
                        >
                            <RefreshCw size={16} className="inline mr-2" />
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (data?.status === 'processing') {
        return (
            <div className="min-h-screen bg-[#020408]">
                <Navbar />
                <div className="max-w-lg mx-auto px-4 pt-32">
                    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-8 text-center">
                        <Loader2 size={48} className="mx-auto mb-4 text-[#3B82F6] animate-spin" />
                        <h2 className="text-xl font-bold text-white mb-2">Still Processing...</h2>
                        <p className="text-sm text-[#8B949E] mb-6">
                            Your resume is being analyzed by our AI pipeline. This usually takes 15–30 seconds.
                        </p>
                        <button
                            onClick={fetchResults}
                            className="px-6 py-2.5 border border-[#30363D] text-[#C9D1D9] font-medium rounded-lg hover:border-[#8B949E] hover:text-white transition-all"
                        >
                            <RefreshCw size={16} className="inline mr-2" />
                            Check Again
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (data?.status === 'failed') {
        return (
            <div className="min-h-screen bg-[#020408]">
                <Navbar />
                <div className="max-w-lg mx-auto px-4 pt-32">
                    <div className="bg-[#161B22] border border-red-500/30 rounded-2xl p-8 text-center">
                        <AlertTriangle size={48} className="mx-auto mb-4 text-red-400" />
                        <h2 className="text-xl font-bold text-white mb-2">Analysis Failed</h2>
                        <p className="text-sm text-[#8B949E] mb-6">
                            {r?.error || data?.error || 'An unexpected error occurred during analysis.'}
                        </p>
                        <Link
                            to="/upload"
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-lg transition-all"
                        >
                            <RefreshCw size={16} />
                            Try Uploading Again
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#020408] pb-24">
            <Navbar />

            {/* ════════ SECTION 1: VERDICT BANNER ════════ */}
            <section className="pt-20">
                {/* Company Tabs */}
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
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-bold ${isSelected ? 'bg-emerald-500/30 text-emerald-300' : 'bg-red-500/30 text-red-300'
                                        }`}
                                >
                                    {verdict.confidence}% Confidence
                                </span>
                            </div>
                            <p className="mt-2 text-white/70 text-sm sm:text-base">
                                {isSelected
                                    ? `Your profile matches ${activeCompany}'s requirements for ${verdict.role}.`
                                    : `Here's exactly what's holding you back — and the exact plan to fix it.`}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════ MAIN GRID ════════ */}
            <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* ═══ LEFT COLUMN (2/5) ═══ */}
                <div className="lg:col-span-2 space-y-6">

                    {/* ════════ SECTION 2: ATS SCORE CARD ════════ */}
                    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 card-glow transition-all duration-300">
                        <div className="text-center mb-2">
                            <span className="text-sm font-semibold" style={{ color: scoreColor(atsScore) }}>
                                {scoreGrade(atsScore)}
                            </span>
                        </div>

                        {/* Semicircle gauge */}
                        <div className="relative h-40 -mb-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart
                                    cx="50%" cy="100%" innerRadius="70%" outerRadius="100%"
                                    startAngle={180} endAngle={0}
                                    data={chartData}
                                    barSize={14}
                                >
                                    <RadialBar dataKey="value" cornerRadius={8} background={{ fill: '#1C2333' }} />
                                </RadialBarChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                                <span className="text-5xl font-extrabold text-white tabular-nums">{animatedScore}</span>
                                <span className="text-xs text-[#8B949E] mt-1">ATS Score</span>
                            </div>
                        </div>

                        {/* Sub-score bars */}
                        <div className="mt-8 space-y-3">
                            {SUB_SCORES.map((sub, i) => {
                                const val = (r?.ats_breakdown as any)?.[sub.key] || 0
                                return (
                                    <div
                                        key={sub.key}
                                        className="group relative"
                                        onMouseEnter={() => setHoveredTip(i)}
                                        onMouseLeave={() => setHoveredTip(null)}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-[#C9D1D9] flex items-center gap-1">
                                                {sub.label}
                                                <Info size={12} className="text-[#8B949E] opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </span>
                                            <span className="text-xs font-bold tabular-nums" style={{ color: scoreColor(val) }}>
                                                {val}%
                                            </span>
                                        </div>
                                        <div className="h-2 rounded-full bg-[#1C2333] overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all ease-out"
                                                style={{
                                                    width: barsVisible ? `${val}%` : '0%',
                                                    backgroundColor: scoreColor(val),
                                                    transitionDuration: '0.8s',
                                                    transitionDelay: `${i * 0.1}s`,
                                                }}
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

                    {/* ════════ SECTION 3: SKILL ANALYSIS ════════ */}
                    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 card-glow transition-all duration-300">
                        {/* Tab toggle */}
                        <div className="flex bg-[#0D1117] rounded-lg p-1 mb-5">
                            {(['found', 'gaps'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setSkillTab(tab)}
                                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${skillTab === tab ? 'bg-[#161B22] text-white shadow' : 'text-[#8B949E] hover:text-white'
                                        }`}
                                >
                                    {tab === 'found' ? `Skills Found (${(r?.skills_found ?? []).length})` : `Skill Gaps (${(r?.skills_missing ?? []).length})`}
                                </button>
                            ))}
                        </div>

                        {skillTab === 'found' ? (
                            <div className="flex flex-wrap gap-2">
                                {(r?.skills_found ?? []).map((s: any, i: number) => (
                                    <span
                                        key={i}
                                        className={`group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:-translate-y-0.5 ${s.type === 'implicit'
                                            ? 'border border-dashed border-[#30363D] text-[#C9D1D9]'
                                            : 'bg-[#0D1117] text-white border border-[#30363D]'
                                            }`}
                                    >
                                        <span
                                            className="w-2 h-2 rounded-full shrink-0"
                                            style={{ backgroundColor: profColor[s.proficiency] || '#8B949E' }}
                                        />
                                        {s.name}
                                        {s.type === 'implicit' && (
                                            <span className="text-[10px]">ℹ️</span>
                                        )}
                                        <span className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#1C2333] border border-[#30363D] rounded text-[10px] text-[#8B949E] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            {s.proficiency}{s.type === 'implicit' ? ' · Inferred from experience' : ''}
                                        </span>
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {(r?.skills_missing ?? []).map((s: any, i: number) => (
                                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[#0D1117] border border-[#30363D]">
                                        <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${impColor[s.importance]?.bg} ${impColor[s.importance]?.text}`}>
                                            {s.importance}
                                        </span>
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

                    {/* ════════ SECTION 4: RESUME HIGHLIGHT VIEWER ════════ */}
                    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 card-glow transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Resume Highlights</h3>
                            <button
                                onClick={() => setPdfModal(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#C9D1D9] border border-[#30363D] rounded-lg hover:border-[#8B949E] transition-all"
                            >
                                <FileText size={14} /> View Original PDF
                            </button>
                        </div>

                        {/* Legend */}
                        <div className="flex flex-wrap gap-4 mb-4 p-3 bg-[#0D1117] rounded-lg">
                            <span className="text-xs text-[#10B981]">🟢 Strong ({highlightCounts.green})</span>
                            <span className="text-xs text-[#F59E0B]">🟡 Improvable ({highlightCounts.yellow})</span>
                            <span className="text-xs text-[#EF4444]">🔴 Weak ({highlightCounts.red})</span>
                        </div>

                        {/* Resume text */}
                        <div className="bg-[#0D1117] rounded-xl p-5 max-h-[600px] overflow-y-auto text-sm text-[#C9D1D9] leading-relaxed whitespace-pre-wrap font-mono">
                            {renderHighlightedText()}
                        </div>
                    </div>
                </div>
            </div>

            {/* ════════ SECTION 5: IMPROVEMENT PLAN (full width) ════════ */}
            <div className="max-w-7xl mx-auto px-4 mt-8">
                <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 sm:p-8">
                    {(r?.category ?? 'A') === 'A' ? (
                        <>
                            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                                💡 Your Skills Are Strong — Your Resume Isn't Presenting Them
                            </h2>
                            <p className="text-[#8B949E] text-sm mb-8">
                                These specific changes will boost your ATS score and recruiter impression
                            </p>

                            <div className="space-y-5">
                                {(r?.improvement_tips ?? []).map((tip: any, i: number) => {
                                    const imp = impactLabel[tip.impact] || impactLabel.medium
                                    const locked = i >= 3 // Pro-only beyond 3
                                    return (
                                        <div
                                            key={i}
                                            className={`relative rounded-xl border transition-all ${locked ? 'border-[#30363D] opacity-60' : 'border-[#30363D] hover:border-[#3B82F6]/30'
                                                }`}
                                        >
                                            {locked && (
                                                <div className="absolute inset-0 z-10 bg-[#0D1117]/70 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                                    <div className="text-center">
                                                        <span className="px-3 py-1 bg-[#3B82F6] text-white text-xs font-bold rounded-full">PRO ONLY</span>
                                                        <p className="text-xs text-[#8B949E] mt-2">
                                                            <Link to="/signup" className="text-[#3B82F6] hover:underline">Upgrade to Pro</Link> to unlock all tips
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="p-5">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${imp.bg} ${imp.text}`}>
                                                        {imp.label}
                                                    </span>
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
                        /* ═══ CATEGORY B — LEARNING PLAN ═══ */
                        <>
                            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                                🗺️ Your Personalised Roadmap to Get Selected at {activeCompany}
                            </h2>
                            <p className="text-[#8B949E] text-sm mb-6">
                                Close your skill gaps in {(r?.learning_plan ?? []).length * 2} weeks with this structured plan
                            </p>

                            {/* Progress bar */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between text-xs text-[#8B949E] mb-2">
                                    <span>{milestones.filter(Boolean).length} of {milestones.length} milestones complete</span>
                                    <span>{Math.round((milestones.filter(Boolean).length / Math.max(milestones.length, 1)) * 100)}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-[#1C2333]">
                                    <div
                                        className="h-full rounded-full bg-[#3B82F6] transition-all duration-500"
                                        style={{ width: `${(milestones.filter(Boolean).length / Math.max(milestones.length, 1)) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Timeline cards */}
                            <div className="overflow-x-auto -mx-2 px-2 pb-4">
                                <div className="flex gap-4" style={{ minWidth: `${(r?.learning_plan ?? []).length * 280}px` }}>
                                    {(r?.learning_plan ?? []).map((m: any, i: number) => {
                                        const priColor = impColor[m.priority] || impColor.medium
                                        return (
                                            <div
                                                key={i}
                                                className={`shrink-0 w-[260px] rounded-xl border p-5 transition-all ${milestones[i]
                                                    ? 'border-emerald-500/40 bg-emerald-500/5'
                                                    : 'border-[#30363D] bg-[#0D1117]'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-xs font-bold text-[#3B82F6]">{m.week}</span>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${priColor.bg} ${priColor.text}`}>
                                                        {m.priority}
                                                    </span>
                                                </div>
                                                <h4 className="text-base font-bold text-white mb-2">{m.skill}</h4>
                                                <p className="text-xs text-[#8B949E] mb-3">{m.why}</p>

                                                <a
                                                    href={m.resource}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs text-[#3B82F6] hover:underline mb-2"
                                                >
                                                    Learning resource <ExternalLink size={10} />
                                                </a>

                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-[10px] text-[#8B949E] bg-[#161B22] px-2 py-0.5 rounded">~{m.hours} hours</span>
                                                </div>
                                                <p className="text-xs text-[#C9D1D9] italic mt-2">Build: {m.project}</p>

                                                <button
                                                    onClick={() => toggleMilestone(i)}
                                                    className={`mt-3 w-full py-2 rounded-lg text-xs font-semibold transition-all ${milestones[i]
                                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                        : 'bg-[#161B22] text-[#8B949E] border border-[#30363D] hover:text-white hover:border-[#8B949E]'
                                                        }`}
                                                >
                                                    {milestones[i] ? '✅ Completed' : 'Mark as Complete'}
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Quick Wins */}
                            <div className="mt-6 p-4 bg-[#0D1117] rounded-xl border border-[#30363D]">
                                <h4 className="text-sm font-semibold text-white mb-3">⚡ Quick Wins — Do This Week (under 2 hours each)</h4>
                                <ul className="space-y-2 text-xs text-[#C9D1D9]">
                                    <li className="flex items-start gap-2"><span className="text-[#3B82F6]">→</span> Add a professional summary tailored to {data?.target_role ?? ''} at {activeCompany}</li>
                                    <li className="flex items-start gap-2"><span className="text-[#3B82F6]">→</span> List all relevant certifications and online courses completed</li>
                                    <li className="flex items-start gap-2"><span className="text-[#3B82F6]">→</span> Add GitHub profile link with 2-3 pinned projects using target tech stack</li>
                                </ul>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* ════════ SECTION 6: JD MATCHER ════════ */}
            <div className="max-w-7xl mx-auto px-4 mt-8">
                <div className="bg-[#161B22] border border-[#30363D] rounded-2xl overflow-hidden">
                    <button
                        onClick={() => setJdExpanded(!jdExpanded)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-[#1C2333] transition-colors"
                    >
                        <span className="text-lg font-semibold text-white">
                            📋 Match Your Resume to a Specific Job Description
                        </span>
                        {jdExpanded ? <ChevronDown size={20} className="text-[#8B949E]" /> : <ChevronRight size={20} className="text-[#8B949E]" />}
                    </button>

                    {jdExpanded && (
                        <div className="px-6 pb-6 space-y-4">
                            <textarea
                                value={jdText}
                                onChange={(e) => setJdText(e.target.value)}
                                rows={6}
                                placeholder="Paste the full job description here..."
                                className="w-full px-4 py-3 bg-[#0D1117] border border-[#30363D] rounded-xl text-white text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all resize-none"
                            />
                            <button
                                onClick={handleJDMatch}
                                disabled={!jdText.trim() || jdLoading}
                                className="px-6 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {jdLoading ? 'Matching...' : 'Match Now'}
                            </button>

                            {jdResults && (
                                <div className="mt-4 space-y-4">
                                    {/* Match score */}
                                    <div className="text-center p-4 bg-[#0D1117] rounded-xl">
                                        <span className="text-4xl font-extrabold tabular-nums" style={{ color: scoreColor(jdResults.matchScore) }}>
                                            {jdResults.matchScore}%
                                        </span>
                                        <p className="text-xs text-[#8B949E] mt-1">Job Description Match Score</p>
                                    </div>

                                    {/* Keywords columns */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                                            <h4 className="text-sm font-semibold text-emerald-400 mb-2">✅ Keywords Present</h4>
                                            <div className="flex flex-wrap gap-1.5">
                                                {jdResults.matchedKeywords.map((k: string, i: number) => (
                                                    <span key={i} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 text-xs rounded-full border border-emerald-500/20">
                                                        {k}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                                            <h4 className="text-sm font-semibold text-red-400 mb-2">❌ Keywords Missing</h4>
                                            <div className="flex flex-wrap gap-1.5">
                                                {jdResults.missingKeywords.map((k: string, i: number) => (
                                                    <span key={i} className="px-2 py-0.5 bg-red-500/10 text-red-300 text-xs rounded-full border border-red-500/20">
                                                        {k}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Keywords table */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs">
                                            <thead>
                                                <tr className="border-b border-[#30363D]">
                                                    <th className="py-2 px-3 text-left text-[#8B949E] font-medium">Keyword</th>
                                                    <th className="py-2 px-3 text-center text-[#8B949E] font-medium">In Resume</th>
                                                    <th className="py-2 px-3 text-center text-[#8B949E] font-medium">In JD</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[...jdResults.matchedKeywords, ...jdResults.missingKeywords].map((k: string, i: number) => {
                                                    const found = jdResults.matchedKeywords.includes(k)
                                                    return (
                                                        <tr key={i} className="border-b border-[#30363D]/50">
                                                            <td className="py-2 px-3 text-[#C9D1D9]">{k}</td>
                                                            <td className="py-2 px-3 text-center">
                                                                {found ? <Check size={14} className="inline text-emerald-400" /> : <X size={14} className="inline text-red-400" />}
                                                            </td>
                                                            <td className="py-2 px-3 text-center">
                                                                <Check size={14} className="inline text-emerald-400" />
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ════════ SECTION 7: STICKY ACTION BAR ════════ */}
            <div className="fixed bottom-0 left-0 right-0 z-40 glass-nav border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-3 flex-wrap">
                    <button
                        onClick={handlePdfDownload}
                        disabled={pdfLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed btn-shimmer"
                    >
                        {pdfLoading ? (
                            <><svg className="animate-spin" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx={12} cy={12} r={10} strokeOpacity={0.3} /><path d="M12 2a10 10 0 0 1 10 10" /></svg> Generating...</>
                        ) : (
                            <><Download size={16} /> Download PDF Report</>
                        )}
                    </button>
                    <button
                        onClick={() => navigate('/upload')}
                        className="flex items-center gap-2 px-4 py-2 border border-[#30363D] text-[#C9D1D9] text-sm font-medium rounded-lg hover:border-[#8B949E] hover:text-white transition-all"
                    >
                        <RefreshCw size={16} /> Re-Upload
                    </button>
                    <button
                        onClick={handleShare}
                        className="relative flex items-center gap-2 px-4 py-2 border border-[#30363D] text-[#C9D1D9] text-sm font-medium rounded-lg hover:border-[#8B949E] hover:text-white transition-all"
                    >
                        {copied ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
                        {copied ? 'Link Copied!' : 'Share'}
                    </button>
                    <Link
                        to="/upload"
                        className="flex items-center gap-2 px-4 py-2 border border-[#30363D] text-[#C9D1D9] text-sm font-medium rounded-lg hover:border-[#8B949E] hover:text-white transition-all"
                    >
                        <PlusCircle size={16} /> New Analysis
                    </Link>
                </div>
            </div>

            {/* ════════ PDF MODAL ════════ */}
            {pdfModal && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setPdfModal(false)}>
                    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-4 border-b border-[#30363D]">
                            <h3 className="text-sm font-semibold text-white">Original Resume</h3>
                            <button onClick={() => setPdfModal(false)} className="p-1 text-[#8B949E] hover:text-white transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-4 h-[60vh] flex items-center justify-center text-[#8B949E] text-sm">
                            <div className="text-center">
                                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                                <p>PDF viewer will load when connected to Supabase Storage</p>
                                <p className="text-xs mt-1">Configure VITE_SUPABASE_URL to enable</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
