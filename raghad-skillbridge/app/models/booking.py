from sqlalchemy import Column, Integer, ForeignKey, DateTime, String, Enum, Text
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class BookingStatus(enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # الطالب
    mentor_id = Column(Integer, ForeignKey("mentors.id"), nullable=False)  # المرشد
    booking_date = Column(DateTime, nullable=False)  # تاريخ الجلسة
    start_time = Column(DateTime, nullable=False)  # وقت البداية
    end_time = Column(DateTime, nullable=False)  # وقت النهاية
    status = Column(Enum(BookingStatus), default=BookingStatus.PENDING)  # حالة الحجز
    notes = Column(Text)  # ملاحظات إضافية
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
