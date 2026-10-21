import React, { useEffect, useState } from "react";
import {
  BsBell,
  BsCheckCircle,
  BsPersonPlus,
  BsFileEarmarkCheck,
  BsChatDotsFill,
} from "react-icons/bs";
import { getCurrentUser, getMentorNotifications, getMentorReadIds, markMentorRead } from "../api";
import { timeAgo } from "../utils/notifications";

const STYLE = {
  message: { icon: <BsChatDotsFill />, bg: "#e8f0ff", color: "#4c6ef5" },
  joined: { icon: <BsPersonPlus />, bg: "#e4f7f5", color: "#0d9488" },
  course_completed: { icon: <BsFileEarmarkCheck />, bg: "#e8f0ff", color: "#4c6ef5" },
  quiz_full: { icon: <BsCheckCircle />, bg: "#eee8ff", color: "#7c4dff" },
};

function Notifications2() {
  const me = getCurrentUser().email;
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = () => {
      const read = getMentorReadIds(me);
      setItems(getMentorNotifications(me).map((n) => ({ ...n, unread: !read.includes(n.id) })));
    };
    load();
    const t = setInterval(load, 5000); // يتحدث تلقائيًا كل 5 ثواني
    return () => clearInterval(t);
  }, [me]);

  const unreadCount = items.filter((n) => n.unread).length;

  const markAll = () => {
    markMentorRead(me, items.map((n) => n.id));
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markOne = (id) => {
    markMentorRead(me, [id]);
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-light bg-white py-3 shadow-sm">
        <div className="container-fluid px-4">
          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: 28, height: 28, backgroundColor: "#22D3C5", color: "#fff" }}
            >
              ●
            </div>
            <span className="fw-bold">SkillBridgeAI</span>
          </div>
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 34, height: 34, backgroundColor: "#f1f3f5" }}
          >
            <BsBell />
          </div>
        </div>
      </nav>

      <div className="container py-5">
        <div className="mx-auto bg-white rounded-4 shadow-sm" style={{ maxWidth: 600, overflow: "hidden" }}>
          <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
            <div>
              <h4 className="mb-1 fw-semibold">Notifications</h4>
              <small className="text-muted">{unreadCount} unread</small>
            </div>
            <button
              type="button"
              className="btn text-white rounded-3 px-3 py-2"
              style={{ backgroundColor: "#0D9488", fontSize: 13 }}
              onClick={markAll}
            >
              ✓ Mark all as read
            </button>
          </div>

          <div>
            {items.map((n) => {
              const s = STYLE[n.type];
              return (
                <div
                  key={n.id}
                  className="d-flex align-items-center gap-3 px-4 py-3 border-bottom"
                  style={{ cursor: "pointer" }}
                  onClick={() => markOne(n.id)}
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: 36, height: 36, backgroundColor: s.bg, color: s.color }}
                  >
                    {s.icon}
                  </div>

                  <div className="flex-grow-1">
                    <div className="fw-medium" style={{ fontSize: 14, lineHeight: 1.4 }}>
                      {n.title}
                    </div>
                    <div className="text-muted mt-1" style={{ fontSize: 12 }}>
                      {timeAgo(n.createdAt)}
                    </div>
                  </div>

                  {n.unread && (
                    <span
                      className="rounded-circle"
                      style={{ width: 7, height: 7, backgroundColor: "#087f7b" }}
                    />
                  )}
                </div>
              );
            })}

            {items.length === 0 && (
              <div className="text-center text-muted py-5">لا توجد إشعارات حتى الآن.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications2;