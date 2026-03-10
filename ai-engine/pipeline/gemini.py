"""
Step 6 — Gemini LLM Generation
Category A: Resume Fix prompt → improvement_tips
Category B: Learning Plan prompt → roadmap
Uses google-generativeai SDK for free-tier analysis.
"""

from __future__ import annotations
import json
import re
import os
import logging

try:
    import google.generativeai as genai
    HAS_GEMINI = True
except ImportError:
    HAS_GEMINI = False

logger = logging.getLogger("resumeiq-ai")

def generate_with_gemini(
    category: str,
    resume_text: str,
    skills_found: list[dict],
    skills_missing: list[str],
    target_role: str,
    target_company: str,
    experience_level: str,
    ats_breakdown: dict,
    urgency: int,
    weakness: str,
) -> dict:
    """
    Call Gemini API to generate improvement tips (Cat A) or learning plan (Cat B).

    Returns parsed JSON dict from Gemini's response.
    On error or missing SDK: returns realistic mock data.
    """
    api_key = os.getenv("GEMINI_API_KEY", "")

    if not api_key or not HAS_GEMINI:
        if not HAS_GEMINI:
            logger.warning(
                "google-generativeai SDK not installed. Using mock responses. "
                "Install with: pip install google-generativeai"
            )
        return _mock_response(category, target_role, target_company, skills_missing)

    response_text = ""
    try:
        genai.configure(api_key=api_key)
        # Using gemini-2.0-flash as per USER's "use this one" hint
        model = genai.GenerativeModel("gemini-2.0-flash")

        if category == "A":
            system_prompt, user_prompt = _build_resume_fix_prompt(
                resume_text, target_role, target_company, experience_level, ats_breakdown
            )
        else:
            system_prompt, user_prompt = _build_learning_plan_prompt(
                skills_found, skills_missing, target_role, target_company,
                experience_level, urgency, weakness
            )

        # Gemini typically takes instructions as part of the prompt or system_instruction
        # For simplicity and robustness with standard models, we combine them if not using system_instruction param explicitly
        full_prompt = f"{system_prompt}\n\n{user_prompt}"
        
        response = model.generate_content(full_prompt)
        response_text = response.text
        
        response_text = _strip_code_fences(response_text)
        parsed = json.loads(response_text)
        return parsed

    except json.JSONDecodeError:
        logger.error(f"Gemini returned invalid JSON. Raw text: {response_text[:500]}")
        # W4: Never return raw LLM text to the client — log only
        return {"error": "generation_failed"}
    except Exception as e:
        logger.exception(f"Gemini API error: {str(e)}")
        return {"error": "api_error", "message": str(e)}


def _strip_code_fences(text: str) -> str:
    """Remove markdown code fences from LLM output."""
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*\n?", "", text)
    text = re.sub(r"\n?```\s*$", "", text)
    return text.strip()


def _build_resume_fix_prompt(
    resume_text: str,
    target_role: str,
    target_company: str,
    experience_level: str,
    ats_breakdown: dict,
) -> tuple[str, str]:
    """Build Category A — Resume Fix prompts."""
    weak_areas = [
        k for k, v in ats_breakdown.items()
        if isinstance(v, (int, float)) and k != "total" and v < 60
    ]

    system = "You are a world-class resume coach and ATS expert. Always return valid JSON only, no markdown or extra text. Ensure all quotes match the resume exactly."

    user = f"""Analyse this resume for a {experience_level} {target_role} targeting {target_company}.

ATS SCORE: {ats_breakdown.get('total', 0)}/100
WEAKEST SUB-SCORES: {weak_areas}
RESUME TEXT:
---
{resume_text[:4000]}
---

Return JSON with this exact structure:
{{
  "improvement_tips": [
    {{
      "title": "short title of the issue",
      "issue": "what is wrong and why it hurts",
      "current_text": "exact quote from resume that is weak (or 'Not found')",
      "improved_text": "your rewritten improved version",
      "impact": "high|medium|low",
      "explanation": "why this specific change improves ATS score or recruiter impression"
    }}
  ],
  "missing_keywords": ["top 5 keywords missing for this role at this company"],
  "format_tip": "one specific format change to immediately improve ATS score",
  "summary": "2-sentence honest assessment of the resume's main issue"
}}
Generate 6-8 improvement tips. Be specific — quote real text from the resume."""

    return system, user


def _build_learning_plan_prompt(
    skills_found: list[dict],
    skills_missing: list[str],
    target_role: str,
    target_company: str,
    experience_level: str,
    urgency: int,
    weakness: str,
) -> tuple[str, str]:
    """Build Category B — Learning Plan prompts."""
    found_names = [s["name"] for s in skills_found[:20]]

    system = "You are an expert technical career mentor. Always return valid JSON only, no markdown or extra text. Provide realistic resources."

    user = f"""Create a personalised learning roadmap for someone targeting {target_role} at {target_company}.

THEIR CURRENT SKILLS: {found_names}
MISSING CRITICAL SKILLS: {skills_missing[:10]}
EXPERIENCE LEVEL: {experience_level}
JOB URGENCY (1-10): {urgency}
SELF-REPORTED WEAKNESS: {weakness or 'Not provided'}

Return JSON:
{{
  "total_weeks": <number>,
  "summary": "2-3 sentence honest assessment of their situation and realistic outlook",
  "quick_wins": ["3 things they can do THIS WEEK, each under 2 hours"],
  "roadmap": [
    {{
      "week_range": "Week 1-2",
      "skill": "skill name",
      "priority": "CRITICAL|HIGH|MEDIUM",
      "why_needed": "specific reason this skill is needed for {target_role} at {target_company}",
      "resource": "Best free resource: [Name] — [URL]",
      "hours_required": <number>,
      "project_to_build": "specific mini-project to demonstrate this skill on resume",
      "milestone": "what you should be able to do / say in interviews after this"
    }}
  ]
}}
Roadmap should cover 8-16 weeks. Order by priority — CRITICAL skills first. Be realistic about time."""

    return system, user


def _mock_response(category: str, target_role: str, target_company: str, skills_missing: list[str]) -> dict:
    """Return realistic mock response boilerplate when API key is missing."""
    # Identical to previous mock responses for UI stability
    if category == "A":
        return {
            "improvement_tips": [
                {
                    "title": "Add quantified achievements",
                    "issue": "Experience bullets lack measurable impact",
                    "current_text": "Worked on the company dashboard",
                    "improved_text": "Optimized dashboard queries reducing load time by 35% and improving UX for 10k users",
                    "impact": "high",
                    "explanation": "Quantifiable metrics prove your value to recruiters."
                }
            ],
            "missing_keywords": skills_missing[:5] if skills_missing else ["System Design", "Cloud Architecture"],
            "format_tip": "Standardize date formats throughout the resume.",
            "summary": f"Your resume is a good start for {target_role}, but needs more impact-led bullets."
        }
    else:
        return {
            "total_weeks": 12,
            "summary": "Focus on closing the gaps in cloud-native technologies.",
            "quick_wins": ["Tidy up GitHub READMEs", "Add 3 new skills to LinkedIn", "Complete one coding challenge daily"],
            "roadmap": [
                {
                    "week_range": "Week 1-3",
                    "skill": "Python for Data & Backend",
                    "priority": "CRITICAL",
                    "why_needed": f"Core requirement for most {target_role} roles at {target_company}",
                    "resource": "Best free resource: CS50P — https://cs50.harvard.edu/python/",
                    "hours_required": 30,
                    "project_to_build": "Build a CLI tool that scrapes job postings and ranks them by keyword match",
                    "milestone": "Comfortable writing Python scripts and using pip/venv"
                },
                {
                    "week_range": "Week 4-6",
                    "skill": "SQL & Database Fundamentals",
                    "priority": "CRITICAL",
                    "why_needed": "SQL appears in 90%+ of technical job assessments",
                    "resource": "Best free resource: SQLBolt — https://sqlbolt.com/",
                    "hours_required": 20,
                    "project_to_build": "Design a normalized schema for an e-commerce app with 5+ tables",
                    "milestone": "Can write complex JOINs, window functions, and CTEs in interviews"
                },
                {
                    "week_range": "Week 7-10",
                    "skill": "System Design Basics",
                    "priority": "HIGH",
                    "why_needed": "Expected in mid-to-senior interviews at top companies",
                    "resource": "Best free resource: System Design Primer — https://github.com/donnemartin/system-design-primer",
                    "hours_required": 25,
                    "project_to_build": "Design a URL shortener with caching, rate limiting, and analytics",
                    "milestone": "Can whiteboard a full system architecture for common problems"
                }
            ]
        }
