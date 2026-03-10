-- ═══════════════════════════════════════════════════════════════════════════
-- ResumeIQ — Complete Supabase Migration
-- Run this ENTIRE file in Supabase SQL Editor (once, on a fresh project)
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Extensions ──────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ════════════════════════════════════════════════
-- 1. PROFILES TABLE
-- Auto-populated on signup via auth trigger below
-- ════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT,
  full_name     TEXT,
  avatar_url    TEXT,
  plan          TEXT        NOT NULL DEFAULT 'free',  -- free | pro | enterprise
  analyses_used_this_month INT NOT NULL DEFAULT 0,
  monthly_limit INT         NOT NULL DEFAULT 2,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Service role bypass (backend uses service role key)
CREATE POLICY "Service role can do anything on profiles"
  ON profiles
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ════════════════════════════════════════════════
-- 2. RESUMES TABLE
-- ════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS resumes (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id  TEXT,                           -- for guest (non-logged-in) users
  file_name   TEXT        NOT NULL,
  file_url    TEXT        NOT NULL,           -- Supabase Storage public URL
  file_size   INT,
  format      TEXT        CHECK (format IN ('pdf', 'docx')),
  sha256_hash TEXT,                           -- dedup detection
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_session ON resumes(session_id) WHERE session_id IS NOT NULL;

-- RLS
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Authenticated users see own resumes
CREATE POLICY "Users can read own resumes"
  ON resumes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes"
  ON resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete own resumes"
  ON resumes FOR DELETE
  USING (auth.uid() = user_id);

-- Service role full access (backend)
CREATE POLICY "Service role full access to resumes"
  ON resumes
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ════════════════════════════════════════════════
-- 3. ANALYSES TABLE
-- ════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS analyses (
  id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id        UUID        REFERENCES resumes(id) ON DELETE CASCADE,
  user_id          UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  target_companies JSONB       NOT NULL DEFAULT '[]'::jsonb,
  target_role      TEXT,
  experience_level TEXT,
  urgency          INT         DEFAULT 5 CHECK (urgency BETWEEN 1 AND 10),
  weakness         TEXT,
  status           TEXT        NOT NULL DEFAULT 'processing'
                               CHECK (status IN ('processing', 'complete', 'failed')),
  share_token      UUID        NOT NULL DEFAULT uuid_generate_v4(),  -- for /share/:token
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_analyses_user_id     ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_resume_id   ON analyses(resume_id);
CREATE INDEX IF NOT EXISTS idx_analyses_share_token ON analyses(share_token);
CREATE INDEX IF NOT EXISTS idx_analyses_status      ON analyses(status);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at  ON analyses(created_at DESC);

-- RLS
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own analyses"
  ON analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
  ON analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own analyses"
  ON analyses FOR UPDATE
  USING (auth.uid() = user_id);

-- Share token lookup is handled by backend service role — no open RLS policy needed
-- (Old policy USING share_token IS NOT NULL was always true, leaking all rows)

-- Service role full access
CREATE POLICY "Service role full access to analyses"
  ON analyses
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ════════════════════════════════════════════════
-- 4. ANALYSIS RESULTS TABLE
-- ════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS analysis_results (
  id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_id         UUID        UNIQUE REFERENCES analyses(id) ON DELETE CASCADE,
  ats_score           INT         CHECK (ats_score BETWEEN 0 AND 100),
  ats_breakdown       JSONB,      -- { keyword_match, format_structure, contact_info, resume_length, consistency }
  skills_found        JSONB,      -- [{ name, level, category }]
  skills_missing      JSONB,      -- [{ name, importance, reason }]
  selection_verdict   TEXT        CHECK (selection_verdict IN ('selected', 'not_selected', 'borderline')),
  selection_confidence INT        CHECK (selection_confidence BETWEEN 0 AND 100),
  category            TEXT,       -- A | B | C | D (experience category)
  improvement_tips    JSONB,      -- [{ priority, section, issue, fix, impact }]
  learning_plan       JSONB,      -- [{ phase, title, duration, items }]
  highlight_map       JSONB,      -- [{ text, color, tooltip }]
  company_verdicts    JSONB,      -- { CompanyName: { verdict, confidence, role } }
  raw_text            TEXT,       -- original parsed resume text
  claude_summary      TEXT,       -- short summary from Claude
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ar_analysis_id ON analysis_results(analysis_id);
CREATE INDEX IF NOT EXISTS idx_ar_ats_score   ON analysis_results(ats_score);

-- RLS
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;

-- Users can read their own results (join through analyses — ownership only)
CREATE POLICY "Users can read own analysis results"
  ON analysis_results FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM analyses
      WHERE analyses.id = analysis_results.analysis_id
        AND analyses.user_id = auth.uid()
    )
  );

-- Service role full access (for backend share-page lookups, etc.)
CREATE POLICY "Service role full access to analysis_results"
  ON analysis_results
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ════════════════════════════════════════════════
-- 5. UPDATED_AT TRIGGER (profiles + analyses)
-- ════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_analyses_updated_at
  BEFORE UPDATE ON analyses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ════════════════════════════════════════════════
-- 6. AUTH TRIGGER — Auto-create profile on signup
-- ════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ════════════════════════════════════════════════
-- 7. STORAGE — resumes bucket policy
-- (Create the bucket manually in Supabase Dashboard first)
-- Then run these storage policies:
-- ════════════════════════════════════════════════

-- Allow authenticated users to upload their own resumes
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload own resumes"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'resumes'
    AND (auth.uid()::text = (storage.foldername(name))[1]
         OR auth.uid() IS NULL)  -- allow guest uploads
  );

CREATE POLICY "Users can view own resumes"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'resumes'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Service role can access all resumes"
  ON storage.objects FOR ALL
  USING (bucket_id = 'resumes' AND auth.role() = 'service_role');

-- ════════════════════════════════════════════════
-- 8. MONTHLY RESET FUNCTION (optional — run via cron)
-- Resets analyses_used_this_month on the 1st of each month
-- ════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.reset_monthly_usage()
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET analyses_used_this_month = 0
  WHERE plan = 'free';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ════════════════════════════════════════════════
-- ✅ Migration complete
-- Tables: profiles, resumes, analyses, analysis_results
-- Triggers: handle_new_user, set_updated_at
-- Storage: resumes bucket + policies
-- ════════════════════════════════════════════════
