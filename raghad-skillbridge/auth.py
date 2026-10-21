from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.core.security import get_password_hash, verify_password, create_access_token

# إنشاء راوتر للمسارات
router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register")
def register(
    email: str, 
    username: str, 
    password: str, 
    full_name: str = None, 
    db: Session = Depends(get_db)
):
    """تسجيل مستخدم جديد"""
    
    # 1. التحقق من عدم وجود مستخدم بنفس البريد أو اسم المستخدم
    existing_user = db.query(User).filter(
        (User.email == email) | (User.username == username)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=400, 
            detail="Email or username already registered"
        )
    
    # 2. تشفير كلمة المرور
    hashed_password = get_password_hash(password)
    
    # 3. إنشاء المستخدم في قاعدة البيانات
    new_user = User(
        email=email,
        username=username,
        hashed_password=hashed_password,
        full_name=full_name
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)  # لتحديث ID
    
    return {"message": "User created successfully", "user_id": new_user.id}

@router.post("/login")
def login(username: str, password: str, db: Session = Depends(get_db)):
    """تسجيل الدخول"""
    
    # 1. البحث عن المستخدم
    user = db.query(User).filter(User.username == username).first()
    
    # 2. التحقق من كلمة المرور
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # 3. إنشاء توكن
    access_token = create_access_token(
        data={"sub": user.username, "user_id": user.id}
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "user_id": user.id
    }