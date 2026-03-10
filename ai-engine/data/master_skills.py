"""
Master skills database — 200+ skills across 7 categories.
Used for explicit/implicit skill extraction in Step 3.
"""

MASTER_SKILLS: dict[str, list[str]] = {
    "programming": [
        "Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "C",
        "Go", "Rust", "Swift", "Kotlin", "PHP", "Ruby", "R", "MATLAB",
        "Scala", "Perl", "Haskell", "Elixir", "Dart", "Lua", "Julia",
        "Objective-C", "Assembly", "COBOL", "Fortran", "Groovy", "Clojure",
        "Shell Scripting", "Bash", "PowerShell", "VBA",
    ],
    "web": [
        "React", "React.js", "Angular", "Vue", "Vue.js", "Next.js",
        "Nuxt.js", "Node.js", "Express", "Express.js", "Django", "FastAPI",
        "Flask", "Spring Boot", "Spring", "Laravel", "Rails", "Ruby on Rails",
        "ASP.NET", ".NET", "Svelte", "SvelteKit", "Remix", "Gatsby",
        "jQuery", "Bootstrap", "Tailwind CSS", "Tailwind", "Material UI",
        "Chakra UI", "HTML", "HTML5", "CSS", "CSS3", "SASS", "SCSS",
        "LESS", "Webpack", "Vite", "Babel", "REST", "REST API", "RESTful",
        "GraphQL", "gRPC", "WebSocket", "WebSockets", "OAuth", "JWT",
        "Nginx", "Apache", "WordPress", "Shopify", "Webflow",
    ],
    "data": [
        "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Cassandra",
        "Elasticsearch", "DynamoDB", "SQLite", "MariaDB", "Oracle DB",
        "Oracle", "SQL Server", "MSSQL", "Firebase", "Firestore",
        "Supabase", "Prisma", "Sequelize", "TypeORM", "Mongoose",
        "Pandas", "NumPy", "Matplotlib", "Seaborn", "Plotly",
        "Tableau", "Power BI", "Looker", "Metabase", "Grafana",
        "Apache Spark", "Spark", "Hadoop", "Hive", "Kafka",
        "Apache Kafka", "Airflow", "Apache Airflow", "dbt", "Snowflake",
        "BigQuery", "Redshift", "Data Warehousing", "ETL", "Data Pipeline",
        "Data Modeling", "Data Visualization",
    ],
    "cloud": [
        "AWS", "Amazon Web Services", "GCP", "Google Cloud", "Google Cloud Platform",
        "Azure", "Microsoft Azure", "Docker", "Kubernetes", "K8s",
        "Terraform", "Ansible", "Puppet", "Chef", "CloudFormation",
        "CI/CD", "Jenkins", "GitHub Actions", "GitLab CI", "CircleCI",
        "Travis CI", "ArgoCD", "Helm", "Istio", "Linux", "Ubuntu",
        "CentOS", "EC2", "S3", "Lambda", "ECS", "EKS", "Fargate",
        "CloudFront", "Route 53", "VPC", "IAM", "RDS",
        "Serverless", "Microservices", "Service Mesh",
        "Monitoring", "Prometheus", "Datadog", "New Relic",
        "ELK Stack", "Splunk", "PagerDuty",
        "DevOps", "SRE", "Infrastructure as Code", "IaC",
    ],
    "ml_ai": [
        "TensorFlow", "PyTorch", "Scikit-learn", "Keras", "XGBoost",
        "LightGBM", "CatBoost", "Hugging Face", "Transformers",
        "NLP", "Natural Language Processing", "Computer Vision", "OpenCV",
        "LLMs", "Large Language Models", "GPT", "BERT", "RAG",
        "Retrieval Augmented Generation", "LangChain", "LlamaIndex",
        "MLflow", "Kubeflow", "SageMaker", "Vertex AI",
        "Machine Learning", "Deep Learning", "Neural Networks",
        "Reinforcement Learning", "Supervised Learning", "Unsupervised Learning",
        "Feature Engineering", "Model Deployment", "A/B Testing",
        "Statistics", "Linear Algebra", "Probability",
        "Recommendation Systems", "Time Series", "Anomaly Detection",
        "Generative AI", "Prompt Engineering", "Fine-tuning",
        "ONNX", "TensorRT", "Edge AI",
    ],
    "tools": [
        "Git", "GitHub", "GitLab", "Bitbucket", "SVN",
        "Jira", "Confluence", "Notion", "Trello", "Asana",
        "Slack", "Microsoft Teams",
        "Figma", "Sketch", "Adobe XD", "Photoshop", "Illustrator",
        "After Effects", "Premiere Pro", "Canva",
        "Excel", "Google Sheets", "SAP", "Salesforce", "HubSpot",
        "Zendesk", "Intercom", "Stripe", "Twilio",
        "Postman", "Insomnia", "Swagger", "OpenAPI",
        "VS Code", "IntelliJ", "PyCharm", "Vim",
        "Android Studio", "Xcode",
        "Selenium", "Cypress", "Playwright", "Jest", "Mocha",
        "Pytest", "JUnit", "TestNG", "Appium",
        "Terraform Cloud", "Vault", "Consul",
    ],
    "soft": [
        "Leadership", "Team Management", "Communication",
        "Project Management", "Product Management",
        "Agile", "Scrum", "Kanban", "SAFe",
        "Stakeholder Management", "Client Management",
        "Problem Solving", "Critical Thinking", "Analytical Thinking",
        "Strategic Planning", "Business Strategy",
        "Mentoring", "Coaching", "Training",
        "Presentation Skills", "Public Speaking",
        "Negotiation", "Conflict Resolution",
        "Time Management", "Prioritization",
        "Cross-functional Collaboration",
        "Remote Team Management",
        "Technical Writing", "Documentation",
        "UX Research", "User Research",
        "Budget Management", "Vendor Management",
        "Risk Management", "Change Management",
        "KPI Management", "OKRs",
        "Business Analytics", "Data-driven Decision Making",
    ],
}

# Flat set for fast lookup
ALL_SKILLS_FLAT: set[str] = set()
SKILL_TO_CATEGORY: dict[str, str] = {}
for category, skills in MASTER_SKILLS.items():
    for skill in skills:
        ALL_SKILLS_FLAT.add(skill.lower())
        SKILL_TO_CATEGORY[skill.lower()] = category

# Implicit skill extraction patterns
# Pattern: (regex_pattern, [inferred_skills])
IMPLICIT_PATTERNS: list[tuple[str, list[str]]] = [
    (r"led\s+.*team|managed\s+.*team|team\s+lead", ["Leadership", "Team Management"]),
    (r"deployed\s+.*(?:aws|gcp|azure|cloud)", ["Cloud", "DevOps"]),
    (r"deployed\s+.*aws", ["AWS"]),
    (r"deployed\s+.*gcp|google\s*cloud", ["GCP"]),
    (r"deployed\s+.*azure", ["Azure"]),
    (r"(?:increased|improved|grew|boosted).*\d+\s*%", ["Business Analytics", "KPI Management"]),
    (r"(?:reduced|decreased|cut|lowered).*\d+\s*%", ["Business Analytics", "KPI Management"]),
    (r"(?:revenue|growth|sales|conversion)", ["Business Analytics"]),
    (r"designed\s+.*(?:database|schema|data\s*model)", ["Data Modeling", "Database Design"]),
    (r"(?:built|developed|created|designed)\s+.*(?:api|rest|graphql|endpoint)", ["REST API", "API Development"]),
    (r"managed\s+.*(?:stakeholder|client|vendor|partner)", ["Stakeholder Management"]),
    (r"(?:ci/?cd|pipeline|deployment|release)", ["CI/CD", "DevOps"]),
    (r"(?:docker|container|kubernetes|k8s)", ["Docker", "Kubernetes"]),
    (r"(?:agile|scrum|sprint|standup|retrospective)", ["Agile", "Scrum"]),
    (r"(?:mentored|coached|trained|onboarded)\s+", ["Mentoring", "Training"]),
    (r"(?:wrote|authored|created)\s+.*(?:test|spec|unit)", ["Testing"]),
    (r"(?:machine\s*learning|ml\s+model|trained\s+model)", ["Machine Learning"]),
    (r"(?:data\s+(?:analysis|analytics|visualization))", ["Data Visualization", "Business Analytics"]),
    (r"(?:security|authentication|authorization|oauth|jwt)", ["Security"]),
    (r"(?:mobile|ios|android|react\s*native|flutter)", ["Mobile Development"]),
    (r"(?:presentation|presented|demo|pitched)", ["Presentation Skills"]),
    (r"(?:budget|p&l|cost\s*(?:reduction|optimization))", ["Budget Management"]),
]
