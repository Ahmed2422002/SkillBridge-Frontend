import React, { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getCurrentUser, getQuizCertificate } from "../api";

export default function QuizCertificate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { certId } = useParams();
  const user = getCurrentUser();
  const cert = getQuizCertificate(certId);
  // الشهادة بتظهر لصاحبها فقط
  const allowed = !!cert && cert.studentEmail === (user.email || "").toLowerCase();

  // لما نيجي من زر Download بالإشعار، بتفتح نافذة الطباعة/الحفظ كـ PDF تلقائياً
  useEffect(() => {
    if (allowed && location.state?.autoPrint) {
      const t = setTimeout(() => window.print(), 500);
      return () => clearTimeout(t);
    }
  }, [allowed, location.state]);

  if (!allowed) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
        <p className="text-muted">الشهادة غير متاحة.</p>
        <button className="btn btn-dark rounded-pill px-4" onClick={() => navigate("/notifications")}>
          Back to Notifications
        </button>
      </div>
    );
  }

  const dateText = new Date(cert.issuedAt).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
  const skill = cert.categoryLabel || cert.pathLabel;

  return (
    <div className="bg-light min-vh-100 py-4">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body, .bg-light { background: #fff !important; }
          .cert-sheet { box-shadow: none !important; }
          @page { size: landscape; margin: 8mm; }
        }
      `}</style>

      <div className="container no-print d-flex justify-content-between mb-3" style={{ maxWidth: 1000 }}>
        <button className="btn btn-outline-secondary rounded-pill" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <button
          className="btn text-white rounded-pill px-4"
          style={{ backgroundColor: "#0D9488" }}
          onClick={() => window.print()}
        >
          Download / Print
        </button>
      </div>

      <div className="mx-auto bg-white cert-sheet shadow" style={{ maxWidth: 1000, padding: 14 }}>
        <div
          className="text-center d-flex flex-column align-items-center"
          style={{ border: "6px double #0D9488", padding: "40px 50px", minHeight: 560 }}
        >
          <div className="d-flex align-items-center gap-2 mb-3">
            <img
              src="/homeImg.jpeg"
              alt="SkillBridgeAI Logo"
              style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }}
            />
            <span className="fw-bold fs-4" style={{ color: "#0D1B2A" }}>SkillBridgeAI</span>
          </div>

          <h1 className="fw-bold mb-1" style={{ fontFamily: "Georgia, serif", color: "#0D9488", letterSpacing: 2 }}>
            CERTIFICATE OF ACHIEVEMENT
          </h1>
          <p className="text-muted mb-3">This is to certify that</p>

          <h2
            className="fw-bold mb-1"
            style={{ fontFamily: "Georgia, serif", fontSize: 44, borderBottom: "2px solid #22D3C5", padding: "0 30px 6px" }}
          >
            {cert.studentName || "Student"}
          </h2>
          <div className="text-muted small mb-3">{cert.studentEmail}</div>

          <p className="text-muted mb-1">has successfully passed the assessment</p>
          <h3 className="fw-bold mb-2" style={{ color: "#0D1B2A" }}>{cert.quizTitle}</h3>

          {skill && (
            <p className="mb-1">
              <span className="text-muted">Skill: </span>
              <span className="fw-semibold">{skill}</span>
            </p>
          )}
          {cert.pathLabel && (
            <p className="mb-1">
              <span className="text-muted">Learning path: </span>
              <span className="fw-semibold">{cert.pathLabel}</span>
            </p>
          )}
          <p className="mb-3">
            <span className="text-muted">Score: </span>
            <span className="fw-semibold">{cert.score} / {cert.total} ({cert.percent}%)</span>
          </p>

          <p className="text-muted mb-4">Issued on {dateText}</p>

          <div className="d-flex justify-content-around w-100 mt-auto align-items-end">
            <div>
              <div className="fw-semibold" style={{ fontFamily: "Georgia, serif", fontSize: 22 }}>
                {cert.mentorName || "SkillBridgeAI Team"}
              </div>
              <div style={{ borderTop: "1px solid #212529", marginTop: 4, paddingTop: 4 }} className="small text-muted">
                Course Mentor
              </div>
            </div>
            <div>
              <div className="fw-semibold">{cert.id}</div>
              <div style={{ borderTop: "1px solid #212529", marginTop: 4, paddingTop: 4 }} className="small text-muted">
                Certificate ID
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}