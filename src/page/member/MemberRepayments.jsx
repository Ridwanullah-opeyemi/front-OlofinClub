import React, { useState, useEffect } from "react";

function MemberRepayments() {
  const [walletBalance, setWalletBalance] = useState(0); 
  const [loanBalance, setLoanBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [referenceProof, setReferenceProof] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // 🎯 NEW: Popup Modal Notification State
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "", // "success" or "error"
  });
  
  const token = localStorage.getItem("token");
  const cachedUser = JSON.parse(localStorage.getItem("user"));

  // Helper function to trigger our smooth popups
  const triggerPopup = (message, type = "success") => {
    setPopup({ show: true, message, type });
    
    // Auto-hide the message panel after 4 seconds
    setTimeout(() => {
      setPopup({ show: false, message: "", type: "" });
    }, 4000);
  };

  const fetchUserBalances = async () => {
    if (!cachedUser?.id || !token) return;
    try {
      const response = await fetch(`${backendUrl}/api/user/${cachedUser.id}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setWalletBalance(data.data.amount_paid || 0); 
        setLoanBalance(data.data.loan_balance || 0);  
      }
    } catch (err) {
      console.error("Error fetching balance states:", err);
    }
  };

  useEffect(() => {
    fetchUserBalances();
  }, [token]);

  const handlePaymentSubmission = async (e) => {
    e.preventDefault();
    const inputAmount = Number(amount);

    // ❌ CUSTOM POPUP VALIDATIONS
    if (!amount || inputAmount <= 0) {
      return triggerPopup("Transaction Rejected: Please specify a valid payment amount.", "error");
    }
    
    if (inputAmount > loanBalance) {
      return triggerPopup(`Transaction Rejected: Overpayment detected! Max limit is ₦${loanBalance.toLocaleString()}.`, "error");
    }

    if (inputAmount > walletBalance) {
      return triggerPopup(`Transaction Rejected: Insufficient wallet funds! Balance is ₦${walletBalance.toLocaleString()}.`, "error");
    }

    if (!referenceProof.trim()) {
      return triggerPopup("Transaction Rejected: Please provide bank reference proof text.", "error");
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${backendUrl}/api/user/loans/repay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: inputAmount,
          reference_proof: referenceProof
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        triggerPopup("Repayment submission recorded! Waiting for Admin verification audit.", "success");
        setAmount("");
        setReferenceProof("");
        fetchUserBalances(); 
      } else {
        triggerPopup(data.message || "An issue occurred processing this submission.", "error");
      }
    } catch (err) {
      console.error("Transit failure on repayment channel:", err);
      triggerPopup("Network timeout error: Connection to financial vault lost.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="loan-view-wrapper">
      
      {/* 🔔 FLOATING POPOUT MESSAGE BANNER */}
      {popup.show && (
        <div className={`toast-notification ${popup.type}`}>
          <div className="toast-content">
            <span className="toast-icon">{popup.type === "success" ? "✅" : "❌"}</span>
            <p className="toast-text">{popup.message}</p>
          </div>
          <button className="toast-close-btn" onClick={() => setPopup({ ...popup, show: false })}>×</button>
        </div>
      )}

      <div className="loan-header">
        <h2>Loan Clearance Center</h2>
        <p>
          Settle your outstanding capital balances by sending payments via manual bank transfer and log proofs here.
        </p>
      </div>

      {/* Dual Ledger Display Module */}
      <div className="ledger-display-grid">
        <div className="ledger-card wallet-card">
          <span className="ledger-tag">Available Wallet Capital</span>
          <h2>₦{Number(walletBalance).toLocaleString()}</h2>
        </div>
        
        <div className={`ledger-card debt-card ${loanBalance > 0 ? "pending-debt" : "no-debt"}`}>
          <span className="ledger-tag">Outstanding Loan Debt</span>
          <h2>₦{Number(loanBalance).toLocaleString()}</h2>
        </div>
      </div>

      {/* Form Submission Entry */}
      <div className="loan-form-wrapper">
        <form onSubmit={handlePaymentSubmission} className="loan-form">
          <div className="form-input-stack">
            <label className="form-label">Amount Settled (₦)</label>
            <input 
              type="number" 
              placeholder="e.g. 20000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loanBalance === 0}
              className="form-input"
              style={{ color: "#000000" }}
            />
          </div>

          <div className="form-input-stack">
            <label className="form-label">Bank Reference Metadata / Payment Note Slip</label>
            <textarea 
              rows="4"
              placeholder="Provide transaction reference codes, session IDs, or descriptive text details matching your bank transfer receipt..."
              value={referenceProof}
              onChange={(e) => setReferenceProof(e.target.value)}
              disabled={loanBalance === 0}
              className="form-textarea"
              style={{ color: "#000000" }}
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting || loanBalance === 0}
            className="loan-submit-btn"
          >
            {submitting ? "Uploading Proof Slip..." : "Submit Loan Repayment Proof"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default MemberRepayments;