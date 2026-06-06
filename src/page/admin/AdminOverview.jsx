import React from "react";
import { useAdminData } from "./hooks/adminOverViewHook"; 
import "../styles/admin-overview.css"; 
import AdminCreateUser from "./AdminCreateUser"; 

function AdminOverview() {
  const {
    users, requests, loanRequests, selectedUser, setSelectedUser,
    isModalOpen, setIsModalOpen,
    amount, setAmount, actionType, setActionType, loading, viewTab, setViewTab, isMainAdmin,
    fetchData, handleBalanceAdjustment, handleResolveLoan,
    handleDeleteUser, handleResolveRequest, handleRoleChange, 
    
    // 🎯 Destructuring the new cooperative finance properties here
    totalPoolLiquidity,
    totalActiveLoansIssued,
    availableClubCash
  } = useAdminData();

  return (
    <div className="overview-container">
      <h2>Olofin Heritage Club Management Station</h2>
      
      {/* Metrics Header Cards */}
      <div className="metrics-cards-container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "15px", marginBottom: "25px" }}>
        
        {/* Card 1: Gross Platform Contributions Accumulation */}
        <div className="metric-card balance-card">
          <small className="metric-label">Total Contribution Capital</small>
          <h2 className="metric-value" style={{ color: "#2ecc71" }}>₦{totalPoolLiquidity.toLocaleString()}</h2>
        </div>

        {/* Card 2: Active Outstanding Debt Portfolio */}
        <div className="metric-card loan-pool-card" style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", borderLeft: "5px solid #e67e22" }}>
          <small className="metric-label" style={{ color: "#7f8c8d", fontWeight: "600" }}>Total Out on Loan</small>
          <h2 className="metric-value" style={{ color: "#e67e22", fontSize: "24px", marginTop: "5px" }}>₦{totalActiveLoansIssued.toLocaleString()}</h2>
        </div>

        {/* Card 3: Safe Liquid Cash Available in Vault */}
        <div className="metric-card liquid-vault-card" style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", borderLeft: "5px solid #3498db" }}>
          <small className="metric-label" style={{ color: "#7f8c8d", fontWeight: "600" }}>Available Vault Cash (Liquid)</small>
          <h2 className="metric-value" style={{ color: "#3498db", fontSize: "24px", marginTop: "5px" }}>₦{availableClubCash.toLocaleString()}</h2>
        </div>

        {/* Card 4: Total Members registered inside directory */}
        <div className="metric-card contributors-card">
          <small className="metric-label">Registered Contributors</small>
          <h2 className="metric-value">{users.length} Users Active</h2>
        </div>

      </div>

      {/* Tab Selectors */}
      <div className="tab-buttons-container">
        <button 
          onClick={() => setViewTab("users")} 
          className={`tab-btn btn-users ${viewTab === "users" ? "active" : ""}`}
        >
          👥 Active Users Directory ({users.length})
        </button>
        <button 
          onClick={() => setViewTab("requests")} 
          className={`tab-btn btn-requests ${viewTab === "requests" ? "active" : ""}`}
        >
          📩 Membership Registry ({requests.length})
        </button>
        <button 
          onClick={() => setViewTab("loans")} 
          className={`tab-btn btn-loans ${viewTab === "loans" ? "active" : ""}`}
        >
          💸 Loan Applications Queue ({loanRequests.length})
        </button>
      </div>

      {/* Primary Table Layout Workspace */}
      <div className="admin-grid">
        <div className="table-card">
          <div className="table-responsive-wrapper">
            
            {viewTab === "users" && (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email Contact</th>
                    <th>Role Designation</th>
                    <th>Current Balance</th>
                    <th className="text-center">Row Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td><strong>{u.username}</strong> {u.is_primary_founder && "👑"}</td>
                      <td className="user-email-cell">{u.email}</td>
                      <td>
                        {isMainAdmin && !u.is_primary_founder ? (
                          <select 
                            value={u.role_tier || "member"} 
                            onChange={(e) => handleRoleChange(u.id, e.target.value)} 
                            className="role-selector-dropdown"
                          >
                            <option value="member">Member</option>
                            <option value="senator">Senator</option>
                            <option value="chief">Chief</option>
                            <option value="admin">Secondary Admin</option>
                          </select>
                        ) : (
                          <span className={`role-badge ${u.is_primary_founder ? "founder-badge" : "standard-badge"}`}>
                            {u.role_tier || "member"}
                          </span>
                        )}
                      </td>
                      <td className="balance-text-display">
                        <div>W: ₦{u.amount_paid?.toLocaleString()}</div>
                        <small style={{ color: "#e67e22" }}>L: ₦{(u.loan_balance || 0).toLocaleString()}</small>
                      </td>
                      <td>
                        <div className="row-actions-wrapper">
                          <button 
                            onClick={() => {
                              setSelectedUser(u);
                              setIsModalOpen(true);
                            }} 
                            className="action-select-btn"
                          >
                            Modify
                          </button>
                          {!u.is_primary_founder && (
                            <button onClick={() => handleDeleteUser(u)} className="action-delete-btn">🗑️</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {viewTab === "requests" && (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Requested Profile Name</th>
                    <th>Email / Communication Contact</th>
                    <th className="text-center">Direct Decisions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length === 0 ? (
                    <tr><td colSpan="3" className="empty-table-notice">No membership applications filed currently.</td></tr>
                  ) : (
                    requests.map(r => (
                      <tr key={r.id}>
                        <td><strong>{r.username}</strong></td>
                        <td>
                          <div>{r.email}</div>
                          <small>{r.phone}</small>
                        </td>
                        <td>
                          <div className="vetting-buttons-wrapper">
                            <button onClick={() => handleResolveRequest(r.id, "approved")} className="btn-approve">✓ Approve</button>
                            <button onClick={() => handleResolveRequest(r.id, "declined")} className="btn-decline">✕ Decline</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {viewTab === "loans" && (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Applicant Username</th>
                    <th>Requested Facility Amount</th>
                    <th>Stated Financial Purpose</th>
                    <th className="text-center">Action Options</th>
                  </tr>
                </thead>
                <tbody>
                  {loanRequests.length === 0 ? (
                    <tr><td colSpan="4" className="empty-table-notice">No capital loan applications found pending in the review queue.</td></tr>
                  ) : (
                    loanRequests.map(l => (
                      <tr key={l.id}>
                        <td><strong>{l.username}</strong></td>
                        <td className="balance-text-display" style={{ color: "#d35400" }}>₦{l.amount_requested?.toLocaleString()}</td>
                        <td><p className="loan-purpose-text">{l.purpose || "No stated purpose provided."}</p></td>
                        <td>
                          <div className="vetting-buttons-wrapper">
                            <button onClick={() => handleResolveLoan(l.id, "approved")} className="btn-approve">✓ Issue Capital</button>
                            <button onClick={() => handleResolveLoan(l.id, "declined")} className="btn-decline">✕ Reject</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

          </div>
        </div>

        {/* Sidebar Space for Create User Module */}
        <div className="admin-sidebar-forms-stack">
          <AdminCreateUser onUserCreated={fetchData} />
        </div>
      </div>

     {/* Floating Popup Modal Form */}
{isModalOpen && selectedUser && (
  <div className="custom-popup-overlay">
    <div className="custom-popup-box">
      <h3>Modify Balance / Accounts for {selectedUser.username}</h3>
      <p style={{ fontSize: "13px", color: "#e67e22", margin: "-5px 0 15px 0" }}>
        Current Debt Owed: ₦{(selectedUser.loan_balance || 0).toLocaleString()}
      </p>

      <form onSubmit={handleBalanceAdjustment} className="adjustment-form">
        <div className="form-group">
          <label className="form-label">Action Type Alignment</label>
          <select 
            value={actionType} 
            onChange={(e) => setActionType(e.target.value)} 
            className="form-select"
          >
            <option value="credit">➕ Credit Savings Balance</option>
            <option value="debit">➖ Debit Savings Balance</option>
            {/* 🎯 NEW REPAYMENT ALTERNATIVE OPTION */}
            <option value="pay_loan">💳 Direct Loan Repayment (Reduce Debt)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Amount Target Variant (₦)</label>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            className="form-input" 
            placeholder="e.g. 20000" 
            required 
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="confirm-btn">
            {loading ? "Processing..." : "Execute Adjustment"}
          </button>
          <button 
            type="button" 
            onClick={() => {
              setSelectedUser(null);
              setIsModalOpen(false);
            }} 
            className="cancel-sidebar-btn"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
}

export default AdminOverview;