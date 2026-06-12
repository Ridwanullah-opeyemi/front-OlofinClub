import React, { useState, useEffect } from "react";
import "../styles/admin-dashboard.css";

function AdminLoanRequests({ onRefresh, triggerPopup, notify, confirm }) {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔒 Tracks which loan IDs are currently being processed.
  // Using a Set so multiple rows can be independently locked
  // without blocking each other.
  const [processingIds, setProcessingIds] = useState(new Set());

  const token = localStorage.getItem("token");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchPendingLoans = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/auth/loans/pending`, {
        headers: { Authorization: `Bearer ${token}` },
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
    // 🔒 Guard: if this row is already being processed, do nothing
    if (processingIds.has(requestId)) return;

    const confirmed = await confirm(
      `Are you certain you want to mark this application as ${action}?`,
      {
        confirmLabel: action === "approved" ? "Yes, Disburse" : "Yes, Decline",
        cancelLabel: "Cancel",
        type: action === "approved" ? "success" : "warning",
      }
    );
    if (!confirmed) return;

    // 🔒 Lock this row the moment admin confirms
    setProcessingIds((prev) => new Set(prev).add(requestId));

    try {
      const response = await fetch(`${backendUrl}/api/auth/loans/${requestId}/resolve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        triggerPopup(
          `Loan application successfully updated to: ${action}`,
          "success"
        );
        // Remove row immediately — no need to unlock since row is gone
        setLoans((prev) => prev.filter((l) => l.id !== requestId));
        if (onRefresh) onRefresh();
      } else {
        triggerPopup(
          data.message || "An issue occurred tracking resolution metrics.",
          "error"
        );
        // 🔓 Unlock on failure so admin can retry
        setProcessingIds((prev) => {
          const next = new Set(prev);
          next.delete(requestId);
          return next;
        });
      }
    } catch (err) {
      console.error("Loan resolution pipeline breakage:", err);
      triggerPopup("Network error during loan resolution.", "error");
      // 🔓 Unlock on network error
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(requestId);
        return next;
      });
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
        <p>
          Examine borrow requests, evaluate intent criteria, and disburse
          community funding liquidity safely.
        </p>
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
                loans.map((loan) => {
                  const isProcessing = processingIds.has(loan.id);
                  return (
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
                            disabled={isProcessing}
                            style={isProcessing ? { opacity: 0.55, cursor: "not-allowed" } : {}}
                          >
                            {isProcessing ? "⏳ Processing..." : "✓ Disburse Cash"}
                          </button>
                          <button
                            onClick={() => handleResolveLoan(loan.id, "declined")}
                            className="btn-action-decline"
                            disabled={isProcessing}
                            style={isProcessing ? { opacity: 0.55, cursor: "not-allowed" } : {}}
                          >
                            {isProcessing ? "⏳ Processing..." : "✕ Decline File"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminLoanRequests;
