import React, { useState, useEffect } from "react";
import "../styles/admin-dashboard.css";

function AdminLoanRequests({
  onRefresh,
  triggerPopup,
  notify,
  confirm,
}) {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Track which loan is currently being processed
  const [processingId, setProcessingId] = useState(null);

  const token = localStorage.getItem("token");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchPendingLoans = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${backendUrl}/api/auth/loans/pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setLoans(data.data || []);
      } else {
        triggerPopup?.(
          data.message || "Failed to load pending loans.",
          "error"
        );
      }
    } catch (err) {
      console.error("Loan fetch error:", err);
      triggerPopup?.(
        "Unable to retrieve pending loan requests.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingLoans();
  }, []);

  const handleResolveLoan = async (requestId, action) => {
    if (processingId) return;

    const confirmed = await confirm(
      `Are you certain you want to ${action} this loan request?`,
      {
        confirmLabel:
          action === "approved"
            ? "Approve Loan"
            : "Decline Loan",
        cancelLabel: "Cancel",
        type:
          action === "approved"
            ? "success"
            : "warning",
      }
    );

    if (!confirmed) return;

    try {
      setProcessingId(requestId);

      const response = await fetch(
        `${backendUrl}/api/auth/loans/${requestId}/resolve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        triggerPopup(
          action === "approved"
            ? "Loan approved successfully."
            : "Loan request declined.",
          "success"
        );

        // Remove processed loan immediately
        setLoans((prev) =>
          prev.filter((loan) => loan.id !== requestId)
        );

        if (onRefresh) {
          onRefresh();
        }
      } else {
        triggerPopup(
          data.message || "Failed to process loan request.",
          "error"
        );
      }
    } catch (err) {
      console.error("Loan approval error:", err);

      triggerPopup(
        "Network error while processing request.",
        "error"
      );
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-notice">
        Auditing pending loan applications...
      </div>
    );
  }

  return (
    <div className="repayments-view-wrapper">
      <div className="repayments-header">
        <h2>Loan Applications Review Pipeline</h2>
        <p>
          Review member loan requests and make approval
          decisions securely.
        </p>
      </div>

      <div className="admin-table-card">
        <div className="table-responsive-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Amount Requested</th>
                <th>Purpose</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loans.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="empty-table-notice"
                  >
                    🎉 No pending loan requests available.
                  </td>
                </tr>
              ) : (
                loans.map((loan) => (
                  <tr key={loan.id}>
                    <td>
                      <div className="user-profile-cell">
                        <strong>{loan.username}</strong>
                        <small>
                          Member ID #{loan.user_id}
                        </small>
                      </div>
                    </td>

                    <td className="loan-amount-highlight">
                      ₦
                      {Number(
                        loan.amount_requested
                      ).toLocaleString()}
                    </td>

                    <td>
                      <div className="purpose-context-box">
                        {loan.purpose ||
                          "No purpose provided."}
                      </div>
                    </td>

                    <td>
                      <div className="action-button-group">
                        <button
                          className="btn-action-disburse"
                          disabled={
                            processingId === loan.id
                          }
                          onClick={() =>
                            handleResolveLoan(
                              loan.id,
                              "approved"
                            )
                          }
                        >
                          {processingId === loan.id
                            ? "⏳ Processing..."
                            : "✓ Approve"}
                        </button>

                        <button
                          className="btn-action-decline"
                          disabled={
                            processingId === loan.id
                          }
                          onClick={() =>
                            handleResolveLoan(
                              loan.id,
                              "declined"
                            )
                          }
                        >
                          {processingId === loan.id
                            ? "⏳ Processing..."
                            : "✕ Decline"}
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