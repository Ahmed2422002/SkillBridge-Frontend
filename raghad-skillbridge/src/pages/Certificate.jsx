import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { learningPaths } from "../data/coursePlaylists";
import { getCurrentUser, getCertificate, getMentorForPath } from "../api";

export default function Certificate() {
  const navigate = useNavigate();
  const { pathKey } = useParams();
  const user = getCurrentUser();
  const path = learningPaths[pathKey];
  const cert = getCertificate(user.email, pathKey);

  if (!path || !cert) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
        <p className="text-muted">الشهادة غير متاحة. أكملي كل دروس المسار أولًا.</p>
        <button className="btn btn-dark rounded-pill px-4" onClick={() => navigate("/my-progress")}>
          Back to My Progress
        </button>
      </div>
    );
  }

  const mentor = getMentorForPath(pathKey);
  const mentorName = mentor ? mentor.fullName : "SkillBridgeAI Team";
  const dateText = new Date(cert.completedAt).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

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
            CERTIFICATE OF COMPLETION
          </h1>
          <p className="text-muted mb-4">This is to certify that</p>

          <h2
            className="fw-bold mb-3"
            style={{ fontFamily: "Georgia, serif", fontSize: 44, borderBottom: "2px solid #22D3C5", padding: "0 30px 6px" }}
          >
            {user.fullName || "Student"}
          </h2>

          <p className="text-muted mb-1">has successfully completed the learning path</p>
          <h3 className="fw-bold mb-4" style={{ color: "#0D1B2A" }}>{path.title}</h3>

          <p className="text-muted mb-5">Completed on {dateText}</p>

          <div className="d-flex justify-content-around w-100 mt-auto align-items-end">
            <div>
              <div className="fw-semibold" style={{ fontFamily: "Georgia, serif", fontSize: 22 }}>
                {mentorName}
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