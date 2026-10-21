 import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BsDisplay,
  BsHddStack,
  BsHddStackFill,
  BsDiagram3,
  BsPhone,
  BsCodeSlash,
  BsShieldLock,

  BsCheckCircleFill,
} from "react-icons/bs";
import { useOnboarding } from "../context/OnboardingContext";

const careers = [
  { key: "frontend", label: "Frontend Developer", icon: <BsDisplay size={30} /> },
  { key: "backend", label: "Backend Developer", icon: <BsHddStack size={30} /> },
  { key: "fullstack", label: "Full-Stack Developer", icon: <BsHddStackFill size={30} /> },
  { key: "datascientist", label: "Data Scientist", icon: <BsDiagram3 size={30} /> },
  { key: "mobile", label: "Mobile Developer", icon: <BsPhone size={30} /> },
  { key: "uiux", label: "UI/UX Designer", icon: <BsCodeSlash size={30} /> },
  { key: "cybersecurity", label: "Cybersecurity", icon: <BsShieldLock size={30} /> },
  
];

export default function OnboardingStep2() {
  const navigate = useNavigate();
  const totalSteps = 5;
  const currentStep = 2;

 const { career, setCareer } = useOnboarding();
const [selected, setSelected] = useState(career || "fullstack");

  const handleContinue = () => {
  if (!selected) return;
  setCareer(selected);
  navigate("/onboarding/step-3");
};

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 py-4"
      style={{ backgroundColor: "#eef1f4" }}
    >
      <div
        className="bg-white rounded-4 shadow-sm p-4 p-md-5"
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
        <p className="text-muted small text-center mb-4">Step {currentStep} of {totalSteps}</p>

        <h2 className="fw-bold text-center mb-2">What is your career goal?</h2>
        <p className="text-muted text-center mb-4">Choose the career you want to achieve.</p>

        {/* Options grid */}
        <div className="row g-3 mb-4">
          {careers.map((c) => {
            const isSelected = selected === c.key;
            return (
              <div className="col-6 col-md-3" key={c.key}>
                <div
                  role="button"
                  onClick={() => setSelected(c.key)}
                  className="position-relative d-flex flex-column align-items-center justify-content-center text-center p-3 rounded-4 border h-100"
                  style={{
                    borderColor: isSelected ? "#22D3C5" : "#dee2e6",
                    borderWidth: isSelected ? 2 : 1,
                    backgroundColor: isSelected ? "#D6F5F2" : "#fff",
                    color: "#0D1B2A",
                    minHeight: 130,
                  }}
                >
                  {isSelected && (
                    <BsCheckCircleFill
                      className="position-absolute"
                      style={{ top: 8, right: 8, color: "#22D3C5" }}
                    />
                  )}
                  <div style={{ color: "#0D1B2A" }} className="mb-2">
                    {c.icon}
                  </div>
                  <div className="fw-bold small">{c.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          className="btn w-100 text-white fw-semibold rounded-pill py-2"
          style={{ backgroundColor: "#22D3C5", opacity: selected ? 1 : 0.6 }}
          disabled={!selected}
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
}