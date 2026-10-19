from fastapi import FastAPI
from app.core.database import Base, engine
from app.api.v1 import auth, roadmaps, survey, content, quizzes, mentors, admin

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SkillBridge AI API",
    description="منصة تعلم ذكية باستخدام الذكاء الاصطناعي",
    version="1.0.0"
)

app.include_router(auth.router)
app.include_router(roadmaps.router)
app.include_router(survey.router)
app.include_router(content.router)
app.include_router(quizzes.router)
app.include_router(mentors.router)
app.include_router(admin.router)  # أضفنا

@app.get("/")
def read_root():
    return {"message": "Welcome to SkillBridge AI Platform!"}

@app.get("/test")
def test():
    return {"message": "Test successful"}
