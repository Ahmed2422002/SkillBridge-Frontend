from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# إنشاء اتصال بقاعدة البيانات
engine = create_engine(
    settings.DATABASE_URL, 
    connect_args={"check_same_thread": False}  # ضروري لـ SQLite
)

# جلسة للتعامل مع قاعدة البيانات
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# الأساس لإنشاء النماذج
Base = declarative_base()

# دالة للحصول على جلسة قاعدة البيانات (تستخدم في كل مسار)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
