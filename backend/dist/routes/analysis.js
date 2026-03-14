"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analysisRouter = void 0;
const express_1 = require("express");
const supabase_1 = require("../lib/supabase");
const auth_1 = require("../middleware/auth");
exports.analysisRouter = (0, express_1.Router)();
// GET /api/analyses — List all analyses for the authenticated user
exports.analysisRouter.get('/analyses', auth_1.validateJWT, async (req, res) => {
    try {
        const userId = req.userId;
        const { data: analyses, error } = await supabase_1.supabase
            .from('analyses')
            .select(`
                id,
                target_role,
                target_companies,
                status,
                created_at,
                resumes!inner (
                    file_name,
                    file_url
                ),
                analysis_results (
                    ats_score,
                    selection_verdict,
                    selection_confidence
                )
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Analyses fetch error:', error);
            res.status(500).json({ error: 'Failed to fetch analyses', code: 'FETCH_ERROR' });
            return;
        }
        const formatted = await Promise.all((analyses || []).map(async (a) => {
            // Generate fresh signed URL from stored path
            let pdfUrl = null;
            if (a.resumes?.file_url) {
                const { data: urlData } = await supabase_1.supabase.storage
                    .from('resumes')
                    .createSignedUrl(a.resumes.file_url, 3600);
                pdfUrl = urlData?.signedUrl || null;
            }
            return {
                id: a.id,
                created_at: a.created_at,
                status: a.status,
                resume_name: a.resumes?.file_name ?? 'Resume',
                target_company: (a.target_companies || [])[0] || 'General',
                target_role: a.target_role || '',
                ats_score: a.analysis_results?.[0]?.ats_score ?? 0,
                verdict: a.analysis_results?.[0]?.selection_verdict ?? 'unknown',
                pdf_url: pdfUrl,
            };
        }));
        res.json({ analyses: formatted });
    }
    catch (err) {
        console.error('Analyses list error:', err);
        res.status(500).json({ error: 'Failed to list analyses', code: 'LIST_ERROR' });
    }
});
// GET /api/analysis/:id — Return analysis + results if complete
exports.analysisRouter.get('/analysis/:id', auth_1.validateJWT, async (req, res) => {
    try {
        const { id } = req.params;
        const { data: analysis, error: analysisError } = await supabase_1.supabase
            .from('analyses')
            .select('*')
            .eq('id', id)
            .single();
        if (analysisError || !analysis) {
            res.status(404).json({ error: 'Analysis not found', code: 'NOT_FOUND' });
            return;
        }
        // Ownership check
        if (analysis.user_id && analysis.user_id !== req.userId) {
            res.status(403).json({ error: 'Access denied — you do not own this analysis', code: 'FORBIDDEN' });
            return;
        }
        let results = null;
        if (analysis.status === 'complete') {
            const { data } = await supabase_1.supabase
                .from('analysis_results')
                .select('*')
                .eq('analysis_id', id)
                .single();
            results = data;
        }
        // Generate fresh signed URL for the resume PDF
        let pdfUrl = null;
        if (analysis.resume_id) {
            const { data: resume } = await supabase_1.supabase
                .from('resumes')
                .select('file_url')
                .eq('id', analysis.resume_id)
                .single();
            if (resume?.file_url) {
                const { data: freshUrl } = await supabase_1.supabase.storage
                    .from('resumes')
                    .createSignedUrl(resume.file_url, 3600); // 1 hour
                pdfUrl = freshUrl?.signedUrl || null;
            }
        }
        res.json({ ...analysis, results, pdf_url: pdfUrl });
    }
    catch (err) {
        console.error('Analysis fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch analysis', code: 'FETCH_ERROR' });
    }
});
// POST /api/analysis/:id/job-match — JD matching
exports.analysisRouter.post('/analysis/:id/job-match', auth_1.validateJWT, async (req, res) => {
    try {
        const { id } = req.params;
        const { jobDescription } = req.body;
        if (!jobDescription) {
            res.status(400).json({ error: 'Job description is required', code: 'MISSING_JD' });
            return;
        }
        // Ownership check — prevent users from accessing other users' analyses
        const { data: analysis } = await supabase_1.supabase
            .from('analyses')
            .select('user_id')
            .eq('id', id)
            .single();
        if (!analysis) {
            res.status(404).json({ error: 'Analysis not found', code: 'NOT_FOUND' });
            return;
        }
        if (analysis.user_id && analysis.user_id !== req.userId) {
            res.status(403).json({ error: 'Access denied — you do not own this analysis', code: 'FORBIDDEN' });
            return;
        }
        // Fetch the resume's raw_text from analysis_results
        const { data: result, error: resultError } = await supabase_1.supabase
            .from('analysis_results')
            .select('raw_text')
            .eq('analysis_id', id)
            .single();
        if (resultError || !result?.raw_text) {
            res.status(404).json({ error: 'Analysis results not found — the analysis may still be processing', code: 'RESULTS_NOT_FOUND' });
            return;
        }
        // Call the Python AI engine
        const aiEngineUrl = process.env.AI_ENGINE_URL || 'http://localhost:8000';
        const aiRes = await fetch(`${aiEngineUrl}/ai/job-match`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                resume_text: result.raw_text,
                job_description: jobDescription,
            }),
            signal: AbortSignal.timeout(30_000), // 30s timeout
        });
        if (!aiRes.ok) {
            const errText = await aiRes.text();
            console.error(`AI job-match returned ${aiRes.status}: ${errText}`);
            res.status(502).json({ error: 'AI engine returned an error', code: 'AI_ERROR' });
            return;
        }
        const aiData = await aiRes.json();
        res.json(aiData);
    }
    catch (err) {
        console.error('Job match error:', err?.message || err);
        if (err?.name === 'TimeoutError' || err?.name === 'AbortError') {
            res.status(504).json({ error: 'AI engine timed out', code: 'AI_TIMEOUT' });
        }
        else {
            res.status(500).json({ error: 'Job matching failed', code: 'MATCH_ERROR' });
        }
    }
});
//# sourceMappingURL=analysis.js.map