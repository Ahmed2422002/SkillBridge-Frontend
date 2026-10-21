from fastapi import APIRouter, HTTPException, Depends, Header
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.user import User
from app.models.content import Content
from app.models.quiz import Quiz
from app.models.question import Question
from app.models.user_quiz_result import UserQuizResult
from app.schemas.quiz import (
    QuizCreate, QuizUpdate, QuizResponse,
    QuestionCreate, QuestionResponse,
    QuizSubmit, QuizResultResponse
)
from app.core.security import decode_access_token

router = APIRouter(prefix="/quizzes", tags=["Quizzes"])

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
# 1. إنشاء اختبار جديد (للمشرف)
# ============================================
@router.post("/", response_model=QuizResponse)
def create_quiz(
    quiz: QuizCreate,
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    # التحقق من صلاحيات المشرف
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")
    
    # التحقق من وجود المحتوى
    content = db.query(Content).filter(Content.id == quiz.content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    
    new_quiz = Quiz(
        content_id=quiz.content_id,
        title=quiz.title,
        description=quiz.description,
        passing_score=quiz.passing_score,
        duration_minutes=quiz.duration_minutes
    )
    
    db.add(new_quiz)
    db.commit()
    db.refresh(new_quiz)
    
    return new_quiz

# ============================================
# 2. إضافة سؤال للاختبار (للمشرف)
# ============================================
@router.post("/{quiz_id}/questions", response_model=QuestionResponse)
def add_question(
    quiz_id: int,
    question: QuestionCreate,
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")
    
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    new_question = Question(
        quiz_id=quiz_id,
        question_text=question.question_text,
option_a=question.option_a,
        option_b=question.option_b,
        option_c=question.option_c,
        option_d=question.option_d,
        correct_answer=question.correct_answer
    )
    
    db.add(new_question)
    db.commit()
    db.refresh(new_question)
    
    return new_question

# ============================================
# 3. عرض اختبار مرحلة (للمستخدم)
# ============================================
@router.get("/content/{content_id}", response_model=QuizResponse)
def get_quiz_by_content(
    content_id: int,
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    # البحث عن الاختبار المرتبط بالمحتوى
    quiz = db.query(Quiz).filter(Quiz.content_id == content_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found for this content")
    
    return quiz

# ============================================
# 4. عرض أسئلة الاختبار (للمستخدم)
# ============================================
@router.get("/{quiz_id}/questions", response_model=List[QuestionResponse])
def get_quiz_questions(
    quiz_id: int,
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    # التحقق من وجود الاختبار
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    # جلب الأسئلة (بدون الإجابة الصحيحة)
    questions = db.query(Question).filter(Question.quiz_id == quiz_id).all()
    
    return questions

# ============================================
# 5. تقديم الاختبار (Submit Quiz)
# ============================================
@router.post("/submit", response_model=QuizResultResponse)
def submit_quiz(
    submission: QuizSubmit,
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    # التحقق من وجود الاختبار
    quiz = db.query(Quiz).filter(Quiz.id == submission.quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    # جلب جميع الأسئلة مع إجاباتها الصحيحة
    questions = db.query(Question).filter(Question.quiz_id == submission.quiz_id).all()
    
    total_questions = len(questions)
    correct_answers = 0
    
    # تصحيح الإجابات
    for question in questions:
        user_answer = submission.answers.get(str(question.id))
        if user_answer and user_answer == question.correct_answer:
            correct_answers += 1
    
    # حساب النسبة
    score = int((correct_answers / total_questions) * 100)
    passed = score >= quiz.passing_score
    
    # حفظ النتيجة
    result = UserQuizResult(
        user_id=user.id,
        quiz_id=submission.quiz_id,
        score=score,
        passed=passed,
        answers=submission.answers
    )
    
    db.add(result)
    db.commit()
    
    # إذا نجح المستخدم، نفتح له المرحلة التالية
    if passed:
        # يمكن إضافة منطق لفتح المرحلة التالية هنا
        pass
    
    return QuizResultResponse(
        quiz_id=submission.quiz_id,
        score=score,
        passed=passed,
        total_questions=total_questions,
        correct_answers=correct_answers,
        wrong_answers=total_questions - correct_answers
    )

# ============================================
# 6. عرض نتائج المستخدم في اختبار معين
# ============================================
@router.get("/{quiz_id}/results")
def get_quiz_results(
    quiz_id: int,
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    results = db.query(UserQuizResult).filter(
        UserQuizResult.user_id == user.id,
        UserQuizResult.quiz_id == quiz_id
    ).all()
    
    return results
