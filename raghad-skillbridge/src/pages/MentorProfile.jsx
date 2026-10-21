import React, { useState } from "react";
import {
  BsSearch,
  BsBell,
  BsPencil,
  BsPlusLg,
  BsPeople,
  BsCameraVideo,
  BsGlobe,
  BsFileEarmark,
  BsX,
  BsTrash,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, getInitials, saveProfileExtra, saveCurrentUser } from "../api";

const EXPERTISE_LABELS = {
  frontend: "Frontend Development",
  backend: "Backend Development",
  design: "UI/UX Design",
  data: "Data Science",
  product: "Product Management",
};

// يضيف https:// للرابط إذا ناقص
function normalizeUrl(url) {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

// ===== نافذة منبثقة عامة =====
function Modal({ title, onClose, children }) {
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgba(13, 27, 42, 0.5)", zIndex: 1050 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-4 shadow overflow-auto"
        style={{ width: "min(560px, 95vw)", maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <span className="fw-bold">{title}</span>
          <button
            type="button"
            className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32 }}
            onClick={onClose}
            aria-label="Close"
          >
            <BsX size={18} />
          </button>
        </div>
        <div className="p-3">{children}</div>
      </div>
    </div>
  );
}

// ===== نافذة Edit Profile =====
function EditProfileModal({ profile, onSave, onClose }) {
  const [form, setForm] = useState({
    fullName: profile.fullName || "",
    title: profile.title || "",
    expertise: profile.expertise || "",
    linkedin: profile.linkedin || "",
    website: profile.website || "",
    portfolio: profile.portfolio || "",
  });
  const [error, setError] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = () => {
    if (!form.fullName.trim()) {
      setError("Full name is required.");
      return;
    }
    onSave({
      fullName: form.fullName.trim(),
      title: form.title.trim(),
      expertise: form.expertise,
      linkedin: form.linkedin.trim(),
      website: form.website.trim(),
      portfolio: form.portfolio.trim(),
    });
  };

  return (
    <Modal title="Edit Profile" onClose={onClose}>
      <div className="mb-3">
        <label className="form-label small fw-semibold">Full name</label>
        <input className="form-control" value={form.fullName} onChange={set("fullName")} />
      </div>

      <div className="mb-3">
        <label className="form-label small fw-semibold">Job title</label>
        <input
          className="form-control"
          placeholder="e.g. Sr. EduAI Mentor"
          value={form.title}
          onChange={set("title")}
        />
      </div>

      <div className="mb-3">
        <label className="form-label small fw-semibold">Specialization</label>
        <select className="form-select" value={form.expertise} onChange={set("expertise")}>
          <option value="">— Select —</option>
          {Object.entries(EXPERTISE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label small fw-semibold">LinkedIn</label>
        <input
          className="form-control"
          placeholder="linkedin.com/in/your-name"
          value={form.linkedin}
          onChange={set("linkedin")}
        />
      </div>

      <div className="mb-3">
        <label className="form-label small fw-semibold">Personal website</label>
        <input
          className="form-control"
          placeholder="yourwebsite.com"
          value={form.website}
          onChange={set("website")}
        />
      </div>

      <div className="mb-3">
        <label className="form-label small fw-semibold">Portfolio</label>
        <input
          className="form-control"
          placeholder="yourportfolio.com"
          value={form.portfolio}
          onChange={set("portfolio")}
        />
      </div>

      {error && <div className="text-danger small mb-3">{error}</div>}

      <div className="d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-light" onClick={onClose}>
          Cancel
        </button>
        <button
          type="button"
          className="btn text-white"
          style={{ backgroundColor: "#285967" }}
          onClick={handleSubmit}
        >
          Save changes
        </button>
      </div>
    </Modal>
  );
}

// ===== نافذة Add New Bio =====
function AddBioModal({ onSave, onClose }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) {
      setError("Please write something first.");
      return;
    }
    onSave(text.trim());
  };

  return (
    <Modal title="Add New Bio" onClose={onClose}>
      <div className="mb-3">
        <label className="form-label small fw-semibold">Your bio</label>
        <textarea
          className="form-control"
          rows={5}
          maxLength={500}
          placeholder="Tell students about your experience..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
        />
        <div className="text-muted small text-end mt-1">{text.length}/500</div>
      </div>

      {error && <div className="text-danger small mb-3">{error}</div>}

      <div className="d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-light" onClick={onClose}>
          Cancel
        </button>
        <button
          type="button"
          className="btn text-white"
          style={{ backgroundColor: "#285967" }}
          onClick={handleSubmit}
        >
          Add bio
        </button>
      </div>
    </Modal>
  );
}

export default function MentorProfile() {
  const navigate = useNavigate();
  // بيانات المستخدم الحالي (من api.js) — بنحدّثها بعد كل حفظ
  const [user, setUser] = useState(() => getCurrentUser());
  const [showEdit, setShowEdit] = useState(false);
  const [showAddBio, setShowAddBio] = useState(false);

  const profile = user;

  // قائمة الـ Bios: bios إذا موجودة، وإلا البايو القديم من التسجيل (إن وجد)
  const bios = Array.isArray(user.bios) ? user.bios : user.bio ? [user.bio] : [];

  // يحفظ بالبروفايل الدائم (بيظهر بكل الموقع) وبالمستخدم الحالي
  const saveProfile = (patch) => {
    if (!user.email) return;
    saveProfileExtra(user.email, patch);
    const next = { ...user, ...patch };
    saveCurrentUser(next);
    setUser(next);
  };

  const handleSaveProfile = (data) => {
    saveProfile(data);
    setShowEdit(false);
  };

  const handleAddBio = (text) => {
    const next = [...bios, text];
    saveProfile({ bios: next, bio: next[0] || "" });
    setShowAddBio(false);
  };

  const handleDeleteBio = (index) => {
    const next = bios.filter((_, i) => i !== index);
    saveProfile({ bios: next, bio: next[0] || "" });
  };

  const MENTOR = {
    name: profile.fullName || "Mentor",
    initials: getInitials(profile.fullName),
    // لو العنوان محفوظ كمفتاح تخصص (مثل frontend) نعرض اسمه الكامل
    role: EXPERTISE_LABELS[profile.title] || profile.title || "EduAI Mentor",
    memberSince: user.createdAt
      ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
      : "",
    image: null, // حطي رابط صورة هون لما تتوفر
  };

  const socialLinks = [
    {
      key: "linkedin",
      label: "LinkedIn",
      url: profile.linkedin,
      icon: (
        <span
          className="d-flex align-items-center justify-content-center rounded-2"
          style={{
            width: 27,
            height: 27,
            backgroundColor: "#0A66C2",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          in
        </span>
      ),
    },
    { key: "website", label: "Personal Website", url: profile.website, icon: <BsGlobe size={20} /> },
    { key: "portfolio", label: "Portfolio", url: profile.portfolio, icon: <BsFileEarmark size={20} /> },
  ];

  return (
    <div
      className="min-vh-100"
      style={{
        backgroundColor: "#f5f8fa",
        color: "#212529",
      }}
    >
      {/* ================= NAVBAR ================= */}
      <nav className="navbar navbar-light bg-white py-3 shadow-sm">
        <div className="container-fluid px-4 d-flex align-items-center">
          {/* Logo */}
          <a
            className="navbar-brand fw-bold d-flex align-items-center gap-2 me-4"
            href="/mentor-dashboard"
            onClick={(e) => {
              e.preventDefault();
              navigate("/mentor-dashboard");
            }}
            style={{ textDecoration: "none", color: "#212529" }}
          >
            <span
              className="d-inline-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: 28,
                height: 28,
                backgroundColor: "#22D3C5",
                color: "#fff",
              }}
            >
              ●
            </span>
            SkillBridge
            <span className="text-muted fw-normal ms-2 border-start ps-2">EduAI Mentor</span>
          </a>

          {/* Search */}
          <div className="flex-grow-1 mx-auto" style={{ maxWidth: 420 }}>
            <div className="position-relative">
              <BsSearch className="position-absolute top-50 translate-middle-y ms-3 text-muted" />
              <input type="text" className="form-control rounded-pill ps-5" placeholder="Search" />
            </div>
          </div>

          {/* Right Side */}
          <div className="d-flex align-items-center gap-3 ms-3">
            {/* Notification */}
            <div
              className="position-relative"
              role="button"
              onClick={() => navigate("/mentor-dashboard/notifications")}
              style={{ cursor: "pointer" }}
            >
              <BsBell className="text-dark" size={18} />
              <span
                className="position-absolute rounded-circle bg-danger"
                style={{ width: 8, height: 8, top: -2, right: -2 }}
              />
            </div>

            {/* Profile */}
            <div
              className="rounded-circle d-flex align-items-center justify-content-center fw-semibold text-white"
              style={{
                width: 34,
                height: 34,
                backgroundColor: "#0D9488",
                fontSize: 13,
              }}
            >
              {MENTOR.initials}
            </div>
          </div>
        </div>
      </nav>

      {/* ================= PROFILE ================= */}
      <div className="container-fluid px-4 py-4" style={{ maxWidth: 1200 }}>
        {/* Profile Header */}
        <div
          className="rounded-4 position-relative mb-5"
          style={{
            height: 115,
            background: "linear-gradient(135deg, #398F8B 0%, #1C354F 100%)",
          }}
        >
          {/* Profile Image */}
          <div
            className="position-absolute"
            style={{
              left: 20,
              bottom: -55,
              width: 155,
              height: 155,
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 5,
              boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
            }}
          >
            {MENTOR.image ? (
              <img
                src={MENTOR.image}
                alt={MENTOR.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 }}
              />
            ) : (
              <div
                className="d-flex align-items-center justify-content-center text-white fw-bold"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 12,
                  backgroundColor: "#0D9488",
                  fontSize: 48,
                }}
              >
                {MENTOR.initials}
              </div>
            )}
          </div>

          {/* Name */}
          <div className="position-absolute text-white" style={{ left: 195, top: 22 }}>
            <h1 className="fw-bold mb-1" style={{ fontSize: 30 }}>
              {MENTOR.name}
            </h1>

            <div style={{ fontSize: 19, opacity: 0.9 }}>{MENTOR.role}</div>

            {MENTOR.memberSince && (
              <div style={{ fontSize: 14, opacity: 0.85 }}>Member since {MENTOR.memberSince}</div>
            )}
          </div>
        </div>

        {/* Buttons + About Me */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex gap-2" style={{ marginLeft: 175 }}>
            <button
              type="button"
              className="btn text-white rounded-3 d-flex align-items-center gap-2 px-3"
              style={{ backgroundColor: "#285967" }}
              onClick={() => setShowEdit(true)}
            >
              <BsPencil />
              Edit Profile
            </button>

            <button
              type="button"
              className="btn text-white rounded-3 d-flex align-items-center gap-2 px-3"
              style={{ backgroundColor: "#285967" }}
              onClick={() => setShowAddBio(true)}
            >
              <BsPlusLg />
              Add New Bio
            </button>
          </div>

          <h2 className="fw-bold mb-0" style={{ fontSize: 25 }}>
            About Me
          </h2>
        </div>

        {/* ================= CONTENT GRID ================= */}
        <div className="row g-3">
          {/* LEFT COLUMN */}
          <div className="col-12 col-lg-6">
            {/* Bio */}
            <div className="bg-white rounded-4 shadow-sm p-4 mb-3" style={{ minHeight: 220 }}>
              <h3 className="fw-bold text-end mb-4" style={{ fontSize: 23 }}>
                Bio
              </h3>

              {bios.length === 0 ? (
                <p className="text-center text-muted mb-0" style={{ fontSize: 19 }}>
                  No bio added yet.
                </p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {bios.map((b, i) => (
                    <div key={i} className="d-flex align-items-start gap-2">
                      <p className="mb-0 flex-grow-1" style={{ fontSize: 17, lineHeight: 1.5 }}>
                        {b}
                      </p>
                      <button
                        type="button"
                        className="btn btn-sm btn-light text-danger flex-shrink-0"
                        onClick={() => handleDeleteBio(i)}
                        aria-label="Delete bio"
                        title="Delete"
                      >
                        <BsTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Specializations */}
            <div className="bg-white rounded-4 shadow-sm p-4" style={{ minHeight: 195 }}>
              <h3 className="fw-bold text-end mb-4" style={{ fontSize: 23 }}>
                Specializations
              </h3>

              {profile.expertise ? (
                <div className="text-center">
                  <span
                    className="badge rounded-pill px-3 py-2"
                    style={{ backgroundColor: "#D6F5F2", color: "#0D9488", fontSize: 16 }}
                  >
                    {EXPERTISE_LABELS[profile.expertise] || profile.expertise}
                  </span>
                </div>
              ) : (
                <p className="text-center text-muted mb-0">No specialization selected.</p>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-12 col-lg-6">
            {/* Statistics */}
            <div className="bg-white rounded-4 shadow-sm p-4 mb-3" style={{ minHeight: 140 }}>
              <div
                className="d-flex justify-content-end align-items-center gap-2 mb-3"
                style={{ fontSize: 18 }}
              >
                <span>12 : Mentored Students</span>
                <span
                  className="d-flex align-items-center justify-content-center rounded-3"
                  style={{ width: 38, height: 38, backgroundColor: "#e4eeee", color: "#285967" }}
                >
                  <BsPeople />
                </span>
              </div>

              <div
                className="d-flex justify-content-end align-items-center gap-2"
                style={{ fontSize: 18 }}
              >
                <span>24 : Video Sessions</span>
                <span
                  className="d-flex align-items-center justify-content-center rounded-3"
                  style={{ width: 38, height: 38, backgroundColor: "#e4eeee", color: "#285967" }}
                >
                  <BsCameraVideo />
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-4 shadow-sm p-4" style={{ minHeight: 155 }}>
              <h3 className="fw-bold text-end mb-4" style={{ fontSize: 23 }}>
                Social Links
              </h3>

              <div className="d-flex flex-column align-items-end gap-2">
                {socialLinks.map((l) =>
                  l.url ? (
                    <a
                      key={l.key}
                      href={normalizeUrl(l.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-flex align-items-center gap-2 text-dark"
                      style={{ textDecoration: "none" }}
                    >
                      <span>{l.label}</span>
                      {l.icon}
                    </a>
                  ) : (
                    <div key={l.key} className="d-flex align-items-center gap-2 text-muted">
                      <span>{l.label}</span>
                      {l.icon}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODALS ================= */}
      {showEdit && (
        <EditProfileModal
          profile={profile}
          onSave={handleSaveProfile}
          onClose={() => setShowEdit(false)}
        />
      )}
      {showAddBio && <AddBioModal onSave={handleAddBio} onClose={() => setShowAddBio(false)} />}
    </div>
  );
}