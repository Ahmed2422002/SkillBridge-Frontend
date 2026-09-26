
import React from "react";
import { useNavigate } from "react-router-dom";


export default function OnboardingWelcome() {
  const navigate = useNavigate();
  const totalSteps = 5;
  const currentStep = 1;

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 py-4"
      style={{ backgroundColor: "#eef1f4" }}
    >
      <div
        className="bg-white rounded-4 shadow-sm p-4 p-md-5 text-center"
        style={{ maxWidth: 520, width: "100%" }}
      >
        {/* Progress bar */}
        <div className="d-flex gap-2 mb-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className="flex-grow-1 rounded-pill"
              style={{ height: 6, backgroundColor: i < currentStep ? "#0D1B2A" : "#e9ecef" }}
            />
          ))}
        </div>
        <p className="text-muted small mb-4">Step {currentStep} of {totalSteps}</p>

        <h2 className="fw-bold mb-2">Welcome to SkillBridge AI</h2>
        <p className="text-muted mb-4">Let's build your personalized AI learning journey.</p>

        {/* Illustration */}
              <div className="d-flex align-items-center justify-content-center my-4" style={{ height: 190 }}>
          <img
            src="./img.jpeg"
            alt="AI Learning Illustration"
            style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
          />
        </div>

        <p className="text-muted mb-4">
          We'll ask a few quick questions to understand your goals and generate a personalized AI learning roadmap.
        </p>

        <button
          className="btn w-100 text-dark fw-semibold rounded-pill py-2 mb-3"
          style={{ backgroundColor: "#22D3C5" }}
          onClick={() => navigate("/onboarding/step-2")}
        >
          Get Started
        </button>

        <p className="text-muted small mb-0">
          Already have an account?{" "}
          <span
            role="button"
            className="fw-semibold"
            style={{ color: "#0f8f8a" }}
            onClick={() => navigate("/login/student")}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
