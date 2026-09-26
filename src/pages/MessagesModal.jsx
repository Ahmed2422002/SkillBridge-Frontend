import React, { useEffect, useState } from "react";
import { BsSearch, BsX, BsTrash, BsSend, BsPaperclip } from "react-icons/bs";

const RECENT_ACTIVITIES = [
  { id: 1, initials: "S", color: "#0D1B2A", text: "Sanoh M-Amm completed Data with Pandas", time: "1 day ago" },
  { id: 2, initials: "S", color: "#0D1B2A", text: "Sanoh M-Amm completed Data with Python", time: "1 hour ago" },
  { id: 3, initials: "N", color: "#7C4DFF", text: "Nour Saleh scored 100% on Python Fundamentals Quiz", time: "1 hour ago" },
  { id: 4, initials: "S", color: "#F5B301", text: "Sarah Al-Amin completed React Basics Assessment", time: "10 minutes ago" },
  { id: 5, initials: "Y", color: "#0D9488", text: 'You created a new draft: "State Management Quiz"', time: "2 days ago" },
  { id: 6, initials: "R", color: "#E63946", text: "Rana Odeh joined Data Analysis with Python", time: "3 hours ago" },
  { id: 7, initials: "K", color: "#22D3C5", text: "Khaled Nasser completed Pandas & NumPy Practical", time: "23 hours ago" },
];

const INITIAL_STUDENTS = [
  {
    id: 1,
    name: "Sanoh M-Amm",
    initials: "S",
    color: "#0D1B2A",
    lastMessage: "أهلاً ليلي، أهلاً عندي استفسار...",
    online: true,
    messages: [
      { id: 1, from: "student", text: "أهلاً معلمتي، هل يمكن مراجعة عنوان مراجعة الرسالة؟", time: "1:39 PM" },
      { id: 2, from: "mentor", text: "بالتأكيد سنوه، تفضّلي بأي حاجة عندك بالرسالة.", time: "1:35 PM" },
      { id: 3, from: "student", text: "سؤالي عن الجزء اللي يخص مراجعة الرسالة.", time: "1:35 PM" },
      { id: 4, from: "mentor", text: "بالتأكيد سنوه، هل تقصدين تفاصيل أكثر؟", time: "1:35 PM" },
    ],
  },
  {
    id: 2,
    name: "Nour Saleh",
    initials: "N",
    color: "#7C4DFF",
    lastMessage: "نور صالح عندي استفسار...",
    online: true,
    messages: [{ id: 1, from: "student", text: "أهلاً معلمتي، عندي استفسار عن الكويز.", time: "12:10 PM" }],
  },
  {
    id: 3,
    name: "Sarah Al-Amin",
    initials: "S",
    color: "#F5B301",
    lastMessage: "سارة الأمين على لعدم استكسال...",
    online: false,
    messages: [{ id: 1, from: "student", text: "شكرًا على المتابعة!", time: "11:00 AM" }],
  },
  {
    id: 4,
    name: "Rana Odeh",
    initials: "R",
    color: "#E63946",
    lastMessage: "أهلاً ليلي، أهلاً عندي استفسار...",
    online: false,
    messages: [{ id: 1, from: "student", text: "متى موعد الجلسة القادمة؟", time: "9:45 AM" }],
  },
];

/**
 * نافذة منبثقة (modal) لصفحة الرسائل.
 * show: هل المودال ظاهر
 * onClose: تُستدعى عند إغلاق المودال (زر X أو الضغط خارج النافذة)
 * startNew: true لو انفتحت من زر "تواصل جديد" القديم (تبدأ بدون طالب محدد)
 * newContacts: مصفوفة طلاب [{id, name, initials, color}] جاية من نافذة اختيار الطلاب (NewContactModal)
 *              — يتم فتح/إنشاء محادثة فارغة لكل واحد منهم وتحديد أول واحد.
 */
export default function MessagesModal({ show, onClose, startNew = false, newContacts = [] }) {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [selectedId, setSelectedId] = useState(startNew ? null : INITIAL_STUDENTS[0].id);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");

  // كل ما تتفتح المودال، نجهّز القائمة حسب طريقة الفتح
  useEffect(() => {
    if (!show) return;

    setQuery("");
    setDraft("");

    if (newContacts.length > 0) {
      // دمج الطلاب الجداد مع القائمة الحالية (بدون تكرار)، وإنشاء محادثة فارغة لمن ما عنده محادثة
      setStudents((prev) => {
        const merged = [...prev];
        newContacts.forEach((c) => {
          const exists = merged.find((s) => s.id === c.id);
          if (!exists) {
            merged.unshift({
              id: c.id,
              name: c.name,
              initials: c.initials,
              color: c.color,
              lastMessage: "بدء محادثة جديدة",
              online: false,
              messages: [],
            });
          }
        });
        return merged;
      });
      setSelectedId(newContacts[0].id);
    } else if (startNew) {
      setSelectedId(null);
    } else {
      setSelectedId(INITIAL_STUDENTS[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, startNew, newContacts]);

  if (!show) return null;

  const selected = students.find((s) => s.id === selectedId);
  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSend = () => {
    if (!draft.trim() || !selectedId) return;
    setStudents((prev) =>
      prev.map((s) =>
        s.id === selectedId
          ? {
              ...s,
              lastMessage: draft,
              messages: [
                ...s.messages,
                {
                  id: s.messages.length + 1,
                  from: "mentor",
                  text: draft,
                  time: new Date().toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" }),
                },
              ],
            }
          : s
      )
    );
    setDraft("");
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgba(13, 27, 42, 0.5)", zIndex: 1050 }}
      onClick={onClose}
    >
      <div
        className="bg-light rounded-4 shadow overflow-hidden"
        style={{ width: "min(1100px, 95vw)", maxHeight: "88vh" }}
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <div className="d-flex justify-content-between align-items-center bg-white p-3 border-bottom">
          <span className="fw-bold">تواصل مع الطلاب</span>
          <button
            type="button"
            className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32 }}
            onClick={onClose}
            aria-label="إغلاق"
          >
            <BsX size={18} />
          </button>
        </div>

        <div className="row g-0" style={{ maxHeight: "calc(88vh - 60px)" }}>
          {/* Recent Activities - عمود مختصر */}
          <div
            className="col-12 col-lg-3 bg-white border-end p-3 overflow-auto"
            style={{ maxHeight: "calc(88vh - 60px)" }}
          >
            <div className="fw-bold small mb-3">Recent Activities</div>
            <div className="d-flex flex-column gap-3">
              {RECENT_ACTIVITIES.map((a) => (
                <div key={a.id} className="d-flex align-items-start gap-2">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold flex-shrink-0"
                    style={{ width: 24, height: 24, backgroundColor: a.color, fontSize: 10 }}
                  >
                    {a.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: 12 }} className="text-dark lh-sm">
                      {a.text}
                    </div>
                    <div className="text-muted" style={{ fontSize: 11 }}>
                      {a.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* قائمة الطلاب */}
          <div
            className="col-12 col-lg-3 bg-white border-end p-3 overflow-auto"
            style={{ maxHeight: "calc(88vh - 60px)" }}
          >
            <div className="fw-bold mb-3">قائمة الطلاب</div>
            <div className="position-relative mb-3">
              <BsSearch
                className="position-absolute top-50 translate-middle-y text-muted"
                style={{ right: 12 }}
              />
              <input
                type="text"
                className="form-control rounded-pill pe-5"
                placeholder="قائمة الطلاب"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus={startNew}
              />
            </div>

            <div className="d-flex flex-column gap-1">
              {filteredStudents.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className="btn text-start d-flex align-items-center gap-2 p-2 rounded-3 border-0"
                  style={{ backgroundColor: s.id === selectedId ? "#EAF6F2" : "transparent" }}
                  onClick={() => setSelectedId(s.id)}
                >
                  <span className="position-relative flex-shrink-0">
                    <span
                      className="rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold"
                      style={{ width: 36, height: 36, backgroundColor: s.color, fontSize: 13 }}
                    >
                      {s.initials}
                    </span>
                    {s.online && (
                      <span
                        className="position-absolute rounded-circle bg-success border border-white"
                        style={{ width: 9, height: 9, bottom: 0, left: 0 }}
                      />
                    )}
                  </span>
                  <span className="overflow-hidden">
                    <div className="fw-semibold small text-truncate">{s.name}</div>
                    <div className="text-muted text-truncate" style={{ fontSize: 12, maxWidth: 150 }}>
                      {s.lastMessage}
                    </div>
                  </span>
                </button>
              ))}
              {filteredStudents.length === 0 && (
                <p className="text-muted small text-center py-3 mb-0">لا يوجد طلاب مطابقين</p>
              )}
            </div>
          </div>

          {/* نافذة المحادثة */}
          <div className="col-12 col-lg-6 bg-white d-flex flex-column">
            {selected ? (
              <>
                <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                  <div className="fw-bold small">المحادثة مع: {selected.name}</div>
                  <BsTrash className="text-muted" role="button" />
                </div>

                <div
                  className="flex-grow-1 p-3 d-flex flex-column gap-3 overflow-auto"
                  style={{ minHeight: 300 }}
                >
                  {selected.messages.length === 0 && (
                    <div className="text-muted small text-center py-4">
                      لا توجد رسائل بعد — ابدئي المحادثة مع {selected.name}
                    </div>
                  )}
                  {selected.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`d-flex flex-column ${
                        m.from === "mentor" ? "align-items-end" : "align-items-start"
                      }`}
                    >
                      <div
                        className="rounded-4 px-3 py-2"
                        style={{
                          maxWidth: "80%",
                          fontSize: 13,
                          backgroundColor: m.from === "mentor" ? "#0D9488" : "#F1F5F4",
                          color: m.from === "mentor" ? "#fff" : "#212529",
                        }}
                      >
                        {m.text}
                      </div>
                      <span className="text-muted mt-1" style={{ fontSize: 11 }}>
                        {m.time}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-3 border-top d-flex align-items-center gap-2">
                  <button className="btn btn-light rounded-circle p-2" aria-label="إرفاق ملف">
                    <BsPaperclip size={16} />
                  </button>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    placeholder="اكتب رسالة..."
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  />
                  <button
                    className="btn rounded-circle p-2 text-white"
                    style={{ backgroundColor: "#0D9488" }}
                    onClick={handleSend}
                    aria-label="إرسال"
                  >
                    <BsSend size={16} />
                  </button>
                </div>
              </>
            ) : (
              <div className="d-flex align-items-center justify-content-center h-100 text-muted small p-4 text-center">
                اختاري طالبًا من القائمة لبدء محادثة جديدة معه
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}