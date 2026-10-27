
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BsSearch,
  BsBell,
  BsAwardFill,
  BsGraphUpArrow,
  BsChatDotsFill,
} from "react-icons/bs";
import { learningPaths } from "../data/coursePlaylists";
import { getLastVisitedPath } from "../utils/progress";

// بيانات وهمية مبدئية — لاحقًا ممكن تجيبيها من backend أو تخزنيها بـ localStorage
const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: "achievements",
    icon: <BsAwardFill />,
    iconBg: "#DBEAFE",
    iconColor: "#2563EB",
    title: "Certificate Earned!",
    description:
      "Congratulations! You have completed the Front-End Development course. Your certificate is ready to download.",
    time: "2 mins ago",
    unread: true,
    actionLabel: "Download Certificate",
    actionVariant: "success",
    onAction: () => {}, // تقدرين تربطيها لاحقًا بتحميل الشهادة الفعلي
  },
  {
    id: 2,
    type: "learning",
    icon: <BsGraphUpArrow />,
    iconBg: "#D1FAE5",
    iconColor: "#059669",
    title: "Halfway There! 50% Completed",
    description: "Great job! You've reached 50% of your Front-End Development learning path.",
    time: "5 mins ago",
    unread: true,
    actionLabel: "View Progress",
    actionVariant: "outline-secondary",
    navigateTo: "/my-progress",
  },
  {
    id: 3,
    type: "system",
    icon: <BsChatDotsFill />,
    iconBg: "#F1F5F9",
    iconColor: "#475569",
    title: "New Message from Mentor",
    description: "Your mentor Ahmed Khalid left you a new message regarding your project.",
    time: "10 mins ago",
    unread: true,
    actionLabel: "Read Message",
    actionVariant: "outline-secondary",
  },
];

const TABS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "learning", label: "Learning" },
  { key: "achievements", label: "Achievements" },
  { key: "system", label: "System" },
];

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filtered = notifications.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return n.unread;
    return n.type === activeTab;
  });

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleAction = (notif) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n))
    );
    if (notif.navigateTo) {
      navigate(notif.navigateTo);
    } else if (notif.onAction) {
      notif.onAction();
    }
  };

  return (
    <div className="bg-light min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-light bg-white py-3 shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold d-flex align-items-center gap-2" href="/">
            <span
              className="d-inline-flex align-items-center justify-content-center rounded-circle"
              style={{ width: 28, height: 28, backgroundColor: "#22D3C5", color: "#fff" }}
            >
              ●
            </span>
            Platform
          </a>

          <div className="d-none d-lg-flex mx-auto gap-4">
            <span role="button" className="text-dark text-decoration-none" onClick={() => navigate("/")}>
              Home
            </span>
                    <span
            role="button"
            className="text-dark text-decoration-none"
            onClick={() => {
                const target = getLastVisitedPath() || Object.keys(learningPaths)[0];
                navigate(`/learning/${target}`);
            }}
            >
            Videos
            </span>
            <span role="button" className="text-dark text-decoration-none" onClick={() => navigate("/my-progress")}>
              My Progress
            </span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <BsSearch className="text-dark" role="button" />
            <div className="position-relative">
              <BsBell className="text-dark" role="button" />
              {unreadCount > 0 && (
                <span
                  className="position-absolute badge rounded-pill bg-info text-white"
                  style={{ top: -8, right: -8, fontSize: 10 }}
                >
                  {unreadCount}
                </span>
              )}
            </div>
            <div role="button"
                    className="rounded-circle bg-secondary"
                    style={{ width: 32, height: 32 }}
                    onClick={() => navigate("/profile")} />
          </div>
        </div>
      </nav>

      <div className="container py-4" style={{ maxWidth: 950 }}>
        <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
          <div>
            <h3 className="fw-bold mb-1">Notifications</h3>
            <p className="text-muted mb-0">
              Stay updated with your learning progress, activities, and important updates.
            </p>
          </div>
          <button className="btn btn-outline-secondary rounded-pill btn-sm" onClick={markAllAsRead}>
            Mark all as read
          </button>
        </div>

        <p className="text-muted small mb-3">
          {notifications.length} Notifications &nbsp;•&nbsp;{" "}
          <span style={{ color: "#22D3C5" }}>{unreadCount} Unread</span>
        </p>

        {/* التبويبات */}
        <div className="d-flex gap-2 flex-wrap mb-4">
          {TABS.map((t) => (
            <button
              key={t.key}
              className="btn rounded-pill px-3 py-1"
              style={{
                backgroundColor: activeTab === t.key ? "#0D9488" : "#fff",
                color: activeTab === t.key ? "#fff" : "#212529",
                border: "1px solid #dee2e6",
              }}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* قائمة الإشعارات */}
        <div className="d-flex flex-column gap-3">
          {filtered.map((n) => (
            <div
              key={n.id}
              className="bg-white rounded-4 shadow-sm p-3 d-flex align-items-start gap-3"
              style={{ border: n.unread ? "1px solid #22D3C544" : "1px solid transparent" }}
            >
              <div
                className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: 42, height: 42, backgroundColor: n.iconBg, color: n.iconColor, fontSize: 18 }}
              >
                {n.icon}
              </div>

              <div className="flex-grow-1">
                <div className="fw-bold mb-1">{n.title}</div>
                <p className="text-muted small mb-0">{n.description}</p>
              </div>

              <div className="text-end flex-shrink-0" style={{ minWidth: 150 }}>
                <div className="d-flex align-items-center justify-content-end gap-2 text-muted small mb-2">
                  {n.time}
                  {n.unread && (
                    <span
                      className="rounded-circle"
                      style={{ width: 6, height: 6, backgroundColor: "#22D3C5", display: "inline-block" }}
                    />
                  )}
                </div>
                <button
                  className={`btn btn-sm rounded-pill px-3 ${
                    n.actionVariant === "success" ? "text-white" : "btn-outline-secondary"
                  }`}
                  style={n.actionVariant === "success" ? { backgroundColor: "#0D9488" } : {}}
                  onClick={() => handleAction(n)}
                >
                  {n.actionLabel}
                </button>
              </div>
            </div>
          ))}

          {!filtered.length && (
            <div className="text-center text-muted py-5">لا يوجد إشعارات بهذا التصنيف.</div>
          )}
        </div>
      </div>
    </div>
  );
}