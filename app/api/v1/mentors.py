from fastapi import APIRouter, HTTPException, Depends, Header, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.core.database import get_db
from app.models.user import User
from app.models.mentor import Mentor
from app.models.booking import Booking, BookingStatus
from app.schemas.mentor import (
    MentorCreate, MentorUpdate, MentorResponse,
    BookingCreate, BookingUpdate, BookingResponse,
    MentorSearch
)
from app.core.security import decode_access_token

router = APIRouter(prefix="/mentors", tags=["Mentors"])

# ============================================
# دالة مساعدة للحصول على المستخدم
# ============================================
def get_current_user(token: str, db: Session):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.username == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# ============================================
# 1. إضافة مرشد جديد (المستخدم يصبح مرشداً)
# ============================================
@router.post("/", response_model=MentorResponse)
def create_mentor(
    mentor: MentorCreate,
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    # التحقق من أن المستخدم ليس مرشداً بالفعل
    existing_mentor = db.query(Mentor).filter(Mentor.user_id == user.id).first()
    if existing_mentor:
        raise HTTPException(status_code=400, detail="User is already a mentor")
    
    # إنشاء مرشد جديد
    new_mentor = Mentor(
        user_id=user.id,
        specialty=mentor.specialty,
        experience_years=mentor.experience_years,
        hourly_rate=mentor.hourly_rate,
        bio=mentor.bio,
        is_available=True,
        rating=0.0,
        total_reviews=0
    )
    
    db.add(new_mentor)
    db.commit()
    db.refresh(new_mentor)
    
    return new_mentor

# ============================================
# 2. عرض جميع المرشدين (مع فلتر البحث)
# ============================================
@router.get("/", response_model=List[MentorResponse])
def get_mentors(
    specialty: Optional[str] = Query(None, description="فلتر حسب التخصص"),
    min_experience: Optional[int] = Query(None, description="الحد الأدنى للخبرة"),
    max_hourly_rate: Optional[float] = Query(None, description="الحد الأقصى للسعر"),
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    query = db.query(Mentor)
# تطبيق الفلاتر
    if specialty:
        query = query.filter(Mentor.specialty.ilike(f"%{specialty}%"))
    if min_experience:
        query = query.filter(Mentor.experience_years >= min_experience)
    if max_hourly_rate:
        query = query.filter(Mentor.hourly_rate <= max_hourly_rate)
    
    # فقط المرشدين المتاحين
    query = query.filter(Mentor.is_available == True)
    
    return query.all()

# ============================================
# 3. عرض مرشد معين
# ============================================
@router.get("/{mentor_id}", response_model=MentorResponse)
def get_mentor(
    mentor_id: int,
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    mentor = db.query(Mentor).filter(Mentor.id == mentor_id).first()
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
    
    return mentor

# ============================================
# 4. تحديث بيانات المرشد
# ============================================
@router.put("/{mentor_id}", response_model=MentorResponse)
def update_mentor(
    mentor_id: int,
    mentor_update: MentorUpdate,
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    mentor = db.query(Mentor).filter(Mentor.id == mentor_id).first()
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
    
    # التأكد من أن المستخدم هو صاحب الحساب
    if mentor.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # تحديث الحقول
    if mentor_update.specialty is not None:
        mentor.specialty = mentor_update.specialty
    if mentor_update.experience_years is not None:
        mentor.experience_years = mentor_update.experience_years
    if mentor_update.hourly_rate is not None:
        mentor.hourly_rate = mentor_update.hourly_rate
    if mentor_update.bio is not None:
        mentor.bio = mentor_update.bio
    if mentor_update.is_available is not None:
        mentor.is_available = mentor_update.is_available
    
    db.commit()
    db.refresh(mentor)
    
    return mentor

# ============================================
# 5. حجز جلسة مع مرشد
# ============================================
@router.post("/booking", response_model=BookingResponse)
def create_booking(
    booking: BookingCreate,
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    # التحقق من وجود المرشد
    mentor = db.query(Mentor).filter(Mentor.id == booking.mentor_id).first()
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
    
    # التحقق من أن الطالب ليس هو المرشد نفسه
    if mentor.user_id == user.id:
        raise HTTPException(status_code=400, detail="Cannot book yourself")
    
    # التحقق من عدم وجود حجز مكرر في نفس الوقت
    existing_booking = db.query(Booking).filter(
        Booking.mentor_id == booking.mentor_id,
        Booking.start_time == booking.start_time,
        Booking.status != BookingStatus.CANCELLED
    ).first()
    
    if existing_booking:
        raise HTTPException(status_code=400, detail="This time slot is already booked")
    
    # إنشاء حجز جديد
    new_booking = Booking(
        student_id=user.id,
        mentor_id=booking.mentor_id,
        booking_date=booking.booking_date,
        start_time=booking.start_time,
        end_time=booking.end_time,
        status=BookingStatus.PENDING,
        notes=booking.notes
    )
    
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    
    return new_booking

# ============================================
# 6. عرض حجوزات المستخدم
# ============================================
@router.get("/booking/my", response_model=List[BookingResponse])
def get_my_bookings(
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    bookings = db.query(Booking).filter(
        (Booking.student_id == user.id) | (Booking.mentor_id == user.id)
    ).all()
    
    return bookings

# ============================================
# 7. تحديث حالة الحجز (تأكيد/إلغاء)
# ============================================
@router.put("/booking/{booking_id}")
def update_booking_status(
    booking_id: int,
    status_update: BookingUpdate,
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # التأكد من أن المستخدم هو صاحب الحجز أو المرشد
    mentor = db.query(Mentor).filter(Mentor.id == booking.mentor_id).first()
    if booking.student_id != user.id and mentor.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # تحديث الحالة
    if status_update.status:
        try:
            booking.status = BookingStatus[status_update.status.upper()]
        except KeyError:
            raise HTTPException(status_code=400, detail="Invalid status")
    
    db.commit()
    db.refresh(booking)
    
    return {"message": f"Booking {booking.status.value}"}