import React, { useState } from "react";
import { BsX, BsCheckAll, BsPlusCircle, BsImage, BsFileEarmark, BsSend, BsPersonWorkspace, BsPatchCheckFill } from "react-icons/bs";

export default function ContactModal({ mentor, onClose }) {
  const [showBanner, setShowBanner] = useState(true);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "me",
      text: `Hi ${mentor?.name?.split(" ")[0] || ""}! I really admire your work and would love to learn more about your journey and any advice you have for someone looking to grow in this field.`,
      time: "10:31 AM",
    },
    {
      from: "mentor",
      text: "Hi! Thanks for reaching out 😊 Happy to help. What would you like to know?",
      time: "10:33 AM",
    },
  ]);

  if (!mentor) return null;

  const handleSend = () => {
    if (!text.trim()) return;
    setMessages((prev) => [
      ...prev,
      { from: "me", text: text.trim(), time: "Now" },
    ]);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-4 shadow d-flex flex-column"
        style={{ width: 480, maxWidth: "95%", height: "80vh", maxHeight: 640 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: 44, height: 44, backgroundColor: "#0D1B2A", color: "#fff", flexShrink: 0 }}
            >
              <BsPersonWorkspace />
            </div>
            <div>
              <div className="fw-bold d-flex align-items-center gap-1">
                {mentor.name}
                {mentor.verified && <BsPatchCheckFill style={{ color: "#22D3C5" }} size={14} />}
              </div>
              <div className="text-muted small">{mentor.role}</div>
            </div>
          </div>
          <BsX role="button" size={26} className="text-muted" onClick={onClose} />
        </div>

        {/* Guidelines banner */}
        {showBanner && (
          <div className="d-flex align-items-start justify-content-between gap-2 m-3 p-3 rounded-3" style={{ backgroundColor: "#EAF6FF" }}>
            <div className="small">
              <div className="fw-semibold">Keep it professional and respectful</div>
              <div className="text-muted">
                This conversation is private. Please follow our{" "}
                <span role="button" style={{ color: "#0d6efd", textDecoration: "underline" }}>
                  community guidelines
                </span>.
              </div>
            </div>
            <BsX role="button" className="text-muted flex-shrink-0" onClick={() => setShowBanner(false)} />
          </div>
        )}

        {/* Messages */}
        <div className="flex-grow-1 overflow-auto px-3">
          <div className="text-center text-muted small my-2">Today</div>
          <div className="text-center text-muted small mb-1">10:30 AM</div>
          <div className="text-center text-muted small mb-3">
            You started a conversation with {mentor.name}
          </div>

          {messages.map((msg, i) =>
            msg.from === "me" ? (
              <div key={i} className="d-flex justify-content-end mb-3">
                <div>
                  <div
                    className="p-3 rounded-4"
                    style={{ backgroundColor: "#D6F5F2", maxWidth: 300 }}
                  >
                    {msg.text}
                  </div>
                  <div className="d-flex justify-content-end align-items-center gap-1 text-muted small mt-1">
                    <span>{msg.time}</span>
                    <BsCheckAll style={{ color: "#22D3C5" }} />
                  </div>
                </div>
              </div>
            ) : (
              <div key={i} className="d-flex gap-2 mb-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: 32, height: 32, backgroundColor: "#0D1B2A", color: "#fff" }}
                >
                  <BsPersonWorkspace size={14} />
                </div>
                <div>
                  <div className="p-3 rounded-4 bg-light" style={{ maxWidth: 300 }}>
                    {msg.text}
                  </div>
                  <div className="text-muted small mt-1">{msg.time}</div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Input */}
        <div className="border-top p-3">
          <div className="d-flex align-items-center gap-2 border rounded-pill px-3 py-2">
            <BsPlusCircle role="button" className="text-muted" />
            <BsImage role="button" className="text-muted" />
            <BsFileEarmark role="button" className="text-muted" />
            <input
              type="text"
              className="form-control border-0 shadow-none"
              placeholder="Type your message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="btn rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: 38, height: 38, backgroundColor: "#0D1B2A" }}
              onClick={handleSend}
            >
              <BsSend className="text-white" size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}