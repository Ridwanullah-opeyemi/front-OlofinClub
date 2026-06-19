import React, { useState, useEffect } from "react";
import "../styles/admin-dashboard.css";

function AdminLoanRequests({ onRefresh, triggerPopup, notify, confirm }) {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [processingIds, setProcessingIds] = useState(new Set());

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
      }
    } catch (err) {
      console.error("Error loading loan requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingLoans();
  }, []);

  const handleResolveLoan = async (requestId, action) => {
    if (processingIds.has(requestId)) return;

    const confirmed = await confirm(
      action === "approved"
        ? "Are you sure you want to approve this loan request?"
        : "Are you sure you want to decline this loan request?",
      {
        confirmLabel:
          action === "approved"
            ? "Approve Loan"
            : "Decline Request",
        cancelLabel: "Cancel",
        type:
          action === "approved"
            ? "success"
            : "warning",
      }
    );

    if (!confirmed) return;

    setProcessingIds((prev) => new Set(prev).add(requestId));

    try {
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

        setLoans((prev) =>
          prev.filter((loan) => loan.id !== requestId)
        );

        if (onRefresh) onRefresh();
      } else {
        triggerPopup(
          data.message || "Unable to process this request.",
          "error"
        );

        setProcessingIds((prev) => {
          const next = new Set(prev);
          next.delete(requestId);
          return next;
        });
      }
    } catch (err) {
      console.error(err);

      triggerPopup(
        "Network error. Please try again.",
        "error"
      );

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
        Loading loan requests...
      </div>
    );
  }

  return (
    <div className="repayments-view-wrapper">
      <div className="repayments-header">
        <h2>Loan Requests</h2>
        <p>
          Review member loan requests and approve or
          decline them.
        </p>
      </div>

      <div className="admin-table-card">
        <div className="table-responsive-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Amount Requested</th>
                <th>Loan Purpose</th>
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
                    No pending loan requests.
                  </td>
                </tr>
              ) : (
                loans.map((loan) => {
                  const isProcessing =
                    processingIds.has(loan.id);

                  return (
                    <tr key={loan.id}>
                      <td>
                        <div className="user-profile-cell">
                          <strong>
                            {loan.username}
                          </strong>
                          <small>
                            Member ID: #
                            {loan.user_id}
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
                            "No reason provided."}
                        </div>
                      </td>

                      <td>
                        <div className="action-button-group">
                          <button
                            onClick={() =>
                              handleResolveLoan(
                                loan.id,
                                "approved"
                              )
                            }
                            className="btn-action-disburse"
                            disabled={isProcessing}
                            style={
                              isProcessing
                                ? {
                                    opacity: 0.55,
                                    cursor:
                                      "not-allowed",
                                  }
                                : {}
                            }
                          >
                            {isProcessing
                              ? "Processing..."
                              : "✓ Approve Loan"}
                          </button>

                          <button
                            onClick={() =>
                              handleResolveLoan(
                                loan.id,
                                "declined"
                              )
                            }
                            className="btn-action-decline"
                            disabled={isProcessing}
                            style={
                              isProcessing
                                ? {
                                    opacity: 0.55,
                                    cursor:
                                      "not-allowed",
                                  }
                                : {}
                            }
                          >
                            {isProcessing
                              ? "Processing..."
                              : "✕ Decline"}
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