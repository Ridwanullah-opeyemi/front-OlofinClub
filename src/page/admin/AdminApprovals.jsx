import React, { useState, useEffect } from "react";
import "../styles/admin-approvals.css";

function AdminApprovals({ triggerPopup }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedAudit, setSelectedAudit] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${backendUrl}/api/auth/deposits/pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setRequests(data.data || []);
      } else {
        throw new Error(
          data.message ||
            "Failed to load verification queue."
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const handleApprove = async (id) => {
    if (submitting) return;

    setSubmitting(true);

    try {
      const res = await fetch(
        `${backendUrl}/api/auth/deposits/${id}/approve`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        triggerPopup(
          "Deposit transaction verified successfully!",
          "success"
        );

        // Close modal immediately
        setSelectedAudit(null);

        // Remove instantly from UI
        setRequests((prev) =>
          prev.filter(
            (r) =>
              String(r.id || r._id) !== String(id)
          )
        );

        // Re-sync with backend after approval
        setTimeout(() => {
          fetchPendingRequests();
        }, 500);
      } else {
        triggerPopup(
          data.message ||
            "Approval tracking update failed.",
          "error"
        );
      }
    } catch (err) {
      console.error("Approval error:", err);

      triggerPopup(
        "Network communication error with backend processing.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-notice">
        Loading pending audits queue...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-notice">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="approvals-container">
      <h2>Incoming Deposit Verification Queue</h2>

      <p className="subtitle">
        Audit payment receipts uploaded by members
        and verify balances dynamically.
      </p>

      <div className="approvals-grid">
        {requests.length === 0 ? (
          <p className="empty-text">
            🎉 Excellent! No pending deposit
            validation requests waiting inside your
            queue.
          </p>
        ) : (
          requests.map((r) => (
            <div
              key={r.id || r._id}
              className="approval-card"
            >
              <div className="card-info">
                <p>
                  <strong>Member Name:</strong>{" "}
                  {r.username}
                </p>

                <p>
                  <strong>Stated Value Sent:</strong>{" "}
                  <span className="amt">
                    ₦
                    {Number(
                      r.amount
                    ).toLocaleString()}
                  </span>
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span className="status-badge">
                    {r.status}
                  </span>
                </p>
              </div>

              <div className="card-actions">
                <button
                  type="button"
                  onClick={() => setSelectedAudit(r)}
                  className="view-receipt-btn"
                >
                  🔍 View Uploaded Receipt
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedAudit && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card audit-modal">
            <div className="modal-header-row">
              <h4>
                📋 Audit Payment Validation Receipt
              </h4>

              <button
                type="button"
                className="close-modal-x"
                onClick={() =>
                  !submitting &&
                  setSelectedAudit(null)
                }
              >
                ×
              </button>
            </div>

            <div className="modal-form-stack">
              <div className="audit-meta-summary">
                <p>
                  <strong>Member:</strong>{" "}
                  {selectedAudit.username}
                </p>

                <p>
                  <strong>Amount:</strong> ₦
                  {Number(
                    selectedAudit.amount
                  ).toLocaleString()}
                </p>
              </div>

              <div className="card-receipt">
                <p className="receipt-tag">
                  Submitted Receipt File:
                </p>

                <div className="receipt-image-frame">
                  <img
                    src={selectedAudit.proof_url}
                    alt="Receipt Proof File"
                    className="receipt-img"
                  />
                </div>
              </div>

              <div className="modal-action-buttons">
                <button
                  type="button"
                  className="modal-btn-cancel"
                  onClick={() =>
                    setSelectedAudit(null)
                  }
                  disabled={submitting}
                >
                  Close Review
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleApprove(
                      selectedAudit.id ||
                        selectedAudit._id
                    )
                  }
                  className="approve-action-btn"
                  disabled={submitting}
                >
                  {submitting
                    ? "⏳ Verifying Ledger..."
                    : "✅ Verify & Credit Balance"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminApprovals;