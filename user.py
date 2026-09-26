from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"  # اسم الجدول في قاعدة البيانات
    
    # الأعمدة (Columns)
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)  # كلمة المرور مشفرة
    full_name = Column(String)
    is_active = Column(Boolean, default=True)  # هل الحساب مفعل؟
    is_mentor = Column(Boolean, default=False)  # هل هو مرشد؟
    is_admin = Column(Boolean, default=False)  # هل هو مشرف؟
    subscription_type = Column(String, default="free")  # free أو pro
    created_at = Column(DateTime(timezone=True), server_default=func.now())  # تاريخ التسجيل
