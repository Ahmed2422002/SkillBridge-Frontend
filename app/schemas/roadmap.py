from pydantic import BaseModel
from typing import Optional, List

class RoadmapCreate(BaseModel):
    title: str
    description: Optional[str] = None
    goal: str
    level: str  # beginner, intermediate, advanced
    steps: List[str]  # قائمة بالخطوات

class RoadmapUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    progress: Optional[int] = None
    is_completed: Optional[int] = None

class RoadmapResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str]
    goal: str
    level: str
    steps: List[str]
    progress: int
    is_completed: int
    created_at: str
    
    class Config:
        from_attributes = True  # لتحويل من SQLAlchemy إلى Pydantic
