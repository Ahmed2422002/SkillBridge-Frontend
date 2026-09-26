from sqlalchemy import Column, Integer, ForeignKey, Boolean, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class UserContentProgress(Base):
    __tablename__ = "user_content_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content_id = Column(Integer, ForeignKey("contents.id"), nullable=False)
    is_completed = Column(Boolean, default=False)  # هل اكتمل المحتوى؟
    completed_at = Column(DateTime(timezone=True), nullable=True)  # تاريخ الإكمال
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
