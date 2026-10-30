# Analytics service for CampusMind AI

"""Simple aggregation functions for the admin dashboard.

All functions accept a SQLAlchemy ``Session`` and return dictionaries that can be
JSONâ€‘encoded directly by FastAPI responses.
"""

from typing import Dict, List
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from datetime import datetime

from .. import models


def _average_resolution_time(session: Session) -> float:
    """Return average resolution time in days for resolved complaints.

    If no complaints are resolved, returns ``0.0``.
    """
    result = (
        session.query(
            func.avg(func.julianday(models.Complaint.resolved_at) - func.julianday(models.Complaint.created_at))
        )
        .filter(models.Complaint.status == "RESOLVED")
        .scalar()
    )
    return float(result) if result else 0.0


def get_dashboard_stats(session: Session) -> Dict[str, object]:
    """Collect highâ€‘level statistics for the admin dashboard.

    Returns a dictionary containing totals, status breakdowns, category counts,
    building counts and the average resolution time.
    """
    total = session.query(func.count(models.Complaint.id)).scalar()
    open_cnt = session.query(func.count(models.Complaint.id)).filter(models.Complaint.status == "OPEN").scalar()
    in_progress = session.query(func.count(models.Complaint.id)).filter(models.Complaint.status == "IN_PROGRESS").scalar()
    resolved = session.query(func.count(models.Complaint.id)).filter(models.Complaint.status == "RESOLVED").scalar()

    # Complaints by category
    by_category = (
        session.query(models.Complaint.category, func.count(models.Complaint.id))
        .group_by(models.Complaint.category)
        .all()
    )
    category_stats = {cat or "Uncategorized": cnt for cat, cnt in by_category}

    # Complaints by building
    by_building = (
        session.query(models.Complaint.building, func.count(models.Complaint.id))
        .group_by(models.Complaint.building)
        .all()
    )
    building_stats = {bld or "Unknown": cnt for bld, cnt in by_building}

    avg_resolution = _average_resolution_time(session)

    return {
        "total_complaints": total,
        "open_complaints": open_cnt,
        "in_progress_complaints": in_progress,
        "resolved_complaints": resolved,
        "category_distribution": category_stats,
        "building_distribution": building_stats,
        "average_resolution_days": round(avg_resolution, 2),
    }


def get_analytics_data(session: Session) -> Dict[str, object]:
    """More detailed data suitable for charts.

    Returns the same information as ``get_dashboard_stats`` plus a list of the
    top 5 most frequent categories and buildings.
    """
    stats = get_dashboard_stats(session)

    # Top 5 categories
    top_categories = (
        session.query(models.Complaint.category, func.count(models.Complaint.id).label("cnt"))
        .group_by(models.Complaint.category)
        .order_by(func.count(models.Complaint.id).desc())
        .limit(5)
        .all()
    )
    stats["top_categories"] = [{"category": cat or "Uncategorized", "count": cnt} for cat, cnt in top_categories]

    # Top 5 buildings
    top_buildings = (
        session.query(models.Complaint.building, func.count(models.Complaint.id).label("cnt"))
        .group_by(models.Complaint.building)
        .order_by(func.count(models.Complaint.id).desc())
        .limit(5)
        .all()
    )
    stats["top_buildings"] = [{"building": bld or "Unknown", "count": cnt} for bld, cnt in top_buildings]

    return stats
