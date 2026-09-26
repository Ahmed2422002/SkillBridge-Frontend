from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
# from app.core.database import get_db  <--- (ضع # هنا، لأنك لم تنشئ هذا الملف بعد!)
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, UserLogin, Token
from app.core.security import get_password_hash, verify_password, create_access_token
from datetime import timedelta

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
# def register(user: UserCreate, db: Session = Depends(get_db)): <--- (ضع # هنا، لتعطيل قاعدة البيانات حالياً)
def register(user: UserCreate): # <--- (عدلها لهذا الشكل، حذفنا الجزء الخاص بقاعدة البيانات)
    
    # --- الخطوات التالية من الكود الأصلي سنقوم بتعطيلها أيضاً ---
    # db_user = db.query(User).filter(User.email == user.email).first()
    # if db_user:
    #    raise HTTPException(status_code=400, detail="Email already registered")
    
    # نعيد فقط رسالة نجاح مؤقتة بدون قاعدة بيانات
    return {"message": "User registered successfully (Database skipped for now)", "user_data": user}
