import React, { useState } from "react";
import "./loan-hub.css";

function LoanHub({ userProfile, onRefresh, triggerPopup }) {
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem("token");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleLoanSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`${backendUrl}/api/user/loans/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount, purpose }),
      });

      const data = await response.json();
      if (response.ok) {
        triggerPopup("Your loan application has been queued for admin review!", "success");
        setAmount("");
        setPurpose("");
        if (onRefresh) onRefresh();
      } else {
        triggerPopup(data.message || "Failed to file application.", "error");
      }
    } catch (err) {
      console.error(err);
      triggerPopup("Network error — could not submit loan request.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="loan-hub-container">
      {/* Dual Ledger Display */}
      <div className="ledger-display-grid">
        <div className="ledger-card wallet-card">
          <span className="ledger-tag">Main Wallet Balance</span>
          <h2>₦{(userProfile?.amount_paid || 0).toLocaleString()}</h2>
        </div>
        <div className="ledger-card debt-card">
          <span className="ledger-tag">Active Loan Liabilities</span>
          <h2>₦{(userProfile?.loan_balance || 0).toLocaleString()}</h2>
        </div>
      </div>

      {/* Loan Application Form */}
      <div className="loan-form-wrapper">
        <h3>Apply for a WealthBridge Capital Loan</h3>
        <form onSubmit={handleLoanSubmit} className="loan-form">
          <div className="form-input-stack">
            <label>Amount Target (₦)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 50000"
              required
            />
          </div>
          <div className="form-input-stack">
            <label>Purpose of Loan Facility</label>
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Explain briefly why you need this advancement..."
              required
            />
          </div>
          <button type="submit" disabled={submitting} className="loan-submit-btn">
            {submitting ? "Processing Request..." : "Submit Loan Request"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoanHub;
