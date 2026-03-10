import { supabase } from '@/lib/supabase'

/**
 * Wires the upload form → backend /api/upload → AI engine pipeline.
 * Returns the analysisId to redirect to /processing/:id.
 */
export interface UploadPayload {
    file: File
    targetCompanies: string[]
    targetRole: string
    experienceLevel: string
    urgency: number
    weakness: string
}

export interface UploadResult {
    analysisId: string
    resumeId: string
    sessionId: string | null
}

export async function uploadAndAnalyse(payload: UploadPayload): Promise<UploadResult> {
    const formData = new FormData()
    formData.append('file', payload.file)
    formData.append('target_companies', JSON.stringify(payload.targetCompanies.filter(Boolean)))
    formData.append('target_role', payload.targetRole)
    formData.append('experience_level', payload.experienceLevel)
    formData.append('weakness', payload.weakness)
    formData.append('urgency', String(payload.urgency))

    const { data: { session } } = await supabase.auth.getSession()

    const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
            ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {}),
        },
        body: formData,
        signal: AbortSignal.timeout(60_000), // 60s timeout for upload
    })

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Upload failed' }))
        throw new Error(err.error || `Upload failed (${res.status})`)
    }

    const data = await res.json()

    if (!data.analysisId) {
        throw new Error(data.error || 'No analysis ID returned')
    }

    return {
        analysisId: data.analysisId,
        resumeId: data.resumeId,
        sessionId: data.sessionId ?? null,
    }
}

/**
 * Poll for analysis status.
 */
export interface AnalysisStatus {
    id: string
    status: 'processing' | 'complete' | 'failed'
    results?: any
}

export async function fetchAnalysisStatus(analysisId: string): Promise<AnalysisStatus> {
    const { data: { session } } = await supabase.auth.getSession()

    const res = await fetch(`/api/analysis/${analysisId}`, {
        headers: {
            ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {}),
        },
        signal: AbortSignal.timeout(15_000), // 15s timeout for status polling
    })
    if (!res.ok) throw new Error(`Status fetch failed (${res.status})`)
    return res.json()
}
