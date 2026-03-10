"""
Step 3 — Skill Extractor
Explicit + implicit skill extraction with proficiency heuristic.
"""

from __future__ import annotations
import re
from data.master_skills import ALL_SKILLS_FLAT, SKILL_TO_CATEGORY, IMPLICIT_PATTERNS, MASTER_SKILLS


def extract_skills(
    sections: dict[str, list[str]],
    raw_text: str,
) -> list[dict]:
    """
    Extract skills from resume sections.

    Returns list of dicts:
        {name, type (explicit/implicit), proficiency, frequency, section_found, category}
    """
    skills_found: dict[str, dict] = {}  # keyed by lowercase name
    text_lower = raw_text.lower()

    # ── EXPLICIT EXTRACTION ──
    # Scan all sections for master skill names
    for section_name, lines in sections.items():
        section_text = " ".join(lines).lower()
        for category, skill_list in MASTER_SKILLS.items():
            for skill in skill_list:
                skill_lower = skill.lower()
                if _skill_in_text(skill_lower, section_text):
                    if skill_lower not in skills_found:
                        frequency = _count_occurrences(skill_lower, text_lower)
                        skills_found[skill_lower] = {
                            "name": skill,
                            "type": "explicit",
                            "proficiency": _classify_proficiency(skill_lower, text_lower, frequency),
                            "frequency": frequency,
                            "section_found": section_name,
                            "category": category,
                        }
                    else:
                        # Update frequency if found in another section
                        skills_found[skill_lower]["frequency"] = _count_occurrences(
                            skill_lower, text_lower
                        )

    # ── IMPLICIT EXTRACTION ──
    # Pattern-match experience and project lines
    implicit_sections = ["experience", "projects", "summary", "unclassified"]
    for section_name in implicit_sections:
        for line in sections.get(section_name, []):
            line_lower = line.lower()
            for pattern, inferred_skills in IMPLICIT_PATTERNS:
                if re.search(pattern, line_lower):
                    for skill_name in inferred_skills:
                        skill_lower = skill_name.lower()
                        if skill_lower not in skills_found:
                            skills_found[skill_lower] = {
                                "name": skill_name,
                                "type": "implicit",
                                "proficiency": "intermediate",
                                "frequency": 1,
                                "section_found": section_name,
                                "category": SKILL_TO_CATEGORY.get(skill_lower, "soft"),
                            }

    # ── PROFICIENCY REFINEMENT ──
    # Check for explicit proficiency keywords near skill mentions
    for skill_lower, info in skills_found.items():
        info["proficiency"] = _classify_proficiency(
            skill_lower, text_lower, info["frequency"]
        )

    return list(skills_found.values())


def _skill_in_text(skill_lower: str, text: str) -> bool:
    """Check if a skill appears in text as a distinct term (word boundary)."""
    # Escape special regex characters in skill name
    escaped = re.escape(skill_lower)
    # Use word boundaries but allow . and + and # in skill names
    pattern = rf"(?<![a-zA-Z]){escaped}(?![a-zA-Z])"
    return bool(re.search(pattern, text))


def _count_occurrences(skill_lower: str, text: str) -> int:
    """Count how many times a skill appears in the full text."""
    escaped = re.escape(skill_lower)
    return len(re.findall(rf"(?<![a-zA-Z]){escaped}(?![a-zA-Z])", text))


def _classify_proficiency(skill_lower: str, text: str, frequency: int) -> str:
    """
    Classify proficiency based on frequency and contextual keywords.

    Expert: 4+ occurrences OR paired with expert/advanced/5+ years
    Intermediate: 2-3 occurrences OR proficient/2-3 years
    Beginner: 1 occurrence OR familiar/basic/learning
    """
    # Check for explicit proficiency keywords near the skill
    escaped = re.escape(skill_lower)

    # Expert signals
    expert_pattern = rf"(?:expert|advanced|senior|extensive|5\+?\s*(?:years?|yrs?)|deep\s+knowledge).*{escaped}|{escaped}.*(?:expert|advanced|senior|extensive)"
    if re.search(expert_pattern, text):
        return "expert"

    # Beginner signals
    beginner_pattern = rf"(?:familiar|basic|learning|beginner|exposure|introduct).*{escaped}|{escaped}.*(?:familiar|basic|learning|beginner)"
    if re.search(beginner_pattern, text):
        return "beginner"

    # Frequency-based
    if frequency >= 4:
        return "expert"
    elif frequency >= 2:
        return "intermediate"
    else:
        return "beginner"
