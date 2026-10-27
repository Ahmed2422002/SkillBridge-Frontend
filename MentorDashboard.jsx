import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BsSearch,
  BsBell,
  BsPlusLg,
  BsPeopleFill,
  BsPlayBtnFill,
  BsQuestionCircleFill,
  BsGraphUp,
  BsBarChartFill,
  BsUpload,
  BsChatDotsFill,
  BsEnvelopeFill,
} from "react-icons/bs";
import MessagesModal from "./MessagesModal";
import NewContactModal from "./NewContactModal";

// بيانات وهمية مبدئية — لاحقًا تجيبيها من backend
const MENTOR = {
  firstName: "Layla",
  initials: "LH",
};

const STATS = {
  studentsCount: 12,
  studentsActiveToday: 2,
  publishedVideos: 6,
  publishedQuizzes: 6,
  progressOverview: 6,
  averageScore: 68,
};

// كل نشاط فيه: اسم الطالب + وصف النشاط + الوقت + نسبة اختيارية (بعض الأنشطة ما إلها نسبة، زي "joined" أو "created a draft")
const RECENT_ACTIVITIES = [
  {
    id: 1,
    initials: "S",
    color: "#0D1B2A",
    text: "Sanoh M-Amm completed Data with Pandas",
    time: "1 day ago",
    score: 82,
  },
  {
    id: 2,
    initials: "S",
    color: "#0D1B2A",
    text: "Sanoh M-Amm completed Data with Python",
    time: "1 hour ago",
    score: 45,
  },
  {
    id: 3,
    initials: "N",
    color: "#7C4DFF",
    text: "Nour Saleh scored 100% on Python Fundamentals Quiz",
    time: "1 hour ago",
    score: null,
  },
  {
    id: 4,
    initials: "S",
    color: "#F5B301",
    text: "Sarah Al-Amin completed React Basics Assessment",
    time: "10 minutes ago",
    score: null,
  },
  {
    id: 5,
    initials: "Y",
    color: "#0D9488",
    text: 'You created a new draft: "State Management Quiz"',
    time: "2 days ago",
    score: null,
  },
  {
    id: 6,
    initials: "R",
    color: "#E63946",
    text: "Rana Odeh joined Data Analysis with Python",
    time: "3 hours ago",
    score: null,
  },
  {
    id: 7,
    initials: "K",
    color: "#22D3C5",
    text: "Khaled Nasser completed Pandas & NumPy Practical",
    time: "23 hours ago",
    score: null,
  },
];

export default function MentorDashboard() {
  const navigate = useNavigate();
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showNewContactModal, setShowNewContactModal] = useState(false);
  const [messagesModal, setMessagesModal] = useState({ show: false, startNew: false, newContacts: [] });

  // فتح نافذة "الرسائل" العادية (قائمة المحادثات الحالية)
  const openMessages = () => {
    setMessagesModal({ show: true, startNew: false, newContacts: [] });
  };

  // زر "تواصل جديد" → يفتح أولًا نافذة اختيار الطلاب
  const openNewContactPicker = () => {
    setShowNewContactModal(true);
  };

  // بعد اختيار الطلاب والضغط على "تأكيد واستمرار" في نافذة الاختيار
  const handleConfirmNewContacts = (selectedStudents) => {
    setShowNewContactModal(false);
    setMessagesModal({ show: true, startNew: true, newContacts: selectedStudents });
  };

  const closeMessagesModal = () => {
    setMessagesModal({ show: false, startNew: false, newContacts: [] });
  };

  return (
    <div className="bg-light min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-light bg-white py-3 shadow-sm">
        <div className="container-fluid px-4 d-flex align-items-center">
          <a className="navbar-brand fw-bold d-flex align-items-center gap-2 me-4" href="/">
            <span
              className="d-inline-flex align-items-center justify-content-center rounded-circle"
              style={{ width: 28, height: 28, backgroundColor: "#22D3C5", color: "#fff" }}
            >
              ●
            </span>
            SkillBridge
            <span className="text-muted fw-normal ms-2 border-start ps-2">EduAI Mentor</span>
          </a>

          <div className="flex-grow-1 mx-auto" style={{ maxWidth: 420 }}>
            <div className="position-relative">
              <BsSearch className="position-absolute top-50 translate-middle-y ms-3 text-muted" />
              <input
                type="text"
                className="form-control rounded-pill ps-5"
                placeholder="Search"
              />
            </div>
          </div>

          <div className="d-flex align-items-center gap-3 ms-3">
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
            style={{
              width: 34,
              height: 34,
              backgroundColor: "#0D9488",
              fontSize: 13,
              cursor: "pointer",
            }}
            role="button"
            onClick={() => navigate("/mentor-dashboard/profile")}
            title="My Profile"
          >
            {MENTOR.initials}
          </div>
          </div>
        </div>
      </nav>

      <div className="container-fluid px-4 py-4" style={{ maxWidth: 1200 }}>
        {/* بانر الترحيب */}
        <div
          className="rounded-4 p-4 mb-4 d-flex justify-content-between align-items-start flex-wrap gap-3 position-relative"
          style={{
            background: "linear-gradient(135deg, #0D3B3E 0%, #14555A 100%)",
            color: "#fff",
          }}
        >
          <div>
            <div className="small text-uppercase" style={{ letterSpacing: 1, opacity: 0.8 }}>
              Welcome Back
            </div>
            <h3 className="fw-bold mb-2">Good to see you, {MENTOR.firstName} 👋</h3>
            <p className="mb-0" style={{ opacity: 0.9, maxWidth: 480 }}>
              You have {STATS.studentsCount} students across 3 learning paths. 3 quiz results came in
              since yesterday.
            </p>
          </div>

          <div className="position-relative">
            <button
              className="btn text-white rounded-3 d-flex align-items-center gap-2 px-3 py-2 fw-semibold"
              style={{ backgroundColor: "#0D9488" }}
              onClick={() => setShowCreateMenu((prev) => !prev)}
            >
              <BsPlusLg /> Create Content
            </button>

            {showCreateMenu && (
              <div
                className="bg-white rounded-3 shadow position-absolute mt-2 py-2"
                style={{ right: 0, minWidth: 200, zIndex: 10 }}
              >
                <button
                  className="btn w-100 text-start d-flex align-items-center gap-2 px-3 py-2 text-dark"
                  onClick={() => {
                    setShowCreateMenu(false);
                    navigate("/mentor-dashboard/upload-video");
                  }}
                >
                  <BsUpload /> Upload Video
                </button>
                <button
                  className="btn w-100 text-start d-flex align-items-center gap-2 px-3 py-2 text-dark"
                  onClick={() => {
                    setShowCreateMenu(false);
                    navigate("/mentor-dashboard/create-quiz");
                  }}
                >
                  <BsQuestionCircleFill /> Create Quiz
                </button>
              </div>
            )}
          </div>
        </div>

        {/* بطاقات الإحصائيات - الصف الأول (3 بطاقات إحصائيات + بطاقة التواصل مع الطلاب) */}
        <div className="row g-3 mb-3">
          <div className="col-12 col-md-6 col-lg-3">
            <StatCard
              label="Students you mentor"
              value={STATS.studentsCount}
              hint={`${STATS.studentsActiveToday} active today`}
              icon={<BsPeopleFill />}
            />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <StatCard
              label="Published videos"
              value={STATS.publishedVideos}
              icon={<BsPlayBtnFill />}
            />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <StatCard
              label="Published quizzes"
              value={STATS.publishedQuizzes}
              icon={<BsQuestionCircleFill />}
            />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <ContactStudentsCard onOpenMessages={openMessages} onNewContact={openNewContactPicker} />
          </div>
        </div>

        {/* بطاقات الإحصائيات - الصف الثاني */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-6">
            <div className="bg-white rounded-4 shadow-sm p-4 h-100 d-flex align-items-center justify-content-between">
              <div>
                <div className="text-muted small mb-1">Student progress overview</div>
                <div className="fs-3 fw-bold">{STATS.progressOverview}</div>
                <div className="text-muted small">
                  <BsGraphUp className="me-1" /> {STATS.studentsActiveToday} active today
                </div>
              </div>
              <CircularProgress value={STATS.progressOverview} max={STATS.studentsCount} />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="bg-white rounded-4 shadow-sm p-4 h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="text-muted small">Average student score</div>
                <BsBarChartFill className="text-muted" />
              </div>
              <div className="fs-3 fw-bold mb-3">{STATS.averageScore}%</div>
              <div className="progress" style={{ height: 6 }}>
                <div
                  className="progress-bar"
                  style={{ width: `${STATS.averageScore}%`, backgroundColor: "#22D3C5" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-4 shadow-sm p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="fw-bold">Recent Activities</span>
            <span
              role="button"
              className="small fw-semibold"
              style={{ color: "#0D9488" }}
              onClick={() => navigate("/mentor-dashboard/activities")}
            >
              View all &gt;
            </span>
          </div>

          {RECENT_ACTIVITIES.map((activity) => (
            <div key={activity.id} className="d-flex align-items-start gap-3 mb-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold flex-shrink-0"
                style={{ width: 34, height: 34, backgroundColor: activity.color, fontSize: 13 }}
              >
                {activity.initials}
              </div>
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between small">
                  <span className="text-dark">{activity.text}</span>
                  {activity.score !== null && (
                    <span className="text-muted ms-2">{activity.score}%</span>
                  )}
                </div>
                <div className="text-muted" style={{ fontSize: 12 }}>
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* نافذة اختيار الطلاب لبدء تواصل جديد */}
      <NewContactModal
        show={showNewContactModal}
        onClose={() => setShowNewContactModal(false)}
        onConfirm={handleConfirmNewContacts}
      />

      {/* نافذة الرسائل المنبثقة */}
      <MessagesModal
        show={messagesModal.show}
        startNew={messagesModal.startNew}
        newContacts={messagesModal.newContacts}
        onClose={closeMessagesModal}
      />
    </div>
  );
}

function StatCard({ label, value, hint, icon }) {
  return (
    <div className="bg-white rounded-4 shadow-sm p-4 h-100 d-flex justify-content-between align-items-start">
      <div>
        <div className="text-muted small mb-1">{label}</div>
        <div className="fs-3 fw-bold">{value}</div>
        {hint && (
          <div className="text-muted small">
            <BsGraphUp className="me-1" /> {hint}
          </div>
        )}
      </div>
      <span
        className="rounded-3 d-flex align-items-center justify-content-center"
        style={{ width: 40, height: 40, backgroundColor: "#D6F5F2", color: "#0D9488" }}
      >
        {icon}
      </span>
    </div>
  );
}

// بطاقة "تواصل مع الطلاب" — زر لفتح الرسائل وزر لبدء تواصل جديد
function ContactStudentsCard({ onOpenMessages, onNewContact }) {
  return (
    <div className="bg-white rounded-4 shadow-sm p-4 h-100 d-flex flex-column justify-content-between">
      <div className="d-flex align-items-center gap-2 mb-3">
        <span
          className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
          style={{ width: 40, height: 40, backgroundColor: "#D6F5F2", color: "#0D9488" }}
        >
          <BsChatDotsFill />
        </span>
        <span className="fw-bold">تواصل مع الطلاب</span>
      </div>

      <div className="d-flex gap-2">
        <button
          type="button"
          className="btn btn-light rounded-3 d-flex align-items-center gap-2 px-3 py-2 flex-grow-1 justify-content-center"
          onClick={onOpenMessages}
        >
          <BsEnvelopeFill size={14} /> رسائل
        </button>
        <button
          type="button"
          className="btn text-white rounded-3 d-flex align-items-center gap-2 px-3 py-2 fw-semibold flex-grow-1 justify-content-center"
          style={{ backgroundColor: "#0D9488" }}
          onClick={onNewContact}
        >
          <BsPlusLg size={14} /> تواصل جديد
        </button>
      </div>
    </div>
  );
}

function CircularProgress({ value, max }) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r={radius} fill="none" stroke="#e9ecef" strokeWidth="8" />
      <circle
        cx="40"
        cy="40"
        r={radius}
        fill="none"
        stroke="#22D3C5"
        strokeWidth="8"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 40 40)"
      />
      <text
        x="40"
        y="46"
        textAnchor="middle"
        fontSize="20"
        fontWeight="bold"
        fill="#212529"
      >
        {value}
      </text>
    </svg>
  );
}