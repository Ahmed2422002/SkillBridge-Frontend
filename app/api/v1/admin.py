from fastapi import APIRouter, HTTPException, Depends, Header, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.core.database import get_db
from app.models.user import User
from app.models.mentor import Mentor
from app.models.roadmap import Roadmap
from app.models.booking import Booking, BookingStatus
from app.models.content import Content
from app.models.quiz import Quiz, Question
from app.schemas.admin import (
    AdminStats,
    UserUpdateByAdmin,
    UserResponseByAdmin,
    ContentCreateByAdmin,
    ContentUpdateByAdmin
)
from app.core.security import decode_access_token

router = APIRouter(prefix="/admin", tags=["Admin"])

# ============================================
# دالة مساعدة للتحقق من صلاحية المشرف
# ============================================
def get_current_admin(token: str, db: Session):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.username == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    return user
# ============================================
# 1. إحصائيات المنصة
# ============================================
@router.get("/stats", response_model=AdminStats)
def get_admin_stats(
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    admin = get_current_admin(token, db)
    
    # عدد المستخدمين
    total_users = db.query(User).count()
    total_mentors = db.query(User).filter(User.is_mentor == True).count()
    total_students = total_users - total_mentors
    
    # عدد الخطط
    total_roadmaps = db.query(Roadmap).count()
    completed_roadmaps = db.query(Roadmap).filter(Roadmap.is_completed == 1).count()
    
    # عدد الحجوزات
    total_bookings = db.query(Booking).count()
    pending_bookings = db.query(Booking).filter(Booking.status == BookingStatus.PENDING).count()
    
    # حساب الإيرادات (مجموع أسعار الحجوزات المكتملة)
    # ملاحظة: هذه إيرادات وهمية لأننا لم نربط الدفع بعد
    total_revenue = 0.0
    
    return AdminStats(
        total_users=total_users,
        total_mentors=total_mentors,
        total_students=total_students,
        total_roadmaps=total_roadmaps,
        total_bookings=total_bookings,
        completed_roadmaps=completed_roadmaps,
        total_revenue=total_revenue,
        pending_bookings=pending_bookings
    )

# ============================================
# 2. عرض جميع المستخدمين (للمشرف)
# ============================================
@router.get("/users", response_model=List[UserResponseByAdmin])
def get_all_users(
    search: Optional[str] = Query(None, description="بحث بالاسم أو البريد"),
    role: Optional[str] = Query(None, description="فلتر حسب الدور: student, mentor, admin"),
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    admin = get_current_admin(token, db)
    
    query = db.query(User)
    
    # بحث
    if search:
        query = query.filter(
            (User.username.ilike(f"%{search}%")) |
            (User.email.ilike(f"%{search}%")) |
            (User.full_name.ilike(f"%{search}%"))
        )
    
    # فلتر حسب الدور
    if role == "student":
        query = query.filter(User.is_mentor == False, User.is_admin == False)
    elif role == "mentor":
        query = query.filter(User.is_mentor == True)
    elif role == "admin":
        query = query.filter(User.is_admin == True)
    
    return query.all()

# ============================================
# 3. عرض مستخدم معين
# ============================================
@router.get("/users/{user_id}", response_model=UserResponseByAdmin)
def get_user_by_admin(
    user_id: int,
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    admin = get_current_admin(token, db)
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

# ============================================
# 4. تحديث مستخدم (تغيير الدور، التفعيل، إلخ)
# ============================================
@router.put("/users/{user_id}", response_model=UserResponseByAdmin)
def update_user_by_admin(
    user_id: int,
    user_update: UserUpdateByAdmin,
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    admin = get_current_admin(token, db)
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # لا يمكن تغيير صلاحيات المشرف نفسه
    if user.id == admin.id:
        raise HTTPException(status_code=403, detail="Cannot modify your own account")
    
    # تحديث الحقول
    if user_update.role is not None:
        if user_update.role == "admin":
            user.is_admin = True
            user.is_mentor = False
        elif user_update.role == "mentor":
            user.is_admin = False
user.is_mentor = True
        elif user_update.role == "student":
            user.is_admin = False
            user.is_mentor = False
        else:
            raise HTTPException(status_code=400, detail="Invalid role")
    
    if user_update.is_active is not None:
        user.is_active = user_update.is_active
    
    if user_update.subscription_type is not None:
        user.subscription_type = user_update.subscription_type
    
    db.commit()
    db.refresh(user)
    
    return user

# ============================================
# 5. حذف مستخدم
# ============================================
@router.delete("/users/{user_id}")
def delete_user_by_admin(
    user_id: int,
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    admin = get_current_admin(token, db)
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # لا يمكن حذف المشرف نفسه
    if user.id == admin.id:
        raise HTTPException(status_code=403, detail="Cannot delete your own account")
    
    db.delete(user)
    db.commit()
    
    return {"message": "User deleted successfully"}

# ============================================
# 6. عرض جميع الخطط (للمشرف)
# ============================================
@router.get("/roadmaps")
def get_all_roadmaps(
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    admin = get_current_admin(token, db)
    
    roadmaps = db.query(Roadmap).all()
    return roadmaps

# ============================================
# 7. حذف خطة (للمشرف)
# ============================================
@router.delete("/roadmaps/{roadmap_id}")
def delete_roadmap_by_admin(
    roadmap_id: int,
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    admin = get_current_admin(token, db)
    
    roadmap = db.query(Roadmap).filter(Roadmap.id == roadmap_id).first()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    
    # حذف المحتوى المرتبط أولاً
    db.query(Content).filter(Content.roadmap_id == roadmap_id).delete()
    
    db.delete(roadmap)
    db.commit()
    
    return {"message": "Roadmap deleted successfully"}

# ============================================
# 8. إضافة محتوى (للمشرف)
# ============================================
@router.post("/content")
def create_content_by_admin(
    content: ContentCreateByAdmin,
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    admin = get_current_admin(token, db)
    
    # التأكد من وجود الخطة
    roadmap = db.query(Roadmap).filter(Roadmap.id == content.roadmap_id).first()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    
    new_content = Content(
        roadmap_id=content.roadmap_id,
        stage_number=content.stage_number,
        title=content.title,
        description=content.description,
        content_type=content.content_type,
        content_url=content.content_url,
        is_required=content.is_required,
        order=content.order
    )
    
    db.add(new_content)
    db.commit()
    db.refresh(new_content)
    
    return new_content

# ============================================
# 9. عرض جميع الحجوزات (للمشرف)
# ============================================
@router.get("/bookings")
def get_all_bookings(
    status: Optional[str] = Query(None, description="pending, confirmed, completed, cancelled"),
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    admin = get_current_admin(token, db)
    
    query = db.query(Booking)
    
    if status:
        try:
            query = query.filter(Booking.status == BookingStatus[status.upper()])
        except KeyError:
            raise HTTPException(status_code=400, detail="Invalid status")
    
    return query.all()