import React, { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";

/**
 * قائمة الطلاب المتاحين لبدء تواصل جديد معهم.
 * عدّليها لاحقًا لتجيء من الـ backend (نفس مصدر بيانات الطلاب في لوحة التحكم).
 */
export const ALL_STUDENTS = [
  { id: 101, name: "يوسف عمر", initials: "ي", color: "#0D9488", level: "المستوى 3", courseId: 30 },
  { id: 102, name: "فاطمة خالد", initials: "ف", color: "#7C4DFF", level: "المستوى 2", courseId: 20 },
  { id: 103, name: "محمد أحمد", initials: "م", color: "#0D1B2A", level: "المستوى 1", courseId: 30 },
  { id: 104, name: "آية سعيد", initials: "أ", color: "#F5B301", level: "المستوى 3", courseId: 30 },
  { id: 105, name: "علي حسن", initials: "ع", color: "#E63946", level: "المستوى 3", courseId: 20 },
  { id: 106, name: "نور سمير", initials: "ن", color: "#22D3C5", level: "المستوى 1", courseId: 30 },
  { id: 107, name: "حسن محمود", initials: "ح", color: "#0D9488", level: "المستوى 2", courseId: 30 },
  { id: 108, name: "سارة يوسف", initials: "س", color: "#7C4DFF", level: "المستوى 3", courseId: 30 },
  { id: 109, name: "خالد وليد", initials: "خ", color: "#0D1B2A", level: "المستوى 5", courseId: 30 },
  { id: 110, name: "عبدالله صالح", initials: "ع", color: "#F5B301", level: "المستوى 3", courseId: 30 },
  { id: 111, name: "هدى جلال", initials: "هـ", color: "#E63946", level: "المستوى 2", courseId: 30 },
  { id: 112, name: "مريم كريم", initials: "م", color: "#22D3C5", level: "المستوى 1", courseId: 30 },
];

/**
 * نافذة منبثقة لاختيار طالب أو أكثر لبدء تواصل جديد معهم.
 * show: هل المودال ظاهر
 * onClose: تُستدعى عند الإلغاء أو الإغلاق
 * onConfirm(selectedStudents): تُستدعى عند الضغط على "تأكيد واستمرار" وتُمرّر مصفوفة الطلاب المختارين
 */
export default function NewContactModal({ show, onClose, onConfirm, students = ALL_STUDENTS }) {
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (show) {
      setQuery("");
      setSelectedIds([]);
    }
  }, [show]);

  if (!show) return null;

  const filtered = students.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));

  const toggleStudent = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleConfirm = () => {
    if (selectedIds.length === 0) return;
    const selectedStudents = students.filter((s) => selectedIds.includes(s.id));
    onConfirm?.(selectedStudents);
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgba(13, 27, 42, 0.5)", zIndex: 1060 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-4 shadow overflow-hidden d-flex flex-column"
        style={{ width: "min(760px, 95vw)", maxHeight: "88vh" }}
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <div className="p-4 pb-3">
          <h4 className="fw-bold mb-3">بدء تواصل جديد</h4>
          <div className="fw-semibold mb-2">اختيار الطلاب</div>
          <div className="position-relative">
            <BsSearch className="position-absolute top-50 translate-middle-y text-muted" style={{ right: 14 }} />
            <input
              type="text"
              className="form-control rounded-pill pe-5"
              placeholder="بحث عن اسم الطالب..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <div className="px-4 overflow-auto flex-grow-1">
          <div className="row g-3 pb-2">
            {filtered.map((s) => {
              const checked = selectedIds.includes(s.id);
              return (
                <div className="col-6 col-md-4" key={s.id}>
                  <button
                    type="button"
                    onClick={() => toggleStudent(s.id)}
                    className="btn w-100 text-start d-flex align-items-center gap-2 p-2 rounded-3 border"
                    style={{
                      borderColor: checked ? "#0D9488" : "#dee2e6",
                      backgroundColor: checked ? "#EAF6F2" : "#fff",
                    }}
                  >
                    <span
                      className="rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold flex-shrink-0"
                      style={{ width: 44, height: 44, backgroundColor: s.color, fontSize: 15 }}
                    >
                      {s.initials}
                    </span>
                    <span className="flex-grow-1 overflow-hidden">
                      <div className="fw-semibold small text-truncate">{s.name}</div>
                      <div className="text-muted text-truncate" style={{ fontSize: 11 }}>
                        {s.level}
                      </div>
                      <div className="text-muted text-truncate" style={{ fontSize: 11 }}>
                        Course ID-{s.courseId}
                      </div>
                    </span>
                    <input
                      type="checkbox"
                      className="form-check-input flex-shrink-0"
                      checked={checked}
                      onChange={() => toggleStudent(s.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </button>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <p className="text-muted small text-center py-4 mb-0">لا يوجد طلاب مطابقين</p>
            )}
          </div>
        </div>

        <div className="p-3 border-top d-flex gap-2">
          <button type="button" className="btn btn-light rounded-3 flex-grow-1 fw-semibold" onClick={onClose}>
            إلغاء
          </button>
          <button
            type="button"
            className="btn text-white rounded-3 flex-grow-1 fw-semibold"
            style={{ backgroundColor: "#0D9488", opacity: selectedIds.length === 0 ? 0.6 : 1 }}
            onClick={handleConfirm}
            disabled={selectedIds.length === 0}
          >
            تأكيد واستمرار{selectedIds.length > 0 ? ` (${selectedIds.length})` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}