// Demo data for /demo page — Rahul Sharma, Software Engineer

export const DEMO_RESULT = {
    id: 'demo-analysis-rahul',
    resume_id: 'demo-resume-rahul',
    user_id: null,
    target_companies: ['Google', 'TCS'],
    target_role: 'Software Engineer',
    experience_level: 'junior',
    urgency: 6,
    weakness: 'Missing Docker, Kubernetes, System Design skills',
    status: 'complete',
    share_token: 'demo-share-token',
    created_at: '2026-03-08T10:00:00Z',
    results: {
        ats_score: 62,
        ats_breakdown: {
            keyword_match: 55,
            format_structure: 70,
            contact_info: 80,
            resume_length: 65,
            consistency: 58,
        },
        skills_found: [
            { name: 'Python', proficiency: 'intermediate', type: 'explicit' },
            { name: 'React', proficiency: 'intermediate', type: 'explicit' },
            { name: 'Git', proficiency: 'expert', type: 'explicit' },
            { name: 'JavaScript', proficiency: 'beginner', type: 'explicit' },
            { name: 'SQL', proficiency: 'beginner', type: 'explicit' },
        ],
        skills_missing: [
            { name: 'Docker', importance: 'critical', reason: 'Container orchestration essential for modern SWE roles at Google' },
            { name: 'Kubernetes', importance: 'critical', reason: 'Required for cloud-native deployments at Google' },
            { name: 'System Design', importance: 'high', reason: 'Core interview component at Google; not demonstrated in resume' },
            { name: 'Java', importance: 'high', reason: 'Primary backend language used internally at Google' },
            { name: 'Distributed Systems', importance: 'medium', reason: 'Expected conceptual knowledge for SWE at Google scale' },
        ],
        selection_verdict: 'not_selected',
        selection_confidence: 71,
        category: 'B',
        improvement_tips: [
            {
                impact: 'high',
                title: 'Quantify your startup experience',
                current_text: 'Built features for the product at a startup',
                improved_text: 'Developed and shipped 8+ product features in React + Python at a 15-person startup, increasing user retention by 20%',
                explanation: 'Startup experience is valuable, but needs numbers. Vague bullets are filtered by ATS before a human ever reads them.',
            },
            {
                impact: 'high',
                title: 'Expand technical skills section with specificity',
                current_text: 'Skills: Python, React, SQL, Git',
                improved_text: 'Languages: Python, JavaScript (ES6+), SQL | Frameworks: React.js, Node.js (basic) | Tools: Git, GitHub, VS Code | Databases: MySQL, SQLite',
                explanation: 'Detailed skill categories improve ATS keyword matching by 30–40% for entry-level roles.',
            },
            {
                impact: 'medium',
                title: 'Add a targeted professional summary',
                current_text: 'Software Engineer with 2 years experience at a startup',
                improved_text: 'Software Engineer with 2 years building user-facing products in React + Python. Passionate about scalable systems. Seeking SWE role to grow in cloud-native and distributed systems at scale.',
                explanation: 'A tailored summary signals intent and helps ATS match you to the role description.',
            },
            {
                impact: 'quick_win',
                title: 'Add GitHub and LinkedIn to contact info',
                current_text: 'Email, phone only',
                improved_text: 'Email | Phone | github.com/rahulsharma | linkedin.com/in/rahulsharma',
                explanation: 'Entry-level SWE roles at Google expect a GitHub profile showing projects. Missing it is an automatic red flag.',
            },
        ],
        learning_plan: [
            {
                week: 'Week 1–2',
                skill: 'System Design Fundamentals',
                priority: 'critical',
                why: 'Foundation for Google interviews and production thinking',
                resource: 'https://www.educative.io/courses/grokking-the-system-design-interview',
                hours: 14,
                project: 'Design a URL shortener with scalability considerations',
                completed: false,
            },
            {
                week: 'Week 2–3',
                skill: 'Docker',
                priority: 'critical',
                why: 'Containerization is expected for any SWE role at Google',
                resource: 'https://docs.docker.com/get-started/',
                hours: 10,
                project: 'Dockerize your existing React + Python app',
                completed: false,
            },
            {
                week: 'Week 3–4',
                skill: 'Distributed Systems',
                priority: 'high',
                why: 'Core conceptual knowledge for SWE interviews at top companies',
                resource: 'https://www.youtube.com/c/ByteByteGo',
                hours: 12,
                project: 'Study CAP theorem, consensus algorithms, and message queues',
                completed: false,
            },
            {
                week: 'Week 5–6',
                skill: 'Java Basics',
                priority: 'high',
                why: 'Primary language for Google internal systems; signals breadth',
                resource: 'https://www.codecademy.com/learn/learn-java',
                hours: 16,
                project: 'Port one of your Python scripts to Java',
                completed: false,
            },
            {
                week: 'Week 7–8',
                skill: 'Kubernetes (K8s)',
                priority: 'medium',
                why: 'Orchestrating containers at scale — expected at Google-level projects',
                resource: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/',
                hours: 12,
                project: 'Deploy your Dockerized app to a local minikube cluster',
                completed: false,
            },
        ],
        highlight_map: [
            { text: 'Python, React, basic SQL, git', color: 'yellow', tooltip: 'Skills listed but too vague — expand with proficiency levels and specific frameworks' },
            { text: '2 years experience at a startup', color: 'green', tooltip: 'Startup experience is valued! Add specific product impact and team size.' },
            { text: 'Software Engineer', color: 'green', tooltip: 'Clear role title — good for ATS matching' },
        ],
        raw_text: `RAHUL SHARMA
Software Engineer
rahul.sharma@email.com | +91 99887 76655

PROFESSIONAL SUMMARY
Software Engineer with 2 years experience at a startup. Passionate about building products and learning new technologies.

WORK EXPERIENCE

Software Engineer — QuickBuild Technologies (2024 - Present)
• Built features for the main product using Python and React
• Worked on the backend API and database queries
• Collaborated with design team on UI components

EDUCATION
B.Tech Computer Science — NIT Trichy (2020 - 2024)
GPA: 7.8/10

SKILLS
Python, React, basic SQL, git

PROJECTS
Personal Portfolio — React
Task Manager App — Python, SQLite`,
    },
}

export const DEMO_COMPANY_VERDICTS: Record<string, { verdict: string; confidence: number; role: string }> = {
    Google: { verdict: 'not_selected', confidence: 71, role: 'Software Engineer' },
    TCS: { verdict: 'selected', confidence: 78, role: 'Software Engineer' },
}
