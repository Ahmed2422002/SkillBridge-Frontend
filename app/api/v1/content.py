from fastapi import APIRouter, HTTPException, Depends, Header
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.user import User
from app.models.roadmap import Roadmap
from app.models.content import Content
from app.models.user_content_progress import UserContentProgress
from app.schemas.content import ContentCreate, ContentUpdate, ContentResponse, ContentProgressUpdate
from app.core.security import decode_access_token

router = APIRouter(prefix="/content", tags=["Content"])

# دالة مساعدة للحصول على المستخدم
def get_current_user(token: str, db: Session):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.username == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# ============================================
# 1. إضافة محتوى جديد (للمشرف/المرشد)
# ============================================
@router.post("/", response_model=ContentResponse)
def create_content(
    content: ContentCreate,
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    # التأكد من أن الخطة موجودة
    roadmap = db.query(Roadmap).filter(Roadmap.id == content.roadmap_id).first()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    
    # التأكد من أن المستخدم هو صاحب الخطة أو مشرف
    if roadmap.user_id != user.id and not user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    
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
# 2. عرض محتوى خطة معينة
# ============================================
@router.get("/roadmap/{roadmap_id}", response_model=List[ContentResponse])
def get_roadmap_content(
    roadmap_id: int,
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    # التأكد من أن الخطة موجودة وللمستخدم
    roadmap = db.query(Roadmap).filter(
        Roadmap.id == roadmap_id,
        Roadmap.user_id == user.id
    ).first()
    
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    
    # جلب المحتوى
    contents = db.query(Content).filter(Content.roadmap_id == roadmap_id).order_by(Content.stage_number, Content.order).all()
    
    # إضافة حالة الإكمال لكل محتوى
    for content in contents:
        progress = db.query(UserContentProgress).filter(
            UserContentProgress.user_id == user.id,
            UserContentProgress.content_id == content.id
        ).first()
        content.is_completed = progress.is_completed if progress else False
    
    return contents

# ============================================
# 3. تحديث محتوى
# ============================================
@router.put("/{content_id}", response_model=ContentResponse)
def update_content(
    content_id: int,
    content_update: ContentUpdate,
    token: str = Header(...),
db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    content = db.query(Content).filter(Content.id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    
    # التأكد من الصلاحية
    roadmap = db.query(Roadmap).filter(Roadmap.id == content.roadmap_id).first()
    if roadmap.user_id != user.id and not user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if content_update.title is not None:
        content.title = content_update.title
    if content_update.description is not None:
        content.description = content_update.description
    if content_update.content_url is not None:
        content.content_url = content_update.content_url
    if content_update.is_required is not None:
        content.is_required = content_update.is_required
    if content_update.order is not None:
        content.order = content_update.order
    
    db.commit()
    db.refresh(content)
    
    return content

# ============================================
# 4. تحديث تقدم المحتوى (إكمال/عدم إكمال)
# ============================================
@router.put("/progress")
def update_content_progress(
    progress_update: ContentProgressUpdate,
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    # التحقق من وجود المحتوى
    content = db.query(Content).filter(Content.id == progress_update.content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    
    # البحث عن تقدم المستخدم لهذا المحتوى
    user_progress = db.query(UserContentProgress).filter(
        UserContentProgress.user_id == user.id,
        UserContentProgress.content_id == progress_update.content_id
    ).first()
    
    if not user_progress:
        # إنشاء سجل جديد
        user_progress = UserContentProgress(
            user_id=user.id,
            content_id=progress_update.content_id,
            is_completed=progress_update.is_completed,
            completed_at=func.now() if progress_update.is_completed else None
        )
        db.add(user_progress)
    else:
        # تحديث السجل
        user_progress.is_completed = progress_update.is_completed
        user_progress.completed_at = func.now() if progress_update.is_completed else None
    
    db.commit()
    
    # حساب التقدم الكلي للخطة
    roadmap_contents = db.query(Content).filter(Content.roadmap_id == content.roadmap_id).all()
    total_contents = len(roadmap_contents)
    
    completed_contents = db.query(UserContentProgress).filter(
        UserContentProgress.user_id == user.id,
        UserContentProgress.is_completed == True,
        UserContentProgress.content_id.in_([c.id for c in roadmap_contents])
    ).count()
    
    progress_percentage = int((completed_contents / total_contents) * 100) if total_contents > 0 else 0
    
    # تحديث التقدم في جدول Roadmap
    roadmap = db.query(Roadmap).filter(Roadmap.id == content.roadmap_id).first()
    roadmap.progress = progress_percentage
    if progress_percentage >= 100:
        roadmap.is_completed = 1
    
    db.commit()
    
    return {
        "message": "Progress updated",
        "content_id": progress_update.content_id,
        "is_completed": progress_update.is_completed,
        "overall_progress": progress_percentage,
        "completed_contents": completed_contents,
        "total_contents": total_contents
    }

# ============================================
# 5. حذف محتوى
# ============================================
@router.delete("/{content_id}")
def delete_content(
    content_id: int,
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    content = db.query(Content).filter(Content.id == content_id).first()
if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    
    # التأكد من الصلاحية
    roadmap = db.query(Roadmap).filter(Roadmap.id == content.roadmap_id).first()
    if roadmap.user_id != user.id and not user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # حذف تقدم المستخدم المرتبط
    db.query(UserContentProgress).filter(UserContentProgress.content_id == content_id).delete()
    
    db.delete(content)
    db.commit()
    
    return {"message": "Content deleted successfully"}