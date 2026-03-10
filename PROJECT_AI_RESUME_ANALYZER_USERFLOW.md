+---------------------------------------------------------------------------------------------------+
| **PROJECT_AI_RESUME_ANALYZER**                                                                    |
|                                                                                                   |
| *Final User Flow & Product Architecture Document*                                                 |
|                                                                                                   |
| ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                                           |
|                                                                                                   |
| *Synthesised from both product briefs --- every phase, decision, AI model, screen, and edge case* |
+---------------------------------------------------------------------------------------------------+

+-------------+-------------+-------------+-------------+-------------+
| **8**       | **4**       | **3**       | **7**       | **2**       |
|             |             |             |             |             |
| Phases      | AI Models   | Gap Paths   | ATS Factors | Plan Tiers  |
+-------------+-------------+-------------+-------------+-------------+

+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **Product Vision & Core Problem**                                                                                                                                                                                                                                                                                            |
|                                                                                                                                                                                                                                                                                                                              |
| 95% of Fortune 500 companies use ATS (Applicant Tracking Systems) to filter resumes before any human reads them. Qualified candidates are rejected in milliseconds --- not because they lack skill, but because a machine couldn\'t parse their layout, locate the right keywords, or read a two-column PDF correctly.       |
|                                                                                                                                                                                                                                                                                                                              |
| ResumeIQ is the first platform that puts the intelligence of ATS on the candidate\'s side. Upload your resume, name your target company and role --- and the AI tells you precisely whether you\'d be selected, exactly what is missing, and gives you a structured plan to close the gap. Not generic tips. A real roadmap. |
|                                                                                                                                                                                                                                                                                                                              |
| **One-line pitch:** *\"95% of resumes never reach a human --- they\'re rejected by a robot. ResumeIQ shows you exactly what the robot sees and how to beat it.\"*                                                                                                                                                            |
+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

**How to Read This Document**

This document is structured as a linear, end-to-end user flow followed by deep technical and product sections. Each phase maps to a real user action, the system response behind it, and the AI model responsible for that intelligence. Decision points show both outcome paths in full --- nothing is left as a one-sided assumption.

  ----------------------- ---------------------------------------------------------------------------------------
  **PHASE HEADERS**       Colour-bordered boxes mark the start of a new user-journey phase

  **NUMBERED STEPS**      Blue step blocks show sequential actions within a phase

  **DECISION DIAMONDS**   Yellow boxes --- a fork based on user data; both branches documented

  **INFO BOXES**          Blue/green bordered boxes --- AI system internals and processing logic

  **TWO-COLUMN VIEWS**    Side-by-side comparisons, outcomes, or dashboard layout splits

  **✅ / ❌ OUTCOMES**    Green = selected / strong path Red = not selected / weak path --- both fully expanded

  **APPENDIX TABLES**     Feature gates, ATS scoring breakdown, edge cases --- detailed reference data
  ----------------------- ---------------------------------------------------------------------------------------

+------------------------------------------------------------------------------+
| **PHASE 0 Landing & Onboarding**                                             |
|                                                                              |
| *First impression, value communication, account entry, and friction removal* |
+------------------------------------------------------------------------------+

**0.1 Homepage Experience**

The homepage has exactly one job: make the value proposition undeniable in under 5 seconds. No feature grids, no pricing tables above the fold. One headline, one sub-headline, one CTA button --- nothing else competes for attention.

+----------------------------------------------------------------------------------------------------------------------------+
| **Hero Section --- Copy & Content Specification**                                                                          |
|                                                                                                                            |
| **Primary headline:** *\"95% of resumes are rejected before a human ever sees them. Find out if yours is one of them.\"*   |
|                                                                                                                            |
| **Sub-headline:** Upload your resume + target company → AI tells you if you\'d be selected and exactly how to improve.     |
|                                                                                                                            |
| **Primary CTA:** \"Analyse My Resume --- Free\" (no account required for first use)                                        |
|                                                                                                                            |
| **Secondary CTA:** \"See a sample analysis\" (opens demo dashboard pre-loaded with an anonymised resume)                   |
|                                                                                                                            |
| **Social proof strip:** Live counter of resumes analysed today + 3 short testimonials showing real ATS score improvements. |
+----------------------------------------------------------------------------------------------------------------------------+

**0.2 Authentication Options**

Users can begin the full flow without signing in. Signing up unlocks history, tracking, and the full improvement plan. Friction is minimised by making Google and LinkedIn OAuth the default signup paths --- email/password is secondary.

+--------------------------+--------------------------+-----------------------------+
| **Guest Mode**           | **Free Account**         | **Pro - Rs.299/month**      |
+--------------------------+--------------------------+-----------------------------+
| -   1 analysis           | -   2 analyses/month     | -   Unlimited analyses      |
|                          |                          |                             |
| -   No history saved     | -   Full dashboard       | -   Company-specific ATS    |
|                          |                          |                             |
| -   No JD matching       | -   History saved        | -   Full roadmap + timeline |
|                          |                          |                             |
| -   No progress tracking | -   JD matching included | -   Progress tracking       |
|                          |                          |                             |
|                          |                          | -   AI bullet rewrites      |
|                          |                          |                             |
|                          |                          | -   Cover letter angle      |
|                          |                          |                             |
|                          |                          | -   Priority processing     |
+--------------------------+--------------------------+-----------------------------+

+-----------------------------------------------------------------------------+
| **PHASE 1 Input Collection**                                                |
|                                                                             |
| *Resume upload, target company, role context, and dynamic intake questions* |
+-----------------------------------------------------------------------------+

**1.1 Resume Upload**

The upload screen is clean and distraction-free. The dominant element is the drop zone. Accepted formats: PDF (primary), DOCX (secondary). Maximum file size: 5 MB. File is securely stored and passed to the document parsing engine immediately after upload.

+-------+---------------------------------------------------------------------------------------------------------+
| **1** | **Drag / click to upload resume**                                                                       |
|       |                                                                                                         |
|       | PDF or DOCX accepted. File validated for size, format, and readability before any AI processing begins. |
+-------+---------------------------------------------------------------------------------------------------------+

**▼**

+-------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **2** | **Format validation**                                                                                                                                                 |
|       |                                                                                                                                                                       |
|       | System checks: not password-protected, not a scanned image-only PDF, parseable. Specific error messages shown per failure type --- never a generic \'upload failed\'. |
+-------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------+

**▼**

+-------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **3** | **Target company entry**                                                                                                                                                                                   |
|       |                                                                                                                                                                                                            |
|       | User types the company they are applying to. Auto-complete from a database of 10,000+ companies. System captures: company name, industry, and the known ATS software used by that company where available. |
+-------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

**▼**

+-------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **4** | **Target role / job title**                                                                                                                                                                                                              |
|       |                                                                                                                                                                                                                                          |
|       | User selects or types their target role. This anchors the entire analysis --- the same resume is evaluated differently for \'Product Manager\' vs \'Data Analyst\'. Role also determines which skill database is used for gap detection. |
+-------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

**1.2 Dynamic Intake Questions**

After core inputs, the user answers 4--6 quick questions. These are dynamically generated based on the company and role entered --- not a static form. Questions are presented as single-choice buttons or sliders, never text fields. Completion target: under 60 seconds.

+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **Intake Questions --- Examples by Type**                                                                                                                                    |
|                                                                                                                                                                              |
| **Q1 --- Experience level:** How many years of relevant experience do you have? \[0--1 / 1--3 / 3--6 / 6+\]                                                                  |
|                                                                                                                                                                              |
| **Q2 --- Application type:** Is this a direct application, referral, or cold outreach? \[Direct / Referral / Cold\]                                                          |
|                                                                                                                                                                              |
| **Q3 --- Resume freshness:** When was this resume last updated? \[\< 1 month / 1--6 months / 6 months+\]                                                                     |
|                                                                                                                                                                              |
| **Q4 --- JD availability:** Do you have the specific job description? \[Yes --- paste it / No --- use company\'s standard role profile\]                                     |
|                                                                                                                                                                              |
| **Q5 --- Role-specific (auto):** Dynamically generated. Example for SWE: \'Which tech stack is your strongest?\' Example for PM: \'What is your primary domain experience?\' |
+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

**1.3 Job Description Paste (Optional but High-Value)**

If the user has the specific JD, they paste it in a text area. This activates the full JD Matcher module and significantly increases the precision of keyword analysis, gap detection, and the match score. If no JD is provided, the system uses a role-profile database built from 50,000+ historical job descriptions for that role and company type --- so the analysis is still strong without it.

+-----------------------------------------------------------------------+
| **PHASE 2 AI Processing Engine**                                      |
|                                                                       |
| *Eight-step backend pipeline --- four AI models working in sequence*  |
+-----------------------------------------------------------------------+

**2.1 Processing Screen**

After submission, a 10--20 second processing screen is shown with a live progress bar. Each bar segment maps to a real backend pipeline stage --- not a fake timer. The progress bar label changes as each stage completes: \'Parsing document...\' → \'Extracting skills...\' → \'Calculating ATS score...\' etc.

+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **The 8-Step AI Pipeline**                                                                                                                                                                                                                                                                                                                                                          |
|                                                                                                                                                                                                                                                                                                                                                                                     |
| **Step 1 --- Document Parser:** Extracts raw text from the PDF preserving structural hierarchy --- headings, bullet points, columns, tables. Handles two-column layouts, icon-based skill sections, embedded fonts, and graphics. Real challenge: two-column resumes, tables, and icons break basic parsers. This step must handle all real-world variations.                       |
|                                                                                                                                                                                                                                                                                                                                                                                     |
| **Step 2 --- NLP Structurer:** Reads extracted text and maps it to semantic resume sections: Contact Info, Work Experience, Education, Skills, Projects, Certifications, Summary. Handles non-standard section names (\'What I\'ve Built\' → Projects, \'Where I\'ve Worked\' → Experience). Section detection is inference-based, not keyword-matching.                            |
|                                                                                                                                                                                                                                                                                                                                                                                     |
| **Step 3 --- Text Classifier:** Tags every sentence and phrase with its category and quality signal. Work bullets are classified as: Achievement (with metric), Achievement (without metric), Responsibility, or Vague Filler. Skills are classified as: Technical/Hard, Soft, Tool/Software, Domain Knowledge, or Language.                                                        |
|                                                                                                                                                                                                                                                                                                                                                                                     |
| **Step 4 --- Implicit Skill Extractor:** Reads work experience bullets and infers skills not explicitly listed. \'Built and deployed a microservices architecture\' → infers Docker, Kubernetes, API design, DevOps even if absent from the skills section. This is where NLP understanding --- not just keyword matching --- becomes critical.                                     |
|                                                                                                                                                                                                                                                                                                                                                                                     |
| **Step 5 --- Embeddings Engine:** Converts resume content, target role requirements, and JD (if provided) into high-dimensional vectors. Calculates cosine similarity to produce match scores. This is how real ATS systems work --- semantic similarity, not keyword matching. Two sentences that mean the same thing score similarly even with different words.                   |
|                                                                                                                                                                                                                                                                                                                                                                                     |
| **Step 6 --- ATS Simulation Layer:** Runs the resume through a simulation of how ATS systems parse it. Where data is available, the simulation is modelled on the target company\'s specific ATS (Workday, Greenhouse, Lever, Taleo, etc.), each of which has known quirks in how it handles formatting, sections, and keyword weighting.                                           |
|                                                                                                                                                                                                                                                                                                                                                                                     |
| **Step 7 --- Claude API --- Analysis Generator:** Takes all structured data from the above steps and generates specific, contextual improvement tips. Output is not templated --- it is genuinely adaptive to the individual resume and role. Weak bullet rewrites, missing keyword callouts, quantification prompts, and section gap notices are all generated fresh per analysis. |
|                                                                                                                                                                                                                                                                                                                                                                                     |
| **Step 8 --- Highlight Engine:** Maps every piece of feedback back to the specific line(s) in the original resume. This powers the colour-coded visual overlay in the dashboard. Green / Yellow / Red assignment per bullet is computed here based on a composite quality score from Steps 3--7.                                                                                    |
+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

**2.2 Four Core AI Models --- Quick Reference**

  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **AI Model**                        **What It Does**                                                                                                                     **Why It Matters Here**
  ----------------------------------- ------------------------------------------------------------------------------------------------------------------------------------ ---------------------------------------------------------------------------------------------------------------
  Document Parsing                    Extracts text from unstructured PDF preserving layout hierarchy                                                                      PDFs have layers, fonts, columns, tables --- not just text. Must handle all messy real-world formats

  NLP (Natural Language Processing)   Understands meaning of text, not just words. Reads \'Led 5 engineers on cloud migration\' and infers leadership + technical skills   Resumes are written 100 different ways. NLP bridges the gap between how people write and what employers seek

  Text Classification                 Categorises every element: section type, skill type, bullet quality                                                                  Enables ATS scoring, skill profiling, and the highlight engine --- nothing works without this tagging layer

  Embeddings (Semantic Vectors)       Converts text into numbers representing meaning. Similar meanings = similar numbers. Enables similarity scoring                      This is how ATS systems actually rank resumes against JDs. The match score is a vector similarity calculation
  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**2.3 ATS Score --- Full Breakdown**

The ATS Score is a composite score out of 100, weighted across five sub-scores. It reflects how a real ATS system would parse and rank the resume --- not how a human would read it. A genuinely impressive resume can score 40/100 purely due to format issues.

  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Sub-Score**       **What AI Checks**                                                                                                            **Weight**   **Max Pts**   **Priority**
  ------------------- ----------------------------------------------------------------------------------------------------------------------------- ------------ ------------- --------------
  Keyword Score       Industry keywords present, action verbs at bullet start, natural density (not stuffed), role-relevant terminology             30%          30            **HIGH**

  Format Score        Single-column layout, no tables/text-boxes/graphics, standard fonts, recognisable section headings, parseable by target ATS   25%          25            **HIGH**

  Contact Score       Complete info, professional email, LinkedIn present, GitHub for tech roles, no phone/location anomalies                       15%          15            **MED**

  Length Score        1 page for freshers (0--2 yrs), 2 pages for experienced (3--8 yrs). 3+ pages for under 5 yrs experience penalised.            15%          15            **MED**

  Consistency Score   Uniform date formats across all entries, parallel bullet grammatical structure, consistent section naming style               15%          15            **LOW**
  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

+------------------------------------------------------------------------------------------------+
| **ATS Score Interpretation Bands**                                                             |
|                                                                                                |
| **80--100:** Strong --- passes ATS for most companies. Minor optimisation only.                |
|                                                                                                |
| **60--79:** Moderate --- passes some ATS systems. Specific fixes needed for competitive roles. |
|                                                                                                |
| **40--59:** Weak --- high rejection risk. Format and keyword issues are critical to address.   |
|                                                                                                |
| **0--39:** Critical --- rejected by virtually all major ATS. Structural rebuild is required.   |
+------------------------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------------------------+
| **PHASE 3 The Verdict Screen**                                                                      |
|                                                                                                     |
| *The core differentiator --- company-specific, role-specific selection outcome with full reasoning* |
+-----------------------------------------------------------------------------------------------------+

**3.1 Primary Decision**

After processing, the system delivers a binary verdict specific to the target company and role. This is not a vague \'72% match\' --- it is a clear selection simulation with confidence level and structured reasoning. Most resume tools stop at a score. This screen tells the user what actually happens when they apply.

+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **◆ Based on your resume vs target role and company --- would you be selected? ◆**                                                                                                                                                                                                                  |
|                                                                                                                                                                                                                                                                                                     |
| +----------------------------------------------------------------------------------------------------------------------------------------------------------+--------------------------------------------------------------------------------------------------------------------------------------+ |
| | **✅ LIKELY SELECTED**                                                                                                                                   | **❌ NOT SELECTED**                                                                                                                  | |
| |                                                                                                                                                          |                                                                                                                                      | |
| | Resume passes ATS filter and skills meet the threshold. Candidate enters the human-review flow. System shifts to optimisation and interview preparation. | Resume fails at ATS, skill threshold, or both. System routes user into the appropriate improvement path with a full structured plan. | |
| +----------------------------------------------------------------------------------------------------------------------------------------------------------+--------------------------------------------------------------------------------------------------------------------------------------+ |
+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

**3.2 Confidence Score & Reasoning Factors**

The verdict is accompanied by a confidence percentage (60--98%) and a plain-English breakdown of the three factors that produced it. Each factor is expandable to show the full underlying data.

  --------------------------------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Factor 1: ATS Passability**                                                                                                                       **Factor 2: Skill Match**                                                                                                                 **Factor 3: Competitiveness**

  Can the machine read and rank this resume? Format compliance, parsability, keyword presence, and ATS simulation result for target company system.   Do the extracted skills meet the required and preferred skill set for this role? Percentage of required skills present calculated here.   How does this candidate compare to the average applicant for this role at this company? Percentile estimate based on aggregated data from similar profiles.
  --------------------------------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------

+-------------------------------------------------------------------------------+
| **PHASE 4 Results Dashboard**                                                 |
|                                                                               |
| *Full analysis output --- visual, interactive, tabbed, and deeply actionable* |
+-------------------------------------------------------------------------------+

**4.1 Dashboard Layout --- Two-Panel Architecture**

The dashboard uses a persistent two-panel layout. The resume stays visible at all times on the left --- users cross-reference every tip directly against their own document in real time. The right panel contains all analysis output across six tabs.

+----------------------------------------------------------------------------------------------------------------------+------------------------------------------------------------------------------------------------------------------------------+
| **LEFT PANEL --- Visual Resume Viewer**                                                                              | **RIGHT PANEL --- Analysis Tabs**                                                                                            |
|                                                                                                                      |                                                                                                                              |
| Resume rendered as it appears, with a colour overlay system mapped by the Highlight Engine:                          | **Tab 1: ATS Score:** Gauge chart + 5 sub-score breakdown with a specific fix for each sub-score below threshold             |
|                                                                                                                      |                                                                                                                              |
| -   **🟢 Green --- Strong. Keyword-rich, quantified achievement, action verb at start.**                             | **Tab 2: Skills Map:** Visual skill map by category. Green = strong, Yellow = weak evidence, Red = missing but role-required |
|                                                                                                                      |                                                                                                                              |
| -   🟡 Yellow --- Average. Present but missing metrics or key terms.                                                 | **Tab 3: Verdict:** Company-specific selection result + confidence + 3 reasoning factors each expandable                     |
|                                                                                                                      |                                                                                                                              |
| -   **🔴 Red --- Weak. Vague language, missing keywords, or formatting issues.**                                     | **Tab 4: Tips:** All improvement tips ranked by ATS impact. Each shows before → after example with priority label            |
|                                                                                                                      |                                                                                                                              |
| Hover any highlighted section → tooltip appears with the exact problem and a specific suggested fix.                 | **Tab 5: Job Matches:** Top 5 matching roles based on current profile. Match % + gap skill list per role                     |
|                                                                                                                      |                                                                                                                              |
| Click any highlight → right panel jumps to the expanded tip for that section.                                        | **Tab 6: JD Match:** (If JD provided) Keyword gap list + 3 AI-rewritten bullet points optimised for the exact JD language    |
|                                                                                                                      |                                                                                                                              |
| *This is the WOW feature --- seeing your own resume colour-coded is immediately personal and impossible to dismiss.* |                                                                                                                              |
+----------------------------------------------------------------------------------------------------------------------+------------------------------------------------------------------------------------------------------------------------------+

**4.2 Skills Map --- Category Breakdown**

  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Category**              **How AI Detects It**                                             **Proficiency Method**                                     **Gap Detection Logic**
  ------------------------- ----------------------------------------------------------------- ---------------------------------------------------------- --------------------------------------------------------------------
  Technical / Hard Skills   Explicit listing + inferred from experience bullets via NLP       Beginner/Intermediate/Expert from context frequency        Compared against role\'s required tech stack

  Soft Skills               Inferred from language: \'led\', \'negotiated\', \'mentored\'     Frequency and context richness of soft-skill language      Role-critical softs flagged if absent (e.g. leadership for senior)

  Tools & Software          Direct explicit mentions only --- tools are rarely implicit       Version-specific where candidate states it                 Common tools for the role that are entirely absent

  Domain Knowledge          Industry terminology, sector context in experience descriptions   Depth from seniority and responsibility scope              Specialist domain gaps for niche roles

  Languages                 Both programming and spoken languages captured separately         Proficiency from explicit statement or context inference   Required language vs present language cross-check
  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**4.3 Improvement Tips --- Types, Priority, Before/After**

Every tip is generated in context of the specific resume and role. They are ranked by ATS impact --- highest first. Each tip contains a before/after transformation so the user knows exactly what to write, not just what is wrong.

  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Tip Type**           **Priority**   **Before → After Illustration**
  ---------------------- -------------- --------------------------------------------------------------------------------------------------------------------------------
  Weak Bullet Rewrite    **CRITICAL**   \"Responsible for managing social media\" → \"Grew Instagram following 40% in 6 months via targeted content strategy\"

  Missing Keywords       **CRITICAL**   \"For SWE role, resume is missing: system design, agile, CI/CD\" → shows which section to add each keyword to naturally

  Quantification Gap     **HIGH**       \"Managed a team\" → \"Managed a team of 8 engineers, delivering 3 product features per sprint over 18 months\"

  Action Verb Upgrade    **HIGH**       \"12 bullets start with Responsible for\" → specific verb replacements: Led, Built, Designed, Delivered, Reduced

  Section Gap            **MEDIUM**     \"No Projects section detected --- for a fresher profile this is the single highest-impact addition possible\"

  Format Fix             **MEDIUM**     \"Two-column layout detected --- switching to single column improves ATS parsability and is estimated to add \~20 pts\"

  Length Issue           **LOW**        \"3-page resume for 2 years of experience --- condense to 1 page; remove oldest / least relevant entries first\"

  Contact Completeness   **LOW**        \"GitHub link absent --- expected for Software Engineer roles; LinkedIn URL not hyperlinked --- fix for digital applications\"
  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------

**4.4 Job Role Matching Engine**

Using the embeddings generated in Step 5 of the pipeline, the system compares the candidate\'s full profile against a database of common job roles. This helps candidates who are under-applying (taking roles below their level) as much as those who are over-applying.

+--------------------------------------------------------------------------------------------------------------------------------------------------+
| **Job Match Output --- Per Suggested Role**                                                                                                      |
|                                                                                                                                                  |
| -   Match percentage --- calculated as cosine similarity between resume vector and role requirement vector                                       |
|                                                                                                                                                  |
| -   Skills already present --- subset of required skills the candidate demonstrably has                                                          |
|                                                                                                                                                  |
| -   Missing skills --- specific gaps between candidate profile and role requirements, ranked by criticality                                      |
|                                                                                                                                                  |
| -   Competitive position --- estimated percentile vs average candidate applying for this role                                                    |
|                                                                                                                                                  |
| -   Suggested action --- if match is above 75%: apply now + which skills to mention in cover letter. Below 75%: the exact skills to build first. |
+--------------------------------------------------------------------------------------------------------------------------------------------------+

+--------------------------------------------------------------------------------+
| **PHASE 5 Post-Verdict Paths**                                                 |
|                                                                                |
| *Two outcome branches --- selected and not selected --- each fully documented* |
+--------------------------------------------------------------------------------+

**5.1 Path A --- SELECTED**

Resume passes ATS and skill threshold. The system shifts focus from fixing to maximising competitive advantage and preparing for the next stage of the hiring process.

+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **Path A Deliverables**                                                                                                                                                                                        |
|                                                                                                                                                                                                                |
| **A1 --- Resume Polish Report:** Even strong resumes have room for differentiation. 3--5 refinement tips focused on standing out, not baseline compliance.                                                     |
|                                                                                                                                                                                                                |
| **A2 --- Company-Specific ATS Tweaks:** Target company\'s ATS (Workday, Greenhouse, Lever, etc.) has quirks. System delivers format micro-adjustments specific to that system.                                 |
|                                                                                                                                                                                                                |
| **A3 --- Keyword Density Optimisation:** Passing resumes may still be below ideal keyword density. System shows which JD terms to reinforce --- naturally, not stuffed.                                        |
|                                                                                                                                                                                                                |
| **A4 --- Interview Probe Predictions:** Based on resume content vs role requirements, system flags likely interview focus areas: \'Your resume mentions Python but no ML experience --- expect probing here.\' |
|                                                                                                                                                                                                                |
| **A5 --- Cover Letter Angle:** 1--2 unique angles from the resume that would make a strong hook for this specific role and company culture.                                                                    |
|                                                                                                                                                                                                                |
| **A6 --- Download & Apply:** One-click export of full analysis report as PDF. Deep-link to target company\'s careers page for the relevant role where available.                                               |
+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

**5.2 Path B --- NOT SELECTED**

The system does not just report failure. It diagnoses the type of gap --- skill gap, resume presentation gap, or both --- and generates a targeted plan for each. The sub-path routing is automatic based on the processing output.

+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **◆ What type of gap was detected? ◆**                                                                                                                                                                                                      |
|                                                                                                                                                                                                                                             |
| +------------------------------------------------------------------------------------------------------------------+----------------------------------------------------------------------------------------------------------------------+ |
| | **✅ SKILL GAP (has decent resume, lacks skills)**                                                               | **❌ RESUME GAP (has skills, poor presentation)**                                                                    | |
| |                                                                                                                  |                                                                                                                      | |
| | Resume presentation is acceptable --- skills need building. No resume rewrite needed. Route to Learning Roadmap. | Skills are there --- the resume is failing to communicate them. No course plan needed. Route to Resume Rebuild Plan. | |
| +------------------------------------------------------------------------------------------------------------------+----------------------------------------------------------------------------------------------------------------------+ |
+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

**Path B1 --- Skill Gap: Learning Roadmap**

+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| -   Gap Analysis --- exact list of required skills the candidate lacks, ranked by criticality for the target role                                                                           |
|                                                                                                                                                                                             |
| -   Time Estimate per skill --- realistic learning time at 1 hour/day. Example: \'SQL: 3 weeks · System Design: 6 weeks · Docker: 2 weeks\'                                                 |
|                                                                                                                                                                                             |
| -   Learning Path per Skill --- free resources first (documentation, YouTube, GitHub projects), then paid (Coursera, Udemy) with direct links                                               |
|                                                                                                                                                                                             |
| -   Project Suggestions --- specific project ideas that demonstrate each new skill. Not \'learn SQL\' but \'build a sales performance dashboard using SQL + Tableau and host it on GitHub\' |
|                                                                                                                                                                                             |
| -   Resume Integration Tips --- after each project is completed, exactly how to write the bullet point for it to maximise ATS impact                                                        |
|                                                                                                                                                                                             |
| -   Checkpoint Milestones --- progress markers at Week 2, Week 4, Month 2 with projected ATS score at each point: \'At this stage, estimated ATS score improves from 44 to 67\'             |
|                                                                                                                                                                                             |
| -   Re-analysis Reminder --- system sets a calendar prompt (with user permission) to trigger a re-upload at the estimated completion date                                                   |
+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

**Path B2 --- Resume Gap: Rebuild Plan**

+-------------------------------------------------------------------------------------------------------------------------------------------------------+
| -   Section-by-section rebuild instructions --- each weak section gets a specific rewrite guide, not just flags                                       |
|                                                                                                                                                       |
| -   AI-generated bullet rewrites --- for every red-highlighted bullet, AI writes an alternative version that scores green                             |
|                                                                                                                                                       |
| -   Keyword injection map --- exact list of missing keywords, which section to add each to, and how to place them naturally within existing sentences |
|                                                                                                                                                       |
| -   Format correction guide --- step-by-step for switching from two-column / table-heavy / graphic-heavy layouts without losing content               |
|                                                                                                                                                       |
| -   Template recommendation --- based on role and experience level, one specific resume template recommended with a free source link                  |
|                                                                                                                                                       |
| -   Before/after score projection --- \'Applying these changes moves your estimated ATS score from 44 to 79\'                                         |
|                                                                                                                                                       |
| -   One-hour fix checklist --- all changes packaged as a prioritised task list designed to be completable in 60 minutes                               |
+-------------------------------------------------------------------------------------------------------------------------------------------------------+

**Path B3 --- Both Gaps (Most Common Case)**

+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| The majority of users have both resume presentation issues and skill gaps. The system delivers a sequenced dual plan:                                                                                                                       |
|                                                                                                                                                                                                                                             |
| **Phase 1 --- This week:** Fix the resume. Even while building skills, a better-formatted, keyword-richer resume increases callback chances from existing qualifications. Start here because the effort is low and the impact is immediate. |
|                                                                                                                                                                                                                                             |
| **Phase 2 --- Weeks 2--8:** Build missing skills following the learning roadmap. Update the resume as each skill and project is completed. Each update feeds back into the ATS score tracker.                                               |
|                                                                                                                                                                                                                                             |
| **Phase 3 --- Ongoing:** Re-run analysis monthly. Track ATS score progress over time. Apply when projected selection probability reaches the target threshold for the company and role.                                                     |
+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **PHASE 6 Progress Tracking & Return Flows**                          |
|                                                                       |
| *Stickiness mechanism --- measuring growth over time*                 |
+-----------------------------------------------------------------------+

**6.1 Progress Dashboard**

Every analysis is saved to the user\'s account history. The progress dashboard shows ATS score trajectory, skills acquired, keyword gap closure, and how close the candidate is to the selection threshold for their target role. This is what brings users back --- not notifications, but genuine measurable progress.

  ------------------------------------------------------------------------------------------------------------------------------------------------------
  **Metric Tracked**          **How Measured**                                                           **Displayed As**
  --------------------------- -------------------------------------------------------------------------- -----------------------------------------------
  ATS Score trend             Score from each re-analysis for the same target role                       Line chart --- score over time

  Skills acquired             New skills in updated resumes vs original baseline                         Before/after skill map comparison

  Keyword gap closure         JD keywords present now vs on first analysis                               Progress bar per keyword category

  Selection probability       ML-estimated probability of passing ATS for target role                    Percentage with trend arrow

  Resume version history      Every uploaded version stored                                              Version list with ATS score per version

  Placement rate (B2B only)   Track correlation between ATS score threshold and actual interview calls   Admin cohort dashboard for placement officers
  ------------------------------------------------------------------------------------------------------------------------------------------------------

**6.2 Trigger Points for Re-Analysis**

Users are guided to re-upload at specific meaningful moments, not on a timed subscription cycle. Re-analysis is most valuable when there is a real change to measure.

**▸ After completing a course or project**

New skill should now appear in resume --- re-run to confirm ATS picks it up and score reflects the addition

**▸ After a resume format change**

Format fixes change ATS score significantly --- immediate feedback loop reinforces continued improvement behaviour

**▸ After receiving an application rejection**

System asks: ATS rejection or human rejection? Routes to the appropriate fix path based on the answer

**▸ Before applying to a new target company**

Same resume may score differently for different companies --- validate before each new target to avoid wasted applications

**▸ Every 30 days (automated opt-in reminder)**

Monthly progress check --- tracks ATS score drift, new skill additions, and proximity to selection threshold

+-----------------------------------------------------------------------+
| **PHASE 7 Edge Cases & Error Handling**                               |
|                                                                       |
| *Real resumes are messy --- graceful handling at every failure point* |
+-----------------------------------------------------------------------+

**7.1 Document Parsing Edge Cases**

  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Edge Case**                          **System Response**                                                                                     **User Experience**
  -------------------------------------- ------------------------------------------------------------------------------------------------------- ---------------------------------------------------------------------------------------------------------------
  Scanned image PDF (no text layer)      OCR pipeline activated (Tesseract + pre-processing). Accuracy \~88%                                     Warning: \'Scanned document detected --- accuracy may be reduced. Upload a text-based PDF for best results.\'

  Two-column layout                      Column-aware parser reads each column independently then merges in reading order                        Format flag raised in ATS score with specific instruction to switch to single-column

  Tables used for skills section         Table extractor isolates content. Dedicated skills-table parser handles common tech resume formats      Accuracy note shown if table parse confidence below 90%

  Non-English resume                     Language auto-detected. Analysis adapts to detected language. Output always in English                  Notification: \'Resume detected in \[language\] --- analysis adapted accordingly\'

  Very short resume (\< 200 words)       Analysis runs. Length Score heavily penalised. Tips focus on adding content, not cutting                Prominent tip: \'Resume is significantly below recommended length for this role and experience level\'

  Password-protected PDF                 Cannot parse. User immediately notified with clear instructions                                         Error: \'This PDF is password-protected. Remove the password and re-upload.\'

  No Work Experience section (fresher)   AI infers fresher profile. Analysis adapts weighting --- Projects and Education weighted more heavily   No error. Analysis adapts automatically with a note explaining the adjusted evaluation framework

  Corrupted or unreadable file           File validation catches corruption before pipeline entry                                                Specific error: \'This file appears to be corrupted. Please try re-saving and re-uploading.\'
  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**Appendix A: Business Model & Monetisation Logic**

**A1 Free vs Pro Feature Gate**

The free tier is generous enough to demonstrate full value --- a complete ATS score, visual highlights, and the top 5 improvement tips. Gates are placed immediately after the user has seen enough to be convinced of value, not before.

  ---------------------------------------------------------------------------------
  **Feature**                          **Free**           **Pro --- ₹299/month**
  ------------------------------------ ------------------ -------------------------
  Analyses per month                   2                  Unlimited

  ATS Score + sub-scores               ✅ Full            ✅ Full

  Colour-highlighted visual resume     ✅ Full            ✅ Full

  Top 5 improvement tips               ✅ Full            ✅ Full

  Complete improvement tips (all)      First 5 only       ✅ All

  Job Description matching             ❌                 ✅ Full

  Company-specific ATS simulation      Generic model      ✅ Company-specific

  Learning roadmap                     Top 3 gaps         ✅ Full plan + timeline

  Progress tracking over time          ❌                 ✅ Full history

  AI-generated bullet rewrites         1 example          ✅ All bullets

  Interview probe predictions          ❌                 ✅ Included

  Cover letter angle suggestions       ❌                 ✅ Included

  Export full analysis report as PDF   ❌                 ✅ Full report

  Priority AI processing               Standard queue     ✅ Priority queue
  ---------------------------------------------------------------------------------

**A2 Pay-Per-Analysis Option**

For users who need more than 2 analyses but don\'t want a subscription: ₹49 per detailed analysis. This removes the barrier for infrequent users and captures revenue that would otherwise be lost.

**A3 B2B --- College Placement Cell Model**

A single institution licence (₹10,000/month) provides all enrolled students unlimited access. The placement officer gets an admin dashboard with cohort-level intelligence --- not just individual scores.

+-------------------------------------------------------------------------------------------------------------------------------------+
| **B2B Admin Dashboard --- Placement Officer View**                                                                                  |
|                                                                                                                                     |
| -   Cohort ATS readiness --- percentage of students above the 60/100 threshold for their target roles                               |
|                                                                                                                                     |
| -   Most common skill gaps across the cohort --- directly drives which pre-placement workshops to run                               |
|                                                                                                                                     |
| -   Student-level drill-down --- officer can view individual student analysis and guide specific students                           |
|                                                                                                                                     |
| -   Company-specific readiness --- \'How many students are currently ready for a Google SWE role?\'                                 |
|                                                                                                                                     |
| -   Historical placement correlation --- tracks which ATS score thresholds correlate with actual interview calls received by alumni |
+-------------------------------------------------------------------------------------------------------------------------------------+

**Appendix B: Strong vs Weak Resume Signals**

These are the signal patterns the AI is trained to identify and score. Understanding this table is understanding how the ATS Score is produced.

+---------------------------------------------------------------------------------------------+------------------------------------------------------------------------------+
| **✅ STRONG RESUME SIGNALS**                                                                | **❌ WEAK RESUME SIGNALS**                                                   |
+---------------------------------------------------------------------------------------------+------------------------------------------------------------------------------+
| -   Bullet points begin with strong action verbs (Led, Built, Designed, Delivered, Reduced) | -   \'Responsible for\' and \'Worked on\' dominate --- no ownership language |
|                                                                                             |                                                                              |
| -   Every achievement has a specific number, percentage, or scale attached                  | -   Achievements stated without numbers, scope, or outcomes                  |
|                                                                                             |                                                                              |
| -   Keywords match the target industry and role naturally --- not stuffed                   | -   Skills section exists but none appear in experience bullets              |
|                                                                                             |                                                                              |
| -   Clean single-column format with standard section headings                               | -   Two-column layout, graphics, icons, or tables used                       |
|                                                                                             |                                                                              |
| -   Consistent date formatting throughout all entries                                       | -   Inconsistent date formats across experience entries                      |
|                                                                                             |                                                                              |
| -   Right length for experience level --- 1 page fresher, 2 pages experienced               | -   3+ pages for under 3 years of experience                                 |
|                                                                                             |                                                                              |
| -   LinkedIn and GitHub present for tech roles                                              | -   Generic objective statement at the top (wasted prime real estate)        |
|                                                                                             |                                                                              |
| -   Projects section present for fresher profiles                                           | -   Professional email not used (e.g. coolkid99@gmail.com)                   |
|                                                                                             |                                                                              |
| -   Skills listed and corroborated by experience bullets                                    | -   No Projects section for a candidate with under 1 year of experience      |
+---------------------------------------------------------------------------------------------+------------------------------------------------------------------------------+

**End-to-End Flow Summary**

Every step a user takes from first landing to job-readiness, in sequence:

  -------- -------------- ----------------------------------------------------------------------
  **01**   **Homepage**   Land on homepage → value prop in 5 sec → click \'Analyse My Resume\'

  -------- -------------- ----------------------------------------------------------------------

  -------- ------------ --------------------------------------------------------------
  **02**   **Auth**     Continue as guest (1 free) / Sign up (2 free/month) / Go Pro

  -------- ------------ --------------------------------------------------------------

  -------- ------------ ------------------------------------------------------------------
  **03**   **Upload**   Drag/drop PDF → format validated → no errors → proceed to inputs

  -------- ------------ ------------------------------------------------------------------

  -------- ------------------- -------------------------------------------------------------
  **04**   **Target Inputs**   Enter company + role + answer 4--6 dynamic intake questions

  -------- ------------------- -------------------------------------------------------------

  -------- -------------- ------------------------------------------------------------------------
  **05**   **JD Paste**   Optional: paste specific job description → activates JD Matcher module

  -------- -------------- ------------------------------------------------------------------------

  -------- ----------------- ------------------------------------------------------------------------------------------
  **06**   **AI Pipeline**   10--20s processing: Parse → NLP → Classify → Extract → Embed → Simulate → Generate → Map

  -------- ----------------- ------------------------------------------------------------------------------------------

  -------- -------------------- -----------------------------------------------------------------
  **07**   **Verdict Screen**   SELECTED or NOT SELECTED --- confidence % + 3 reasoning factors

  -------- -------------------- -----------------------------------------------------------------

  -------- --------------- -----------------------------------------------------------------------------
  **08**   **Dashboard**   Full results: visual resume + ATS score + skills map + 6-tab analysis panel

  -------- --------------- -----------------------------------------------------------------------------

  --------- -------------------- ------------------------------------------------------------------------------------
  **09A**   **Path: Selected**   Resume polish + company ATS tweaks + interview probes + cover letter angle + apply

  --------- -------------------- ------------------------------------------------------------------------------------

  --------- --------------------- --------------------------------------------------------------------------------------------
  **09B**   **Path: Skill Gap**   Personalised learning roadmap + project ideas + timeline + milestones + resume integration

  --------- --------------------- --------------------------------------------------------------------------------------------

  --------- ---------------------- ----------------------------------------------------------------------------------------
  **09C**   **Path: Resume Gap**   Section-by-section rebuild + AI rewrites + keyword map + format guide + 1-hr checklist

  --------- ---------------------- ----------------------------------------------------------------------------------------

  --------- --------------------- ------------------------------------------------------------------------------------------
  **09D**   **Path: Both Gaps**   Sequenced plan: fix resume this week → build skills over 4--8 weeks → re-analyse monthly

  --------- --------------------- ------------------------------------------------------------------------------------------

  -------- -------------- ------------------------------------------------------------------------------------------
  **10**   **Progress**   Return to dashboard → re-upload updated resume → measure ATS score improvement over time

  -------- -------------- ------------------------------------------------------------------------------------------

  -------- ------------ ------------------------------------------------------------------------------------
  **11**   **Repeat**   Loop until ATS score + skill match hit selection threshold → apply with confidence

  -------- ------------ ------------------------------------------------------------------------------------

*\"95% of resumes never reach a human --- they\'re rejected by a robot.*

*ResumeIQ shows you exactly what the robot sees --- and how to beat it.\"*

**--- PROJECT_AI_RESUME_ANALYZER Core Mission**
