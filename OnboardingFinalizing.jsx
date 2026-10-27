 import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const loadingSteps = [
  "Analyzing your current skills...",
  "Matching your career goal...",
  "Building your personalized roadmap...",
  "Finding recommended courses...",
  "Preparing mentor recommendations...",
];

export default function OnboardingFinalizing() {
  const navigate = useNavigate();
  const totalSteps = 5;
  const currentStep = 5;

  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    if (visibleCount < loadingSteps.length) {
      const timer = setTimeout(() => setVisibleCount((c) => c + 1), 900);
      return () => clearTimeout(timer);
    } else {
      // TODO: بدّل هاد المسار لصفحة النتيجة النهائية (Dashboard / Roadmap)
     const timer = setTimeout(() => navigate("/onboarding/roadmap"), 1200);
      return () => clearTimeout(timer);
    }
  }, [visibleCount, navigate]);

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 py-4"
      style={{ backgroundColor: "#eef1f4" }}
    >
      <div
        className="bg-white rounded-4 shadow-sm p-4 p-md-5 text-center"
        style={{ maxWidth: 620, width: "100%" }}
      >
        {/* Progress bar */}
        <div className="d-flex gap-2 mb-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className="flex-grow-1 rounded-pill"
              style={{ height: 6, backgroundColor: i < currentStep ? "#22D3C5" : "#e9ecef" }}
            />
          ))}
        </div>
        <p className="text-muted small mb-4">Step {currentStep} of {totalSteps}</p>

        <h2 className="fw-bold mb-4">Creating Your Personalized Learning Roadmap</h2>

        {/* Spinner */}
        <div className="d-flex justify-content-center mb-4">
          <div
            className="spinner-border"
            style={{ color: "#22D3C5", width: 48, height: 48 }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>

        {/* Loading steps text */}
        <div>
          {loadingSteps.slice(0, visibleCount).map((step, i) => (
            <p
              key={i}
              className="mb-2"
              style={{
                color: i === visibleCount - 1 ? "#0D1B2A" : "#adb5bd",
                fontWeight: i === visibleCount - 1 ? 600 : 400,
                transition: "color 0.3s",
              }}
            >
              {step}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}