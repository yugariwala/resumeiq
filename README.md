<div align="center">

<img src="https://img.shields.io/badge/ResumeIQ-AI%20Powered-3B82F6?style=for-the-badge&logo=openai&logoColor=white" />
<img src="https://img.shields.io/badge/Built%20With-Gemini%203%20%2B%20Claude-10B981?style=for-the-badge&logo=google&logoColor=white" />
<img src="https://img.shields.io/badge/Status-Live%20Prototype-EF4444?style=for-the-badge" />

# 🧠 ResumeIQ
### AI-Powered Resume Intelligence Platform

**"95% of resumes are rejected before a human ever sees them. ResumeIQ shows you exactly what the robot sees — and how to beat it."**

[🚀 Live Demo](#) • [📖 Documentation](#) • [🎯 Features](#features) • [🛠️ Setup](#setup)

</div>

---

## 🏆 What is ResumeIQ?

ResumeIQ is a full-stack AI platform that gives job seekers complete, actionable visibility into how their resume is evaluated by Applicant Tracking Systems (ATS) — and predicts whether they will be selected at their target company.

Upload your resume → name your target company → answer 5 quick questions → get a full AI-powered analysis in under 15 seconds.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📊 **ATS Score Engine** | Calculates a 0-100 ATS compatibility score across 5 dimensions: keywords, format, contact info, length, and consistency |
| 🎯 **Selection Prediction** | AI predicts your likelihood of being selected at your specific target company and role |
| 🔍 **Skill Gap Analysis** | Extracts explicit and implicit skills from your resume and identifies exactly what's missing for your target role |
| 🎨 **Resume Highlight Viewer** | Colour-coded overlay on your resume — Green (strong), Yellow (improvable), Red (weak/missing) |
| 📚 **Personalised Learning Plan** | Week-by-week roadmap to close skill gaps with time estimates, resources, and mini-projects |
| 📋 **JD Matcher** | Paste any job description and get an exact keyword match score |
| 📄 **PDF Report Export** | Download a full professional analysis report |
| 🔗 **Shareable Results** | Share your analysis with a public link |

---

## 🤖 AI Pipeline

ResumeIQ runs an 8-step AI pipeline on every resume:

```
📄 Document Parser     →  Extracts text from PDF/DOCX
🧠 NLP Structuring     →  Identifies resume sections
🔍 Skill Extractor     →  Finds explicit + implicit skills
📊 ATS Scorer          →  Calculates 5-dimension ATS score
🎯 Selection Predictor →  Predicts company-specific outcome
✍️  Gemini Generator   →  Creates personalised improvement plan
🎨 Highlight Engine    →  Maps colour annotations to resume text
📦 Result Packager     →  Returns structured JSON to frontend
```

---

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=flat&logo=framer&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-FF6384?style=flat)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)

### AI Engine
![Python](https://img.shields.io/badge/Python_3.11-3776AB?style=flat&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![spaCy](https://img.shields.io/badge/spaCy-09A3D5?style=flat)
![Sentence Transformers](https://img.shields.io/badge/Sentence_Transformers-FF9900?style=flat)

### Infrastructure
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Gemini_3-4285F4?style=flat&logo=google&logoColor=white)

---

## 🗂️ Project Structure

```
resumeiq/
├── frontend/                 # React + TypeScript + Vite
│   ├── src/
│   │   ├── pages/            # 10 pages (Home, Upload, Results, Dashboard...)
│   │   ├── components/       # Reusable components (Navbar, Footer, ProtectedRoute)
│   │   ├── contexts/         # AuthContext (Supabase session management)
│   │   ├── api/              # API call functions
│   │   └── lib/              # Supabase client config
│   └── package.json
│
├── backend/                  # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── routes/           # upload.ts, analysis.ts, auth.ts
│   │   ├── middleware/        # auth.ts (JWT validation), rateLimit
│   │   └── lib/              # Supabase server client
│   └── package.json
│
├── ai-engine/                # Python FastAPI AI Microservice
│   ├── pipeline/
│   │   ├── parser.py         # PDF + DOCX text extraction
│   │   ├── sections.py       # NLP section structuring
│   │   ├── skills.py         # Skill extraction (explicit + implicit)
│   │   ├── ats.py            # ATS score calculation (5 dimensions)
│   │   ├── predictor.py      # Selection prediction model
│   │   ├── gemini.py         # Gemini API / Claude integration
│   │   └── highlighter.py   # Resume highlight map generation
│   ├── main.py               # FastAPI app + pipeline orchestration
│   └── requirements.txt
│
└── supabase/
    └── migrations/           # Database schema + RLS policies
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- Supabase account (free)
- Google AI Studio API key (free)

### 1. Clone the repository
```bash
git clone https://github.com/yugariwala/resumeiq.git
cd resumeiq
```

### 2. Set up environment variables

Copy the example env files and fill in your values:
```bash
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
cp ai-engine/.env.example ai-engine/.env
```

Required variables:
```env
# frontend/.env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# backend/.env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_JWT_SECRET=your_jwt_secret
AI_ENGINE_URL=http://localhost:8000
ALLOWED_ORIGINS=http://localhost:5173

# ai-engine/.env
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Run the database migrations
Go to your Supabase project → SQL Editor → paste and run the contents of `supabase/migrations/001_initial.sql`

### 4. Start all three services
```bash
# Terminal 1 — Frontend
cd frontend && npm install && npm run dev
# → http://localhost:5173

# Terminal 2 — Backend  
cd backend && npm install && npm run dev
# → http://localhost:3001

# Terminal 3 — AI Engine
cd ai-engine
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn main:app --reload --port 8000
# → http://localhost:8000
```

### 5. Open the app
Navigate to **http://localhost:5173** and sign in with Google.

---

## 🗺️ User Flow

```
Land on Homepage      →  Clear value proposition
Sign up / Login       →  Google OAuth or Email
Upload Resume         →  PDF or DOCX, max 10MB
Enter Context         →  Target company, role, experience level
AI Processing         →  8-step pipeline (~15 seconds)
View Results          →  ATS score, verdict, skill gaps, plan
Take Action           →  Follow improvement tips or learning roadmap
Re-upload & Track     →  See score improvement over time
```

---

## 📊 Business Model

| Plan | Price | Analyses | Features |
|------|-------|----------|----------|
| Free | ₹0 | 2/month | ATS score, skill gaps, basic plan |
| Pro | ₹299/month | Unlimited | Full AI plan, PDF export, JD matcher, priority queue |
| Pay-per-Use | ₹49 | 1 | Full single analysis, no subscription |
| B2B College | ₹10,000/month | Bulk | Admin panel, aggregate analytics, per-student reports |

---

## 🔒 Security

- ✅ JWT authentication on all protected routes
- ✅ Row Level Security (RLS) on all Supabase tables
- ✅ AES-256 encrypted file storage
- ✅ Server-side file type and size validation
- ✅ Filename sanitization (path traversal prevention)
- ✅ Rate limiting on all API endpoints
- ✅ GDPR-aligned data handling (user deletion purges all data)
- ✅ No API keys exposed in frontend

---

## 🎯 Roadmap

- [ ] LinkedIn OAuth integration
- [ ] Job board API integration (LinkedIn, Naukri, Indeed)
- [ ] OCR support for scanned PDFs
- [ ] Mobile app (React Native)
- [ ] Cover letter generator
- [ ] Interview preparation module
- [ ] B2B college admin dashboard
- [ ] Multi-language support

---

## 👨‍💻 Built By

**Yugariwala** — Built with Google Antigravity IDE, powered by Gemini 3 + Claude AI

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

<div align="center">

**⭐ Star this repo if ResumeIQ helped you land your dream job!**

Made with ❤️ and a lot of ☕ | Powered by 🤖 Gemini 3 + Claude AI

</div>
