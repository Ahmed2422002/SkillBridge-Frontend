
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import {
  BsShieldCheck,
  BsBriefcase,
  BsGlobe,
  
  BsPeople,
} from "react-icons/bs";

import "./CSS.css"; 
import img from "../img.jpg";   // 

// هذا ملف صفحتك الأولى (Landing Page) — إذا عندك نسخة جاهزة، خذ من هنا بس
// أسلوب ربط أزرار Sign Up / Login بالـ navigate، وخلي الباقي زي ما عندك.

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page bg-white">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold d-flex align-items-center gap-2" href="/">
              <img
            src="/homeImg.jpeg"
            alt="SkillBridgeAI Logo"
            style={{ width: 32, height: 32, objectFit: "cover", borderRadius: "6px" }}
          />
            SkillBridgeAI
          </a>

        <div className="d-none d-lg-flex mx-auto gap-4">
            <a href="#features" className="text-decoration-none nav-link-custom">Features</a>
           
            <a href="#mentors" className="text-decoration-none nav-link-custom" onClick={(e) => { e.preventDefault(); navigate("/mentors"); }}>Mentors</a>
            <a href="#pricing" className="text-decoration-none nav-link-custom" onClick={(e) => { e.preventDefault(); navigate("/payment"); }}>Pricing</a>
        </div>

          <div className="d-flex align-items-center gap-3">
            <span
              role="button"
              className="text-dark text-decoration-none"
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
        </div>
      </nav>

      {/* Hero */}
      <header  className="hero-section"
  style={{
    backgroundImage: `url(${img})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    width: "100%",
    height:"66vh"
  }}>
    <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h1 className="fw-bold display-5 mb-3">
              Bridge Your Skills to Opportunities with AI
            </h1>
            <p className="text-muted mb-4 fs-5">
              AI-driven skill matching and personalized career growth with AI
              and technology.
            </p>
            <div className="d-flex gap-3">
              <button
                className="btn rounded-pill px-4 py-2 text-white"
                style={{ backgroundColor: "#22D3C5" }}
                onClick={() => navigate("/signup")}
              >
                Get Started
              </button>
              <button className="btn btn-outline-dark rounded-pill px-4 py-2">
                Explore Opportunities
              </button>
            </div>
          </div>
        
        </div>
      </div>
      </header>

      {/* Features */}
      <section id="features" className="container py-5">
        <h2 className="fw-bold mb-4">Features</h2>
        <div className="row g-4">
          {[
            { icon: <BsShieldCheck size={22} />, title: "Skill Assessment", desc: "Ensure skill assessment and matching and with skill assessment." },
            { icon: <BsGlobe size={22} />, title: "Personalized Learning", desc: "AI-driven skill matching and personalized your career growth." },
            { icon: <BsBriefcase size={22} />, title: "Job Matching", desc: "Job to ensure job distributors coach job matching." },
            { icon: <BsPeople size={22} />, title: "Mentor Connection", desc: "Mentor with a list of mentor connection in smear connection." },
          ].map((f, i) => (
            <div className="col-6 col-md-3" key={i}>
              <div className="p-4 bg-light rounded-4 h-100">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
                  style={{ width: 44, height: 44, backgroundColor: "#D6F5F2", color: "#0D1B2A" }}
                >
                  {f.icon}
                </div>
                <h6 className="fw-bold">{f.title}</h6>
                <p className="text-muted small mb-0">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trusted by */}
      <section className="bg-light py-5">
        <div className="container text-center">
          <h6 className="text-muted mb-4">Trusted by leading organizations</h6>
          <div className="d-flex flex-wrap justify-content-center gap-5 mb-5 text-muted">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i}>Microsoft</span>
            ))}
          </div>
          <div className="row text-center">
            {[
              ["50K+", "Users"],
              ["10K+", "Opportunities"],
              ["500+", "Mentors"],
              ["95%", "Success Rate"],
            ].map(([num, label], i) => (
              <div className="col-6 col-md-3 mb-4 mb-md-0" key={i}>
                <h3 className="fw-bold">{num}</h3>
                <p className="text-muted mb-0">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-white pt-5 pb-3" style={{ backgroundColor: "#0D1B2A" }}>
  <div className="container">
    <div className="row gy-4">
      <div className="col-6 col-md-3">
        <h6 className="fw-bold mb-3">Product</h6>
        <ul className="list-unstyled small">
          <li><a href="#" className="footer-link-custom">Product</a></li>
          <li><a href="#" className="footer-link-custom">How It Works</a></li>
          <li><a href="#" className="footer-link-custom">Opportunities</a></li>
          <li><a href="#" className="footer-link-custom">Pricing</a></li>
        </ul>
      </div>
      <div className="col-6 col-md-3">
        <h6 className="fw-bold mb-3">Company</h6>
        <ul className="list-unstyled small">
          <li><a href="#" className="footer-link-custom">Company</a></li>
          <li><a href="#" className="footer-link-custom">Careers</a></li>
          <li><a href="#" className="footer-link-custom">Opportunities</a></li>
          <li><a href="#" className="footer-link-custom">Mentors</a></li>
        </ul>
      </div>
      <div className="col-6 col-md-3">
        <h6 className="fw-bold mb-3">Resources</h6>
        <ul className="list-unstyled small">
          <li><a href="#" className="footer-link-custom">Blog</a></li>
          <li><a href="#" className="footer-link-custom">Resources</a></li>
          <li><a href="#" className="footer-link-custom">Mentors</a></li>
          <li><a href="#" className="footer-link-custom">Support</a></li>
        </ul>
      </div>
      <div className="col-6 col-md-3">
        <h6 className="fw-bold mb-3">Support</h6>
        <div className="d-flex gap-3 fs-5">
          <a href="#" className="text-white-50"><FaFacebookF /></a>
          <a href="#" className="text-white-50"><FaTwitter /></a>
          <a href="#" className="text-white-50"><FaInstagram /></a>
          <a href="#" className="text-white-50"><FaLinkedinIn /></a>
        </div>
      </div>
    </div>
    <hr className="border-secondary mt-4" />
    <div className="d-flex justify-content-between small text-white-50">
      <span>© 2026 SkillBridgeAI, Inc.</span>
      <span>All rights reserved</span>
    </div>
  </div>
</footer>
    </div>
  );
}
