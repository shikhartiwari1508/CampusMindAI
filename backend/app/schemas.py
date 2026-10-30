from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: Optional[EmailStr] = None
    role: Optional[str] = None

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserRead(UserBase):
    id: int
    role: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ComplaintBase(BaseModel):
    title: str
    description: str
    building: Optional[str] = None
    location_details: Optional[str] = None
    category: Optional[str] = None

class ComplaintCreate(ComplaintBase):
    pass

class AdminComplaintUpdate(BaseModel):
    """Partial fields an administrator is allowed to update."""
    status: Optional[str] = None
    category: Optional[str] = None
    assigned_department: Optional[str] = None
    resolution_note: Optional[str] = None

class ComplaintRead(ComplaintBase):
    id: int
    public_ticket_id: str
    created_by: int
    status: str
    severity: Optional[int] = None
    urgency: Optional[int] = None
    repeat_score: Optional[float] = None
    priority_score: Optional[float] = None
    suggested_department: Optional[str] = None
    assigned_department: Optional[str] = None
    ai_summary: Optional[str] = None
    ai_reason: Optional[str] = None
    ai_confidence: Optional[float] = None
    resolution_note: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    resolved_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class ComplaintHistoryRead(BaseModel):
    id: int
    complaint_id: int
    action: str
    performed_by: int
    note: Optional[str] = None
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)
