-- ═══════════════════════════════════════════════════════════════
-- ResumeIQ — RLS Security Fix Migration
-- Run this in Supabase SQL Editor to patch 3 critical breaches
-- Safe to run on existing databases (uses DROP IF EXISTS + CREATE)
-- ═══════════════════════════════════════════════════════════════

-- ════════════════════════════════════════
-- FIX 1: Scope service role policies (C5)
-- Old: USING (true) — accessible by ANY authenticated user
-- New: USING (auth.role() = 'service_role') — backend only
-- ════════════════════════════════════════

-- profiles
DROP POLICY IF EXISTS "Service role can do anything on profiles" ON profiles;
CREATE POLICY "Service role can do anything on profiles"
  ON profiles
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- resumes
DROP POLICY IF EXISTS "Service role full access to resumes" ON resumes;
CREATE POLICY "Service role full access to resumes"
  ON resumes
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- analyses
DROP POLICY IF EXISTS "Service role full access to analyses" ON analyses;
CREATE POLICY "Service role full access to analyses"
  ON analyses
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- analysis_results
DROP POLICY IF EXISTS "Service role full access to analysis_results" ON analysis_results;
CREATE POLICY "Service role full access to analysis_results"
  ON analysis_results
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- storage (resumes bucket)
DROP POLICY IF EXISTS "Service role can access all resumes" ON storage.objects;
CREATE POLICY "Service role can access all resumes"
  ON storage.objects FOR ALL
  USING (bucket_id = 'resumes' AND auth.role() = 'service_role');


-- ════════════════════════════════════════
-- FIX 2: Remove leaky share_token policy (C2)
-- Old: USING (share_token IS NOT NULL) — ALWAYS true, all rows visible
-- New: Removed. Share page uses backend service role instead.
-- ════════════════════════════════════════

DROP POLICY IF EXISTS "Anyone can read analyses by share token" ON analyses;
-- No replacement — share lookup handled by backend service role


-- ════════════════════════════════════════
-- FIX 3: analysis_results ownership-only (C3)
-- Old: user_id = auth.uid() OR share_token IS NOT NULL (always true)
-- New: user_id = auth.uid() only
-- ════════════════════════════════════════

DROP POLICY IF EXISTS "Users can read own analysis results" ON analysis_results;
CREATE POLICY "Users can read own analysis results"
  ON analysis_results FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM analyses
      WHERE analyses.id = analysis_results.analysis_id
        AND analyses.user_id = auth.uid()
    )
  );


-- ═══════════════════════════════════════
-- ✅ VERIFICATION QUERIES
-- Run these after applying the fix:
-- ═══════════════════════════════════════

-- Check all policies exist and are correct:
-- SELECT schemaname, tablename, policyname, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename IN ('profiles', 'resumes', 'analyses', 'analysis_results')
-- ORDER BY tablename, policyname;
