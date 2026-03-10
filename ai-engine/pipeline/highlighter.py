"""
Step 7 — Highlight Map Generator
Color-code resume text: green (strong), yellow (improvable), red (weak).
"""

from __future__ import annotations
import re

# Weak phrases that signal passive/vague writing
WEAK_PHRASES = [
    "responsible for", "helped with", "assisted in", "worked on",
    "involved in", "participated in", "contributed to", "was part of",
    "supported the", "aided in", "tasked with",
]

# Strong action verbs
ACTION_VERBS = {
    "led", "built", "designed", "developed", "managed", "created",
    "improved", "launched", "delivered", "implemented", "optimized",
    "automated", "reduced", "increased", "achieved", "collaborated",
    "mentored", "established", "initiated", "executed", "analyzed",
    "configured", "deployed", "engineered", "integrated", "maintained",
    "migrated", "orchestrated", "architected", "refactored", "resolved",
    "scaled", "secured", "streamlined", "transformed", "spearheaded",
    "drove", "generated", "coordinated", "facilitated", "negotiated",
    "published", "researched", "supervised", "trained",
}

# Quantifier patterns: numbers with metrics
QUANTIFIER_PATTERN = re.compile(
    r"\d+\s*(?:%|\$|K|M|B|x|users|customers|clients|requests|hours|days|weeks|months|years|"
    r"teams?|engineers?|developers?|members?|people|projects?|features?|endpoints?|services?|"
    r"pages?|reports?|transactions?|queries?)",
    re.IGNORECASE,
)


def generate_highlight_map(
    sections: dict[str, list[str]],
    skills_found: list[dict],
    skills_missing: list[str],
    raw_text: str,
) -> list[dict]:
    """
    Generate a color-coded highlight map for resume text.

    Returns list of:
        {text, color (green|yellow|red), tooltip, section}
    """
    highlights: list[dict] = []
    found_skill_names = {s["name"].lower() for s in skills_found}

    missing_skill_names = set()
    for skill in skills_missing:
        if isinstance(skill, dict):
            missing_skill_names.add(skill.get("name", "").lower())
        else:
            missing_skill_names.add(skill.lower())

    for section_name, lines in sections.items():
        if section_name == "contact":
            continue  # Skip contact info

        for line in lines:
            stripped = line.strip()
            if not stripped or len(stripped) < 5:
                continue

            color, tooltip = _classify_line(
                stripped, section_name, found_skill_names, missing_skill_names
            )

            highlights.append({
                "text": stripped,
                "color": color,
                "tooltip": tooltip,
                "section": section_name,
            })

    return highlights


def _classify_line(
    text: str,
    section: str,
    found_skills: set[str],
    missing_skills: set[str],
) -> tuple[str, str]:
    """
    Classify a line of resume text.

    Returns: (color, tooltip)
    """
    text_lower = text.lower()
    stripped = text.strip().lstrip("•-–—*▪▸→ ").strip()

    # ── RED: Weak phrases ──
    for phrase in WEAK_PHRASES:
        if phrase in text_lower:
            return (
                "red",
                f"Weak ❌: Replace passive phrase '{phrase}' with an action verb + result. "
                f"e.g. 'Responsible for reports' → 'Generated weekly reports that reduced decision time by 30%'",
            )

    # ── RED: Unclassified section (orphan content) ──
    if section == "unclassified" and len(text) > 20:
        return (
            "red",
            "Weak ❌: This content doesn't belong to a recognized section. "
            "Restructure under a clear header (Experience, Skills, Projects).",
        )

    # ── GREEN: Action verb + quantified achievement ──
    first_word = stripped.split()[0].lower() if stripped.split() else ""
    has_action_verb = first_word in ACTION_VERBS
    has_quantifier = bool(QUANTIFIER_PATTERN.search(text))

    if has_action_verb and has_quantifier:
        return (
            "green",
            "Strong ✅: Clear action verb with quantified achievement — ATS and recruiters love this.",
        )

    # ── GREEN: Action verb with impact words ──
    impact_words = {"increased", "reduced", "improved", "achieved", "delivered", "launched", "optimized"}
    if has_action_verb and any(w in text_lower for w in impact_words):
        return (
            "green",
            "Strong ✅: Good action verb with impact signal. Adding a number would make it even better.",
        )

    # ── YELLOW: Has action verb but no quantifier ──
    if has_action_verb and not has_quantifier:
        return (
            "yellow",
            "Could be stronger 🟡: You start with a good action verb, but add a number or specific outcome "
            "to make this line stand out to ATS and recruiters.",
        )

    # ── YELLOW: Has quantifier but no action verb ──
    if has_quantifier and not has_action_verb:
        return (
            "yellow",
            "Could be stronger 🟡: Good that you include numbers, but start with a strong action verb "
            "(Led, Built, Delivered, Increased) for maximum impact.",
        )

    # ── Skills section: highlight found skills ──
    if section == "skills":
        return (
            "green" if any(s in text_lower for s in found_skills) else "yellow",
            "Strong ✅: Relevant skills listed." if any(s in text_lower for s in found_skills)
            else "Could be stronger 🟡: Consider adding more role-specific keywords.",
        )

    # ── Default: yellow for content that could be improved ──
    if len(text) > 15:
        return (
            "yellow",
            "Could be stronger 🟡: Add a specific outcome, number, or technology to make this line stand out.",
        )

    return ("yellow", "")
