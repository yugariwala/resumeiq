"""
Role-specific keyword sets and company tier data.
Used in ATS scoring (Step 4) and selection prediction (Step 5).
"""

# Required/expected keywords per role
ROLE_KEYWORDS: dict[str, list[str]] = {
    "Software Engineer": [
        "Python", "Java", "JavaScript", "TypeScript", "React", "Node.js",
        "SQL", "Git", "REST API", "Docker", "AWS", "CI/CD",
        "Data Structures", "Algorithms", "System Design", "Linux",
        "Testing", "Agile", "Microservices", "Cloud",
    ],
    "Data Scientist": [
        "Python", "R", "SQL", "Machine Learning", "Deep Learning",
        "TensorFlow", "PyTorch", "Pandas", "NumPy", "Statistics",
        "Data Visualization", "Tableau", "Scikit-learn", "NLP",
        "A/B Testing", "Feature Engineering", "Jupyter", "Spark",
        "Big Data", "Data Pipeline",
    ],
    "Product Manager": [
        "Product Strategy", "Roadmap", "User Research", "A/B Testing",
        "Analytics", "KPIs", "Stakeholder Management", "Agile", "Scrum",
        "PRD", "User Stories", "Wireframes", "SQL", "Data Analysis",
        "Market Research", "Competitive Analysis", "Go-to-Market",
        "OKRs", "Cross-functional", "Prioritization",
    ],
    "DevOps Engineer": [
        "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Terraform",
        "CI/CD", "Jenkins", "GitHub Actions", "Linux", "Ansible",
        "Monitoring", "Prometheus", "Grafana", "Shell Scripting",
        "Microservices", "Networking", "Security", "IaC", "Helm",
    ],
    "ML Engineer": [
        "Python", "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning",
        "MLflow", "Docker", "Kubernetes", "AWS", "GCP",
        "Model Deployment", "Feature Engineering", "Data Pipeline",
        "NLP", "Computer Vision", "A/B Testing", "Spark",
        "SQL", "REST API", "CI/CD",
    ],
    "Business Analyst": [
        "SQL", "Excel", "Tableau", "Power BI", "Data Analysis",
        "Requirements Gathering", "Stakeholder Management", "Agile",
        "JIRA", "Documentation", "Process Improvement", "KPIs",
        "Business Strategy", "Communication", "Presentation Skills",
        "Data Visualization", "Reporting", "Project Management",
        "Critical Thinking", "Problem Solving",
    ],
    "UX Designer": [
        "Figma", "Sketch", "Adobe XD", "User Research", "Wireframes",
        "Prototyping", "Usability Testing", "Design Systems",
        "Information Architecture", "Interaction Design",
        "Visual Design", "Accessibility", "HTML", "CSS",
        "Design Thinking", "User Flows", "Personas",
        "Responsive Design", "Mobile Design", "A/B Testing",
    ],
    "Marketing Manager": [
        "SEO", "SEM", "Google Analytics", "Content Marketing",
        "Social Media", "Email Marketing", "CRM", "HubSpot",
        "Copywriting", "Brand Strategy", "Campaign Management",
        "A/B Testing", "Marketing Automation", "Lead Generation",
        "Market Research", "Budget Management", "KPIs",
        "Google Ads", "Facebook Ads", "Data Analysis",
    ],
    "HR Manager": [
        "Recruitment", "Talent Acquisition", "Employee Relations",
        "Performance Management", "HRIS", "Onboarding",
        "Training and Development", "Compensation and Benefits",
        "Labor Law", "Diversity and Inclusion", "Employee Engagement",
        "Stakeholder Management", "Communication", "Conflict Resolution",
        "SAP", "Workday", "ATS", "Policy Development",
        "Change Management", "Leadership",
    ],
    "Finance Analyst": [
        "Financial Modeling", "Excel", "SQL", "Tableau", "Power BI",
        "Forecasting", "Budgeting", "Variance Analysis", "P&L",
        "Cash Flow", "Financial Reporting", "ERP", "SAP",
        "Risk Management", "Valuation", "DCF", "Bloomberg",
        "Accounting", "GAAP", "Data Analysis",
    ],
    "Full Stack Developer": [
        "JavaScript", "TypeScript", "React", "Node.js", "Express",
        "Python", "SQL", "PostgreSQL", "MongoDB", "REST API",
        "GraphQL", "Docker", "AWS", "Git", "CI/CD",
        "HTML", "CSS", "Tailwind", "Testing", "Agile",
    ],
    "Backend Engineer": [
        "Python", "Java", "Go", "Node.js", "SQL", "PostgreSQL",
        "MongoDB", "Redis", "REST API", "GraphQL", "Docker",
        "Kubernetes", "AWS", "Microservices", "CI/CD",
        "System Design", "Message Queue", "Kafka", "Linux", "Git",
    ],
    "Frontend Developer": [
        "JavaScript", "TypeScript", "React", "Vue", "Angular",
        "HTML", "CSS", "Tailwind", "Responsive Design",
        "REST API", "GraphQL", "Git", "Testing", "Jest",
        "Webpack", "Vite", "Performance Optimization",
        "Accessibility", "Design Systems", "Figma",
    ],
    "Cloud Architect": [
        "AWS", "GCP", "Azure", "Terraform", "Kubernetes", "Docker",
        "Microservices", "Serverless", "Networking", "Security",
        "CI/CD", "IaC", "System Design", "Cost Optimization",
        "High Availability", "Disaster Recovery", "Load Balancing",
        "VPC", "IAM", "Monitoring",
    ],
    "Data Engineer": [
        "Python", "SQL", "Spark", "Kafka", "Airflow", "ETL",
        "Data Pipeline", "Data Warehousing", "Snowflake", "BigQuery",
        "AWS", "GCP", "Docker", "Kubernetes", "dbt",
        "Data Modeling", "PostgreSQL", "MongoDB", "Hadoop", "Linux",
    ],
    "QA Engineer": [
        "Selenium", "Cypress", "Testing", "Test Automation",
        "Manual Testing", "API Testing", "Postman", "JUnit",
        "Performance Testing", "Load Testing", "JIRA",
        "Agile", "CI/CD", "Python", "Java", "SQL",
        "Test Plans", "Bug Tracking", "Regression Testing", "Git",
    ],
    "Security Engineer": [
        "Security", "Penetration Testing", "Vulnerability Assessment",
        "SIEM", "Firewall", "IDS/IPS", "OAuth", "JWT",
        "Encryption", "SSL/TLS", "Linux", "Python",
        "AWS Security", "Cloud Security", "DevSecOps",
        "Compliance", "SOC 2", "ISO 27001", "OWASP", "Networking",
    ],
    "Mobile Developer": [
        "Swift", "Kotlin", "React Native", "Flutter", "Dart",
        "iOS", "Android", "Mobile Design", "REST API",
        "Firebase", "Push Notifications", "App Store",
        "Git", "CI/CD", "Testing", "Agile",
        "Performance Optimization", "Accessibility", "SQLite", "GraphQL",
    ],
    "Technical Writer": [
        "Technical Writing", "Documentation", "API Documentation",
        "Markdown", "Git", "JIRA", "Confluence",
        "Content Strategy", "User Guides", "Release Notes",
        "Editing", "Proofreading", "Information Architecture",
        "HTML", "CSS", "Swagger", "OpenAPI",
        "Communication", "Research", "Audience Analysis",
    ],
    "Project Manager": [
        "Project Management", "Agile", "Scrum", "Kanban",
        "JIRA", "MS Project", "Stakeholder Management",
        "Budget Management", "Risk Management", "Communication",
        "Resource Planning", "Timeline Management", "Reporting",
        "Cross-functional Collaboration", "PMP", "PRINCE2",
        "Change Management", "Vendor Management", "OKRs", "KPIs",
    ],
    "Content Writer": [
        "Content Writing", "SEO", "Copywriting", "Blog Writing",
        "Content Strategy", "Social Media", "Editing", "Proofreading",
        "WordPress", "CMS", "Google Analytics", "Email Marketing",
        "Brand Voice", "Storytelling", "Research", "Audience Analysis",
        "Content Calendar", "A/B Testing", "Grammar", "AP Style",
    ],
    "Sales Manager": [
        "Sales Strategy", "CRM", "Salesforce", "Lead Generation",
        "Pipeline Management", "Negotiation", "B2B Sales", "B2C Sales",
        "Revenue Growth", "Client Relationship", "Account Management",
        "Forecasting", "Quota Attainment", "Cold Calling",
        "Presentation Skills", "Communication", "Team Leadership",
        "Market Analysis", "Contract Negotiation", "KPIs",
    ],
    "Operations Manager": [
        "Operations Management", "Process Improvement", "Supply Chain",
        "Lean", "Six Sigma", "Project Management", "Budget Management",
        "Vendor Management", "Logistics", "Inventory Management",
        "Quality Assurance", "KPIs", "Team Leadership", "Reporting",
        "ERP", "SAP", "Communication", "Stakeholder Management",
        "Risk Management", "Change Management",
    ],
}

# Company tier thresholds — min ATS score to be competitive
COMPANY_TIERS: dict[str, dict] = {
    # Tier 1 — FAANG+ and top startups (min ATS 72)
    "Google": {"tier": 1, "min_ats": 72},
    "Meta": {"tier": 1, "min_ats": 72},
    "Microsoft": {"tier": 1, "min_ats": 72},
    "Amazon": {"tier": 1, "min_ats": 72},
    "Apple": {"tier": 1, "min_ats": 72},
    "Netflix": {"tier": 1, "min_ats": 72},
    "Stripe": {"tier": 1, "min_ats": 72},
    "Uber": {"tier": 1, "min_ats": 72},
    "Airbnb": {"tier": 1, "min_ats": 72},
    "DeepMind": {"tier": 1, "min_ats": 72},
    "OpenAI": {"tier": 1, "min_ats": 72},
    "Anthropic": {"tier": 1, "min_ats": 72},
    "Palantir": {"tier": 1, "min_ats": 72},
    "Databricks": {"tier": 1, "min_ats": 72},
    "Snowflake": {"tier": 1, "min_ats": 72},
    # Tier 2 — large service/consulting companies (min ATS 58)
    "Infosys": {"tier": 2, "min_ats": 58},
    "TCS": {"tier": 2, "min_ats": 58},
    "Wipro": {"tier": 2, "min_ats": 58},
    "Accenture": {"tier": 2, "min_ats": 58},
    "Cognizant": {"tier": 2, "min_ats": 58},
    "HCL": {"tier": 2, "min_ats": 58},
    "Tech Mahindra": {"tier": 2, "min_ats": 58},
    "Capgemini": {"tier": 2, "min_ats": 58},
    "IBM": {"tier": 2, "min_ats": 58},
    "Deloitte": {"tier": 2, "min_ats": 58},
    "EY": {"tier": 2, "min_ats": 58},
    "PwC": {"tier": 2, "min_ats": 58},
    "KPMG": {"tier": 2, "min_ats": 58},
    "McKinsey": {"tier": 2, "min_ats": 58},
    "BCG": {"tier": 2, "min_ats": 58},
}

# Default tier for companies not in the dict
DEFAULT_TIER = {"tier": 3, "min_ats": 45}

# Experience level expectations
EXPERIENCE_IDEAL_PAGES: dict[str, tuple[int, int]] = {
    "fresher": (1, 1),
    "early": (1, 2),
    "mid": (1, 2),
    "senior": (2, 3),
}
