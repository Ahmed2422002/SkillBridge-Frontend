

import { useNavigate } from "react-router-dom";
import { BsSearch, BsBell, BsHeart, BsHeartFill, BsStarFill, BsPersonWorkspace, BsPeopleFill } from "react-icons/bs";
import React, { useState } from "react";
import ContactModal from "../components/ContactModal";

const mentors = [
  {
    category: "Front-End Development",
    name: "Master React & Next.js & Vue",
    role: "Senior Front End Engineer",
    rating: 4.9,
    reviews: 128,
    tags: ["React", "JavaScript", "Vue", "Tailwind", "+2"],
    desc: "Learn from a leading front end specialist at a top tech company and build advanced web applications.",
    sessions: 11,
    price: "$120 / session",
    action: "Contact",
    verified: true,
  },
  {
    category: "Back-End Development",
    name: "Building Scalable APIs with Python",
    role: "Lead Back-End Architect",
    rating: 4.9,
    reviews: 19,
    tags: ["Python", "Node.js", "PostgreSQL", "AWS", "Docker", "+2"],
    desc: "Design and engineer robust server-side systems and APIs using modern back-end technologies.",
    sessions: 11,
    price: "$120 / session",
    action: "Contact",
  },
  {
    category: "Full-Stack Development",
    name: "Full-Stack MERN Mastery",
    role: "Full-Stack Engineering Manager",
    rating: 4.9,
    reviews: 38,
    tags: ["MERN", "Prototyping", "Scalability", "System Design", "+2"],
    desc: "Learn an entire web development lifecycle, from front to back.",
    sessions: 11,
    price: "$120 / session",
    action: "Contact",
  },
  {
    category: "Cybersecurity",
    name: "Ethical Hacking and Cloud Security",
    role: "Chief Security Officer",
    rating: 4.9,
    reviews: 57,
    tags: ["Cyber Defense", "Intrusion Detection", "Risk Management", "+2"],
    desc: "Gain a deep understanding of modern cybersecurity practices and defense.",
    sessions: 11,
    price: "$100 / session",
    action: "Contact",
  },
  {
    category: "Mobile Development",
    name: "Native iOS & Android Apps",
    role: "Mobile Team Lead",
    rating: 4.9,
    reviews: 54,
    tags: ["Flutter", "Swift", "Kotlin", "API Integration", "+2"],
    desc: "Learn mobile-first design and deployment strategies.",
    sessions: 11,
    price: "$75 / session",
    action: "Chat Now",
    verified: true,
  },
  {
    category: "UI/UX Development",
    name: "Design-Centered Product Design",
    role: "Senior Product Design",
    rating: 4.9,
    reviews: 54,
    tags: ["Design Systems", "User Research", "Prototyping", "+2"],
    desc: "Gain a deep understanding of modern product design practices and process.",
    sessions: 11,
    price: "$20 / session",
    action: "Contact",
  },
  {
    category: "Data Scientist",
    name: "Applied Machine Learning & Data Analysis",
    role: "Senior Data Scientist",
    rating: 4.9,
    reviews: 42,
    tags: ["Python", "Machine Learning", "Pandas", "SQL", "+2"],
    desc: "Master data analysis, statistical modeling, and machine learning to turn raw data into actionable insights.",
    sessions: 11,
    price: "$90 / session",
    action: "Contact",
  },
];

export default function Mentors() {
  const navigate = useNavigate();
  const [liked, setLiked] = useState({});

    const toggleLike = (id, e) => {
    e.stopPropagation();
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
    };
    const [activeMentor, setActiveMentor] = useState(null);

  return (
    <div className="mentors-page bg-white min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold d-flex align-items-center gap-2" href="/">
            <img src="/homeImg.jpeg" alt="SkillBridgeAI Logo" style={{ width: 32, height: 32, objectFit: "cover", borderRadius: "6px" }} />
            SkillBridgeAI
          </a>

          <div className="d-none d-lg-flex mx-auto gap-4">
            <span role="button" className="text-decoration-none nav-link-custom" onClick={() => navigate("/#features")}>Features</span>
            <span role="button" className="text-decoration-none nav-link-custom fw-bold" style={{ color: "#22D3C5", borderBottom: "2px solid #22D3C5" }}>
              Mentors
            </span>
            <span role="button" className="text-decoration-none nav-link-custom" onClick={() => navigate("/payment")}>Pricing</span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="input-group d-none d-md-flex" style={{ width: 220 }}>
              <span className="input-group-text bg-white border-end-0">
                <BsSearch size={14} />
              </span>
              <input type="text" className="form-control border-start-0" placeholder="e.g., Python, Figma" />
            </div>
            <BsBell size={18} className="text-dark" role="button" />
            <span role="button" className="text-dark text-decoration-none" onClick={() => navigate("/login")}>Log in</span>
            <button className="btn btn-dark rounded-pill px-4" onClick={() => navigate("/signup")}>Sign in</button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="container py-4">
        <div className="row align-items-center g-3">
          <div className="col-lg-7">
            <h2 className="fw-bold mb-1">Mentors</h2>
            <p className="text-muted mb-0">Connect with specialists across our key courses to accelerate your growth.</p>
          </div>
          <div className="col-lg-5">
            <div className="p-3 rounded-4 d-flex align-items-center gap-3" style={{ backgroundColor: "#D6F5F2" }}>
              <div
                className="d-flex align-items-center justify-content-center rounded-circle bg-white"
                style={{ width: 40, height: 40, flexShrink: 0 }}
              >
                <BsPeopleFill style={{ color: "#0D1B2A" }} />
              </div>
              <div>
                <div className="fw-bold small">Find the right mentor for you</div>
                <div className="text-muted small">Connect with experts, a course sessions, and grow your career.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
          <span className="text-muted small">Showing 1–12 of 156 mentors</span>
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted small">Sort by:</span>
            <select className="form-select form-select-sm" style={{ width: 150 }}>
              <option>Most Relevant</option>
              <option>Highest Rated</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Mentor cards grid */}
        <div className="row g-4">
          {mentors.map((m, i) => (
            <div className="col-6 col-lg-3" key={i}>
              <div
                role="button"
                onClick={() => navigate(`/mentors/${i}`)}
                className="p-3 rounded-4 border h-100 d-flex flex-column"
              >
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="badge rounded-pill text-dark small" style={{ backgroundColor: "#D6F5F2" }}>
                    {m.category}
                  </span>
                  {liked[i] ? (
  <BsHeartFill
    role="button"
    onClick={(e) => toggleLike(i, e)}
    style={{ color: "#dc3545", transition: "color 0.15s" }}
  />
) : (
                <BsHeart
                    role="button"
                    onClick={(e) => toggleLike(i, e)}
                    style={{ color: "#adb5bd", transition: "color 0.15s" }}
                />
                )}
                </div>

                <div className="d-flex align-items-center gap-2 mb-2">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: 44, height: 44, backgroundColor: "#0D1B2A", color: "#fff", flexShrink: 0 }}
                  >
                    <BsPersonWorkspace />
                  </div>
                  <div>
                    <div className="fw-bold small lh-sm">{m.name}</div>
                    <div className="text-muted small">{m.role}</div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-1 mb-2 small">
                  <BsStarFill style={{ color: "#f5b301" }} size={12} />
                  <span className="fw-semibold">{m.rating}</span>
                  <span className="text-muted">({m.reviews} reviews)</span>
                </div>

                <div className="d-flex flex-wrap gap-1 mb-2">
                  {m.tags.map((t, ti) => (
                    <span key={ti} className="badge bg-light text-dark border small fw-normal">
                      {t}
                    </span>
                  ))}
                </div>

                <p className="text-muted small flex-grow-1">{m.desc}</p>

                <div className="d-flex justify-content-between align-items-center small text-muted mb-3">
                  <span>👤 {m.sessions} Coaching</span>
                  <span className="fw-bold text-dark">{m.price}</span>
                </div>

                <button
                    className="btn btn-sm w-100 text-white rounded-3"
                    style={{ backgroundColor: "#0D1B2A" }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setActiveMentor(m);
                    }}
                    >
                    {m.action}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <nav className="d-flex justify-content-center mt-5">
          <ul className="pagination">
            <li className="page-item disabled"><span className="page-link">&laquo;</span></li>
            <li className="page-item active"><span className="page-link" style={{ backgroundColor: "#0D1B2A", borderColor: "#0D1B2A" }}>1</span></li>
            <li className="page-item"><span className="page-link" role="button">2</span></li>
            <li className="page-item"><span className="page-link" role="button">3</span></li>
            <li className="page-item disabled"><span className="page-link">...</span></li>
            <li className="page-item"><span className="page-link" role="button">13</span></li>
            <li className="page-item"><span className="page-link" role="button">&raquo;</span></li>
          </ul>
        </nav>
      </div>

      {activeMentor && (
        <ContactModal mentor={activeMentor} onClose={() => setActiveMentor(null)} />
      )}
    </div>
  );
}
