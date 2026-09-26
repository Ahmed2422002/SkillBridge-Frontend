import React from "react";
import { useNavigate } from "react-router-dom";
import { BsCheckCircleFill, BsDownload } from "react-icons/bs";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  const invoice = {
    plan: "Professional",
    amount: "$19.99 /month",
    method: "Visa •••• 4242",
    date: new Date().toLocaleString(),
    invoiceNumber: "INV-" + Date.now(),
  };

  const handleDownload = () => {
    const content = `Invoice: ${invoice.invoiceNumber}
Plan: ${invoice.plan}
Amount: ${invoice.amount}
Payment Method: ${invoice.method}
Date: ${invoice.date}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${invoice.invoiceNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="payment-success-page bg-white min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold d-flex align-items-center gap-2" href="/">
            <img src="/homeImg.jpeg" alt="SkillBridgeAI Logo" style={{ width: 32, height: 32, objectFit: "cover", borderRadius: "6px" }} />
            SkillBridgeAI
          </a>
          <div className="d-none d-lg-flex mx-auto gap-4">
            <a href="/#features" className="text-decoration-none nav-link-custom">Features</a>
           
           <a href="/#mentors" className="text-decoration-none nav-link-custom">Mentors</a>
            <span className="text-decoration-none nav-link-custom fw-bold" style={{ color: "#22D3C5" }}>Pricing</span>
          </div>
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-dark rounded-pill px-4" onClick={() => navigate("/signup")}>Sign Up</button>
          </div>
        </div>
      </nav>

      <div className="container py-5 d-flex justify-content-center">
        <div className="p-5 rounded-4 border text-center" style={{ maxWidth: 640, width: "100%" }}>
          <BsCheckCircleFill size={72} className="mb-3" style={{ color: "#22c55e" }} />
          <h3 className="fw-bold">Payment Successful!</h3>
          <p className="text-muted mb-4">Thank you! Your payment has been processed successfully.</p>

          <div className="text-start">
            {[["Plan", invoice.plan], ["Amount", invoice.amount], ["Payment Method", invoice.method], ["Date", invoice.date], ["Invoice Number", invoice.invoiceNumber]].map(([k, v]) => (
              <div className="d-flex justify-content-between py-2 border-bottom" key={k}>
                <span className="text-muted">{k}</span>
                <span className="fw-semibold">{v}</span>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-center gap-3 mt-4">
            <button className="btn text-white rounded-pill px-4" style={{ backgroundColor: "#0D1B2A" }} onClick={() => navigate("/")}>
              Go to Dashboard
            </button>
            <button className="btn btn-outline-dark rounded-pill px-4 d-flex align-items-center gap-2" onClick={handleDownload}>
              <BsDownload /> Download Invoice
            </button>
          </div>
          <p className="text-muted small mt-3 mb-0">A receipt has been sent to your email.</p>
        </div>
      </div>
    </div>
  );
}