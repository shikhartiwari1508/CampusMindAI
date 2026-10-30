from datetime import datetime
from typing import List, Optional, Dict

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from ..database import get_db
from .. import models, schemas
from ..dependencies import admin_required
from ..services import analytics

router = APIRouter()
VALID_COMPLAINT_STATUSES = {"OPEN", "IN_PROGRESS", "RESOLVED"}

@router.get("/dashboard", summary="Admin dashboard statistics")
async def admin_dashboard(
    db: Session = Depends(get_db),
    _: models.User = Depends(admin_required),
):
    return analytics.get_dashboard_stats(db)

@router.get("/complaints", response_model=List[schemas.ComplaintRead], summary="List all complaints with optional filters")
async def list_all_complaints(
    status_filter: Optional[str] = Query(None, description="Filter by status"),
    category: Optional[str] = Query(None),
    building: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    _: models.User = Depends(admin_required),
):
    query = db.query(models.Complaint)
    if status_filter:
        normalized = status_filter.upper()
        if normalized not in VALID_COMPLAINT_STATUSES:
            raise HTTPException(status_code=400, detail="Invalid complaint status")
        query = query.filter(models.Complaint.status == normalized)
    if category:
        query = query.filter(models.Complaint.category == category)
    if building:
        query = query.filter(models.Complaint.building == building)
    return query.order_by(models.Complaint.created_at.desc()).all()

@router.patch("/{complaint_id}", response_model=schemas.ComplaintRead, summary="Update complaint fields (admin only)")
async def update_complaint(
    complaint_id: int,
    payload: schemas.AdminComplaintUpdate,
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(admin_required),
):
    complaint = db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")

    changes = payload.dict(exclude_unset=True)
    new_status = changes.get("status")
    if new_status is not None:
        new_status = new_status.upper()
        if new_status not in VALID_COMPLAINT_STATUSES:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Status must be OPEN, IN_PROGRESS, or RESOLVED",
            )
        changes["status"] = new_status

    previous_status = complaint.status
    for attr, value in changes.items():
        setattr(complaint, attr, value)

    if new_status is not None and new_status != previous_status:
        if new_status == "RESOLVED":
            complaint.resolved_at = datetime.utcnow()
        elif previous_status == "RESOLVED":
            complaint.resolved_at = None

    db.add(complaint)
    db.flush()

    if new_status is not None and new_status != previous_status:
        history_note = f"Status changed from {previous_status} to {new_status}"
        if changes.get("resolution_note"):
            history_note += f". Resolution note: {changes['resolution_note']}"
        db.add(models.ComplaintHistory(
            complaint_id=complaint.id,
            action="status_change",
            performed_by=admin_user.id,
            note=history_note,
        ))
    elif changes:
        db.add(models.ComplaintHistory(
            complaint_id=complaint.id,
            action="admin_update",
            performed_by=admin_user.id,
            note="Admin updated complaint details",
        ))

    db.commit()
    db.refresh(complaint)
    return complaint

@router.post("/{complaint_id}/notes", summary="Add an administrative note to a complaint")
async def add_admin_note(
    complaint_id: int,
    note: Dict[str, str],
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(admin_required),
):
    complaint = db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")
    note_text = (note.get("note") or "").strip()
    if not note_text:
        raise HTTPException(status_code=422, detail="Note cannot be empty")
    db.add(models.ComplaintHistory(
        complaint_id=complaint.id,
        action="admin_note",
        performed_by=admin_user.id,
        note=note_text,
    ))
    db.commit()
    return {"detail": "Note added"}

@router.get("/analytics", summary="Detailed analytics data for charts")
async def analytics_endpoint(
    db: Session = Depends(get_db),
    _: models.User = Depends(admin_required),
):
    return analytics.get_analytics_data(db)
