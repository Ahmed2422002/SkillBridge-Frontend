import React from "react";
import {
  BsSearch,
  BsBell,
  BsPencil,
  BsPlusLg,
  BsPeople,
  BsCameraVideo,
 
  BsGlobe,
  BsFileEarmark,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const MENTOR = {
  name: "Layla Al-Mahmoud",
  firstName: "Layla",
  initials: "LH",
  role: "Sr. EduAI Mentor",
  memberSince: "Jan 2023",
  image: "/profile.jpg",
};

export default function MentorProfile() {
  const navigate = useNavigate();

  return (
    <div
      className="min-vh-100"
      style={{
        backgroundColor: "#f5f8fa",
        color: "#212529",
      }}
    >
      {/* ================= NAVBAR ================= */}
      <nav className="navbar navbar-light bg-white py-3 shadow-sm">
        <div className="container-fluid px-4 d-flex align-items-center">

          {/* Logo */}
          <a
            className="navbar-brand fw-bold d-flex align-items-center gap-2 me-4"
            href="/mentor-dashboard"
            onClick={(e) => {
              e.preventDefault();
              navigate("/mentor-dashboard");
            }}
            style={{ textDecoration: "none", color: "#212529" }}

          >
            <span
              className="d-inline-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: 28,
                height: 28,
                backgroundColor: "#22D3C5",
                color: "#fff",
              }}
            >
              ●
            </span>

            SkillBridge

            <span className="text-muted fw-normal ms-2 border-start ps-2">
              EduAI Mentor
            </span>
          </a>

          {/* Search */}
          <div
            className="flex-grow-1 mx-auto"
            style={{ maxWidth: 420 }}
          >
            <div className="position-relative">
              <BsSearch
                className="position-absolute top-50 translate-middle-y ms-3 text-muted"
              />

              <input
                type="text"
                className="form-control rounded-pill ps-5"
                placeholder="Search"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="d-flex align-items-center gap-3 ms-3">

            {/* Notification */}
            <div
              className="position-relative"
              role="button"
              onClick={() =>
                navigate("/mentor-dashboard/notifications")
              }
              style={{ cursor: "pointer" }}
            >
              <BsBell
                className="text-dark"
                size={18}
              />

              <span
                className="position-absolute rounded-circle bg-danger"
                style={{
                  width: 8,
                  height: 8,
                  top: -2,
                  right: -2,
                }}
              />
            </div>

            {/* Profile */}
            <div
              className="rounded-circle d-flex align-items-center justify-content-center fw-semibold text-white"
              style={{
                width: 34,
                height: 34,
                backgroundColor: "#0D9488",
                fontSize: 13,
              }}
            >
              {MENTOR.initials}
            </div>

          </div>
        </div>
      </nav>

      {/* ================= PROFILE ================= */}
      <div
        className="container-fluid px-4 py-4"
        style={{ maxWidth: 1200 }}
      >

        {/* Profile Header */}
        <div
          className="rounded-4 position-relative mb-5"
          style={{
            height: 115,
            background:
              "linear-gradient(135deg, #398F8B 0%, #1C354F 100%)",
          }}
        >

          {/* Profile Image */}
          <div
            className="position-absolute"
            style={{
              left: 20,
              bottom: -55,
              width: 155,
              height: 155,
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 5,
              boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
            }}
          >
            <img
              src={MENTOR.image}
              alt={MENTOR.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 12,
              }}
            />
          </div>

          {/* Name */}
          <div
            className="position-absolute text-white"
            style={{
              left: 195,
              top: 22,
            }}
          >
            <h1
              className="fw-bold mb-1"
              style={{ fontSize: 30 }}
            >
              {MENTOR.name}
            </h1>

            <div
              style={{
                fontSize: 19,
                opacity: 0.9,
              }}
            >
              {MENTOR.role}
            </div>

            <div
              style={{
                fontSize: 14,
                opacity: 0.85,
              }}
            >
              Member since {MENTOR.memberSince}
            </div>
          </div>
        </div>

        {/* Buttons + About Me */}
        <div className="d-flex justify-content-between align-items-center mb-3">

          <div
            className="d-flex gap-2"
            style={{ marginLeft: 175 }}
          >

            <button
              type="button"
              className="btn text-white rounded-3 d-flex align-items-center gap-2 px-3"
              style={{
                backgroundColor: "#285967",
              }}
            >
              <BsPencil />
              Edit Profile
            </button>

            <button
              type="button"
              className="btn text-white rounded-3 d-flex align-items-center gap-2 px-3"
              style={{
                backgroundColor: "#285967",
              }}
            >
              <BsPlusLg />
              Add New Bio
            </button>

          </div>

          <h2
            className="fw-bold mb-0"
            style={{ fontSize: 25 }}
          >
            About Me
          </h2>

        </div>

        {/* ================= CONTENT GRID ================= */}
        <div className="row g-3">

          {/* LEFT COLUMN */}
          <div className="col-12 col-lg-6">

            {/* Mentorship Statistics */}
            <div
              className="bg-white rounded-4 shadow-sm p-4 mb-3"
              style={{ minHeight: 220 }}
            >

              <h3
                className="fw-bold text-end mb-4"
                style={{ fontSize: 23 }}
              >
                Mentorship Statistics
              </h3>

              <p
                className="text-center mb-0"
                style={{
                  fontSize: 19,
                  lineHeight: 1.45,
                }}
              >
                An educational leader in the field of
                educational AI. I work as a mentor at
                SkillBridge to help students develop
                their skills. I have a passion for
                continuous learning and designing
                innovative educational experiences.
              </p>

            </div>

            {/* Specializations */}
            <div
              className="bg-white rounded-4 shadow-sm p-4"
              style={{ minHeight: 195 }}
            >

              <h3
                className="fw-bold text-end mb-4"
                style={{ fontSize: 23 }}
              >
                Specializations
              </h3>

              <p
                className="text-center text-muted mb-3"
                style={{
                  fontSize: 17,
                  lineHeight: 1.5,
                }}
              >
                Your selected Specializations will appear
                here based on your registration choices.
              </p>

              <p
                className="text-end mb-0"
                dir="rtl"
                style={{
                  fontSize: 17,
                  lineHeight: 1.5,
                }}
              >
                سوف تظهر التخصصات المختارة هنا بناءً على
                اختيارات التسجيل الخاصة بك.
              </p>

            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="col-12 col-lg-6">

            {/* Statistics */}
            <div
              className="bg-white rounded-4 shadow-sm p-4 mb-3"
              style={{ minHeight: 140 }}
            >

              <div
                className="d-flex justify-content-end align-items-center gap-2 mb-3"
                style={{ fontSize: 18 }}
              >
                <span>
                  12 : Mentored Students
                </span>

                <span
                  className="d-flex align-items-center justify-content-center rounded-3"
                  style={{
                    width: 38,
                    height: 38,
                    backgroundColor: "#e4eeee",
                    color: "#285967",
                  }}
                >
                  <BsPeople />
                </span>
              </div>

              <div
                className="d-flex justify-content-end align-items-center gap-2"
                style={{ fontSize: 18 }}
              >
                <span>
                  24 : Video Sessions
                </span>

                <span
                  className="d-flex align-items-center justify-content-center rounded-3"
                  style={{
                    width: 38,
                    height: 38,
                    backgroundColor: "#e4eeee",
                    color: "#285967",
                  }}
                >
                  <BsCameraVideo />
                </span>
              </div>

            </div>

            {/* Social Links */}
            <div
              className="bg-white rounded-4 shadow-sm p-4"
              style={{ minHeight: 155 }}
            >

              <h3
                className="fw-bold text-end mb-4"
                style={{ fontSize: 23 }}
              >
                Social Links
              </h3>

              <div className="d-flex flex-column align-items-end gap-2">

                <div className="d-flex align-items-center gap-2">
                  <span>LinkedIn</span>

                  <span
                    className="d-flex align-items-center justify-content-center rounded-2"
                    style={{
                      width: 27,
                      height: 27,
                      backgroundColor: "#0A66C2",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    in
                  </span>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span>Personal Website</span>
                  <BsGlobe size={20} />
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span>Portfolio</span>
                  <BsFileEarmark size={20} />
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}