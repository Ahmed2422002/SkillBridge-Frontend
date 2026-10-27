from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Content(Base):
    __tablename__ = "contents"
    
    id = Column(Integer, primary_key=True, index=True)
    roadmap_id = Column(Integer, ForeignKey("roadmaps.id"), nullable=False)  # الخطة المرتبطة
    stage_number = Column(Integer, nullable=False)  # رقم المرحلة (1, 2, 3, ...)
    title = Column(String, nullable=False)  # عنوان المحتوى
    description = Column(Text)  # وصف المحتوى
    content_type = Column(String, nullable=False)  # video, article, link, pdf
    content_url = Column(String)  # رابط الفيديو أو المقال
    is_required = Column(Boolean, default=True)  # هل المحتوى إجباري؟
    order = Column(Integer, default=0)  # ترتيب العرض
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
