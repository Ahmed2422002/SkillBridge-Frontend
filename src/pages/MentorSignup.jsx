import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiUser, FiMail, FiLock, FiBriefcase, FiGlobe, FiClock } from "react-icons/fi";
import { BsMortarboard, BsFileText } from "react-icons/bs";

// كومبوننت جديد كليًا لواجهة "Create Mentor Account" (الصورة 3)
// يظهر عند اختيار "Mentor" من شاشة RoleSelect (intent="signup")
// المسار: /signup/mentor

export default function MentorSignup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [bio, setBio] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    title: "",
    expertise: "",
    country: "",
    timezone: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: اربطها بالـ API الخاص بإنشاء حساب المنتور
    console.log("Mentor sign up:", { ...form, bio });
    navigate("/mentor-dashboard");
  };

  return (
    <div className="auth-page d-flex flex-column min-vh-100 bg-white">
      {/* Navbar */}
      <nav className="navbar navbar-light bg-white py-3">
        <div className="container d-flex justify-content-end align-items-center gap-3">
          <span
            role="button"
            className="text-dark text-decoration-none fw-medium"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
          <button
            className="btn btn-dark rounded-pill px-4"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-grow-1 d-flex align-items-center justify-content-center py-4">
        <div
          className="card border-0 shadow-sm rounded-4 p-4 p-md-5"
          style={{ maxWidth: "650px", width: "100%" }}
        >
          <div className="text-center mb-4">
            <h2 className="fw-bold">Create Mentor Account</h2>
            <p className="text-muted">
              Build your profile and start inspiring learners.
            </p>
          </div>

          {/* Stepper */}
          <div className="d-flex justify-content-center align-items-center gap-3 mb-4">
            <div className="d-flex align-items-center gap-2">
              <span
                className="rounded-circle d-inline-flex align-items-center justify-content-center text-white fw-bold"
                style={{ width: 26, height: 26, backgroundColor: "#0f8f8a" }}
              >
                ✓
              </span>
              <span className="text-muted">Choose Your Role</span>
            </div>
            <div style={{ width: 50, height: 1, backgroundColor: "#ccc" }} />
            <div className="d-flex align-items-center gap-2">
              <span
                className="rounded-circle d-inline-flex align-items-center justify-content-center text-white fw-bold"
                style={{ width: 26, height: 26, backgroundColor: "#0f8f8a" }}
              >
                2
              </span>
              <span className="fw-semibold">Create Account</span>
            </div>
          </div>

          <h5 className="fw-bold text-center mb-1">Tell us about yourself</h5>
          <p className="text-muted text-center mb-4">
            Fill in your details to create your mentor account.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-3">
              <div className="col-md-6 position-relative">
                <span className="position-absolute top-50 translate-middle-y ms-3 text-muted">
                  <FiUser />
                </span>
                <input
                  type="text"
                  name="fullName"
                  className="form-control rounded-3 ps-5 py-2"
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 position-relative">
                <span className="position-absolute top-50 translate-middle-y ms-3 text-muted">
                  <FiMail />
                </span>
                <input
                  type="email"
                  name="email"
                  className="form-control rounded-3 ps-5 py-2"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6 position-relative">
                <span className="position-absolute top-50 translate-middle-y ms-3 text-muted">
                  <FiLock />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-control rounded-3 ps-5 pe-5 py-2"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <span
                  role="button"
                  className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div className="col-md-6 position-relative">
                <span className="position-absolute top-50 translate-middle-y ms-3 text-muted">
                  <FiLock />
                </span>
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  className="form-control rounded-3 ps-5 pe-5 py-2"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <span
                  role="button"
                  className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="mb-3 position-relative">
              <span className="position-absolute top-0 translate-middle-y ms-3 mt-4 text-muted">
                <FiBriefcase />
              </span>
              <input
                type="text"
                name="title"
                className="form-control rounded-3 ps-5 py-2"
                placeholder="Professional Title (e.g. Senior Frontend Developer)"
                value={form.title}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3 position-relative">
              <span className="position-absolute top-50 translate-middle-y ms-3 text-muted">
                <BsMortarboard />
              </span>
              <select
                name="expertise"
                className="form-select rounded-3 ps-5 py-2"
                value={form.expertise}
                onChange={handleChange}
              >
                <option value="">Expertise / Skills - Select your main expertise area</option>
                <option value="frontend">Frontend Development</option>
                <option value="backend">Backend Development</option>
                <option value="design">UI/UX Design</option>
                <option value="data">Data Science</option>
                <option value="product">Product Management</option>
              </select>
            </div>

            <div className="mb-3 position-relative">
              <span className="position-absolute ms-3 mt-2 text-muted">
                <BsFileText />
              </span>
              <textarea
                className="form-control rounded-3 ps-5 py-2"
                placeholder="Short Bio - Briefly introduce yourself and your experience"
                rows={3}
                maxLength={300}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <div className="text-end small text-muted">{bio.length} / 300</div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6 position-relative">
                <span className="position-absolute top-50 translate-middle-y ms-3 text-muted">
                  <FiGlobe />
                </span>
                <select
                  name="country"
                  className="form-select rounded-3 ps-5 py-2"
                  value={form.country}
                  onChange={handleChange}
                >
                  <option value="">Country</option>
                  <option value="ps">Palestine</option>
                  <option value="jo">Jordan</option>
                  <option value="eg">Egypt</option>
                  <option value="sa">Saudi Arabia</option>
                </select>
              </div>
              <div className="col-md-6 position-relative">
                <span className="position-absolute top-50 translate-middle-y ms-3 text-muted">
                  <FiClock />
                </span>
                <select
                  name="timezone"
                  className="form-select rounded-3 ps-5 py-2"
                  value={form.timezone}
                  onChange={handleChange}
                >
                  <option value="">Time Zone</option>
                  <option value="gmt+2">GMT+2</option>
                  <option value="gmt+3">GMT+3</option>
                  <option value="gmt+4">GMT+4</option>
                </select>
              </div>
            </div>

            <div className="form-check mb-4">
              <input
                type="checkbox"
                className="form-check-input"
                id="agreeTerms"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                required
              />
              <label className="form-check-label" htmlFor="agreeTerms">
                I agree to the{" "}
                <span style={{ color: "#0f8f8a" }}>Terms of Service</span> and{" "}
                <span style={{ color: "#0f8f8a" }}>Privacy Policy</span>
              </label>
            </div>

            <button
              type="submit"
              className="btn w-100 text-white rounded-pill py-2 fw-semibold mb-3"
              style={{ backgroundColor: "#0f8f8a" }}
            >
              Create Mentor Account
            </button>
          </form>

          <p className="text-center mb-0">
            Already have an account?{" "}
            <span
              role="button"
              className="fw-semibold"
              style={{ color: "#0f8f8a" }}
              onClick={() => navigate("/login/mentor")}
            >
              Log in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}