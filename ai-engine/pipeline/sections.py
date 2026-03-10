"""
Step 2 — Section Structurer
Detect section headers via regex and group resume lines into standard sections.
"""

from __future__ import annotations
import re

# Section header keyword maps
SECTION_KEYWORDS: dict[str, list[str]] = {
    "summary": [
        "summary", "objective", "profile", "about", "overview",
        "professional summary", "career objective", "personal statement",
    ],
    "experience": [
        "experience", "work", "employment", "career", "professional",
        "work history", "career history", "professional experience",
        "work experience",
    ],
    "education": [
        "education", "academic", "qualification", "degree", "university",
        "educational background", "academic background",
    ],
    "skills": [
        "skills", "technologies", "tools", "languages", "competencies",
        "expertise", "technical skills", "core competencies",
        "technical expertise", "tech stack", "proficiencies",
    ],
    "projects": [
        "projects", "portfolio", "personal projects", "work samples",
        "side projects", "key projects", "notable projects",
    ],
    "certifications": [
        "certifications", "certificates", "courses", "training",
        "licenses", "professional development", "online courses",
    ],
    "achievements": [
        "achievements", "awards", "honours", "honors", "accomplishments",
        "recognition", "accolades", "publications",
    ],
}

# Contact detection patterns
EMAIL_PATTERN = re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}")
PHONE_PATTERN = re.compile(r"\+?[\d\s\-()]{10,}")
LINKEDIN_PATTERN = re.compile(r"linkedin\.com/in/[\w\-]+", re.IGNORECASE)
GITHUB_PATTERN = re.compile(r"github\.com/[\w\-]+", re.IGNORECASE)
URL_PATTERN = re.compile(r"https?://[\w\.\-/]+", re.IGNORECASE)


def structure_sections(raw_text: str) -> dict[str, list[str]]:
    """
    Parse raw resume text into categorized sections.

    Returns:
        dict mapping section name to list of text lines.
        Includes "contact" extracted from first few lines.
        Includes "unclassified" for orphan lines.
    """
    lines = raw_text.split("\n")
    sections: dict[str, list[str]] = {
        "contact": [],
        "summary": [],
        "experience": [],
        "education": [],
        "skills": [],
        "projects": [],
        "certifications": [],
        "achievements": [],
        "unclassified": [],
    }

    # Step 1: Extract contact info from the first 8 lines
    header_lines = lines[:8]
    for line in header_lines:
        stripped = line.strip()
        if not stripped:
            continue
        if (
            EMAIL_PATTERN.search(stripped)
            or PHONE_PATTERN.search(stripped)
            or LINKEDIN_PATTERN.search(stripped)
            or GITHUB_PATTERN.search(stripped)
        ):
            sections["contact"].append(stripped)
        elif len(stripped) < 60 and not _is_section_header(stripped):
            # Likely name or title
            sections["contact"].append(stripped)

    # Step 2: Match section headers and group content
    current_section = "unclassified"
    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue

        detected = _detect_section(stripped)
        if detected:
            current_section = detected
            continue

        sections[current_section].append(stripped)

    return sections


def _is_section_header(text: str) -> bool:
    """Check if a line looks like a section header."""
    clean = text.strip().lower()
    # Remove common decorations
    clean = re.sub(r"[:\-–—=_|#*]+$", "", clean).strip()
    clean = re.sub(r"^[:\-–—=_|#*]+", "", clean).strip()

    for keywords in SECTION_KEYWORDS.values():
        if clean in keywords:
            return True
    return False


def _detect_section(text: str) -> str | None:
    """Detect which section a header line belongs to."""
    clean = text.strip().lower()
    # Remove decorative characters
    clean = re.sub(r"[:\-–—=_|#*•\.]+", " ", clean).strip()
    # Remove extra whitespace
    clean = re.sub(r"\s+", " ", clean)

    # An actual section header is typically short (< 5 words)
    if len(clean.split()) > 6:
        return None

    for section, keywords in SECTION_KEYWORDS.items():
        for kw in keywords:
            if clean == kw or clean.startswith(kw):
                return section

    return None
