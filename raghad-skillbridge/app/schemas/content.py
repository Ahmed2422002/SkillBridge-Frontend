from pydantic import BaseModel
from typing import Optional, List

class ContentCreate(BaseModel):
    roadmap_id: int
    stage_number: int
    title: str
    description: Optional[str] = None
    content_type: str  # video, article, link, pdf
    content_url: Optional[str] = None
    is_required: bool = True
    order: int = 0

class ContentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    content_url: Optional[str] = None
    is_required: Optional[bool] = None
    order: Optional[int] = None

class ContentResponse(BaseModel):
    id: int
    roadmap_id: int
    stage_number: int
    title: str
    description: Optional[str]
    content_type: str
    content_url: Optional[str]
    is_required: bool
    order: int
    is_completed: Optional[bool] = False  # هل اكتمل عند المستخدم؟
    created_at: str
    
    class Config:
        from_attributes = True
class ContentProgressUpdate(BaseModel):
    content_id: int
    is_completed: bool