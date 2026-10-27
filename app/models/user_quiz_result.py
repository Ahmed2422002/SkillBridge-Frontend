from sqlalchemy import Column, Integer, Boolean, ForeignKey, DateTime, JSON
from sqlalchemy.sql import func
from app.core.database import Base

class UserQuizResult(Base):
    __tablename__ = "user_quiz_results"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    score = Column(Integer, default=0)  # 0-100
    passed = Column(Boolean, default=False)
    answers = Column(JSON)  # تخزين إجابات المستخدم كـ JSON
    created_at = Column(DateTime(timezone=True), server_default=func.now())
