"""
ResumeIQ AI Engine — FastAPI Application

Stateless microservice that runs an 8-step resume analysis pipeline.
Routes:
  POST /ai/analyse  — Full pipeline (steps 1-7)
  POST /ai/job-match — JD keyword matching
  GET  /ai/health    — Health check
"""

from __future__ import annotations
import asyncio
import os
import re
import time
import logging
from typing import Optional

import httpx
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Pipeline steps
from pipeline.parser import parse_document
from pipeline.sections import structure_sections
from pipeline.skills import extract_skills
from pipeline.ats import calculate_ats_score
from pipeline.predictor import predict_selection
from pipeline.gemini import generate_with_gemini
from pipeline.highlighter import generate_highlight_map

# Data
from data.master_skills import ALL_SKILLS_FLAT, MASTER_SKILLS

load_dotenv(os.path.join(os.path.dirname(__file__), "../.env"))

# ═══════════════ LOGGING ═══════════════
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("resumeiq-ai")

# ═══════════════ APP ═══════════════
app = FastAPI(
    title="ResumeIQ AI Engine",
    description="AI microservice for 8-step resume analysis pipeline",
    version="1.0.0",
)

# CORS
allowed_origins = [
    "http://localhost:5173",   # Vite dev
    "http://localhost:3000",   # Alternate dev
    "http://localhost:3001",   # Backend
    os.getenv("FRONTEND_URL", ""),
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o for o in allowed_origins if o],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ═══════════════ REQUEST LOGGING ═══════════════
@app.middleware("http")
async def log_requests(request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = time.time() - start
    logger.info(f"{request.method} {request.url.path} → {response.status_code} ({duration:.2f}s)")
    return response


# ═══════════════ MODELS ═══════════════
class AnalyseRequest(BaseModel):
    file_url: str
    file_format: str = "pdf"
    target_role: str = "Software Engineer"
    target_companies: list[str] = ["Google"]
    experience_level: str = "mid"
    urgency: int = 5
    weakness: str = ""


class JobMatchRequest(BaseModel):
    resume_text: str
    job_description: str


class AnalysisResult(BaseModel):
    status: str
    raw_text: Optional[str] = None
    page_count: Optional[int] = None
    sections: Optional[dict] = None
    skills_found: Optional[list] = None
    skills_missing: Optional[list] = None
    ats_score: Optional[int] = None
    ats_breakdown: Optional[dict] = None
    selection_verdict: Optional[str] = None
    selection_confidence: Optional[int] = None
    category: Optional[str] = None
    improvement_tips: Optional[list] = None
    learning_plan: Optional[list] = None
    highlight_map: Optional[list] = None
    error: Optional[str] = None


# ═══════════════ ROUTES ═══════════════

@app.get("/ai/health")
def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "model": "gemini-2.0-flash",
        "version": "1.0",
        "pipeline_steps": 8,
        "skills_database": len(ALL_SKILLS_FLAT),
    }


@app.post("/ai/analyse")
async def analyse_resume(req: AnalyseRequest):
    """
    Run the full 8-step analysis pipeline with 120s timeout.
    """
    try:
        result = await asyncio.wait_for(_run_pipeline(req), timeout=120.0)
        return result
    except asyncio.TimeoutError:
        logger.error("Pipeline timed out after 120 seconds")
        return AnalysisResult(
            status="error",
            error="Analysis timed out after 120 seconds. Please try again with a smaller file.",
        )


async def _run_pipeline(req: AnalyseRequest):
    """
    Internal pipeline with per-step error handling.

    Steps:
    1. Download + parse document
    2. Structure sections
    3. Extract skills
    4. Calculate ATS score
    5. Predict selection (per company)
    6. Generate with Gemini (improvement tips / learning plan)
    7. Generate highlight map
    8. Return complete result
    """
    logger.info(f"Starting analysis: role={req.target_role}, companies={req.target_companies}")
    start = time.time()

    # ── Step 0: Download file ──
    logger.info("Step 0: Downloading file...")
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.get(req.file_url)
            if resp.status_code != 200:
                return AnalysisResult(status="error", error=f"Could not download file (HTTP {resp.status_code})")
            file_bytes = resp.content
    except httpx.TimeoutException:
        return AnalysisResult(status="error", error="File download timed out")
    except Exception as e:
        logger.exception("Step 0 failed: file download")
        return AnalysisResult(status="error", error=f"File download failed: {str(e)}")

    # ── Step 1: Parse document ──
    logger.info("Step 1: Parsing document...")
    try:
        parsed = parse_document(file_bytes, req.file_format)
        if "code" in parsed:
            return AnalysisResult(status="error", error=parsed["message"])
        raw_text = parsed["raw_text"]
        page_count = parsed["page_count"]
    except Exception as e:
        logger.exception("Step 1 failed: document parsing")
        return AnalysisResult(status="error", error=f"Step 1 (Parse) failed: {str(e)}")

    # ── Step 2: Structure sections ──
    logger.info("Step 2: Structuring sections...")
    try:
        sections = structure_sections(raw_text)
    except Exception as e:
        logger.exception("Step 2 failed: section structuring")
        return AnalysisResult(status="error", raw_text=raw_text, error=f"Step 2 (Sections) failed: {str(e)}")

    # ── Step 3: Extract skills ──
    logger.info("Step 3: Extracting skills...")
    try:
        skills_found = extract_skills(sections, raw_text)
    except Exception as e:
        logger.exception("Step 3 failed: skill extraction")
        return AnalysisResult(status="error", raw_text=raw_text, error=f"Step 3 (Skills) failed: {str(e)}")

    # ── Step 4: Calculate ATS score (for primary company) ──
    logger.info("Step 4: Calculating ATS score...")
    try:
        ats_result = calculate_ats_score(
            sections, skills_found, raw_text, page_count,
            req.target_role, req.experience_level,
        )
    except Exception as e:
        logger.exception("Step 4 failed: ATS score calculation")
        return AnalysisResult(status="error", raw_text=raw_text, error=f"Step 4 (ATS) failed: {str(e)}")

    # ── Step 5: Predict selection (per company) ──
    logger.info("Step 5: Predicting selection...")
    try:
        company_results = {}
        primary_prediction = None
        for company in req.target_companies:
            prediction = predict_selection(
                skills_found, ats_result["total"],
                req.experience_level, req.target_role, company, req.urgency,
            )
            company_results[company] = prediction
            if primary_prediction is None:
                primary_prediction = prediction

        category = primary_prediction["category"] if primary_prediction else "A"
    except Exception as e:
        logger.exception("Step 5 failed: selection prediction")
        return AnalysisResult(status="error", raw_text=raw_text, ats_score=ats_result.get("total"), error=f"Step 5 (Predict) failed: {str(e)}")

    # Build skills_missing list from ATS missing keywords + prediction
    skills_missing_names = ats_result.get("missing_keywords", [])

    # ── Step 6: Generate with Gemini ──
    logger.info(f"Step 6: Generating with Gemini (category={category})...")
    try:
        gemini_result = generate_with_gemini(
            category=category,
            resume_text=raw_text,
            skills_found=skills_found,
            skills_missing=skills_missing_names,
            target_role=req.target_role,
            target_company=req.target_companies[0] if req.target_companies else "General",
            experience_level=req.experience_level,
            ats_breakdown=ats_result,
            urgency=req.urgency,
            weakness=req.weakness,
        )
    except Exception as e:
        logger.exception("Step 6 failed: Gemini generation")
        gemini_result = {"error": "generation_failed", "message": str(e)}

    # Extract tips or roadmap from Gemini result
    improvement_tips = gemini_result.get("improvement_tips", [])
    learning_plan = gemini_result.get("roadmap", [])

    # ── Step 7: Generate highlight map ──
    logger.info("Step 7: Generating highlight map...")
    try:
        highlight_map = generate_highlight_map(
            sections, skills_found, skills_missing_names, raw_text,
        )
    except Exception as e:
        logger.exception("Step 7 failed: highlight map generation")
        highlight_map = []

    elapsed = time.time() - start
    logger.info(f"Analysis complete in {elapsed:.2f}s")

    # ── Step 8: Return result ──
    return {
        "status": "complete",
        "raw_text": raw_text,
        "page_count": page_count,
        "sections": {k: v for k, v in sections.items() if v},  # remove empty
        "skills_found": skills_found,
        "skills_missing": [
            {"name": kw, "importance": "high", "reason": f"Required for {req.target_role}"}
            for kw in skills_missing_names
        ],
        "ats_score": ats_result["total"],
        "ats_breakdown": {
            "keyword_match": ats_result["keyword_score"],
            "format_structure": ats_result["format_score"],
            "contact_info": ats_result["contact_score"],
            "resume_length": ats_result["length_score"],
            "consistency": ats_result["consistency_score"],
        },
        "selection_verdict": primary_prediction["verdict"] if primary_prediction else "unknown",
        "selection_confidence": primary_prediction["confidence"] if primary_prediction else 0,
        "category": category,
        "company_verdicts": company_results,
        "improvement_tips": improvement_tips,
        "learning_plan": learning_plan,
        "highlight_map": highlight_map,
        "gemini_summary": gemini_result.get("summary", ""),
        "gemini_format_tip": gemini_result.get("format_tip", ""),
        "elapsed_seconds": round(elapsed, 2),
    }


@app.post("/ai/job-match")
async def job_match(req: JobMatchRequest):
    """
    Match resume text against a specific job description.
    Extract keywords from JD, compare against resume.
    """
    logger.info("Job match request received")
    resume_lower = req.resume_text.lower()
    jd_lower = req.job_description.lower()

    # Extract skills from JD
    jd_keywords: list[str] = []
    for category, skills in MASTER_SKILLS.items():
        for skill in skills:
            if skill.lower() in jd_lower:
                jd_keywords.append(skill)

    # Also extract via simple word/phrase matching
    # Common JD phrases
    jd_extra_terms = re.findall(
        r"\b(?:experience with|proficient in|knowledge of|familiar with|expertise in)\s+([A-Za-z\s\+#\.]+?)(?:[,;.]|\band\b)",
        req.job_description,
        re.IGNORECASE,
    )
    for term in jd_extra_terms:
        clean = term.strip()
        if clean and clean.lower() not in [k.lower() for k in jd_keywords]:
            jd_keywords.append(clean)

    # Deduplicate
    seen = set()
    unique_keywords = []
    for kw in jd_keywords:
        if kw.lower() not in seen:
            seen.add(kw.lower())
            unique_keywords.append(kw)
    jd_keywords = unique_keywords

    # Match against resume
    matched = [kw for kw in jd_keywords if kw.lower() in resume_lower]
    missing = [kw for kw in jd_keywords if kw.lower() not in resume_lower]

    match_score = int((len(matched) / max(len(jd_keywords), 1)) * 100) if jd_keywords else 50

    return {
        "matchScore": match_score,
        "matchedKeywords": matched,
        "missingKeywords": missing,
        "totalJDKeywords": len(jd_keywords),
    }
