from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File

from sqlalchemy.orm import Session
from typing import List
import uuid

from ..database import get_db
from .. import models, schemas
from .auth import get_current_user
from ..dependencies import admin_required
from ..services import ai, duplicate

router = APIRouter()

@router.post("/", response_model=schemas.ComplaintRead, status_code=status.HTTP_201_CREATED)
async def create_complaint(
    complaint: schemas.ComplaintCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Only students can create complaints
    if current_user.role != "student":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only students can submit complaints")

    # Generate a public ticket ID
    public_id = str(uuid.uuid4())

    # Deterministic AI analysis fallback
    analysis = ai.analyze_complaint(title=complaint.title, description=complaint.description)

    db_complaint = models.Complaint(
        public_ticket_id=public_id,
        created_by=current_user.id,
        title=complaint.title,
        description=complaint.description,
        building=complaint.building,
        location_details=complaint.location_details,
        category=complaint.category or analysis["category"],
        severity=analysis["severity"],
        urgency=analysis["urgency"],
        repeat_score=None,
        priority_score=None,
        suggested_department=analysis["suggested_department"],
        ai_summary=analysis["summary"],
        ai_reason=analysis["reason"],
        ai_confidence=analysis["confidence"],
        status="OPEN",
    )
    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)

    # Compute repeat_score (simple heuristic: number of open similar complaints)
    repeat = duplicate.find_similar(db, db_complaint)
    db_complaint.repeat_score = len(repeat)

    # Compute priority_score using the formula
    severity = db_complaint.severity or 0
    urgency = db_complaint.urgency or 0
    priority = 0.5 * severity + 0.3 * urgency + 0.2 * db_complaint.repeat_score
    db_complaint.priority_score = round(priority, 2)

    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)

    # Initial history entry
    history = models.ComplaintHistory(
        complaint_id=db_complaint.id,
        action="created",
        performed_by=current_user.id,
        note=None,
    )
    db.add(history)
    db.commit()

    return db_complaint

@router.get("/", response_model=List[schemas.ComplaintRead])
async def list_complaints(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Students see only their own complaints
    if current_user.role == "student":
        complaints = db.query(models.Complaint).filter(models.Complaint.created_by == current_user.id).all()
    else:
        # Admins can see all
        complaints = db.query(models.Complaint).all()
    return complaints

@router.get("/{complaint_id}", response_model=schemas.ComplaintRead)
async def get_complaint(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    complaint = db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")
    if current_user.role == "student" and complaint.created_by != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view this complaint")
    return complaint

@router.get("/{complaint_id}/duplicates", response_model=List[dict])
async def get_duplicates(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    complaint = db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")
    if current_user.role == "student" and complaint.created_by != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    duplicates = duplicate.find_similar(db, complaint)
    return duplicates

@router.get("/{complaint_id}/history", response_model=List[schemas.ComplaintHistoryRead])
async def get_history(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    complaint = db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")
    if current_user.role == "student" and complaint.created_by != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    return complaint.history

