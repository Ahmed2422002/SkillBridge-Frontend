from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# ============================================
# مخططات المرشد (Mentor)
# ============================================
class MentorCreate(BaseModel):
    specialty: str
    experience_years: int
    hourly_rate: float
    bio: Optional[str] = None

class MentorUpdate(BaseModel):
    specialty: Optional[str] = None
    experience_years: Optional[int] = None
    hourly_rate: Optional[float] = None
    bio: Optional[str] = None
    is_available: Optional[bool] = None

class MentorResponse(BaseModel):
    id: int
    user_id: int
    specialty: str
    experience_years: int
    hourly_rate: float
    bio: Optional[str]
    is_available: bool
    rating: float
    total_reviews: int
    created_at: str
    
    class Config:
        from_attributes = True
# ============================================
# مخططات الحجز (Booking)
# ============================================
class BookingCreate(BaseModel):
    mentor_id: int
    booking_date: datetime
    start_time: datetime
    end_time: datetime
    notes: Optional[str] = None

class BookingUpdate(BaseModel):
    status: Optional[str] = None  # pending, confirmed, completed, cancelled

class BookingResponse(BaseModel):
    id: int
    student_id: int
    mentor_id: int
    booking_date: datetime
    start_time: datetime
    end_time: datetime
    status: str
    notes: Optional[str]
    created_at: str
    
    class Config:
        from_attributes = True

# ============================================
# مخططات البحث
# ============================================
class MentorSearch(BaseModel):
    specialty: Optional[str] = None
    min_experience: Optional[int] = None
    max_hourly_rate: Optional[float] = None