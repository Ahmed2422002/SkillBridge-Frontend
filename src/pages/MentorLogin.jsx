
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaLinkedin, FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import { FiMail, FiLock } from "react-icons/fi";

// كومبوننت جديد كليًا لواجهة "Welcome Back, Mentor!" (الصورة 5)
// يظهر عند اختيار "Mentor" من شاشة RoleSelect (intent="login")
// المسار: /login/mentor

export default function MentorLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: اربطها بالـ API الخاص بتسجيل دخول المنتور
    console.log("Mentor login:", form);
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
          style={{ maxWidth: "550px", width: "100%" }}
        >
          <div className="text-center mb-4">
            <h2 className="fw-bold">Welcome Back, Mentor!</h2>
            <p className="text-muted">
              Continue inspiring learners and growing your impact.
            </p>
          </div>

          {/* Student Login / Mentor Login Toggle */}
          <div className="bg-light rounded-pill p-1 d-flex mb-4">
            <button
              type="button"
              className="btn flex-fill rounded-pill fw-semibold text-muted"
              onClick={() => navigate("/login/student")}
            >
              Student Login
            </button>
            <button
              type="button"
              className="btn flex-fill rounded-pill fw-semibold bg-white shadow-sm text-dark"
            >
              Mentor Login
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3 position-relative">
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

            <div className="mb-3 position-relative">
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

            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="rememberMeMentor"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="rememberMeMentor">
                  Remember me
                </label>
              </div>
              <span role="button" className="fw-semibold" style={{ color: "#0f8f8a" }}>
                Forgot Password?
              </span>
            </div>

            <button
              type="submit"
              className="btn w-100 text-white rounded-pill py-2 fw-semibold mb-3"
              style={{ backgroundColor: "#22D3C5" }}
            >
              Log In
            </button>
          </form>

          <div className="d-flex align-items-center gap-2 my-3">
            <hr className="flex-grow-1" />
            <span className="text-muted small">or continue with</span>
            <hr className="flex-grow-1" />
          </div>

          <div className="d-flex gap-2 mb-4">
            <button className="btn btn-outline-secondary flex-fill rounded-3 d-flex align-items-center justify-content-center gap-2">
              <FaGoogle color="#DB4437" /> Google
            </button>
            <button className="btn btn-outline-secondary flex-fill rounded-3 d-flex align-items-center justify-content-center gap-2">
              <FaLinkedin color="#0A66C2" /> LinkedIn
            </button>
            <button className="btn btn-outline-secondary flex-fill rounded-3 d-flex align-items-center justify-content-center gap-2">
              <FaGithub /> GitHub
            </button>
          </div>

          <p className="text-center small text-muted mb-2">
            By logging in, you agree to our{" "}
            <span role="button" style={{ color: "#0f8f8a" }}>
              Terms of Service
            </span>{" "}
            and{" "}
            <span role="button" style={{ color: "#0f8f8a" }}>
              Privacy Policy
            </span>
          </p>

          <p className="text-center mb-0">
            Don't have a mentor account?{" "}
            <span
              role="button"
              className="fw-semibold"
              style={{ color: "#0f8f8a" }}
              onClick={() => navigate("/signup/mentor")}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}