import React, { useState } from "react";

export default function QuizTaker({ quiz, onFinish, onExit, exitLabel = "Back", preview = false }) {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const allAnswered = Object.keys(answers).length === quiz.questions.length;

  const submit = () => {
    let score = 0;
    let total = 0;
    quiz.questions.forEach((q) => {
      const pts = Number(q.points) || 0;
      total += pts;
      if (answers[q.id] === q.correctAnswerId) score += pts;
    });
    const percent = total > 0 ? Math.round((score / total) * 100) : 0;
    const res = { score, total, percent, passed: percent >= (Number(quiz.passScore) || 0) };
    setResult(res);
    if (onFinish) onFinish(res);
  };

  const retry = () => {
    setAnswers({});
    setResult(null);
  };

  return (
    <div>
      {preview && (
        <div className="alert alert-info py-2 small">
          معاينة: هيك رح يشوف الطالب الاختبار (الإجابات هون ما بتنحفظ).
        </div>
      )}

      <h5 className="fw-bold mb-1">{quiz.title}</h5>
      {quiz.description && <p className="text-muted small">{quiz.description}</p>}

      {/* الدرجة تظهر تلقائيًا بعد التسليم */}
      {result && (
        <div className="bg-white rounded-4 shadow-sm p-4 text-center mb-3">
          <div className="fs-2 fw-bold">
            {result.score} / {result.total}
          </div>
          <div className="text-muted mb-2">{result.percent}%</div>
          {Number(quiz.passScore) > 0 && (
            <span
              className="badge rounded-pill px-3 py-2"
              style={{ backgroundColor: result.passed ? "#D1FAE5" : "#FEE2E2", color: result.passed ? "#059669" : "#DC2626" }}
            >
              {result.passed ? "Passed ✓" : `Failed (pass score ${quiz.passScore}%)`}
            </span>
          )}
          {result.score === result.total && result.total > 0 && (
            <div className="mt-2">ممتاز! علامة كاملة 🎉</div>
          )}
        </div>
      )}

      {quiz.questions.map((q, i) => (
        <div key={q.id} className="bg-white rounded-4 shadow-sm p-3 mb-3">
          <div className="d-flex justify-content-between mb-2">
            <div className="fw-semibold">
              {i + 1}. {q.text}
            </div>
            <span className="text-muted small flex-shrink-0 ms-2">{q.points} pts</span>
          </div>

          {q.answers.map((a) => {
            const isCorrect = a.id === q.correctAnswerId;
            const isChosen = answers[q.id] === a.id;
            let bg = "transparent";
            if (result && isCorrect) bg = "#D1FAE5";
            else if (result && isChosen && !isCorrect) bg = "#FEE2E2";

            return (
              <label
                key={a.id}
                className="d-flex align-items-center gap-2 mb-1 px-2 py-1 rounded-3"
                style={{ backgroundColor: bg, cursor: result ? "default" : "pointer" }}
              >
                <input
                  type="radio"
                  name={`q-${q.id}-${preview ? "p" : "s"}`}
                  checked={isChosen}
                  disabled={!!result}
                  onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: a.id }))}
                  style={{ accentColor: "#0D9488" }}
                />
                <span className="flex-grow-1">{a.text}</span>
                {result && isCorrect && <span style={{ color: "#059669" }}>✓</span>}
                {result && isChosen && !isCorrect && <span style={{ color: "#DC2626" }}>✗</span>}
              </label>
            );
          })}
        </div>
      ))}

      {!result ? (
        <button
          className="btn text-white w-100 rounded-3 py-2 fw-semibold"
          style={{ backgroundColor: "#0D9488", opacity: allAnswered ? 1 : 0.6 }}
          disabled={!allAnswered}
          onClick={submit}
        >
          Submit
        </button>
      ) : (
        <div className="d-flex gap-2 justify-content-center">
          <button className="btn btn-outline-secondary rounded-pill px-4" onClick={retry}>
            Try again
          </button>
          <button
            className="btn text-white rounded-pill px-4"
            style={{ backgroundColor: "#0D9488" }}
            onClick={onExit}
          >
            {exitLabel}
          </button>
        </div>
      )}
    </div>
  );
}