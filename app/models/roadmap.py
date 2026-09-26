from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON
from sqlalchemy.sql import func
from app.core.database import Base

class Roadmap(Base):
    __tablename__ = "roadmaps"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # رابط للمستخدم
    title = Column(String, nullable=False)  # عنوان الخطة (مثل: "تعلم Python")
    description = Column(Text)  # وصف الخطة
    goal = Column(String)  # الهدف (مثل: "الحصول على وظيفة مبرمج")
    level = Column(String)  # المستوى (مبتدئ، متوسط، متقدم)
    steps = Column(JSON)  # خطوات الخطة (مصفوفة)
    progress = Column(Integer, default=0)  # نسبة التقدم (0-100)
    is_completed = Column(Integer, default=0)  # 0 = غير مكتمل، 1 = مكتمل
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
