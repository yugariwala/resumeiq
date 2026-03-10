// Mock analysis result data for development
export const MOCK_RESULT = {
    id: 'mock-analysis-1',
    resume_id: 'mock-resume-1',
    user_id: null,
    target_companies: ['Google', 'Microsoft'],
    target_role: 'Software Engineer',
    experience_level: 'mid',
    urgency: 7,
    weakness: 'No open source contributions',
    status: 'complete',
    share_token: 'abc123-share-token',
    created_at: '2026-03-07T12:00:00Z',
    results: {
        ats_score: 72,
        ats_breakdown: {
            keyword_match: 68,
            format_structure: 82,
            contact_info: 95,
            resume_length: 70,
            consistency: 60,
        },
        skills_found: [
            { name: 'React', proficiency: 'expert', type: 'explicit' },
            { name: 'TypeScript', proficiency: 'expert', type: 'explicit' },
            { name: 'Node.js', proficiency: 'advanced', type: 'explicit' },
            { name: 'Python', proficiency: 'intermediate', type: 'explicit' },
            { name: 'PostgreSQL', proficiency: 'advanced', type: 'explicit' },
            { name: 'Git', proficiency: 'expert', type: 'explicit' },
            { name: 'REST APIs', proficiency: 'expert', type: 'implicit' },
            { name: 'Agile', proficiency: 'advanced', type: 'implicit' },
            { name: 'CI/CD', proficiency: 'intermediate', type: 'implicit' },
            { name: 'Docker', proficiency: 'beginner', type: 'explicit' },
            { name: 'AWS', proficiency: 'beginner', type: 'explicit' },
            { name: 'System Design', proficiency: 'intermediate', type: 'implicit' },
            { name: 'JavaScript', proficiency: 'expert', type: 'explicit' },
            { name: 'HTML/CSS', proficiency: 'expert', type: 'explicit' },
            { name: 'MongoDB', proficiency: 'intermediate', type: 'explicit' },
            { name: 'Redux', proficiency: 'advanced', type: 'explicit' },
            { name: 'Testing', proficiency: 'intermediate', type: 'implicit' },
            { name: 'Leadership', proficiency: 'intermediate', type: 'implicit' },
        ],
        skills_missing: [
            { name: 'Kubernetes', importance: 'critical', reason: 'Required for DevOps Engineer at Google — mentioned in 90% of JDs' },
            { name: 'GraphQL', importance: 'high', reason: 'Modern API standard used by Google internally' },
            { name: 'Terraform', importance: 'high', reason: 'IaC tool for cloud infrastructure management' },
            { name: 'Go', importance: 'medium', reason: 'Preferred backend language at Google for microservices' },
            { name: 'gRPC', importance: 'medium', reason: 'Internal Google RPC framework, shows familiarity' },
            { name: 'Machine Learning', importance: 'medium', reason: 'ML familiarity valued for SWE roles at Google' },
        ],
        selection_verdict: 'selected',
        selection_confidence: 87,
        category: 'A',
        improvement_tips: [
            {
                impact: 'high',
                title: 'Add quantified achievements to work experience',
                current_text: 'Developed frontend features for the dashboard',
                improved_text: 'Developed 12+ frontend features for the analytics dashboard, reducing load time by 40% and increasing user engagement by 25%',
                explanation: 'ATS systems prioritize measurable impact. Adding numbers makes your contributions concrete and comparable.',
            },
            {
                impact: 'high',
                title: 'Strengthen action verbs in experience bullets',
                current_text: 'Helped with backend API development',
                improved_text: 'Architected and deployed 8 RESTful API endpoints serving 50K+ daily requests with 99.9% uptime',
                explanation: 'Replace passive verbs with strong action verbs. "Architected" and "Deployed" signal ownership and impact.',
            },
            {
                impact: 'medium',
                title: 'Add technical skills section with keywords',
                current_text: 'Skills: React, Node.js, Python',
                improved_text: 'Technical Skills: React.js, TypeScript, Node.js, Python, PostgreSQL, Docker, AWS (EC2, S3, Lambda), Git, CI/CD, REST APIs, Agile/Scrum',
                explanation: 'Expand your skills section with specific technologies. ATS systems match keywords exactly.',
            },
            {
                impact: 'quick_win',
                title: 'Add GitHub and portfolio links',
                current_text: 'Contact: email, phone',
                improved_text: 'Contact: email | phone | linkedin.com/in/yourname | github.com/yourname | portfolio.dev',
                explanation: 'Technical roles expect GitHub/portfolio. Missing these signals incomplete profile.',
            },
            {
                impact: 'medium',
                title: 'Restructure professional summary',
                current_text: 'Experienced software developer looking for new opportunities',
                improved_text: 'Full-stack Software Engineer with 4+ years building scalable web apps (React, Node.js, TypeScript). Delivered features used by 100K+ users. Seeking SWE role at Google to apply distributed systems expertise.',
                explanation: 'Tailor summary to target role. Mention company name, key tech, and measurable experience.',
            },
        ],
        learning_plan: [
            {
                week: 'Week 1-2',
                skill: 'Kubernetes',
                priority: 'critical',
                why: 'Core orchestration tool for Google Cloud workloads',
                resource: 'https://kubernetes.io/docs/tutorials/',
                hours: 15,
                project: 'Deploy a 3-service microapp on minikube',
                completed: false,
            },
            {
                week: 'Week 2-3',
                skill: 'GraphQL',
                priority: 'high',
                why: 'Modern query language replacing REST in many Google services',
                resource: 'https://graphql.org/learn/',
                hours: 10,
                project: 'Build a GraphQL API wrapper for an existing REST API',
                completed: false,
            },
            {
                week: 'Week 3-4',
                skill: 'Terraform',
                priority: 'high',
                why: 'Infrastructure as Code for cloud provisioning',
                resource: 'https://learn.hashicorp.com/terraform',
                hours: 12,
                project: 'Provision a GCP project with Terraform modules',
                completed: false,
            },
            {
                week: 'Week 5-6',
                skill: 'Go',
                priority: 'medium',
                why: 'Google\'s preferred backend language for many services',
                resource: 'https://go.dev/tour/',
                hours: 20,
                project: 'Build a CLI tool or HTTP server in Go',
                completed: false,
            },
        ],
        highlight_map: [
            { text: 'Led a team of 5 engineers to deliver a critical payment integration', color: 'green', tooltip: 'Excellent! Leadership + team size + impact area mentioned' },
            { text: 'resulting in 30% increase in transaction success rate', color: 'green', tooltip: 'Great quantified achievement with measurable impact' },
            { text: 'Developed frontend features for the dashboard', color: 'yellow', tooltip: 'Too vague — add specific feature count and measurable outcomes' },
            { text: 'Helped with backend API development', color: 'red', tooltip: 'Passive language. Replace "helped with" with direct action verbs like "Architected" or "Built"' },
            { text: 'Experienced software developer looking for new opportunities', color: 'red', tooltip: 'Generic summary. Tailor to target role with specific tech stack and achievements' },
            { text: 'Built responsive UI components using React and TypeScript', color: 'green', tooltip: 'Good use of specific technologies and action verb' },
            { text: 'Implemented CI/CD pipeline using GitHub Actions', color: 'green', tooltip: 'Shows DevOps awareness — valued at Google' },
            { text: 'Skills: React, Node.js, Python', color: 'yellow', tooltip: 'Too brief — expand with specific frameworks, cloud services, and tools' },
            { text: 'Optimized database queries reducing response time by 60%', color: 'green', tooltip: 'Strong quantified improvement — exactly what ATS looks for' },
            { text: 'Worked on various projects', color: 'red', tooltip: 'Extremely vague. Replace with specific project names, tech used, and outcomes' },
            { text: 'Managed deployment pipelines for production releases', color: 'green', tooltip: 'Good DevOps experience signal' },
            { text: 'Participated in code reviews and mentoring', color: 'yellow', tooltip: 'Good but could be stronger — add frequency and impact of mentoring' },
        ],
        raw_text: `JOHN DOE
Software Engineer
john.doe@email.com | +91 98765 43210

PROFESSIONAL SUMMARY
Experienced software developer looking for new opportunities in a challenging environment where I can leverage my skills.

WORK EXPERIENCE

Senior Frontend Developer — TechCorp Inc. (2023 - Present)
• Led a team of 5 engineers to deliver a critical payment integration resulting in 30% increase in transaction success rate
• Built responsive UI components using React and TypeScript
• Implemented CI/CD pipeline using GitHub Actions
• Managed deployment pipelines for production releases
• Optimized database queries reducing response time by 60%

Software Developer — WebStudio (2021 - 2023)
• Developed frontend features for the dashboard
• Helped with backend API development
• Participated in code reviews and mentoring
• Worked on various projects

EDUCATION
B.Tech Computer Science — IIT Delhi (2017 - 2021)
GPA: 8.2/10

SKILLS
Skills: React, Node.js, Python

PROJECTS
Personal Portfolio Website — React, Tailwind CSS
E-Commerce Platform — Node.js, MongoDB, Express`,
    },
}

// Per-company verdict data
export const MOCK_COMPANY_VERDICTS: Record<
    string,
    { verdict: string; confidence: number; role: string }
> = {
    Google: { verdict: 'selected', confidence: 87, role: 'Software Engineer' },
    Microsoft: { verdict: 'not_selected', confidence: 73, role: 'Software Engineer' },
}
