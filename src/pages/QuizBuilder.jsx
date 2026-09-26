import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BsBell,
  BsChevronUp,
  BsChevronDown,
  BsTrash,
  BsPlusLg,
  BsEye,
  BsFileEarmarkText,
  BsSend,
} from "react-icons/bs";

const MENTOR = { initials: "LH" };

let nextQuestionId = 2;
let nextAnswerId = 3;

function createQuestion() {
  return {
    id: nextQuestionId++,
    type: "Multiple Choice",
    points: 2,
    correctAnswerId: 1,
    answers: [
      { id: 1, text: "" },
      { id: 2, text: "" },
    ],
  };
}

export default function QuizBuilder() {
  const navigate = useNavigate();

  const [quizName, setQuizName] = useState("");
  const [description, setDescription] = useState("");
  const [learningPath, setLearningPath] = useState("");
  const [module, setModule] = useState("");
  const [questions, setQuestions] = useState([
    {
      id: 1,
      type: "Multiple Choice",
      points: 2,
      correctAnswerId: 1,
      answers: [
        { id: 1, text: "" },
        { id: 2, text: "" },
      ],
    },
  ]);

  const totalPoints = questions.reduce((sum, q) => sum + Number(q.points || 0), 0);

  const updateQuestion = (qId, patch) => {
    setQuestions((prev) => prev.map((q) => (q.id === qId ? { ...q, ...patch } : q)));
  };

  const updateAnswerText = (qId, aId, text) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? { ...q, answers: q.answers.map((a) => (a.id === aId ? { ...a, text } : a)) }
          : q
      )
    );
  };

  const addAnswer = (qId) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? { ...q, answers: [...q.answers, { id: nextAnswerId++, text: "" }] }
          : q
      )
    );
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, createQuestion()]);
  };

  const removeQuestion = (qId) => {
    setQuestions((prev) => prev.filter((q) => q.id !== qId));
  };

  const moveQuestion = (index, direction) => {
    setQuestions((prev) => {
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      const copy = [...prev];
      [copy[index], copy[newIndex]] = [copy[newIndex], copy[index]];
      return copy;
    });
  };

  const handleSaveDraft = () => {
    console.log("Draft saved:", { quizName, description, learningPath, module, questions });
  };

  const handlePublish = () => {
    console.log("Quiz published:", { quizName, description, learningPath, module, questions });
    navigate("/mentor-dashboard");
  };

  return (
    <div className="bg-light min-vh-100">
      {/* Top bar */}
      <nav className="navbar navbar-light bg-white py-3 shadow-sm">
        <div className="container-fluid px-4 d-flex align-items-center justify-content-between">
          <span className="fw-bold">SkillBridgeAI</span>
          <div className="d-flex align-items-center gap-3">
                          <div
                  className="position-relative"
                  role="button"
                  onClick={() => navigate("/mentor-dashboard/notifications")}
                  style={{ cursor: "pointer" }}
                >
                  <BsBell className="text-dark" size={18} />

                  <span
                    className="position-absolute rounded-circle bg-danger"
                    style={{
                      width: 8,
                      height: 8,
                      top: -2,
                      right: -2,
                    }}
                  />
                </div>
           <div
            className="rounded-circle d-flex align-items-center justify-content-center fw-semibold text-white"
            style={{ width: 34, height: 34, backgroundColor: "#0D9488", fontSize: 13, cursor: "pointer" }}
            role="button"
            aria-label="Open profile"
            onClick={() => navigate("/mentor-dashboard/profile")}
          >
            {MENTOR.initials}
          </div>
          </div>
        </div>
      </nav>

      <div className="container-fluid px-4 py-4" style={{ maxWidth: 900 }}>
        <span
          role="button"
          className="text-muted small d-inline-flex align-items-center gap-1 mb-3"
          onClick={() => navigate(-1)}
        >
          ← Back to quizzes
        </span>

        {/* Quiz Details card */}
        <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Quiz Details</h5>
            <span className="text-muted small fw-semibold">Quiz Builder</span>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Quiz name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Quiz name"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Description</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="What does this quiz assess?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="row g-3 mb-2">
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">Learning path</label>
              <select
                className="form-select"
                value={learningPath}
                onChange={(e) => setLearningPath(e.target.value)}
              >
                <option value="">Select</option>
                <option value="15">15</option>
              </select>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">Module / Lesson</label>
              <select
                className="form-select"
                value={module}
                onChange={(e) => setModule(e.target.value)}
              >
                <option value="">Select</option>
                <option value="HTML">HTML</option>
              </select>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-bold mb-0">Questions ({questions.length})</h6>
          <span className="text-muted small">{totalPoints} pts total</span>
        </div>

        {questions.map((q, index) => (
          <div key={q.id} className="bg-white rounded-4 shadow-sm p-3 mb-3">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span
                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: 24, height: 24, backgroundColor: "#D6F5F2", color: "#0D9488", fontSize: 12, fontWeight: 600 }}
              >
                {index + 1}
              </span>

              <select
                className="form-select form-select-sm"
                style={{ maxWidth: 180 }}
                value={q.type}
                onChange={(e) => updateQuestion(q.id, { type: e.target.value })}
              >
                <option>Multiple Choice</option>
                <option>True / False</option>
                <option>Short Answer</option>
              </select>

              <div className="ms-auto d-flex align-items-center gap-2">
                <BsChevronUp
                  role="button"
                  className={index === 0 ? "text-muted opacity-25" : "text-muted"}
                  onClick={() => moveQuestion(index, -1)}
                />
                <BsChevronDown
                  role="button"
                  className={index === questions.length - 1 ? "text-muted opacity-25" : "text-muted"}
                  onClick={() => moveQuestion(index, 1)}
                />
                <input
                  type="number"
                  className="form-control form-control-sm text-center"
                  style={{ width: 56 }}
                  value={q.points}
                  onChange={(e) => updateQuestion(q.id, { points: e.target.value })}
                />
                <span className="text-muted small">pts</span>
                <BsTrash role="button" className="text-danger" onClick={() => removeQuestion(q.id)} />
              </div>
            </div>

            {q.answers.map((a) => (
              <div key={a.id} className="d-flex align-items-center gap-2 mb-2">
                <input
                  type="radio"
                  name={`correct-${q.id}`}
                  checked={q.correctAnswerId === a.id}
                  onChange={() => updateQuestion(q.id, { correctAnswerId: a.id })}
                  style={{ accentColor: "#0D9488" }}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder={`Answer ${a.id}`}
                  value={a.text}
                  onChange={(e) => updateAnswerText(q.id, a.id, e.target.value)}
                />
              </div>
            ))}

            <button
              className="btn btn-link btn-sm p-0 text-decoration-none fw-semibold"
              style={{ color: "#0D9488" }}
              onClick={() => addAnswer(q.id)}
            >
              + Add answer
            </button>
          </div>
        ))}

        <button
          className="btn text-white rounded-3 d-flex align-items-center gap-2 px-3 py-2 fw-semibold mb-4"
          style={{ backgroundColor: "#0D9488" }}
          onClick={addQuestion}
        >
          <BsPlusLg /> Add question
        </button>

        {/* Footer summary */}
        <div className="bg-white rounded-4 shadow-sm p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <div className="fw-bold mb-1">Untitled quiz</div>
              <div className="text-muted small">Duration</div>
              <div className="text-muted small">Pass score</div>
            </div>
            <div className="text-end">
              <div className="text-muted small">Total points</div>
              <div className="fw-bold">{totalPoints}</div>
            </div>
          </div>

          <div className="d-flex gap-2 mb-3">
            <button className="btn btn-outline-secondary d-flex align-items-center gap-2">
              <BsEye /> Preview quiz
            </button>
            <button
              className="btn btn-outline-secondary d-flex align-items-center gap-2"
              onClick={handleSaveDraft}
            >
              <BsFileEarmarkText /> Save draft
            </button>
          </div>

          <button
            className="btn text-white w-100 d-flex align-items-center justify-content-center gap-2 py-2 fw-semibold"
            style={{ backgroundColor: "#0D9488" }}
            onClick={handlePublish}
          >
            <BsSend /> Publish quiz
          </button>
        </div>
      </div>
    </div>
  );
}