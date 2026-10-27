from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# ============================================
# إحصائيات المنصة
# ============================================
class AdminStats(BaseModel):
    total_users: int
    total_mentors: int
    total_students: int
    total_roadmaps: int
    total_bookings: int
    completed_roadmaps: int
    total_revenue: float  # إجمالي الإيرادات (للمرشدين)
    pending_bookings: int

# ============================================
# إدارة المستخدمين
# ============================================
class UserUpdateByAdmin(BaseModel):
    role: Optional[str] = None  # student, mentor, admin
    is_active: Optional[bool] = None
    subscription_type: Optional[str] = None  # free, pro

class UserResponseByAdmin(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str]
    is_active: bool
    is_mentor: bool
    is_admin: bool
    subscription_type: str
    created_at: str
    
    class Config:
        from_attributes = True

# ============================================
# إدارة المحتوى (من Admin)
# ============================================
class ContentCreateByAdmin(BaseModel):
    roadmap_id: int
    stage_number: int
    title: str
    description: Optional[str] = None
    content_type: str  # video, article, link, pdf
    content_url: Optional[str] = None
    is_required: bool = True
    order: int = 0

class ContentUpdateByAdmin(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    content_url: Optional[str] = None
    is_required: Optional[bool] = None
    order: Optional[int] = None
