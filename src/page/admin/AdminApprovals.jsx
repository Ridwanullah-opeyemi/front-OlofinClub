import React, { useState, useEffect } from "react";
import "../styles/admin-approvals.css";

function AdminApprovals({ triggerPopup }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedAudit, setSelectedAudit] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const token = localStorage.getItem("token");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${backendUrl}/api/auth/deposits/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        setRequests(data.data || []);
      } else {
        throw new Error(data.message || "Could not load pending deposits.");
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

  const openReceipt = (r) => {
    setImageLoading(true);
    setSelectedAudit(r);
  };

  const handleApprove = async (id) => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch(`${backendUrl}/api/auth/deposits/${id}/approve`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        triggerPopup("Deposit approved and balance updated.", "success");
        setSelectedAudit(null);
        setRequests((prev) => prev.filter((r) => String(r.id || r._id) !== String(id)));
        setTimeout(() => fetchPendingRequests(), 500);
      } else {
        triggerPopup(data.message || "Could not approve this deposit.", "error");
      }
    } catch (err) {
      console.error("Approval error:", err);
      triggerPopup("Connection issue — please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="appr-loading">Loading deposit requests…</div>;
  }

  if (error) {
    return <div className="appr-error">Something went wrong: {error}</div>;
  }

  return (
    <div className="appr-page">
      <div className="appr-header">
        <h2>Pending Deposits</h2>
        <p className="appr-subtitle">
          Review the payment proof each member uploaded, then approve to credit their balance.
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="appr-empty-state">
          <span className="appr-empty-icon">✓</span>
          <p>All caught up</p>
          <span className="appr-empty-sub">No deposits are waiting for review right now.</span>
        </div>
      ) : (
        <div className="appr-list">
          {requests.map((r) => (
            <div key={r.id || r._id} className="appr-row">
              <div className="appr-avatar">
                {(r.username || "?").charAt(0).toUpperCase()}
              </div>

              <div className="appr-main">
                <span className="appr-name">{r.username}</span>
                <span className="appr-status-pill">Awaiting review</span>
              </div>

              <span className="appr-amount">₦{Number(r.amount).toLocaleString()}</span>

              <button type="button" className="appr-view-btn" onClick={() => openReceipt(r)}>
                Review
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Deposit review panel — receipt image shown before approving */}
      {selectedAudit && (
        <div className="appr-modal-overlay" onClick={() => !submitting && setSelectedAudit(null)}>
          <div className="appr-modal-card" onClick={(e) => e.stopPropagation()}>

            <div className="appr-modal-header">
              <h4>Deposit Review</h4>
              <button
                type="button"
                className="appr-modal-close"
                onClick={() => !submitting && setSelectedAudit(null)}
              >
                ×
              </button>
            </div>

            <div className="appr-modal-summary">
              <div className="appr-avatar large">
                {(selectedAudit.username || "?").charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="appr-modal-name">{selectedAudit.username}</span>
                <span className="appr-modal-amount">
                  ₦{Number(selectedAudit.amount).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="appr-receipt-block">
              <span className="appr-receipt-label">Payment proof uploaded by member</span>

              <div className="appr-receipt-frame">
                {imageLoading && <div className="appr-receipt-skeleton" />}
                <img
                  src={selectedAudit.proof_url}
                  alt="Payment receipt uploaded by member"
                  className="appr-receipt-img"
                  style={{ display: imageLoading ? "none" : "block" }}
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                />
              </div>

              <a
                href={selectedAudit.proof_url}
                target="_blank"
                rel="noopener noreferrer"
                className="appr-receipt-fullsize-link"
              >
                Open full size in new tab
              </a>
            </div>

            <div className="appr-modal-actions">
              <button
                type="button"
                className="appr-btn-cancel"
                onClick={() => setSelectedAudit(null)}
                disabled={submitting}
              >
                Close
              </button>

              <button
                type="button"
                className="appr-btn-approve"
                onClick={() => handleApprove(selectedAudit.id || selectedAudit._id)}
                disabled={submitting}
              >
                {submitting ? "Approving…" : "Approve deposit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminApprovals;