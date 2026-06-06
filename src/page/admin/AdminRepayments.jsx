import React, { useState, useEffect } from "react";
import "../styles/admin-dashboard.css"; 

function AdminRepayments({ onRefresh }) {
  const [repayments, setRepayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchPendingRepayments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/auth/loans/repayments/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setRepayments(data.data);
      }
    } catch (err) {
      console.error("Error loading repayment pipelines:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRepayments();
  }, []);

  const handleResolveRepayment = async (repaymentId, action) => {
    const confirmation = window.confirm(`Are you sure you want to change this repayment record status to ${action}?`);
    if (!confirmation) return;

    try {
      const response = await fetch(`${backendUrl}/api/auth/loans/repayments/${repaymentId}/resolve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        alert(`Repayment slip successfully marked as ${action}!`);
        fetchPendingRepayments();
        if (onRefresh) onRefresh();
      } else {
        alert(data.message || "Failed to process decision parameters.");
      }
    } catch (err) {
      console.error("Repayment system resolution transit breakdown:", err);
    }
  };

  if (loading) {
    return <div className="admin-loading-notice">Synchronizing Audit Records...</div>;
  }

  return (
    <div className="repayments-view-wrapper">
      <div className="repayments-header">
        <h2>Loan Settlements Review Pipe</h2>
        <p>Verify bank transfer metadata logs and confirm outstanding user debt cancellations.</p>
      </div>

      <div className="admin-table-card">
        <div className="table-responsive-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Contributor Account</th>
                <th>Settle Target Amount</th>
                <th>Payment Reference Proof Notes</th>
                <th className="text-center">Review Decisions</th>
              </tr>
            </thead>
            <tbody>
              {repayments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-table-notice">
                    🎉 No pending loan repayment submissions waiting for audit clearance.
                  </td>
                </tr>
              ) : (
                repayments.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="user-profile-cell">
                        <strong>{r.username}</strong>
                        <small>UID: #{r.user_id}</small>
                      </div>
                    </td>
                    <td className="repay-amount-highlight">
                      ₦{Number(r.amount_paid).toLocaleString()}
                    </td>
                    <td>
                      <div className="proof-context-box">
                        {r.reference_proof}
                      </div>
                    </td>
                    <td>
                      <div className="action-button-group">
                        <button 
                          onClick={() => handleResolveRepayment(r.id, "approved")} 
                          className="btn-action-clear-debt"
                        >
                          ✓ Clear Debt
                        </button>
                        <button 
                          onClick={() => handleResolveRepayment(r.id, "declined")} 
                          className="btn-action-reject"
                        >
                          ✕ Reject
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

export default AdminRepayments;