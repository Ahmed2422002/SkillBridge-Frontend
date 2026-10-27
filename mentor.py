from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.sql import func
from app.core.database import Base

class Mentor(Base):
    __tablename__ = "mentors"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)  # كل مستخدم مرشد مرة واحدة
    specialty = Column(String, nullable=False)  # التخصص (مثل: Python, Web, Data)
    experience_years = Column(Integer, nullable=False)  # سنوات الخبرة
    hourly_rate = Column(Float, nullable=False)  # السعر بالساعة (بالدولار)
    bio = Column(Text)  # السيرة الذاتية
    is_available = Column(Boolean, default=True)  # هل المرشد متاح حالياً؟
    rating = Column(Float, default=0.0)  # تقييم المرشد (من 1 إلى 5)
    total_reviews = Column(Integer, default=0)  # عدد التقييمات
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
