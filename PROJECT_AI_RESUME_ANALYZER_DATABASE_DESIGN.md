+---------------------------------------------------------------------------------------------------+
| **PROJECT_AI_RESUME_ANALYZER**                                                                    |
|                                                                                                   |
| *Database Design & Architecture Document*                                                         |
|                                                                                                   |
| *Final version --- synthesised from both engineering briefs*                                      |
|                                                                                                   |
| *PostgreSQL + Redis + pgvector + S3 \| 18 Tables \| 4 Schemas \| Full Index & Security Reference* |
+---------------------------------------------------------------------------------------------------+

+-------------+-------------+-------------+-------------+--------------+
| **18**      | **4**       | **3**       | **6**       | **4**        |
|             |             |             |             |              |
| Tables      | Schemas     | DB Types    | AI Models   | Auth Methods |
+-------------+-------------+-------------+-------------+--------------+

+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **What This Document Covers**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| This is the complete, production-grade database design for the AI Resume Analyzer platform. It merges and extends both engineering briefs into one authoritative reference. It covers all 18 tables across 4 PostgreSQL schemas, every foreign key relationship, foreign key ON DELETE behaviour, full indexing strategy with index types and rationale, Redis caching and job queue design, pgvector embedding architecture, row-level security, data classification, retention policy, and migration rules. |
|                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Stack: PostgreSQL 15+ (primary relational) · Redis 7 (sessions, cache, queues) · pgvector extension (embeddings) · S3-compatible object store (files) · Optional: Pinecone/Weaviate for enterprise scale.                                                                                                                                                                                                                                                                                                     |
+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

  -----------------------------------------------------------------------
  **DOCUMENT SECTIONS**

  -----------------------------------------------------------------------

  ------- -----------------------------------------------------------------
  **1**   System Overview & Architecture Philosophy

  ------- -----------------------------------------------------------------

  ------- -----------------------------------------------------------------
  **2**   High-Level Architecture & Data Flow

  ------- -----------------------------------------------------------------

  ------- -----------------------------------------------------------------
  **3**   Schema: auth --- Users, Sessions, API Keys

  ------- -----------------------------------------------------------------

  ------- -----------------------------------------------------------------
  **4**   Schema: resume --- Files, Parsing, Sections

  ------- -----------------------------------------------------------------

  ------- -----------------------------------------------------------------
  **5**   Schema: analysis --- AI Output & Scoring

  ------- -----------------------------------------------------------------

  ------- -----------------------------------------------------------------
  **6**   Schema: billing --- Plans, Subscriptions

  ------- -----------------------------------------------------------------

  ------- -----------------------------------------------------------------
  **7**   Master Reference Tables (Skills, Job Roles)

  ------- -----------------------------------------------------------------

  ------- -----------------------------------------------------------------
  **8**   Vector Database Design (pgvector)

  ------- -----------------------------------------------------------------

  ------- -----------------------------------------------------------------
  **9**   Redis: Cache, Sessions & Job Queues

  ------- -----------------------------------------------------------------

  -------- -----------------------------------------------------------------
  **10**   Full ERD Relationship Map

  -------- -----------------------------------------------------------------

  -------- -----------------------------------------------------------------
  **11**   Indexing Strategy --- Complete Reference

  -------- -----------------------------------------------------------------

  -------- -----------------------------------------------------------------
  **12**   Data Security, Retention & Compliance

  -------- -----------------------------------------------------------------

  -------- -----------------------------------------------------------------
  **13**   Scalability & Migration Strategy

  -------- -----------------------------------------------------------------

**1.1 Product Context**

The AI Resume Analyzer is a web platform that accepts uploaded PDF and DOCX resumes, runs them through an AI pipeline (document parsing, NLP, text classification, embeddings, ATS simulation), and returns a company-specific and role-specific verdict: whether the candidate would be selected, their full ATS score breakdown, skill gap analysis, improvement tips, and a structured learning/improvement roadmap. The database must support all of this without bottlenecking the pipeline at any scale.

**1.2 Why Three Database Types?**

A production AI platform cannot be served by a single relational database. Each type in this stack is chosen because it is the correct tool for a specific data access pattern.

  -------------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **PostgreSQL 15+**   Primary relational store for all structured business data: users, resumes, analyses, billing, audit logs. Chosen for ACID compliance, strong JSONB support, row-level security, mature tooling, and the pgvector extension that allows storing embeddings alongside relational data in one ACID-compliant store.

  -------------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  ------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Redis 7**   In-memory store for three distinct use cases: (1) Session management --- fast token lookup with TTL expiry. (2) Job queue --- workers pull analysis tasks via BullMQ/Celery. (3) Result caching --- completed analysis results cached with 24h TTL to avoid re-running expensive AI pipelines for identical resume+role combinations.

  ------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  ------------------------ --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **pgvector (PG ext.)**   Vector storage for resume embeddings and job-role embeddings. Stored directly in PostgreSQL using the pgvector extension --- embeddings live alongside source data in one query with full ACID guarantees. Uses cosine similarity search (SELECT \... ORDER BY embedding \<=\> query_vector) as the core of ATS match scoring.

  ------------------------ --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  --------------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **S3 Object Store**   Binary file storage for original PDF/DOCX resumes. Never stored in the relational DB --- only the S3 object key is stored in PostgreSQL. Provides: scalable file storage, CDN integration, versioning, signed URL generation for secure downloads, and lifecycle policies for automatic file expiry.

  --------------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  ------------------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Pinecone / Weaviate**   Optional enterprise-scale vector DB. When the platform exceeds \~10M embeddings or requires sub-10ms ANN query latency, vector storage can be migrated from pgvector to a dedicated vector database. The schema design anticipates this migration --- entity_type + entity_id columns allow a standalone vectors table to be extracted.

  ------------------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**1.3 Seven Design Principles**

  -------------------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Normalisation to 3NF**   All relational tables normalised to Third Normal Form. No data duplication across user-facing tables. AI analysis outputs are intentionally kept as JSONB blobs to allow schema evolution without migrations.

  -------------------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  ----------------------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Soft Deletes Everywhere**   No hard DELETE on user data, resumes, or analyses. All tables carry deleted_at TIMESTAMPTZ NULL. Enables account recovery, full audit trails, GDPR deletion (set deleted_at + scrub PII), and production debugging.

  ----------------------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  ------------------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Immutable Audit Log**   A separate audit_logs table records every state change. Append-only --- never updated, never deleted. Required for compliance reporting and debugging without touching live tables.

  ------------------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  ------------------------------ ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Row-Level Security (RLS)**   PostgreSQL RLS policies enforce that users can only query their own data at the database level --- not just the application layer. This prevents data leaks even if application-level auth is bypassed.

  ------------------------------ ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  ----------------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------
  **UUID Primary Keys**   All primary keys use gen_random_uuid(). Prevents enumeration attacks, enables distributed ID generation, and makes future horizontal sharding straightforward.

  ----------------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------

  ---------------------------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **JSONB for Flexible AI Output**   Analysis results (improvement tips, skill maps, ATS sub-scores, JD rewrites) stored as JSONB. Allows the AI output schema to evolve without database migrations. Indexed with GIN for fast containment queries.

  ---------------------------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  ----------------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Versioned Resumes**   Each upload creates a new resume record --- previous versions are retained. Users track score improvement over time. Analysis FK always points to the specific version analysed, not the latest.

  ----------------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**1.4 Four Logical Schemas**

Tables are grouped into four PostgreSQL schemas --- a namespace separation that allows independent permissioning and connection routing.

  -------------- ---------------- ------------------------------------------------------------------------------------------
  **Schema**     **Tables**       **Responsibility**

  **auth**       4 tables         Users, auth providers, sessions, API keys, OAuth tokens

  **resume**     4 tables         Resume versions, parsed sections, raw text, file metadata, parse jobs

  **analysis**   7 tables         ATS scores, skills, improvement tips, job matches, JD comparisons, embeddings, companies

  **billing**    4 tables         Plans, subscriptions, organisations (B2B), usage events, invoices
  -------------- ---------------- ------------------------------------------------------------------------------------------

**2.1 System Architecture Tiers**

The platform is composed of five tiers. Understanding this layering is essential to understanding where each database type fits and why.

  ------------------------------ -----------------------------------------------------------------------------------------------------------------
  **Frontend (React/Next.js)**   Upload UI, dashboard, progress bar, colour-highlight viewer, resume editor, skill map, progress tracking charts

  ------------------------------ -----------------------------------------------------------------------------------------------------------------

  ------------------------------------- -----------------------------------------------------------------------------------------------------------------------------------
  **Backend API (FastAPI / Node.js)**   REST + WebSocket endpoints. Authenticated via session token. Routes requests to processing services. Enforces plan feature gates.

  ------------------------------------- -----------------------------------------------------------------------------------------------------------------------------------

  ---------------------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **AI Processing Pipeline**   Eight-stage pipeline: Document Parser → NLP Structurer → Text Classifier → Implicit Skill Extractor → Embeddings Engine → ATS Simulation → Claude API Tip Generator → Highlight Mapper

  ---------------------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  --------------------------------- ----------------------------------------------------------------------------------------------------------------------------------------
  **Message Queue (Redis Lists)**   Decouples upload from processing. Workers consume from queue. Enables horizontal scaling of AI workers independently of the API layer.

  --------------------------------- ----------------------------------------------------------------------------------------------------------------------------------------

  ------------------- -------------------------------------------------------------------------------------------------------------------------
  **Storage Layer**   PostgreSQL (relational + vectors), Redis (sessions/cache/queues), S3 (binary files). See Sections 3--9 for full detail.

  ------------------- -------------------------------------------------------------------------------------------------------------------------

**2.2 Data Flow: Upload to Dashboard**

+------------------------------------------------------------------------+
| 1\. User uploads PDF → Backend validates file → Writes to S3           |
|                                                                        |
| → Creates resume.resumes record → Inserts parsing_jobs row             |
|                                                                        |
| → Trigger publishes job_id to Redis queue:parse_jobs                   |
|                                                                        |
| 2\. Parse Worker (Redis BRPOP) → Reads PDF from S3                     |
|                                                                        |
| → Document Parser extracts text → NLP maps to sections                 |
|                                                                        |
| → Writes resume.parsed_sections → Writes resume.raw_text_store         |
|                                                                        |
| → Updates parsing_jobs status=\'completed\'                            |
|                                                                        |
| → Publishes run_id to Redis queue:analysis_jobs                        |
|                                                                        |
| 3\. Analysis Worker → Reads parsed data from PostgreSQL                |
|                                                                        |
| → Runs Text Classifier → Skill Extractor → Embeddings                  |
|                                                                        |
| → ATS Simulation → Claude API for tips → Highlight Mapper              |
|                                                                        |
| → Writes to: analysis_runs, ats_scores, skill_extractions,             |
|                                                                        |
| improvement_tips, job_matches, jd_comparisons, resume_embeddings       |
|                                                                        |
| → Updates Redis job:status:{run_id} at each stage (live progress bar)  |
|                                                                        |
| 4\. Frontend WebSocket → Polls Redis job:status → Updates progress bar |
|                                                                        |
| → On status=\'completed\' → fetches full dashboard from PostgreSQL     |
+------------------------------------------------------------------------+

**3.1 Overview**

The auth schema manages the complete identity lifecycle. Three authentication methods are supported: email/password, OAuth (Google, LinkedIn), and API key (B2B tier). Session tokens live in Redis for fast TTL-based lookup; PostgreSQL stores the audit trail. The users table is the root anchor for all other schemas via user_id foreign keys.

**3.2 auth.users**

  --------------------------------------------------- -------------------
  **TABLE: auth.users**                               **PK: user_id**

  --------------------------------------------------- -------------------

  ---------------------------- --------------- ---------------------- --------------------------------------------------------------------
  **Column Name**              **Data Type**   **Constraints**        **Description**

  **user_id**                  UUID            **PK, NOT NULL**       Primary key --- gen_random_uuid()

  **email**                    VARCHAR(320)    **UNIQUE, NOT NULL**   Normalised to lowercase. 320 chars = RFC 5321 maximum

  **email_verified**           BOOLEAN         **DEFAULT FALSE**      Set TRUE after verification token confirmed

  **password_hash**            TEXT            **NULLABLE**           Argon2id hash. NULL for OAuth-only accounts. Never bcrypt.

  **full_name**                VARCHAR(200)    **NOT NULL**           Display name from signup or OAuth profile

  **avatar_url**               TEXT            **NULLABLE**           S3 URL from OAuth provider or user upload

  **account_type**             VARCHAR(20)     **DEFAULT \'free\'**   ENUM: free \| pro \| enterprise. Denormalised for fast auth checks

  **monthly_analysis_limit**   INTEGER         **DEFAULT 2**          Limit for current plan. Updated by trigger on plan change

  **analyses_used**            INTEGER         **DEFAULT 0**          Rolling monthly counter. Reset by cron on billing cycle

  **locale**                   VARCHAR(10)     **DEFAULT \'en\'**     ISO 639-1 language code for UI and AI output language

  **timezone**                 VARCHAR(50)     **DEFAULT \'UTC\'**    IANA timezone for scheduled reminders

  **last_login_at**            TIMESTAMPTZ     **NULLABLE**           Updated on every successful login

  **created_at**               TIMESTAMPTZ     **DEFAULT NOW()**      Account creation timestamp

  **updated_at**               TIMESTAMPTZ     **DEFAULT NOW()**      Auto-updated by trigger on any row change

  **deleted_at**               TIMESTAMPTZ     **NULLABLE**           Soft delete. PII scrubbed on GDPR deletion request
  ---------------------------- --------------- ---------------------- --------------------------------------------------------------------

  -----------------------------------------------------------------------
  **INDEXES**

  -----------------------------------------------------------------------

  -------------------------- ------------------------------------- -------------------- ---------------------------------------
  **Index Name**             **Columns**                           **Type**             **Reason**

  **idx_users_email**        email                                 **UNIQUE B-Tree**    Fast login lookup

  **idx_users_account**      account_type                          **B-Tree**           Filter by plan for analytics

  **idx_users_active**       email (partial: deleted_at IS NULL)   **Partial B-Tree**   Exclude soft-deleted from all queries

  **idx_users_created_at**   created_at DESC                       **B-Tree**           User growth analytics
  -------------------------- ------------------------------------- -------------------- ---------------------------------------

  -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
  *NOTE: account_type is denormalised from billing.subscriptions to avoid a JOIN on every authenticated request. A trigger keeps it in sync when subscription changes.*

  *SECURITY: password_hash uses Argon2id: memory=65536, iterations=3, parallelism=4. Never bcrypt in 2025.*
  -----------------------------------------------------------------------------------------------------------------------------------------------------------------------

**3.3 auth.auth_providers**

  --------------------------------------------------- ---------------------
  **TABLE: auth.auth_providers**                      **PK: provider_id**

  --------------------------------------------------- ---------------------

  ---------------------- --------------- ----------------------- ----------------------------------------------------------------
  **Column Name**        **Data Type**   **Constraints**         **Description**

  **provider_id**        UUID            **PK, NOT NULL**        Primary key

  **user_id**            UUID            **FK, NOT NULL, IDX**   References auth.users

  **provider_name**      VARCHAR(50)     **NOT NULL**            ENUM: google \| linkedin \| github \| email

  **provider_user_id**   VARCHAR(255)    **NOT NULL**            UID from OAuth provider (e.g. Google sub claim)

  **access_token**       TEXT            **NULLABLE**            AES-256-GCM encrypted. For providers issuing long-lived tokens

  **refresh_token**      TEXT            **NULLABLE**            AES-256-GCM encrypted. Used to refresh access_token

  **token_expires_at**   TIMESTAMPTZ     **NULLABLE**            Access token expiry. NULL = non-expiring

  **scope**              TEXT\[\]        **NULLABLE**            Array of OAuth scopes granted

  **profile_data**       JSONB           **NULLABLE**            Raw profile JSON from provider at last sync

  **created_at**         TIMESTAMPTZ     **DEFAULT NOW()**       When this provider was linked

  **last_used_at**       TIMESTAMPTZ     **NULLABLE**            Last successful OAuth login via this provider
  ---------------------- --------------- ----------------------- ----------------------------------------------------------------

  -----------------------------------------------------------------------
  **FOREIGN KEYS**

  -----------------------------------------------------------------------

  ---------------- --------------------- --------------- -------------------------------------------
  **Column**       **References**        **On Delete**   **Purpose**

  **user_id**      auth.users(user_id)   **CASCADE**     Remove provider link when account deleted
  ---------------- --------------------- --------------- -------------------------------------------

  -----------------------------------------------------------------------
  **INDEXES**

  -----------------------------------------------------------------------

  ---------------------------- --------------------------------- ------------------- ----------------------------------------
  **Index Name**               **Columns**                       **Type**            **Reason**

  **idx_ap_user_id**           user_id                           **B-Tree**          All providers for a user

  **idx_ap_provider_unique**   provider_name, provider_user_id   **UNIQUE B-Tree**   Prevent duplicate OAuth provider links
  ---------------------------- --------------------------------- ------------------- ----------------------------------------

  -----------------------------------------------------------------------------------------------------------------------------------------
  *SECURITY: access_token and refresh_token are encrypted at application layer before INSERT. The DB never holds plaintext OAuth tokens.*

  -----------------------------------------------------------------------------------------------------------------------------------------

**3.4 auth.sessions**

  --------------------------------------------------- --------------------
  **TABLE: auth.sessions**                            **PK: session_id**

  --------------------------------------------------- --------------------

  ---------------------- --------------- ----------------------- --------------------------------------------------------------
  **Column Name**        **Data Type**   **Constraints**         **Description**

  **session_id**         UUID            **PK, NOT NULL**        Session ID --- also the Redis key suffix

  **user_id**            UUID            **FK, NOT NULL, IDX**   References auth.users

  **session_token**      VARCHAR(512)    **UNIQUE, NOT NULL**    SHA-256 hash of the raw token. Raw token lives in Redis only

  **ip_address**         INET            **NULLABLE**            Client IP at session creation

  **user_agent**         TEXT            **NULLABLE**            Browser/device string for security audit

  **device_type**        VARCHAR(20)     **NULLABLE**            ENUM: web \| mobile \| api \| cli

  **country_code**       CHAR(2)         **NULLABLE**            ISO 3166-1 alpha-2 from IP geolookup

  **is_active**          BOOLEAN         **DEFAULT TRUE**        FALSE on explicit logout or token rotation

  **created_at**         TIMESTAMPTZ     **DEFAULT NOW()**       Session start timestamp

  **expires_at**         TIMESTAMPTZ     **NOT NULL**            Hard expiry. Mirrored as Redis TTL

  **last_activity_at**   TIMESTAMPTZ     **NULLABLE**            Rolling update on each authenticated request

  **revoked_at**         TIMESTAMPTZ     **NULLABLE**            Set on logout or security-triggered invalidation

  **revoke_reason**      VARCHAR(100)    **NULLABLE**            ENUM: logout \| expired \| security_reset \| admin
  ---------------------- --------------- ----------------------- --------------------------------------------------------------

  -----------------------------------------------------------------------
  **FOREIGN KEYS**

  -----------------------------------------------------------------------

  ---------------- --------------------- --------------- -------------------------------------
  **Column**       **References**        **On Delete**   **Purpose**

  **user_id**      auth.users(user_id)   **CASCADE**     Sessions purged on account deletion
  ---------------- --------------------- --------------- -------------------------------------

  -----------------------------------------------------------------------
  **INDEXES**

  -----------------------------------------------------------------------

  -------------------------- -------------------- ------------------- ---------------------------------------------
  **Index Name**             **Columns**          **Type**            **Reason**

  **idx_sessions_user**      user_id, is_active   **B-Tree**          List active sessions for security dashboard

  **idx_sessions_token**     session_token        **UNIQUE B-Tree**   Token lookup on every authenticated request

  **idx_sessions_expires**   expires_at           **B-Tree**          Cron job to purge expired sessions
  -------------------------- -------------------- ------------------- ---------------------------------------------

  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  *ARCHITECTURE: Raw token lives in Redis with TTL (format: session:{session_id}). PostgreSQL stores hashed copy for audit only. Every request validates against Redis --- zero DB hit per request.*

  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**3.5 auth.api_keys**

  --------------------------------------------------- -------------------
  **TABLE: auth.api_keys**                            **PK: key_id**

  --------------------------------------------------- -------------------

  -------------------- --------------- ----------------------- ----------------------------------------------------------
  **Column Name**      **Data Type**   **Constraints**         **Description**

  **key_id**           UUID            **PK, NOT NULL**        Primary key

  **user_id**          UUID            **FK, NOT NULL, IDX**   Owner

  **org_id**           UUID            **FK, NULLABLE, IDX**   B2B: owning organisation. NULL for individual users

  **key_hash**         VARCHAR(64)     **UNIQUE, NOT NULL**    SHA-256 of the raw key. Raw key shown to user once only

  **key_prefix**       CHAR(8)         **NOT NULL**            First 8 chars of raw key for display (e.g. \'riq_live\')

  **name**             VARCHAR(100)    **NOT NULL**            Human label e.g. \'College Integration Key\'

  **permissions**      TEXT\[\]        **NOT NULL**            Array: read \| write \| analyse \| admin

  **rate_limit_rpm**   INTEGER         **DEFAULT 60**          Requests per minute. Enforced by Redis sliding window

  **last_used_at**     TIMESTAMPTZ     **NULLABLE**            Last authenticated API request

  **expires_at**       TIMESTAMPTZ     **NULLABLE**            NULL = non-expiring

  **created_at**       TIMESTAMPTZ     **DEFAULT NOW()**       Key creation timestamp

  **revoked_at**       TIMESTAMPTZ     **NULLABLE**            Set when key is manually revoked
  -------------------- --------------- ----------------------- ----------------------------------------------------------

  -----------------------------------------------------------------------
  **FOREIGN KEYS**

  -----------------------------------------------------------------------

  ---------------- ------------------------------- --------------- --------------------------------
  **Column**       **References**                  **On Delete**   **Purpose**

  **user_id**      auth.users(user_id)             **CASCADE**     Keys deleted when user deleted

  **org_id**       billing.organisations(org_id)   **SET NULL**    Key persists if org dissolved
  ---------------- ------------------------------- --------------- --------------------------------

  -----------------------------------------------------------------------
  **INDEXES**

  -----------------------------------------------------------------------

  ---------------------- ------------------ ------------------- -------------------------------------
  **Index Name**         **Columns**        **Type**            **Reason**

  **idx_apikeys_hash**   key_hash           **UNIQUE B-Tree**   Fast lookup on every API request

  **idx_apikeys_user**   user_id            **B-Tree**          List keys per user in management UI
  ---------------------- ------------------ ------------------- -------------------------------------

  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  *SECURITY: Raw key format: \'riq_live\_\' + 32 random bytes base62 encoded. SHA-256 only stored. Zero-knowledge design. Rate limiting enforced at Redis level (sliding window on key_hash), not by DB query.*

  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**4.1 Overview**

The resume schema manages the complete lifecycle from binary upload to AI-consumable structured data. Every upload creates a new versioned record --- previous versions are never overwritten. The parsed_sections table stores the AI-structured breakdown. raw_text_store keeps the clean extracted text for full-text search. parsing_jobs provides the audit trail and queue coordination for the AI pipeline.

**4.2 resume.resumes**

  --------------------------------------------------- -------------------
  **TABLE: resume.resumes**                           **PK: resume_id**

  --------------------------------------------------- -------------------

  ------------------------ --------------- ------------------------- -----------------------------------------------------------------------------
  **Column Name**          **Data Type**   **Constraints**           **Description**

  **resume_id**            UUID            **PK, NOT NULL**          Primary key

  **user_id**              UUID            **FK, NOT NULL, IDX**     Owner --- references auth.users

  **resume_title**         VARCHAR(200)    **NULLABLE**              User-given label e.g. \'Software Engineer v2\'

  **version_number**       INTEGER         **NOT NULL**              Auto-incremented per user. User\'s 1st = 1, 2nd = 2, etc.

  **original_file_url**    TEXT            **NULLABLE**              Legacy field --- S3 signed URL (generated on request, not stored)

  **s3_object_key**        TEXT            **UNIQUE, NOT NULL**      S3 path: resumes/{user_id}/{resume_id}.{ext}

  **s3_bucket**            VARCHAR(100)    **NOT NULL**              S3 bucket name. Allows multi-region routing

  **file_name**            VARCHAR(255)    **NOT NULL**              Original filename as uploaded

  **file_size_bytes**      INTEGER         **NOT NULL**              For storage quota tracking

  **file_format**          VARCHAR(10)     **NOT NULL**              ENUM: pdf \| docx

  **mime_type**            VARCHAR(100)    **NOT NULL**              application/pdf or OOXML mime type

  **checksum_sha256**      VARCHAR(64)     **NOT NULL**              File checksum. Deduplication + integrity check

  **parse_status**         VARCHAR(20)     **DEFAULT \'pending\'**   ENUM: pending \| processing \| completed \| failed \| ocr_required

  **is_ocr_processed**     BOOLEAN         **DEFAULT FALSE**         TRUE if OCR pipeline was used (scanned PDF)

  **ocr_confidence**       DECIMAL(5,2)    **NULLABLE**              OCR accuracy 0-100. NULL if not OCR

  **language_detected**    CHAR(5)         **NULLABLE**              ISO 639-1 detected language

  **column_count**         SMALLINT        **NULLABLE**              1 or 2 columns detected. Critical ATS Format Score input

  **page_count**           SMALLINT        **NULLABLE**              Total pages in document

  **word_count**           INTEGER         **NULLABLE**              Total word count post-parse

  **current_version_id**   UUID            **NULLABLE**              Self-referential: points to the most recent version for this resume lineage

  **is_active_version**    BOOLEAN         **DEFAULT TRUE**          Only one active version per user per role at a time

  **upload_date**          TIMESTAMPTZ     **DEFAULT NOW()**         Upload timestamp (alias: created_at for API compatibility)

  **deleted_at**           TIMESTAMPTZ     **NULLABLE**              Soft delete. S3 file retained per retention policy
  ------------------------ --------------- ------------------------- -----------------------------------------------------------------------------

  -----------------------------------------------------------------------
  **FOREIGN KEYS**

  -----------------------------------------------------------------------

  ---------------- --------------------- --------------- ------------------------------------
  **Column**       **References**        **On Delete**   **Purpose**

  **user_id**      auth.users(user_id)   **CASCADE**     Resumes purged on account deletion
  ---------------- --------------------- --------------- ------------------------------------

  -----------------------------------------------------------------------
  **INDEXES**

  -----------------------------------------------------------------------

  ----------------------------- --------------------------------- -------------------- ---------------------------------
  **Index Name**                **Columns**                       **Type**             **Reason**

  **idx_resumes_user**          user_id                           **B-Tree**           All resumes for a user

  **idx_resumes_user_active**   user_id, is_active_version        **B-Tree**           Fetch current active resume

  **idx_resumes_checksum**      checksum_sha256                   **B-Tree**           Duplicate upload detection

  **idx_resumes_parse**         parse_status (partial: pending)   **Partial B-Tree**   Worker queue fetch pending jobs
  ----------------------------- --------------------------------- -------------------- ---------------------------------

  -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
  *NOTE: original_file_url from ChatGPT brief retained as field for API backward-compatibility but S3 signed URLs are generated on demand --- never stored in DB.*

  *NOTE: checksum_sha256 detects when a user re-uploads an identical file. When match found, skip re-parsing and reuse existing parsed_sections --- major cost saving.*

  *NOTE: column_count is a primary input to ATS Format Score. Two-column resume automatically loses Format Score points regardless of content.*
  -----------------------------------------------------------------------------------------------------------------------------------------------------------------------

**4.3 resume.parsed_sections**

  --------------------------------------------------- --------------------
  **TABLE: resume.parsed_sections**                   **PK: section_id**

  --------------------------------------------------- --------------------

  ---------------------- --------------- ----------------------- -----------------------------------------------------------------------------------------------------------------
  **Column Name**        **Data Type**   **Constraints**         **Description**

  **section_id**         UUID            **PK, NOT NULL**        Primary key

  **resume_id**          UUID            **FK, NOT NULL, IDX**   Parent resume version

  **section_type**       VARCHAR(50)     **NOT NULL**            ENUM: contact \| summary \| experience \| education \| skills \| projects \| certifications \| awards \| custom

  **section_label**      VARCHAR(100)    **NOT NULL**            Original label as found in resume e.g. \'Where I Worked\'

  **section_content**    TEXT            **NOT NULL**            Full raw text of this section (maps to ChatGPT: section_content)

  **sequence_order**     SMALLINT        **NOT NULL**            Position in document (1-based) --- used for visual ordering

  **start_position**     INTEGER         **NULLABLE**            Character offset start in full_text --- maps visual highlights

  **end_position**       INTEGER         **NULLABLE**            Character offset end in full_text --- maps visual highlights

  **structured_data**    JSONB           **NOT NULL**            AI-structured content. Schema varies by section_type

  **confidence_score**   DECIMAL(4,3)    **NOT NULL**            0.000-1.000. NLP classification confidence

  **token_count**        INTEGER         **NULLABLE**            Token count for AI API cost tracking

  **created_at**         TIMESTAMPTZ     **DEFAULT NOW()**       Parsing timestamp
  ---------------------- --------------- ----------------------- -----------------------------------------------------------------------------------------------------------------

  -----------------------------------------------------------------------
  **FOREIGN KEYS**

  -----------------------------------------------------------------------

  ---------------- --------------------------- --------------- ------------------------------
  **Column**       **References**              **On Delete**   **Purpose**

  **resume_id**    resume.resumes(resume_id)   **CASCADE**     Sections deleted with resume
  ---------------- --------------------------- --------------- ------------------------------

  -----------------------------------------------------------------------
  **INDEXES**

  -----------------------------------------------------------------------

  ----------------------- ------------------------- ------------ ---------------------------
  **Index Name**          **Columns**               **Type**     **Reason**

  **idx_ps_resume**       resume_id                 **B-Tree**   All sections for a resume

  **idx_ps_type**         resume_id, section_type   **B-Tree**   Get specific section type

  **idx_ps_structured**   structured_data           **GIN**      JSONB containment search
  ----------------------- ------------------------- ------------ ---------------------------

  -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  *NOTE: start_position + end_position (from ChatGPT brief) are the character offsets used by the visual highlight engine to map tooltip feedback to exact resume locations.*

  *JSONB SCHEMA experience: {company, role, start_date, end_date, is_current, bullets:\[{text, quality_signal, has_metric, action_verb}\]}*

  *JSONB SCHEMA skills: {technical:\[\], soft:\[\], tools:\[\], domain:\[\], languages:\[\]}*
  -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**4.4 resume.raw_text_store**

  --------------------------------------------------- -------------------
  **TABLE: resume.raw_text_store**                    **PK: text_id**

  --------------------------------------------------- -------------------

  ------------------- --------------- -------------------------- ------------------------------------------------------------------
  **Column Name**     **Data Type**   **Constraints**            **Description**

  **text_id**         UUID            **PK, NOT NULL**           Primary key

  **resume_id**       UUID            **FK, UNIQUE, NOT NULL**   One-to-one with resume

  **parsed_text**     TEXT            **NOT NULL**               Full parsed text --- maps to ChatGPT resume_versions.parsed_text

  **full_text_tsv**   TSVECTOR        **GENERATED**              Auto-generated from parsed_text for full-text search

  **cleaned_text**    TEXT            **NOT NULL**               Normalised: whitespace cleaned, special chars removed

  **char_count**      INTEGER         **NOT NULL**               Character count

  **line_count**      INTEGER         **NOT NULL**               Line count after normalisation

  **created_at**      TIMESTAMPTZ     **DEFAULT NOW()**          Extraction timestamp
  ------------------- --------------- -------------------------- ------------------------------------------------------------------

  -----------------------------------------------------------------------
  **FOREIGN KEYS**

  -----------------------------------------------------------------------

  ---------------- --------------------------- --------------- ---------------------
  **Column**       **References**              **On Delete**   **Purpose**

  **resume_id**    resume.resumes(resume_id)   **CASCADE**     Deleted with resume
  ---------------- --------------------------- --------------- ---------------------

  -----------------------------------------------------------------------
  **INDEXES**

  -----------------------------------------------------------------------

  -------------------- ------------------ ------------------- -------------------------------------------------------
  **Index Name**       **Columns**        **Type**            **Reason**

  **idx_rts_resume**   resume_id          **UNIQUE B-Tree**   Fast lookup by resume

  **idx_rts_fts**      full_text_tsv      **GIN**             PostgreSQL full-text search across all resume content
  -------------------- ------------------ ------------------- -------------------------------------------------------

  --------------------------------------------------------------------------------------------------------------------------------------------------------------------
  *NOTE: Separating raw text into its own table keeps resume.resumes rows narrow for fast index scans. Large TEXT blobs in the main row degrade B-Tree performance.*

  *NOTE: full_text_tsv: GENERATED ALWAYS AS (to_tsvector(\'english\', parsed_text)) STORED*
  --------------------------------------------------------------------------------------------------------------------------------------------------------------------

**4.5 resume.parsing_jobs**

  --------------------------------------------------- -------------------
  **TABLE: resume.parsing_jobs**                      **PK: job_id**

  --------------------------------------------------- -------------------

  ----------------------- --------------- ------------------------ ----------------------------------------------------------------------
  **Column Name**         **Data Type**   **Constraints**          **Description**

  **job_id**              UUID            **PK, NOT NULL**         Primary key --- also the Redis queue message ID

  **resume_id**           UUID            **FK, NOT NULL, IDX**    Resume being parsed

  **job_type**            VARCHAR(30)     **NOT NULL**             ENUM: standard_parse \| ocr_parse \| reparse

  **status**              VARCHAR(20)     **DEFAULT \'queued\'**   ENUM: queued \| processing \| completed \| failed \| retrying

  **processing_status**   VARCHAR(20)     **NULLABLE**             Alias field for API compatibility: pending \| processing \| complete

  **worker_id**           VARCHAR(100)    **NULLABLE**             ID of the worker pod that processed this job

  **attempt_count**       SMALLINT        **DEFAULT 0**            Max 3 attempts before dead-letter queue

  **error_message**       TEXT            **NULLABLE**             Last error message if status=failed

  **error_type**          VARCHAR(50)     **NULLABLE**             ENUM: encrypted_pdf \| corrupt_file \| timeout \| ocr_failure

  **started_at**          TIMESTAMPTZ     **NULLABLE**             When worker picked up the job

  **completed_at**        TIMESTAMPTZ     **NULLABLE**             When job finished (success or final failure)

  **duration_ms**         INTEGER         **NULLABLE**             Processing time in milliseconds

  **tokens_used**         INTEGER         **NULLABLE**             LLM tokens consumed for cost tracking

  **created_at**          TIMESTAMPTZ     **DEFAULT NOW()**        Job creation timestamp
  ----------------------- --------------- ------------------------ ----------------------------------------------------------------------

  -----------------------------------------------------------------------
  **FOREIGN KEYS**

  -----------------------------------------------------------------------

  ---------------- --------------------------- --------------- --------------------------
  **Column**       **References**              **On Delete**   **Purpose**

  **resume_id**    resume.resumes(resume_id)   **CASCADE**     Jobs deleted with resume
  ---------------- --------------------------- --------------- --------------------------

  -----------------------------------------------------------------------
  **INDEXES**

  -----------------------------------------------------------------------

  -------------------- ----------------------------------- -------------------- ---------------------------------
  **Index Name**       **Columns**                         **Type**             **Reason**

  **idx_pj_status**    status (partial: queued/retrying)   **Partial B-Tree**   Workers poll for pending jobs

  **idx_pj_resume**    resume_id                           **B-Tree**           All parse attempts for a resume

  **idx_pj_created**   created_at DESC                     **B-Tree**           Recent job monitoring
  -------------------- ----------------------------------- -------------------- ---------------------------------

  ------------------------------------------------------------------------------------------------------------------------------------------------------------
  *ARCHITECTURE: On INSERT to this table, a trigger publishes job_id to Redis queue:parse_jobs. Workers BRPOP from Redis, update status here on each stage.*

  *NOTE: attempt_count \> 3 moves job to dead_letter state. Engineering alert fires automatically.*
  ------------------------------------------------------------------------------------------------------------------------------------------------------------

**5.1 Overview**

The analysis schema is the core AI output layer. Every pipeline run creates one analysis_runs record which anchors all downstream results in separate sub-tables. This architecture enables independent querying of each output type, individual progress tracking, and future schema evolution of AI outputs without touching other tables.

**5.2 analysis.analysis_runs**

  --------------------------------------------------- -------------------
  **TABLE: analysis.analysis_runs**                   **PK: run_id**

  --------------------------------------------------- -------------------

  ------------------------ --------------- ------------------------ -----------------------------------------------------------------
  **Column Name**          **Data Type**   **Constraints**          **Description**

  **run_id**               UUID            **PK, NOT NULL**         Primary key. Anchors all analysis sub-tables

  **user_id**              UUID            **FK, NOT NULL, IDX**    Owner

  **resume_id**            UUID            **FK, NOT NULL, IDX**    Specific resume version analysed

  **target_company**       VARCHAR(200)    **NULLABLE**             Company entered by user

  **target_role**          VARCHAR(200)    **NULLABLE**             Target job title. Anchors skill comparison

  **company_id**           UUID            **FK, NULLABLE**         Matched company from reference table

  **jd_text**              TEXT            **NULLABLE**             Raw JD pasted by user. NULL if not provided

  **jd_hash**              VARCHAR(64)     **NULLABLE, IDX**        SHA-256 of jd_text. Cache key

  **experience_level**     VARCHAR(20)     **NULLABLE**             ENUM: fresher \| junior \| mid \| senior \| lead

  **application_type**     VARCHAR(20)     **NULLABLE**             ENUM: direct \| referral \| cold

  **status**               VARCHAR(20)     **DEFAULT \'queued\'**   ENUM: queued \| processing \| completed \| failed

  **pipeline_stage**       VARCHAR(50)     **NULLABLE**             Current stage for live progress display

  **verdict**              VARCHAR(20)     **NULLABLE**             ENUM: likely_selected \| not_selected

  **verdict_confidence**   DECIMAL(4,3)    **NULLABLE**             0.000-1.000 confidence in verdict

  **overall_ats_score**    SMALLINT        **NULLABLE**             0-100 composite ATS score. Denormalised for fast dashboard sort

  **match_percentage**     DECIMAL(5,2)    **NULLABLE**             0-100.00 skill match % for target role

  **is_cached**            BOOLEAN         **DEFAULT FALSE**        TRUE if results served from cache

  **processing_time_ms**   INTEGER         **NULLABLE**             Total pipeline duration

  **tokens_used**          INTEGER         **NULLABLE**             Total LLM tokens consumed

  **model_version**        VARCHAR(50)     **NULLABLE**             AI model used e.g. claude-sonnet-4-20250514

  **created_at**           TIMESTAMPTZ     **DEFAULT NOW()**        Analysis start timestamp

  **completed_at**         TIMESTAMPTZ     **NULLABLE**             Pipeline completion timestamp
  ------------------------ --------------- ------------------------ -----------------------------------------------------------------

  -----------------------------------------------------------------------
  **FOREIGN KEYS**

  -----------------------------------------------------------------------

  ---------------- -------------------------------- --------------- -----------------------------------------
  **Column**       **References**                   **On Delete**   **Purpose**

  **user_id**      auth.users(user_id)              **CASCADE**     Analyses deleted when user purged

  **resume_id**    resume.resumes(resume_id)        **CASCADE**     Analyses deleted when resume deleted

  **company_id**   analysis.companies(company_id)   **SET NULL**    Keep analysis if company record removed
  ---------------- -------------------------------- --------------- -----------------------------------------

  -----------------------------------------------------------------------
  **INDEXES**

  -----------------------------------------------------------------------

  ------------------------ ---------------------------- ------------ --------------------------------------------
  **Index Name**           **Columns**                  **Type**     **Reason**

  **idx_ar_user**          user_id                      **B-Tree**   All analyses for a user

  **idx_ar_user_recent**   user_id, created_at DESC     **B-Tree**   History listing most recent first

  **idx_ar_resume**        resume_id                    **B-Tree**   All analyses for a specific resume version

  **idx_ar_jd_hash**       jd_hash                      **B-Tree**   Cache lookup: same JD analysed before?

  **idx_ar_verdict**       verdict, overall_ats_score   **B-Tree**   Analytics: verdict distribution by score
  ------------------------ ---------------------------- ------------ --------------------------------------------

  ---------------------------------------------------------------------------------------------------------------------------------------------------------
  *NOTE: overall_ats_score is denormalised here for dashboard sort performance. Source of truth is analysis.ats_scores.overall_score.*

  *NOTE: When jd_hash matches a previous run with same resume_id, results are cloned and is_cached=TRUE. Saves \~80% of AI API cost for repeat analyses.*
  ---------------------------------------------------------------------------------------------------------------------------------------------------------

**5.3 analysis.ats_scores**

  --------------------------------------------------- ----------------------
  **TABLE: analysis.ats_scores**                      **PK: ats_score_id**

  --------------------------------------------------- ----------------------

  ----------------------- --------------- -------------------------- --------------------------------------------------------------------------
  **Column Name**         **Data Type**   **Constraints**            **Description**

  **ats_score_id**        UUID            **PK, NOT NULL**           Primary key

  **run_id**              UUID            **FK, UNIQUE, NOT NULL**   One-to-one with analysis_runs

  **overall_score**       SMALLINT        **NOT NULL**               0-100 weighted composite of all sub-scores

  **keyword_score**       SMALLINT        **NOT NULL**               0-30. Keyword presence, density, action verbs at bullet start

  **format_score**        SMALLINT        **NOT NULL**               0-25. ATS-friendly formatting, single-column, no tables/graphics

  **contact_score**       SMALLINT        **NOT NULL**               0-15. Complete contact info, professional email, LinkedIn/GitHub

  **length_score**        SMALLINT        **NOT NULL**               0-15. 1 page fresher / 2 pages experienced. 3+ pages penalised

  **consistency_score**   SMALLINT        **NOT NULL**               0-15. Date format uniformity, parallel bullet structure

  **keyword_details**     JSONB           **NOT NULL**               Present keywords, missing keywords, density analysis, action verb count

  **format_issues**       JSONB           **NOT NULL**               Specific format problems found: column count, tables, fonts

  **contact_issues**      JSONB           **NOT NULL**               Missing fields, unprofessional email flag

  **ats_system_used**     VARCHAR(50)     **NULLABLE**               ATS simulation model: workday \| greenhouse \| lever \| taleo \| generic

  **simulation_notes**    TEXT            **NULLABLE**               How target company ATS was simulated

  **score_version**       VARCHAR(10)     **DEFAULT \'1.0\'**        Scoring algorithm version for historical comparison

  **calculated_at**       TIMESTAMPTZ     **DEFAULT NOW()**          Score calculation timestamp
  ----------------------- --------------- -------------------------- --------------------------------------------------------------------------

  -----------------------------------------------------------------------
  **FOREIGN KEYS**

  -----------------------------------------------------------------------

  ---------------- -------------------------------- --------------- -------------------------
  **Column**       **References**                   **On Delete**   **Purpose**

  **run_id**       analysis.analysis_runs(run_id)   **CASCADE**     Deleted with parent run
  ---------------- -------------------------------- --------------- -------------------------

  -----------------------------------------------------------------------
  **INDEXES**

  -----------------------------------------------------------------------

  ---------------------- ------------------ ------------------- -----------------------------------------
  **Index Name**         **Columns**        **Type**            **Reason**

  **idx_ats_run**        run_id             **UNIQUE B-Tree**   One-to-one lookup

  **idx_ats_score**      overall_score      **B-Tree**          Score distribution analytics

  **idx_ats_keywords**   keyword_details    **GIN**             Query resumes missing specific keywords
  ---------------------- ------------------ ------------------- -----------------------------------------

  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
  *NOTE: score_version enables historical comparison when scoring algorithm changes. Old runs keep their version tag --- new algo does not invalidate old scores.*

  *JSONB keyword_details: {present:\[{word,count,section}\], missing:\[{word,priority,where_to_add}\], density:float, action_verb_count:int, weak_phrases:\[string\]}*
  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------

**5.4 analysis.skills + analysis.resume_skills**

Two tables handle skills: a master reference table of all known skills (with embeddings), and a per-analysis extracted skills table linking resume+run to the skill master. This normalised design allows skill-level analytics across the entire platform.

  --------------------------------------------------- -------------------
  **TABLE: analysis.skills (Master Reference)**       **PK: skill_id**

  --------------------------------------------------- -------------------

  ---------------------- --------------- ---------------------- -----------------------------------------------------------------------
  **Column Name**        **Data Type**   **Constraints**        **Description**

  **skill_id**           UUID            **PK, NOT NULL**       Primary key

  **skill_name**         VARCHAR(100)    **UNIQUE, NOT NULL**   Normalised canonical name e.g. \'node.js\'

  **skill_category**     VARCHAR(20)     **NOT NULL**           ENUM: technical \| soft \| tool \| language \| domain

  **skill_aliases**      TEXT\[\]        **NULLABLE**           Alternate names: \'nodejs\', \'Node.js\', \'node js\' all mapped here

  **embedding_vector**   VECTOR(1536)    **NULLABLE**           Skill embedding for semantic similarity comparison

  **demand_level**       VARCHAR(10)     **NULLABLE**           high \| medium \| low. Market demand signal

  **created_at**         TIMESTAMPTZ     **DEFAULT NOW()**      Record creation
  ---------------------- --------------- ---------------------- -----------------------------------------------------------------------

  -----------------------------------------------------------------------
  **INDEXES**

  -----------------------------------------------------------------------

  ------------------------ ------------------ ------------------- ---------------------------------------------------
  **Index Name**           **Columns**        **Type**            **Reason**

  **idx_skills_name**      skill_name         **UNIQUE B-Tree**   Exact skill lookup on extraction

  **idx_skills_aliases**   skill_aliases      **GIN**             Array search for normalisation matching

  **idx_skills_emb**       embedding_vector   **HNSW**            Semantic similarity for related-skill suggestions
  ------------------------ ------------------ ------------------- ---------------------------------------------------

  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
  *NOTE: skill_name is normalised on write (lowercase, trimmed). \'Python3\', \'python 3\', \'Python\' all resolve to \'python\'. Aliases array handles the matching.*

  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------

  ------------------------------------------------------ -------------------------
  **TABLE: analysis.resume_skills (Per-Run Junction)**   **PK: resume_skill_id**

  ------------------------------------------------------ -------------------------

  ----------------------- --------------- ----------------------- ------------------------------------------------------------------
  **Column Name**         **Data Type**   **Constraints**         **Description**

  **resume_skill_id**     UUID            **PK, NOT NULL**        Primary key

  **run_id**              UUID            **FK, NOT NULL, IDX**   Parent analysis run

  **skill_id**            UUID            **FK, NOT NULL, IDX**   References analysis.skills master

  **extraction_type**     VARCHAR(20)     **NOT NULL**            ENUM: explicit \| inferred

  **frequency_count**     INTEGER         **NOT NULL**            Times skill appears/inferred across resume

  **proficiency_level**   VARCHAR(20)     **NULLABLE**            ENUM: beginner \| intermediate \| advanced \| expert \| inferred

  **evidence_sections**   TEXT\[\]        **NOT NULL**            Section types where evidence was found

  **is_required**         BOOLEAN         **DEFAULT FALSE**       TRUE if required for target role

  **is_preferred**        BOOLEAN         **DEFAULT FALSE**       TRUE if preferred (not required) for target role

  **gap_priority**        VARCHAR(10)     **NULLABLE**            critical \| high \| medium \| low. Only set for MISSING skills

  **infer_source**        TEXT            **NULLABLE**            The bullet text that implied this skill. NULL if explicit

  **created_at**          TIMESTAMPTZ     **DEFAULT NOW()**       Extraction timestamp
  ----------------------- --------------- ----------------------- ------------------------------------------------------------------

  -----------------------------------------------------------------------
  **FOREIGN KEYS**

  -----------------------------------------------------------------------

  ---------------- -------------------------------- --------------- ----------------------------------------------------------
  **Column**       **References**                   **On Delete**   **Purpose**

  **run_id**       analysis.analysis_runs(run_id)   **CASCADE**     Deleted with run

  **skill_id**     analysis.skills(skill_id)        **RESTRICT**    Cannot delete a master skill if extractions reference it
  ---------------- -------------------------------- --------------- ----------------------------------------------------------

  -----------------------------------------------------------------------
  **INDEXES**

  -----------------------------------------------------------------------

  --------------------- ------------------------- ------------ ---------------------------------------------
  **Index Name**        **Columns**               **Type**     **Reason**

  **idx_rs_run**        run_id                    **B-Tree**   All skills for a run --- skills map display

  **idx_rs_skill**      skill_id                  **B-Tree**   Analytics: skill frequency across platform

  **idx_rs_gaps**       run_id, gap_priority      **B-Tree**   Fetch only gap skills ordered by priority

  **idx_rs_run_type**   run_id, extraction_type   **B-Tree**   Filter explicit vs inferred skills
  --------------------- ------------------------- ------------ ---------------------------------------------

  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  *NOTE: This many-to-many design replaces the single RESUME_SKILLS table from the ChatGPT brief with a normalised two-table approach, enabling platform-wide skill analytics.*

  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**5.5 analysis.ats_scores --- Improvement Tips**

  --------------------------------------------------- -------------------
  **TABLE: analysis.improvement_tips**                **PK: tip_id**

  --------------------------------------------------- -------------------

  --------------------- --------------- ----------------------- --------------------------------------------------------------------------------------------------------------------------------------
  **Column Name**       **Data Type**   **Constraints**         **Description**

  **tip_id**            UUID            **PK, NOT NULL**        Primary key

  **run_id**            UUID            **FK, NOT NULL, IDX**   Parent analysis run

  **suggestion_type**   VARCHAR(30)     **NOT NULL**            ENUM: keyword_missing \| bullet_improvement \| quantification \| format_issue \| section_missing \| action_verb \| length \| contact

  **priority_level**    VARCHAR(10)     **NOT NULL**            ENUM: critical \| high \| medium \| low

  **display_order**     SMALLINT        **NOT NULL**            Render order in dashboard. Lower = shown first

  **title**             TEXT            **NOT NULL**            Short headline e.g. \'Weak bullet in Experience\'

  **original_text**     TEXT            **NULLABLE**            The problematic text from the resume

  **suggestion_text**   TEXT            **NOT NULL**            The AI-rewritten improvement (maps to ChatGPT: suggestion_text)

  **explanation**       TEXT            **NOT NULL**            Why this change matters --- shown in tooltip hover

  **section_type**      VARCHAR(50)     **NULLABLE**            Which resume section this tip applies to

  **section_id**        UUID            **FK, NULLABLE**        Specific section_id in parsed_sections --- powers visual highlight

  **ats_impact_pts**    SMALLINT        **NULLABLE**            Estimated ATS score increase if tip applied

  **is_applied**        BOOLEAN         **DEFAULT FALSE**       User marks tip as done in dashboard

  **applied_at**        TIMESTAMPTZ     **NULLABLE**            When user marked as applied

  **created_at**        TIMESTAMPTZ     **DEFAULT NOW()**       Tip generation timestamp
  --------------------- --------------- ----------------------- --------------------------------------------------------------------------------------------------------------------------------------

  -----------------------------------------------------------------------
  **FOREIGN KEYS**

  -----------------------------------------------------------------------

  ---------------- ------------------------------------ --------------- -------------------------------
  **Column**       **References**                       **On Delete**   **Purpose**

  **run_id**       analysis.analysis_runs(run_id)       **CASCADE**     Deleted with run

  **section_id**   resume.parsed_sections(section_id)   **SET NULL**    Keep tip if section re-parsed
  ---------------- ------------------------------------ --------------- -------------------------------

  -----------------------------------------------------------------------
  **INDEXES**

  -----------------------------------------------------------------------

  -------------------- ----------------------- ------------ -----------------------------------
  **Index Name**       **Columns**             **Type**     **Reason**

  **idx_it_run**       run_id                  **B-Tree**   All tips for an analysis

  **idx_it_ordered**   run_id, display_order   **B-Tree**   Ordered tips for dashboard render

  **idx_it_type**      suggestion_type         **B-Tree**   Analytics: most common tip types
  -------------------- ----------------------- ------------ -----------------------------------

  -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  *NOTE: section_id FK to parsed_sections is the link powering the visual colour highlight overlay. When a tip loads, the UI highlights the matching section in the resume viewer.*

  *NOTE: ats_impact_pts enables sorting tips by ROI. A format fix worth +20 pts ranks above a contact tip worth +3 pts.*
  -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**5.6 analysis.highlight_feedback**

  --------------------------------------------------- ----------------------
  **TABLE: analysis.highlight_feedback**              **PK: highlight_id**

  --------------------------------------------------- ----------------------

  ---------------------- --------------- ----------------------- ------------------------------------------------------------------------
  **Column Name**        **Data Type**   **Constraints**         **Description**

  **highlight_id**       UUID            **PK, NOT NULL**        Primary key

  **run_id**             UUID            **FK, NOT NULL, IDX**   Parent analysis run

  **section_id**         UUID            **FK, NOT NULL, IDX**   Section in parsed_sections being highlighted

  **highlight_color**    VARCHAR(10)     **NOT NULL**            ENUM: green \| yellow \| red. Mapped from quality score

  **feedback_message**   TEXT            **NOT NULL**            Tooltip text shown on hover in dashboard

  **quality_score**      DECIMAL(4,3)    **NOT NULL**            0.000-1.000 composite quality of this section. Drives color assignment

  **tip_id**             UUID            **FK, NULLABLE**        Linked improvement_tip if applicable

  **created_at**         TIMESTAMPTZ     **DEFAULT NOW()**       Generation timestamp
  ---------------------- --------------- ----------------------- ------------------------------------------------------------------------

  -----------------------------------------------------------------------
  **FOREIGN KEYS**

  -----------------------------------------------------------------------

  ---------------- ------------------------------------ --------------- -------------------------------
  **Column**       **References**                       **On Delete**   **Purpose**

  **run_id**       analysis.analysis_runs(run_id)       **CASCADE**     Deleted with run

  **section_id**   resume.parsed_sections(section_id)   **CASCADE**     Deleted with section

  **tip_id**       analysis.improvement_tips(tip_id)    **SET NULL**    Keep highlight if tip removed
  ---------------- ------------------------------------ --------------- -------------------------------

  -----------------------------------------------------------------------
  **INDEXES**

  -----------------------------------------------------------------------

  -------------------- ------------------ ------------ ----------------------------------
  **Index Name**       **Columns**        **Type**     **Reason**

  **idx_hf_run**       run_id             **B-Tree**   All highlights for a run

  **idx_hf_section**   section_id         **B-Tree**   Highlight for a specific section
  -------------------- ------------------ ------------ ----------------------------------

  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  *NOTE: This table from the ChatGPT brief is kept as a dedicated entity. It separates the visual overlay data from the tips data --- a section can have a highlight colour without necessarily having a full improvement tip.*

  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**5.7 analysis.job_match_results**

  --------------------------------------------------- -------------------
  **TABLE: analysis.job_match_results**               **PK: match_id**

  --------------------------------------------------- -------------------

  ------------------------- --------------- ----------------------- -------------------------------------------------------
  **Column Name**           **Data Type**   **Constraints**         **Description**

  **match_id**              UUID            **PK, NOT NULL**        Primary key

  **run_id**                UUID            **FK, NOT NULL, IDX**   Parent analysis run

  **role_id**               UUID            **FK, NOT NULL**        References analysis.job_roles

  **rank**                  SMALLINT        **NOT NULL**            1-5. Top 5 matches ranked by match_percentage

  **match_percentage**      DECIMAL(5,2)    **NOT NULL**            0-100.00. Cosine similarity x 100

  **skills_matched**        INTEGER         **NOT NULL**            Count of required role skills candidate has

  **skills_missing**        INTEGER         **NOT NULL**            Count of required role skills candidate lacks

  **skills_present**        TEXT\[\]        **NOT NULL**            Actual skill names present

  **skills_missing_list**   TEXT\[\]        **NOT NULL**            Actual skill names absent

  **competitive_pct**       DECIMAL(4,1)    **NULLABLE**            Estimated percentile vs avg candidate for this role

  **recommendation**        TEXT            **NULLABLE**            AI action recommendation for this match

  **embedding_sim**         DECIMAL(6,5)    **NOT NULL**            Raw cosine similarity 0-1. Source of match_percentage

  **created_at**            TIMESTAMPTZ     **DEFAULT NOW()**       Match calculation timestamp
  ------------------------- --------------- ----------------------- -------------------------------------------------------

  -----------------------------------------------------------------------
  **FOREIGN KEYS**

  -----------------------------------------------------------------------

  ---------------- -------------------------------- --------------- ------------------------------------------------
  **Column**       **References**                   **On Delete**   **Purpose**

  **run_id**       analysis.analysis_runs(run_id)   **CASCADE**     Deleted with run

  **role_id**      analysis.job_roles(role_id)      **RESTRICT**    Cannot delete a job_role referenced by matches
  ---------------- -------------------------------- --------------- ------------------------------------------------

  -----------------------------------------------------------------------
  **INDEXES**

  -----------------------------------------------------------------------

  ---------------------- ------------------ ------------ ----------------------------------------
  **Index Name**         **Columns**        **Type**     **Reason**

  **idx_jmr_run_rank**   run_id, rank       **B-Tree**   Get ordered top-5 matches for a run

  **idx_jmr_role**       role_id            **B-Tree**   Analytics: most commonly matched roles
  ---------------------- ------------------ ------------ ----------------------------------------

**5.8 analysis.job_descriptions + analysis.jd_match_analysis**

  --------------------------------------------------- -------------------
  **TABLE: analysis.job_descriptions**                **PK: jd_id**

  --------------------------------------------------- -------------------

  ------------------------- --------------- ----------------------- -----------------------------------------
  **Column Name**           **Data Type**   **Constraints**         **Description**

  **jd_id**                 UUID            **PK, NOT NULL**        Primary key

  **user_id**               UUID            **FK, NOT NULL, IDX**   User who submitted this JD

  **jd_text**               TEXT            **NOT NULL**            Full raw job description text

  **jd_hash**               VARCHAR(64)     **UNIQUE, NOT NULL**    SHA-256 for deduplication and cache key

  **embedding_vector**      VECTOR(1536)    **NULLABLE**            JD embedding for semantic comparison

  **jd_role_inferred**      VARCHAR(200)    **NULLABLE**            Role NLP-inferred from JD text

  **jd_company_inferred**   VARCHAR(200)    **NULLABLE**            Company NLP-inferred from JD text

  **created_at**            TIMESTAMPTZ     **DEFAULT NOW()**       Submission timestamp
  ------------------------- --------------- ----------------------- -----------------------------------------

  -----------------------------------------------------------------------
  **FOREIGN KEYS**

  -----------------------------------------------------------------------

  ---------------- --------------------- --------------- ------------------------------
  **Column**       **References**        **On Delete**   **Purpose**

  **user_id**      auth.users(user_id)   **CASCADE**     JD records deleted with user
  ---------------- --------------------- --------------- ------------------------------

  -----------------------------------------------------------------------
  **INDEXES**

  -----------------------------------------------------------------------

  ------------------- ------------------ ------------------- -----------------------------------------------------------------
  **Index Name**      **Columns**        **Type**            **Reason**

  **idx_jd_hash**     jd_hash            **UNIQUE B-Tree**   Cache lookup --- same JD across users reuses keyword extraction

  **idx_jd_user**     user_id            **B-Tree**          All JDs submitted by a user
  ------------------- ------------------ ------------------- -----------------------------------------------------------------

  --------------------------------------------------- ---------------------
  **TABLE: analysis.jd_match_analysis**               **PK: analysis_id**

  --------------------------------------------------- ---------------------

  -------------------------- --------------- ----------------------- ---------------------------------------------------------------
  **Column Name**            **Data Type**   **Constraints**         **Description**

  **analysis_id**            UUID            **PK, NOT NULL**        Primary key

  **run_id**                 UUID            **FK, NOT NULL, IDX**   Parent analysis run

  **jd_id**                  UUID            **FK, NOT NULL**        References analysis.job_descriptions

  **match_score**            DECIMAL(5,2)    **NOT NULL**            0-100.00 resume vs JD match percentage

  **missing_keywords**       TEXT            **NOT NULL**            JD keywords absent from resume (legacy text field)

  **missing_keywords_arr**   TEXT\[\]        **NOT NULL**            Array version for programmatic use

  **recommended_keywords**   TEXT            **NULLABLE**            Keywords to add (legacy text field --- ChatGPT compatibility)

  **top_keywords_add**       TEXT\[\]        **NOT NULL**            Top 5 keywords to add in priority order

  **keyword_gap_score**      SMALLINT        **NOT NULL**            0-100 keyword coverage percentage

  **rewritten_bullets**      JSONB           **NOT NULL**            3 AI-rewritten bullets optimised for this JD

  **projected_score**        DECIMAL(5,2)    **NULLABLE**            Estimated match if all missing keywords added

  **created_at**             TIMESTAMPTZ     **DEFAULT NOW()**       Comparison timestamp
  -------------------------- --------------- ----------------------- ---------------------------------------------------------------

  -----------------------------------------------------------------------
  **FOREIGN KEYS**

  -----------------------------------------------------------------------

  ---------------- ---------------------------------- --------------- -------------------------------------
  **Column**       **References**                     **On Delete**   **Purpose**

  **run_id**       analysis.analysis_runs(run_id)     **CASCADE**     Deleted with run

  **jd_id**        analysis.job_descriptions(jd_id)   **RESTRICT**    Keep JD if comparison references it
  ---------------- ---------------------------------- --------------- -------------------------------------

  -----------------------------------------------------------------------
  **INDEXES**

  -----------------------------------------------------------------------

  ------------------- ------------------ ------------ --------------------------------------
  **Index Name**      **Columns**        **Type**     **Reason**

  **idx_jda_run**     run_id             **B-Tree**   Lookup comparison for a run

  **idx_jda_jd**      jd_id              **B-Tree**   Analytics: how often each JD matched
  ------------------- ------------------ ------------ --------------------------------------

  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  *NOTE: missing_keywords (TEXT) and recommended_keywords (TEXT) retained from ChatGPT brief for API backward-compatibility. missing_keywords_arr and top_keywords_add are the production-use array columns.*

  *JSONB rewritten_bullets: \[{original:string, rewritten:string, keywords_added:\[string\], improvement_reason:string}\]*
  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**6.1 billing.plans (Feature Gates Master Table)**

  --------------------------------------------------- -------------------
  **TABLE: billing.plans**                            **PK: plan_id**

  --------------------------------------------------- -------------------

  ---------------------------- --------------- ---------------------- -----------------------------------------------------------
  **Column Name**              **Data Type**   **Constraints**        **Description**

  **plan_id**                  UUID            **PK, NOT NULL**       Primary key

  **plan_code**                VARCHAR(30)     **UNIQUE, NOT NULL**   ENUM: free \| pro \| enterprise \| pay_per_use

  **name**                     VARCHAR(100)    **NOT NULL**           Display name: \'Pro Plan\'

  **price_inr**                DECIMAL(10,2)   **NOT NULL**           Monthly price INR. 0 for free. 299 for Pro. 10000 for org

  **price_usd**                DECIMAL(10,2)   **NULLABLE**           USD equivalent for international billing

  **monthly_analysis_limit**   INTEGER         **NOT NULL**           -1 = unlimited. Otherwise exact count

  **jd_matching_enabled**      BOOLEAN         **NOT NULL**           Feature gate: JD Matcher module

  **company_ats_enabled**      BOOLEAN         **NOT NULL**           Company-specific ATS simulation

  **full_roadmap_enabled**     BOOLEAN         **NOT NULL**           Full learning roadmap vs top-3 only

  **progress_tracking**        BOOLEAN         **NOT NULL**           Historical analysis progress dashboard

  **ai_rewrites_limit**        INTEGER         **NOT NULL**           Max bullet rewrites per analysis. -1 = all

  **export_pdf_enabled**       BOOLEAN         **NOT NULL**           PDF report export feature gate

  **priority_processing**      BOOLEAN         **NOT NULL**           Priority queue vs standard queue

  **stripe_price_id**          VARCHAR(100)    **NULLABLE**           Stripe Price object ID for payment processing

  **is_active**                BOOLEAN         **DEFAULT TRUE**       Inactive plans cannot be newly subscribed

  **created_at**               TIMESTAMPTZ     **DEFAULT NOW()**      Plan record creation
  ---------------------------- --------------- ---------------------- -----------------------------------------------------------

  -----------------------------------------------------------------------
  **INDEXES**

  -----------------------------------------------------------------------

  -------------------- ------------------ ------------------- -------------------------------------------------
  **Index Name**       **Columns**        **Type**            **Reason**

  **idx_plans_code**   plan_code          **UNIQUE B-Tree**   Fast plan lookup on every authenticated request
  -------------------- ------------------ ------------------- -------------------------------------------------

  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  *NOTE: Feature gates in this table are the source of truth. Application code reads plan features from here --- never hardcoded. Adding a new feature gate is an INSERT + migration, not a deployment.*

  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**6.2 billing.subscriptions**

  --------------------------------------------------- -------------------------
  **TABLE: billing.subscriptions**                    **PK: subscription_id**

  --------------------------------------------------- -------------------------

  -------------------------- --------------- ----------------------- -------------------------------------------------------------
  **Column Name**            **Data Type**   **Constraints**         **Description**

  **subscription_id**        UUID            **PK, NOT NULL**        Primary key

  **user_id**                UUID            **FK, NOT NULL, IDX**   Subscriber

  **plan_id**                UUID            **FK, NOT NULL**        Current plan

  **stripe_sub_id**          VARCHAR(100)    **UNIQUE, NULLABLE**    Stripe Subscription ID. NULL for free plan

  **stripe_customer_id**     VARCHAR(100)    **NULLABLE**            Stripe Customer ID. Created on first payment

  **status**                 VARCHAR(30)     **NOT NULL**            ENUM: active \| past_due \| cancelled \| trialing \| paused

  **current_period_start**   TIMESTAMPTZ     **NOT NULL**            Billing period start

  **current_period_end**     TIMESTAMPTZ     **NOT NULL**            Billing period end. analyses_used resets here

  **cancel_at_period_end**   BOOLEAN         **DEFAULT FALSE**       TRUE = ends at period end, not immediately

  **cancelled_at**           TIMESTAMPTZ     **NULLABLE**            Timestamp of cancellation request

  **trial_ends_at**          TIMESTAMPTZ     **NULLABLE**            If on trial, when it expires

  **created_at**             TIMESTAMPTZ     **DEFAULT NOW()**       Subscription start

  **updated_at**             TIMESTAMPTZ     **DEFAULT NOW()**       Last status change
  -------------------------- --------------- ----------------------- -------------------------------------------------------------

  -----------------------------------------------------------------------
  **FOREIGN KEYS**

  -----------------------------------------------------------------------

  ---------------- ------------------------ --------------- ----------------------------------------------
  **Column**       **References**           **On Delete**   **Purpose**

  **user_id**      auth.users(user_id)      **CASCADE**     Subscription deleted with user

  **plan_id**      billing.plans(plan_id)   **RESTRICT**    Cannot delete plan with active subscriptions
  ---------------- ------------------------ --------------- ----------------------------------------------

  -----------------------------------------------------------------------
  **INDEXES**

  -----------------------------------------------------------------------

  --------------------- -------------------- ------------------- -----------------------------------------
  **Index Name**        **Columns**          **Type**            **Reason**

  **idx_subs_user**     user_id              **B-Tree**          Current subscription for a user

  **idx_subs_status**   status               **B-Tree**          Monitor active/past_due subscriptions

  **idx_subs_period**   current_period_end   **B-Tree**          Cron: find subscriptions renewing today

  **idx_subs_stripe**   stripe_sub_id        **UNIQUE B-Tree**   Stripe webhook to subscription lookup
  --------------------- -------------------- ------------------- -----------------------------------------

  --------------------------------------------------------------------------------------------------------------
  *NOTE: A trigger on UPDATE syncs account_type in auth.users to avoid a JOIN on every authenticated request.*

  --------------------------------------------------------------------------------------------------------------

**6.3 billing.organisations (B2B College/Company)**

  --------------------------------------------------- -------------------
  **TABLE: billing.organisations**                    **PK: org_id**

  --------------------------------------------------- -------------------

  ------------------------- --------------- ------------------- -----------------------------------------------
  **Column Name**           **Data Type**   **Constraints**     **Description**

  **org_id**                UUID            **PK, NOT NULL**    Primary key

  **name**                  VARCHAR(200)    **NOT NULL**        College or company name

  **org_type**              VARCHAR(30)     **NOT NULL**        ENUM: college \| company \| bootcamp \| ngo

  **admin_user_id**         UUID            **FK, NOT NULL**    Primary admin account

  **subscription_id**       UUID            **FK, NOT NULL**    Org-level subscription

  **seat_count**            INTEGER         **NOT NULL**        Number of licensed seats (students/employees)

  **seats_used**            INTEGER         **DEFAULT 0**       Active enrolled accounts

  **domain_whitelist**      TEXT\[\]        **NULLABLE**        Email domains auto-approved e.g. \@iitb.ac.in

  **custom_branding**       JSONB           **NULLABLE**        Logo URL, colours for white-label embed

  **placement_dashboard**   BOOLEAN         **DEFAULT TRUE**    Placement officer admin dashboard enabled

  **contract_start**        DATE            **NOT NULL**        Contract start date

  **contract_end**          DATE            **NULLABLE**        NULL = rolling monthly

  **monthly_price_inr**     DECIMAL(10,2)   **NOT NULL**        Negotiated price --- Rs.10,000 standard

  **created_at**            TIMESTAMPTZ     **DEFAULT NOW()**   Org creation timestamp
  ------------------------- --------------- ------------------- -----------------------------------------------

  -----------------------------------------------------------------------
  **FOREIGN KEYS**

  -----------------------------------------------------------------------

  --------------------- ---------------------------------------- --------------- --------------------------------------------
  **Column**            **References**                           **On Delete**   **Purpose**

  **admin_user_id**     auth.users(user_id)                      **RESTRICT**    Cannot delete admin user while org active

  **subscription_id**   billing.subscriptions(subscription_id)   **RESTRICT**    Cannot delete subscription with active org
  --------------------- ---------------------------------------- --------------- --------------------------------------------

  -----------------------------------------------------------------------
  **INDEXES**

  -----------------------------------------------------------------------

  --------------------- ------------------ ------------ -------------------------------------
  **Index Name**        **Columns**        **Type**     **Reason**

  **idx_orgs_admin**    admin_user_id      **B-Tree**   Lookup org from admin user

  **idx_orgs_domain**   domain_whitelist   **GIN**      Auto-enrol students by email domain
  --------------------- ------------------ ------------ -------------------------------------

**6.4 billing.usage_events**

  --------------------------------------------------- -------------------
  **TABLE: billing.usage_events**                     **PK: event_id**

  --------------------------------------------------- -------------------

  ----------------- --------------- ----------------------- ---------------------------------------------------------------------------
  **Column Name**   **Data Type**   **Constraints**         **Description**

  **event_id**      UUID            **PK, NOT NULL**        Primary key

  **user_id**       UUID            **FK, NOT NULL, IDX**   User who triggered the event

  **org_id**        UUID            **FK, NULLABLE**        Organisation if B2B user

  **event_type**    VARCHAR(50)     **NOT NULL**            ENUM: analysis_run \| jd_match \| pdf_export \| api_call \| resume_upload

  **run_id**        UUID            **FK, NULLABLE**        Linked analysis run if applicable

  **billable**      BOOLEAN         **NOT NULL**            TRUE if counts toward monthly limit

  **credit_cost**   DECIMAL(6,2)    **DEFAULT 0**           INR cost for pay-per-use. 0 for subscription users

  **tokens_used**   INTEGER         **NULLABLE**            AI API tokens for cost attribution

  **created_at**    TIMESTAMPTZ     **DEFAULT NOW()**       Event timestamp
  ----------------- --------------- ----------------------- ---------------------------------------------------------------------------

  -----------------------------------------------------------------------
  **FOREIGN KEYS**

  -----------------------------------------------------------------------

  ---------------- -------------------------------- --------------- -----------------------------------
  **Column**       **References**                   **On Delete**   **Purpose**

  **user_id**      auth.users(user_id)              **CASCADE**     Events deleted with user

  **org_id**       billing.organisations(org_id)    **SET NULL**    Keep event if org dissolved

  **run_id**       analysis.analysis_runs(run_id)   **SET NULL**    Keep billing event if run deleted
  ---------------- -------------------------------- --------------- -----------------------------------

  -----------------------------------------------------------------------
  **INDEXES**

  -----------------------------------------------------------------------

  ------------------- -------------------------- ------------ ---------------------------
  **Index Name**      **Columns**                **Type**     **Reason**

  **idx_ue_user**     user_id, created_at DESC   **B-Tree**   Usage history per user

  **idx_ue_type**     event_type, created_at     **B-Tree**   Platform usage analytics

  **idx_ue_org**      org_id, created_at DESC    **B-Tree**   B2B usage by organisation
  ------------------- -------------------------- ------------ ---------------------------

  ------------------------------------------------------------------------------------------------------------------
  *NOTE: Append-only table. Never UPDATE or DELETE. Financial audit trail. Retention: 7 years for tax compliance.*

  ------------------------------------------------------------------------------------------------------------------

**7.1 analysis.job_roles**

  --------------------------------------------------- -------------------
  **TABLE: analysis.job_roles**                       **PK: role_id**

  --------------------------------------------------- -------------------

  ------------------------ --------------- ---------------------- -------------------------------------------------------------
  **Column Name**          **Data Type**   **Constraints**        **Description**

  **role_id**              UUID            **PK, NOT NULL**       Primary key

  **role_title**           VARCHAR(200)    **UNIQUE, NOT NULL**   Canonical title e.g. \'Senior Software Engineer\'

  **role_aliases**         TEXT\[\]        **NULLABLE**           SWE, Software Dev, Backend Engineer, etc.

  **industry**             VARCHAR(100)    **NULLABLE**           Technology \| Finance \| Healthcare \| etc.

  **seniority**            VARCHAR(20)     **NOT NULL**           ENUM: entry \| mid \| senior \| lead \| manager \| director

  **role_description**     TEXT            **NULLABLE**           Human-readable role overview for display

  **required_skills**      TEXT\[\]        **NOT NULL**           Must-have skills for this role

  **preferred_skills**     TEXT\[\]        **NOT NULL**           Nice-to-have skills

  **embedding_vector**     VECTOR(1536)    **NOT NULL**           Role requirements embedding for resume-to-role matching

  **typical_salary_inr**   INT4RANGE       **NULLABLE**           Salary range INR as a range type

  **demand_level**         VARCHAR(10)     **NULLABLE**           high \| medium \| low. Market demand signal

  **source_jd_count**      INTEGER         **DEFAULT 0**          JDs used to build this role profile

  **last_updated**         TIMESTAMPTZ     **DEFAULT NOW()**      Last embedding refresh

  **created_at**           TIMESTAMPTZ     **DEFAULT NOW()**      Record creation
  ------------------------ --------------- ---------------------- -------------------------------------------------------------

  -----------------------------------------------------------------------
  **INDEXES**

  -----------------------------------------------------------------------

  ---------------------- --------------------- ------------------- ------------------------------------------
  **Index Name**         **Columns**           **Type**            **Reason**

  **idx_jr_title**       role_title            **UNIQUE B-Tree**   Exact role lookup

  **idx_jr_seniority**   seniority, industry   **B-Tree**          Filter by level and industry

  **idx_jr_emb**         embedding_vector      **HNSW**            ANN match: resume vector vs role vectors

  **idx_jr_aliases**     role_aliases          **GIN**             Auto-complete by alias

  **idx_jr_skills**      required_skills       **GIN**             Roles requiring a specific skill
  ---------------------- --------------------- ------------------- ------------------------------------------

  -----------------------------------------------------------------------------------------------------------------------------------------------------------------
  *NOTE: embedding_vector is the centroid of all JD embeddings for that role. Updated weekly by batch job aggregating new JD inputs.*

  *MATCH QUERY: SELECT role_title, 1-(embedding_vector \<=\> \$resume_vec) AS match FROM analysis.job_roles ORDER BY embedding_vector \<=\> \$resume_vec LIMIT 5*
  -----------------------------------------------------------------------------------------------------------------------------------------------------------------

**7.2 analysis.job_role_skills (Importance Weights)**

  --------------------------------------------------- -----------------------
  **TABLE: analysis.job_role_skills**                 **PK: role_skill_id**

  --------------------------------------------------- -----------------------

  ----------------------- --------------- ----------------------- ---------------------------------------------------
  **Column Name**         **Data Type**   **Constraints**         **Description**

  **role_skill_id**       UUID            **PK, NOT NULL**        Primary key

  **role_id**             UUID            **FK, NOT NULL, IDX**   References analysis.job_roles

  **skill_id**            UUID            **FK, NOT NULL, IDX**   References analysis.skills

  **importance_weight**   DECIMAL(4,3)    **NOT NULL**            0.000-1.000. Higher = more critical for this role

  **is_required**         BOOLEAN         **DEFAULT TRUE**        TRUE = must-have. FALSE = preferred

  **created_at**          TIMESTAMPTZ     **DEFAULT NOW()**       Record creation
  ----------------------- --------------- ----------------------- ---------------------------------------------------

  -----------------------------------------------------------------------
  **FOREIGN KEYS**

  -----------------------------------------------------------------------

  ---------------- ----------------------------- --------------- ----------------------------------------------
  **Column**       **References**                **On Delete**   **Purpose**

  **role_id**      analysis.job_roles(role_id)   **CASCADE**     Weights deleted if role removed

  **skill_id**     analysis.skills(skill_id)     **RESTRICT**    Cannot remove skill with active role weights
  ---------------- ----------------------------- --------------- ----------------------------------------------

  -----------------------------------------------------------------------
  **INDEXES**

  -----------------------------------------------------------------------

  -------------------- ------------------- ------------------- ---------------------------------------
  **Index Name**       **Columns**         **Type**            **Reason**

  **idx_jrs_role**     role_id             **B-Tree**          All skills for a role

  **idx_jrs_skill**    skill_id            **B-Tree**          All roles using a skill

  **idx_jrs_unique**   role_id, skill_id   **UNIQUE B-Tree**   One weight per role-skill combination
  -------------------- ------------------- ------------------- ---------------------------------------

  -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  *NOTE: importance_weight from ChatGPT brief is the float 0-1 that scales a skill\'s contribution to the match score. A skill with weight 0.9 for SWE matters far more than one at 0.2.*

  *MATCH SCORE QUERY: SUM(resume_has_skill \* importance_weight) / SUM(all_role_weights) \* 100 = match_percentage*
  -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**7.3 analysis.companies**

  --------------------------------------------------- --------------------
  **TABLE: analysis.companies**                       **PK: company_id**

  --------------------------------------------------- --------------------

  ---------------------- --------------- ---------------------- ----------------------------------------------------------------------
  **Column Name**        **Data Type**   **Constraints**        **Description**

  **company_id**         UUID            **PK, NOT NULL**       Primary key

  **name**               VARCHAR(200)    **UNIQUE, NOT NULL**   Official company name

  **name_aliases**       TEXT\[\]        **NULLABLE**           Common alternatives for auto-complete

  **industry**           VARCHAR(100)    **NULLABLE**           Primary industry classification

  **size_band**          VARCHAR(20)     **NULLABLE**           startup \| sme \| enterprise \| fortune500

  **known_ats_system**   VARCHAR(50)     **NULLABLE**           workday \| greenhouse \| lever \| taleo \| smartrecruiters \| custom

  **ats_quirks**         JSONB           **NULLABLE**           Specific quirks affecting ATS simulation scoring

  **typical_jd_data**    JSONB           **NULLABLE**           Aggregated JD requirements for common roles here

  **country_code**       CHAR(2)         **NULLABLE**           Primary HQ country ISO 3166-1

  **careers_url**        TEXT            **NULLABLE**           Deep link to company careers page for Apply button

  **logo_url**           TEXT            **NULLABLE**           S3 URL of company logo for dashboard display

  **is_verified**        BOOLEAN         **DEFAULT FALSE**      Manually verified company data by admin

  **created_at**         TIMESTAMPTZ     **DEFAULT NOW()**      Record creation

  **updated_at**         TIMESTAMPTZ     **DEFAULT NOW()**      Last data update
  ---------------------- --------------- ---------------------- ----------------------------------------------------------------------

  -----------------------------------------------------------------------
  **INDEXES**

  -----------------------------------------------------------------------

  -------------------- ------------------ ------------------- ------------------------------------------
  **Index Name**       **Columns**        **Type**            **Reason**

  **idx_co_name**      name               **UNIQUE B-Tree**   Exact company lookup

  **idx_co_ats**       known_ats_system   **B-Tree**          Group by ATS type for simulation routing

  **idx_co_aliases**   name_aliases       **GIN**             Array search for auto-complete
  -------------------- ------------------ ------------------- ------------------------------------------

  ----------------------------------------------------------------------------------------------------------------------------------------------------
  *NOTE: ats_quirks JSONB: {max_resume_pages:int, penalise_columns:bool, keyword_matching:\'exact\'\|\'semantic\', section_requirements:\[string\]}*

  ----------------------------------------------------------------------------------------------------------------------------------------------------

**8.1 Vector Dimensions**

Vector dimension depends on the embedding model. The schema uses 1536-dimensional vectors (OpenAI text-embedding-3-large / Claude equivalent). For models producing 768-dimensional vectors, the VECTOR type dimension is changed at migration time. All embeddings from the same model version are directly comparable --- cross-version comparison is invalid.

**8.2 analysis.resume_embeddings**

  --------------------------------------------------- ----------------------
  **TABLE: analysis.resume_embeddings**               **PK: embedding_id**

  --------------------------------------------------- ----------------------

  ---------------------- --------------- ----------------------- --------------------------------------------------------------------------------------------
  **Column Name**        **Data Type**   **Constraints**         **Description**

  **embedding_id**       UUID            **PK, NOT NULL**        Primary key

  **resume_id**          UUID            **FK, NOT NULL, IDX**   Source resume version

  **run_id**             UUID            **FK, NULLABLE**        Analysis run that generated this embedding

  **entity_type**        VARCHAR(30)     **NOT NULL**            ENUM: full_resume \| experience \| skills \| summary --- maps to ChatGPT entity_type field

  **embedding_type**     VARCHAR(30)     **NOT NULL**            Alias for entity_type for semantic clarity

  **embedding_vector**   VECTOR(1536)    **NOT NULL**            The actual embedding vector --- pgvector column type

  **model_name**         VARCHAR(100)    **NOT NULL**            Embedding model e.g. text-embedding-3-large

  **model_version**      VARCHAR(50)     **NOT NULL**            Model version. Different versions = incompatible vectors

  **dimensions**         SMALLINT        **NOT NULL**            768 or 1536. Must match VECTOR type dimension

  **source_text_hash**   VARCHAR(64)     **NOT NULL**            SHA-256 of source text. Detect if re-embedding needed

  **created_at**         TIMESTAMPTZ     **DEFAULT NOW()**       Generation timestamp
  ---------------------- --------------- ----------------------- --------------------------------------------------------------------------------------------

  -----------------------------------------------------------------------
  **FOREIGN KEYS**

  -----------------------------------------------------------------------

  ---------------- -------------------------------- --------------- --------------------------------------------
  **Column**       **References**                   **On Delete**   **Purpose**

  **resume_id**    resume.resumes(resume_id)        **CASCADE**     Embeddings deleted with resume

  **run_id**       analysis.analysis_runs(run_id)   **SET NULL**    Keep embedding if run deleted --- reusable
  ---------------- -------------------------------- --------------- --------------------------------------------

  -----------------------------------------------------------------------
  **INDEXES**

  -----------------------------------------------------------------------

  ------------------------ ------------------------------------ ------------- ----------------------------------------------------------
  **Index Name**           **Columns**                          **Type**      **Reason**

  **idx_re_resume_type**   resume_id, embedding_type            **B-Tree**    Get specific embedding type for a resume

  **idx_re_hnsw**          embedding_vector VECTOR_COSINE_OPS   **HNSW**      Production ANN for real-time match scoring

  **idx_re_ivfflat**       embedding_vector VECTOR_COSINE_OPS   **IVFFlat**   Batch analytics queries --- faster build, lower accuracy
  ------------------------ ------------------------------------ ------------- ----------------------------------------------------------

  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  *SQL: CREATE INDEX idx_re_hnsw ON analysis.resume_embeddings USING hnsw (embedding_vector vector_cosine_ops) WITH (m=16, ef_construction=64)*

  *SIMILARITY QUERY: SELECT 1-(e.embedding_vector \<=\> \$query) AS similarity FROM analysis.resume_embeddings e WHERE e.entity_type=\'full_resume\' ORDER BY e.embedding_vector \<=\> \$query LIMIT 5*

  *NOTE: Embeddings are model-version specific. When model upgrades, all embeddings must be regenerated. model_version field enables this migration path.*
  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**8.2 Enterprise-Scale: Standalone Vector DB Migration Path**

When the platform exceeds \~10M embeddings or requires sub-10ms ANN latency, vector storage migrates to Pinecone or Weaviate. The design anticipates this with the entity_type + entity_id column pattern --- the same pattern used by Pinecone\'s metadata filter. Migration is an ETL job with no schema changes to other tables.

+-----------------------------------------------------------------------------+
| **Unified Vectors Table --- Standalone Vector DB Compatibility**            |
+-----------------------------------------------------------------------------+
| If using Pinecone/Weaviate instead of pgvector, the schema maps to:         |
|                                                                             |
| +-------------------------------------------------------------------------+ |
| | \-- Standalone vector DB upsert structure (Pinecone-compatible):        | |
| |                                                                         | |
| | vector_id : UUID (= embedding_id)                                       | |
| |                                                                         | |
| | entity_type : string ENUM: resume_section \| skill \| job_role \| jd    | |
| |                                                                         | |
| | entity_id : UUID (= resume_id \| skill_id \| role_id \| jd_id)          | |
| |                                                                         | |
| | embedding : VECTOR(1536) (the actual vector)                            | |
| |                                                                         | |
| | metadata : {} {user_id, model_version, created_at}                      | |
| |                                                                         | |
| | \-- Vector dimension: 768 (bert/smaller models) or 1536 (OpenAI/Claude) | |
| |                                                                         | |
| | \-- Index type: HNSW for production \| IVFFlat for batch analytics      | |
| +-------------------------------------------------------------------------+ |
+-----------------------------------------------------------------------------+

**9.1 Three Redis Databases**

Redis is separated into three logical databases (DB 0, 1, 2). In high-scale deployments, these become three independent Redis Cluster instances for separate memory and eviction management.

**DB 0 --- Sessions**

  ------------------------- --------------- ----------------------------- ------------------------------------------- ------------------------------------------------------------------------
  **Key Pattern**           **Structure**   **TTL**                       **Value**                                   **Purpose**

  session:{session_id}      **HASH**        7 days sliding                user_id, email, account_type, permissions   Primary session. TTL refreshed on every request. Zero DB hit per auth.

  rate:{user_id}:analyses   **STRING**      Reset on billing period_end   Integer counter                             Analyses used this period. INCR atomic. Compare vs plan limit.

  rate:{key_hash}:rpm       **STRING**      60s sliding window            Integer counter                             API key rate limiting. INCR+EXPIRE atomically.
  ------------------------- --------------- ----------------------------- ------------------------------------------- ------------------------------------------------------------------------

**DB 1 --- Job Queues**

  ---------------------- ---------------------- ---------------------- ----------------------------------------- --------------------------------------------------------------------------
  **Key Pattern**        **Structure**          **TTL**                **Value**                                 **Purpose**

  queue:parse_jobs       **LIST LPUSH/BRPOP**   No TTL                 {job_id, resume_id, job_type, priority}   Parse job queue. Workers BRPOP. Priority jobs to head.

  queue:analysis_jobs    **LIST LPUSH/BRPOP**   No TTL                 {job_id, run_id, resume_id, company_id}   AI analysis pipeline queue. Separate for independent scaling.

  job:status:{run_id}    **HASH**               24h after completion   {status, stage, progress_pct, error}      Live progress. WebSocket subscriptions poll this. Frontend progress bar.

  dead_letter:{job_id}   **STRING**             30 days                Serialised job payload                    Failed jobs after 3 retries. Alert fires on insert.
  ---------------------- ---------------------- ---------------------- ----------------------------------------- --------------------------------------------------------------------------

**DB 2 --- Analysis Cache**

  -------------------------------------- ----------------- --------- ----------------------------------------- ---------------------------------------------------------------
  **Key Pattern**                        **Structure**     **TTL**   **Value**                                 **Purpose**

  cache:analysis:{resume_id}:{jd_hash}   **STRING JSON**   24h       Full serialised analysis result           Same resume+JD = cache hit. Saves 100% AI API cost on repeat.

  cache:jd_keywords:{jd_hash}            **STRING JSON**   7 days    {keywords, requirements, role_inferred}   JD keyword extraction reused across users with same JD.

  cache:company:{company_id}             **HASH**          1h        Company data inc. ATS quirks              Warmed on startup. Avoids DB hit per analysis.

  cache:plan:{plan_code}                 **HASH**          1h        All feature gate booleans for plan        Avoids DB hit on every authenticated API request.
  -------------------------------------- ----------------- --------- ----------------------------------------- ---------------------------------------------------------------

  ----------------------------- ----------------- --------------------------- --------------- -----------
  **From Table**                **Column**        **To Table**                **On Delete**   **Card.**

  auth.auth_providers           user_id           auth.users                  **CASCADE**     **N:1**

  auth.sessions                 user_id           auth.users                  **CASCADE**     **N:1**

  auth.api_keys                 user_id           auth.users                  **CASCADE**     **N:1**

  auth.api_keys                 org_id            billing.organisations       **SET NULL**    **N:1**

  resume.resumes                user_id           auth.users                  **CASCADE**     **N:1**

  resume.parsed_sections        resume_id         resume.resumes              **CASCADE**     **N:1**

  resume.raw_text_store         resume_id         resume.resumes              **CASCADE**     **1:1**

  resume.parsing_jobs           resume_id         resume.resumes              **CASCADE**     **N:1**

  analysis.analysis_runs        user_id           auth.users                  **CASCADE**     **N:1**

  analysis.analysis_runs        resume_id         resume.resumes              **CASCADE**     **N:1**

  analysis.analysis_runs        company_id        analysis.companies          **SET NULL**    **N:1**

  analysis.ats_scores           run_id            analysis.analysis_runs      **CASCADE**     **1:1**

  analysis.resume_skills        run_id            analysis.analysis_runs      **CASCADE**     **N:1**

  analysis.resume_skills        skill_id          analysis.skills             **RESTRICT**    **N:1**

  analysis.improvement_tips     run_id            analysis.analysis_runs      **CASCADE**     **N:1**

  analysis.improvement_tips     section_id        resume.parsed_sections      **SET NULL**    **N:1**

  analysis.highlight_feedback   run_id            analysis.analysis_runs      **CASCADE**     **N:1**

  analysis.highlight_feedback   section_id        resume.parsed_sections      **CASCADE**     **N:1**

  analysis.highlight_feedback   tip_id            analysis.improvement_tips   **SET NULL**    **N:1**

  analysis.job_match_results    run_id            analysis.analysis_runs      **CASCADE**     **N:1**

  analysis.job_match_results    role_id           analysis.job_roles          **RESTRICT**    **N:1**

  analysis.job_descriptions     user_id           auth.users                  **CASCADE**     **N:1**

  analysis.jd_match_analysis    run_id            analysis.analysis_runs      **CASCADE**     **N:1**

  analysis.jd_match_analysis    jd_id             analysis.job_descriptions   **RESTRICT**    **N:1**

  analysis.resume_embeddings    resume_id         resume.resumes              **CASCADE**     **N:1**

  analysis.job_role_skills      role_id           analysis.job_roles          **CASCADE**     **N:1**

  analysis.job_role_skills      skill_id          analysis.skills             **RESTRICT**    **N:1**

  billing.subscriptions         user_id           auth.users                  **CASCADE**     **N:1**

  billing.subscriptions         plan_id           billing.plans               **RESTRICT**    **N:1**

  billing.organisations         admin_user_id     auth.users                  **RESTRICT**    **N:1**

  billing.organisations         subscription_id   billing.subscriptions       **RESTRICT**    **1:1**

  billing.usage_events          user_id           auth.users                  **CASCADE**     **N:1**

  billing.usage_events          org_id            billing.organisations       **SET NULL**    **N:1**

  billing.usage_events          run_id            analysis.analysis_runs      **SET NULL**    **N:1**
  ----------------------------- ----------------- --------------------------- --------------- -----------

**11.1 Index Types**

  --------------- -------------------------------------------------------------------------------------
  **B-Tree**      Default. Equality and range queries. All WHERE, ORDER BY, JOIN on standard columns.

  --------------- -------------------------------------------------------------------------------------

  ------------------- -------------------------------------------------------------------------------------------
  **UNIQUE B-Tree**   Enforces uniqueness at DB level AND provides fast lookup. email, session_token, checksum.

  ------------------- -------------------------------------------------------------------------------------------

  --------------- --------------------------------------------------------------------------------------------------------------------
  **GIN**         Full-text search (TSVECTOR) and JSONB/array containment queries. keyword_details, skill_aliases, domain_whitelist.

  --------------- --------------------------------------------------------------------------------------------------------------------

  --------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **HNSW**        High-accuracy approximate nearest-neighbour for vector similarity. Production match scoring. Slightly slower build than IVFFlat but significantly higher recall.

  --------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------

  --------------- ------------------------------------------------------------------------------------------------------------------------------
  **IVFFlat**     Faster-build ANN index. Lower accuracy than HNSW. Used for batch analytics queries where approximate results are acceptable.

  --------------- ------------------------------------------------------------------------------------------------------------------------------

  -------------------- ------------------------------------------------------------------------------------------------------------------
  **Partial B-Tree**   Indexes only rows matching a WHERE condition. Small, fast, low write overhead. Essential for soft-delete tables.

  -------------------- ------------------------------------------------------------------------------------------------------------------

**11.2 Critical Partial Indexes**

+-------------------------------------------------------------------------------------+
| \-- Active users only (excludes soft-deleted accounts from every query)             |
|                                                                                     |
| CREATE INDEX idx_users_active ON auth.users (email)                                 |
|                                                                                     |
| WHERE deleted_at IS NULL;                                                           |
|                                                                                     |
| \-- Pending parse jobs (tiny subset of all parsing_jobs rows)                       |
|                                                                                     |
| CREATE INDEX idx_pj_pending ON resume.parsing_jobs (created_at ASC)                 |
|                                                                                     |
| WHERE status IN (\'queued\', \'retrying\');                                         |
|                                                                                     |
| \-- In-progress analyses only (live pipeline monitoring)                            |
|                                                                                     |
| CREATE INDEX idx_ar_in_progress ON analysis.analysis_runs (created_at)              |
|                                                                                     |
| WHERE status NOT IN (\'completed\', \'failed\');                                    |
|                                                                                     |
| \-- Active subscriptions (used in every billing feature gate check)                 |
|                                                                                     |
| CREATE INDEX idx_subs_active ON billing.subscriptions (user_id, current_period_end) |
|                                                                                     |
| WHERE status = \'active\';                                                          |
|                                                                                     |
| \-- Vector HNSW index (CONCURRENTLY = no table lock on live DB)                     |
|                                                                                     |
| CREATE INDEX CONCURRENTLY idx_re_hnsw                                               |
|                                                                                     |
| ON analysis.resume_embeddings                                                       |
|                                                                                     |
| USING hnsw (embedding_vector vector_cosine_ops)                                     |
|                                                                                     |
| WITH (m = 16, ef_construction = 64);                                                |
+-------------------------------------------------------------------------------------+

**11.3 Performance Optimisations**

  ------------------------------ ---------------------------------------------------------------------
  **ATS score results cached**   Redis DB2 with 24h TTL --- dashboard loads from cache, not DB query

  ------------------------------ ---------------------------------------------------------------------

  ---------------------------------- ------------------------------------------------------------------
  **Session validation via Redis**   Zero DB hit per authenticated request --- Redis HASH lookup only

  ---------------------------------- ------------------------------------------------------------------

  ------------------------ ------------------------------------------------------------------------------------------------
  **JSONB GIN indexes**    Fast containment queries on keyword_details, structured_data, ats_quirks without full row scan

  ------------------------ ------------------------------------------------------------------------------------------------

  ----------------------------- ----------------------------------------------------------------------------------------------
  **Separate raw text table**   Keeps resume.resumes rows narrow for fast B-Tree index scans --- TEXT blob in separate table

  ----------------------------- ----------------------------------------------------------------------------------------------

  --------------------------------------- ---------------------------------------------------------------------------------------------
  **Partial indexes on status columns**   Only indexes relevant subset of rows --- parse queue fetch 100x faster than full index scan

  --------------------------------------- ---------------------------------------------------------------------------------------------

  ---------------------------------- ----------------------------------------------------------------------------------------------
  **Denormalised ATS score field**   analysis_runs.overall_ats_score duplicated for dashboard ORDER BY without JOIN to ats_scores

  ---------------------------------- ----------------------------------------------------------------------------------------------

  ---------------------------- -----------------------------------------------------------------------------------------
  **Checksum deduplication**   Identical file re-upload detected by SHA-256 --- parsing skipped entirely, cache reused

  ---------------------------- -----------------------------------------------------------------------------------------

  ------------------------ ----------------------------------------------------------------------------------
  **JD hash caching**      Same JD from 100 different users = 1 keyword extraction + 100 match calculations

  ------------------------ ----------------------------------------------------------------------------------

**12.1 Data Classification & Protection**

  ---------------- ------------------------------------------------------------------------ --------------------------------------------------------------------------------------------------------------------------------
  **Level**        **Data Fields**                                                          **Protection Method**

  **CRITICAL**     password_hash, access_token, refresh_token, API raw key (never stored)   Argon2id (passwords), AES-256-GCM (OAuth tokens), SHA-256 one-way (API keys). Raw API key shown to user once, never persisted.

  **SENSITIVE**    email, full_name, ip_address, user_agent, resume full text, jd_text      TDE at PostgreSQL level. TLS 1.3 in transit. Soft-deleted and PII scrubbed on GDPR deletion. RLS enforced at DB layer.

  **RESTRICTED**   ATS scores, skill extractions, improvement tips, analysis results        Owned by user. RLS policy: user sees only own rows. Deleted on account deletion. No cross-user data exposure by design.

  **INTERNAL**     job logs, usage events, error messages, parse metrics                    Engineering access only. Anonymised on user deletion. Retained 2 years for debugging.

  **PUBLIC**       company names, job role titles, plan features                            No restrictions. Cached aggressively. No PII. No RLS required.
  ---------------- ------------------------------------------------------------------------ --------------------------------------------------------------------------------------------------------------------------------

**12.2 Row-Level Security (RLS)**

+-----------------------------------------------------------------------+
| ALTER TABLE resume.resumes ENABLE ROW LEVEL SECURITY;                 |
|                                                                       |
| ALTER TABLE analysis.analysis_runs ENABLE ROW LEVEL SECURITY;         |
|                                                                       |
| \-- Users see only their own resumes                                  |
|                                                                       |
| CREATE POLICY user_resumes ON resume.resumes                          |
|                                                                       |
| USING (user_id = current_setting(\'app.current_user_id\')::UUID);     |
|                                                                       |
| \-- B2B org admin can see all member analyses                         |
|                                                                       |
| CREATE POLICY org_admin_analyses ON analysis.analysis_runs            |
|                                                                       |
| USING (                                                               |
|                                                                       |
| user_id = current_setting(\'app.current_user_id\')::UUID              |
|                                                                       |
| OR user_id IN (                                                       |
|                                                                       |
| SELECT user_id FROM billing.org_members                               |
|                                                                       |
| WHERE org_id = current_setting(\'app.current_org_id\')::UUID          |
|                                                                       |
| AND current_setting(\'app.is_org_admin\')::BOOLEAN = TRUE             |
|                                                                       |
| )                                                                     |
|                                                                       |
| );                                                                    |
+-----------------------------------------------------------------------+

**12.3 File Security (S3)**

  ------------------------------ -----------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Signed URLs for download**   Files never served via direct S3 URL. Application generates pre-signed URLs with 15-minute expiry on each download request. Prevents unauthorised file sharing.

  ------------------------------ -----------------------------------------------------------------------------------------------------------------------------------------------------------------

  ------------------------------- ----------------------------------------------------------------------------------------------------------------------------------------------------
  **File scanning for malware**   Every uploaded file scanned via ClamAV or AWS GuardDuty before S3 write is confirmed to parsing_jobs. Infected files rejected with specific error.

  ------------------------------- ----------------------------------------------------------------------------------------------------------------------------------------------------

  ---------------------------- ---------------------------------------------------------------------------------------------
  **Server-side encryption**   S3 bucket configured with SSE-S3 or SSE-KMS. All files encrypted at rest in object storage.

  ---------------------------- ---------------------------------------------------------------------------------------------

  ------------------------------------- -----------------------------------------------------------------------------------------------------------
  **Bucket policy: no public access**   S3 bucket has BlockPublicAcls=true. No file is ever publicly accessible. All access goes through the API.

  ------------------------------------- -----------------------------------------------------------------------------------------------------------

**12.4 Data Retention Policy**

  ---------------------------- ------------------------------------------------------------------------------------------------
  **Data Type**                **Retention Policy**

  **Resume files (S3)**        Indefinite while account active. Purged 30 days after account deletion or version replacement.

  **Parsed resume data**       Retained with resume. Hard-purged 30 days after soft delete.

  **Analysis results**         Indefinite for active users (enables progress tracking). Deleted with account on GDPR request.

  **Session records (PG)**     90 days after expiry. Auto-purged by weekly cron.

  **Usage events (billing)**   7 years --- financial compliance. PII anonymised on user deletion, event record retained.

  **Audit logs**               5 years --- append-only. PII scrubbed on GDPR deletion, record retained for compliance.

  **AI embeddings**            Retained with resume. Regenerated on model version change. Deleted with resume.

  **Parse job logs**           90 days. Engineering debugging. Auto-purged.
  ---------------------------- ------------------------------------------------------------------------------------------------

**13.1 Scalability Strategy for 1M+ Users**

The platform decomposes into independent services at scale. Each service owns its read/write path --- no service reads from another service\'s tables directly. Communication is via events/queues.

  -------------------- ----------------------------------------------------------------------------------------------------
  **Upload Service**   Handles file validation, S3 write, resume.resumes INSERT. Stateless. Scale horizontally with load.

  -------------------- ----------------------------------------------------------------------------------------------------

  --------------------------- ----------------------------------------------------------------------------------------------------------------------
  **AI Processing Service**   Parses documents, runs NLP, extracts skills, generates embeddings. GPU-accelerated pods. Scale based on queue depth.

  --------------------------- ----------------------------------------------------------------------------------------------------------------------

  --------------------- -------------------------------------------------------------------------------------------------------------------
  **Scoring Service**   Runs ATS simulation, calculates match scores, generates verdict. CPU-bound. Scale based on analysis queue length.

  --------------------- -------------------------------------------------------------------------------------------------------------------

  ---------------------------- -----------------------------------------------------------------------------------------------------------
  **Recommendation Service**   Calls Claude API for tip generation. Rate-limited externally. Scale based on API quota, not server count.

  ---------------------------- -----------------------------------------------------------------------------------------------------------

  --------------------- ----------------------------------------------------------------------------------------------------------------------
  **Billing Service**   Handles Stripe webhooks, subscription updates, usage tracking. Stateless. Low throughput, high reliability required.

  --------------------- ----------------------------------------------------------------------------------------------------------------------

  --------------------------- -------------------------------------------------------------------------------------------------------------------------------------------------
  **Message Queue (Redis)**   All async communication between services via Redis Lists. Upload → parse queue → analysis queue → complete. No direct service-to-service calls.

  --------------------------- -------------------------------------------------------------------------------------------------------------------------------------------------

**13.2 Zero-Downtime Migration Rules**

  ------------------------------------ ---------------------------------------------------------------------------------------------------------------
  **Never rename a column directly**   Add new_column → backfill → update code → drop old_column in next release. Never atomic rename on live table.

  ------------------------------------ ---------------------------------------------------------------------------------------------------------------

  --------------------------------------- -----------------------------------------------------------------------------------------------------------
  **Never change column type directly**   Add new typed column → CAST + copy data → update application → drop old column. Prevents lock escalation.

  --------------------------------------- -----------------------------------------------------------------------------------------------------------

  ------------------------------- ----------------------------------------------------------------------------------------------------------------------------------------
  **CREATE INDEX CONCURRENTLY**   Always. Adds indexes without table lock. Slightly slower build. Production unaffected. Never skip CONCURRENTLY on tables \> 100k rows.

  ------------------------------- ----------------------------------------------------------------------------------------------------------------------------------------

  ----------------------------------- -----------------------------------------------------------------------------------------------------------------------------
  **Add columns as NULLABLE first**   Adding NOT NULL column requires full table rewrite in older PG versions. Add NULLABLE first, backfill, then add constraint.

  ----------------------------------- -----------------------------------------------------------------------------------------------------------------------------

  ---------------------------------- -----------------------------------------------------------------------------------------------------------------------------
  **Test on production-size data**   A migration taking 2ms on 1,000 dev rows may take 40 minutes on 50M production rows. Load a prod snapshot in staging first.

  ---------------------------------- -----------------------------------------------------------------------------------------------------------------------------

  ---------------------------------- -------------------------------------------------------------------------------------------------------------------------
  **Schema version tracked in DB**   Alembic/Flyway writes to schema_versions table. CI checks version before deployment. Prevents duplicate migration runs.

  ---------------------------------- -------------------------------------------------------------------------------------------------------------------------

+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| *\"A database schema is a contract. Every table, every column, every index is a promise to the application layer. Design it with the same care you would design a public API --- because you will have to live with every decision you make here, at scale, under load, at 3am when production is on fire.\"* |
|                                                                                                                                                                                                                                                                                                               |
| **--- PROJECT_AI_RESUME_ANALYZER \| Database Design Document \| Final v2.0**                                                                                                                                                                                                                                  |
+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
