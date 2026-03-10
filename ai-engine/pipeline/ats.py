"""
Step 4 — ATS Score Calculator
5 weighted sub-scores: keyword, format, contact, length, consistency.
"""

from __future__ import annotations
import re
from data.role_keywords import ROLE_KEYWORDS, EXPERIENCE_IDEAL_PAGES
from pipeline.sections import EMAIL_PATTERN, PHONE_PATTERN, LINKEDIN_PATTERN, GITHUB_PATTERN


# Action verbs for consistency checking (base + past tense forms)
ACTION_VERBS = {
    "led", "managed", "built", "developed", "designed", "created",
    "implemented", "launched", "improved", "delivered", "optimized",
    "automated", "reduced", "increased", "achieved", "collaborated",
    "mentored", "established", "initiated", "executed", "analyzed",
    "configured", "deployed", "engineered", "integrated", "maintained",
    "migrated", "orchestrated", "architected", "refactored", "resolved",
    "scaled", "secured", "streamlined", "transformed", "spearheaded",
    "coordinated", "facilitated", "negotiated", "presented", "published",
    "researched", "supervised", "trained", "consolidated", "generated",
    "drove", "contributed", "participated", "supported", "assisted",
    # Additional past-tense forms commonly found on resumes
    "assessed", "owned", "identified", "introduced", "oversaw",
    "partnered", "produced", "utilized", "validated", "authored",
    "championed", "conceptualized", "converted", "cultivated",
    "customized", "defined", "demonstrated", "ensured", "expanded",
    "forged", "guided", "handled", "headed", "hired", "influenced",
    "inspected", "instituted", "instructed", "interfaced",
    "investigated", "joined", "operated", "organized", "performed",
    "planned", "prepared", "prioritized", "programmed", "proposed",
    "recruited", "redesigned", "reviewed", "shaped", "simplified",
    "solved", "tested", "upgraded", "used",
}


def calculate_ats_score(
    sections: dict[str, list[str]],
    skills_found: list[dict],
    raw_text: str,
    page_count: int,
    target_role: str,
    experience_level: str,
) -> dict:
    """
    Calculate ATS score with 5 weighted sub-scores.

    Returns:
        {total, keyword_score, format_score, contact_score,
         length_score, consistency_score, found_keywords, missing_keywords}
    """
    keyword_result = _keyword_score(raw_text, target_role)
    format_result = _format_score(raw_text, sections)
    contact_result = _contact_score(raw_text)
    length_result = _length_score(raw_text, page_count, experience_level)
    consistency_result = _consistency_score(sections)

    total = int(
        keyword_result["score"] * 0.30
        + format_result * 0.25
        + contact_result * 0.15
        + length_result * 0.15
        + consistency_result * 0.15
    )
    total = max(0, min(100, total))

    return {
        "total": total,
        "keyword_score": int(keyword_result["score"]),
        "format_score": int(format_result),
        "contact_score": int(contact_result),
        "length_score": int(length_result),
        "consistency_score": int(consistency_result),
        "found_keywords": keyword_result["found"],
        "missing_keywords": keyword_result["missing"],
    }


def _keyword_score(raw_text: str, target_role: str) -> dict:
    """Score: what % of role-required keywords appear in the resume."""
    if target_role not in ROLE_KEYWORDS:
        logger.warning(f"Unknown role '{target_role}' — using Software Engineer fallback keywords")
    required = ROLE_KEYWORDS.get(target_role, ROLE_KEYWORDS.get("Software Engineer", []))
    text_lower = raw_text.lower()

    found = []
    missing = []
    for kw in required:
        if kw.lower() in text_lower:
            found.append(kw)
        else:
            missing.append(kw)

    score = (len(found) / max(len(required), 1)) * 100
    return {"score": score, "found": found, "missing": missing}


def _format_score(raw_text: str, sections: dict[str, list[str]]) -> float:
    """Score deductions for formatting issues (layout, structure, visual consistency)."""
    score = 100.0

    # Tables detected (many pipe characters)
    if raw_text.count("|") > 5:
        score -= 15

    # Multi-column suspected: many short lines with content
    lines = raw_text.split("\n")
    short_content_lines = [l for l in lines if 5 < len(l.strip()) < 30]
    if len(short_content_lines) > len(lines) * 0.4:
        score -= 10

    # Inconsistent date formats
    date_formats_found = set()
    if re.search(r"\d{2}/\d{2}/\d{4}", raw_text):
        date_formats_found.add("dd/mm/yyyy")
    if re.search(r"\d{4}-\d{2}-\d{2}", raw_text):
        date_formats_found.add("yyyy-mm-dd")
    if re.search(r"(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{4}", raw_text):
        date_formats_found.add("month_yyyy")
    if re.search(r"\d{4}\s*[-–]\s*(?:\d{4}|Present|Current)", raw_text):
        date_formats_found.add("yyyy-range")
    if len(date_formats_found) > 1:
        score -= 10

    # Excessive all-caps sections (more than 5 lines all uppercase)
    all_caps_lines = [l for l in lines if l.strip() and l.strip() == l.strip().upper() and len(l.strip()) > 3]
    if len(all_caps_lines) > 5:
        score -= 5

    return max(0, score)


def _contact_score(raw_text: str) -> float:
    """Score presence of contact information fields."""
    score = 0.0

    if EMAIL_PATTERN.search(raw_text):
        score += 25
    if PHONE_PATTERN.search(raw_text):
        score += 25
    if LINKEDIN_PATTERN.search(raw_text):
        score += 25
    # Location/city heuristic — common Indian cities or generic location patterns
    location_pattern = re.compile(
        r"(?:bangalore|bengaluru|mumbai|delhi|hyderabad|pune|chennai|kolkata|"
        r"noida|gurgaon|gurugram|ahmedabad|jaipur|new york|san francisco|"
        r"london|berlin|toronto|sydney|remote|india|usa|uk|canada)",
        re.IGNORECASE,
    )
    if location_pattern.search(raw_text):
        score += 15
    # GitHub or portfolio
    if GITHUB_PATTERN.search(raw_text) or re.search(r"portfolio|personal\s*website", raw_text, re.IGNORECASE):
        score += 10

    return min(100, score)


def _length_score(raw_text: str, page_count: int, experience_level: str) -> float:
    """Score based on resume length vs experience level expectations."""
    ideal_min, ideal_max = EXPERIENCE_IDEAL_PAGES.get(experience_level, (1, 2))

    if ideal_min <= page_count <= ideal_max:
        return 100.0

    deviation = 0
    if page_count < ideal_min:
        deviation = ideal_min - page_count
    else:
        deviation = page_count - ideal_max

    # Deduct per page of deviation
    return max(0, 100 - (deviation * 30))


def _consistency_score(sections: dict[str, list[str]]) -> float:
    """Score for consistent formatting in experience bullets."""
    experience_lines = sections.get("experience", [])
    if not experience_lines:
        return 70.0  # Neutral if no experience section

    # Check how many bullets start with action verbs
    bullets = [l.strip().lstrip("•-–—*▪▸→ ") for l in experience_lines if l.strip()]
    if not bullets:
        return 70.0

    action_starts = 0
    for bullet in bullets:
        first_word = bullet.split()[0].lower() if bullet.split() else ""
        if first_word in ACTION_VERBS:
            action_starts += 1

    consistency_ratio = action_starts / max(len(bullets), 1)

    # Also check date format consistency within experience
    score = consistency_ratio * 100

    return max(0, min(100, score))
