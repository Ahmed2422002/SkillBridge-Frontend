import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPython, FaJs, FaReact, FaNodeJs, FaDocker, FaHtml5, FaCss3Alt,
} from "react-icons/fa";
import { SiDjango, SiMongodb } from "react-icons/si";
import {
  BsDatabaseFill, BsCloudUploadFill, BsKanbanFill, BsDiagram3Fill, BsCheckCircleFill,
  BsGraphUp, BsTable, BsBarChartFill, BsCalculator, BsClipboardData, BsCpuFill, BsCheckSquareFill,
  BsPhone, BsCodeSlash, BsLaptop, BsGearFill, BsSpeedometer2, BsLockFill, BsBellFill,
  BsPalette2, BsLayoutTextWindow, BsSearch, BsShieldLock, BsHddNetwork, BsBugFill,
  BsPersonBadgeFill, BsMortarboardFill, BsBank2 , BsExclamationTriangleFill,
  BsPcDisplay, BsKeyFill, BsBinoculars,
} from "react-icons/bs";
import { useOnboarding } from "../context/OnboardingContext";

const paths = {
  backend: {
    label: "Back-End Development",
    roadmapTitle: "Your AI Learning Roadmap is Ready!",
    steps: [
      { key: "Python", label: "Python", icon: <FaPython /> },
      { key: "SQL", label: "SQL", icon: <BsDatabaseFill /> },
      { key: "Django", label: "Django/Flask", icon: <SiDjango /> },
      { key: "REST APIs", label: "REST APIs", icon: <BsDiagram3Fill /> },
      { key: "Database Design", label: "Database Design", icon: <BsDatabaseFill />, hours: 35 },
      { key: "Git", label: "Git & GitHub", icon: <BsDiagram3Fill />, hours: 35 },
      { key: "Docker", label: "Docker/K8s", icon: <FaDocker />, hours: 35 },
      { key: "Backend Deployment", label: "Backend Deployment", icon: <BsCloudUploadFill />, hours: 35 },
      { key: "System Design", label: "System Design", icon: <BsKanbanFill />, hours: 25 },
    ],
  },
  frontend: {
    label: "Front-End Development",
    roadmapTitle: "Your AI Learning Roadmap is Ready!",
    steps: [
      { key: "HTML", label: "HTML", icon: <FaHtml5 /> },
      { key: "CSS", label: "CSS", icon: <FaCss3Alt /> },
      { key: "JavaScript", label: "JavaScript", icon: <FaJs />, hours: 20 },
      { key: "React", label: "React", icon: <FaReact />, hours: 35 },
      { key: "Responsive Design", label: "Responsive Design", icon: <BsKanbanFill />, hours: 35 },
      { key: "Git", label: "Git & GitHub", icon: <BsDiagram3Fill />, hours: 35 },
    
    ],
  },
  fullstack: {
    label: "Full-Stack Development",
    roadmapTitle: "Your AI Learning Roadmap is Ready!",
    steps: [
      { key: "HTML", label: "HTML", icon: <FaHtml5 />, hours: 10 },
      { key: "CSS", label: "CSS", icon: <FaCss3Alt />, hours: 10 },
      { key: "JavaScript", label: "JavaScript", icon: <FaJs />, hours: 15 },
      { key: "Git", label: "Git & GitHub", icon: <BsDiagram3Fill />, hours: 20 },
      { key: "React", label: "React", icon: <FaReact />, hours: 30 },
      { key: "Python", label: "Python", icon: <FaPython />, hours: 20 },
      { key: "SQL", label: "SQL & PostgreSQL", icon: <BsDatabaseFill />, hours: 25 },
      { key: "Django", label: "Django", icon: <SiDjango />, hours: 25 },
      { key: "REST APIs", label: "REST APIs", icon: <BsDiagram3Fill />, hours: 25 },
      { key: "Full-Stack Integration", label: "Full-Stack Integration", icon: <BsCloudUploadFill />, hours: 30 },
      { key: "Deployment", label: "Deployment", icon: <BsCloudUploadFill />, hours: 20 },
     
    ],
  },

  // ===== المسارات الأربعة الجديدة =====
  datascientist: {
    label: "Data Science",
    roadmapTitle: "Your Data Science Learning Roadmap is Ready!",
    coreSkills: [
      { label: "SQL/Database Knowledge", icon: <BsDatabaseFill /> },
      { label: "Statistics & Analytics", icon: <BsGraphUp /> },
      { label: "Programming Knowledge (Python)", icon: <FaPython /> },
    ],
    steps: [
      { key: "Python", label: "Programming (Python)", icon: <FaPython />, hours: 20 },
      { key: "Math & Stats", label: "Math & Stats (Probability)", icon: <BsGraphUp />, hours: 25 },
      { key: "Data Analysis", label: "Data Manipulation (Pandas)", icon: <BsTable />, hours: 20 },
      { key: "Data Visualization", label: "Data Visualization (Matplotlib/Seaborn)", icon: <BsBarChartFill />, hours: 20 },
      { key: "Linear Algebra", label: "Linear Algebra", icon: <BsCalculator />, hours: 20 },
      { key: "SQL", label: "SQL & Database", icon: <BsDatabaseFill />, hours: 25 },
      { key: "Statistical Inference", label: "Statistical Inference", icon: <BsClipboardData />, hours: 20 },
      { key: "Machine Learning", label: "Machine Learning ", icon: <BsCpuFill />, hours: 15 },
      { key: "Deep Learning", label: "Deep Learning Basics", icon: <BsDiagram3Fill />, hours: 30 },
     
    ],
  },

  mobile: {
    label: "Mobile App Development",
    roadmapTitle: "Your Mobile App Development Learning Roadmap is Ready!",
    coreSkills: [
      { label: "Swift/Kotlin", icon: <BsPhone /> },
      { label: "Mobile UI", icon: <BsLayoutTextWindow /> },
      { label: "Cross-Platform", icon: <BsDiagram3Fill /> },
    ],
    steps: [
      { key: "Setup & Environment", label: "Setup & Environment", icon: <BsLaptop />, hours: 15 },
      { key: "Programming Basics", label: "Programming Basics", icon: <BsCodeSlash />, hours: 25 },
      { key: "Basic UI", label: "Basic UI", icon: <BsPhone />, hours: 20 },
      { key: "Data Storage", label: "Data Storage", icon: <BsDatabaseFill />, hours: 20 },
      { key: "API Integration", label: "API Integration", icon: <BsCloudUploadFill />, hours: 20 },
      { key: "State Management", label: "State Management", icon: <BsDiagram3Fill />, hours: 25 },
      { key: "React Native", label: "Native Features", icon: <BsGearFill />, hours: 20 },
      { key: "Unit Testing", label: "Unit Testing", icon: <BsCheckSquareFill />, hours: 15 },
      { key: "Performance Optimization", label: "Performance Opt.", icon: <BsSpeedometer2 />, hours: 20 },
      { key: "Security Basics", label: "Security Basics", icon: <BsLockFill />, hours: 20 },
      { key: "Advanced Features", label: "Advanced Features (e.g., Push notifications)", icon: <BsBellFill />, hours: 30 },
      { key: "Deployment", label: "Deployment", icon: <BsCloudUploadFill />, hours: 35 },
    ],
  },

  uiux: {
    label: "UI/UX Design",
    roadmapTitle: "Your UI/UX Design Learning Roadmap is Ready!",
    coreSkills: [
      { label: "Design Thinking", icon: <BsPalette2 /> },
      { label: "Wireframing", icon: <BsLayoutTextWindow /> },
      { label: "UI/UX Research", icon: <BsSearch /> },
    ],
    steps: [
      { key: "User Research", label: "User Research", icon: <BsSearch />, hours: 20 },
      { key: "Information Architecture", label: "Information Architecture", icon: <BsKanbanFill />, hours: 30 },
      { key: "Wireframing", label: "Wireframing", icon: <BsLayoutTextWindow />, hours: 25 },
      { key: "UI Fundamentals", label: "UI Fundamentals", icon: <BsPalette2 />, hours: 20 },
      { key: "Figma", label: "Design Systems", icon: <BsKanbanFill />, hours: 20 },
      { key: "Prototyping", label: "Prototyping", icon: <BsLayoutTextWindow />, hours: 20 },
      { key: "Usability Testing", label: "Usability Testing", icon: <BsCheckSquareFill />, hours: 15 },
      { key: "Visual Design", label: "Visual Design", icon: <BsPalette2 />, hours: 15 },
      { key: "Interaction Design", label: "Interaction Design", icon: <BsGearFill />, hours: 20 },
      { key: "Motion Design", label: "Motion Design", icon: <BsDiagram3Fill />, hours: 25 },
      { key: "Accessible Design", label: "Accessible Design", icon: <BsPersonBadgeFill />, hours: 35 },
      { key: "Design Capstone", label: "Design Capstone", icon: <BsMortarboardFill />, hours: 40 },
    ],
  },

  cybersecurity: {
    label: "Cyber Security Fundamentals",
    roadmapTitle: "Your Cyber Security Learning Roadmap is Ready!",
    coreSkills: [
      { label: "Security Foundations", icon: <BsShieldLock /> },
      { label: "Network Security", icon: <BsHddNetwork /> },
      { label: "Threat Analysis", icon: <BsBinoculars /> },
    ],
    steps: [
      { key: "Ethical Hacking", label: "Ethical Hacking", icon: <BsShieldLock />, hours: 15 },
      { key: "Cyber Law", label: "Cyber Law", icon: <BsBank2 />, hours: 30 },
      { key: "Risk Management", label: "Risk Management", icon: <BsExclamationTriangleFill />, hours: 25 },
      { key: "System Security", label: "System Security", icon: <BsShieldLock />, hours: 20 },
      { key: "OS Hardening", label: "OS Hardening", icon: <BsPcDisplay />, hours: 20 },
      { key: "IAM", label: "IAM", icon: <BsKeyFill />, hours: 20 },
      { key: "Network Forensics", label: "Network Forensics", icon: <BsBinoculars />, hours: 15 },
      { key: "Incident Response", label: "Incident Response", icon: <BsBellFill />, hours: 15 },
      { key: "Cloud Security", label: "Cloud Security", icon: <BsCloudUploadFill />, hours: 20 },
      { key: "Penetration Testing", label: "Malware Analysis", icon: <BsBugFill />, hours: 25 },
      { key: "Red Teaming", label: "Red Teaming", icon: <BsPersonBadgeFill />, hours: 35 },
      { key: "Security Capstone", label: "Security Capstone", icon: <BsMortarboardFill />, hours: 40 },
    ],
  },
};

const skillIcons = {
  html: <FaHtml5 />,
  css: <FaCss3Alt />,
  javascript: <FaJs />,
  react: <FaReact />,
  "node.js": <FaNodeJs />,
  python: <FaPython />,
  sql: <BsDatabaseFill />,
  git: <BsDiagram3Fill />,
  docker: <FaDocker />,
  mongodb: <SiMongodb />,
  java: <BsCodeSlash />,
  figma: <BsPalette2 />,
  "ethical hacking": <BsShieldLock />,
  "penetration testing": <BsBugFill />,
  "react native": <BsPhone />,
  kotlin: <BsPhone />,
  "machine learning": <BsCpuFill />,
  "data analysis": <BsTable />,
};

export default function OnboardingRoadmap() {
  const navigate = useNavigate();
  const { career, skills } = useOnboarding();

  const path = paths[career] || paths.frontend;

  const stepsWithStatus = path.steps.map((s) => ({
    ...s,
    done: skills.some((sk) => sk.toLowerCase() === s.key.toLowerCase()),
  }));

  const doneCount = stepsWithStatus.filter((s) => s.done).length;
  const firstNotDoneIndex = stepsWithStatus.findIndex((s) => !s.done);
  const progressPercent = Math.round((doneCount / stepsWithStatus.length) * 100);

  const detectedSkills = skills.filter((sk) => skillIcons[sk.toLowerCase()]);

 
  const roadmapTitle = path.roadmapTitle || "Your AI Learning Roadmap is Ready!";

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 py-4" style={{ backgroundColor: "#eef1f4" }}>
      <div className="bg-white rounded-4 shadow-sm p-4 p-md-5" style={{ maxWidth: 950, width: "100%" }}>
        <div className="d-flex align-items-center gap-2 mb-2">
          <span className="fw-bold" style={{ color: "#0D1B2A" }}>SkillBridge AI</span>
        </div>
        <div className="d-flex gap-2 mb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-grow-1 rounded-pill" style={{ height: 6, backgroundColor: "#22D3C5" }} />
          ))}
        </div>
        <p className="text-muted small text-center mb-4">Step 6 of 6 (Complete)</p>

        <h3 className="fw-bold text-center mb-4">🎉 {roadmapTitle}</h3>

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <div className="border rounded-4 p-3 h-100">
              <div className="text-muted small mb-1">Recommended Path</div>
              <div className="fw-bold mb-2">{path.label}</div>
              <div className="progress" style={{ height: 6 }}>
                <div className="progress-bar" style={{ width: `${progressPercent}%`, backgroundColor: "#22D3C5" }} />
              </div>
              <div className="text-muted small mt-1">{progressPercent}%</div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="border rounded-4 p-3 h-100">
              <div className="text-muted small mb-2">Core Skills Detected</div>
              <div className="d-flex gap-4 flex-wrap">
                            {detectedSkills.length ? (
                    detectedSkills.map((sk) => (
                    <div key={sk} className="text-center">
                        <div style={{ fontSize: 22 }}>{skillIcons[sk.toLowerCase()]}</div>
                        <div className="small text-muted">{sk}</div>
                    </div>
                    ))
                ) : (
                    <span className="text-muted small">No prior skills detected yet.</span>
                )}
                </div>
            </div>
          </div>
        </div>

        <div className="border rounded-4 p-3 mb-4">
          <h6 className="fw-bold mb-3">Roadmap Preview</h6>
          <div className="row g-2">
            {stepsWithStatus.map((s, i) => {
              const isCurrent = i === firstNotDoneIndex;
              const isLocked = firstNotDoneIndex !== -1 && i > firstNotDoneIndex;
              return (
                <div className="col-6 col-md-3" key={s.key + i}>
                  <div
                    className="d-flex flex-column align-items-center text-center p-3 rounded-3 h-100"
                    style={{
                      backgroundColor: s.done ? "#D6F5F2" : isCurrent ? "#FFF6D9" : "#f1f3f5",
                      color: isLocked ? "#adb5bd" : "#0D1B2A",
                    }}
                  >
                    <div className="d-flex align-items-center gap-1 mb-1" style={{ fontSize: 20 }}>
                      {s.icon}
                      {s.done && <BsCheckCircleFill style={{ color: "#22c55e" }} size={14} />}
                    </div>
                    <div className="fw-semibold small">
                      {i + 1}. {s.label}
                    </div>
                    {s.hours && <div className="text-muted small">+{s.hours} hrs</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          className="btn w-100 text-white fw-semibold rounded-pill py-2"
          style={{ backgroundColor: "#0D1B2A" }}
         onClick={() => navigate(`/learning/${career}`)}
        >
          Start Learning
        </button>
      </div>
    </div>
  );
}