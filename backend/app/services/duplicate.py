# Duplicate detection service (lightweight deterministic version)

"""Provides a simple similarityâ€‘based duplicate detection.

The function `find_similar` accepts a SQLAlchemy session, the new complaint
object, and returns a list of possible duplicates among *open* complaints.
It uses `difflib.SequenceMatcher` on the concatenated title + description and
adds a building/location filter.
"""

import difflib
from typing import List, Dict
from sqlalchemy.orm import Session
from .. import models

# Configurable similarity threshold (0â€‘1). Adjust via env var if needed.
SIMILARITY_THRESHOLD = 0.6


def _text_similarity(a: str, b: str) -> float:
    """Return a similarity ratio between two strings (0â€‘1)."""
    return difflib.SequenceMatcher(None, a.lower(), b.lower()).ratio()


def find_similar(session: Session, new_complaint: models.Complaint) -> List[Dict[str, object]]:
    """Find possible duplicate open complaints.

    Parameters
    ----------
    session: Session
        Active SQLAlchemy session.
    new_complaint: models.Complaint
        The freshly created complaint instance (not yet committed).

    Returns
    -------
    List[Dict]
        Each dict contains ``id``, ``public_ticket_id`` and ``similarity``.
    """
    # Build the text to compare
    new_text = f"{new_complaint.title} {new_complaint.description}".strip()

    # Query recent open complaints (limit to a reasonable number for performance)
    query = session.query(models.Complaint).filter(models.Complaint.status == "OPEN")
    if new_complaint.building:
        query = query.filter(models.Complaint.building == new_complaint.building)
    recent = query.order_by(models.Complaint.created_at.desc()).limit(50).all()

    duplicates = []
    for comp in recent:
        existing_text = f"{comp.title} {comp.description}".strip()
        sim = _text_similarity(new_text, existing_text)
        if sim >= SIMILARITY_THRESHOLD:
            duplicates.append({
                "id": comp.id,
                "public_ticket_id": comp.public_ticket_id,
                "similarity": round(sim, 3),
            })
    # Sort by similarity descending
    duplicates.sort(key=lambda x: x["similarity"], reverse=True)
    return duplicates
