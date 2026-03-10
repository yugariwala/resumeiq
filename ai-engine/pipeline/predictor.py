"""
Step 5 — Selection Predictor
Predicts selection likelihood based on skills, ATS score, experience, and company tier.
"""

from __future__ import annotations
from data.role_keywords import COMPANY_TIERS, DEFAULT_TIER, ROLE_KEYWORDS


def predict_selection(
    skills_found: list[dict],
    ats_score: int,
    experience_level: str,
    target_role: str,
    target_company: str,
    urgency: int,
) -> dict:
    """
    Predict selection likelihood for a candidate at a target company.

    Returns:
        {verdict, confidence, category, skill_match_pct, selection_score,
         ats_meets_threshold, reason}
    """
    # Get company tier threshold
    tier_info = COMPANY_TIERS.get(target_company, DEFAULT_TIER)
    min_ats = tier_info["min_ats"]
    tier = tier_info["tier"]

    # Skill match percentage
    required_skills = ROLE_KEYWORDS.get(target_role, ROLE_KEYWORDS.get("Software Engineer", []))
    candidate_skill_names = {s["name"].lower() for s in skills_found}
    matched_skills = [s for s in required_skills if s.lower() in candidate_skill_names]
    skill_match_pct = (len(matched_skills) / max(len(required_skills), 1)) * 100

    # Experience factor
    experience_factor = _experience_factor(experience_level, target_role)

    # Selection score: weighted combination
    selection_score = (
        skill_match_pct * 0.45
        + ats_score * 0.35
        + experience_factor * 0.20
    )

    # Verdict
    threshold = 68 if tier == 1 else 60 if tier == 2 else 55
    verdict = "selected" if selection_score >= threshold else "not_selected"

    # Confidence: deterministic, clamped to 10-94 range
    confidence = min(94, max(10, int(selection_score)))

    # Category determination
    category = _determine_category(verdict, skill_match_pct, ats_score)

    # Reason text
    reason = _build_reason(verdict, skill_match_pct, ats_score, min_ats, target_company, target_role)

    return {
        "verdict": verdict,
        "confidence": confidence,
        "category": category,
        "skill_match_pct": round(skill_match_pct, 1),
        "selection_score": round(selection_score, 1),
        "ats_meets_threshold": ats_score >= min_ats,
        "reason": reason,
        "tier": tier,
        "matched_skills": matched_skills,
    }


def _experience_factor(experience_level: str, target_role: str) -> float:
    """
    Estimate how well experience level matches the role.
    Returns a score 0-100.
    """
    # Simplified mapping: most roles are mid-level by default
    level_map = {
        "fresher": {"base": 50, "boost_roles": ["Software Engineer", "QA Engineer", "Frontend Developer"]},
        "early": {"base": 70, "boost_roles": ["Software Engineer", "Full Stack Developer", "Frontend Developer", "Backend Engineer"]},
        "mid": {"base": 85, "boost_roles": []},  # Good baseline for most roles
        "senior": {"base": 95, "boost_roles": ["Cloud Architect", "Project Manager", "Product Manager"]},
    }

    info = level_map.get(experience_level, {"base": 70, "boost_roles": []})
    score = info["base"]

    # Boost if role matches common entry points for this level
    if target_role in info["boost_roles"]:
        score = min(100, score + 15)

    # Penalize freshers for senior roles
    if experience_level == "fresher" and target_role in ["Cloud Architect", "Project Manager", "Product Manager"]:
        score = max(20, score - 30)

    return score


def _determine_category(verdict: str, skill_match_pct: float, ats_score: int) -> str:
    """
    Determine improvement category:
    A = Resume needs fixing (skills are there but resume is weak)
    B = Skills need building (missing critical skills)
    """
    if verdict == "selected":
        # Selected candidate: if ATS is below 75, resume could still be polished (A).
        # If ATS >= 75, resume is strong — offer growth-oriented learning plan (B).
        return "A" if ats_score < 75 else "B"

    # Not selected:
    if skill_match_pct >= 65 and ats_score < 65:
        # Has skills but resume is weak
        return "A"
    else:
        # Missing skills → needs learning plan
        return "B"


def _build_reason(
    verdict: str,
    skill_match_pct: float,
    ats_score: int,
    min_ats: int,
    company: str,
    role: str,
) -> str:
    """Build human-readable reason for the verdict."""
    if verdict == "selected":
        parts = [f"Your profile is competitive for {role} at {company}."]
        if ats_score >= 80:
            parts.append("Your ATS score is strong.")
        if skill_match_pct >= 80:
            parts.append("You match most required skills.")
        return " ".join(parts)
    else:
        parts = [f"Your profile needs improvement for {role} at {company}."]
        if ats_score < min_ats:
            parts.append(f"ATS score ({ats_score}) is below the {min_ats} threshold for this tier.")
        if skill_match_pct < 60:
            parts.append(f"Skill match ({skill_match_pct:.0f}%) is below the competitive range.")
        return " ".join(parts)
