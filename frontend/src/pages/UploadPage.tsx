import { useState, useRef, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, X, CheckCircle, Plus, Rocket, AlertCircle, Info, CloudUpload, Loader2, Lock } from 'lucide-react'
import { toast } from 'sonner'
import Navbar from '@/components/Navbar'
import { uploadAndAnalyse } from '@/api/analysis'
import { useAuth } from '@/contexts/AuthContext'

const ROLES = [
    'Software Engineer', 'Data Scientist', 'Product Manager', 'Marketing Manager',
    'Business Analyst', 'DevOps Engineer', 'UI/UX Designer', 'HR Manager', 'Finance Analyst', 'Other',
]

const EXP_LEVELS = [
    { value: 'fresher', label: 'Fresher (0-1yr)' },
    { value: 'early', label: 'Early Career (1-3yr)' },
    { value: 'mid', label: 'Mid Level (3-7yr)' },
    { value: 'senior', label: 'Senior (7+yr)' },
]

const URGENCY_LABELS: Record<number, string> = { 1: 'Exploring', 5: 'Actively Applying', 10: 'Need ASAP' }

export default function UploadPage() {
    const navigate = useNavigate()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { user, loading: authLoading } = useAuth()

    // Auth gate — show CTA if not logged in
    if (!authLoading && !user) {
        return (
            <div className="min-h-screen bg-[#020408]">
                <Navbar />
                <div className="flex items-center justify-center min-h-[80vh] px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md w-full text-center p-8 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm"
                    >
                        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                            <Lock size={28} className="text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">
                            Create a free account to analyse your resume
                        </h2>
                        <p className="text-[#8B949E] mb-8">
                            Sign up in 30 seconds — no credit card required. Get your ATS score, skill gaps, and AI-powered improvement tips.
                        </p>
                        <div className="flex flex-col gap-3">
                            <Link
                                to="/signup"
                                state={{ from: 'upload-gate' }}
                                className="w-full py-3.5 px-6 text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
                            >
                                Sign up free
                            </Link>
                            <Link
                                to="/login"
                                className="w-full py-3.5 px-6 text-base font-semibold text-[#C9D1D9] border border-white/10 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300"
                            >
                                Log in
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        )
    }

    const [file, setFile] = useState<File | null>(null)
    const [fileError, setFileError] = useState('')
    const [dragActive, setDragActive] = useState(false)

    const [companies, setCompanies] = useState<string[]>([''])
    const [role, setRole] = useState('')
    const [experience, setExperience] = useState('')
    const [weakness, setWeakness] = useState('')
    const [urgency, setUrgency] = useState(5)
    const [submitting, setSubmitting] = useState(false)
    const [showUpgradeModal, setShowUpgradeModal] = useState(false)

    // Current step: 1=upload, 2=context, 3=analyse
    const currentStep = !file ? 1 : (!role ? 2 : 3)

    const validateFile = useCallback((f: File) => {
        setFileError('')
        const validTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ]
        if (!validTypes.includes(f.type)) {
            setFileError('Only PDF and DOCX files are accepted.')
            return false
        }
        if (f.size > 10 * 1024 * 1024) {
            setFileError('File must be under 10MB.')
            return false
        }
        return true
    }, [])

    const handleFiles = useCallback(
        (files: FileList | null) => {
            if (!files || !files[0]) return
            if (validateFile(files[0])) setFile(files[0])
        },
        [validateFile]
    )

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            setDragActive(false)
            handleFiles(e.dataTransfer.files)
        },
        [handleFiles]
    )

    const addCompany = () => {
        if (companies.length < 3) setCompanies([...companies, ''])
    }

    const updateCompany = (i: number, val: string) => {
        const updated = [...companies]
        updated[i] = val
        setCompanies(updated)
    }

    const removeCompany = (i: number) => {
        if (companies.length > 1) setCompanies(companies.filter((_, idx) => idx !== i))
    }

    const canSubmit = file && role

    const handleSubmit = async () => {
        if (!canSubmit) return
        setSubmitting(true)
        try {
            const result = await uploadAndAnalyse({
                file: file!,
                targetCompanies: companies,
                targetRole: role,
                experienceLevel: experience,
                urgency,
                weakness,
            })
            toast.success('Resume uploaded! Analysing now…')
            navigate(`/processing/${result.analysisId}`)
        } catch (err: any) {
            const msg = err?.message || 'Upload failed. Please check your file format.'
            if (msg.includes('LIMIT_EXCEEDED') || msg.includes('limit reached')) {
                setShowUpgradeModal(true)
                toast.error("You've used all 2 free analyses this month")
            } else {
                toast.error(msg)
                setFileError(msg)
            }
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#020408]">
            <Navbar />

            <div className="max-w-2xl mx-auto px-4 pt-28 pb-16">
                {/* ═══ Step Indicator ═══ */}
                <div className="flex items-center justify-center gap-0 mb-12">
                    {[
                        { num: 1, label: 'Upload' },
                        { num: 2, label: 'Context' },
                        { num: 3, label: 'Analyse' },
                    ].map((step, i) => (
                        <div key={step.num} className="flex items-center">
                            <div className="flex items-center gap-2">
                                <motion.div
                                    animate={{
                                        scale: currentStep === step.num ? 1.1 : 1,
                                        boxShadow: currentStep === step.num ? '0 0 15px rgba(59,130,246,0.3)' : '0 0 0px transparent',
                                    }}
                                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${currentStep > step.num
                                        ? 'bg-emerald-500 text-white'
                                        : currentStep === step.num
                                            ? 'bg-[#3B82F6] text-white'
                                            : 'bg-[#161B22] text-[#8B949E] border border-[#30363D]'
                                        }`}
                                >
                                    {currentStep > step.num ? <CheckCircle size={16} /> : step.num}
                                </motion.div>
                                <span className={`text-sm font-medium ${currentStep >= step.num ? 'text-white' : 'text-[#8B949E]'}`}>
                                    {step.label}
                                </span>
                            </div>
                            {i < 2 && (
                                <div className="w-12 h-0.5 mx-3 rounded-full overflow-hidden bg-[#30363D]">
                                    <motion.div
                                        className="h-full bg-[#3B82F6]"
                                        initial={{ width: '0%' }}
                                        animate={{ width: currentStep > step.num ? '100%' : '0%' }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* ═══ Drop Zone ═══ */}
                <AnimatePresence mode="wait">
                    {!file ? (
                        <motion.div
                            key="dropzone"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onDragEnter={(e) => { e.preventDefault(); setDragActive(true) }}
                            onDragLeave={(e) => { e.preventDefault(); setDragActive(false) }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`w-full border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${dragActive
                                ? 'border-[#3B82F6] bg-[#3B82F6]/5 scale-[1.02]'
                                : 'border-[#30363D] hover:border-[#8B949E] bg-[#161B22]/50'
                                }`}
                            style={{ borderImage: dragActive ? undefined : undefined }}
                        >
                            <motion.div animate={dragActive ? { y: [0, -5, 0] } : {}} transition={{ repeat: Infinity, duration: 1 }}>
                                <CloudUpload size={44} className={`mx-auto mb-4 transition-colors ${dragActive ? 'text-[#3B82F6]' : 'text-[#8B949E]'}`} />
                            </motion.div>
                            <p className="text-white font-medium mb-1">Drag your resume here or click to browse</p>
                            <p className="text-sm text-[#8B949E]">PDF or DOCX · Max 10MB</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.docx"
                                onChange={(e) => handleFiles(e.target.files)}
                                className="hidden"
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="file-preview"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                            className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 flex items-center gap-4"
                        >
                            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                                <FileText size={20} className="text-red-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{file.name}</p>
                                <p className="text-xs text-[#8B949E]">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium flex items-center gap-1">
                                <CheckCircle size={12} /> Ready
                            </span>
                            <button onClick={() => { setFile(null); setFileError('') }} className="p-1.5 text-[#8B949E] hover:text-[#EF4444] transition-colors rounded-lg hover:bg-white/5">
                                <X size={18} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {fileError && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-[#EF4444] bg-[#EF4444]/10 px-4 py-2 rounded-lg">
                        <AlertCircle size={16} />
                        {fileError}
                    </div>
                )}

                {/* ═══ Context Form ═══ */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mt-8 space-y-6"
                >
                    {/* Target Companies */}
                    <div>
                        <label className="block text-sm font-medium text-[#C9D1D9] mb-2">Target Companies</label>
                        {companies.map((c, i) => (
                            <div key={i} className="flex items-center gap-2 mb-2">
                                <input
                                    value={c}
                                    onChange={(e) => updateCompany(i, e.target.value)}
                                    placeholder={`Company ${i + 1}`}
                                    className="flex-1 px-4 py-2.5 bg-[#0D1117] border border-[#30363D] rounded-lg text-white text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all"
                                />
                                {companies.length > 1 && (
                                    <button onClick={() => removeCompany(i)} className="p-1.5 text-[#8B949E] hover:text-[#EF4444] transition-colors">
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                        {companies.length < 3 && (
                            <button onClick={addCompany} className="flex items-center gap-1 text-xs text-[#3B82F6] hover:text-[#2563EB] mt-1 font-medium">
                                <Plus size={14} /> Add Company
                            </button>
                        )}
                    </div>

                    {/* Target Role */}
                    <div>
                        <label className="block text-sm font-medium text-[#C9D1D9] mb-2">Target Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-2.5 bg-[#0D1117] border border-[#30363D] rounded-lg text-white text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all appearance-none cursor-pointer"
                        >
                            <option value="" className="text-[#8B949E]">Select a role...</option>
                            {ROLES.map((r) => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>

                    {/* Experience Level */}
                    <div>
                        <label className="block text-sm font-medium text-[#C9D1D9] mb-3">Experience Level</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {EXP_LEVELS.map((lvl) => (
                                <button
                                    key={lvl.value}
                                    type="button"
                                    onClick={() => setExperience(lvl.value)}
                                    className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${experience === lvl.value
                                        ? 'border-[#3B82F6] bg-[#3B82F6]/10 text-white shadow-lg shadow-blue-500/10'
                                        : 'border-[#30363D] text-[#8B949E] hover:border-[#8B949E]'
                                        }`}
                                >
                                    {lvl.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Weakness */}
                    <div>
                        <label className="block text-sm font-medium text-[#C9D1D9] mb-2">
                            Biggest weakness in your resume <span className="text-[#8B949E] font-normal">(optional)</span>
                        </label>
                        <textarea
                            value={weakness}
                            onChange={(e) => setWeakness(e.target.value)}
                            rows={3}
                            placeholder="e.g., No internship experience, gaps in employment..."
                            className="w-full px-4 py-2.5 bg-[#0D1117] border border-[#30363D] rounded-lg text-white text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all resize-none"
                        />
                    </div>

                    {/* Urgency Slider */}
                    <div>
                        <label className="block text-sm font-medium text-[#C9D1D9] mb-3">
                            How urgently do you need a job?
                        </label>
                        <input
                            type="range"
                            min={1}
                            max={10}
                            value={urgency}
                            onChange={(e) => setUrgency(Number(e.target.value))}
                            className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[#30363D] accent-[#3B82F6]"
                        />
                        <div className="flex justify-between mt-2">
                            {Object.entries(URGENCY_LABELS).map(([val, label]) => (
                                <span
                                    key={val}
                                    className={`text-xs ${Number(val) === urgency ? 'text-[#3B82F6] font-semibold' : 'text-[#8B949E]'}`}
                                >
                                    {label}
                                </span>
                            ))}
                        </div>
                        <p className="text-center text-sm font-bold text-[#3B82F6] mt-1">{urgency}/10</p>
                    </div>
                </motion.div>

                {/* Guest Notice */}
                <div className="mt-6 bg-[#161B22] border border-[#30363D] rounded-xl p-4 flex items-start gap-3">
                    <Info size={18} className="text-[#3B82F6] mt-0.5 shrink-0" />
                    <div>
                        <p className="text-sm text-[#C9D1D9]">
                            Save your results and track progress over time —{' '}
                            <Link to="/signup" className="text-[#3B82F6] hover:underline font-medium">
                                Sign up free →
                            </Link>
                        </p>
                    </div>
                </div>

                {/* ═══ Submit Button ═══ */}
                <motion.button
                    onClick={handleSubmit}
                    disabled={!canSubmit || submitting}
                    whileHover={canSubmit && !submitting ? { scale: 1.01 } : {}}
                    whileTap={canSubmit && !submitting ? { scale: 0.99 } : {}}
                    className={`mt-8 w-full py-5 rounded-xl text-base font-semibold transition-all duration-300 flex items-center justify-center gap-2 btn-shimmer ${canSubmit && !submitting
                        ? 'bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 cursor-pointer'
                        : 'bg-[#30363D] text-[#8B949E] cursor-not-allowed opacity-50'
                        }`}
                >
                    {submitting ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Rocket size={18} />
                            🚀 Analyse My Resume
                        </>
                    )}
                </motion.button>
            </div>

            {/* ═══ Upgrade Modal ═══ */}
            <AnimatePresence>
                {showUpgradeModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
                        onClick={() => setShowUpgradeModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="max-w-md w-full p-8 rounded-2xl border border-white/10 bg-[#0D1117] shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-center">
                                <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                                    <AlertCircle size={28} className="text-amber-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">
                                    Monthly Limit Reached
                                </h3>
                                <p className="text-[#8B949E] mb-6">
                                    You've used all 2 free analyses this month. Upgrade to Pro for unlimited analyses and premium features.
                                </p>

                                <div className="bg-white/[0.03] rounded-xl p-4 mb-6 text-left space-y-2">
                                    <p className="text-sm font-semibold text-white mb-3">Pro Plan — ₹299/mo</p>
                                    {['Unlimited analyses', 'Priority AI processing', 'PDF report downloads', 'Job match engine'].map((f) => (
                                        <div key={f} className="flex items-center gap-2 text-sm text-[#C9D1D9]">
                                            <CheckCircle size={14} className="text-green-400 shrink-0" />
                                            {f}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <Link
                                        to="/pricing"
                                        className="flex-1 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors text-center"
                                    >
                                        View Plans
                                    </Link>
                                    <button
                                        onClick={() => setShowUpgradeModal(false)}
                                        className="flex-1 py-3 text-sm font-semibold text-[#8B949E] border border-white/10 hover:bg-white/5 rounded-xl transition-colors"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
