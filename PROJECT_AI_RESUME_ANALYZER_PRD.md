**ResumeIQ**

AI-Powered Resume Intelligence Platform

Product Requirements Document --- Final Consolidated Version

*Confidential \| Not for Distribution*

+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **One-Line Pitch**                                                                                                                                                                                            |
|                                                                                                                                                                                                               |
| AI Resume Analyzer predicts if you will get selected, shows exactly what ATS sees, identifies skill gaps, improves your resume, and creates a personalised learning plan --- all in one interactive platform. |
+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

**1. Product Overview**

ResumeIQ is an AI-powered resume intelligence platform that allows job seekers to upload their resume, specify a target company, and answer a short intake questionnaire. The AI analyses the resume in depth, simulates the company\'s selection process, and predicts whether the user would be selected for the role.

If not selected, the system provides a personalised plan including skills to learn, resume improvement recommendations, and actionable next steps. If the candidate has all required skills but a poorly formatted or weak resume, the AI focuses specifically on resume enhancement guidance. The system is fully interactive and visually engaging --- built to feel like a product, not a form.

  --------------------- ----------------------------------------------------------------------------------------
  **Product Name**      ResumeIQ --- AI Resume Analyzer & Job Selection Platform

  **Document**          Product Requirements Document --- Final Consolidated Version

  **Core Value**        Predict selection outcome · Fix what\'s wrong · Build what\'s missing --- one platform

  **Tech Stack**        TypeScript (Backend) · Python (AI/ML) · HTML, CSS, JS, Tailwind CSS (Frontend)

  **Database**          SQL (structured) + NoSQL (resume blobs, parsed results, session state)

  **LLM**               Claude API (claude-sonnet-4-6) --- verdicts, tips, learning plans, rewrites

  **Target Users**      Students, fresh graduates, professionals, placement cells, recruiters

  **Performance**       Full analysis pipeline completes in under 15 seconds end-to-end
  --------------------- ----------------------------------------------------------------------------------------

**2. Problem Statement**

**2.1 The Hidden Rejection Crisis**

Over 95% of Fortune 500 companies use Applicant Tracking Systems (ATS) to filter resumes before any human sees them. Qualified candidates are eliminated by algorithms --- not by their actual ability.

+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **Key Insight**                                                                                                                                                           |
|                                                                                                                                                                           |
| The resume isn\'t bad --- it\'s just not optimised for how hiring actually works today. Candidates apply to 100 jobs and hear nothing back because a robot said no first. |
+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

**2.2 What Goes Wrong**

-   Resumes lack ATS-required keywords even when the candidate has the relevant skills

-   Formatting issues --- multi-column layouts, tables, graphics, icons --- cause parsing failures

-   Bullet points use weak passive language (\'Responsible for\...\') instead of impact-driven action verbs

-   Achievements stated without quantifiable metrics or measurable proof

-   Candidates may have all required skills but a poorly formatted or weak-presentation resume

-   Candidates apply for roles they are over- or under-qualified for with no objective guidance

-   No feedback loop --- ATS rejections give zero explanation

**2.3 Market Opportunity**

-   No single platform combines ATS analysis, company-specific selection simulation, and a personalised skill plan

-   Resume tools are a multi-billion dollar global market --- India alone sees 10M+ new graduates annually

-   College placement cells are a high-value B2B channel --- one contract covers thousands of students

**3. Product Goals**

**3.1 Primary Goals**

-   Predict job selection outcome based on resume + target company + job-specific intake inputs

-   Recommend skills and personalised learning plans when the candidate is not selected

-   Improve resumes for candidates who have the skills but weak formatting or poor presentation

-   Deliver professional-grade analysis in under 15 seconds, free of charge

-   Show users exactly how an ATS machine reads their resume --- with real visual proof

**3.2 Secondary Goals**

-   Create a visually engaging, interactive UI that feels like a polished product

-   Provide a single central platform for resume improvement and job preparation

-   Encourage skill-building for higher employability and measurable interview callback improvement

-   Scale through B2B college placement cell partnerships

**3.3 Vision Statement**

To become the most honest, actionable, and intelligent career companion for every job seeker --- bridging the gap between a candidate\'s real potential and how they present on paper.

**4. Target Users & Stakeholders**

  ---------------------------------- ----------------------------------------------- -------------------------------------
  **User Segment**                   **Primary Need**                                **Success Metric**

  **College Students / Interns**     Beat ATS, get first internship or job           Shortlist / interview callback rate

  **Fresh Graduates**                Land first full-time role against competition   Offers received after applying

  **Professionals (1--7 yrs)**       Switch roles or companies with confidence       Offer conversion rate

  **Senior Professionals (7+)**      Target premium roles at specific companies      Reduced time-to-offer

  **College Placement Cells**        Improve campus placement outcomes for batch     Campus placement percentage

  **Hiring Managers / Recruiters**   Screen and rank candidates efficiently (B2B)    Candidate quality score
  ---------------------------------- ----------------------------------------------- -------------------------------------

**5. Core User Flow**

  -------- --------------------------- -------------------------------------------------------------------------------------------------
  **\#**   **Step**                    **Description**

  **1**    Land on Homepage            Clear value prop: \'AI predicts if you\'ll get selected --- and tells you exactly what to fix\'

  **2**    Upload PDF Resume           Drag-and-drop or browse. Accepts PDF. Animated upload indicator.

  **3**    Enter Target Company        Name up to 3 companies --- AI tailors selection prediction and improvement plan per company

  **4**    Answer 5 Intake Questions   Target role, experience level, biggest weakness, job hunt urgency (see Section 9)

  **5**    AI Processing               10--15 second animated screen with live pipeline status messages per stage

  **6**    Results Dashboard           Selection verdict, ATS score, colour-highlighted resume, skill gaps, improvement tips

  **7**    Personalised Plan           AI delivers: Selected / Not Selected + specific next steps and learning roadmap

  **8**    Improve & Re-analyse        User updates resume or learns skills --- re-uploads to track score change over time

  **9**    Download / Export           Export full analysis as PDF or share results link
  -------- --------------------------- -------------------------------------------------------------------------------------------------

**6. Core AI Models**

**6.1 Document Parsing**

Extracts text from PDF resumes while preserving headings, bullets, tables, and layout structure. Handles multi-column resumes, embedded graphics, decorative icons, inconsistent section naming, and non-standard fonts using PyMuPDF and pdfplumber for robust real-world coverage.

+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **Real Challenge**                                                                                                                                                                        |
|                                                                                                                                                                                           |
| Two-column layouts, decorative icons, and text-in-image boxes break basic parsers. The system must handle all common real-world resume formats gracefully without losing structured data. |
+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

**6.2 NLP & Text Understanding**

Analyses sentences to extract implied skills, achievements, and responsibilities. Determines meaning beyond exact keyword matching --- understands that \'Led a team of 5 engineers on a cloud migration\' implies leadership, project management, and cloud skills even without those words explicitly listed.

**6.3 Text Classification**

Categorises resume sections (Contact, Education, Experience, Skills, Projects, Certifications) and tags every line with skill type, proficiency level, and relevance to the target role.

**6.4 Embeddings & Similarity Scoring**

Converts resume content, job description requirements, and company hiring profiles into semantic vectors using Sentence Transformers. Cosine similarity measures selection likelihood, ATS fit, skill gaps, and job match percentages.

**6.5 AI Recommendation Engine (Claude API)**

Generates personalised improvement through two distinct paths:

-   Path A --- Skill gaps found: week-by-week skill-building plan, resource list, milestone roadmap

-   Path B --- Skills present but weak resume: targeted bullet rewrites, section reorganisation, keyword insertion guidance

**7. Feature Specifications**

**F1 --- Resume Upload & Intelligent Parsing**

+--------+------------------------------------------------------------------------------+
| **F1** | **PDF Resume Upload & Structure Extraction**                                 |
|        |                                                                              |
|        | Drag-and-drop interface. Handles full range of real-world resume formatting. |
+--------+------------------------------------------------------------------------------+

The parser extracts and classifies every section. Extracted elements:

-   Contact information --- name, email, phone, LinkedIn, GitHub, location

-   Work experience --- company, role title, tenure, responsibilities, achievements

-   Education --- degree, institution, graduation year, GPA or equivalent

-   Skills --- technical, soft skills, tools, programming languages, spoken languages

-   Projects --- title, description, technologies used, outcomes

-   Certifications, awards, publications, volunteer work

**F2 --- ATS Score Engine**

+--------+-----------------------------------------------------------------------------------------------+
| **F2** | **ATS Compatibility Score (0--100)**                                                          |
|        |                                                                                               |
|        | Composite score across five dimensions. Reflects exactly how a real ATS processes the resume. |
+--------+-----------------------------------------------------------------------------------------------+

  ----------------------- ------------ ----------------------------------------------------------------------------------
  **Sub-Score**           **Weight**   **What It Measures**

  **Keyword Score**       30%          Industry keywords present, natural usage, action verbs at bullet point start

  **Format Score**        25%          Single-column layout, no tables/graphics in body, standard fonts, clear headings

  **Contact Score**       15%          Complete contact info in expected position, professional email, LinkedIn/GitHub

  **Length Score**        15%          Appropriate for experience level: 1 page (fresher), 2 pages (mid/senior)

  **Consistency Score**   15%          Uniform date format, parallel bullet structure, consistent tense throughout
  ----------------------- ------------ ----------------------------------------------------------------------------------

**F3 --- Skill Extraction & Gap Analysis**

+--------+-------------------------------------------------------------------------+
| **F3** | **Explicit + Implicit Skill Extraction & Proficiency Mapping**          |
|        |                                                                         |
|        | Pulls skills directly stated and infers skills from experience context. |
+--------+-------------------------------------------------------------------------+

-   Explicit skills --- directly listed by the candidate (Python, React, SQL, Leadership)

-   Implicit skills --- inferred from context (e.g. \'Built microservices architecture\' implies Docker, DevOps, System Design)

Categories: Technical / Hard Skills, Soft Skills, Tools & Software, Domain Knowledge, Programming Languages, Spoken Languages. Proficiency: Beginner / Intermediate / Expert --- based on frequency, recency, and depth of usage.

**F4 --- Target Company Input & Selection Prediction**

+--------+------------------------------------------------------------------------------------------------------+
| **F4** | **Company-Specific Selection Verdict with Confidence Score**                                         |
|        |                                                                                                      |
|        | User enters up to 3 companies. AI predicts selection likelihood per company with detailed reasoning. |
+--------+------------------------------------------------------------------------------------------------------+

+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **Core Differentiator**                                                                                                                                                          |
|                                                                                                                                                                                  |
| Unlike generic tools, ResumeIQ directly answers what candidates actually want to know: \'Will this specific company select me?\' --- and if not, gives an exact actionable plan. |
+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

  ------------------ ------------------------------------------------------ -------------------------------------------
  **Verdict**        **Meaning**                                            **AI Output**

  **Selected**       Resume is competitive --- proceed to apply             3 fine-tuning tips to push score above 90

  **Borderline**     Close but quickly fixable                              Priority gap list + 2-week quick-fix plan

  **Not Selected**   Significant gaps --- structured improvement required   Full skill roadmap + resume rewrite guide
  ------------------ ------------------------------------------------------ -------------------------------------------

For each verdict: 2 specific reasons, missing skills split into Critical / Nice-to-Have, and resume rewrite suggestions tailored to that company\'s JD language.

**F5 --- Personalised Skill & Learning Plan**

+--------+------------------------------------------------------------------------------------------+
| **F5** | **Skill Gap Learning Roadmap**                                                           |
|        |                                                                                          |
|        | Week-by-week plan to acquire missing skills, calibrated by experience level and urgency. |
+--------+------------------------------------------------------------------------------------------+

**Path A --- Rejected Due to Missing Skills**

-   Lists all critical missing skills with specific learning resources (courses, docs, projects)

-   Week-by-week milestone roadmap --- 2--3 weeks for urgent applicants, 8--12 weeks for planners

-   Shows impact of each skill: \'Adding Docker moves your score from 54 to 71\'

-   Re-analysis trigger --- re-upload updated resume to track progress

**Path B --- Has Skills but Weak Resume Presentation**

-   Actionable bullet point rewrites with before/after examples --- no learning plan needed

-   Section reorganisation guidance and keyword insertion recommendations

-   Resume rewrite tailored to each target company\'s JD language

**F6 --- AI-Powered Improvement Tips**

+--------+--------------------------------------------------------------------------------------------------------------+
| **F6** | **Specific, Actionable Resume Tips (Claude API)**                                                            |
|        |                                                                                                              |
|        | Targeted suggestions with before/after examples. Never generic. Focused on self-identified weakness from Q4. |
+--------+--------------------------------------------------------------------------------------------------------------+

  -------------------------- ----------------------------------------------------------------------------------------------------------------------------
  **Tip Category**           **Example Output**

  **Weak bullet points**     \'Responsible for managing social media\' → \'Grew Instagram following 40% in 6 months through targeted content strategy\'

  **Missing keywords**       \'For a Software Engineer role, your resume is missing: system design, CI/CD, agile --- these appear in 80% of JDs\'

  **Quantification gaps**    AI flags vague claims: \'This bullet needs metrics --- how many users? what % improvement? what revenue impact?\'

  **Section gaps**           \'No Projects section found. For a fresher in tech, this is critical to demonstrate practical ability.\'

  **Action verb weakness**   \'12 bullets start with Responsible for. Replace with: Led, Built, Designed, Delivered, Optimised\'

  **Length mismatch**        \'3 pages for 2 years of experience. Condense to 1 page --- remove pre-college content.\'
  -------------------------- ----------------------------------------------------------------------------------------------------------------------------

**F7 --- Visual Highlight Engine (Wow Feature)**

+--------+-----------------------------------------------------------------------------------------------------------------+
| **F7** | **Colour-Coded Interactive Resume Overlay**                                                                     |
|        |                                                                                                                 |
|        | Resume displayed on-screen with interactive colour highlights. Hover any section for a specific contextual fix. |
+--------+-----------------------------------------------------------------------------------------------------------------+

The most visually impactful feature. Users see their own resume colour-coded in real time --- feedback is immediate, personal, and impossible to ignore.

  ------------ --------------- --------------------------------------------------------------------------------
  **Colour**   **Signal**      **Meaning**

  **Green**    **Strong**      Well-written, keyword-rich, quantified achievements --- no action needed

  **Yellow**   **Average**     Present but improvable --- missing metrics, keywords, or stronger action verbs

  **Red**      **Weak**        Vague language, formatting issues, missing keywords, or empty sections
  ------------ --------------- --------------------------------------------------------------------------------

-   Hover interaction --- tooltip shows the specific problem and the improved version

-   Instant preview --- user sees suggested replacement inline before applying it

**F8 --- Job Match & Score Dashboard**

+--------+-----------------------------------------------------------------------------------------------------------+
| **F8** | **Embedding-Based Job Role Matching + Progress Tracking**                                                 |
|        |                                                                                                           |
|        | Suggests top 5 matching roles. Visual dashboard with scores, skill gaps, and progress tracking over time. |
+--------+-----------------------------------------------------------------------------------------------------------+

-   Overall match percentage per suggested role

-   Skills the user has vs. skills still needed for each role

-   Competitiveness against average candidate profile --- \'You rank in the top 30% for this role\'

-   Visual dashboard: selection likelihood, ATS score, skill gaps, resume strengths and weaknesses

-   Progress tracking --- all scores update as user improves resume or learns new skills

**F9 --- Job Description Matcher (Bonus Feature)**

+--------+-----------------------------------------------------------------------------------------------------------+
| **F9** | **JD-Specific Match Analysis**                                                                            |
|        |                                                                                                           |
|        | User pastes a specific job description. AI compares resume against JD and returns a targeted match score. |
+--------+-----------------------------------------------------------------------------------------------------------+

-   Extracts all requirements and keywords from the pasted JD

-   Generates a match score specifically for that job posting

-   Lists keywords present in JD but absent from resume

-   Rewrites 3 bullet points to better align with JD language

-   Tells user: \'Add these 5 keywords naturally to move from 58% to 85% match\'

**8. AI Processing Flow**

The full pipeline runs automatically after resume upload and intake submission:

  -------- ---------------------- -------------------------------------------------------------------------------------------------
  **\#**   **Stage**              **What Happens**

  **1**    Document Parser        PyMuPDF / pdfplumber extracts raw text --- handles multi-column, tables, icons, complex layouts

  **2**    NLP Structuring        Segments text into classified resume sections

  **3**    Text Classification    Tags every element: section type, skill category, relevance, action verb usage

  **4**    Skill Extractor        Pulls explicit skills (listed) and implicit skills (inferred from descriptions)

  **5**    Embedding Engine       Sentence Transformers convert resume + job profiles into semantic vectors

  **6**    Similarity Scoring     Cosine similarity calculates ATS sub-scores, job match %, and company fit gap

  **7**    Selection Prediction   Confidence-scored verdict (Selected / Borderline / Not Selected) per company

  **8**    Claude API             Generates tips, plan, or resume rewrite --- output in structured JSON

  **9**    Highlight Engine       Maps AI feedback (GREEN / YELLOW / RED) back to specific resume sections

  **10**   Dashboard Assembly     TypeScript backend aggregates all results and serves to frontend via REST API
  -------- ---------------------- -------------------------------------------------------------------------------------------------

**9. Onboarding Questionnaire --- User Intake Flow**

After uploading their resume, users answer 5 targeted questions. These personalise every aspect of the analysis --- ATS scoring, company-specific verdicts, skill gap depth, and learning plan timeline. Presented as an animated step-by-step intake form before processing begins.

+--------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **Q1** | **What role are you applying for?**                                                                                                                                                                                                                                                                                                                                                                      |
|        |                                                                                                                                                                                                                                                                                                                                                                                                          |
|        | **UI:** Dropdown --- 24 roles from Kaggle job dataset. IT (Software Engineer, Data Scientist, ML Engineer, DevOps, QA, UI/UX Designer, Product Manager), Finance (Analyst, Accountant, Investment Banker), HR (Recruiter, HR Manager), Healthcare (Doctor, Nurse, Pharmacist), Marketing (Digital Marketer, Content Strategist, SEO Specialist), Sales, Operations, Legal, Education, Other (free-text). |
|        |                                                                                                                                                                                                                                                                                                                                                                                                          |
|        | **AI Impact:** Calibrates keyword scoring, skill gap thresholds, and ATS keyword lists to the specific role\'s requirements. Enables role-specific evaluation.                                                                                                                                                                                                                                           |
+--------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

+--------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **Q2** | **Name 3 companies you most want to work at.**                                                                                                                                      |
|        |                                                                                                                                                                                     |
|        | **UI:** 3 text input fields with autocomplete (popular companies pre-loaded). Optional --- users who skip receive generic role-based analysis.                                      |
|        |                                                                                                                                                                                     |
|        | **AI Impact:** AI returns 3 separate verdicts, each weighted toward that company\'s known hiring patterns, tech stack, and JD language. Users receive 3 company-specific gap lists. |
+--------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

+--------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **Q3** | **How many years of experience do you have?**                                                                                                                                                                  |
|        |                                                                                                                                                                                                                |
|        | **UI:** 4-option radio card: Fresher (0 yrs) / Junior (1--3 yrs) / Mid-Level (3--7 yrs) / Senior (7+ yrs).                                                                                                     |
|        |                                                                                                                                                                                                                |
|        | **AI Impact:** Sets resume length benchmark (1 page for freshers, 2 pages for mid/senior), adjusts ATS rubric, and calibrates learning plan timeline --- fresher plans are longer, senior plans more targeted. |
+--------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

+--------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **Q4** | **What do you feel is the weakest part of your resume?**                                                                                                                                                                          |
|        |                                                                                                                                                                                                                                   |
|        | **UI:** Multi-select pill/chip buttons: Skills (missing or outdated) / Experience (limited or irrelevant) / Format (layout and structure) / Achievements (no numbers or impact) / All of it.                                      |
|        |                                                                                                                                                                                                                                   |
|        | **AI Impact:** Directs the highlight engine and improvement tips to the user\'s self-identified pain point first. If \'Achievements\' selected, quantification gaps surface at the top. If \'Format\', format scoring runs first. |
+--------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

+--------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **Q5** | **How urgently are you job hunting?**                                                                                                                                                                    |
|        |                                                                                                                                                                                                          |
|        | **UI:** 3-option toggle: Actively applying now / Exploring options / Planning ahead (3+ months).                                                                                                         |
|        |                                                                                                                                                                                                          |
|        | **AI Impact:** \'Actively applying\' users get a 2--3 week quick-win fix list. \'Planning ahead\' users get a full 8--12 week skill-building roadmap with project suggestions and milestone checkpoints. |
+--------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

**10. Personalised Outcome Plan**

**10.1 The Core Differentiator**

After analysis, every user receives a direct, personalised verdict based on their resume and stated target company. Two distinct output paths:

+---------------------------------------------------------------------------------------------------------------------+
| **Selected**                                                                                                        |
|                                                                                                                     |
| Your resume is competitive for \[Target Company\]. ATS score is 82/100. Here are 3 optimisations to push it to 90+. |
+---------------------------------------------------------------------------------------------------------------------+

+------------------------------------------------------------------------------------------------------------------------------------------------+
| **Not Selected --- Here\'s Your Plan**                                                                                                         |
|                                                                                                                                                |
| Your resume scores 51/100. You\'re missing: System Design, CI/CD, Go language. Here is your 8-week learning plan to close the gap and reapply. |
+------------------------------------------------------------------------------------------------------------------------------------------------+

**10.2 Learning Plan Components**

-   Skill gap list --- specific skills required vs. skills currently present

-   Recommended learning resources --- courses, documentation, project ideas per skill

-   Estimated timeline --- weekly milestones to acquire each skill, calibrated by urgency

-   Resume rewrite guide --- how to demonstrate new skills once learned

-   Re-analysis trigger --- re-upload updated resume to track progress and score change

**11. Final Claude API Prompt Template**

Complete structured prompt sent to Claude API after parsing and intake collection. All bracketed values are dynamically injected at runtime.

+-----------------------------------------------------------------------------------------+
| // SYSTEM PROMPT                                                                        |
|                                                                                         |
| You are ResumeIQ, an expert AI career coach and ATS specialist. Analyse the             |
|                                                                                         |
| resume and give the candidate honest, specific, and actionable feedback.                |
|                                                                                         |
| Evaluate based on how real Applicant Tracking Systems work --- not general advice.      |
|                                                                                         |
| Always be direct. Every suggestion must reference something specific in the resume.     |
|                                                                                         |
| // USER PROMPT --- dynamically assembled                                                |
|                                                                                         |
| \## RESUME CONTENT                                                                      |
|                                                                                         |
| {parsed_resume_text}                                                                    |
|                                                                                         |
| \## CANDIDATE PROFILE                                                                   |
|                                                                                         |
| \- Target Role: {q1_target_role}                                                        |
|                                                                                         |
| \- Target Companies: {q2_company_1}, {q2_company_2}, {q2_company_3}                     |
|                                                                                         |
| \- Experience Level: {q3_experience_level}                                              |
|                                                                                         |
| \- Self-Identified Weakness: {q4_weakness}                                              |
|                                                                                         |
| \- Job Hunt Urgency: {q5_timeline}                                                      |
|                                                                                         |
| \## YOUR TASKS                                                                          |
|                                                                                         |
| 1\. ATS_SCORE: Overall 0-100 + sub-scores (Keyword/Format/Contact/Length/Consistency).  |
|                                                                                         |
| Justify each with a specific observation from the resume.                               |
|                                                                                         |
| 2\. VERDICT: Selected / Borderline / Not Selected per company + 2 reasons each.         |
|                                                                                         |
| Include confidence score (%) and 2-3 sentence reasoning.                                |
|                                                                                         |
| 3\. SKILL_GAPS: Skills required for {q1_target_role} missing from resume.               |
|                                                                                         |
| Split into: Critical Missing / Nice to Have.                                            |
|                                                                                         |
| 4\. IMPROVEMENT_TIPS: Exactly 5 tips. For each: quote weak line, show improved version. |
|                                                                                         |
| Focus on {q4_weakness} first.                                                           |
|                                                                                         |
| 5\. LEARNING_PLAN: Week-by-week roadmap calibrated to {q5_timeline}.                    |
|                                                                                         |
| If urgent: 2-3 weeks quick wins. If planning: 8-12 week roadmap with projects.          |
|                                                                                         |
| 6\. HIGHLIGHT_MAP: GREEN / YELLOW / RED per resume section + one-sentence reason.       |
|                                                                                         |
| \## OUTPUT FORMAT                                                                       |
|                                                                                         |
| Valid JSON only. Keys: ats_score, sub_scores, verdict, skill_gaps,                      |
|                                                                                         |
| improvement_tips, learning_plan, highlight_map. No preamble. No markdown fences.        |
+-----------------------------------------------------------------------------------------+

**12. Technical Architecture**

**12.1 Technology Stack**

  ----------------------- ----------------------------------------------------------------------------------
  **Backend**             TypeScript --- REST API, business logic, session management, orchestration layer

  **AI / ML**             Python --- PDF parsing, NLP, embeddings, classification, selection prediction

  **LLM**                 Claude API (claude-sonnet-4-6) --- tips, verdicts, learning plans, rewrites

  **PDF Processing**      PyMuPDF + pdfplumber --- robust handling of complex real-world PDF layouts

  **Embeddings**          Sentence Transformers (all-MiniLM-L6-v2) --- semantic similarity

  **Vector Similarity**   Cosine similarity for ATS scoring, selection prediction, job matching

  **Frontend**            HTML, CSS, JavaScript, Tailwind CSS --- colour highlights, charts, dashboards

  **Database (SQL)**      PostgreSQL --- Users, Resumes, Jobs, Skills, AnalysisResults, Companies

  **Database (NoSQL)**    MongoDB --- resume blobs, parsed JSON, session state, unstructured outputs

  **Deployment**          Cloud-hosted REST API + static frontend CDN
  ----------------------- ----------------------------------------------------------------------------------

**12.2 API Endpoints**

  -------------------------- ------------ -----------------------------------------------------
  **Endpoint**               **Method**   **Description**

  **/uploadResume**          POST         Upload PDF resume and trigger full parsing pipeline

  **/submitQuestions**       POST         Submit 5 intake questionnaire answers

  **/analysis/:resumeId**    GET          Retrieve full analysis results for a resume ID

  **/improveResume**         POST         Request targeted resume improvement via Claude API

  **/skillPlan/:userId**     GET          Retrieve personalised learning plan for a user

  **/matchJD**               POST         Compare resume against a pasted job description

  **/reanalyse/:resumeId**   POST         Trigger re-analysis after user updates their resume
  -------------------------- ------------ -----------------------------------------------------

**13. UI / UX Requirements**

**13.1 Design Principles**

+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **Design Mandate**                                                                                                                                                                                      |
|                                                                                                                                                                                                         |
| The UI must be user-interactive, creative, and visually engaging --- not a simple or generic layout. Every interaction should feel purposeful and polished. This is not a form --- it is an experience. |
+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

-   Dark/light mode with a modern, professional aesthetic --- Tailwind CSS throughout

-   Animated upload experience --- drag-and-drop with real-time progress indicator

-   Animated processing screen --- 10--15 seconds with live status messages per pipeline stage

-   Split-panel dashboard: colour-highlighted resume on left, analysis panel on right

-   Tabbed navigation: Skills / Score Breakdown / Tips / Job Matches / Company Verdict / Your Plan

-   Interactive highlights: hover any section → tooltip with specific contextual fix

-   Smooth micro-animations on tab switches, score counter fills, card reveals

-   Desktop and mobile responsive across all breakpoints (320px to 2560px)

**13.2 Key UI Components**

-   Circular ATS score gauge with animated fill --- prominently above the fold

-   Skill radar chart --- visual strength map across 6 skill categories

-   Company verdict cards --- 3 cards with Selected / Borderline / Not Selected badges + confidence %

-   Job match cards --- top 5 roles with percentage match bars

-   Learning plan timeline --- week-by-week roadmap with collapsible milestone details

-   Progress tracker --- scores update over multiple re-analysis sessions

-   One-click PDF export of the full analysis report

**14. Functional Requirements**

-   Accept PDF resume upload via drag-and-drop and browser file picker

-   Accept target company input (up to 3) and 5 intake questions

-   Run full 10-stage AI pipeline and return complete results within 15 seconds

-   Predict selection outcome per company with confidence score and 2-reason explanation

-   Generate skill gap analysis split into Critical Missing / Nice-to-Have

-   Provide personalised learning plan calibrated to urgency level (Q5)

-   Provide resume improvement guidance with before/after examples calibrated to Q4

-   Display interactive colour-coded resume overlay with hover tooltips

-   Show job match scores for top 5 compatible roles

-   Support JD-paste feature for targeted job posting comparison

-   Allow re-analysis after resume update to track score improvement over time

-   Export full analysis report as downloadable PDF

**15. Non-Functional Requirements**

  --------------------- ------------------------------------------------------------------------------
  **Performance**       Full analysis completes in under 15 seconds for any PDF resume

  **Scalability**       Supports multiple simultaneous users --- 1,000+ concurrent analyses per hour

  **Security**          Resume and user data encrypted at rest (AES-256) and in transit (TLS 1.3)

  **Privacy**           Resume files deleted after 30 days unless user opts in to storage

  **Availability**      99.5% uptime SLA for production deployment

  **Accuracy**          ATS prediction: \>85% correlation vs. real ATS outcomes on test dataset

  **Usability**         Creative, interactive, intuitive UI --- task completion \>90% in UAT

  **Compatibility**     Desktop and mobile --- Chrome, Firefox, Safari, Edge (latest 2 versions)

  **Accessibility**     WCAG 2.1 AA compliance for all frontend components
  --------------------- ------------------------------------------------------------------------------

**16. Success Metrics**

  ---------------------------------------- -------------------- ------------------------------------
  **KPI**                                  **Target**           **How Measured**

  **Number of resumes analysed**           10,000 --- Month 1   Platform analytics

  **ATS score accuracy vs. real ATS**      \>85% correlation    A/B on known ATS outcomes

  **Selection prediction accuracy**        \>80%                Verified against actual outcomes

  **Analysis completion rate**             \>90%                Uploads reaching results dashboard

  **Time to results (p95)**                \<15 seconds         Server-side pipeline timing

  **Resume improvement adoption rate**     \>60%                Users who re-upload after tips

  **Skill-learning plan engagement**       \>50%                Users who open learning plan

  **Free-to-Pro conversion**               \>8%                 Payment analytics

  **Monthly Active Users --- Month 6**     10,000 MAU           Platform analytics

  **Interview callback improvement**       Measurable uplift    30-day post-use survey

  **B2B college contracts --- Month 12**   5 institutions       Sales pipeline tracking
  ---------------------------------------- -------------------- ------------------------------------

**17. Business Model**

  ------------------------ ----------------------------------------------------------------------------------
  **Free Tier**            2 resume analyses per month --- full feature set included

  **Pro --- ₹299/month**   Unlimited analyses + JD matching + company insights + progress tracking

  **Pay Per Use**          ₹49 per detailed analysis --- no subscription required

  **B2B --- Colleges**     ₹10,000/month per institution --- placement cells offer ResumeIQ to all students

  **B2B --- Recruiters**   White-label API to screen and rank candidate resumes at scale

  **Enterprise**           Custom pricing --- bulk analysis, HR analytics dashboard, branded experience
  ------------------------ ----------------------------------------------------------------------------------

**18. Future Enhancements**

**Version 2.0**

-   Auto resume builder --- build an ATS-optimised resume from scratch within the platform

-   LinkedIn profile analysis and optimisation

-   Cover letter generator tailored to specific company and role

-   Progress tracking across multiple job applications over time

**Version 3.0**

-   In-app resume editor with live ATS preview as user types

-   Interview preparation module --- company-specific question bank

-   Personalised career roadmap spanning 6--12 months

**B2B Version 2.0**

-   Real-time recruiter screening dashboard with candidate ranking

-   HR analytics --- aggregate skill gap insights across student batches

**19. Out of Scope --- v1.0**

-   Auto resume builder --- v2

-   LinkedIn profile integration --- v2

-   Cover letter generation --- v2

-   Interview preparation module --- v3

-   In-app resume builder / editor --- v3

-   Real-time recruiter dashboard --- B2B v2

-   Multilingual resume support

+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **Why ResumeIQ Wins**                                                                                                                                                                                                                                                                                                                                               |
|                                                                                                                                                                                                                                                                                                                                                                     |
| Every student and job seeker has this problem personally. The selection verdict directly answers what they actually want to know. The colour-highlighted resume is a memorable 10-second demo. Four AI models in one pipeline demonstrates real technical depth. The product delivers measurable, visual, genuinely useful outcomes --- not just a chatbot wrapper. |
+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

*PROJECT_AI_RESUME_ANALYZER --- PRD Final --- Consolidated from All Sources*
