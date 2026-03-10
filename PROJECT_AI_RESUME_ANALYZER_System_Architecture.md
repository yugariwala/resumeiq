**PROJECT_AI_RESUME_ANALYZER**

System Architecture Document

Final Merged Version --- v2.0

  ----------------------------- -----------------------------------------
  **Document**                  System Architecture

  **Version**                   2.0 --- Merged Final

  **Standard**                  SRS v1.0 --- IEEE 830

  **Date**                      March 2026

  **Classification**            **CONFIDENTIAL**
  ----------------------------- -----------------------------------------

**1. Overview**

The AI Resume Analyzer is an intelligent, web-based platform that processes resumes, predicts candidate selection probability, and delivers actionable improvement plans. The system combines a multi-stage AI/ML pipeline, a secure Node.js backend, and an interactive frontend to provide real-time analysis and feedback at scale.

The platform is designed for three audiences:

-   Individual job seekers --- upload resumes, receive ATS scores, skill gap analysis, job match suggestions, and step-by-step improvement plans.

-   B2B College Clients --- bulk resume processing for placement cells.

-   B2B Corporate Clients --- high-volume screening and candidate ranking pipelines.

**Core design goals:**

-   **Modularity:** each tier (frontend, API, AI engine, data) is independently deployable and replaceable.

-   **Scalability:** horizontal scaling of the stateless AI service via Docker / AWS ECS.

-   **Performance:** end-to-end analysis completed in under 15 seconds per resume.

-   **Security:** HTTPS everywhere, AES-256 encrypted file storage, JWT-based auth, RBAC.

-   **Reliability:** 99% uptime target, automated backups, graceful degradation on external API unavailability.

**2. High-Level Architecture**

The system is organized into five horizontal tiers communicating over secure internal channels:

  ---------- --------------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Tier**   **Name**              **Components**

  01         Presentation Layer    Web Browser UI (HTML / Tailwind CSS / JS) --- Resume upload, questionnaire, ATS dashboard, highlighted resume viewer, PDF download

  02         Application Layer     Node.js + TypeScript REST API --- Auth, orchestration, rate limiting, webhook handling, admin panel

  03         AI Processing Layer   Python (FastAPI) AI Engine --- 9-step pipeline: Parse → NLP → Classify → Extract → Score/Embed → Predict → Generate → Highlight

  04         External Services     Anthropic Claude API (LLM generation) · OpenAI / sentence-transformers (embeddings) · Razorpay (billing) · SendGrid / SES (email) · Datadog / CloudWatch (monitoring)

  05         Data Layer            PostgreSQL 15+ (persistent) · Redis 7+ (cache) · AWS S3 / GCP GCS (file storage) · Job Role DB (Kaggle + curated)
  ---------- --------------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------

**Logical flow summary:**

> User Browser
>
> \| HTTPS
>
> v
>
> Node.js API \<\--\> PostgreSQL / Redis / S3
>
> \| Internal HTTP
>
> v
>
> Python AI Engine
>
> \| SDK calls / REST
>
> v
>
> Claude API · Embeddings API · Razorpay · SendGrid · Datadog

**3. Component Descriptions**

**3.1 Frontend --- Presentation Layer**

Technology: HTML5, CSS3, JavaScript, Tailwind CSS

**Responsibilities:**

-   Resume PDF / DOCX upload via drag-and-drop or file picker.

-   Target company and job role input form.

-   Optional skills-assessment questionnaire for implicit skill capture.

-   Interactive ATS score gauge with breakdown by category.

-   Color-coded resume viewer (Green = strong, Yellow = improvable, Red = missing/weak) with hover tooltips from the Highlight Engine.

-   Skill gap table with matched and missing skills per target role.

-   Job match suggestions ranked by cosine similarity score.

-   Improvement plan display with ordered learning steps.

-   One-click downloadable PDF report with annotations.

-   Admin Panel (B2B): bulk upload, aggregate analytics, user management.

**3.2 Backend API --- Application Layer**

Technology: Node.js with TypeScript

**Responsibilities:**

-   Accept resume uploads and questionnaire payloads; forward to AI Engine.

-   Manage user authentication (JWT), session tokens, and role-based access control (individual / college / corporate / admin).

-   Orchestrate AI Engine calls with retry logic and graceful degradation.

-   Persist and retrieve all analysis results, user data, and subscriptions from PostgreSQL via Prisma ORM.

-   Serve cached results from Redis on duplicate resume submissions (SHA-256 hash match).

-   Handle Razorpay webhook events for subscription lifecycle management.

-   Rate-limit API endpoints to prevent abuse.

**REST API Endpoints:**

  ------------------------- --------------------------------------------------------------
  **Endpoint**              **Description**

  POST /auth/register       User registration; returns JWT

  POST /auth/login          Authenticate; returns JWT + refresh token

  POST /uploadResume        Upload resume PDF/DOCX; triggers AI pipeline

  GET /analysis/{userId}    Retrieve latest or historical analysis results

  POST /matchJob            Submit job description; return cosine similarity match score

  GET /skills/{userId}      Return extracted skills, gaps, and learning plan

  POST /admin/bulkUpload    B2B: batch resume upload endpoint

  GET /admin/analytics      Aggregate stats for B2B admin dashboard

  POST /webhooks/razorpay   Handle payment and subscription events
  ------------------------- --------------------------------------------------------------

**3.3 AI Engine --- Processing Layer**

Technology: Python 3.11+ with FastAPI

The AI Engine is a stateless microservice containing an 8-stage pipeline (steps 5a and 5b run in parallel). Each stage is independently testable and replaceable.

**Pipeline Stages:**

-   **Step 1 --- Document Parser:** Extract raw text from PDF and DOCX files handling multi-column layouts, tables, and embedded graphics. Libraries: PyMuPDF, python-docx.

-   **Step 2 --- NLP Section Structuring:** Segment extracted text into semantic sections (Contact, Summary, Experience, Education, Skills, Projects). Perform Named Entity Recognition and date normalization. Library: spaCy.

-   **Step 3 --- Text Classifier:** Classify resume sections and individual bullet points into predefined categories using a fine-tuned BERT model (HuggingFace). Detects implicit skills from descriptive language.

-   **Step 4 --- Skill Extractor:** Extract both explicit (keyword-listed) and implicit (contextually inferred) skills. Maps extracted skills against the Job Role DB skill taxonomy.

-   **Step 5a --- Embedding Engine \[parallel\]:** Vectorize the resume and all job role profiles using OpenAI text-embedding-3-small (or sentence-transformers all-MiniLM-L6-v2 as open-source fallback). Compute cosine similarity to return top-5 role matches.

-   **Step 5b --- ATS Scoring Engine \[parallel\]:** Apply hybrid rule-based + ML scoring across six dimensions: formatting, keyword density, section completeness, quantification, action verbs, and ATS parse-friendliness. Returns a 0--100 score with per-dimension breakdown.

-   **Step 6 --- Selection Predictor:** Classify candidate into Category A (shortlist) or Category B (reject) with a confidence percentage, based on combined ATS score, skill match score, and embedding similarity.

-   **Step 7 --- Claude API Generation:** Call Anthropic Claude (claude-sonnet) to generate: actionable improvement tips per weak section, a personalized learning plan for missing skills, and rewritten bullet point suggestions. All prompts structured for JSON output; graceful degradation if the API is unavailable.

-   **Step 8 --- Highlight Engine:** Map AI feedback back to specific resume text positions. Generate a highlight map JSON (position → colour + tooltip content) at section and bullet granularity for frontend rendering.

**3.4 External Services**

  --------------------- -------------------------------------------------------------------------------------------- --------------------------------------------------------------------------------------------------------------
  **Service**           **Provider / Model**                                                                         **Usage**

  LLM Generation        Anthropic Claude (claude-sonnet)                                                             Improvement tips, learning plan, bullet rewrites, reasoning narratives via structured JSON prompts

  Embeddings            OpenAI text-embedding-3-small (primary); sentence-transformers all-MiniLM-L6-v2 (fallback)   Semantic vectorization of resumes and job descriptions for cosine similarity matching

  Billing (INR)         Razorpay SDK                                                                                 Pro (₹299/mo), Pay-per-use (₹49), B2B College (₹10,000/mo), B2B Corporate (custom). Webhook-based lifecycle.

  Transactional Email   SendGrid or AWS SES                                                                          Account verification, password reset (30-min token), analysis report delivery notifications

  Monitoring            Datadog or AWS CloudWatch                                                                    API latency, per-stage pipeline performance, error rates, Claude API cost-per-analysis, DAU/MAU metrics
  --------------------- -------------------------------------------------------------------------------------------- --------------------------------------------------------------------------------------------------------------

**3.5 Data Layer**

**3.5.1 PostgreSQL 15+ --- Primary Persistent Store**

ORM: Prisma. Daily automated backups with 30-day retention. RTO ≤ 4 hours, RPO ≤ 24 hours.

**Entities:**

-   **User:** id, email, password_hash, role (individual / college / corporate / admin), created_at, subscription_id

-   **Resume:** id, user_id, s3_key, sha256_hash, upload_at, format (pdf/docx), file_size

-   **Analysis:** id, resume_id, ats_score, selection_category, confidence_pct, highlight_map_json, created_at

-   **Skill:** id, analysis_id, skill_name, type (explicit/implicit), present (bool), match_score

-   **LearningPlan:** id, analysis_id, step_order, skill_name, resource_url, estimated_hours

-   **Subscription:** id, user_id, plan, status, razorpay_sub_id, current_period_end

-   **B2BAccount:** id, org_name, type (college/corporate), admin_user_id, monthly_quota, used_quota

-   **AdminLog:** id, admin_id, action, target_id, timestamp

-   **Jobs:** id, role_title, company, required_skills_json, benchmark_ats_score, last_updated

**3.5.2 Redis 7+ --- Cache Layer**

-   Analysis result cache keyed by SHA-256 hash of the resume file. TTL: 30 days. Identical resume re-submissions return cached results without re-running the pipeline, reducing cost and latency.

-   Session tokens and JWT blacklist.

-   Rate-limit counters per user/IP.

**3.5.3 Object Storage --- AWS S3 / GCP GCS**

-   AES-256 server-side encryption for all stored resume files.

-   Presigned URLs for secure, time-limited upload and download.

-   30-day lifecycle auto-expiry policy for unclaimed or free-tier files.

-   Immediate purge on account deletion (GDPR / data-right compliance).

**3.5.4 Job Role Requirements Database**

-   Sourced from Kaggle 24-role job dataset with curated additions for Indian job market roles.

-   Stores: role title, company, required skills JSON, benchmark ATS score, typical keyword density.

-   Admin-managed quarterly refresh cycle to keep requirements current.

**4. End-to-End Data Flow**

  -------- --------------------------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **\#**   **Stage**                         **Detail**

  1        Resume Upload                     User uploads PDF/DOCX and optionally fills in target role + questionnaire. Frontend sends multipart POST /uploadResume with JWT auth header.

  2        Backend Orchestration             API validates auth, checks Redis for SHA-256 cache hit. On cache miss, stores file to S3, saves Resume entity to PostgreSQL, and forwards to AI Engine.

  3        Document Parsing                  AI Engine step 1--2: PyMuPDF / python-docx extracts raw text; spaCy segments into sections, performs NER and date normalization.

  4        Classification & Extraction       Steps 3--4: BERT classifies section content; NLP patterns extract explicit and implicit skills. Skill list mapped against Job Role DB.

  5        Scoring & Matching \[parallel\]   Step 5a: Embeddings API vectorizes resume + job profiles; cosine similarity returns top-5 role matches. Step 5b: Hybrid ATS scoring returns 0--100 score with dimension breakdown.

  6        Prediction & Generation           Step 6: Selection Predictor assigns Cat A/B with confidence %. Step 7: Claude API generates improvement tips, learning plan, and bullet rewrites as structured JSON.

  7        Highlight Map                     Step 8: Highlight Engine maps all AI feedback to resume text positions. Returns Green/Yellow/Red highlight map JSON with tooltip content.

  8        Persistence                       Backend stores Analysis, Skill, and LearningPlan entities to PostgreSQL. Caches full result in Redis under SHA-256 key.

  9        Frontend Display                  React/JS frontend renders ATS dashboard, color-coded resume, skill gap table, job matches, learning plan, and downloadable annotated PDF.

  10       Email Notification (optional)     SendGrid / SES sends analysis summary email with deep link to results.
  -------- --------------------------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**5. Full Technology Stack**

  -------------------- ------------------------------------------ ---------------------------------------------------------------------
  **Layer / Module**   **Technology**                             **Purpose**

  Frontend             HTML5 / CSS3 / JS / Tailwind CSS           Responsive UI, resume upload, ATS dashboard, highlight viewer

  Frontend             PDF.js                                     Client-side PDF rendering with overlay support for highlight map

  Backend API          Node.js + TypeScript                       REST API, auth orchestration, rate limiting, webhook handling

  Backend API          Prisma ORM                                 Type-safe database access layer over PostgreSQL

  Backend API          Docker + AWS ECS                           Containerized deployment with horizontal auto-scaling

  AI Engine            Python 3.11+ / FastAPI                     8-stage async AI processing pipeline

  AI Engine            PyMuPDF + python-docx                      PDF and DOCX text extraction with layout preservation

  AI Engine            spaCy                                      NLP section segmentation, NER, date normalization

  AI Engine            BERT / HuggingFace                         Fine-tuned text classifier for section and skill categorization

  AI Engine            OpenAI text-embedding-3-small              Primary embedding model; semantic resume--JD matching

  AI Engine            sentence-transformers (all-MiniLM-L6-v2)   Open-source embedding fallback

  LLM                  Anthropic Claude (claude-sonnet)           Improvement tips, learning plans, bullet rewrites

  Database             PostgreSQL 15+                             Primary persistent store for all structured data

  Cache                Redis 7+                                   Analysis cache (30-day TTL), session tokens, rate-limit counters

  File Storage         AWS S3 / GCP GCS                           AES-256 encrypted resume storage with presigned URLs

  Reference Data       Job Role DB (Kaggle + curated)             24+ job role profiles with skill taxonomies and benchmarks

  Billing              Razorpay SDK                               INR subscription and pay-per-use billing with webhook lifecycle

  Email                SendGrid or AWS SES                        Transactional email: verification, password reset, report delivery

  Monitoring           Datadog / AWS CloudWatch                   Latency, error rate, cost-per-analysis, DAU/MAU dashboards

  Auth                 JWT + Refresh Tokens                       Stateless auth with RBAC (individual / college / corporate / admin)
  -------------------- ------------------------------------------ ---------------------------------------------------------------------

**6. Billing and User Tiers**

  ---------------- ----------------- --------------------- --------------------------------------------------------------------------------------
  **Plan**         **Price**         **Audience**          **Key Features**

  Free             ₹0                Individual            Limited analyses/month, basic ATS score, no PDF download

  Pro              ₹299 / month      Individual            Unlimited analyses, full ATS breakdown, PDF download, learning plans, priority queue

  Pay-per-Use      ₹49 / analysis    Individual            No subscription required; single analysis purchase

  B2B College      ₹10,000 / month   Placement cells       Bulk upload, aggregate analytics, admin panel, per-student reports

  B2B Corporate    Custom pricing    Enterprise HR teams   High-volume screening, ATS export, custom role profiles, dedicated SLA
  ---------------- ----------------- --------------------- --------------------------------------------------------------------------------------

Billing is managed by Razorpay (INR). Subscription lifecycle events (creation, renewal, cancellation, failure) are handled via Razorpay webhooks received at POST /webhooks/razorpay. Feature gating is enforced in the Node.js middleware layer based on the subscription status stored in PostgreSQL.

**7. Security Architecture**

**7.1 Transport Security**

-   HTTPS / TLS 1.3 enforced on all external endpoints. HTTP redirects to HTTPS.

-   Internal service-to-service communication over private VPC with mTLS where applicable.

**7.2 Authentication & Authorization**

-   JWT access tokens (15-minute expiry) + refresh tokens (7-day expiry, stored in HttpOnly cookies).

-   Role-Based Access Control: individual, college_admin, corporate_admin, platform_admin.

-   JWT blacklist maintained in Redis for immediate token revocation (logout / account deletion).

**7.3 Data Protection**

-   Resume files encrypted at rest with AES-256 (SSE-S3 or SSE-KMS).

-   Passwords hashed with bcrypt (cost factor 12).

-   PII fields (email, name) in PostgreSQL encrypted at the application layer.

-   Presigned S3 URLs expire after 15 minutes; no direct public bucket access.

-   Account deletion triggers immediate S3 object deletion and PostgreSQL GDPR purge job.

**7.4 Input Validation & Rate Limiting**

-   File type validation: PDF and DOCX only; virus scan on upload.

-   File size limit: 10 MB per resume.

-   API rate limiting: 60 requests/minute per authenticated user; 10 requests/minute per unauthenticated IP.

-   SQL injection and XSS protection via Prisma parameterized queries and input sanitization.

**8. Scalability and Infrastructure**

**8.1 Deployment Model**

-   All services containerized with Docker and orchestrated via AWS ECS (Elastic Container Service) or equivalent.

-   AI Engine is stateless; multiple instances can run in parallel behind a load balancer.

-   Backend API is stateless (session state in Redis); horizontally scalable.

-   PostgreSQL runs on a managed instance (e.g., AWS RDS) with read replicas for reporting queries.

**8.2 Queue Management**

-   High-volume upload bursts handled by a message queue (e.g., AWS SQS or Redis Queue) between the API and AI Engine, preventing overload and enabling backpressure.

-   B2B bulk-upload jobs processed asynchronously with progress callbacks to the admin panel.

**8.3 Caching Strategy**

-   Redis SHA-256 hash cache eliminates redundant AI pipeline runs for identical resume files (30-day TTL).

-   Job Role DB profiles cached in application memory and refreshed quarterly.

-   Frequently accessed analysis results served from Redis before hitting PostgreSQL.

**9. System Characteristics & SLA**

  ---------------------- --------------------------------------------------------------- -------------------------------------------------------------------------------------
  **Characteristic**     **Target**                                                      **Implementation Strategy**

  Performance            End-to-end analysis ≤ 15 seconds (cold); ≤ 2 seconds (cached)   Parallel pipeline steps 5a/5b; Redis caching; async Claude calls

  Availability           99% uptime                                                      Multi-AZ ECS deployment; automated health checks; circuit breakers on external APIs

  Scalability            Horizontal AI service scaling                                   Stateless FastAPI containers + ECS auto-scaling on CPU/queue depth

  Data Durability        Daily backups, 30-day retention                                 Automated RDS snapshots; S3 versioning; RTO ≤ 4h, RPO ≤ 24h

  Security               Zero PII leakage                                                AES-256 at rest; TLS 1.3 in transit; RBAC; JWT; presigned URLs

  Usability              Actionable, visual output                                       Color-coded highlight map; ordered learning plans; downloadable PDF

  Graceful Degradation   Service continuity on external API failure                      Fallback embeddings (sentence-transformers); queued retries for Claude API

  Compliance             GDPR-aligned data handling                                      Immediate purge on deletion; consent-based questionnaire; minimal PII retention
  ---------------------- --------------------------------------------------------------- -------------------------------------------------------------------------------------

**10. Monitoring and Observability**

-   **API Latency:** Per-endpoint p50 / p95 / p99 tracked in Datadog or CloudWatch. Alerts on p95 \> 5 seconds.

-   **AI Pipeline Stage Timings:** Each of the 8 pipeline steps emits a timing metric; slow-stage detection for optimization.

-   **Error Rates:** 5xx error rate tracked per service. PagerDuty alert on sustained \>1% error rate.

-   **Claude API Cost-per-Analysis:** Token usage logged per request to track and budget LLM costs.

-   **DAU / MAU:** Daily and monthly active user metrics feeding business KPI dashboard.

-   **B2B Quota Usage:** Per-organization usage tracked; auto-alert at 80% and 100% of monthly quota.

-   **Cache Hit Rate:** Redis hit/miss ratio monitored; low hit rate triggers investigation of hash key logic.

-   **Structured Logging:** JSON-formatted logs from all services shipped to centralized log aggregation (e.g., CloudWatch Logs / Datadog Logs) with correlation IDs for end-to-end request tracing.

**Appendix A --- Database Schema Summary**

  ---------------- --------------------------------------------------------------------------------------------------------------------
  **Table**        **Key Fields**

  users            id, email, password_hash, role, subscription_id, created_at, deleted_at

  resumes          id, user_id, s3_key, sha256_hash, upload_at, format, file_size_bytes

  analyses         id, resume_id, ats_score, selection_category, confidence_pct, highlight_map_json, pipeline_duration_ms, created_at

  skills           id, analysis_id, skill_name, type (explicit/implicit), present, match_score

  learning_plans   id, analysis_id, step_order, skill_name, resource_url, estimated_hours

  jobs             id, role_title, company, required_skills_json, benchmark_ats_score, last_updated

  subscriptions    id, user_id, plan, status, razorpay_sub_id, current_period_start, current_period_end

  b2b_accounts     id, org_name, type, admin_user_id, monthly_quota, used_quota, contract_start

  admin_logs       id, admin_id, action, target_type, target_id, payload_json, timestamp
  ---------------- --------------------------------------------------------------------------------------------------------------------

**Appendix B --- AI Pipeline Quick Reference**

  ---------- ------------------------- -------------------------------- --------------------------------------
  **Step**   **Name**                  **Library / Service**            **Output**

  1          Document Parser           PyMuPDF, python-docx             Raw text with structural hints

  2          NLP Section Structuring   spaCy (NER + dates)              Segmented section map

  3          Text Classifier           BERT / HuggingFace               Section + bullet category labels

  4          Skill Extractor           Custom NLP patterns              Explicit + implicit skill list

  5a ∥       Embedding Engine          OpenAI / sentence-transformers   Top-5 role match scores

  5b ∥       ATS Scoring Engine        Rule + ML hybrid                 0--100 score + dimension breakdown

  6          Selection Predictor       ML classifier                    Cat A/B + confidence %

  7          Claude API Generation     Anthropic claude-sonnet          Tips, learning plan, rewrites (JSON)

  8          Highlight Engine          Custom mapping logic             Position → colour + tooltip JSON
  ---------- ------------------------- -------------------------------- --------------------------------------

PROJECT_AI_RESUME_ANALYZER · System Architecture v2.0 · IEEE 830 / SRS v1.0 · CONFIDENTIAL · MARCH 2026
