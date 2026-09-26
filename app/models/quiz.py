from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.sql import func
from app.core.database import Base

class Quiz(Base):
    __tablename__ = "quizzes"
    
    id = Column(Integer, primary_key=True, index=True)
    content_id = Column(Integer, ForeignKey("contents.id"), nullable=False)  # المرحلة المرتبطة
    title = Column(String, nullable=False)  # عنوان الاختبار
    description = Column(Text)  # وصف الاختبار
    passing_score = Column(Integer, default=70)  # درجة النجاح (70%)
    duration_minutes = Column(Integer, default=10)  # المدة بالدقائق
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
