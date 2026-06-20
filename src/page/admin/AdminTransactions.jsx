import React, { useState, useEffect } from "react";
import "../styles/admin-transactions.css";

function AdminTransactions() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const token = localStorage.getItem("token");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchGlobalLogs = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${backendUrl}/api/auth/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setLogs(data.data);
      } catch (err) {
        console.error("Failed to load transactions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGlobalLogs();
  }, [token]);

  const formatDate = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  };

  const closeDetail = () => setSelected(null);

  return (
    <div className="txn-page">
      <div className="txn-header">
        <h2>Transaction History</h2>
        <p className="txn-subtitle">All deposits, withdrawals, and balance updates across every member account.</p>
      </div>

      <div className="txn-statement-card">

        {loading ? (
          <div className="txn-empty-state">
            <div className="txn-spinner" />
            <p>Loading transactions…</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="txn-empty-state">
            <span className="txn-empty-icon">📄</span>
            <p>No transactions yet</p>
            <span className="txn-empty-sub">Activity will appear here once members start saving.</span>
          </div>
        ) : (
          <div className="txn-list">
            {logs.map((l) => {
              const isCredit = Number(l.amount_changed) > 0;
              const amount = Math.abs(Number(l.amount_changed));

              return (
                <button
                  key={l.id}
                  className="txn-row"
                  onClick={() => setSelected(l)}
                  type="button"
                >
                  <div className={`txn-icon ${isCredit ? "credit" : "debit"}`}>
                    {isCredit ? "↓" : "↑"}
                  </div>

                  <div className="txn-main">
                    <span className="txn-name">{l.users?.username || "Unknown member"}</span>
                    <span className="txn-desc">{l.description}</span>
                  </div>

                  <div className="txn-when">
                    <span className="txn-date">{formatDate(l.created_at)}</span>
                    <span className="txn-time">{formatTime(l.created_at)}</span>
                  </div>

                  <div className="txn-amount-col">
                    <span className={`txn-amount ${isCredit ? "credit" : "debit"}`}>
                      {isCredit ? "+" : "−"}₦{amount.toLocaleString()}
                    </span>
                    <span className="txn-balance">Bal: ₦{Number(l.new_balance).toLocaleString()}</span>
                  </div>

                  <span className="txn-chevron">›</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail panel — opens like a bank app transaction receipt */}
      {selected && (
        <div className="txn-modal-overlay" onClick={closeDetail}>
          <div className="txn-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="txn-modal-close" onClick={closeDetail} type="button">×</button>

            <div className={`txn-modal-icon ${Number(selected.amount_changed) > 0 ? "credit" : "debit"}`}>
              {Number(selected.amount_changed) > 0 ? "↓" : "↑"}
            </div>

            <span className="txn-modal-label">
              {Number(selected.amount_changed) > 0 ? "Money in" : "Money out"}
            </span>

            <span className={`txn-modal-amount ${Number(selected.amount_changed) > 0 ? "credit" : "debit"}`}>
              {Number(selected.amount_changed) > 0 ? "+" : "−"}₦{Math.abs(Number(selected.amount_changed)).toLocaleString()}
            </span>

            <div className="txn-modal-divider" />

            <div className="txn-modal-details">
              <div className="txn-modal-detail-row">
                <span>Member</span>
                <strong>{selected.users?.username || "Unknown member"}</strong>
              </div>
              <div className="txn-modal-detail-row">
                <span>Member ID</span>
                <strong>#{selected.users?.id || "N/A"}</strong>
              </div>
              <div className="txn-modal-detail-row">
                <span>Description</span>
                <strong>{selected.description}</strong>
              </div>
              <div className="txn-modal-detail-row">
                <span>Date</span>
                <strong>{formatDate(selected.created_at)} at {formatTime(selected.created_at)}</strong>
              </div>
              <div className="txn-modal-detail-row">
                <span>Balance after</span>
                <strong>₦{Number(selected.new_balance).toLocaleString()}</strong>
              </div>
              <div className="txn-modal-detail-row">
                <span>Reference</span>
                <strong>#{selected.id}</strong>
              </div>
            </div>

            <button className="txn-modal-done" onClick={closeDetail} type="button">Done</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTransactions;