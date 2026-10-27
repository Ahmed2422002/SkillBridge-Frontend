
import React, { useState } from "react";
import {
  BsBell,
  BsCheckCircle,
  BsPersonPlus,
  BsFileEarmarkCheck,
  BsClock,
} from "react-icons/bs";

const notifications = [
  {
    id: 1,
    type: "assessment",
    title: "Sarah Al-Amin completed React Basics Assessment",
    time: "10 minutes ago",
    icon: <BsCheckCircle />,
  },
  {
    id: 2,
    type: "quiz",
    title: "Nour Saleh scored 100% on Python Fundamentals Quiz",
    time: "1 hour ago",
    icon: <BsCheckCircle />,
  },
  {
    id: 3,
    type: "student",
    title: "A new student, Rana Odeh, joined Data Analysis with Python",
    time: "3 hours ago",
    icon: <BsPersonPlus />,
  },
  {
    id: 4,
    type: "student",
    title: "A new student, Rana Odeh, joined Data Analysis with Python",
    time: "3 hours ago",
    icon: <BsPersonPlus />,
  },
  {
    id: 5,
    type: "published",
    title: '"Cleaning Data with Pandas" was successfully published',
    time: "1 day ago",
    icon: <BsFileEarmarkCheck />,
  },
  {
    id: 6,
    type: "deadline",
    title: '"State Management Quiz" deadline is approaching in 2 days',
    time: "1 day ago",
    icon: <BsClock />,
  },
  {
    id: 7,
    type: "quiz",
    title: "Ahmad Fares completed JavaScript Essentials Quiz",
    time: "2 days ago",
    icon: <BsCheckCircle />,
  },
];

function Notifications2() {
  const [allRead, setAllRead] = useState(false);

  return (
    <div className="min-vh-100 bg-light">

      {/* Navbar */}
      <nav className="navbar navbar-light bg-white py-3 shadow-sm">
        <div className="container-fluid px-4">

          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: 28,
                height: 28,
                backgroundColor: "#22D3C5",
                color: "#fff",
              }}
            >
              ●
            </div>

            <span className="fw-bold">SkillBridgeAI</span>
          </div>

          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: 34,
              height: 34,
              backgroundColor: "#f1f3f5",
            }}
          >
            <BsBell />
          </div>

        </div>
      </nav>

      {/* Notifications Container */}
      <div className="container py-5">

        <div
          className="mx-auto bg-white rounded-4 shadow-sm"
          style={{
            maxWidth: 600,
            overflow: "hidden",
          }}
        >

          {/* Header */}
          <div className="d-flex justify-content-between align-items-center p-4 border-bottom">

            <div>
              <h4 className="mb-1 fw-semibold">
                Notifications
              </h4>

                    <small className="text-muted">
                        {allRead ? "0 unread" : "3 unread"}
                        </small>
            </div>

                    <button
            type="button"
            className="btn text-white rounded-3 px-3 py-2"
            style={{
                backgroundColor: "#0D9488",
                fontSize: 13,
            }}
            onClick={() => setAllRead(true)}
            >
            ✓ Mark all as read
            </button>

          </div>

          {/* Notifications List */}
          <div>

            {notifications.map((notification) => (

              <div
                key={notification.id}
                className="d-flex align-items-center gap-3 px-4 py-3 border-bottom"
                style={{
                  position: "relative",
                  cursor: "pointer",
                }}
              >

                {/* Icon */}
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: 36,
                    height: 36,
                    backgroundColor:
                      notification.type === "quiz"
                        ? "#eee8ff"
                        : notification.type === "student"
                        ? "#e4f7f5"
                        : notification.type === "deadline"
                        ? "#fff1e6"
                        : "#e8f0ff",
                    color:
                      notification.type === "quiz"
                        ? "#7c4dff"
                        : notification.type === "student"
                        ? "#0d9488"
                        : notification.type === "deadline"
                        ? "#e67e22"
                        : "#4c6ef5",
                  }}
                >
                  {notification.icon}
                </div>

                {/* Text */}
                <div className="flex-grow-1">

                  <div
                    className="fw-medium"
                    style={{
                      fontSize: 14,
                      lineHeight: 1.4,
                    }}
                  >
                    {notification.title}
                  </div>

                  <div
                    className="text-muted mt-1"
                    style={{ fontSize: 12 }}
                  >
                    {notification.time}
                  </div>

                </div>

                {/* Unread Dot */}
               {!allRead && notification.id <= 3 && (
                    <span
                        className="rounded-circle"
                        style={{
                        width: 7,
                        height: 7,
                        backgroundColor: "#087f7b",
                        }}
                    />
                    )}

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Notifications2;