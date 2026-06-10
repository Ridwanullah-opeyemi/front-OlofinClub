import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MemberOverview from "./member/MemberOverview";
import MemberLedger from "./member/MemberLedger";
import MemberDeposit from "./member/MemberDeposit";
import MemberProfile from "./member/MemberProfile";
import MemberRepayments from "./member/MemberRepayments";
import LoanHub from "../component/LoanHub/LoanHub";
import "./styles/member-dashboard.css";

function MemberDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [loggingOut, setLoggingOut] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const token = localStorage.getItem("token");
  const cachedUser = JSON.parse(localStorage.getItem("user"));

  // ── Toast popup (mirrors the admin dashboard system) ──────────────
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });

  const triggerPopup = (message, type = "success") => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: "", type: "" }), 4000);
  };

  const fetchLiveProfileData = async () => {
    if (!cachedUser?.id || !token) return;
    try {
      const response = await fetch(`${backendUrl}/api/user/${cachedUser.id}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok && data.success) setUserProfile(data.data);
    } catch (err) {
      console.error("Failed to load operational balance ledger streams:", err);
    }
  };

  useEffect(() => {
    fetchLiveProfileData();
  }, [activeTab]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch(`${backendUrl}/api/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Backend logout ping failed, clearing local session anyway...", err);
    } finally {
      localStorage.clear();
      navigate("/login");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <MemberOverview userProfile={userProfile} />;
      case "ledger":
        return <MemberLedger />;
      case "deposit":
        return <MemberDeposit onRefresh={fetchLiveProfileData} />;
      case "loans":
        return <LoanHub userProfile={userProfile} onRefresh={fetchLiveProfileData} triggerPopup={triggerPopup} />;
      case "repayments":
        return <MemberRepayments userProfile={userProfile} onRefresh={fetchLiveProfileData} />;
      case "profile":
        return <MemberProfile userProfile={userProfile} onRefresh={fetchLiveProfileData} />;
      default:
        return <MemberOverview userProfile={userProfile} />;
    }
  };

  return (
    <div className="dashboard-wrapper">

      {/* Floating toast notifications */}
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

      {/* Sidebar Navigation Panel */}
      <aside className="sidebar-panel">
        <div className="sidebar-header">
          <h2 className="brand-title">Olofin Heritage Club</h2>
          <small className="brand-subtitle">Member Workspace</small>
        </div>

        <nav className="sidebar-nav">
          <button onClick={() => setActiveTab("overview")} className={`nav-btn ${activeTab === "overview" ? "active" : ""}`}>
            📊 Account Overview
          </button>
          <button onClick={() => setActiveTab("ledger")} className={`nav-btn ${activeTab === "ledger" ? "active" : ""}`}>
            📜 All Transactions
          </button>
          <button onClick={() => setActiveTab("deposit")} className={`nav-btn ${activeTab === "deposit" ? "active" : ""}`}>
            💰 Add Money
          </button>
          <button onClick={() => setActiveTab("loans")} className={`nav-btn ${activeTab === "loans" ? "active" : ""}`}>
            💸 Request Loan
          </button>
          <button onClick={() => setActiveTab("repayments")} className={`nav-btn ${activeTab === "repayments" ? "active" : ""}`}>
            💳 Repay Loan
          </button>
          <button onClick={() => setActiveTab("profile")} className={`nav-btn ${activeTab === "profile" ? "active" : ""}`}>
            👤 My Profile Settings
          </button>
        </nav>

        <button onClick={handleLogout} disabled={loggingOut} className="nav-btn logout-btn">
          {loggingOut ? "Ending Session..." : "🚪 Secure Logout"}
        </button>
      </aside>

      {/* Main View Container */}
      <main className="main-content-area">{renderContent()}</main>
    </div>
  );
}

export default MemberDashboard;
