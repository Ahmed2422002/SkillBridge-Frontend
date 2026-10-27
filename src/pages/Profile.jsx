
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BsSearch,
  BsBell,
  BsPersonFill,
  BsPencilFill,
  BsGearFill,
  BsBoxArrowRight,
  BsShieldLockFill,
  BsCalendar3,
  BsBookFill,
  BsEnvelopeFill,
  BsCheckCircleFill,
  BsXLg,
  BsEye,
  BsEyeSlash,
} from "react-icons/bs";

// بيانات وهمية مبدئية — لاحقًا ممكن تجيبيها من backend أو من OnboardingContext
const INITIAL_PROFILE = {
  firstName: "Reema",
  lastName: "Eyad",
  email: "reema@example.com",
  username: "reema_eyad",
  country: "Palestine",
  primaryPath: "Front-End Development",
  memberSince: "January 2026",
  avatar: null, // رابط صورة، أو null لاستخدام أيقونة افتراضية
};
const PRIMARY_PATHS = [
  { key: "frontend", label: "Front-End Development" },
  { key: "backend", label: "Back-End Development" },
  { key: "fullstack", label: "Full-Stack Development" },
  { key: "uiux", label: "UI/UX Design" },
  { key: "data", label: "Data Science" },
  { key: "cybersecurity", label: "Cybersecurity" },
  { key: "mobile", label: "Mobile Development" },
];

const COUNTRIES = ["Palestine", "Jordan", "Egypt", "Saudi Arabia", "UAE", "Other"];

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [form, setForm] = useState(INITIAL_PROFILE);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    learningReminders: true,
    weeklyProgressSummary: true,
    achievementNotifications: true,
  });

  // ---------- حالة تسجيل الخروج ----------
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  // ---------- حالة نافذة تغيير كلمة المرور ----------
  // 'closed' | 'form' | 'success'
  const [passwordModalStep, setPasswordModalStep] = useState("closed");
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    setProfile(form);
  };

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getPrimaryPathKey = () => {
    const found = PRIMARY_PATHS.find((p) => p.label === profile.primaryPath);
    return found ? found.key : "frontend";
  };

  // ---------- منطق تسجيل الخروج ----------
  const handleLogout = () => {
    // هنا تحطي منطقك الحقيقي: مسح التوكن من localStorage، استدعاء API الخروج، إلخ
    // localStorage.removeItem("token");
    // await api.post("/auth/logout");
    setIsLoggedOut(true);
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  // ---------- منطق تغيير كلمة المرور ----------
  const openPasswordModal = () => {
    setPasswordForm({ current: "", next: "", confirm: "" });
    setPasswordError("");
    setPasswordModalStep("form");
  };

  const closePasswordModal = () => {
    setPasswordModalStep("closed");
  };

  const handlePasswordFieldChange = (field, value) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirmPasswordChange = (e) => {
    e.preventDefault();
    setPasswordError("");

    if (!passwordForm.current || !passwordForm.next || !passwordForm.confirm) {
      setPasswordError("الرجاء تعبئة جميع الحقول");
      return;
    }
    if (passwordForm.next.length < 8) {
      setPasswordError("كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل");
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordError("كلمة المرور الجديدة وتأكيدها غير متطابقين");
      return;
    }

    // هنا تحطي منطقك الحقيقي لاستدعاء API تغيير كلمة المرور
    // await api.post("/auth/change-password", { ...passwordForm });

    setPasswordModalStep("success");
  };

  // ================= واجهة: تم تسجيل الخروج =================
  if (isLoggedOut) {
    return (
      <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
        <div
          className="bg-white rounded-4 shadow-sm p-5 text-center"
          style={{ width: 380, maxWidth: "90vw" }}
        >
          <div
            className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: 64, height: 64, backgroundColor: "#D6F5F2" }}
          >
            <BsCheckCircleFill size={32} color="#0D9488" />
          </div>
          <h4 className="fw-bold mb-2">تم تسجيل خروجك بنجاح</h4>
          <p className="text-muted mb-4">
            نتمنى رؤيتك مجددًا قريبًا. تم تسجيل خروجك من جميع الأجهزة.
          </p>
          <button
            className="btn text-white rounded-pill px-4"
            style={{ backgroundColor: "#0D9488" }}
            onClick={handleBackToLogin}
          >
            العودة لتسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  // ================= الصفحة الأساسية =================
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
              onClick={() => navigate(`/learning/${getPrimaryPathKey()}`)}
            >
              Videos
            </span>
            <span role="button" className="text-dark text-decoration-none" onClick={() => navigate("/my-progress")}>
              My Progress
            </span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <BsSearch className="text-dark" role="button" />
            <BsBell className="text-dark" role="button" onClick={() => navigate("/notifications")} />
            <div
              className="rounded-circle bg-secondary overflow-hidden"
              style={{ width: 32, height: 32, backgroundSize: "cover" }}
            />
          </div>
        </div>
      </nav>

      <div className="container py-5" style={{ maxWidth: 1100 }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold">My Profile</h2>
          <p className="text-muted">Manage your personal information, learning preferences, and account settings.</p>
        </div>

        {/* بطاقة معلومات المستخدم العلوية */}
        <div className="bg-white rounded-4 shadow-sm p-4 mb-4 d-flex align-items-center gap-3 flex-wrap">
          <div className="position-relative">
            <div
              className="rounded-circle overflow-hidden d-flex align-items-center justify-content-center bg-secondary"
              style={{ width: 72, height: 72, fontSize: 32, color: "#fff" }}
            >
              {profile.avatar ? (
                <img src={profile.avatar} alt="avatar" className="w-100 h-100" style={{ objectFit: "cover" }} />
              ) : (
                <BsPersonFill />
              )}
            </div>
            <button
              className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center position-absolute"
              style={{
                width: 26,
                height: 26,
                bottom: -2,
                right: -2,
                backgroundColor: "#0D9488",
                color: "#fff",
                padding: 0,
              }}
            >
              <BsPencilFill size={12} />
            </button>
          </div>

          <div className="flex-grow-1">
            <div className="fw-bold fs-5">
              {profile.firstName} {profile.lastName}
            </div>
            <div className="text-muted small d-flex align-items-center gap-1 mb-1">
              <BsEnvelopeFill size={12} /> {profile.email}
            </div>
            <div className="text-muted small d-flex align-items-center gap-1 mb-1">
              <BsBookFill size={12} /> Primary Path: {profile.primaryPath}
            </div>
            <div className="text-muted small d-flex align-items-center gap-1">
              <BsCalendar3 size={12} /> Member since: {profile.memberSince}
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Personal Information */}
          <div className="col-12 col-lg-4">
            <div className="bg-white rounded-4 shadow-sm p-4 h-100">
              <div className="d-flex align-items-center gap-2 mb-1">
                <span
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{ width: 34, height: 34, backgroundColor: "#D6F5F2", color: "#0D9488" }}
                >
                  <BsPersonFill />
                </span>
                <span className="fw-bold">Personal Information</span>
              </div>
              <p className="text-muted small mb-3">Update your basic account information.</p>

              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="form-label small text-muted mb-1">First Name</label>
                  <input
                    className="form-control"
                    value={form.firstName}
                    onChange={(e) => handleFormChange("firstName", e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small text-muted mb-1">Last Name</label>
                  <input
                    className="form-control"
                    value={form.lastName}
                    onChange={(e) => handleFormChange("lastName", e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-2">
                <label className="form-label small text-muted mb-1">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={form.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                />
              </div>

              <div className="mb-2">
                <label className="form-label small text-muted mb-1">Username</label>
                <input
                  className="form-control"
                  value={form.username}
                  onChange={(e) => handleFormChange("username", e.target.value)}
                />
              </div>
              <div className="mb-2">
                <label className="form-label small text-muted mb-1">Primary Path</label>
                <select
                  className="form-select"
                  value={form.primaryPath}
                  onChange={(e) => handleFormChange("primaryPath", e.target.value)}
                >
                  {PRIMARY_PATHS.map((p) => (
                    <option key={p.key} value={p.label}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small text-muted mb-1">Country</label>
                <select
                  className="form-select"
                  value={form.country}
                  onChange={(e) => handleFormChange("country", e.target.value)}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="btn text-white rounded-pill px-3 d-flex align-items-center gap-2"
                style={{ backgroundColor: "#0D9488" }}
                onClick={handleSaveChanges}
              >
                ✓ Save Changes
              </button>
            </div>
          </div>

          {/* Account Settings */}
          <div className="col-12 col-lg-4">
            <div className="bg-white rounded-4 shadow-sm p-4 h-100">
              <div className="d-flex align-items-center gap-2 mb-1">
                <span
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{ width: 34, height: 34, backgroundColor: "#D6F5F2", color: "#0D9488" }}
                >
                  <BsGearFill />
                </span>
                <span className="fw-bold">Account Settings</span>
              </div>
              <p className="text-muted small mb-3">Manage your notification preferences.</p>

              <ToggleRow
                label="Email Notifications"
                checked={settings.emailNotifications}
                onChange={() => toggleSetting("emailNotifications")}
              />
              <ToggleRow
                label="Learning Reminders"
                checked={settings.learningReminders}
                onChange={() => toggleSetting("learningReminders")}
              />
              <ToggleRow
                label="Weekly Progress Summary"
                checked={settings.weeklyProgressSummary}
                onChange={() => toggleSetting("weeklyProgressSummary")}
              />
              <ToggleRow
                label="Achievement Notifications"
                checked={settings.achievementNotifications}
                onChange={() => toggleSetting("achievementNotifications")}
              />
            </div>
          </div>

          {/* Account Actions & Security */}
          <div className="col-12 col-lg-4">
            <div className="bg-white rounded-4 shadow-sm p-4 h-100 d-flex flex-column">
              <div className="d-flex align-items-center gap-2 mb-1">
                <span
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{ width: 34, height: 34, backgroundColor: "#D6F5F2", color: "#0D9488" }}
                >
                  <BsBoxArrowRight />
                </span>
                <span className="fw-bold">Account Actions & Security</span>
              </div>
              <p className="text-muted small mb-3">Manage your account.</p>

              <button className="btn btn-outline-dark rounded-pill mb-1" onClick={handleLogout}>
                Log Out
              </button>
              <p className="text-muted small mb-4">You will be logged out of all devices.</p>

              <div className="d-flex align-items-center gap-2 mb-1">
                <span
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{ width: 34, height: 34, backgroundColor: "#D6F5F2", color: "#0D9488" }}
                >
                  <BsShieldLockFill />
                </span>
                <span className="fw-bold">Security</span>
              </div>
              <p className="text-muted small mb-3">Keep your account secure.</p>

              <div className="d-flex align-items-center justify-content-between">
                <span className="small">Change Password</span>
                <button
                  className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                  onClick={openPasswordModal}
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ نافذة تغيير كلمة المرور ============ */}
      {passwordModalStep === "form" && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(17,24,39,0.5)", zIndex: 1050 }}
          onClick={closePasswordModal}
        >
          <div
            className="bg-white rounded-4 shadow p-4"
            style={{ width: 380, maxWidth: "90vw", textAlign: "right" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold m-0">تغيير كلمة المرور</h5>
              <button
                className="btn btn-sm p-0 text-muted"
                onClick={closePasswordModal}
                style={{ background: "transparent", border: "none" }}
              >
                <BsXLg size={16} />
              </button>
            </div>

            <form onSubmit={handleConfirmPasswordChange}>
              <div className="mb-2">
                <label className="form-label small text-muted mb-1">كلمة المرور الحالية</label>
                <input
                  type={showPasswords ? "text" : "password"}
                  className="form-control"
                  dir="ltr"
                  value={passwordForm.current}
                  onChange={(e) => handlePasswordFieldChange("current", e.target.value)}
                />
              </div>

              <div className="mb-2">
                <label className="form-label small text-muted mb-1">كلمة المرور الجديدة</label>
                <input
                  type={showPasswords ? "text" : "password"}
                  className="form-control"
                  dir="ltr"
                  value={passwordForm.next}
                  onChange={(e) => handlePasswordFieldChange("next", e.target.value)}
                />
              </div>

              <div className="mb-2">
                <label className="form-label small text-muted mb-1">تأكيد كلمة المرور الجديدة</label>
                <input
                  type={showPasswords ? "text" : "password"}
                  className="form-control"
                  dir="ltr"
                  value={passwordForm.confirm}
                  onChange={(e) => handlePasswordFieldChange("confirm", e.target.value)}
                />
              </div>

              <button
                type="button"
                className="btn btn-sm p-0 d-flex align-items-center gap-1 mb-2"
                style={{ background: "transparent", border: "none", color: "#0D9488" }}
                onClick={() => setShowPasswords((s) => !s)}
              >
                {showPasswords ? <BsEyeSlash size={14} /> : <BsEye size={14} />}
                {showPasswords ? "إخفاء كلمات المرور" : "إظهار كلمات المرور"}
              </button>

              {passwordError && (
                <p className="text-danger small mb-2">{passwordError}</p>
              )}

              <div className="d-flex gap-2 mt-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill flex-grow-1"
                  onClick={closePasswordModal}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="btn text-white rounded-pill flex-grow-1"
                  style={{ backgroundColor: "#0D9488" }}
                >
                  تأكيد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============ واجهة نجاح تغيير كلمة المرور ============ */}
      {passwordModalStep === "success" && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(17,24,39,0.5)", zIndex: 1050 }}
        >
          <div
            className="bg-white rounded-4 shadow p-4 text-center"
            style={{ width: 360, maxWidth: "90vw" }}
          >
            <div
              className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: 64, height: 64, backgroundColor: "#D6F5F2" }}
            >
              <BsCheckCircleFill size={32} color="#0D9488" />
            </div>
            <h5 className="fw-bold mb-2">تم تغيير كلمة المرور بنجاح</h5>
            <p className="text-muted mb-4">
              يمكنك الآن استخدام كلمة المرور الجديدة لتسجيل الدخول.
            </p>
            <button
              className="btn text-white rounded-pill px-4"
              style={{ backgroundColor: "#0D9488" }}
              onClick={closePasswordModal}
            >
              حسنًا
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <div className="d-flex align-items-center justify-content-between mb-3">
      <span className="small">{label}</span>
      <div className="form-check form-switch m-0">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          checked={checked}
          onChange={onChange}
          style={{ width: 40, height: 22, backgroundColor: checked ? "#0D9488" : undefined, borderColor: checked ? "#0D9488" : undefined }}
        />
      </div>
    </div>
  );
}