import React, { useState, useEffect } from "react";
import "../styles/member-ledger.css";

function MemberLedger() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${backendUrl}/api/user/${storedUser?.id}/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          const sortedData = (data.data || []).sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setTransactions(sortedData);
        }
      } catch (err) {
        console.error("Failed to load transactions:", err);
      } finally {
        setLoading(false);
      }
    };
    if (storedUser?.id) fetchLedger();
  }, [token, storedUser?.id]);

  // Detects transaction type from description and returns a short label
  const getTransactionLabel = (desc = "") => {
    const d = desc.toLowerCase();
    if (d.includes("disbursed") || d.includes("loan capital")) return "Loan disbursed";
    if (d.includes("repayment") || d.includes("settlement")) return "Loan repayment";
    if (d.includes("deposit")) return "Deposit";
    if (d.includes("withdrawal") || d.includes("debit")) return "Withdrawal";
    if (d.includes("bonus") || d.includes("reward")) return "Bonus credit";
    return "Transaction";
  };

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
        <h2>My Transactions</h2>
        <p className="txn-subtitle">A full record of your deposits, withdrawals, loans, and repayments.</p>
      </div>

      <div className="txn-statement-card">

        {loading ? (
          <div className="txn-empty-state">
            <div className="txn-spinner" />
            <p>Loading transactions…</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="txn-empty-state">
            <span className="txn-empty-icon">📄</span>
            <p>No transactions yet</p>
            <span className="txn-empty-sub">Your activity will appear here once you start saving.</span>
          </div>
        ) : (
          <div className="txn-list">
            {transactions.map((t) => {
              const isCredit = Number(t.amount_changed) > 0;
              const amount = Math.abs(Number(t.amount_changed));
              const label = getTransactionLabel(t.description);

              return (
                <button
                  key={t.id}
                  className="txn-row"
                  onClick={() => setSelected(t)}
                  type="button"
                >
                  <div className={`txn-icon ${isCredit ? "credit" : "debit"}`}>
                    {isCredit ? "↓" : "↑"}
                  </div>

                  <div className="txn-main">
                    <span className="txn-name">{label}</span>
                    <span className="txn-desc">{t.description || "Contribution update"}</span>
                  </div>

                  <div className="txn-when">
                    <span className="txn-date">{formatDate(t.created_at)}</span>
                    <span className="txn-time">{formatTime(t.created_at)}</span>
                  </div>

                  <div className="txn-amount-col">
                    <span className={`txn-amount ${isCredit ? "credit" : "debit"}`}>
                      {isCredit ? "+" : "−"}₦{amount.toLocaleString()}
                    </span>
                    <span className="txn-balance">Bal: ₦{Number(t.new_balance || 0).toLocaleString()}</span>
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
              {getTransactionLabel(selected.description)}
            </span>

            <span className={`txn-modal-amount ${Number(selected.amount_changed) > 0 ? "credit" : "debit"}`}>
              {Number(selected.amount_changed) > 0 ? "+" : "−"}₦{Math.abs(Number(selected.amount_changed)).toLocaleString()}
            </span>

            <div className="txn-modal-divider" />

            <div className="txn-modal-details">
              <div className="txn-modal-detail-row">
                <span>Description</span>
                <strong>{selected.description || "Contribution update"}</strong>
              </div>
              <div className="txn-modal-detail-row">
                <span>Date</span>
                <strong>{formatDate(selected.created_at)} at {formatTime(selected.created_at)}</strong>
              </div>
              <div className="txn-modal-detail-row">
                <span>Balance before</span>
                <strong>₦{Number(selected.previous_balance || 0).toLocaleString()}</strong>
              </div>
              <div className="txn-modal-detail-row">
                <span>Balance after</span>
                <strong>₦{Number(selected.new_balance || 0).toLocaleString()}</strong>
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

export default MemberLedger;