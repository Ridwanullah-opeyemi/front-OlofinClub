import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminOverview from "./admin/AdminOverview";
import AdminTransactions from "./admin/AdminTransactions";
import AdminApprovals from "./admin/AdminApprovals";
import AdminChat from "./admin/AdminChat"; 
import AdminRepayments from "./admin/AdminRepayments"; 
import AdminLoanRequests from "./admin/AdminLoanRequests"; 
import "./styles/admin-dashboard.css"; 

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [loggingOut, setLoggingOut] = useState(false);
  
  const [pendingRepayCount, setPendingRepayCount] = useState(0); 
  const [pendingLoanCount, setPendingLoanCount] = useState(0); 
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // UI Popup Modal Notification State Machine
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "", // "success", "error", or "info"
  });

  const token = localStorage.getItem("token");

  // Helper utility to trigger smooth, floating UI toasts
  const triggerPopup = (message, type = "success") => {
    setPopup({ show: true, message, type });
    
    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setPopup({ show: false, message: "", type: "" });
    }, 4000);
  };

  const fetchBankingBadgeCounts = async () => {
    if (!token) return;
    try {
      // 1. Repayments Pipe
      const repayResponse = await fetch(`${backendUrl}/api/auth/loans/repayments/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const repayData = await repayResponse.json();
      if (repayResponse.ok && repayData.success) {
        setPendingRepayCount(Array.isArray(repayData.data) ? repayData.data.length : 0);
      }

      // 2. Pending Loans Table
      const loanResponse = await fetch(`${backendUrl}/api/auth/loans/pending`, { 
        headers: { Authorization: `Bearer ${token}` }
      });
      const loanData = await loanResponse.json();
      if (loanResponse.ok && loanData.success) {
        setPendingLoanCount(Array.isArray(loanData.data) ? loanData.data.length : 0);
      }
    } catch (err) {
      console.error("Failed to sync metrics from financial pipeline:", err);
    }
  };

  useEffect(() => {
    fetchBankingBadgeCounts();
    const interval = setInterval(fetchBankingBadgeCounts, 30000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleLogout = async () => {
    setLoggingOut(true);
    triggerPopup("Securely terminating administrative workspace credentials...", "info");
    
    try {
      await fetch(`${backendUrl}/api/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      });
    } catch (err) {
      console.error("Logout error channel disruption:", err);
    } finally {
      setTimeout(() => {
        localStorage.clear();
        navigate("/login");
      }, 1200);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <AdminOverview triggerPopup={triggerPopup} />;
      case "approvals":
        return <AdminApprovals triggerPopup={triggerPopup} />;
      case "loan-requests": 
        return <AdminLoanRequests onRefresh={fetchBankingBadgeCounts} triggerPopup={triggerPopup} />;
      case "repayments": 
        return <AdminRepayments onRefresh={fetchBankingBadgeCounts} triggerPopup={triggerPopup} />;
      case "transactions":
        return <AdminTransactions triggerPopup={triggerPopup} />;
      case "chat":
        return <AdminChat triggerPopup={triggerPopup} />;
      default:
        return <AdminOverview triggerPopup={triggerPopup} />;
    }
  };

  return (
    <div className="admin-wrapper row-layout">
      
      {/* 🔔 FLOATING TOAST POPOUT MESSAGES */}
      {popup.show && (
        <div className={`toast-notification ${popup.type}`}>
          <div className="toast-content">
            <span className="toast-icon">
              {popup.type === "success" ? "✅" : popup.type === "info" ? "ℹ️" : "❌"}
            </span>
            <p className="toast-text">{popup.message}</p>
          </div>
          <button 
            type="button" 
            className="toast-close-btn" 
            onClick={() => setPopup({ ...popup, show: false })}
          >
            ×
          </button>
        </div>
      )}

      {/* 🧭 HORIZONTAL NAVIGATION NAVBAR ROW */}
      <header className="admin-horizontal-header">
        <div className="admin-brand-block">
          <h2 className="admin-brand">Olofin Heritage</h2>
          <span className="admin-badge">Admin Workspace</span>
        </div>

        <nav className="admin-horizontal-nav">
          <button 
            type="button"
            onClick={() => setActiveTab("overview")} 
            className={`admin-row-btn ${activeTab === "overview" ? "active" : ""}`}
          >
            👥 Members
          </button>
          
          <button 
            type="button"
            onClick={() => setActiveTab("approvals")} 
            className={`admin-row-btn ${activeTab === "approvals" ? "active" : ""}`}
          >
            📥 Deposits
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab("loan-requests")} 
            className={`admin-row-btn ${activeTab === "loan-requests" ? "active" : ""}`}
          >
            <span className="btn-badge-inline">💰 Loans</span>
            {pendingLoanCount > 0 && (
              <span className="repay-alert-badge loan-badge-color">{pendingLoanCount}</span>
            )}
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab("repayments")} 
            className={`admin-row-btn ${activeTab === "repayments" ? "active" : ""}`}
          >
            <span className="btn-badge-inline">💳 Repayments</span>
            {pendingRepayCount > 0 && (
              <span className="repay-alert-badge">{pendingRepayCount}</span>
            )}
          </button>
          
          <button 
            type="button"
            onClick={() => setActiveTab("transactions")} 
            className={`admin-row-btn ${activeTab === "transactions" ? "active" : ""}`}
          >
            📊 Ledger
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab("chat")} 
            className={`admin-row-btn ${activeTab === "chat" ? "active" : ""}`}
          >
            💬 Chat
          </button>

          <button 
            type="button" 
            onClick={handleLogout} 
            disabled={loggingOut} 
            className="admin-row-btn admin-row-logout"
          >
            {loggingOut ? "Ending Session..." : "🚪 Secure Logout"}
          </button>
        </nav>
      </header>

      {/* 🖥️ DYNAMIC WORKSPACE COMPONENT CANVAS CONTAINER */}
      <main className="admin-row-main-area">
        {renderContent()}
      </main>
    </div>
  );
}

export default AdminDashboard;