import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { BsLock, BsInfoCircle } from "react-icons/bs";

export default function Payment() {
  const navigate = useNavigate();
  const [method, setMethod] = useState("card");

  const methods = [
    { key: "card", label: "Credit / Debit Card" },
    { key: "paypal", label: "PayPal" },
    { key: "applepay", label: "Apple Pay" },
    { key: "googlepay", label: "Google Pay" },
  ];

  const handlePay = (e) => {
    e.preventDefault();
    // TODO: هون بتحط منطق الدفع الحقيقي (API call) قبل التنقل
    navigate("/payment-success");
  };

  return (
    <div className="payment-page bg-white min-vh-100">
      {/* Navbar - نفس اللي بالهوم */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold d-flex align-items-center gap-2" href="/">
            <img src="/homeImg.jpeg" alt="SkillBridgeAI Logo" style={{ width: 32, height: 32, objectFit: "cover", borderRadius: "6px" }} />
            SkillBridgeAI
          </a>
          <div className="d-none d-lg-flex mx-auto gap-4">
            <a href="/#features" className="text-decoration-none nav-link-custom">Features</a>
           
           <a href="/#mentors" className="text-decoration-none nav-link-custom" onClick={(e) => { e.preventDefault(); navigate("/mentors"); }}>Mentors</a>
            <span className="text-decoration-none nav-link-custom fw-bold" style={{ color: "#22D3C5" }}>Pricing</span>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span role="button" className="text-dark text-decoration-none" onClick={() => navigate("/login")}>Login</span>
            <button className="btn btn-dark rounded-pill px-4" onClick={() => navigate("/signup")}>Sign Up</button>
          </div>
        </div>
      </nav>

      {/* Payment content - بدون الـ stepper */}
      <div className="container py-5">
        <h2 className="fw-bold mb-1">Payment Details</h2>
        <p className="text-muted mb-4">Complete your payment securely.</p>

        <div className="row g-4">
          {/* Payment Method */}
          <div className="col-12 col-lg-3">
            <h6 className="fw-bold mb-3">Payment Method</h6>
            {methods.map((m) => (
              <div
                key={m.key}
                role="button"
                onClick={() => setMethod(m.key)}
                className="p-3 mb-3 rounded-3 border"
                style={{
                  borderColor: method === m.key ? "#22D3C5" : "#dee2e6",
                  borderWidth: method === m.key ? 2 : 1,
                }}
              >
                <div className="form-check d-flex align-items-center gap-2 m-0">
                  <input
                    type="radio"
                    className="form-check-input"
                    checked={method === m.key}
                    onChange={() => setMethod(m.key)}
                  />
                  <label className="form-check-label fw-semibold m-0">{m.label}</label>
                </div>
              </div>
            ))}
          </div>

          {/* Card Info */}
          <div className="col-12 col-lg-6">
            <div className="p-4 rounded-4 border h-100">
              <h6 className="fw-bold mb-3">Card Information</h6>
              <form onSubmit={handlePay}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Card Number</label>
                  <input type="text" className="form-control" placeholder="1234 1234 1234 1234" required />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Cardholder Name</label>
                  <input type="text" className="form-control" placeholder="Enter name on card" required />
                </div>
                <div className="row">
                  <div className="col-6 mb-3">
                    <label className="form-label small fw-semibold">Expiry Date</label>
                    <input type="text" className="form-control" placeholder="MM / YY" required />
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label small fw-semibold">CVC</label>
                    <input type="text" className="form-control" placeholder="123" required />
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2 text-muted small mb-4 mt-3">
                  <BsLock /> Secure Payment — your payment information is encrypted and secure.
                </div>

                <div className="d-flex justify-content-between">
                  <button type="button" className="btn btn-outline-dark rounded-pill px-4" onClick={() => navigate("/")}>
                    Back
                  </button>
                  <button type="submit" className="btn text-white rounded-pill px-4" style={{ backgroundColor: "#0D1B2A" }}>
                    Pay $19.99
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-12 col-lg-3">
            <div className="p-4 rounded-4 border">
              <h6 className="fw-bold mb-3">Order Summary</h6>
              {[["Plan", "Professional"], ["Billing", "Monthly"], ["Price", "$19.99"], ["Tax", "$0.00"]].map(([k, v]) => (
                <div className="d-flex justify-content-between mb-2 text-muted small" key={k}>
                  <span>{k}</span><span>{v}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total</span><span>$19.99 /month</span>
              </div>
            </div>
            <div className="p-3 mt-3 rounded-3 bg-light small text-muted">
              You can cancel anytime. No hidden fees.
            </div>
          </div>
        </div>
      </div>

      {/* Footer - نفس فوتر الهوم لو بدك تحطه، اختياري */}
    </div>
  );
}