import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { learningPaths } from "../data/coursePlaylists";
import { getCurrentUser, getQuizzesByPath, addEvent, issueQuizCertificate } from "../api";
import QuizTaker from "../components/QuizTaker";

export default function QuizPage() {
  const navigate = useNavigate();
  const { pathKey } = useParams();
  const path = learningPaths[pathKey];
  const quizzes = getQuizzesByPath(pathKey);
  const [quiz, setQuiz] = useState(null);
  const [earned, setEarned] = useState(null); // الشهادة اللي انصدرت بهالمحاولة

  const handleFinish = (res) => {
    // أكثر من النصف: شهادة + إشعار عند الطالب
    const cert = issueQuizCertificate({ quiz, score: res.score, total: res.total });
    if (cert) setEarned(cert);

    // علامة كاملة: إشعار للمنتور
    if (res.total > 0 && res.score === res.total) {
      addEvent({
        type: "quiz_full",
        studentEmail: getCurrentUser().email,
        pathKey,
        key: quiz.id,
        label: quiz.categoryLabel ? `${quiz.title} - ${quiz.categoryLabel}` : quiz.title,
        pathLabel: quiz.pathLabel,
      });
    }
  };

  const openQuiz = (q) => {
    setEarned(null);
    setQuiz(q);
  };

  const closeQuiz = () => {
    setEarned(null);
    setQuiz(null);
  };

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container" style={{ maxWidth: 760 }}>
        <span
          role="button"
          className="text-muted small d-inline-block mb-3"
          onClick={() => (quiz ? closeQuiz() : navigate(`/learning/${pathKey}`))}
        >
          ← Back
        </span>

        <h3 className="fw-bold mb-3">{path ? path.title : "Quiz"}</h3>

        {!quiz && (
          <>
            {quizzes.length === 0 && (
              <div className="bg-white rounded-4 shadow-sm p-4 text-center text-muted">
                لا توجد اختبارات لهذا المسار حتى الآن.
              </div>
            )}
            {quizzes.map((q) => (
              <div
                key={q.id}
                className="bg-white rounded-4 shadow-sm p-3 mb-3 d-flex justify-content-between align-items-center"
              >
                <div>
                  <div className="fw-bold">{q.title}</div>
                  <div className="text-muted small">
                    {q.categoryLabel ? `${q.categoryLabel} • ` : ""}
                    {q.questions.length} questions
                  </div>
                </div>
                <button
                  className="btn text-white rounded-pill px-3"
                  style={{ backgroundColor: "#0D9488" }}
                  onClick={() => openQuiz(q)}
                >
                  Start
                </button>
              </div>
            ))}
          </>
        )}

        {quiz && earned && (
          <div
            className="rounded-4 p-3 mb-3 d-flex justify-content-between align-items-center flex-wrap gap-2"
            style={{ backgroundColor: "#D6F5F2" }}
          >
            <div className="fw-semibold">🎉 مبروك! حصلتي على شهادة بهذا الاختبار ({earned.percent}%).</div>
            <button
              className="btn text-white rounded-pill px-3"
              style={{ backgroundColor: "#0D9488" }}
              onClick={() => navigate(`/quiz-certificate/${earned.id}`)}
            >
              View Certificate
            </button>
          </div>
        )}

        {quiz && (
          <QuizTaker
            key={quiz.id}
            quiz={quiz}
            onFinish={handleFinish}
            onExit={closeQuiz}
            exitLabel="All quizzes"
          />
        )}
      </div>
    </div>
  );
}