"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRouter = void 0;
const express_1 = require("express");
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const fileValidation_1 = require("../middleware/fileValidation");
const supabase_1 = require("../lib/supabase");
const auth_1 = require("../middleware/auth");
exports.uploadRouter = (0, express_1.Router)();
exports.uploadRouter.post('/upload', auth_1.validateJWT, fileValidation_1.upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            res.status(400).json({ error: 'No file uploaded', code: 'NO_FILE' });
            return;
        }
        const userId = req.userId || null;
        const sessionId = userId ? null : (0, uuid_1.v4)();
        const resumeId = (0, uuid_1.v4)();
        const analysisId = (0, uuid_1.v4)();
        // I4: Compute SHA256 hash for duplicate detection
        const sha256Hash = crypto_1.default.createHash('sha256').update(file.buffer).digest('hex');
        // Check for duplicate resume (same user, same file)
        if (userId) {
            const { data: existing } = await supabase_1.supabase
                .from('resumes')
                .select('id, analyses(id, status)')
                .eq('sha256_hash', sha256Hash)
                .eq('user_id', userId)
                .limit(1)
                .maybeSingle();
            if (existing?.analyses && Array.isArray(existing.analyses)) {
                const completeAnalysis = existing.analyses.find((a) => a.status === 'complete');
                if (completeAnalysis) {
                    res.json({
                        analysisId: completeAnalysis.id,
                        resumeId: existing.id,
                        sessionId: null,
                        duplicate: true,
                        message: 'This resume was already analysed. Showing existing results.',
                    });
                    return;
                }
            }
        }
        // ── Server-side monthly usage limit enforcement ──
        const PLAN_LIMITS = {
            free: 2,
            pro: Infinity,
            pay_per_use: Infinity,
        };
        let used = 0;
        if (userId) {
            const { data: profile } = await supabase_1.supabase
                .from('profiles')
                .select('plan, analyses_used_this_month, updated_at')
                .eq('id', userId)
                .single();
            if (profile) {
                // Monthly reset: if we're in a new month, reset the counter
                const lastUpdated = new Date(profile.updated_at);
                const now = new Date();
                if (lastUpdated.getMonth() !== now.getMonth() ||
                    lastUpdated.getFullYear() !== now.getFullYear()) {
                    await supabase_1.supabase.from('profiles').update({
                        analyses_used_this_month: 0,
                    }).eq('id', userId);
                    used = 0;
                }
                else {
                    used = profile.analyses_used_this_month || 0;
                }
                const limit = PLAN_LIMITS[profile.plan || 'free'] ?? 2;
                if (used >= limit) {
                    res.status(429).json({
                        error: 'Monthly analysis limit reached',
                        code: 'LIMIT_EXCEEDED',
                        limit,
                        used,
                        upgrade_url: '/pricing',
                    });
                    return;
                }
            }
        }
        // Parse metadata from form
        let targetCompanies = [];
        try {
            targetCompanies = JSON.parse(req.body.target_companies || '[]');
        }
        catch {
            targetCompanies = [];
        }
        const targetRole = req.body.target_role || '';
        const experienceLevel = req.body.experience_level || '';
        const urgency = parseInt(req.body.urgency) || 5;
        const weakness = req.body.weakness || '';
        // Sanitize filename to prevent path traversal and special char issues
        const sanitizedName = path_1.default.basename(file.originalname)
            .replace(/[^a-zA-Z0-9._-]/g, '_')
            .substring(0, 100);
        const storagePath = `${userId || sessionId}/${Date.now()}_${sanitizedName}`;
        const { error: storageError } = await supabase_1.supabase.storage
            .from('resumes')
            .upload(storagePath, file.buffer, {
            contentType: file.mimetype,
            upsert: true,
        });
        if (storageError) {
            console.error('Storage error:', storageError);
            res.status(500).json({ error: 'Failed to store file', code: 'STORAGE_ERROR' });
            return;
        }
        // Generate a signed URL for the AI engine to download the file
        // This is NOT stored in the DB — only used for the immediate AI call
        const { data: signedUrlData, error: signedUrlError } = await supabase_1.supabase.storage
            .from('resumes')
            .createSignedUrl(storagePath, 7200); // 2 hour expiry for AI processing
        if (signedUrlError || !signedUrlData?.signedUrl) {
            console.error('Signed URL error:', signedUrlError);
            await supabase_1.supabase.storage.from('resumes').remove([storagePath]);
            res.status(500).json({ error: 'Failed to generate file URL', code: 'URL_ERROR' });
            return;
        }
        const aiFileUrl = signedUrlData.signedUrl; // only for AI engine, not stored
        // Create resume record — store the STORAGE PATH, not the signed URL
        // Fresh signed URLs will be generated on-demand when file access is needed
        const { error: resumeError } = await supabase_1.supabase.from('resumes').insert({
            id: resumeId,
            user_id: userId,
            session_id: sessionId,
            file_name: file.originalname,
            file_url: storagePath, // storage path, NOT signed URL
            file_size: file.size,
            format: file.mimetype === 'application/pdf' ? 'pdf' : 'docx',
            sha256_hash: sha256Hash,
        });
        if (resumeError) {
            console.error('Resume insert error:', resumeError);
            await supabase_1.supabase.storage.from('resumes').remove([storagePath]);
            res.status(500).json({ error: 'Failed to save resume record', code: 'DB_ERROR' });
            return;
        }
        // Create analysis record with 'processing' status
        const { error: analysisError } = await supabase_1.supabase.from('analyses').insert({
            id: analysisId,
            resume_id: resumeId,
            user_id: userId,
            target_companies: targetCompanies,
            target_role: targetRole,
            experience_level: experienceLevel,
            urgency,
            weakness,
            status: 'processing',
        });
        if (analysisError) {
            console.error('Analysis insert error:', analysisError);
            // W2: Clean up BOTH storage file AND orphaned resume record
            await supabase_1.supabase.from('resumes').delete().eq('id', resumeId);
            await supabase_1.supabase.storage.from('resumes').remove([storagePath]);
            res.status(500).json({ error: 'Failed to create analysis record', code: 'DB_ERROR' });
            return;
        }
        // Increment monthly usage counter for authenticated users
        if (userId) {
            await supabase_1.supabase.from('profiles')
                .update({ analyses_used_this_month: used + 1 })
                .eq('id', userId);
        }
        // Respond immediately so frontend can navigate to /processing
        res.json({ analysisId, resumeId, sessionId });
        // ── Async: Call AI engine pipeline (fire-and-forget with retry) ─────
        const aiEngineUrl = process.env.AI_ENGINE_URL || 'http://localhost:8000';
        const aiPayload = {
            analysis_id: analysisId,
            resume_id: resumeId,
            file_url: aiFileUrl,
            file_format: file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? 'docx' : 'pdf',
            target_role: targetRole,
            target_companies: targetCompanies,
            experience_level: experienceLevel,
            urgency,
            weakness,
        };
        async function callAIEngineWithRetry(payload, maxRetries = 2) {
            let lastError;
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    const aiRes = await fetch(`${aiEngineUrl}/ai/analyse`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                        signal: AbortSignal.timeout(120_000), // 2 min per attempt
                    });
                    if (!aiRes.ok) {
                        const errText = await aiRes.text();
                        throw new Error(`AI engine returned ${aiRes.status}: ${errText}`);
                    }
                    return await aiRes.json();
                }
                catch (err) {
                    lastError = err;
                    if (attempt < maxRetries) {
                        const delay = attempt * 2000; // exponential: 2s, 4s
                        console.log(`[AI] Attempt ${attempt} failed, retrying in ${delay / 1000}s...`);
                        await new Promise(r => setTimeout(r, delay));
                    }
                }
            }
            throw lastError;
        }
        ;
        (async () => {
            try {
                console.log(`[AI] Starting analysis ${analysisId}...`);
                const aiData = await callAIEngineWithRetry(aiPayload);
                console.log(`[AI] Analysis ${analysisId} completed. Score: ${aiData?.ats_score}`);
                // Upsert results into analysis_results table
                const { error: resultError } = await supabase_1.supabase.from('analysis_results').upsert({
                    analysis_id: analysisId,
                    ats_score: aiData.ats_score,
                    ats_breakdown: aiData.ats_breakdown,
                    skills_found: aiData.skills_found,
                    skills_missing: aiData.skills_missing,
                    selection_verdict: aiData.selection_verdict,
                    selection_confidence: aiData.selection_confidence,
                    category: aiData.category,
                    improvement_tips: aiData.improvement_tips,
                    learning_plan: aiData.learning_plan,
                    highlight_map: aiData.highlight_map,
                    raw_text: aiData.raw_text,
                    created_at: new Date().toISOString(),
                }, { onConflict: 'analysis_id' });
                if (resultError) {
                    console.error('[AI] Failed to upsert results:', resultError);
                    throw new Error('DB upsert failed');
                }
                // Mark analysis as complete
                await supabase_1.supabase.from('analyses').update({ status: 'complete' }).eq('id', analysisId);
                console.log(`[AI] Analysis ${analysisId} saved to DB ✅`);
            }
            catch (aiError) {
                console.error(`[AI] Analysis ${analysisId} failed:`, aiError?.message || aiError);
                // Mark as failed so frontend polling can show error UI
                await supabase_1.supabase.from('analyses').update({ status: 'failed' }).eq('id', analysisId);
            }
        })();
    }
    catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Upload failed', code: 'UPLOAD_ERROR' });
    }
});
//# sourceMappingURL=upload.js.map