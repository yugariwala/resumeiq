**BUSINESS REQUIREMENTS DOCUMENT**

**PROJECT_AI_RESUME_ANALYZER**

ResumeIQ --- AI-Powered Resume Analyser & Career Coach

Version 1.0 \| March 2026

**CONFIDENTIAL**

**1. Document Control**

  -------------------- ---------------------------------------------------------------
  **Document Title**   Business Requirements Document --- PROJECT_AI_RESUME_ANALYZER

  -------------------- ---------------------------------------------------------------

  ------------------- --------------------------------------------------------
  **Project Name**    ResumeIQ --- AI-Powered Resume Analyser & Career Coach

  ------------------- --------------------------------------------------------

  ------------------- ---------------------------------------------------
  **Version**         1.0 --- Initial Release

  ------------------- ---------------------------------------------------

  ------------------- ---------------------------------------------------
  **Date**            March 2026

  ------------------- ---------------------------------------------------

  ------------------- ---------------------------------------------------
  **Status**          Draft for Review

  ------------------- ---------------------------------------------------

  ------------------- ---------------------------------------------------
  **Prepared By**     \[Your Name / Team\]

  ------------------- ---------------------------------------------------

  ------------------- ---------------------------------------------------
  **Reviewed By**     \[Stakeholders / Mentor / Manager\]

  ------------------- ---------------------------------------------------

  ------------------- ---------------------------------------------------
  **Approved By**     \[Authorised Signatory\]

  ------------------- ---------------------------------------------------

  ------------------- ---------------------------------------------------
  **Owner**           Product Team --- ResumeIQ

  ------------------- ---------------------------------------------------

  ------------------- -------------------------------------------------------------------------------------------------
  **Audience**        Product Managers, Engineering Leads, UI/UX Designers, AI/ML Team, QA, B2B Clients, Stakeholders

  ------------------- -------------------------------------------------------------------------------------------------

**2. Table of Contents**

1\. Document Control

2\. Table of Contents

3\. Executive Summary

4\. Business Objectives

5\. Problem Statement

6\. Product Vision & One-Line Pitch

7\. Stakeholders

8\. Target Users & Personas

9\. Scope of Work

10\. Functional Requirements

10.1 User Inputs & Contextual Questionnaire

10.2 Resume Upload & Parsing

10.3 ATS Score Engine

10.4 Skill Extraction & Mapping

10.5 AI Selection Prediction (Core Feature)

10.6 Personalised Learning Plan

10.7 Resume Improvement Engine

10.8 Visual Highlight System

10.9 Job Description Matcher

10.10 Results Dashboard & Report Export

11\. AI Models & Technology Stack

12\. Non-Functional Requirements

13\. Business Rules

14\. User Journey

15\. Priority Feature Matrix

16\. Business Model & Monetisation

17\. Success Metrics & KPIs

18\. Risks & Mitigations

19\. Assumptions & Dependencies

20\. Constraints

21\. Glossary

**3. Executive Summary**

ResumeIQ is an AI-powered web platform that transforms the job application experience by giving candidates complete, actionable visibility into how their resume is evaluated --- by automated systems and by humans. In today\'s hiring landscape, 95% of large companies use Applicant Tracking Systems (ATS) to filter resumes before any human reviews them. The vast majority of candidates are unaware of this automated layer, causing qualified individuals to be systematically rejected not because of their capabilities, but because of how their resume is structured and written.

ResumeIQ solves this problem end-to-end. The user uploads their resume, specifies their target company and role, and completes a short contextual questionnaire. The platform\'s AI engine analyses the resume, computes an ATS compatibility score, extracts explicit and implicit skills, predicts selection likelihood for the target company and role, and --- critically --- delivers a personalised action plan covering which skills to acquire, in what order, with time estimates and resources attached.

Unlike generic resume checkers or isolated ATS tools, ResumeIQ acts as a complete AI career coach. It diagnoses both the document (resume quality, formatting, keyword alignment) and the person (skill gaps, experience gaps, readiness level), and then produces a tailored path forward with one uniquely important distinction: it tells the user whether their problem is a resume presentation issue or a genuine skill gap --- because the fix for each is completely different.

The platform serves students, fresh graduates, working professionals, and career-switchers across all industries, with a freemium B2C model and a B2B channel targeting college placement cells and corporate HR departments.

**4. Business Objectives**

**4.1 Primary Objectives**

-   Enable any job seeker to understand, in under 60 seconds, whether their resume is likely to pass ATS screening for a specific target company and role.

-   Deliver a precise, personalised gap analysis identifying exactly which skills are missing for the target role.

-   Generate a structured, time-bound learning roadmap --- not generic advice --- ordered by impact priority.

-   Provide specific, actionable resume rewriting guidance so users can improve without needing external consultants.

-   Clearly differentiate resume-quality issues from genuine skill-gap issues so users address the right problem.

-   Offer predictive feedback on selection probability, giving candidates an objective view of their competitiveness.

**4.2 Secondary Objectives**

-   Build a scalable B2C product with a freemium model generating recurring subscription revenue.

-   Establish a B2B channel selling to college placement cells and corporate HR departments.

-   Create a data asset from anonymised resume and outcome data to continuously improve AI model accuracy.

-   Position ResumeIQ as a trusted brand in career development for the Indian and global market.

-   Deliver a highly interactive, visually impressive frontend that drives word-of-mouth sharing.

**5. Problem Statement**

**5.1 The Core Problem**

The modern hiring process has a fundamental transparency gap. Companies deploy ATS software that automatically screens and rejects resumes based on keyword matching, formatting compliance, and structural rules. Candidates have no visibility into this automated layer. They apply, receive silence, and cannot diagnose why --- so they keep reapplying with the same ineffective resume.

This creates three compounding problems:

-   Qualified candidates are rejected because of poor formatting or missing keywords, not lack of competence.

-   Candidates cannot distinguish whether rejection is due to skill gaps or resume presentation issues, so they cannot fix the right thing.

-   Candidates waste months in an application loop, losing confidence and momentum.

**5.2 The Gap in Existing Solutions**

-   Generic resume builders create visually appealing resumes but do not assess ATS compatibility or job-specific keyword alignment.

-   Existing ATS checkers (e.g., Jobscan, Resume Worded) provide a score but do not predict selection for a specific company, nor do they produce a skill development plan.

-   Career coaching is expensive, inaccessible, and not scalable for the student and entry-level segment.

-   No existing platform combines ATS analysis + selection prediction + skill gap detection + personalised learning plan in a single unified flow.

-   Users who have the right skills but a weak resume receive the same generic advice as users who are genuinely under-qualified --- no tool makes this critical distinction today.

**5.3 The Opportunity**

There are over 200 million active job seekers across India at any given time. Globally, resume optimisation is a multi-billion dollar market. The convergence of large language models, embedding-based semantic search, and accessible AI APIs makes it now possible to automate what previously required a human career coach --- at a cost structure that supports a free or near-free user tier.

**6. Product Vision & One-Line Pitch**

**6.1 Vision Statement**

ResumeIQ\'s vision is to make professional career guidance universally accessible --- to democratise the knowledge that today only reaches candidates who can afford coaches or attend elite institutions. Every person who uploads their resume should leave with absolute clarity: where they stand, why, and exactly what to do next.

**6.2 One-Line Pitch**

> *\"95% of resumes never reach a human --- they\'re rejected by a robot. ResumeIQ shows you exactly what the robot sees, whether you\'ll be selected, and gives you a step-by-step plan to change the outcome.\"*

**7. Stakeholders**

  -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Stakeholder**                         **Role**                       **Responsibilities**
  --------------------------------------- ------------------------------ ------------------------------------------------------------------------------------------------------------
  Product Owner                           Project oversight              Define vision, approve requirements, prioritise features, sign off on releases

  Users (Job Seekers)                     Primary end-users              Upload resumes, input target companies & roles, complete questionnaire, receive AI feedback

  Development Team                        Backend & Frontend engineers   Implement AI pipeline, database, REST APIs, UI/UX --- TypeScript backend, Python AI layer, modern frontend

  AI / ML Team                            Data & model specialists       Document parsing, NLP, embeddings, classification, selection prediction model development and fine-tuning

  QA Team                                 Quality assurance              Validate functionality, AI prediction accuracy, ATS score benchmarking, UI/UX regression, security testing

  College Placement Cells / B2B Clients   Institutional clients          Provide platform access to students in bulk; leverage aggregate analytics dashboard for placement tracking

  Corporate HR Departments                Enterprise clients             Bulk candidate screening, API integration, candidate benchmarking against role requirements
  -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**8. Target Users & Personas**

  -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Persona**                 **Profile**                                                       **Key Pain Point**                                                                   **Core Need**
  --------------------------- ----------------------------------------------------------------- ------------------------------------------------------------------------------------ ------------------------------------------------------------------------------------
  The Fresh Graduate          22--24 yrs, just finished degree, no full-time experience         Does not know why applications go unanswered. Feels unqualified.                     Understand which skills to build + how to present existing experience effectively

  The Career Switcher         27--35 yrs, switching industry or role type                       Unsure if existing skills transfer. Doesn\'t know how to frame them for new roles.   Skill gap analysis + reframing guidance for the new target role

  The Mass Applier            Any age, sending 50--100 applications with zero callbacks         Resume is weak but doesn\'t know how or why. No feedback loop exists.                Clear diagnosis: resume problem or skill gap? Then specific, targeted fixes.

  The Strong Candidate        Skilled professional, solid experience, not getting through ATS   Great background but poor ATS formatting makes them invisible to systems.            Resume rewrite guidance, keyword injection, format compliance fix.

  The Student Pre-Placement   3rd/4th year engineering or MBA student                           Campus placement approaching. Resume is generic and thin.                            Targeted resume for specific dream companies + skill roadmap for remaining months.
  -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**9. Scope of Work**

**9.1 In Scope --- Version 1.0**

-   Resume upload and AI-based text extraction (PDF and DOCX formats)

-   User inputs: target company, target role, experience level, weakest resume area, placement timeline

-   Contextual questionnaire (5--7 questions on skills, experience, timeline)

-   ATS score calculation with five weighted sub-scores (keyword, format, contact, length, consistency)

-   Skill extraction --- explicit and implicit --- with proficiency level inference

-   Top 5 job match suggestions based on embedding similarity

-   AI Selection Prediction: Selected / Not Selected verdict with confidence score and reasoning

-   Issue categorisation: Resume Issues (Category A) vs. Skill Gaps (Category B)

-   Personalised learning plan for Category B gaps --- ordered, time-estimated, resource-linked

-   Resume improvement tips --- specific, actionable, section-by-section (not generic)

-   Visual highlight system --- colour-coded resume view (Green / Yellow / Red) with hover tooltips

-   Job Description Matcher --- paste any JD for specific keyword-gap and match score analysis

-   Results dashboard with downloadable PDF analysis report

-   Interactive, creative UI/UX using HTML, CSS, JS, TailwindCSS --- responsive for desktop and mobile

**9.2 Out of Scope --- Version 1.0**

-   Direct job application submission --- ResumeIQ is not a job board

-   Video interview coaching or mock interview functionality

-   LinkedIn profile optimisation

-   Native mobile application (web-responsive only in V1)

-   Integration with ATS platforms (Workday, Greenhouse, Lever)

-   Employer-side interface or HR-facing hiring tools

-   Offline resume analysis

-   Job board API integrations (planned for V2)

**10. Functional Requirements**

**10.1 User Inputs & Contextual Questionnaire**

Before analysis begins, the system shall collect the following structured inputs from the user:

  -----------------------------------------------------------------------------------------------------------------------------------------------------
  **Input Field**                       **Details**
  ------------------------------------- ---------------------------------------------------------------------------------------------------------------
  Resume Upload                         PDF or DOCX format; maximum file size 5 MB

  Target Job Role                       Dropdown selection from 24+ predefined roles across IT, HR, Healthcare, Finance, Marketing, Engineering, etc.

  Target Companies                      Free-text input for up to 3 preferred companies; used to tailor keyword and standard benchmarking

  Experience Level                      Fresher / 1--3 years / 3--7 years / 7+ years

  Weakest Resume Area (Self-assessed)   Skills / Experience / Format / Achievements / All --- used to weight analysis outputs

  Placement Timeline                    Actively applying now / Exploring options / Planning for 3+ months --- used to prioritise the learning plan

  Job Description (Optional)            User may paste a specific JD from any job posting for targeted match analysis
  -----------------------------------------------------------------------------------------------------------------------------------------------------

**10.2 Resume Upload & Parsing**

The system shall accept resume uploads in PDF and DOCX formats. It shall extract all text while preserving the document\'s structural hierarchy --- distinguishing headings, bullet points, contact information, dates, and section boundaries.

**Data Extracted:**

-   Contact information: name, email, phone, LinkedIn URL, GitHub URL, location

-   Work experience: company name, job title, duration (start and end dates), responsibilities and achievements

-   Education: degree, institution, graduation year, GPA (if present)

-   Skills: technical, soft, tools, programming languages, spoken languages

-   Projects: title, description, technologies used, outcomes

-   Certifications and achievements

**Business Rules:**

-   Two-column layouts, tables, and graphics in resumes must be handled without data loss.

-   Section headers must be normalised --- \'Work History\', \'Experience\', \'Professional Experience\' all resolve to the same internal category.

-   Users with incomplete contact information shall receive a warning prior to ATS scoring commencing.

-   Maximum file size: 5 MB. Supported formats: PDF and DOCX in V1.

**10.3 ATS Score Engine**

The system shall calculate an overall ATS compatibility score out of 100, composed of five weighted sub-scores displayed individually with plain-language explanations.

  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Sub-Score**       **What Is Measured**                                                                                                                                **Weightage**
  ------------------- --------------------------------------------------------------------------------------------------------------------------------------------------- ------------------
  Keyword Score       Presence and natural density of industry-relevant keywords; action verbs at bullet-point starts; absence of keyword stuffing                        35%

  Format Score        Single-column layout compliance; absence of tables, graphics, or text boxes that break ATS parsers; standard fonts; recognisable section headings   25%

  Contact Score       Complete contact block in standard position; professional email address; LinkedIn presence for relevant roles                                       10%

  Length Score        Resume length appropriate to experience level: 1 page for 0--2 years; 2 pages for 3+ years                                                          15%

  Consistency Score   Uniform date formatting throughout; parallel bullet-point structure; consistent verb tense across all sections                                      15%
  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Target accuracy: ATS sub-scores shall be within ±8 points of industry-standard ATS tools in benchmark testing.

**10.4 Skill Extraction & Mapping**

The system shall extract all skills from the resume --- both explicitly stated and implicitly inferred from experience descriptions --- and classify them into five categories with proficiency inference.

-   Technical / Hard Skills (e.g., Python, SQL, Machine Learning, Cloud Architecture)

-   Soft Skills (e.g., Leadership, Communication, Problem Solving, Stakeholder Management)

-   Tools & Software (e.g., Figma, JIRA, Salesforce, Docker)

-   Domain Knowledge (e.g., Financial Modelling, Supply Chain, Digital Marketing, DevOps)

-   Languages --- programming and spoken

Proficiency inference (Beginner / Intermediate / Expert) is based on frequency of skill mention and depth of context. For example, a single mention of \'Python\' in a tools list is Beginner; \'Built and deployed 3 ML models using Python and scikit-learn\' is Expert. Output shall be a visual skill map with gap indicators.

**10.5 AI Selection Prediction --- Core Feature**

This is ResumeIQ\'s primary differentiator. After receiving all inputs, the system shall produce a selection likelihood verdict for the specified target company and role.

**Inputs to the Prediction Model:**

-   Parsed resume content --- skills, experience depth, education, projects

-   Target company name and target job role / designation

-   User\'s self-reported skills and years of experience from questionnaire

-   User\'s stated placement timeline

-   ATS score and sub-scores

**Outputs:**

-   Verdict: Selected / Not Selected with a confidence score (e.g., 72% likely to be selected)

-   Reasoning breakdown --- which specific factors drove the verdict

-   Primary issue categorisation (mandatory, not optional):

    -   Category A --- Resume Issues: candidate has the skills but the resume does not reflect them effectively

    -   Category B --- Skill Gaps: candidate genuinely lacks required skills for this role and company

This distinction is the most important output of the system. Category A requires resume fixes only. Category B requires skill development. Conflating the two is the most common and costly mistake candidates make. The system must never present both categories as equally weighted without clear prioritisation.

All prediction outputs must be labelled as AI-generated estimates and positioned as guidance, not guarantees of any hiring outcome.

**10.6 Personalised Learning Plan**

For users with Category B gaps, the system shall generate a structured, ordered, time-bound learning roadmap --- not a generic list of suggestions.

**Plan Structure:**

-   Missing skills ranked by importance and impact for the specific target role

-   Estimated learning time per skill (e.g., \'Python for Data Analysis: 6--8 weeks at 1 hour/day\')

-   Recommended learning resources per skill --- courses, platforms, official documentation, project ideas

-   Milestone checkpoints --- what the user should be able to build or demonstrate at each stage

-   Total timeline estimate to become genuinely competitive for the target role

**Plan Customisation Logic:**

-   Adapts based on the user\'s self-reported existing skills from the questionnaire --- no redundant recommendations.

-   Adapts to the user\'s stated timeline: if placement is in 3 months, the plan focuses on highest-impact blockers only.

-   Clearly distinguishes must-have skills (blockers to application) from nice-to-have skills (differentiators).

-   If questionnaire indicates a skill exists but is absent from the resume, flags it as a presentation gap, not a learning gap.

**10.7 Resume Improvement Engine**

For all users --- and especially for Category A users --- the system shall generate specific, content-aware improvement suggestions. Generic template phrases such as \'Add more keywords\' are not acceptable outputs.

  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Tip Category**          **Description**
  ------------------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Weak Bullet Points        Provides a specific rewrite suggestion for each identified weak bullet. E.g., \'Responsible for managing social media\' → \'Grew Instagram following by 40% in 6 months through targeted content strategy\'

  Missing Keywords          Lists keywords absent from the resume that are expected for the target role and company; mapped to specific sections where they should be inserted

  Quantification Gaps       Flags every bullet point that makes a claim without measurable proof. Prompt: \'Add metrics here --- how many? how much? what percentage improvement?\'

  Section Gaps              Identifies entirely missing sections that are critical for the user\'s experience level and target role (e.g., missing Projects section for a fresher in tech)

  Action Verb Weakness      Flags overused weak openers (\'Responsible for\', \'Worked on\', \'Helped with\') and suggests strong alternatives (Led, Built, Designed, Delivered, Reduced, Increased)

  Length & Density Issues   Flags over-length resumes and low-content sections. Rule: 1 page for 0--2 years experience; 2 pages for 3+ years.
  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**10.8 Visual Highlight System**

The system shall render the user\'s resume on-screen with a colour-coded overlay that visually communicates quality at the section and individual bullet-point level. This is the product\'s most memorable and shareable UI feature.

  -----------------------------------------------------------------------------------------------------------------------------------------------------
  **Colour**   **Meaning**                       **Criteria**
  ------------ --------------------------------- ------------------------------------------------------------------------------------------------------
  🟢 Green     Strong --- keep as is             Well-written, keyword-rich, quantified achievement, proper action verb, ATS-safe formatting

  🟡 Yellow    Average --- improvement advised   Present but lacks metrics, missing some keywords, moderate language, minor formatting concern

  🔴 Red       Weak --- fix immediately          Vague language, missing critical keywords, ATS-breaking formatting issue, empty or very thin section
  -----------------------------------------------------------------------------------------------------------------------------------------------------

Hover interaction: Hovering over any highlighted section shall display a tooltip containing (a) the specific issue identified and (b) a concrete suggested rewrite or fix. Feedback must be section-specific --- generic page-level tooltips are not acceptable.

**10.9 Job Description Matcher**

The user shall have the option to paste a specific job description from any job posting. The system shall perform a semantic comparison between the resume and the JD.

-   Extract all keywords, required skills, and qualifications from the pasted JD

-   Compare against resume content using semantic embeddings (cosine similarity)

-   Generate a job-specific match score (e.g., 63% match)

-   List all keywords present in the JD but absent from the resume

-   Rewrite up to 3 resume bullet points to better align with JD language and tone

-   Provide a specific, actionable instruction: \'Add these 5 keywords naturally to move your match score from 63% to 87%\'

**10.10 Results Dashboard & Report Export**

All analysis outputs shall be presented in a single, unified, tabbed results dashboard rendered immediately upon processing completion (target: ≤ 15 seconds).

**Dashboard Layout:**

-   Overall ATS score prominently displayed with sub-score breakdown

-   Selection verdict (Selected / Not Selected) with confidence score and reasoning

-   Colour-coded resume view on the left panel; analysis panel on the right

-   Tabbed navigation: Skills Map / ATS Score / Improvement Tips / Learning Plan / Job Matches

-   Top 5 job match suggestions with skill gap breakdown per role

**Report Export:**

-   User can download the complete analysis as a formatted PDF report

-   Report includes: ATS score, verdict, skill map, improvement tips, learning plan, and job match suggestions

**11. AI Models & Technology Stack**

**11.1 AI Models Used**

  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **AI Model**                        **Function**                  **How It Is Used**
  ----------------------------------- ----------------------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Document Parser                     PDF / DOCX text extraction    Extracts raw text from uploaded files while preserving structural hierarchy; handles multi-column, tabular, and graphically-heavy resumes without data loss

  NLP (Natural Language Processing)   Semantic understanding        Reads experience descriptions and understands implied skills and context beyond literal keywords (e.g., \'led cloud migration\' implies AWS, DevOps, project management)

  Text Classification                 Structural tagging            Classifies every resume section and element into its category: Education, Work Experience, Skills, Projects, Certifications, Contact

  Embeddings Model                    Semantic similarity scoring   Converts resume text and job descriptions into high-dimensional vectors; calculates cosine similarity for match scoring and job role suggestions

  Claude API (Anthropic)              Language generation           Generates all natural-language outputs: improvement tips, learning plan content, bullet-point rewrites, selection reasoning narratives
  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**11.2 Technology Stack**

  ---------------------------------------------------------------------------------------------------------------------------------------------------
  **Layer**              **Technology**
  ---------------------- ----------------------------------------------------------------------------------------------------------------------------
  Frontend               HTML5, CSS3, JavaScript, TailwindCSS --- responsive for desktop and mobile; keyboard navigation and screen-reader friendly

  Backend                TypeScript (Node.js) --- modular, maintainable codebase with REST API layer

  AI / ML Layer          Python --- document parsing (PyMuPDF / Apache PDFBox), NLP, classification, embeddings pipeline

  Embedding Model        OpenAI text-embedding-3 or equivalent open-source alternative

  LLM / Generation       Anthropic Claude API (claude-sonnet model)

  Database               PostgreSQL for user data; Redis for session caching and result caching (30-day TTL)

  Cloud Infrastructure   AWS or GCP --- scalable compute, encrypted object storage for uploaded resumes

  Payment Gateway        Razorpay --- for Indian market B2C and B2B billing

  Training Data          Resume datasets (Kaggle + curated) and job role requirement datasets for model fine-tuning
  ---------------------------------------------------------------------------------------------------------------------------------------------------

**11.3 AI Processing Flow**

1.  PDF / DOCX uploaded → Document Parser extracts raw text

2.  NLP engine structures text into labelled sections

3.  Text Classifier tags every element with category and sub-category

4.  Skill Extractor identifies explicit + implicit skills; infers proficiency levels

5.  Embeddings engine converts resume and target role into vectors → similarity scores computed

6.  ATS scoring logic evaluates formatting, keyword, contact, length, and consistency rules

7.  Selection Prediction model combines all signals → verdict + confidence score + issue categorisation

8.  Claude API generates: learning plan, improvement tips, bullet rewrites, narrative reasoning

9.  Highlight engine maps AI feedback to specific resume sections for visual overlay

10. Results dashboard assembled and rendered to user

**12. Non-Functional Requirements**

  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Category**              **Requirement**                   **Target**
  ------------------------- --------------------------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------
  Performance               Resume analysis processing time   ≤ 15 seconds from upload to full results dashboard; first meaningful insight visible within 20 seconds

  Scalability               Concurrent users                  500 concurrent analyses without degradation in V1; architecture must support scaling to 1,000+ for B2B scenarios

  Availability              Platform uptime                   99.5% monthly uptime SLA for core analysis features

  Security                  Data encryption                   Resumes encrypted at rest (AES-256) and in transit (TLS 1.3); GDPR-compliant data handling

  Data Retention            Resume storage lifetime           User resumes deleted from servers after 30 days unless user explicitly opts into analysis history

  Accuracy --- ATS Score    Benchmark compliance              ATS score within ±8 points of industry-standard ATS tools in independent benchmark tests

  Accuracy --- Prediction   Selection prediction accuracy     ≥ 75% prediction accuracy validated against real hiring outcomes, measured via 6-month follow-up survey data

  Usability                 Session experience                Average session time target \> 5 minutes; zero-friction onboarding --- first analysis completable in under 3 minutes

  Accessibility             Browser & device support          Chrome, Firefox, Safari, Edge (current and one prior major version); responsive design for desktop and mobile; keyboard navigation and screen-reader friendly

  Maintainability           Codebase quality                  Modular architecture; TypeScript backend; Python AI layer; full test coverage for AI accuracy regression
  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**13. Business Rules**

-   The system must always categorise the primary issue as either a Resume Issue (Category A) or a Skill Gap (Category B) --- never present both as equally weighted without explicit prioritisation.

-   The Learning Plan must be ordered by impact priority for the target role --- not alphabetically, not generically.

-   ATS Score must display all five sub-scores alongside the overall total --- a single composite number without breakdown is insufficient and not acceptable.

-   The Visual Highlight system must map feedback to specific sections of the resume displayed --- generic page-level feedback is not acceptable.

-   Improvement tips must be specific to the user\'s actual content --- template phrases such as \'Add more keywords\' are explicitly not acceptable as outputs.

-   The system must distinguish between skills the user has but did not mention in the resume, and skills the user does not have at all. These require different interventions.

-   Questionnaire responses must actively influence the analysis output --- if a user reports 3 years of Python experience in the questionnaire but Python is absent from the resume, this must be flagged as a resume presentation issue, not a skill gap.

-   All AI-generated suggestions must be clearly labelled as AI-generated and presented as guidance, not guarantees of any hiring outcome.

-   Users uploading incomplete contact information must receive a warning before ATS scoring proceeds.

-   Pro features (unlimited analyses, JD matching, learning plan tracking, history) require an active subscription or pay-per-use payment.

-   The free tier is limited to 2 full analyses per month per registered user account.

**14. User Journey**

  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **\#**   **User Action**                       **System Response**                                               **User Experience**
  -------- ------------------------------------- ----------------------------------------------------------------- -----------------------------------------------------------------------------------------
  1        Lands on homepage                     Clear value proposition displayed above the fold                  Understands exactly what the product does in under 5 seconds

  2        Uploads PDF or DOCX resume            File validated (format, size); upload confirmed; parsing begins   Instant feedback that file was accepted; no ambiguity

  3        Inputs target company and role        Stored as analysis parameters; autocomplete assists entry         Simple, fast inputs --- under 30 seconds

  4        Completes contextual questionnaire    5--7 questions on experience, known skills, placement timeline    Quick and frictionless --- total questionnaire time under 90 seconds

  5        (Optional) Pastes job description     JD stored for targeted matching analysis                          Clearly optional and skippable; no friction if not used

  6        Submits --- processing screen shown   All AI models run in parallel; 10--15 second window               Animated progress indicator with contextual loading messages (not a blank spinner)

  7        Results dashboard renders             Full analysis displayed                                           ATS score prominent; verdict clear; colour-coded resume on left; analysis tabs on right

  8        Explores colour highlights            Hover triggers tooltips with issue + fix suggestion               User sees exactly which sections are weak and why --- the \'wow\' moment

  9        Reviews improvement tips              Section-specific, content-aware recommendations displayed         User has concrete, specific actions --- not generic advice

  10       Views learning plan (if applicable)   Ordered skill roadmap with resources and time estimates           User has a structured path forward --- not just a score

  11       Downloads PDF report                  Full analysis compiled into formatted downloadable PDF            Portable document; user can act on it offline and share with mentors
  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**15. Priority Feature Matrix**

  -----------------------------------------------------------------------------------------------------------------------------------------------------
  **Feature**                                      **Priority**      **Rationale**
  ------------------------------------------------ ----------------- ----------------------------------------------------------------------------------
  Resume Upload & Parsing                          P0 --- Critical   Core functionality; no feature works without accurate parsing

  ATS Score Engine                                 P0 --- Critical   Primary value proposition; most relatable user pain point

  Skill Extraction & Mapping                       P0 --- Critical   Required for all downstream features: job match, prediction, learning plan

  AI Selection Prediction + Issue Categorisation   P0 --- Critical   Core differentiator; no other product makes Resume vs. Skill Gap distinction

  Resume Improvement Tips                          P0 --- Critical   Immediate, tangible value; drives re-upload and retention

  Personalised Learning Plan                       P0 --- Critical   Key differentiator for Category B users; drives subscription conversion

  Visual Highlight System                          P1 --- High       The \'wow\' feature --- most visually impressive; drives sharing and virality

  Job Match Suggestions (Top 5)                    P1 --- High       Adds significant value; requires embeddings already built for ATS scoring

  Interactive UI / UX                              P1 --- High       Drives engagement, session time, and word-of-mouth in B2C and hackathon contexts

  Job Description Matcher                          P2 --- Medium     Bonus feature; premium value; gates behind Pro tier

  PDF Report Export                                P2 --- Medium     Enhances perceived completeness; useful for B2B placement cell context
  -----------------------------------------------------------------------------------------------------------------------------------------------------

**16. Business Model & Monetisation**

  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Tier**            **Price**                         **Target Users**                                     **Features Included**
  ------------------- --------------------------------- ---------------------------------------------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Free                ₹0                                Casual and first-time users                          2 full analyses per month; ATS score with sub-scores; basic improvement tips; selection prediction; no JD matching; no learning plan history

  Pro                 ₹299 / month                      Active job seekers                                   Unlimited analyses; full JD matcher; complete personalised learning plan; analysis history tracking over time; priority processing queue

  Pay Per Use         ₹49 / analysis                    Occasional users                                     Single complete analysis with all features; no subscription commitment required

  B2B --- College     ₹10,000 / month per institution   Placement cells, universities, coaching institutes   Platform access for all enrolled students; aggregate analytics dashboard for placement coordinators; branded institution-specific experience; bulk usage reporting

  B2B --- Corporate   Custom pricing                    HR departments, recruiting agencies                  Bulk candidate resume screening; candidate benchmarking against role requirements; REST API access for integration with internal HR systems
  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**17. Success Metrics & KPIs**

  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Metric**                                **Definition**                                                                          **Target (6 Months Post-Launch)**
  ----------------------------------------- --------------------------------------------------------------------------------------- -----------------------------------
  Monthly Active Users (MAU)                Unique users completing at least one analysis per month                                 10,000 MAU

  Average Session Time                      Average time spent per user session on results dashboard                                \> 5 minutes

  Free-to-Paid Conversion Rate              \% of free users upgrading to Pro or Pay-Per-Use                                        ≥ 8--10%

  ATS Score Accuracy                        Score within ±8 of benchmark industry ATS tools in validation tests                     ≥ 90% of analyses

  Average ATS Score Improvement             Mean ATS score increase for users who re-upload after receiving feedback                ≥ 25 points improvement

  Job Match Accuracy                        Alignment of suggested job roles with roles users actively pursued and found relevant   ≥ 85% user relevance rating

  Selection Prediction Accuracy             \% of predictions matching real hiring outcomes (via 6-month follow-up survey)          ≥ 75%

  Resume Re-upload Rate                     \% of users who upload an improved resume after receiving feedback                      ≥ 30%

  User-Reported Callback Rate Improvement   Self-reported increase in interview callbacks after using ResumeIQ                      ≥ 25% of surveyed users

  B2B Contracts Signed                      College and corporate contracts signed in first 6 months                                ≥ 5 institutions

  Net Promoter Score (NPS)                  User likelihood to recommend the platform                                               ≥ 50
  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------

**18. Risks & Mitigations**

  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Risk**                                                                         **Severity**   **Mitigation Strategy**
  -------------------------------------------------------------------------------- -------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  AI generates inaccurate or misleading improvement tips                           High           Human review pipeline for edge cases; \'AI-generated guidance\' disclaimer on all tips; user feedback button (thumbs up/down) on every individual recommendation; continuous retraining from feedback signals

  Selection prediction is wrong and damages user confidence or decisions           High           Frame all outputs as \'likelihood estimates\', never guarantees; display confidence intervals alongside verdict; collect outcome data to continuously retrain; include prominent disclaimer

  Resume parsing fails on unusual formats (heavy graphics, scanned PDFs, tables)   Medium         Detect parse-failure cases early and surface clear error to user; prompt user to upload a cleaner version; provide fallback manual text input option

  Data privacy breach --- resume data contains highly sensitive PII                High           AES-256 encryption at rest; TLS 1.3 in transit; 30-day auto-delete policy; no use of user data for model training without explicit opt-in consent; GDPR compliance

  Competitive response from established players (Jobscan, LinkedIn, Google)        Medium         Selection prediction + personalised learning plan is a meaningful differentiation moat; focus on B2B India channel which global players structurally underserve; execute faster on product iteration

  AI API costs make free tier economically unviable at scale                       Medium         Throttle free tier to 2 analyses/month; cache results for 30 days (no re-processing same resume); optimise prompt engineering to reduce token consumption; monitor cost-per-analysis metric weekly

  Training dataset is inaccurate or outdated (Kaggle resume/job datasets)          Medium         Validate dataset quality before use; supplement with real-world resume data (with consent); schedule quarterly dataset refresh cycles

  Users provide dishonest questionnaire responses, degrading prediction accuracy   Low            Cross-validate questionnaire responses against resume content; flag contradictions to the user; weight resume-extracted data more heavily than self-reported data in the model
  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**19. Assumptions & Dependencies**

**19.1 Assumptions**

-   Users will primarily upload PDF resumes; DOCX support is included in V1. Additional formats (.doc, .txt) may be added in V1.1.

-   Target company and role data will be user-provided in V1; integration with job board APIs (LinkedIn, Naukri, Indeed) is a V2 feature.

-   The Claude API (Anthropic) will remain available, within acceptable latency parameters, and at a sustainable cost structure.

-   Resume datasets and job role requirement datasets sourced from Kaggle and curated sources are sufficiently accurate and representative for initial model training.

-   Prediction accuracy benchmarking will require 3--6 months of real user outcome data collected via follow-up surveys to be statistically meaningful.

-   Indian market is the primary launch geography; global expansion including international currency and language support is a V2 initiative.

-   Users will provide honest responses to the contextual questionnaire; the model cross-validates against resume content to catch contradictions.

**19.2 Dependencies**

-   Anthropic Claude API --- all natural language generation outputs (improvement tips, learning plans, bullet rewrites, reasoning narratives)

-   PDF parsing library --- PyMuPDF or Apache PDFBox for reliable multi-format text extraction

-   DOCX parsing library --- python-docx for Word document support

-   Embedding model --- OpenAI text-embedding-3 or open-source equivalent (e.g., sentence-transformers) for semantic similarity scoring

-   Cloud infrastructure --- AWS or GCP for scalable compute, encrypted object storage, and CDN delivery

-   Payment gateway --- Razorpay for Indian market B2C subscription and B2B invoicing

-   Resume and job role datasets --- Kaggle + curated sources for initial AI model training and fine-tuning

**20. Constraints**

-   Analysis is limited to one resume at a time per free user session.

-   Processing time must remain under 15 seconds for all analyses under normal server load.

-   The platform is web-only in V1; a native mobile application is planned for a future phase.

-   The free tier is capped at 2 full analyses per month per registered account to manage API cost exposure.

-   Scanned image-only PDFs (no embedded text layer) cannot be parsed in V1; OCR support is a V1.1 consideration.

-   The selection prediction model\'s accuracy is constrained by the quality and volume of real hiring outcome data available for training; accuracy improves progressively with usage.

**21. Glossary**

  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Term**               **Definition**
  ---------------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  ATS                    Applicant Tracking System --- software deployed by companies to automatically screen and filter resumes before any human review

  ATS Score              A numerical score (0--100) representing how well a resume is optimised for automated ATS screening based on keyword, format, contact, length, and consistency factors

  Embeddings             Numerical vector representations of text that capture semantic meaning, enabling mathematical comparison of text similarity across phrases that use different words but mean the same thing

  NLP                    Natural Language Processing --- AI techniques enabling machines to understand the meaning and context of human language beyond keyword matching

  Cosine Similarity      A mathematical measure of the angle between two text vectors; used to compute resume-to-JD and resume-to-role match scores

  Implicit Skills        Skills inferred from experience descriptions rather than explicitly listed --- e.g., \'deployed microservices to AWS\' implies Docker, cloud infrastructure, and DevOps knowledge

  Explicit Skills        Skills directly stated in the resume --- e.g., listed in a dedicated Skills section or named directly in a bullet point

  Selection Prediction   AI model output estimating the probability that a candidate\'s profile will result in selection for a specific role at a specific target company

  Category A Issue       Resume Issues --- the candidate has the required skills but the resume does not present them effectively; fix = rewrite and reformat the resume

  Category B Issue       Skill Gaps --- the candidate genuinely lacks required skills for the target role; fix = follow the personalised learning plan

  Learning Roadmap       A structured, ordered plan specifying which skills to acquire, in what sequence, with time estimates per skill and recommended learning resources

  Keyword Score          Sub-component of ATS Score measuring presence, density, and natural placement of industry-relevant terms throughout the resume

  JD Matcher             Feature allowing users to paste a specific job description and receive a targeted match score plus keyword gap analysis between the JD and their resume

  BRD                    Business Requirements Document --- a formal specification defining what a product must do to satisfy business goals and user needs, serving as the contract between stakeholders and the development team

  Proficiency Level      Inferred skill level --- Beginner / Intermediate / Expert --- based on frequency and depth of skill usage in the resume
  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

*--- End of Document ---*

PROJECT_AI_RESUME_ANALYZER \| BRD v1.0 \| Confidential \| March 2026
