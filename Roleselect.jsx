
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGraduationCap, FaUserFriends } from "react-icons/fa";

// هذا الكومبوننت يمثل "الصورة 1" - شاشة اختيار الدور
// يُستخدم مرتين في الراوتر:
//   <RoleSelect intent="signup" />  -> رابط /signup
//   <RoleSelect intent="login" />   -> رابط /login
// بناءً على الدور المختار (student / mentor) + intent، نحدد الوجهة بعد الضغط على Continue

export default function RoleSelect({ intent = "signup" }) {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");

  const handleContinue = () => {
    // مثال: intent="signup" + role="mentor" -> /signup/mentor
    //       intent="login"  + role="student" -> /login/student
    navigate(`/${intent}/${role}`);
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
      <div className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <div className="text-center" style={{ maxWidth: 680, width: "100%" }}>
          <h2 className="fw-bold">Create Your Account</h2>
          <p className="text-muted mb-4">
            Start your AI-powered learning journey today
          </p>

          {/* Stepper */}
          <div className="d-flex justify-content-center align-items-center gap-3 mb-5">
            <div className="d-flex align-items-center gap-2">
              <span
                className="rounded-circle d-inline-flex align-items-center justify-content-center text-white fw-bold"
                style={{ width: 28, height: 28, backgroundColor: "#0f8f8a" }}
              >
                1
              </span>
              <span className="fw-semibold">Choose Your Role</span>
            </div>
            <div style={{ width: 60, height: 1, backgroundColor: "#ccc" }} />
            <div className="d-flex align-items-center gap-2 text-muted">
              <span
                className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bold"
                style={{ width: 28, height: 28, backgroundColor: "#e9ecef" }}
              >
                2
              </span>
              <span>Create Account</span>
            </div>
          </div>

          <h4 className="fw-bold mb-1">How would you like to join?</h4>
          <p className="text-muted mb-4">
            Choose the option that best describes you.
          </p>

          {/* Role Cards */}
          <div className="row g-4 justify-content-center mb-4">
            <div className="col-12 col-md-5">
              <div
                role="button"
                onClick={() => setRole("student")}
                className="p-4 rounded-4 border h-100"
                style={{
                  borderColor: role === "student" ? "#0f8f8a" : "#dee2e6",
                  borderWidth: role === "student" ? 2 : 1,
                  backgroundColor: role === "student" ? "#f0fbfa" : "#fff",
                  cursor: "pointer",
                }}
              >
                <div
                  className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{ width: 70, height: 70, backgroundColor: "#e6f7f6" }}
                >
                  <FaGraduationCap size={28} color="#0f8f8a" />
                </div>
                <h5 className="fw-bold">Student</h5>
                <p className="text-muted small">
                  Learn new skills, track your progress, and achieve your
                  goals.
                </p>
                <input
                  type="radio"
                  checked={role === "student"}
                  onChange={() => setRole("student")}
                  className="form-check-input mt-2"
                />
              </div>
            </div>

            <div className="col-12 col-md-5">
              <div
                role="button"
                onClick={() => setRole("mentor")}
                className="p-4 rounded-4 border h-100"
                style={{
                  borderColor: role === "mentor" ? "#0f8f8a" : "#dee2e6",
                  borderWidth: role === "mentor" ? 2 : 1,
                  backgroundColor: role === "mentor" ? "#f0fbfa" : "#fff",
                  cursor: "pointer",
                }}
              >
                <div
                  className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{ width: 70, height: 70, backgroundColor: "#e6f7f6" }}
                >
                  <FaUserFriends size={28} color="#0f8f8a" />
                </div>
                <h5 className="fw-bold">Mentor</h5>
                <p className="text-muted small">
                  Share your knowledge, help others, and grow your impact.
                </p>
                <input
                  type="radio"
                  checked={role === "mentor"}
                  onChange={() => setRole("mentor")}
                  className="form-check-input mt-2"
                />
              </div>
            </div>
          </div>

          <button
            className="btn text-white rounded-pill px-5 py-2 fw-semibold"
            style={{ backgroundColor: "#0f8f8a", minWidth: 300 }}
            onClick={handleContinue}
          >
            Continue
          </button>

          <p className="mt-3">
            Already have an account?{" "}
            <span
              role="button"
              className="fw-semibold"
              style={{ color: "#0f8f8a" }}
              onClick={() => navigate("/login")}
            >
              Log in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}