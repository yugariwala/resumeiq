# AI Resume Analyzer — Complete API Documentation

> **Project:** ResumeIQ — AI-Powered Resume Analysis Platform  
> **Version:** 1.0  
> **Base URL:** `https://api.resumeiq.ai/v1`  
> **Protocol:** HTTPS only  
> **Format:** All requests and responses use `application/json` unless noted  

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Architecture & Services](#2-architecture--services)
3. [Base API Information](#3-base-api-information)
4. [Authentication API](#4-authentication-api)
5. [Resume Upload API](#5-resume-upload-api)
6. [Resume Parsing API](#6-resume-parsing-api)
7. [ATS Scoring API](#7-ats-scoring-api)
8. [Skill Extraction API](#8-skill-extraction-api)
9. [Job Match API](#9-job-match-api)
10. [Job Description Matcher API](#10-job-description-matcher-api)
11. [Resume Highlight API](#11-resume-highlight-api)
12. [AI Feedback & Improvement Tips API](#12-ai-feedback--improvement-tips-api)
13. [Async Job Management API](#13-async-job-management-api)
14. [Webhooks](#14-webhooks)
15. [Analytics & Usage API](#15-analytics--usage-api)
16. [Rate Limits & Plans](#16-rate-limits--plans)
17. [Error Handling](#17-error-handling)
18. [Data Models & Schemas](#18-data-models--schemas)
19. [Security & Compliance](#19-security--compliance)
20. [Suggested Tech Stack](#20-suggested-tech-stack)
21. [SDK Examples](#21-sdk-examples)

---

## 1. System Overview

The **AI Resume Analyzer** is a web-based platform where job seekers upload resumes and receive a full AI-driven analysis in seconds. The platform addresses a critical problem: 95% of large companies use Applicant Tracking Systems (ATS) to filter resumes before any human ever sees them. Most candidates are rejected by software — not because their experience is lacking, but because their resume is not optimised for how modern hiring actually works.

**What the platform does:**

- Parses PDF and DOCX resumes into structured, machine-readable data
- Evaluates ATS compatibility across five scoring dimensions
- Extracts explicit and implicit skills using NLP
- Matches candidates to job roles using vector embeddings
- Generates specific, actionable improvement tips via AI
- Colour-codes the resume visually so candidates see exactly what is weak, average, or strong
- Matches a resume against any specific job description the candidate pastes in

**Core value proposition:**  
*"95% of resumes never reach a human — they are rejected by a robot. ResumeIQ shows you exactly what the robot sees and how to beat it."*

---

## 2. Architecture & Services

The system follows a modular, microservice-friendly architecture where each service scales independently. The AI processing pipeline is event-driven and supports both synchronous (real-time) and asynchronous (queued) modes.

### Core Services

| Service | Responsibility |
|---|---|
| Authentication Service | User registration, login, JWT issuance, OAuth |
| Resume Upload & Parsing Service | File ingestion, PDF/DOCX text extraction, structure detection |
| NLP Structuring Service | Dividing raw text into labelled sections (Education, Experience, Skills) |
| Skill Extraction Service | Identifying explicit and implicit skills, categorisation, proficiency inference |
| ATS Scoring Engine | Keyword scoring, format scoring, consistency checks, overall ATS score |
| Job Matching Engine | Embedding-based similarity matching against 2,400+ job roles |
| Resume Highlight Engine | Mapping feedback back to specific text ranges for colour-coded UI overlays |
| Job Description Matcher | Comparing resume against a specific JD, keyword gap analysis, bullet rewrites |
| AI Feedback Generator | Generating actionable improvement tips via Claude/GPT |
| Analytics & Usage Tracking | Per-user and per-endpoint usage, quota enforcement |

### Processing Pipeline Flow

```
PDF Upload
    ↓
Document Parser  (PDFMiner / PyMuPDF — extracts raw text, preserves layout)
    ↓
NLP Structuring  (spaCy / Transformers — labels sections)
    ↓
Text Classification  (tags each element: heading, bullet, contact, etc.)
    ↓
Skill Extractor  (explicit keywords + implicit inference)
    ↓
Embeddings Generation  (OpenAI / Sentence Transformers — 1536-dim vectors)
    ↓
Similarity Scoring  (cosine similarity → ATS Score + Job Match %)
    ↓
AI Feedback Generator  (Claude / OpenAI → specific improvement tips)
    ↓
Highlight Engine  (maps feedback → character ranges for front-end overlay)
    ↓
Results Dashboard
```

### Infrastructure

| Component | Technology |
|---|---|
| Backend | Python (FastAPI) or Node.js (NestJS) |
| AI / NLP Services | Python microservices, spaCy, Hugging Face Transformers |
| LLM | OpenAI API / Claude API (Anthropic) |
| Document Parsing | PDFMiner, PyMuPDF |
| Embeddings | OpenAI `text-embedding-ada-002` or Sentence Transformers |
| Vector Database | Pinecone / Weaviate |
| Primary Database | PostgreSQL |
| File Storage | AWS S3 (encrypted) |
| Queue | Redis + Celery |
| Cache | Redis |

---

## 3. Base API Information

```
Base URL:    https://api.resumeiq.ai/v1
Sandbox URL: https://sandbox.api.resumeiq.ai/v1
```

### Required Headers (all authenticated endpoints)

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
Accept: application/json
```

### Environments

| Environment | Base URL | Notes |
|---|---|---|
| Production | `https://api.resumeiq.ai/v1` | Live traffic, real billing |
| Sandbox | `https://sandbox.api.resumeiq.ai/v1` | Testing, no billing, mocked AI responses |

### API Versioning

The API uses URI-based versioning (`/v1`). Breaking changes are introduced in a new version. Each version is supported for a minimum of 24 months after a successor version is released.

### Standard Response Envelope

**Success:**
```json
{
  "success": true,
  "data": { },
  "meta": {
    "request_id": "req_01HXYZ...",
    "processing_time_ms": 812,
    "timestamp": "2025-07-15T09:30:00Z"
  }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "RESUME_PARSE_FAILED",
    "message": "Unable to extract text from the uploaded file.",
    "detail": "The PDF appears to be image-only. Enable ocr_mode.",
    "docs_url": "https://docs.resumeiq.ai/errors/RESUME_PARSE_FAILED"
  },
  "meta": {
    "request_id": "req_01HXYZ..."
  }
}
```

### Idempotency

POST endpoints that create resources support an optional `Idempotency-Key` header. If a request with the same key is received within 24 hours, the original response is returned without reprocessing.

```http
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
```

### Pagination

List endpoints use cursor-based pagination.

```http
GET /resumes?limit=20&cursor=eyJpZCI6IjAxSFhZWiJ9
```

```json
{
  "data": [],
  "pagination": {
    "has_more": true,
    "next_cursor": "eyJpZCI6IjAxSFhZWiJ0",
    "total_count": 143
  }
}
```

---

## 4. Authentication API

### `POST /auth/register`

Creates a new user account. Returns a JWT token immediately upon success.

**Request Body:**

```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response `201`:**

```json
{
  "user_id": "uuid",
  "token": "jwt_token",
  "plan": "free",
  "created_at": "2025-07-15T09:00:00Z"
}
```

---

### `POST /auth/login`

Authenticates an existing user and returns a JWT token.

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response `200`:**

```json
{
  "token": "jwt_token",
  "expires_in": 86400,
  "user": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "plan": "free | pro | enterprise"
  }
}
```

---

### `POST /auth/refresh`

Exchanges a valid but expiring JWT for a fresh token.

**Request Body:**

```json
{
  "refresh_token": "string"
}
```

**Response `200`:**

```json
{
  "token": "new_jwt_token",
  "expires_in": 86400
}
```

---

### `POST /auth/logout`

Invalidates the current token server-side.

**Headers:** `Authorization: Bearer <token>`  
**Response `204`:** No content.

---

### OAuth 2.0 (Enterprise / B2B)

Enterprise integrations can use the OAuth 2.0 Client Credentials flow to obtain short-lived access tokens with scoped permissions.

**Token endpoint:** `POST https://auth.resumeiq.ai/oauth/token`

```json
{
  "grant_type": "client_credentials",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "scope": "resumes:read resumes:write ats:read skills:read"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "resumes:read resumes:write ats:read skills:read"
}
```

**Available OAuth Scopes:**

| Scope | Description |
|---|---|
| `resumes:read` | Read parsed resume data |
| `resumes:write` | Upload and create resumes |
| `ats:read` | Retrieve ATS scores |
| `ats:write` | Trigger new ATS scoring |
| `skills:read` | Access skill extraction results |
| `jobs:read` | Access job match suggestions |
| `tips:read` | Access improvement tips |
| `webhooks:manage` | Register and manage webhooks |
| `admin:*` | Full access — enterprise only |

---

## 5. Resume Upload API

### `POST /resume/upload`

Uploads a PDF or DOCX resume and triggers the full analysis pipeline. Supports both synchronous (wait for result) and asynchronous (receive a `job_id`) modes.

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request (multipart/form-data):**

| Field | Type | Required | Description |
|---|---|---|---|
| `resume_file` | File | Yes | PDF or DOCX. Max size: 2 MB (Free), 5 MB (Pro), 10 MB (Business) |
| `async` | boolean | No | If `true`, return `job_id` immediately. Default: `false` |
| `ocr_mode` | boolean | No | Enable OCR for scanned/image-only PDFs. Default: `false` |
| `target_role` | string | No | Optional target job title to bias skill extraction and ATS scoring |
| `idempotency_key` | string | No | UUID v4 to prevent duplicate uploads |

**Response `202` (async mode):**

```json
{
  "resume_id": "uuid",
  "job_id": "job_01HXYZ...",
  "status": "processing",
  "estimated_time_seconds": 12
}
```

**Response `200` (sync mode) — abridged:**

```json
{
  "resume_id": "uuid",
  "status": "complete",
  "parse_quality": 0.94,
  "contact": {
    "name": "John Doe",
    "email": "john@email.com"
  }
}
```

> The full parsed resume object is returned in the `/resume/{resume_id}/parsed` endpoint.

---

### `DELETE /resume/{resume_id}`

Permanently deletes a resume and all associated analysis data (ATS scores, skill extractions, job match data, tips). This action is irreversible.

**Response `204`:** No content.

> ⚠️ Deletion is permanent and cannot be undone. All linked analysis data is also removed.

---

### `GET /resumes`

Lists all resumes uploaded under the current account, paginated.

**Query Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `limit` | integer | 20 | Results per page (1–100) |
| `cursor` | string | — | Pagination cursor from previous response |
| `order` | string | `desc` | Sort by `created_at`: `asc` or `desc` |

---

## 6. Resume Parsing API

### `GET /resume/{resume_id}/parsed`

Returns the fully structured resume data extracted by the document parser and NLP pipeline. This is the foundational data object that all other analysis endpoints operate on.

**Response `200`:**

```json
{
  "resume_id": "uuid",
  "parse_quality": 0.94,
  "word_count": 487,
  "pages": 2,
  "format": {
    "columns": 1,
    "has_tables": false,
    "has_graphics": false,
    "font_standard": true
  },
  "contact": {
    "name": "John Doe",
    "email": "john@email.com",
    "phone": "+91-9876543210",
    "linkedin": "linkedin.com/in/johndoe",
    "github": "github.com/johndoe",
    "location": "Bengaluru, India"
  },
  "summary": "Full-stack developer with 4 years of experience in cloud-native systems...",
  "education": [
    {
      "degree": "B.Tech Computer Science",
      "institution": "IIT Bombay",
      "year": 2021,
      "gpa": "8.7/10"
    }
  ],
  "experience": [
    {
      "company": "TechCorp",
      "role": "Software Engineer",
      "start_date": "2022-01",
      "end_date": "2024-03",
      "is_current": false,
      "duration_months": 26,
      "responsibilities": [
        "Built REST APIs serving 200K requests/day",
        "Led team of 3 engineers to deliver cloud migration project"
      ]
    }
  ],
  "skills": ["Python", "React", "SQL", "Docker", "AWS"],
  "projects": [
    {
      "title": "E-Commerce Recommendation Engine",
      "description": "Collaborative filtering model for product recommendations",
      "technologies": ["Python", "TensorFlow", "PostgreSQL"]
    }
  ],
  "certifications": ["AWS Certified Developer"],
  "languages": ["English (Fluent)", "Hindi (Native)"],
  "created_at": "2025-07-15T09:30:00Z"
}
```

**Parse Quality Score:**  
A float from `0.0` to `1.0` indicating how cleanly the document was parsed. Scores below `0.70` suggest the file may be image-based or use a complex two-column layout that degrades extraction accuracy.

**Real-world parsing challenges handled:**
- Two-column layouts
- Tables used as formatting structures
- Embedded icons or graphics
- Non-standard section headings (e.g. "My Background" instead of "Work Experience")
- Inconsistent bullet character encoding

---

## 7. ATS Scoring API

### `POST /resume/{resume_id}/ats-score`

Computes a full ATS compatibility score for the resume. Simulates how real Applicant Tracking Systems evaluate a resume before a human sees it. Optionally accepts a `target_role` to bias keyword scoring toward a specific job family.

**Request Body:**

```json
{
  "target_role": "Software Engineer",
  "industry": "Technology",
  "experience_level": "mid"
}
```

| Field | Type | Required | Values |
|---|---|---|---|
| `target_role` | string | No | Any job title string |
| `industry` | string | No | e.g. "Technology", "Finance", "Healthcare" |
| `experience_level` | string | No | `fresher` / `mid` / `senior` / `executive` |

**Response `200`:**

```json
{
  "score_id": "ats_01HXYZ...",
  "resume_id": "uuid",
  "overall_score": 82,
  "grade": "B+",
  "percentile": 71,
  "breakdown": {
    "keyword_score": {
      "score": 78,
      "weight": 0.35,
      "label": "Good",
      "matched_keywords": ["Python", "REST API", "Agile", "CI/CD", "Docker"],
      "missing_keywords": ["Kubernetes", "System Design", "GraphQL"],
      "keyword_density": 0.042,
      "action_verb_usage": 0.78
    },
    "format_score": {
      "score": 90,
      "weight": 0.25,
      "label": "Excellent",
      "column_layout": "single",
      "tables_detected": false,
      "graphics_detected": false,
      "standard_fonts": true,
      "section_headings_recognised": true
    },
    "contact_score": {
      "score": 95,
      "weight": 0.10,
      "label": "Excellent"
    },
    "length_score": {
      "score": 80,
      "weight": 0.15,
      "label": "Good"
    },
    "consistency_score": {
      "score": 85,
      "weight": 0.15,
      "label": "Good",
      "issues": [
        "Date formats are inconsistent (Jul 2021 vs 07/2022)"
      ]
    }
  },
  "scored_at": "2025-07-15T09:30:12Z"
}
```

### Score Breakdown Reference

| Sub-Score | Weight | What It Measures |
|---|---|---|
| Keyword Score | 35% | Industry-relevant keywords, natural density, action verb usage at bullet starts |
| Format Score | 25% | Single-column layout, absence of tables/graphics, standard fonts, ATS-readable headings |
| Contact Score | 10% | Completeness of contact block — name, professional email, phone, LinkedIn |
| Length Score | 15% | Page count vs experience level (1 page for 0–3 yrs, 2 pages for 4–10 yrs) |
| Consistency Score | 15% | Uniform date formats, parallel bullet structure, consistent tense |

---

### `GET /resume/{resume_id}/ats-score/history`

Returns all historical ATS scores for a resume to track improvement over time.

**Response `200`:**

```json
{
  "resume_id": "uuid",
  "history": [
    {
      "score_id": "ats_01HXYZ...",
      "overall_score": 74,
      "grade": "B",
      "scored_at": "2025-07-10T10:00:00Z"
    },
    {
      "score_id": "ats_02HXYZ...",
      "overall_score": 82,
      "grade": "B+",
      "scored_at": "2025-07-15T09:30:12Z"
    }
  ]
}
```

---

## 8. Skill Extraction API

### `GET /resume/{resume_id}/skills`

Extracts every skill from the resume — both **explicit** (directly listed) and **implicit** (inferred from experience descriptions). Uses NLP to understand that "Built and deployed a microservices architecture" implies Docker, DevOps, and system design even if those words do not appear in the skills section.

**Query Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `include_implicit` | boolean | `true` | Infer skills from experience descriptions |
| `include_proficiency` | boolean | `true` | Estimate Beginner / Intermediate / Expert level |

**Response `200`:**

```json
{
  "extraction_id": "ext_01HXYZ...",
  "resume_id": "uuid",
  "technical_skills": [
    {
      "skill": "Python",
      "category": "programming_language",
      "source": "explicit",
      "proficiency": "Expert",
      "confidence": 0.92,
      "mention_count": 6
    },
    {
      "skill": "System Design",
      "category": "architecture",
      "source": "implicit",
      "proficiency": "Intermediate",
      "confidence": 0.82,
      "mention_count": 2
    }
  ],
  "soft_skills": [
    {
      "skill": "Leadership",
      "source": "implicit",
      "confidence": 0.76
    }
  ],
  "tools": [
    {
      "skill": "Docker",
      "source": "explicit",
      "confidence": 0.84
    }
  ],
  "domain_knowledge": [],
  "languages": ["English", "Hindi"],
  "summary": {
    "total_skills": 28,
    "explicit_count": 18,
    "implicit_count": 10,
    "technical_count": 20,
    "soft_skill_count": 5,
    "tool_count": 8
  }
}
```

### Skill Categories

| Category | Sub-Categories |
|---|---|
| `technical` | `programming_language`, `framework`, `database`, `cloud`, `devops`, `data_science`, `security`, `architecture` |
| `soft_skill` | `communication`, `leadership`, `teamwork`, `problem_solving`, `adaptability` |
| `tool` | `ide`, `project_management`, `design`, `analytics`, `communication_tool` |
| `domain_knowledge` | `finance`, `healthcare`, `ecommerce`, `logistics`, `edtech` |
| `language` | `spoken_language`, `programming_language` |

---

### `POST /resume/{resume_id}/skills/gap-analysis`

Compares extracted skills against a target role's required skill set and returns a prioritised gap report.

**Request Body:**

```json
{
  "target_role": "Senior Data Scientist",
  "industry": "Technology"
}
```

**Response `200`:**

```json
{
  "match_percentage": 71,
  "present_skills": ["Python", "Machine Learning", "SQL", "Statistics"],
  "missing_critical": ["MLOps", "Spark", "A/B Testing"],
  "missing_optional": ["Scala", "Kubernetes"],
  "overqualified_in": [],
  "learning_recommendations": [
    {
      "skill": "MLOps",
      "priority": "high",
      "resources": ["Coursera MLOps Specialization", "fast.ai"]
    }
  ]
}
```

---

## 9. Job Match API

### `GET /resume/{resume_id}/job-matches`

Returns the top job roles most compatible with the resume, ranked by match score. Uses **vector embeddings** and cosine similarity to capture semantic meaning — so "managed a dev team" and "led software engineers" both contribute to a leadership signal, even when the exact words differ.

**Query Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `top_n` | integer | 5 | Number of role suggestions to return (1–10) |
| `experience_filter` | string | `any` | `fresher` / `mid` / `senior` / `any` |
| `industry_filter` | string | — | Comma-separated list e.g. `Technology,Fintech` |

**Response `200`:**

```json
{
  "matches": [
    {
      "rank": 1,
      "role": "Full Stack Engineer",
      "match_score": 86,
      "salary_range_inr": {
        "min": 1200000,
        "max": 2000000
      },
      "skill_coverage": {
        "required_skills": 14,
        "candidate_has": 12,
        "coverage_pct": 86
      },
      "missing_skills": ["System Design", "Kubernetes"],
      "competitive_standing": "Strong Candidate"
    },
    {
      "rank": 2,
      "role": "Backend Developer",
      "match_score": 81,
      "missing_skills": ["Microservices", "gRPC"]
    }
  ]
}
```

### Match Score Calculation

The score is a weighted composite of three signals:

| Signal | Weight | Method |
|---|---|---|
| Skill Overlap | 40% | Set intersection of extracted skills vs role requirements |
| Semantic Similarity | 40% | Cosine similarity of resume embedding vs role embedding |
| Experience Fit | 20% | Years of experience vs role seniority band |

---

### `POST /embeddings/generate`

Generates a raw 1536-dimensional embedding vector for any arbitrary text. Use this endpoint to power custom job matching or similarity search within your own vector database.

**Request Body:**

```json
{
  "text": "Led migration of legacy system to AWS microservices architecture...",
  "model": "resumeiq-embed-v2"
}
```

**Response `200`:**

```json
{
  "embedding": [0.0231, -0.0847, 0.1203, "..."],
  "dimensions": 1536,
  "model": "resumeiq-embed-v2",
  "token_count": 42
}
```

---

## 10. Job Description Matcher API

### `POST /resume/{resume_id}/match-jd`

The most powerful feature for active job seekers. The candidate pastes a specific job description; the API calculates an exact match score, identifies keyword gaps, and rewrites bullet points to better align with the JD's language — replicating what a real ATS does when comparing a resume against a job posting.

**Request Body:**

```json
{
  "job_description": "We are looking for a Senior Backend Engineer with 5+ years...",
  "job_title": "Senior Backend Engineer",
  "company": "Zepto"
}
```

**Response `200`:**

```json
{
  "match_id": "jdm_01HXYZ...",
  "overall_match_score": 72,
  "semantic_match": 0.74,
  "keyword_match": {
    "jd_keywords_total": 42,
    "resume_matches": 30,
    "match_rate": 0.714
  },
  "experience_match": {
    "required_years": 5,
    "candidate_years": 4,
    "match": "Near Match"
  },
  "missing_keywords": ["CI/CD", "Agile", "System Design", "Kafka"],
  "present_keywords": ["Python", "FastAPI", "Redis", "AWS Lambda"],
  "suggested_rewrites": [
    "Architected and shipped 12 high-throughput REST APIs on FastAPI, serving 200K RPM for a high-scale platform",
    "Designed scalable backend APIs serving 50K users with 99.9% uptime"
  ],
  "projected_match_after_optimisation": 83,
  "quick_wins": [
    {
      "keyword": "CI/CD",
      "insertion_suggestion": "Add to Skills and mention in your DevOps bullet point"
    }
  ]
}
```

---

### `GET /resume/{resume_id}/match-jd/{match_id}/keyword-gaps`

Returns the detailed keyword gap report for a previously computed JD match.

**Response `200`:**

```json
{
  "missing_must_have": ["Kafka", "gRPC", "System Design"],
  "missing_nice_to_have": ["Rust", "Temporal", "Prometheus"],
  "present_keywords": ["Python", "FastAPI", "Redis", "AWS Lambda"],
  "overused_in_resume": ["developed", "worked on"],
  "jd_preferred_verbs": ["architect", "scale", "own", "deliver"]
}
```

---

### `POST /resume/{resume_id}/match-jd/{match_id}/rewrite-bullets`

AI rewrites selected resume bullet points to better mirror JD language and include missing keywords, without inventing facts.

**Request Body:**

```json
{
  "bullet_indices": [0, 2, 4],
  "preserve_facts": true
}
```

**Response `200`:**

```json
{
  "rewrites": [
    {
      "original": "Built REST APIs for the e-commerce platform",
      "rewritten": "Architected and shipped 12 high-throughput REST APIs on FastAPI, serving 200K RPM",
      "keywords_added": ["architected", "high-throughput", "FastAPI"],
      "match_improvement": 0.09
    }
  ]
}
```

---

## 11. Resume Highlight API

### `GET /resume/{resume_id}/highlights`

Returns colour-coded highlight annotations that map AI feedback directly onto the original resume text. The front-end renders these as overlays, creating the "wow" feature: the resume appears on screen with green, yellow, and red sections the user can hover to read the exact issue and fix.

**Response `200`:**

```json
{
  "highlights": [
    {
      "text": "Responsible for managing project",
      "char_start": 1420,
      "char_end": 1452,
      "severity": "red",
      "color": "#EF4444",
      "suggestion": "Passive voice with no metric. Suggested rewrite: 'Delivered project on time, reducing deployment time by 30%'"
    },
    {
      "text": "Led migration of legacy system to AWS",
      "char_start": 1800,
      "char_end": 1836,
      "severity": "green",
      "color": "#10B981",
      "suggestion": null
    },
    {
      "text": "Good communication skills",
      "char_start": 2100,
      "char_end": 2124,
      "severity": "yellow",
      "color": "#F59E0B",
      "suggestion": "Vague soft skill claim. Demonstrate with a specific example or remove."
    }
  ]
}
```

### Severity Reference

| Severity | Colour | Hex | Meaning |
|---|---|---|---|
| `green` | Green | `#10B981` | Strong — well-written, keyword-rich, quantified |
| `yellow` | Amber | `#F59E0B` | Average — present but could be stronger; missing metrics |
| `red` | Red | `#EF4444` | Weak — vague language, missing keywords, formatting issue |

---

## 12. AI Feedback & Improvement Tips API

### `GET /resume/{resume_id}/improvements`

Returns a full set of AI-generated improvement suggestions, categorised by type. Tips are **specific and actionable** — not generic advice. The AI model analyses the parsed resume in context of the target role and produces personalised rewrites, missing keyword callouts, and structural improvements.

**Query Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `target_role` | string | — | Bias tips toward a specific role |
| `max_tips` | integer | 15 | Maximum number of tips to return |
| `categories` | string | all | Comma-separated filter: `bullet_points,keywords,quantification,structure` |

**Response `200`:**

```json
{
  "tips_id": "tip_01HXYZ...",
  "tips": [
    {
      "tip_id": "t001",
      "type": "bullet_points",
      "severity": "high",
      "section": "Work Experience — TechCorp",
      "original": "Responsible for managing social media",
      "suggested": "Grew Instagram following by 40% in 6 months through targeted content strategy",
      "message": "Passive voice and no metrics. Start with an action verb and add a quantified outcome.",
      "impact_score": 0.82
    },
    {
      "tip_id": "t002",
      "type": "keyword_gap",
      "severity": "medium",
      "section": "Skills",
      "original": null,
      "suggested": "Add: System Design, Agile, CI/CD, OKRs",
      "message": "These are the top 4 keywords in your target role JDs that are missing from your resume.",
      "impact_score": 0.71
    },
    {
      "tip_id": "t003",
      "type": "quantification",
      "severity": "high",
      "section": "Work Experience — TechCorp",
      "original": "Built REST APIs for the platform",
      "suggested": "Built REST APIs serving 200K requests/day with 99.9% uptime",
      "message": "Achievement stated without metrics. Add numbers: how many? how much? what percentage?",
      "impact_score": 0.79
    }
  ],
  "summary": {
    "total_tips": 12,
    "high_severity": 4,
    "medium_severity": 6,
    "low_severity": 2,
    "projected_score_improvement": 18
  }
}
```

### Tip Categories Reference

| Category | What It Addresses |
|---|---|
| `bullet_points` | Weak verbs, passive voice, lack of specificity in experience descriptions |
| `keyword_gap` | Missing industry-critical keywords for the target role |
| `quantification` | Claims without supporting numbers or metrics |
| `structure` | Missing sections (Projects, Certifications), wrong section order |
| `action_verbs` | Overused or weak openers (e.g. 12 bullets starting with "Responsible for") |
| `length` | Resume too long or too short for the candidate's experience level |
| `consistency` | Date format, tense, and formatting inconsistencies |

### What Makes a Strong vs Weak Resume (AI Signal Reference)

**Strong signals:**
- Bullet points start with action verbs (Led, Built, Designed, Delivered)
- Every achievement has a number attached
- Keywords match the target industry naturally
- Clean single-column format
- Consistent date formatting
- Right length for experience level

**Weak signals:**
- "Responsible for" and "Worked on" throughout
- No metrics or quantification
- Skills listed but never demonstrated in experience descriptions
- Inconsistent formatting
- Generic objective statement at the top
- Missing LinkedIn or GitHub for tech roles

---

### `POST /tips/rewrite`

Sends a specific bullet point and returns 3 AI-generated rewrites, optimised for ATS impact and clarity.

**Request Body:**

```json
{
  "original_bullet": "Worked on improving the deployment pipeline",
  "context": {
    "role": "DevOps Engineer",
    "company_type": "Startup",
    "industry": "Technology"
  },
  "num_rewrites": 3
}
```

**Response `200`:**

```json
{
  "rewrites": [
    "Reduced deployment time by 65% by containerising CI/CD pipeline using Docker and GitHub Actions.",
    "Engineered zero-downtime blue-green deployment strategy, cutting production incidents by 40%.",
    "Automated 12-step manual deployment process, freeing 8 engineering hours per week."
  ]
}
```

---

## 13. Async Job Management API

Many AI operations (parsing, scoring, embedding) take 5–30 seconds depending on document complexity. When `async: true` is passed in any analysis request, a `job_id` is returned immediately.

### `GET /jobs/{job_id}`

Polls the status of an async processing job.

**Response `200`:**

```json
{
  "job_id": "job_01HXYZ...",
  "resume_id": "uuid",
  "operation": "full_analysis",
  "status": "processing",
  "progress": 65,
  "result_url": null,
  "created_at": "2025-07-15T09:30:00Z",
  "estimated_completion": "2025-07-15T09:30:18Z"
}
```

**Status Values:**

| Status | Meaning |
|---|---|
| `pending` | Job is queued, not yet started |
| `processing` | Actively being processed |
| `completed` | Done — `result_url` is populated |
| `failed` | Processing failed — check `error` field |

**Response when completed:**

```json
{
  "job_id": "job_01HXYZ...",
  "status": "completed",
  "progress": 100,
  "result_url": "https://api.resumeiq.ai/v1/resume/uuid/parsed",
  "completed_at": "2025-07-15T09:30:17Z"
}
```

---

## 14. Webhooks

Webhooks allow your server to receive real-time push notifications from ResumeIQ instead of polling. When any async job completes, ResumeIQ sends an HTTP POST to your registered endpoint.

### `POST /webhooks`

Registers a webhook endpoint to receive events.

**Request Body:**

```json
{
  "url": "https://yourapp.com/webhooks/resumeiq",
  "events": ["resume.parsed", "ats.scored", "skills.extracted", "job.matched"],
  "secret": "whsec_your_signing_secret",
  "description": "Production webhook"
}
```

**Response `201`:**

```json
{
  "webhook_id": "wh_01HXYZ...",
  "url": "https://yourapp.com/webhooks/resumeiq",
  "events": ["resume.parsed", "ats.scored", "skills.extracted", "job.matched"],
  "status": "active",
  "created_at": "2025-07-15T09:00:00Z"
}
```

---

### Event Types

| Event | Trigger |
|---|---|
| `resume.uploaded` | A new resume file has been received |
| `resume.parsed` | Parsing and text extraction is complete |
| `ats.scored` | ATS scoring calculation is complete |
| `skills.extracted` | Skill extraction pipeline has finished |
| `job.matched` | Job role suggestion computation is complete |
| `tips.generated` | Improvement tips have been generated |
| `jd_match.completed` | JD matching analysis is complete |
| `resume.deleted` | A resume was deleted |
| `quota.warning` | API usage is at 80% of daily quota |
| `quota.exceeded` | Daily quota has been exceeded |

---

### Webhook Payload Schema

```json
{
  "webhook_id": "wh_01HXYZ...",
  "event": "ats.scored",
  "created_at": "2025-07-15T09:31:00Z",
  "data": {
    "resume_id": "uuid",
    "score_id": "ats_01HXYZ...",
    "overall_score": 82,
    "grade": "B+"
  }
}
```

---

### Signature Verification

Every delivery includes an `X-ResumeIQ-Signature` header — an HMAC-SHA256 signature of the raw payload using your webhook secret. Always verify this before processing.

```python
import hmac
import hashlib

def verify_signature(
    payload_body: bytes,
    signature_header: str,
    secret: str
) -> bool:
    mac = hmac.new(secret.encode(), payload_body, hashlib.sha256)
    expected = "sha256=" + mac.hexdigest()
    return hmac.compare_digest(expected, signature_header)

# In your Flask / FastAPI route:
# sig = request.headers.get("X-ResumeIQ-Signature")
# if not verify_signature(request.get_data(), sig, WEBHOOK_SECRET):
#     return 401
```

> Respond to webhook deliveries with HTTP 200 within 10 seconds. ResumeIQ retries failed deliveries at: 1 min → 5 min → 30 min → 2 hr → 24 hr.

---

### `DELETE /webhooks/{webhook_id}`

Deregisters a webhook endpoint.

**Response `204`:** No content.

---

## 15. Analytics & Usage API

### `GET /analytics/usage`

Returns the current account's API usage statistics for the current billing period.

**Response `200`:**

```json
{
  "plan": "pro",
  "billing_period": {
    "start": "2025-07-01",
    "end": "2025-07-31"
  },
  "usage": {
    "analyses_used": 47,
    "analyses_limit": 1000,
    "api_calls_today": 312,
    "api_calls_limit_per_min": 60
  },
  "quota_warning": false
}
```

---

### `GET /analytics/resume/{resume_id}/history`

Returns the full improvement timeline for a resume — all scores, tips sessions, and JD matches over time.

**Response `200`:**

```json
{
  "resume_id": "uuid",
  "timeline": [
    {
      "event_type": "ats_scored",
      "overall_score": 62,
      "timestamp": "2025-07-01T10:00:00Z"
    },
    {
      "event_type": "tips_applied",
      "timestamp": "2025-07-05T14:30:00Z"
    },
    {
      "event_type": "ats_scored",
      "overall_score": 82,
      "timestamp": "2025-07-10T09:00:00Z"
    }
  ]
}
```

---

## 16. Rate Limits & Plans

### Plan Limits

| Plan | Analyses / Month | Requests / Min | Max File Size | Concurrent Jobs |
|---|---|---|---|---|
| Free | 2 | 10 | 2 MB | 1 |
| Pro (₹299/month) | Unlimited | 60 | 5 MB | 5 |
| Business | Unlimited | 300 | 10 MB | 20 |
| Enterprise | Unlimited | Custom | 25 MB | 100 |

### Rate Limit Headers

Every response includes:

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 47
X-RateLimit-Reset: 1720000800
```

When a rate limit is exceeded, the API returns `HTTP 429` with a `Retry-After` header.

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "You have exceeded 60 requests/minute.",
    "retry_after_seconds": 23
  }
}
```

### B2B Pricing

| Channel | Pricing |
|---|---|
| Pay-per-analysis | ₹49 per detailed analysis |
| College placement cells | ₹10,000/month per institution |
| Enterprise API contract | Custom |

---

## 17. Error Handling

### HTTP Status Codes

| Code | Meaning | When |
|---|---|---|
| `200` | OK | Request successful |
| `201` | Created | Resource created (register, webhook) |
| `202` | Accepted | Async job accepted — poll `job_id` |
| `204` | No Content | Delete successful |
| `400` | Bad Request | Invalid parameters, missing required fields |
| `401` | Unauthorized | Missing or invalid JWT token |
| `403` | Forbidden | Valid auth but plan limit reached or insufficient scope |
| `404` | Not Found | `resume_id`, `job_id`, or resource does not exist |
| `409` | Conflict | Duplicate idempotency key with different payload |
| `413` | Payload Too Large | File exceeds plan's maximum file size |
| `415` | Unsupported Media Type | Only PDF and DOCX accepted |
| `422` | Unprocessable Entity | File uploaded but parsing failed (image-only PDF, corrupted) |
| `429` | Too Many Requests | Rate limit exceeded — check `Retry-After` header |
| `500` | Internal Server Error | Unexpected server error — retry with exponential backoff |
| `503` | Service Unavailable | Temporary maintenance or AI model overload — retry after 60 s |

---

### Standard Error Response

```json
{
  "error": {
    "code": "INVALID_FILE",
    "message": "Uploaded file must be a PDF or DOCX.",
    "detail": "Received file type: image/jpeg",
    "docs_url": "https://docs.resumeiq.ai/errors/INVALID_FILE"
  },
  "meta": {
    "request_id": "req_01HXYZ..."
  }
}
```

### Error Code Reference

| Error Code | HTTP | Description |
|---|---|---|
| `INVALID_API_KEY` | 401 | API key is invalid or has been revoked |
| `TOKEN_EXPIRED` | 401 | JWT has expired — refresh and retry |
| `INSUFFICIENT_SCOPE` | 403 | Token lacks required OAuth scope |
| `PLAN_LIMIT_REACHED` | 403 | Monthly analysis quota exhausted |
| `RESUME_NOT_FOUND` | 404 | No resume found for this ID |
| `RESUME_PARSE_FAILED` | 422 | Parser could not extract text — try `ocr_mode: true` |
| `RESUME_IMAGE_ONLY` | 422 | PDF contains only scanned images — enable `ocr_mode` |
| `FILE_TYPE_UNSUPPORTED` | 415 | Only PDF and DOCX files are accepted |
| `FILE_TOO_LARGE` | 413 | File exceeds plan limit — compress or upgrade |
| `INVALID_FILE` | 400 | File is corrupted or unreadable |
| `JOB_STILL_PROCESSING` | 202 | Async job not yet complete — poll again |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests — check `X-RateLimit-Reset` |
| `IDEMPOTENCY_CONFLICT` | 409 | Same key used with a different request payload |
| `INVALID_JD_TEXT` | 400 | Job description too short (minimum 100 characters) |
| `MODEL_OVERLOADED` | 503 | AI model temporarily at capacity — retry in 60 s |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected error — report with `request_id` |

---

## 18. Data Models & Schemas

### Resume Object

| Field | Type | Description |
|---|---|---|
| `resume_id` | string | Unique identifier. Prefix: `res_` |
| `file_name` | string | Original uploaded filename |
| `file_size_bytes` | integer | Size of the uploaded file |
| `pages` | integer | Number of pages in the document |
| `parse_quality` | float | 0.0–1.0 parser confidence |
| `contact` | object | `name`, `email`, `phone`, `linkedin`, `github`, `location` |
| `summary` | string | Parsed professional summary / objective |
| `work_experience` | array | Array of WorkExperience objects |
| `education` | array | Array of Education objects |
| `skills` | array | Raw list of skill strings before categorisation |
| `projects` | array | Array of Project objects |
| `certifications` | array | List of certification strings |
| `languages` | array | Spoken and programming languages |
| `word_count` | integer | Total word count of resume body |
| `format` | object | `columns`, `has_tables`, `has_graphics`, `font_standard` |
| `created_at` | string | ISO 8601 UTC upload timestamp |

---

### ATS Score Object

| Field | Type | Description |
|---|---|---|
| `score_id` | string | Unique identifier. Prefix: `ats_` |
| `resume_id` | string | Associated resume |
| `overall_score` | integer | 0–100 composite ATS score |
| `grade` | string | Letter grade: `A+` `A` `B+` `B` `C` `D` `F` |
| `percentile` | integer | Position among all scored resumes (0–100) |
| `breakdown` | object | `keyword_score`, `format_score`, `contact_score`, `length_score`, `consistency_score` — each with `score`, `weight`, `label` |
| `scored_at` | string | ISO 8601 UTC timestamp |

---

### Skill Object

| Field | Type | Description |
|---|---|---|
| `name` | string | Normalised skill name |
| `category` | string | `technical` / `soft_skill` / `tool` / `domain_knowledge` / `language` |
| `sub_category` | string | Granular classification within category |
| `source` | string | `explicit` (listed) or `implicit` (inferred) |
| `proficiency` | string | `Beginner` / `Intermediate` / `Expert` |
| `confidence` | float | 0.0–1.0 model confidence |
| `mention_count` | integer | Number of times skill appears or is implied |
| `context_snippets` | array | Sentences from resume where skill was identified |

---

### Tip Object

| Field | Type | Description |
|---|---|---|
| `tip_id` | string | Unique identifier. Prefix: `t` |
| `type` | string | `bullet_points` / `keyword_gap` / `quantification` / `structure` / `action_verbs` / `length` / `consistency` |
| `severity` | string | `high` / `medium` / `low` |
| `section` | string | Resume section the tip applies to |
| `original` | string | The original text being critiqued (null if structural) |
| `suggested` | string | AI-generated replacement or action |
| `message` | string | Explanation of why this is a problem |
| `impact_score` | float | 0.0–1.0 estimated impact on ATS score if applied |

---

### Job Match Object

| Field | Type | Description |
|---|---|---|
| `rank` | integer | Position in match ranking |
| `role` | string | Suggested job title |
| `match_score` | integer | 0–100 compatibility score |
| `salary_range_inr` | object | `min` and `max` annual salary in INR |
| `skill_coverage` | object | `required_skills`, `candidate_has`, `coverage_pct` |
| `missing_skills` | array | Skills required for the role that the candidate lacks |
| `competitive_standing` | string | `Strong Candidate` / `Competitive` / `Needs Preparation` |

---

## 19. Security & Compliance

| Area | Detail |
|---|---|
| **Transport Security** | All API traffic uses TLS 1.2+. HTTP connections are rejected. |
| **Data Encryption at Rest** | Resumes encrypted using AES-256 in AWS S3. Database fields encrypted with per-tenant keys. |
| **Data Residency** | Stored in AWS `ap-south-1` (Mumbai) for India customers. EU and US regions available for enterprise. |
| **File Retention** | Uploaded files auto-deleted after 30 days by default. Configurable (30–365 days) per account. |
| **PII Handling** | Contact information extracted but never used for ad targeting or sold to third parties. Masked during AI model training. |
| **GDPR / DPDP Compliance** | Right to erasure: `DELETE /resume/{id}` permanently removes all associated data. Data processing agreements available. |
| **OAuth Support** | OAuth 2.0 Client Credentials for enterprise B2B integrations. |
| **API Key Security** | Keys hashed before storage — not reversible. Full key shown only once at creation. Rotate every 90 days recommended. |
| **SOC 2 Type II** | Infrastructure is SOC 2 Type II audited. Report available under NDA for enterprise. |
| **Audit Logs** | All API activity logged. Available via `/audit-logs` for enterprise accounts. |
| **Vulnerability Disclosure** | Report security issues to: `security@resumeiq.ai` |

---

## 20. Suggested Tech Stack

### Backend

```
Python (FastAPI)  — recommended for AI-heavy services
Node.js (NestJS)  — alternative for API gateway layer
```

### AI / ML Services

```
spaCy                   — NLP pipeline, section labelling, entity extraction
Hugging Face Transformers — custom fine-tuned models for resume classification
OpenAI API              — GPT-4o for feedback generation; text-embedding-ada-002 for embeddings
Anthropic Claude API    — alternative LLM for tip generation (Claude Sonnet 4)
Sentence Transformers   — open-source embedding alternative
```

### Document Processing

```
PDFMiner      — text extraction with layout awareness
PyMuPDF       — fast PDF rendering and text extraction
python-docx   — DOCX file parsing
pytesseract   — OCR for scanned/image-only PDFs
pdf2image     — converts PDF pages to images for OCR pipeline
```

### Storage & Data

```
PostgreSQL    — primary relational database (resumes, users, scores)
AWS S3        — encrypted file storage
Pinecone      — managed vector database for embedding search
Weaviate      — open-source vector database alternative
Redis         — caching, rate limiting, session storage
```

### Queue & Processing

```
Celery + Redis  — async task queue for AI processing pipeline
```

### Infrastructure

```
AWS (ap-south-1)  — primary cloud region
Docker            — containerisation of all services
Kubernetes        — orchestration for production scale
NGINX             — reverse proxy and SSL termination
```

---

## 21. SDK Examples

### Python SDK

**Installation:**

```bash
pip install resumeiq
```

**Complete flow — Upload, Score, Get Tips, Match JD:**

```python
from resumeiq import ResumeIQ

client = ResumeIQ(api_key="riq_live_xxxx")

# Step 1: Upload and parse resume
with open("my_resume.pdf", "rb") as f:
    resume = client.resumes.parse(file=f, target_role="Data Scientist")

print(f"Resume ID: {resume.resume_id}")
print(f"Name: {resume.contact.name}")
print(f"Skills Found: {len(resume.skills)}")

# Step 2: Generate ATS score
score = client.ats.score(
    resume_id=resume.resume_id,
    target_role="Data Scientist",
    experience_level="mid"
)
print(f"ATS Score: {score.overall_score}/100  Grade: {score.grade}")

# Step 3: Improvement tips
tips = client.tips.generate(
    resume_id=resume.resume_id,
    max_tips=10
)
for tip in tips.tips:
    print(f"[{tip.severity.upper()}] {tip.type}: {tip.message}")
    if tip.suggested:
        print(f"  → {tip.suggested}")

# Step 4: Job match suggestions
matches = client.jobs.suggest(resume_id=resume.resume_id, top_n=5)
for m in matches.matches:
    print(f"#{m.rank} {m.role}: {m.match_score}% match")

# Step 5: Match against a specific job description
with open("job_description.txt") as jd:
    match = client.jd_matcher.score(
        resume_id=resume.resume_id,
        job_description=jd.read(),
        job_title="Senior Data Scientist"
    )
print(f"JD Match: {match.overall_match_score}%")
print(f"After optimisation: {match.projected_match_after_optimisation}%")
print(f"Missing keywords: {match.missing_keywords}")
```

---

### JavaScript / Node.js SDK

**Installation:**

```bash
npm install resumeiq-node
```

**Complete example:**

```javascript
import { ResumeIQ } from 'resumeiq-node';
import fs from 'fs';

const client = new ResumeIQ({ apiKey: process.env.RESUMEIQ_API_KEY });

async function analyseResume(filePath, jdPath) {
  // Parse resume
  const resume = await client.resumes.parse({
    file: fs.createReadStream(filePath),
    targetRole: 'Frontend Engineer'
  });

  // ATS Score
  const score = await client.ats.score({
    resumeId: resume.resumeId,
    targetRole: 'Frontend Engineer'
  });

  // JD Matcher
  const jdText = fs.readFileSync(jdPath, 'utf8');
  const match = await client.jdMatcher.score({
    resumeId: resume.resumeId,
    jobDescription: jdText
  });

  // Highlights for UI overlay
  const highlights = await client.highlights.get(resume.resumeId);

  console.log(`ATS Score: ${score.overallScore}/100`);
  console.log(`JD Match: ${match.overallMatchScore}%`);
  console.log(`Red highlights: ${highlights.highlights.filter(h => h.severity === 'red').length}`);
}

analyseResume('./john_doe.pdf', './job_description.txt').catch(console.error);
```

---

### cURL Examples

**Register user:**

```bash
curl -X POST https://api.resumeiq.ai/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"securepass123"}'
```

**Upload resume:**

```bash
curl -X POST https://api.resumeiq.ai/v1/resume/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "resume_file=@resume.pdf" \
  -F "target_role=Software Engineer"
```

**Get ATS score:**

```bash
curl -X POST https://api.resumeiq.ai/v1/resume/RESUME_ID/ats-score \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"target_role":"Software Engineer","experience_level":"mid"}'
```

**Match against a job description:**

```bash
curl -X POST https://api.resumeiq.ai/v1/resume/RESUME_ID/match-jd \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "job_description": "We are looking for a Senior Backend Engineer...",
    "job_title": "Senior Backend Engineer",
    "company": "Zepto"
  }'
```

**Get improvement tips:**

```bash
curl https://api.resumeiq.ai/v1/resume/RESUME_ID/improvements?target_role=DevOps+Engineer \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

*© 2025 ResumeIQ. All rights reserved.*  
*Documentation: docs.resumeiq.ai  ·  Support: support@resumeiq.ai*
