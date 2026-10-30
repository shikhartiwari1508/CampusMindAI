# AI service for deterministic fallback analysis

"""CampusMind AI deterministic fallback classifier.

When the Gemini API is unavailable, this module provides a simple deterministic
implementation that maps keywords in the complaint description to a predefined
set of categories and computes static severity/urgency values.

The function returns a dict compatible with the schema expected by the
`Complaint` model fields:

```python
{
    "category": str,
    "severity": int,
    "urgency": int,
    "suggested_department": str,
    "summary": str,
    "reason": str,
    "confidence": float,
}
```

The logic is intentionally lightweight and fully testable without external
services.
"""

import re
from typing import Dict

# Simple keyword â†’ (category, department) mapping
_KEYWORD_MAP = {
    "leak": ("Plumbing", "Maintenance Department"),
    "water": ("Plumbing", "Maintenance Department"),
    "fan": ("Electrical", "Electrical Department"),
    "light": ("Electrical", "Electrical Department"),
    "socket": ("Electrical", "Electrical Department"),
    "wifi": ("IT/Internet", "IT Department"),
    "internet": ("IT/Internet", "IT Department"),
    "lab": ("Laboratory", "Lab Services"),
    "library": ("Library", "Library Services"),
    "trash": ("Sanitation", "Sanitation Department"),
    "clean": ("Sanitation", "Sanitation Department"),
    "damage": ("Safety", "Safety Department"),
}

_DEFAULT_CATEGORY = ("Other", "General Services")


def _detect_category(text: str) -> tuple:
    """Return a (category, department) tuple based on keyword detection.

    The search is caseâ€‘insensitive and matches whole words.
    """
    lowered = text.lower()
    for kw, mapping in _KEYWORD_MAP.items():
        if re.search(r"\\b" + re.escape(kw) + r"\\b", lowered):
            return mapping
    return _DEFAULT_CATEGORY


def analyze_complaint(title: str, description: str) -> Dict[str, object]:
    """Deterministic fallback analysis.

    Parameters
    ----------
    title: str
        Short title of the complaint.
    description: str
        Full description supplied by the student.

    Returns
    -------
    dict
        Keys match the expected AI payload.
    """
    # Combine title and description for keyword detection
    combined = f"{title} {description}".strip()
    category, department = _detect_category(combined)

    # Simple heuristic for severity / urgency (0â€‘100)
    # Longer text â†’ higher severity, presence of urgent words â†’ higher urgency
    length_score = min(len(combined) // 2, 100)
    urgent_keywords = ["urgent", "immediate", "asap", "critical", "danger"]
    urgency_score = 20  # base
    if any(kw in combined.lower() for kw in urgent_keywords):
        urgency_score = 80
    else:
        urgency_score = min(length_score, 70)

    severity_score = min(length_score, 90)

    summary = f"{title[:60].strip()}" if title else "No title provided"
    reason = f"Detected category '{category}' based on keywords."

    return {
        "category": category,
        "severity": severity_score,
        "urgency": urgency_score,
        "suggested_department": department,
        "summary": summary,
        "reason": reason,
        "confidence": 0.85,  # deterministic confidence
}
