import React, { useState, useEffect } from "react";
import "../styles/admin-dashboard.css"; 

function AdminLoanRequests({ onRefresh }) {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchPendingLoans = async () => {
    try {
      setLoading(true);
      // 🎯 FIXED: Pointing directly to /api/auth/loans/pending
      const response = await fetch(`${backendUrl}/api/auth/loans/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setLoans(data.data || []);
      }
    } catch (err) {
      console.error("Critical error syncing loan pipelines:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingLoans();
  }, []);

  const handleResolveLoan = async (requestId, action) => {
    const messageConfirm = `Are you certain you want to mark this application as ${action}?`;
    if (!window.confirm(messageConfirm)) return;

    try {
      const response = await fetch(`${backendUrl}/api/auth/loans/${requestId}/resolve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        alert(`Loan application portfolio successfully updated to: ${action}`);
        fetchPendingLoans();
        if (onRefresh) onRefresh();
      } else {
        alert(data.message || "An issue occurred tracking resolution metrics.");
      }
    } catch (err) {
      console.error("Loan resolution pipeline breakage:", err);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-notice">
        Auditing pending application profiles...
      </div>
    );
  }

  return (
    <div className="repayments-view-wrapper">
      <div className="repayments-header">
        <h2>Loan Applications Review Pipeline</h2>
        <p>Examine borrow requests, evaluate intent criteria, and disburse community funding liquidity safely.</p>
      </div>

      <div className="admin-table-card">
        <div className="table-responsive-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Applicant Profile</th>
                <th>Amount Requested</th>
                <th>Stated Capital Purpose / Use Case</th>
                <th className="text-center">Review Decisions</th>
              </tr>
            </thead>
            <tbody>
              {loans.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-table-notice">
                    🎉 No active loan applications currently waiting inside the clearance vault.
                  </td>
                </tr>
              ) : (
                loans.map((loan) => (
                  <tr key={loan.id}>
                    <td>
                      <div className="user-profile-cell">
                        <strong>{loan.username}</strong>
                        <small>Account Reference ID: #{loan.user_id}</small>
                      </div>
                    </td>
                    <td className="loan-amount-highlight">
                      ₦{Number(loan.amount_requested).toLocaleString()}
                    </td>
                    <td>
                      <div className="purpose-context-box">
                        {loan.purpose || "No descriptive contextual layout provided by user."}
                      </div>
                    </td>
                    <td>
                      <div className="action-button-group">
                        <button 
                          onClick={() => handleResolveLoan(loan.id, "approved")} 
                          className="btn-action-disburse"
                        >
                          ✓ Disburse Cash
                        </button>
                        <button 
                          onClick={() => handleResolveLoan(loan.id, "declined")} 
                          className="btn-action-decline"
                        >
                          ✕ Decline File
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminLoanRequests;