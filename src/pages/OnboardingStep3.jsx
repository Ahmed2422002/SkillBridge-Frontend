 import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsSearch, BsCursorFill } from "react-icons/bs";
import { useOnboarding } from "../context/OnboardingContext";

const allSkills = [
  "HTML", "CSS", "JavaScript", "React", "Node.js",
  "Python", "Java", "SQL", "Git", "Docker",
  "MongoDB", "Figma", "Ethical Hacking", "Penetration Testing",
  "React Native", "Kotlin", "Machine Learning", "Data Analysis",
];

export default function OnboardingStep3() {
  const navigate = useNavigate();
  const totalSteps = 5;
  const currentStep = 3;

  const [search, setSearch] = useState("");
  const { skills: savedSkills, setSkills } = useOnboarding();
const [selected, setSelected] = useState(savedSkills.length ? savedSkills : []);

  const toggleSkill = (skill) => {
    setSelected((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const filteredSkills = allSkills.filter((s) =>
    s.toLowerCase().includes(search.toLowerCase())
  );

 const handleContinue = () => {
  setSkills(selected);
  navigate("/onboarding/finalizing");
};

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 py-4"
      style={{ backgroundColor: "#eef1f4" }}
    >
      <div
        className="bg-white rounded-4 shadow-sm p-4 p-md-5"
        style={{ maxWidth: 700, width: "100%" }}
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

        <h2 className="fw-bold text-center mb-4">Tell us about your current skills.</h2>

        {/* Search box */}
        <div className="input-group mb-4">
          <span className="input-group-text bg-white">
            <BsSearch className="text-muted" />
          </span>
          <input
            type="text"
            className="form-control py-2"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ borderColor: "#22D3C5" }}
          />
        </div>

        {/* Skills pills */}
        <div className="d-flex flex-wrap gap-2 justify-content-center mb-2">
          {filteredSkills.map((skill) => {
            const isSelected = selected.includes(skill);
            return (
              <span
                key={skill}
                role="button"
                onClick={() => toggleSkill(skill)}
                className="px-3 py-2 rounded-pill fw-semibold"
                style={{
                  border: `1px solid ${isSelected ? "#22D3C5" : "#dee2e6"}`,
                  backgroundColor: isSelected ? "#22D3C5" : "#fff",
                  color: isSelected ? "#fff" : "#212529",
                  transition: "all 0.15s",
                }}
              >
                {skill}
              </span>
            );
          })}
          {filteredSkills.length === 0 && (
            <p className="text-muted small">No skills found.</p>
          )}
        </div>

        <div className="d-flex align-items-center justify-content-center gap-2 text-muted small mb-4">
          <BsCursorFill /> Click on a skill to select it
        </div>

        <button
          className="btn w-100 text-dark fw-semibold rounded-pill py-2"
          style={{ backgroundColor: "#22D3C5", opacity: selected.length ? 1 : 0.6 }}
          disabled={!selected.length}
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
}