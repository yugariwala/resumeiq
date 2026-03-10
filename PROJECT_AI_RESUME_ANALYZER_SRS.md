**SOFTWARE REQUIREMENTS SPECIFICATION**

**PROJECT_AI_RESUME_ANALYZER**

ResumeIQ --- AI-Powered Resume Analyser & Career Coach

Version 1.0 \| March 2026

**IEEE 830 Compliant \| CONFIDENTIAL**

**1. Document Control**

  -------------------- --------------------------------------------------------------------
  **Document Title**   Software Requirements Specification --- PROJECT_AI_RESUME_ANALYZER

  -------------------- --------------------------------------------------------------------

  ------------------- --------------------------------------------------------
  **Project Name**    ResumeIQ --- AI-Powered Resume Analyser & Career Coach

  ------------------- --------------------------------------------------------

  ------------------- ---------------------------------------------------
  **SRS Version**     1.0 --- Initial Release

  ------------------- ---------------------------------------------------

  ------------------- ---------------------------------------------------
  **Date**            March 2026

  ------------------- ---------------------------------------------------

  ------------------- ---------------------------------------------------
  **Status**          Approved for Development

  ------------------- ---------------------------------------------------

  ------------------- ---------------------------------------------------
  **Standard**        IEEE 830-1998 SRS Format

  ------------------- ---------------------------------------------------

  ------------------- ---------------------------------------------------
  **Prepared By**     \[Author / Team Name\]

  ------------------- ---------------------------------------------------

  ------------------- ---------------------------------------------------
  **Reviewed By**     \[Tech Lead / Product Manager\]

  ------------------- ---------------------------------------------------

  ------------------- ---------------------------------------------------
  **Approved By**     \[Authorised Signatory\]

  ------------------- ---------------------------------------------------

**1.1 Revision History**

  -----------------------------------------------------------------------------------------------------------------------------------------------------------
  **Version**   **Date**     **Author**               **Changes**
  ------------- ------------ ------------------------ -------------------------------------------------------------------------------------------------------
  1.0           March 2026   \[Author\]               Initial SRS --- complete first draft covering all functional, non-functional, and system requirements

  -----------------------------------------------------------------------------------------------------------------------------------------------------------

**2. Table of Contents**

1\. Document Control

2\. Table of Contents

3\. Introduction

3.1 Purpose

3.2 Scope

3.3 Definitions, Acronyms & Abbreviations

3.4 References

3.5 Overview

4\. Overall Description

4.1 Product Perspective

4.2 Product Functions --- Summary

4.3 User Classes & Characteristics

4.4 Operating Environment

4.5 Design & Implementation Constraints

4.6 Assumptions & Dependencies

5\. System Architecture & AI Pipeline

5.1 High-Level Architecture

5.2 AI Processing Pipeline

5.3 Data Flow Diagram

5.4 Technology Stack

6\. Functional Requirements

6.1 User Inputs & Contextual Questionnaire

6.2 Resume Upload & Document Parsing

6.3 ATS Score Engine

6.4 Skill Extraction & Mapping

6.5 AI Selection Prediction Engine

6.6 Personalised Learning Plan Generator

6.7 Resume Improvement Engine

6.8 Visual Highlight System

6.9 Job Description Matcher

6.10 Results Dashboard & Report Export

6.11 User Account & Authentication

7\. External Interface Requirements

7.1 User Interface Requirements

7.2 Hardware Interfaces

7.3 Software Interfaces

7.4 Communication Interfaces

8\. Non-Functional Requirements

8.1 Performance Requirements

8.2 Scalability Requirements

8.3 Security Requirements

8.4 Reliability & Availability

8.5 Usability Requirements

8.6 Maintainability Requirements

8.7 Portability Requirements

9\. Use Cases

UC-01 Upload Resume & Receive Full Analysis

UC-02 Target Company Selection Prediction

UC-03 View Personalised Learning Plan

UC-04 Job Description Match Analysis

UC-05 Download Analysis Report

10\. Data Requirements

10.1 Data Entities

10.2 Data Validation Rules

10.3 Data Retention & Privacy

11\. Business Rules

12\. Constraints

13\. Appendix A --- Requirement Traceability Matrix

14\. Appendix B --- Glossary

**3. Introduction**

**3.1 Purpose**

This Software Requirements Specification (SRS) document defines the complete functional and non-functional requirements for ResumeIQ --- PROJECT_AI_RESUME_ANALYZER. It is intended to serve as the authoritative technical reference for the development team, QA engineers, UI/UX designers, and the AI/ML team building and testing this system.

The SRS follows IEEE 830-1998 standards and covers every system behaviour, interface requirement, data constraint, and performance target necessary to build a production-ready version of the platform.

**3.2 Scope**

ResumeIQ is a web-based AI-powered platform that accepts resume uploads from job seekers and delivers a comprehensive, personalised career analysis. The system will:

-   Parse uploaded PDF and DOCX resumes and extract structured data

-   Calculate an ATS compatibility score with five weighted sub-scores

-   Extract all explicit and implicit skills and infer proficiency levels

-   Accept target company and role inputs along with a contextual questionnaire

-   Predict the likelihood of selection for the specified target role and company

-   Categorise the candidate\'s primary issue as a Resume Problem (Category A) or a Skill Gap (Category B)

-   Generate a personalised, ordered, time-bound learning plan for Category B users

-   Generate specific, content-aware resume improvement tips for all users

-   Display a colour-coded visual highlight overlay on the parsed resume

-   Accept optional job description paste for targeted match scoring and keyword gap analysis

-   Render all outputs on a unified results dashboard and export them as a downloadable PDF report

The system does NOT include: job application submission, employer-facing tools, native mobile apps, ATS platform integrations, or LinkedIn profile optimisation in Version 1.0.

**3.3 Definitions, Acronyms & Abbreviations**

  -------------------------------------------------------------------------------------------------------------------------------
  **Term / Acronym**   **Definition**
  -------------------- ----------------------------------------------------------------------------------------------------------
  ATS                  Applicant Tracking System --- automated software used by employers to filter resumes before human review

  NLP                  Natural Language Processing --- AI techniques enabling semantic understanding of human text

  Embeddings           High-dimensional numerical vector representations of text that encode semantic meaning

  Cosine Similarity    Mathematical measure of angle similarity between two vectors; used for resume-to-JD match scoring

  JD                   Job Description --- the formal listing of role requirements published by an employer

  FR                   Functional Requirement --- a specific behaviour the system must exhibit

  NFR                  Non-Functional Requirement --- a quality attribute the system must satisfy (performance, security, etc.)

  Category A           Resume Issues --- candidate has required skills but the resume fails to present them effectively

  Category B           Skill Gaps --- candidate genuinely lacks skills required for the target role and company

  LLM                  Large Language Model --- AI model (Claude API) used for natural language generation outputs

  PDF                  Portable Document Format --- primary supported resume file format

  DOCX                 Microsoft Word Open XML format --- secondary supported resume file format

  API                  Application Programming Interface --- interface through which system components communicate

  DFD                  Data Flow Diagram --- visual representation of how data moves through the system

  MAU                  Monthly Active Users

  SRS                  Software Requirements Specification --- this document

  IEEE 830             IEEE standard for software requirements specifications
  -------------------------------------------------------------------------------------------------------------------------------

**3.4 References**

-   IEEE Std 830-1998 --- IEEE Recommended Practice for Software Requirements Specifications

-   PROJECT_AI_RESUME_ANALYZER Business Requirements Document (BRD) v1.0 --- March 2026

-   Anthropic Claude API Documentation --- https://docs.anthropic.com

-   PyMuPDF Documentation --- https://pymupdf.readthedocs.io

-   OpenAI Embeddings API Documentation --- https://platform.openai.com/docs/guides/embeddings

-   OWASP Top 10 Web Application Security Risks --- https://owasp.org/www-project-top-ten/

-   GDPR Regulation (EU) 2016/679 --- Data Protection Guidelines

**3.5 Document Overview**

Section 3 provides the introduction and context. Section 4 gives the overall system description. Section 5 covers architecture and AI pipeline. Section 6 details all functional requirements. Section 7 defines external interfaces. Section 8 specifies non-functional requirements. Section 9 documents use cases. Section 10 covers data requirements. Sections 11--14 contain business rules, constraints, and appendices.

**4. Overall Description**

**4.1 Product Perspective**

ResumeIQ is a new, standalone web application with no dependency on any existing product or platform beyond third-party AI APIs and cloud infrastructure. It is not a replacement for any prior system. It interacts with the following external systems:

-   Anthropic Claude API --- for natural language generation (improvement tips, learning plans, reasoning narratives)

-   Embedding Model API (OpenAI or equivalent) --- for semantic vector computation

-   Cloud Object Storage (AWS S3 or GCP Cloud Storage) --- for temporary resume file storage

-   Razorpay Payment Gateway --- for subscription and pay-per-use billing

-   Email Service (SendGrid or AWS SES) --- for account verification and report delivery

**4.2 Product Functions --- Summary**

  ------------------------------------------------------------------------------------------------------------------------
  **Function**                **Summary Description**
  --------------------------- --------------------------------------------------------------------------------------------
  Resume Parsing              Extract structured text and metadata from PDF and DOCX files

  ATS Score Engine            Compute a 0--100 ATS compatibility score with 5 weighted sub-scores

  Skill Extraction            Identify and classify explicit and implicit skills; infer proficiency levels

  Selection Prediction        Predict likelihood of candidate being selected for a specified target role and company

  Issue Categorisation        Determine whether the primary problem is a resume issue (Cat A) or a skill gap (Cat B)

  Learning Plan Generation    Produce ordered, time-estimated, resource-linked skill development roadmap for Cat B users

  Resume Improvement Engine   Generate specific, content-aware rewrite suggestions per resume section

  Visual Highlight System     Colour-coded overlay (Green/Yellow/Red) on rendered resume with hover-triggered tooltips

  JD Matcher                  Semantic comparison of resume against pasted job description; keyword gap analysis

  Results Dashboard           Unified, tabbed interface displaying all analysis outputs

  Report Export               Generate and download full analysis as formatted PDF report

  User Account System         Registration, login, subscription management, analysis history
  ------------------------------------------------------------------------------------------------------------------------

**4.3 User Classes & Characteristics**

  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **User Class**              **Technical Expertise**               **System Interaction Pattern**
  --------------------------- ------------------------------------- ------------------------------------------------------------------------------------------------------------------------------
  Fresh Graduate / Student    Non-technical; basic web user         Uploads resume, fills questionnaire, reads recommendations. Needs clear, jargon-free output. Uses learning plan extensively.

  Experienced Professional    Moderate; comfortable with web apps   Uploads resume, targets specific companies. Focuses on ATS score, keyword gaps, and bullet rewrite suggestions.

  Career Switcher             Varies widely                         Needs skill gap analysis and learning plan. Uses Job Match suggestions to identify reachable target roles.

  B2B Placement Coordinator   Moderate; familiar with dashboards    Accesses aggregate student analytics. Monitors cohort ATS score distributions. Does not perform individual analyses.

  System Administrator        High technical expertise              Manages platform configuration, monitors API usage, manages user accounts, reviews system logs.
  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**4.4 Operating Environment**

-   Server-side: Linux-based cloud VM (AWS EC2 or GCP Compute Engine); Node.js (TypeScript) backend; Python AI/ML service layer

-   Client-side: Any modern web browser --- Chrome, Firefox, Safari, Edge (current and one prior major version)

-   Database: PostgreSQL for persistent user and analysis data; Redis for caching analysis results (30-day TTL)

-   File storage: AWS S3 or GCP Cloud Storage --- encrypted object storage for uploaded resumes with automatic 30-day expiry policy

-   Network: All communication via HTTPS; TLS 1.3 enforced on all endpoints

-   Device support: Responsive design for desktop (primary) and mobile (secondary) via web browser; no native app in V1

**4.5 Design & Implementation Constraints**

-   Resume analysis must complete end-to-end within 15 seconds under normal load conditions.

-   The system must handle PDF files up to 5 MB in size; DOCX files up to 5 MB.

-   All AI generation calls route through the Anthropic Claude API; no self-hosted LLM in V1.

-   The free tier is architecturally constrained to 2 analyses per registered user per calendar month.

-   All user-uploaded resume data must be encrypted at rest (AES-256) and purged after 30 days unless the user explicitly opts into history.

-   The frontend must be built with HTML5, CSS3, JavaScript, and TailwindCSS --- no React or heavyweight framework in V1 (to keep load times minimal and hackathon-friendly).

-   The AI/ML pipeline must be implemented in Python; the API backend in TypeScript (Node.js).

**4.6 Assumptions & Dependencies**

-   The Anthropic Claude API (claude-sonnet model) is available, maintains acceptable response latency (\< 8 seconds for generation calls), and operates within budget constraints.

-   The embedding model (OpenAI text-embedding-3 or open-source alternative) is accessible and returns vectors within 2 seconds per call.

-   Resume and job role training datasets sourced from Kaggle and curated sources are accurate enough for initial model training and will be refreshed quarterly.

-   Users upload resumes with selectable text (non-scanned). OCR support for scanned PDFs is deferred to V1.1.

-   Users provide honest questionnaire responses; the system cross-validates against parsed resume content.

-   Indian Rupee (INR) is the primary billing currency; international currencies are V2.

-   Prediction accuracy benchmarking requires 3--6 months of real hiring outcome data collected via opt-in follow-up surveys.

**5. System Architecture & AI Pipeline**

**5.1 High-Level Architecture**

ResumeIQ follows a three-tier architecture: a stateless web frontend, a TypeScript REST API backend, and a Python AI/ML microservice layer. These tiers communicate via internal REST calls over private network interfaces.

  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Tier**                           **Components**
  ---------------------------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Frontend (Presentation Layer)      HTML5 / CSS3 / JavaScript / TailwindCSS web app served via CDN. Handles resume upload UI, questionnaire, results dashboard rendering, highlight overlay, hover tooltips, and PDF report download.

  Backend API (Logic Layer)          TypeScript / Node.js REST API. Handles user authentication, session management, input validation, orchestration of AI pipeline calls, Razorpay billing, and database read/write operations.

  AI/ML Service (Processing Layer)   Python microservice. Executes document parsing, NLP sectioning, text classification, skill extraction, embedding computation, ATS scoring logic, and selection prediction model inference.

  Data Layer                         PostgreSQL (persistent user/analysis data), Redis (result caching, session tokens), AWS S3 / GCP GCS (encrypted resume file storage with 30-day TTL lifecycle rule).

  External APIs                      Anthropic Claude API (LLM generation), OpenAI Embeddings API (or equivalent), Razorpay (billing), SendGrid / SES (email).
  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**5.2 AI Processing Pipeline**

The following is the ordered sequence of AI processing steps executed upon resume submission. All steps except Claude API generation run in the Python AI/ML microservice. Steps 5 and 7 run in parallel after step 4.

1.  STEP 1 --- Document Parser: PDF or DOCX file is received from object storage. PyMuPDF (PDF) or python-docx (DOCX) extracts raw text while preserving structural hierarchy. Output: raw structured text with positional metadata (heading vs bullet vs paragraph).

2.  STEP 2 --- NLP Section Structuring: spaCy or equivalent NLP library reads extracted text and identifies sentence boundaries, named entities, dates, and semantic context. Output: labelled text blocks with contextual understanding.

3.  STEP 3 --- Text Classifier: A fine-tuned classification model (BERT or equivalent) tags every text block with its resume section category: Contact Info, Work Experience, Education, Skills, Projects, Certifications, Achievements, Miscellaneous. Output: fully categorised resume data structure (JSON).

4.  STEP 4 --- Skill Extractor: NLP model scans all categorised text for explicit skill mentions and infers implicit skills from experience descriptions using semantic pattern matching. Each skill is tagged: type (Technical/Soft/Tool/Domain/Language), source (explicit/implicit), and proficiency inference (Beginner/Intermediate/Expert). Output: skill inventory object.

5.  STEP 5a (parallel) --- Embedding Engine: Resume text and target role description are converted to vectors using the embedding model. Cosine similarity is computed against a job role requirements database. Top 5 matching roles and match percentages are returned.

6.  STEP 5b (parallel) --- ATS Scoring Engine: Rule-based and ML-hybrid engine evaluates resume against ATS compatibility rules across 5 dimensions: Keyword Score (35%), Format Score (25%), Length Score (15%), Consistency Score (15%), Contact Score (10%). Sub-scores and overall score computed.

7.  STEP 6 --- Selection Prediction Model: Combines ATS score, skill match score, questionnaire responses, experience level, and target role/company requirements to produce a binary verdict (Selected / Not Selected) with a confidence score. Model also outputs primary issue classification: Category A (Resume Issues) vs Category B (Skill Gaps).

8.  STEP 7 --- Claude API Generation (parallel with steps 5a/5b): Once parsed data is available, Claude API is called with structured prompts to generate: (a) improvement tips per section, (b) learning plan (if Category B), (c) bullet-point rewrites, (d) reasoning narrative for verdict. All outputs are JSON-structured.

9.  STEP 8 --- Highlight Engine: Maps AI feedback from steps 5b and 7 to specific positions in the original resume text structure. Assigns Green / Yellow / Red classification to each identifiable section and bullet point. Output: highlight map object.

10. STEP 9 --- Dashboard Assembly: API backend assembles all pipeline outputs into the final response payload and stores analysis result in PostgreSQL (with Redis cache for 30 days). Response sent to frontend for rendering.

**5.3 Data Flow Summary**

  ------------------------------------------------------------------------------------------------------
  **Data In**                             **Data Out**
  --------------------------------------- --------------------------------------------------------------
  PDF / DOCX file upload                  Raw text with positional metadata

  Raw text                                Categorised JSON resume data structure

  Categorised resume data                 Skill inventory (type, proficiency, source)

  Resume text + target role               Embedding vectors → match scores + top 5 job suggestions

  Categorised resume data                 ATS score + 5 sub-scores

  All signals + questionnaire responses   Selection verdict + confidence + Category A/B classification

  Structured parsed data                  Improvement tips + learning plan + rewrites (LLM output)

  AI feedback + parsed positions          Highlight map (Green/Yellow/Red per section)
  ------------------------------------------------------------------------------------------------------

**5.4 Technology Stack**

  -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Component**          **Technology / Library**
  ---------------------- ------------------------------------------------------------------------------------------------------------------------------------------------------
  Frontend               HTML5, CSS3, Vanilla JavaScript, TailwindCSS; PDFjs for client-side resume rendering

  Backend API            Node.js with TypeScript; Express.js framework; JWT for authentication; Joi for input validation

  AI/ML Service          Python 3.11+; PyMuPDF (PDF parsing); python-docx (DOCX parsing); spaCy (NLP); scikit-learn or HuggingFace Transformers (classification + prediction)

  Embedding Model        OpenAI text-embedding-3-small or sentence-transformers (all-MiniLM-L6-v2 as open-source alternative)

  LLM Generation         Anthropic Claude API --- claude-sonnet-4 model; structured JSON prompt engineering

  Primary Database       PostgreSQL 15+ --- users, analyses, subscriptions, skill history

  Cache Layer            Redis 7+ --- analysis result cache (30-day TTL); session tokens; rate limit counters

  File Storage           AWS S3 (primary) or GCP Cloud Storage --- AES-256 encryption; 30-day lifecycle expiry rule

  Cloud Infrastructure   AWS EC2 / GCP Compute Engine; Nginx reverse proxy; Docker containers; horizontal auto-scaling

  Payment                Razorpay SDK --- INR billing; subscription and one-time payment flows

  Email                  SendGrid or AWS SES --- account verification, password reset, report delivery

  Monitoring             Datadog or AWS CloudWatch --- API latency, error rates, pipeline performance, cost-per-analysis tracking
  -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**6. Functional Requirements**

Requirements are identified by a unique ID in the format FR-XX-YY where XX is the feature group and YY is the requirement number. Priority levels: P0 = Must Have (blocking), P1 = Should Have, P2 = Nice to Have.

**6.1 User Inputs & Contextual Questionnaire**

  -------------- ------------------------------------------------------------------------------------------------------------------
  **FR-01-01**   The system shall provide a resume upload interface accepting PDF files (up to 5 MB) and DOCX files (up to 5 MB).

  -------------- ------------------------------------------------------------------------------------------------------------------

  -------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-01-02**   The system shall provide a target job role selection input --- a searchable dropdown containing a minimum of 24 predefined role categories spanning IT, Data Science, HR, Finance, Healthcare, Marketing, Operations, Engineering, and Legal.

  -------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-01-03**   The system shall provide a target companies input field allowing the user to enter up to 3 company names. The field shall support autocomplete suggestions from a curated company database.

  -------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-01-04**   The system shall present a contextual questionnaire with the following mandatory fields: (a) Experience Level: Fresher / 1--3 yrs / 3--7 yrs / 7+ yrs; (b) Self-assessed weakest resume area: Skills / Experience / Format / Achievements / Not Sure; (c) Placement timeline: Actively applying now / Exploring options / Planning 3+ months ahead.

  -------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-01-05**   The system shall provide an optional Job Description input field (textarea) where the user may paste a full job posting. This input is optional and clearly labelled as such. Its presence activates FR-09 (JD Matcher).

  -------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-01-06**   The system shall validate all inputs before triggering the analysis pipeline. Required validations: file format check (PDF/DOCX only); file size check (≤ 5 MB); at least one target role must be selected; experience level must be selected. On validation failure, the system shall display a specific, field-level error message.

  -------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**6.2 Resume Upload & Document Parsing**

  -------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-02-01**   The system shall extract all text from uploaded PDF files using PyMuPDF, preserving the structural hierarchy of the original document --- distinguishing headings, bullet points, paragraph text, contact information blocks, and date strings.

  -------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- ---------------------------------------------------------------------------------------------------------------------------
  **FR-02-02**   The system shall extract all text from uploaded DOCX files using python-docx, preserving equivalent structural hierarchy.

  -------------- ---------------------------------------------------------------------------------------------------------------------------

  -------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-02-03**   The system shall handle the following challenging resume formats without data loss or processing failure: two-column layouts; tables used for skills or experience; text boxes; graphical section dividers; non-standard fonts. On parse failure due to unsupported format, the system shall display a specific error message and offer the user a fallback manual text-paste input.

  -------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-02-04**   The system shall identify and extract the following data entities from parsed text: (a) Contact Information --- name, email, phone number, LinkedIn URL, GitHub URL, personal website URL, physical location; (b) Work Experience --- employer name, job title, start date, end date, duration, responsibility descriptions; (c) Education --- degree name, institution name, graduation year, GPA (if present), relevant coursework (if present); (d) Skills --- all skills mentioned anywhere in the document; (e) Projects --- project name, description, technologies used, outcomes; (f) Certifications --- certification name, issuing body, date; (g) Achievements and awards.

  -------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-02-05**   The system shall normalise section header variations --- \'Work History\', \'Career\', \'Professional Experience\', \'Employment\' must all resolve to the Work Experience category internally.

  -------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-02-06**   The system shall detect incomplete contact information (missing email, missing phone) and display a warning to the user before ATS scoring is shown. The analysis shall still proceed.

  -------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**6.3 ATS Score Engine**

  -------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-03-01**   The system shall compute an overall ATS compatibility score on a scale of 0 to 100. The overall score shall be the weighted sum of five sub-scores as defined in FR-03-02 through FR-03-06.

  -------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-03-02**   Keyword Score (35% weight): The system shall evaluate: (a) presence and density of industry-relevant keywords for the target role; (b) natural keyword usage vs. keyword stuffing detection; (c) presence of strong action verbs at the beginning of bullet points; (d) absence of filler phrases (\'Responsible for\', \'Worked on\'). Score range: 0--35 points.

  -------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-03-03**   Format Score (25% weight): The system shall evaluate: (a) single vs. multi-column layout detection; (b) presence of tables, text boxes, or embedded graphics that break ATS parsers; (c) use of standard, ATS-safe fonts; (d) recognisable standard section headings. Score range: 0--25 points.

  -------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-03-04**   Contact Score (10% weight): The system shall evaluate: (a) completeness of contact block (name, email, phone); (b) professionalism of email address (no nicknames or numbers in unprofessional formats); (c) presence of LinkedIn URL for professional roles; (d) presence of GitHub URL for technical roles. Score range: 0--10 points.

  -------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-03-05**   Length Score (15% weight): The system shall evaluate resume page length against experience level. Rule: 0--2 years experience → 1 page expected; 3+ years experience → 2 pages maximum. Penalty applied for over-length resumes. Score range: 0--15 points.

  -------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-03-06**   Consistency Score (15% weight): The system shall evaluate: (a) date format uniformity throughout the document; (b) parallel grammatical structure in bullet points within the same section; (c) consistent verb tense across work experience descriptions. Score range: 0--15 points.

  -------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-03-07**   The system shall display the overall ATS score prominently on the dashboard AND display each of the five sub-scores individually with a one-sentence plain-language explanation of the primary driver for each sub-score.

  -------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-03-08**   ATS score accuracy shall be within ±8 points of scores produced by industry-standard ATS tools (Jobscan benchmark) for the same resume in validation testing.

  -------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------

**6.4 Skill Extraction & Mapping**

  -------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-04-01**   The system shall extract all skills mentioned in the resume --- both explicit skills (directly listed) and implicit skills (inferred from experience descriptions through semantic pattern matching).

  -------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-04-02**   Each extracted skill shall be classified into exactly one of five categories: (a) Technical / Hard Skills; (b) Soft Skills; (c) Tools & Software; (d) Domain Knowledge; (e) Languages (programming or spoken).

  -------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-04-03**   The system shall infer a proficiency level for each skill: Beginner (mentioned once, in tools list only), Intermediate (appears multiple times or in moderate context), Expert (appears frequently, in senior-context descriptions, or with quantified outcomes). These levels must be displayed on the skills map.

  -------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-04-04**   The system shall compare extracted skills against the target role\'s required skill set and calculate a skills match percentage. Missing skills (present in role requirements but absent from resume) shall be listed explicitly.

  -------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-04-05**   The system shall output a visual skills map displaying: all extracted skills grouped by category; proficiency level indicator per skill; gap indicator showing skills required for target role that are absent from the resume.

  -------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-04-06**   The system shall suggest top 5 most suitable job roles based on cosine similarity between the resume\'s skill embedding vector and job role requirement vectors in the role database. For each suggested role, the system shall display: role title, match percentage, missing skills list, and a competitive index (how the candidate compares to average applicants for that role).

  -------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**6.5 AI Selection Prediction Engine**

  -------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-05-01**   The system shall produce a selection prediction verdict for the specified target company and target role after receiving all inputs and completing the parsing pipeline.

  -------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-05-02**   The verdict shall be a binary classification: \'Likely Selected\' or \'Not Likely Selected\', accompanied by a confidence score expressed as a percentage (e.g., 72% likely to be selected).

  -------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-05-03**   The prediction model shall use the following input signals: overall ATS score and sub-scores; skill match percentage against target role; experience level and years of experience; education level and institution type; project quality signals; questionnaire responses (self-reported skills, timeline); and where available, benchmarked norms for the target company.

  -------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-05-04**   The system shall produce a reasoning breakdown explaining which specific factors most influenced the prediction verdict. This breakdown must name the specific factors --- not generic statements.

  -------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-05-05**   For \'Not Likely Selected\' verdicts, the system shall classify the primary issue into exactly one of two categories: Category A --- Resume Issues (the candidate has the required skills but the resume does not present them effectively); Category B --- Skill Gaps (the candidate genuinely lacks required skills for this role). This categorisation drives which downstream outputs are emphasised.

  -------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-05-06**   If questionnaire responses indicate skills that are absent from the resume (e.g., user reports 3 years of Python but Python is not on the resume), the system shall classify this as Category A (resume presentation gap), not Category B (skill gap), and flag this specific contradiction explicitly in the output.

  -------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-05-07**   All prediction outputs shall be clearly labelled with a disclaimer: \'This is an AI-generated estimate based on resume analysis and role requirements. It is not a guarantee of any hiring outcome.\'

  -------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**6.6 Personalised Learning Plan Generator**

  -------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-06-01**   The system shall generate a personalised learning plan for all users classified as Category B (Skill Gaps). The plan is supplementary (not primary) for Category A users.

  -------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-06-02**   The learning plan shall list all missing skills required for the target role, ordered by: (1) must-have blockers first (skills that, if absent, will result in immediate disqualification); (2) high-impact differentiators second; (3) nice-to-have skills last.

  -------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-06-03**   For each missing skill, the system shall provide: (a) estimated learning time (e.g., \'6--8 weeks at 1 hour/day\'); (b) a minimum of 2 recommended learning resources (course platforms, documentation, project suggestions); (c) a milestone checkpoint --- a specific deliverable the user should build or demonstrate to validate their learning.

  -------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-06-04**   The system shall calculate and display a total estimated timeline to become competitive for the target role, based on the sum of individual skill learning times adjusted for any overlap.

  -------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-06-05**   If the user\'s stated placement timeline (from questionnaire) is shorter than the full plan\'s estimated duration, the system shall generate a condensed \'fast-track plan\' covering only the highest-impact blockers within the available time window. Both the full plan and the fast-track plan shall be displayed.

  -------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-06-06**   The learning plan shall be generated via Claude API call using a structured prompt that includes the parsed skill inventory, target role requirements, questionnaire responses, and placement timeline as inputs.

  -------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**6.7 Resume Improvement Engine**

  -------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-07-01**   The system shall generate specific, content-aware improvement suggestions for every identified weakness in the resume. Generic template outputs (e.g., \'Add more keywords\') are explicitly prohibited --- each suggestion must reference the user\'s actual resume content.

  -------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-07-02**   Weak bullet point rewriting: For each bullet point classified as Yellow or Red in the highlight system, the system shall generate a specific suggested rewrite demonstrating: (a) a strong action verb opener; (b) quantified impact where applicable; (c) keyword alignment with the target role.

  -------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-07-03**   Missing keywords: The system shall list all keywords expected for the target role that are absent from the resume, with a suggestion for which specific resume section to insert each keyword into.

  -------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-07-04**   Quantification gaps: The system shall identify all bullet points that assert accomplishments without measurable evidence and flag each with a specific prompt: \'Add a metric here --- how many users? what % improvement? over what time period?\'

  -------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-07-05**   Section gap detection: The system shall identify any missing sections that are critical for the user\'s experience level and target role (e.g., missing Projects section for a fresher in technology roles; missing Leadership section for management roles) and explicitly call this out.

  -------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-07-06**   Action verb audit: The system shall count and list all bullet points beginning with weak openers (\'Responsible for\', \'Worked on\', \'Helped with\', \'Assisted in\') and suggest specific strong replacements (Led, Built, Designed, Delivered, Reduced, Increased, Launched, Optimised).

  -------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-07-07**   Length and density audit: The system shall flag resumes where page count is inappropriate for experience level and low-density sections (\< 2 substantial bullet points per role).

  -------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**6.8 Visual Highlight System**

  -------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-08-01**   The system shall render the user\'s resume text on the left panel of the results dashboard with a colour-coded highlight overlay applied at the section and individual bullet-point level.

  -------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-08-02**   Three highlight levels shall be applied --- Green (Strong: well-written, keyword-rich, quantified, correct action verb, ATS-safe); Yellow (Average: present but lacks metrics or some keywords, or has minor formatting issues); Red (Weak: vague language, critical keywords missing, ATS-breaking format, empty or very thin section).

  -------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-08-03**   Hover interaction: When the user hovers over any highlighted text region, a tooltip shall appear containing exactly: (a) the specific issue identified for that region; and (b) a concrete suggested fix or rewrite for that region. Generic tooltip text is explicitly not acceptable.

  -------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-08-04**   The highlight map must be computed by the backend pipeline (Step 8 in Section 5.2) and delivered to the frontend as a structured JSON object mapping text positions to colour classifications and tooltip content. The frontend renders this map onto the displayed resume text.

  -------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-08-05**   The highlight system must achieve section-level granularity at minimum, and bullet-point-level granularity wherever the parsed resume structure supports it.

  -------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------

**6.9 Job Description Matcher**

  -------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-09-01**   When the user has provided a job description in the optional JD input field, the system shall perform a dedicated match analysis between the resume and the pasted JD.

  -------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- -------------------------------------------------------------------------------------------------------------------------------------------
  **FR-09-02**   The system shall extract all keywords, required skills, qualifications, and experience requirements from the pasted JD using NLP parsing.

  -------------- -------------------------------------------------------------------------------------------------------------------------------------------

  -------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-09-03**   The system shall convert both the resume text and the extracted JD content into embedding vectors and compute cosine similarity to produce a JD-specific match score expressed as a percentage.

  -------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-09-04**   The system shall produce a keyword gap list: all keywords and skills present in the JD but absent from the resume, with a suggested target section for each.

  -------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-09-05**   The system shall rewrite up to 3 resume bullet points --- selected as those with the highest improvement potential --- to better align with the JD language, tone, and keyword requirements. Both original and rewritten versions shall be displayed.

  -------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-09-06**   The system shall display a specific, actionable recommendation in the format: \'Adding these N keywords naturally to your \[Section Name\] section would increase your JD match score from X% to approximately Y%.\'

  -------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**6.10 Results Dashboard & Report Export**

  -------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-10-01**   The system shall display all analysis outputs in a single, unified, tabbed results dashboard rendered within 15 seconds of submission. Tabs shall include: Overview / ATS Score / Skills Map / Improvement Tips / Learning Plan / Job Matches / JD Match (if JD was provided).

  -------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-10-02**   The dashboard layout shall place the colour-highlighted resume view in the left panel and the analysis content in the right panel on desktop viewports (≥ 1024px wide). On mobile viewports, the layout shall stack vertically.

  -------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-10-03**   The Overall ATS Score and Selection Prediction Verdict shall be the most visually prominent elements on the dashboard --- displayed above the fold without requiring any scrolling on a standard 1080p desktop display.

  -------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-10-04**   The system shall allow the user to download a PDF report containing: overall ATS score with sub-score breakdown; selection verdict with reasoning; full skills map; all improvement tips; learning plan (if generated); top 5 job match suggestions; JD match analysis (if applicable).

  -------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- ------------------------------------------------------------------------------------------------------------------------------------------
  **FR-10-05**   The PDF report shall be generated server-side and made available for download within 5 seconds of the user clicking the download button.

  -------------- ------------------------------------------------------------------------------------------------------------------------------------------

**6.11 User Account & Authentication**

  -------------- --------------------------------------------------------------------------------------------------------------------------------------
  **FR-11-01**   The system shall support user registration via email and password. Email verification is required before analysis access is granted.

  -------------- --------------------------------------------------------------------------------------------------------------------------------------

  -------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-11-02**   The system shall enforce the free tier limit of 2 full analyses per registered user per calendar month. Attempts to exceed this limit shall present the user with a clear upgrade prompt.

  -------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-11-03**   Pro subscribers shall have access to: unlimited analyses; JD matcher; full learning plan; analysis history for the past 90 days; priority processing queue (guaranteed ≤ 10 second processing time).

  -------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-11-04**   The system shall provide an analysis history view showing previous analyses with date, target role, ATS score, and verdict --- accessible to Pro subscribers only.

  -------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **FR-11-05**   Passwords must be hashed using bcrypt with a minimum cost factor of 12. The system shall enforce password minimum length of 8 characters with at least one uppercase, one lowercase, and one number.

  -------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------- -------------------------------------------------------------------------------------------------
  **FR-11-06**   The system shall support secure password reset via time-limited email token (valid 30 minutes).

  -------------- -------------------------------------------------------------------------------------------------

**7. External Interface Requirements**

**7.1 User Interface Requirements**

-   The UI shall be fully responsive: optimised for desktop (≥ 1024px primary), functional on tablet (768--1023px), and usable on mobile (\< 768px).

-   The homepage shall communicate the product value proposition within the viewport without requiring a scroll --- all primary action (upload + start) shall be accessible above the fold.

-   The resume upload shall support drag-and-drop in addition to click-to-browse file selection.

-   The processing screen shall show an animated progress indicator with contextual status messages (e.g., \'Parsing your resume...\', \'Analysing ATS compatibility...\', \'Generating your personalised plan...\') --- not a generic spinner.

-   All colour highlight elements (Green/Yellow/Red) must meet WCAG 2.1 AA contrast ratios. Hover tooltips must also be accessible via keyboard focus (Tab key) for screen-reader compatibility.

-   The UI framework shall be TailwindCSS --- no heavyweight component frameworks (React, Vue) in V1.

-   All AI-generated text shall be visually labelled with an \'AI Generated\' badge to maintain transparency.

**7.2 Hardware Interfaces**

-   No specific hardware interfaces required beyond standard web browser + internet connection.

-   Minimum client-side: Any device capable of running a modern web browser with JavaScript enabled.

-   Server-side: AWS EC2 t3.medium or equivalent for API backend; GPU-capable instance optional for AI service (CPU inference acceptable for V1).

**7.3 Software Interfaces**

  -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **External System**                     **Interface Type**                   **Purpose**
  --------------------------------------- ------------------------------------ ------------------------------------------------------------------------------------------------------
  Anthropic Claude API                    HTTPS REST --- POST /v1/messages     Natural language generation: improvement tips, learning plans, bullet rewrites, reasoning narratives

  OpenAI Embeddings API (or equivalent)   HTTPS REST --- POST /v1/embeddings   Convert resume and JD text into semantic vectors for similarity scoring

  AWS S3 / GCP Cloud Storage              AWS SDK / GCP SDK                    Store uploaded resume files (encrypted, 30-day auto-expiry)

  PostgreSQL 15+                          pg / Prisma ORM                      Persistent storage: users, analyses, subscriptions, skill history, B2B accounts

  Redis 7+                                ioredis client                       Analysis result caching (30-day TTL), session tokens, rate limit counters

  Razorpay                                Razorpay Node.js SDK                 INR billing: Pro subscriptions (₹299/month), Pay-Per-Use (₹49), B2B invoicing

  SendGrid / AWS SES                      HTTPS REST                           Transactional email: verification, password reset, report delivery notifications
  -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**7.4 Communication Interfaces**

-   All client-server communication shall use HTTPS with TLS 1.3 or higher. TLS 1.0 and 1.1 are explicitly disabled.

-   The API backend shall expose a RESTful API. All request and response bodies shall use JSON format with UTF-8 encoding.

-   File uploads shall be handled via multipart/form-data HTTP POST requests with a maximum payload size of 5 MB enforced at the Nginx reverse proxy layer.

-   Internal service-to-service communication (API backend to Python AI service) shall use HTTPS over a private VPC network --- not exposed to the public internet.

-   WebSocket connection shall be used to stream real-time progress updates from the AI pipeline to the client during the processing screen phase.

**8. Non-Functional Requirements**

**8.1 Performance Requirements**

  --------------- -------------------------------------------------------------------------------------------------------------------------------------------
  **NFR-01-01**   End-to-end resume analysis (upload to full dashboard render) shall complete within 15 seconds under normal load (≤ 200 concurrent users).

  --------------- -------------------------------------------------------------------------------------------------------------------------------------------

  --------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **NFR-01-02**   The first meaningful content (ATS score + verdict) shall be visible to the user within 10 seconds of submission via progressive rendering --- the full dashboard need not be complete.

  --------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  --------------- --------------------------------------------------------------------------------------------------------------------
  **NFR-01-03**   The homepage and upload interface shall achieve a Lighthouse Performance Score ≥ 85 on desktop and ≥ 70 on mobile.

  --------------- --------------------------------------------------------------------------------------------------------------------

  --------------- --------------------------------------------------------------------------------------------
  **NFR-01-04**   The PDF report export shall complete within 5 seconds of the user initiating the download.

  --------------- --------------------------------------------------------------------------------------------

  --------------- -----------------------------------------------------------------------------------------------------------------------------------------
  **NFR-01-05**   API response time for non-AI endpoints (authentication, account management, history retrieval) shall be ≤ 300ms at the 95th percentile.

  --------------- -----------------------------------------------------------------------------------------------------------------------------------------

**8.2 Scalability Requirements**

  --------------- -----------------------------------------------------------------------------------------------
  **NFR-02-01**   The system shall handle 500 concurrent resume analyses without performance degradation in V1.

  --------------- -----------------------------------------------------------------------------------------------

  --------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **NFR-02-02**   The architecture shall support horizontal scaling of both the API backend and the Python AI service via Docker container orchestration (ECS or GKE) to handle B2B peak loads of 1,000+ concurrent users.

  --------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  --------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **NFR-02-03**   Analysis results shall be cached in Redis for 30 days. Re-submission of an identical resume (same file hash) within the cache window shall return the cached result without re-running the pipeline --- reducing API cost and latency.

  --------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**8.3 Security Requirements**

  --------------- ------------------------------------------------------------------------------------------------------------
  **NFR-03-01**   All uploaded resume files shall be encrypted at rest using AES-256. All data in transit shall use TLS 1.3.

  --------------- ------------------------------------------------------------------------------------------------------------

  --------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **NFR-03-02**   Uploaded resume files shall be automatically deleted from storage 30 days after upload unless the user has explicitly enabled analysis history in their account settings. On account deletion, all associated files and analysis data shall be deleted within 24 hours.

  --------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  --------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------
  **NFR-03-03**   User resume data shall NOT be used for training or fine-tuning any AI model without explicit, informed user opt-in consent. The default state is opted out.

  --------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------

  --------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **NFR-03-04**   The system shall comply with GDPR data protection requirements, including: right of access; right to erasure; data minimisation; explicit consent for data processing beyond service delivery.

  --------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  --------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **NFR-03-05**   All API endpoints shall be protected against OWASP Top 10 risks including: SQL injection; XSS; CSRF (using SameSite cookies + CSRF tokens); broken authentication; excessive data exposure. Security testing must be completed before production deployment.

  --------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  --------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------
  **NFR-03-06**   Rate limiting shall be applied to all public API endpoints: 60 requests/minute per IP for unauthenticated requests; 300 requests/minute per authenticated user.

  --------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------

**8.4 Reliability & Availability**

  --------------- ----------------------------------------------------------------------------------------------------------------------------------------------------
  **NFR-04-01**   The platform shall achieve 99.5% monthly uptime for core analysis features. Planned maintenance windows shall be communicated 48 hours in advance.

  --------------- ----------------------------------------------------------------------------------------------------------------------------------------------------

  --------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **NFR-04-02**   If the Anthropic Claude API is unavailable, the system shall return the ATS score, skill extraction, prediction verdict, and highlight map (which do not require Claude) and display a graceful degradation message explaining that natural language suggestions are temporarily unavailable.

  --------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  --------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **NFR-04-03**   Database backups shall be performed daily with a 30-day retention period. Recovery Time Objective (RTO) shall be ≤ 4 hours; Recovery Point Objective (RPO) shall be ≤ 24 hours.

  --------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**8.5 Usability Requirements**

  --------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------
  **NFR-05-01**   A first-time user shall be able to complete a full resume analysis (upload → questionnaire → results) within 3 minutes without any onboarding tutorial.

  --------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------

  --------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **NFR-05-02**   The average session duration on the results dashboard shall be a minimum of 5 minutes, validated via analytics. If consistently below 5 minutes, UX review is required.

  --------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  --------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------
  **NFR-05-03**   All AI-generated outputs shall use plain English free of technical jargon. The reading level of output text shall target Flesch-Kincaid Grade Level ≤ 10.

  --------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------

  --------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **NFR-05-04**   The UI shall meet WCAG 2.1 Level AA accessibility standards: keyboard navigability; screen-reader compatibility; minimum 4.5:1 contrast ratio for all text; all interactive elements have visible focus indicators.

  --------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**8.6 Maintainability Requirements**

  --------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **NFR-06-01**   The codebase shall be modular: AI pipeline stages (parser, classifier, extractor, scorer, predictor, generator) shall be independently deployable Python modules. Adding a new AI model or replacing an existing one shall not require changes to other modules.

  --------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  --------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **NFR-06-02**   Unit test coverage shall be ≥ 80% for the Python AI service layer. AI accuracy regression tests (ATS score benchmark, prediction accuracy) shall run automatically in CI/CD on every deployment.

  --------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  --------------- --------------------------------------------------------------------------------------------------------------------------------------------------
  **NFR-06-03**   All API endpoints shall be documented using OpenAPI 3.0 specification. Documentation shall be auto-generated and kept in sync with the codebase.

  --------------- --------------------------------------------------------------------------------------------------------------------------------------------------

**8.7 Portability Requirements**

  --------------- ----------------------------------------------------------------------------------------------------------------------------------------------------
  **NFR-07-01**   The system shall be containerised using Docker. Container images shall be deployable on any cloud provider (AWS, GCP, Azure) without code changes.

  --------------- ----------------------------------------------------------------------------------------------------------------------------------------------------

  --------------- -------------------------------------------------------------------------------------------------------------------------------------------------------
  **NFR-07-02**   The web frontend shall function correctly on Chrome, Firefox, Safari, and Edge --- current and one prior major version --- on both Windows and macOS.

  --------------- -------------------------------------------------------------------------------------------------------------------------------------------------------

**9. Use Cases**

**UC-01: Upload Resume & Receive Full Analysis**

  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Field**            **Detail**
  -------------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Use Case ID          UC-01

  Use Case Name        Upload Resume and Receive Full AI Analysis

  Primary Actor        Job Seeker (any user class)

  Preconditions        User is registered and logged in (or guest with free tier access). User has a resume file (PDF or DOCX) ready.

  Main Flow            1\. User navigates to upload screen. 2. User uploads resume via drag-drop or file picker. 3. User selects target role and enters up to 3 target companies. 4. User completes 5--7 question contextual questionnaire. 5. User optionally pastes a job description. 6. User clicks \'Analyse My Resume\'. 7. System validates inputs. 8. System triggers AI pipeline. 9. Processing screen with progress indicator is shown. 10. Results dashboard renders with ATS score, verdict, highlights, tips, and plan.

  Alternative Flow A   If file format is unsupported: system displays specific error message and prompts user to upload a valid format.

  Alternative Flow B   If file parsing fails (complex format): system displays error, offers manual text-paste fallback input.

  Postconditions       Analysis result is stored in the database and visible in the user\'s history (Pro users). ATS score, verdict, skills map, improvement tips, and learning plan are displayed.

  Related FRs          FR-01, FR-02, FR-03, FR-04, FR-05, FR-06, FR-07, FR-08, FR-10
  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**UC-02: Target Company Selection Prediction**

  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Field**           **Detail**
  ------------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Use Case ID         UC-02

  Use Case Name       Receive AI Selection Prediction for Target Company and Role

  Primary Actor       Job Seeker

  Preconditions       UC-01 has been completed. User specified at least one target company and one target role.

  Main Flow           1\. Following UC-01 pipeline, prediction model evaluates all signals. 2. System returns \'Likely Selected\' or \'Not Likely Selected\' verdict with confidence score. 3. System displays reasoning breakdown (named factors). 4. System displays primary issue as Category A or Category B. 5. For Category A: improvement engine outputs are emphasised. 6. For Category B: learning plan outputs are emphasised.

  Alternative Flow    If questionnaire skills contradict resume (e.g., user claims Python but it\'s absent from resume): system flags this explicitly as Category A contradiction and highlights the missing section.

  Postconditions      User understands their predicted selection likelihood and the primary reason driving it.

  Related FRs         FR-05-01 through FR-05-07
  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**UC-03: View Personalised Learning Plan**

  -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Field**           **Detail**
  ------------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Use Case ID         UC-03

  Use Case Name       View and Navigate Personalised Skill Development Plan

  Primary Actor       Job Seeker (Category B classification)

  Preconditions       UC-02 has completed and system classified user as Category B (Skill Gaps).

  Main Flow           1\. User navigates to \'Learning Plan\' tab on results dashboard. 2. System displays ordered list of missing skills with must-have vs nice-to-have distinction. 3. For each skill: estimated time + recommended resources + milestone checkpoint are shown. 4. System displays total estimated timeline to competitive readiness. 5. If user\'s stated timeline is shorter than full plan: condensed fast-track version is also displayed side-by-side.

  Postconditions      User has a structured, time-bound, resource-linked action plan.

  Related FRs         FR-06-01 through FR-06-06
  -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**UC-04: Job Description Match Analysis**

  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Field**           **Detail**
  ------------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Use Case ID         UC-04

  Use Case Name       Paste JD and Receive Targeted Match Analysis

  Primary Actor       Job Seeker

  Preconditions       User has provided a job description in the optional JD input field during the UC-01 flow.

  Main Flow           1\. JD text is processed by NLP parser; keywords and requirements are extracted. 2. Resume and JD are independently embedded into vectors. 3. Cosine similarity is computed → JD match score (%). 4. Keyword gap list is generated. 5. Top 3 bullet point rewrites for JD alignment are generated. 6. Actionable score-improvement instruction is displayed: \'Add these N keywords to increase match from X% to Y%\'.

  Postconditions      User can see exactly how their resume compares to a specific job posting and has concrete actions to improve alignment.

  Related FRs         FR-09-01 through FR-09-06
  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**UC-05: Download Analysis Report**

  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Field**           **Detail**
  ------------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Use Case ID         UC-05

  Use Case Name       Download Full Analysis as PDF Report

  Primary Actor       Job Seeker

  Preconditions       UC-01 has completed. Results dashboard is displayed.

  Main Flow           1\. User clicks \'Download Report\' button on results dashboard. 2. System generates server-side PDF containing: ATS score breakdown; selection verdict + reasoning; skills map; all improvement tips; learning plan (if generated); job match suggestions; JD match analysis (if applicable). 3. PDF is returned to browser for download within 5 seconds.

  Postconditions      User has a portable, formatted PDF copy of their full analysis.

  Related FRs         FR-10-04, FR-10-05
  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**10. Data Requirements**

**10.1 Core Data Entities**

  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Entity**       **Key Attributes**
  ---------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  User             user_id (PK), email, password_hash, name, account_type (free/pro/b2b), subscription_status, created_at, analyses_this_month, opt_in_history, opt_in_training_data

  Resume           resume_id (PK), user_id (FK), file_name, file_type (pdf/docx), s3_key, upload_timestamp, expiry_timestamp, parse_status, parsed_json

  Analysis         analysis_id (PK), user_id (FK), resume_id (FK), target_role, target_companies\[\], experience_level, placement_timeline, ats_score, ats_subscores{}, prediction_verdict, confidence_score, category (A/B), skill_inventory{}, highlight_map{}, improvement_tips\[\], learning_plan{}, job_matches\[\], jd_match_score, created_at

  Skill            skill_id (PK), analysis_id (FK), skill_name, category (technical/soft/tool/domain/language), source (explicit/implicit), proficiency (beginner/intermediate/expert), required_for_role (bool), gap (bool)

  LearningPlan     plan_id (PK), analysis_id (FK), skill_name, priority_rank, estimated_hours, resources\[\], milestone, is_blocker (bool), fast_track_included (bool)

  Subscription     sub_id (PK), user_id (FK), plan_type (pro/pay_per_use/b2b_college/b2b_corp), start_date, end_date, razorpay_sub_id, status (active/expired/cancelled)

  B2BAccount       b2b_id (PK), institution_name, contact_email, plan_type, seat_count, contract_start, contract_end, aggregate_analytics_enabled
  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**10.2 Data Validation Rules**

-   Email: RFC 5322 compliant format; must be unique in the users table.

-   Password: minimum 8 characters; at least 1 uppercase, 1 lowercase, 1 number; stored as bcrypt hash (cost 12).

-   Resume file: MIME type must be application/pdf or application/vnd.openxmlformats-officedocument.wordprocessingml.document; file size ≤ 5 MB.

-   Target role: must be a value from the validated role enumeration list (server-side validation, not just client-side).

-   ATS Score: stored value must be an integer in range \[0, 100\]. Sub-scores must sum to the overall score within ±1 point (rounding tolerance).

-   Confidence score: stored as a float in range \[0.0, 1.0\]; displayed as a percentage to the user.

-   JD text input: maximum 10,000 characters. Minimum 100 characters required to trigger JD match analysis.

**10.3 Data Retention & Privacy**

-   Uploaded resume files: auto-deleted after 30 days via S3/GCS lifecycle policy. User account deletion triggers immediate file deletion.

-   Analysis results (database records): retained for 30 days for free users; 90 days for Pro users in history view. Permanently anonymised after retention period.

-   User PII (email, name): retained for the lifetime of the account. Deleted within 24 hours of account deletion request.

-   No resume content or analysis data shall be transmitted to third-party systems beyond the Anthropic API (for generation calls) and the Embedding API (for vector computation). Data sent to these APIs is transient and not retained by the system beyond the API call.

-   AI training use: user resume data shall only be used to improve ResumeIQ\'s models if the user has explicitly opted in via account settings. Default state = opted out.

**11. Business Rules**

  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Rule ID**   **Business Rule**
  ------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  BR-01         The system must always present a primary issue classification of either Category A (Resume Issues) or Category B (Skill Gaps) --- never as an ambiguous mix without explicit prioritisation of one over the other.

  BR-02         The Learning Plan must be ordered by role-specific impact priority (blockers first, differentiators second, nice-to-haves last) --- never alphabetically or by generic importance.

  BR-03         ATS Score must display all five sub-scores alongside the total. Displaying only the composite score without breakdown is a product quality violation.

  BR-04         Visual Highlight tooltips must be section-specific and content-specific. Displaying generic advice (\'Improve this section\') in any tooltip is a product quality violation.

  BR-05         Improvement tip generation must reference the user\'s actual resume content. Generating template-style generic tips not derived from the parsed content is a product quality violation.

  BR-06         If questionnaire responses indicate a skill the user claims to have but the skill is absent from the resume, the system must classify this as Category A (resume presentation gap) and flag this specific contradiction explicitly --- not as a skill gap requiring learning.

  BR-07         All AI-generated outputs must carry a visible \'AI Generated\' label and a standard disclaimer stating these are estimates, not guaranteed hiring outcomes.

  BR-08         The free tier is strictly limited to 2 analyses per registered account per calendar month. This counter resets on the 1st of each calendar month.

  BR-09         Pro features (JD Matcher, full learning plan, analysis history, priority processing) must not be accessible to free-tier users under any circumstances.

  BR-10         User resume data must not be used for model training without explicit opt-in. The system must never assume consent.
  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**12. Constraints**

-   File format: Only PDF and DOCX are supported in V1. Scanned image-only PDFs (no embedded text layer) cannot be processed; user must be informed with a specific error message.

-   Concurrent analysis: Free-tier users may run 1 analysis at a time. Pro users may have up to 3 analyses queued.

-   Analysis per month: Free tier is hard-capped at 2 full analyses per registered account per calendar month.

-   Processing time: Analysis pipeline must complete within 15 seconds. If the Claude API call exceeds 8 seconds, the system returns all non-Claude outputs first and streams the Claude-generated content when ready.

-   LLM dependency: All natural language generation (tips, plans, rewrites, reasoning) routes exclusively through Anthropic Claude API in V1. Self-hosted LLM is not in scope.

-   Language: The system supports English-language resumes only in V1. Multilingual support is V2.

-   Prediction accuracy: The selection prediction model\'s accuracy is constrained by the quality and recency of training data. The model must be clearly presented as an estimate, not a definitive assessment.

-   Frontend framework: TailwindCSS only in V1. No React, Vue, or Angular. This constraint enables faster load times and simpler deployment.

-   Mobile: Web-responsive only in V1. Native iOS or Android applications are out of scope.

-   Geography: INR billing currency only in V1. International payment support is V2.

**13. Appendix A --- Requirements Traceability Matrix**

  ---------------------------------------------------------------------------------------------------
  **FR / NFR ID**   **Requirement Summary**                      **BRD Reference**   **Use Case**
  ----------------- -------------------------------------------- ------------------- ----------------
  FR-01-01 to 06    User inputs and questionnaire                BRD §10.1           UC-01

  FR-02-01 to 06    Resume parsing and data extraction           BRD §8.1            UC-01

  FR-03-01 to 08    ATS Score Engine (5 sub-scores)              BRD §8.2            UC-01

  FR-04-01 to 06    Skill extraction, mapping, job match         BRD §8.3            UC-01

  FR-05-01 to 07    AI Selection Prediction + categorisation     BRD §8.4            UC-02

  FR-06-01 to 06    Personalised Learning Plan generation        BRD §8.5            UC-03

  FR-07-01 to 07    Resume Improvement Engine                    BRD §8.6            UC-01

  FR-08-01 to 05    Visual Highlight System (Green/Yellow/Red)   BRD §8.7            UC-01

  FR-09-01 to 06    Job Description Matcher                      BRD §8.8            UC-04

  FR-10-01 to 05    Results Dashboard and Report Export          BRD §10.10          UC-05

  FR-11-01 to 06    User Authentication and Account Management   BRD §13             UC-01

  NFR-01-01 to 05   Performance requirements                     BRD §9              All UCs

  NFR-02-01 to 03   Scalability requirements                     BRD §9              All UCs

  NFR-03-01 to 06   Security requirements                        BRD §9, §10.3       All UCs

  NFR-04-01 to 03   Reliability and availability                 BRD §9              All UCs

  NFR-05-01 to 04   Usability requirements                       BRD §9              All UCs

  NFR-06-01 to 03   Maintainability requirements                 BRD §9              N/A

  NFR-07-01 to 02   Portability requirements                     BRD §9              N/A
  ---------------------------------------------------------------------------------------------------

**14. Appendix B --- Glossary**

  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Term**                            **Definition**
  ----------------------------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  ATS (Applicant Tracking System)     Automated software used by employers to filter, sort, and rank resumes before any human reviewer sees them. Uses keyword matching, formatting rules, and structural checks.

  ATS Score                           A computed score (0--100) representing how well a resume is optimised for ATS screening, decomposed into Keyword, Format, Contact, Length, and Consistency sub-scores.

  NLP (Natural Language Processing)   AI techniques enabling machines to understand the semantic meaning and context of human language, going beyond literal keyword matching.

  Embeddings                          Numerical vector representations of text in high-dimensional space where semantically similar text produces mathematically similar vectors. Enable comparison of resume and JD content regardless of exact wording differences.

  Cosine Similarity                   A mathematical measure of similarity between two vectors based on the angle between them. A value of 1.0 = identical meaning; 0.0 = completely unrelated. Used for resume-to-JD and resume-to-role match scoring.

  Explicit Skills                     Skills directly mentioned in the resume text --- listed in a Skills section or named in a bullet point.

  Implicit Skills                     Skills inferred by NLP from experience descriptions rather than explicitly stated. Example: \'deployed microservices to production\' implies Docker, CI/CD, and DevOps knowledge.

  Category A Issue                    The candidate\'s primary problem is resume presentation --- they have the required skills but the resume does not communicate them effectively. Fix = rewrite and reformat the resume.

  Category B Issue                    The candidate\'s primary problem is a genuine skill gap --- they lack skills required for the target role. Fix = follow the personalised learning plan.

  Selection Prediction                AI model output estimating the probability that a candidate will be selected (pass screening and advance to interview) for a specified role at a specified company, given their resume and profile.

  Confidence Score                    A percentage value (0--100%) attached to the selection prediction verdict indicating the model\'s confidence in its classification, based on signal strength and data quality.

  Learning Roadmap                    A structured, ordered skill development plan specifying which skills to acquire, in what sequence, with time estimates and recommended learning resources per skill.

  Fast-Track Plan                     A condensed version of the full learning roadmap covering only the highest-impact blocker skills within the user\'s stated available time window.

  Highlight Map                       A data structure mapping resume text positions to colour classifications (Green/Yellow/Red) and tooltip content, computed by the AI pipeline and rendered visually on the dashboard.

  JD Matcher                          Platform feature that performs semantic comparison between the user\'s resume and a pasted job description, producing a match score and keyword gap analysis.

  Proficiency Level                   Inferred assessment of skill depth: Beginner (mentioned once, minimal context), Intermediate (appears multiple times or in moderate context), Expert (frequent, senior-level context, or quantified outcomes).

  PyMuPDF                             Python library for PDF parsing used by the document parser module. Handles complex PDF structures including multi-column, tabular, and graphic-heavy files.

  SRS                                 Software Requirements Specification --- this document. Defines what the system must do (functional) and how well it must do it (non-functional).

  IEEE 830                            IEEE Recommended Practice for Software Requirements Specifications. Standard followed by this document.

  LLM                                 Large Language Model --- the Claude AI model (Anthropic) used by this system for all natural language text generation.

  DXA                                 Document eXchange Architecture unit --- 1/1440 of an inch. Used for precise positioning in Word/DOCX documents.
  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

*--- End of Document ---*

PROJECT_AI_RESUME_ANALYZER \| SRS v1.0 \| IEEE 830 \| Confidential \| March 2026
