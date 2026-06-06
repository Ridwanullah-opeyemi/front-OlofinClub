import React, { useState, useEffect } from "react";
import "../styles/member-ledger.css"; 

function MemberLedger() {
  const [transactions, setTransactions] = useState([]);
  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/user/${storedUser?.id}/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          // Sort chronologically: newest transactions always show up first on the feed
          const sortedData = (data.data || []).sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setTransactions(sortedData);
        }
      } catch (err) {
        console.error("Member ledger processing exception:", err);
      }
    };
    if (storedUser?.id) fetchLedger();
  }, [token, storedUser?.id]);

  // 🎯 BANKING HELP ENGINE: Detects transaction context from description and returns custom badge classes
  const getTransactionBadge = (desc = "") => {
    const lowerDesc = desc.toLowerCase();
    if (lowerDesc.includes("disbursed") || lowerDesc.includes("loan capital")) {
      return { label: "LOAN DISBURSED", className: "badge-loan-in" };
    }
    if (lowerDesc.includes("repayment") || lowerDesc.includes("settlement")) {
      return { label: "LOAN REPAYMENT", className: "badge-loan-out" };
    }
    if (lowerDesc.includes("deposit")) {
      return { label: "DEPOSIT", className: "badge-deposit" };
    }
    if (lowerDesc.includes("withdrawal") || lowerDesc.includes("debit")) {
      return { label: "WITHDRAWAL", className: "badge-withdraw" };
    }
    if (lowerDesc.includes("bonus") || lowerDesc.includes("reward")) {
      return { label: "BONUS CREDIT", className: "badge-bonus" };
    }
    return { label: "TRANSACTION", className: "badge-generic" };
  };

  return (
    <div className="ledger-container">
      <h2>Account Statement & Activity Stream</h2>
      <p className="ledger-subtitle">Real-time consolidated banking ledger tracking all account modifications, credit assets, loan injections, and repayments.</p>

      <div className="table-card">
        {transactions.length === 0 ? (
          <p className="empty-ledger-text">No transaction records discovered for this member profile context.</p>
        ) : (
          <div className="table-responsive-wrapper">
            <table className="ledger-table">
              <thead>
                <tr>
                  <th>Transaction Date</th>
                  <th>Activity Type</th>
                  <th>Reference Context Description</th>
                  <th>Previous Balance</th>
                  <th>Delta Alteration</th>
                  <th>Resultant Balance</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => {
                  const isPositive = Number(t.amount_changed) > 0;
                  const badgeInfo = getTransactionBadge(t.description);
                  
                  return (
                    <tr key={t.id}>
                      <td className="date-cell">
                        {new Date(t.created_at).toLocaleString("en-NG", {
                          dateStyle: "medium",
                          timeStyle: "short"
                        })}
                      </td>
                      {/* Dynamic Bank Event Badge */}
                      <td>
                        <span className={`bank-event-badge ${badgeInfo.className}`}>
                          {badgeInfo.label}
                        </span>
                      </td>
                      <td className="desc-cell" style={{ fontWeight: "500" }}>
                        {t.description || "Contribution Update"}
                      </td>
                      <td className="balance-pre-cell" style={{ color: "#64748b" }}>
                        ₦{Number(t.previous_balance || 0).toLocaleString()}
                      </td>
                      <td className={`amount-cell ${isPositive ? "positive" : "negative"}`}>
                        {isPositive 
                          ? `+₦${Number(t.amount_changed).toLocaleString()}` 
                          : `-₦${Math.abs(Number(t.amount_changed)).toLocaleString()}`
                        }
                      </td>
                      <td className="final-balance-cell" style={{ fontWeight: "600", color: "#1e293b" }}>
                        ₦{Number(t.new_balance || 0).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MemberLedger;