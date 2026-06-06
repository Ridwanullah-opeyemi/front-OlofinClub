import React, { useState, useEffect } from "react";
import "../styles/admin-transactions.css";

function AdminTransactions() {
  const [logs, setLogs] = useState([]);
  const token = localStorage.getItem("token");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchGlobalLogs = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/auth/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setLogs(data.data);
      } catch (err) {
        console.error("Ledger interface fetch error:", err);
      }
    };
    fetchGlobalLogs();
  }, [token]);

  return (
    <div className="ledger-container">
      <h2>Global Transaction Audit Ledger</h2>
      <p className="subtitle">Real-time system trail mapping historical operations, ledger alterations, and override activities.</p>

      <div className="table-card">
        <div className="table-responsive-wrapper">
          <table className="global-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Member Reference</th>
                <th>Operation Description</th>
                <th>Delta Metric</th>
                <th>Post Balance</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-ledger-text">No historical mutations logged to the ledger.</td>
                </tr>
              ) : (
                logs.map(l => (
                  <tr key={l.id}>
                    <td className="time-cell">{new Date(l.created_at).toLocaleString()}</td>
                    
                    {/* ✅ FIXED: Correctly pulls the joined parameters from your exact users object definition */}
                    <td className="user-ref-cell">
                      <strong>{l.users?.username || "Unknown User"}</strong> 
                      <small style={{ display: "block", color: "#94a3b8", fontSize: "11px", marginTop: "2px" }}>
                        ID: #{l.users?.id || "N/A"}
                      </small>
                    </td>

                    <td className="desc-cell">{l.description}</td>
                    
                    {/* ✅ Quick Safe Parse Check: Ensuring number transformations safely evaluate */}
                    <td className={Number(l.amount_changed) > 0 ? "pos" : "neg"}>
                      {Number(l.amount_changed) > 0 
                        ? `+₦${Number(l.amount_changed).toLocaleString()}` 
                        : `-₦${Math.abs(Number(l.amount_changed)).toLocaleString()}`
                      }
                    </td>
                    
                    <td className="final-val">₦{Number(l.new_balance).toLocaleString()}</td>
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

export default AdminTransactions;