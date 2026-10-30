from datetime import datetime
from typing import Optional

from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, Float, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    role = Column(Enum("student", "admin", name="user_roles"), nullable=False, default="student")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    complaints = relationship("Complaint", back_populates="creator")

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    public_ticket_id = Column(String, unique=True, index=True, nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=True)
    building = Column(String, nullable=True)
    location_details = Column(String, nullable=True)
    image_path = Column(String, nullable=True)
    severity = Column(Integer, nullable=True)
    urgency = Column(Integer, nullable=True)
    repeat_score = Column(Float, nullable=True)
    priority_score = Column(Float, nullable=True)
    suggested_department = Column(String, nullable=True)
    assigned_department = Column(String, nullable=True)
    ai_summary = Column(Text, nullable=True)
    ai_reason = Column(Text, nullable=True)
    ai_confidence = Column(Float, nullable=True)
    status = Column(Enum("OPEN", "IN_PROGRESS", "RESOLVED", name="complaint_status"), default="OPEN", nullable=False)
    resolution_note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    creator = relationship("User", back_populates="complaints")
    history = relationship("ComplaintHistory", back_populates="complaint", cascade="all, delete-orphan")

class ComplaintHistory(Base):
    __tablename__ = "complaint_history"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    action = Column(String, nullable=False)  # e.g., "status_change", "note_added"
    performed_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    note = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    complaint = relationship("Complaint", back_populates="history")
    user = relationship("User")
