from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.user import User
from app.models.roadmap import Roadmap
from app.schemas.roadmap import RoadmapCreate, RoadmapUpdate, RoadmapResponse
from app.core.security import decode_access_token
from fastapi import Header

router = APIRouter(prefix="/roadmaps", tags=["Roadmaps"])

# دالة مساعدة للحصول على المستخدم من التوكن
def get_current_user(token: str = Header(...), db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.username == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

# 1. إنشاء خطة جديدة
@router.post("/", response_model=RoadmapResponse)
def create_roadmap(
    roadmap: RoadmapCreate,
    token: str = Header(...),
db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    new_roadmap = Roadmap(
        user_id=user.id,
        title=roadmap.title,
        description=roadmap.description,
        goal=roadmap.goal,
        level=roadmap.level,
        steps=roadmap.steps,
        progress=0,
        is_completed=0
    )
    
    db.add(new_roadmap)
    db.commit()
    db.refresh(new_roadmap)
    
    return new_roadmap

# 2. عرض جميع خطط المستخدم
@router.get("/", response_model=List[RoadmapResponse])
def get_roadmaps(
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    roadmaps = db.query(Roadmap).filter(Roadmap.user_id == user.id).all()
    return roadmaps

# 3. عرض خطة معينة
@router.get("/{roadmap_id}", response_model=RoadmapResponse)
def get_roadmap(
    roadmap_id: int,
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    roadmap = db.query(Roadmap).filter(
        Roadmap.id == roadmap_id,
        Roadmap.user_id == user.id
    ).first()
    
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    
    return roadmap

# 4. تحديث خطة
@router.put("/{roadmap_id}", response_model=RoadmapResponse)
def update_roadmap(
    roadmap_id: int,
    roadmap_update: RoadmapUpdate,
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    roadmap = db.query(Roadmap).filter(
        Roadmap.id == roadmap_id,
        Roadmap.user_id == user.id
    ).first()
    
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    
    # تحديث الحقول
    if roadmap_update.title is not None:
        roadmap.title = roadmap_update.title
    if roadmap_update.description is not None:
        roadmap.description = roadmap_update.description
    if roadmap_update.progress is not None:
        roadmap.progress = roadmap_update.progress
    if roadmap_update.is_completed is not None:
        roadmap.is_completed = roadmap_update.is_completed
    
    db.commit()
    db.refresh(roadmap)
    
    return roadmap

# 5. حذف خطة
@router.delete("/{roadmap_id}")
def delete_roadmap(
    roadmap_id: int,
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    roadmap = db.query(Roadmap).filter(
        Roadmap.id == roadmap_id,
        Roadmap.user_id == user.id
    ).first()
    
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    
    db.delete(roadmap)
    db.commit()
    
    return {"message": "Roadmap deleted successfully"}