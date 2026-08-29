import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

import AdminOverview from "./admin/AdminOverview";
import AdminTransactions from "./admin/AdminTransactions";
import AdminApprovals from "./admin/AdminApprovals";
import AdminChat from "./admin/AdminChat";
import AdminRepayments from "./admin/AdminRepayments";
import AdminLoanRequests from "./admin/AdminLoanRequests";
import AdminProfile from "./admin/AdminProfile";

import DialogRenderer from "../component/DialogRenderer";
import { useDialog } from "./hooks/useDialog";

import "./styles/admin-dashboard.css";

const ADMIN_ROLES = [
  "main_admin",
  "admin",
  "chief",
  "senator",
];

function AdminDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [loggingOut, setLoggingOut] = useState(false);

  const [pendingRepayCount, setPendingRepayCount] = useState(0);
  const [pendingLoanCount, setPendingLoanCount] = useState(0);

  const [userProfile, setUserProfile] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const homeUrl = "/";

  const token = localStorage.getItem("token");

  /*
   * ---------------------------------------------------------
   * CURRENT ADMIN
   * ---------------------------------------------------------
   */
  const getCachedUser = () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) return null;

      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Failed to read cached admin user:", error);
      return null;
    }
  };

  const cachedUser = getCachedUser();

  /*
   * ---------------------------------------------------------
   * SECURITY CHECK
   * ---------------------------------------------------------
   *
   * Only recognized administrative tiers should remain
   * inside this workspace.
   */
  useEffect(() => {
    if (!token || !cachedUser) {
      navigate("/login", { replace: true });
      return;
    }

    if (!ADMIN_ROLES.includes(cachedUser.role_tier)) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, cachedUser?.id, cachedUser?.role_tier, navigate]);

  /*
   * ---------------------------------------------------------
   * TOAST SYSTEM
   * ---------------------------------------------------------
   */
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "",
  });

  const triggerPopup = useCallback(
    (message, type = "success") => {
      setPopup({
        show: true,
        message,
        type,
      });

      setTimeout(() => {
        setPopup({
          show: false,
          message: "",
          type: "",
        });
      }, 4000);
    },
    []
  );

  /*
   * ---------------------------------------------------------
   * DIALOG SYSTEM
   * ---------------------------------------------------------
   */
  const {
    dialog,
    notify,
    confirm,
    prompt,
    handleConfirm,
    handleCancel,
  } = useDialog();

  /*
   * ---------------------------------------------------------
   * LOAD ADMIN PROFILE
   * ---------------------------------------------------------
   */
  const fetchAdminProfile = useCallback(async () => {
    if (!token || !cachedUser?.id) return;

    try {
      const response = await fetch(
        `${backendUrl}/api/user/${cachedUser.id}/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setUserProfile(data.data);
      }
    } catch (error) {
      console.error(
        "Failed to load administrator profile:",
        error
      );
    }
  }, [backendUrl, token, cachedUser?.id]);

  /*
   * ---------------------------------------------------------
   * BANKING BADGES
   * ---------------------------------------------------------
   */
  const fetchBankingBadgeCounts = useCallback(async () => {
    if (!token) return;

    try {
      const repayResponse = await fetch(
        `${backendUrl}/api/auth/loans/repayments/pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const repayData = await repayResponse.json();

      if (repayResponse.ok && repayData.success) {
        setPendingRepayCount(
          Array.isArray(repayData.data)
            ? repayData.data.length
            : 0
        );
      }

      const loanResponse = await fetch(
        `${backendUrl}/api/auth/loans/pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const loanData = await loanResponse.json();

      if (loanResponse.ok && loanData.success) {
        setPendingLoanCount(
          Array.isArray(loanData.data)
            ? loanData.data.length
            : 0
        );
      }
    } catch (error) {
      console.error(
        "Failed to sync admin banking metrics:",
        error
      );
    }
  }, [backendUrl, token]);

  /*
   * ---------------------------------------------------------
   * INITIAL DATA
   * ---------------------------------------------------------
   */
  useEffect(() => {
    fetchBankingBadgeCounts();
    fetchAdminProfile();

    const interval = setInterval(() => {
      fetchBankingBadgeCounts();
    }, 30000);

    return () => clearInterval(interval);
  }, [
    fetchBankingBadgeCounts,
    fetchAdminProfile,
  ]);

  /*
   * ---------------------------------------------------------
   * REFRESH PROFILE AFTER UPDATE
   * ---------------------------------------------------------
   */
  const handleProfileRefresh = async () => {
    await fetchAdminProfile();

    /*
     * Refresh cached user so the Navbar / other components
     * can see the latest profile information.
     */
    try {
      const response = await fetch(
        `${backendUrl}/api/user/${cachedUser?.id}/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setUserProfile(data.data);

        const currentCachedUser =
          getCachedUser() || {};

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...currentCachedUser,
            ...data.data,
          })
        );

        window.dispatchEvent(
          new Event("storage")
        );
      }
    } catch (error) {
      console.error(
        "Failed to refresh cached admin profile:",
        error
      );
    }
  };

  /*
   * ---------------------------------------------------------
   * LOGOUT
   * ---------------------------------------------------------
   */
  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    triggerPopup(
      "Securely terminating administrative workspace credentials...",
      "info"
    );

    try {
      await fetch(
        `${backendUrl}/api/auth/logout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error(
        "Logout request failed:",
        error
      );
    } finally {
      setTimeout(() => {
        localStorage.clear();
        navigate("/login", {
          replace: true,
        });
      }, 700);
    }
  };

  /*
   * ---------------------------------------------------------
   * TAB NAVIGATION
   * ---------------------------------------------------------
   */
  const changeTab = (tab) => {
    setActiveTab(tab);
  };

  /*
   * ---------------------------------------------------------
   * CONTENT
   * ---------------------------------------------------------
   */
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <AdminOverview
            triggerPopup={triggerPopup}
            notify={notify}
            confirm={confirm}
            prompt={prompt}
          />
        );

      case "approvals":
        return (
          <AdminApprovals
            triggerPopup={triggerPopup}
          />
        );

      case "loan-requests":
        return (
          <AdminLoanRequests
            onRefresh={fetchBankingBadgeCounts}
            triggerPopup={triggerPopup}
            notify={notify}
            confirm={confirm}
          />
        );

      case "repayments":
        return (
          <AdminRepayments
            onRefresh={fetchBankingBadgeCounts}
            triggerPopup={triggerPopup}
            notify={notify}
            confirm={confirm}
          />
        );

      case "transactions":
        return (
          <AdminTransactions
            triggerPopup={triggerPopup}
          />
        );

      case "chat":
        return (
          <AdminChat
            triggerPopup={triggerPopup}
            notify={notify}
          />
        );

      case "profile":
        return (
          <AdminProfile
            userProfile={userProfile}
            onRefresh={handleProfileRefresh}
            triggerPopup={triggerPopup}
          />
        );

      default:
        return (
          <AdminOverview
            triggerPopup={triggerPopup}
            notify={notify}
            confirm={confirm}
            prompt={prompt}
          />
        );
    }
  };

  /*
   * ---------------------------------------------------------
   * UI
   * ---------------------------------------------------------
   */
  return (
    <div className="admin-wrapper row-layout">

      {/* Custom dialog */}
      <DialogRenderer
        dialog={dialog}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      {/* Toast */}
      {popup.show && (
        <div
          className={`toast-notification ${popup.type}`}
        >
          <div className="toast-content">

            <span className="toast-icon">
              {popup.type === "success"
                ? "✅"
                : popup.type === "info"
                ? "ℹ️"
                : "❌"}
            </span>

            <p className="toast-text">
              {popup.message}
            </p>

          </div>

          <button
            type="button"
            className="toast-close-btn"
            onClick={() =>
              setPopup({
                ...popup,
                show: false,
              })
            }
          >
            ×
          </button>
        </div>
      )}

      {/* =====================================================
          ADMIN HEADER
          ===================================================== */}
      <header className="admin-horizontal-header">

        <div className="admin-brand-block">

          <h2 className="admin-brand">
            <Link to={homeUrl}>
              Olofin Heritage
            </Link>
          </h2>

          <span className="admin-badge">
            Admin Workspace
          </span>

        </div>

        <nav className="admin-horizontal-nav">

          {/* MEMBERS */}
          <button
            type="button"
            onClick={() =>
              changeTab("overview")
            }
            className={`admin-row-btn ${
              activeTab === "overview"
                ? "active"
                : ""
            }`}
          >
            👥 Members
          </button>

          {/* DEPOSITS */}
          <button
            type="button"
            onClick={() =>
              changeTab("approvals")
            }
            className={`admin-row-btn ${
              activeTab === "approvals"
                ? "active"
                : ""
            }`}
          >
            📥 Deposits
          </button>

          {/* LOANS */}
          <button
            type="button"
            onClick={() =>
              changeTab("loan-requests")
            }
            className={`admin-row-btn ${
              activeTab === "loan-requests"
                ? "active"
                : ""
            }`}
          >
            <span className="btn-badge-inline">
              💰 Loans
            </span>

            {pendingLoanCount > 0 && (
              <span className="repay-alert-badge loan-badge-color">
                {pendingLoanCount}
              </span>
            )}
          </button>

          {/* REPAYMENTS */}
          <button
            type="button"
            onClick={() =>
              changeTab("repayments")
            }
            className={`admin-row-btn ${
              activeTab === "repayments"
                ? "active"
                : ""
            }`}
          >
            <span className="btn-badge-inline">
              💳 Repayments
            </span>

            {pendingRepayCount > 0 && (
              <span className="repay-alert-badge">
                {pendingRepayCount}
              </span>
            )}
          </button>

          {/* TRANSACTIONS */}
          <button
            type="button"
            onClick={() =>
              changeTab("transactions")
            }
            className={`admin-row-btn ${
              activeTab === "transactions"
                ? "active"
                : ""
            }`}
          >
            📊 Transaction History
          </button>

          {/* CHAT */}
          <button
            type="button"
            onClick={() =>
              changeTab("chat")
            }
            className={`admin-row-btn ${
              activeTab === "chat"
                ? "active"
                : ""
            }`}
          >
            💬 Chat
          </button>

          {/* PROFILE */}
          <button
            type="button"
            onClick={() =>
              changeTab("profile")
            }
            className={`admin-row-btn ${
              activeTab === "profile"
                ? "active"
                : ""
            }`}
          >
            👤 Settings
          </button>

          {/* LOGOUT */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="admin-row-btn admin-row-logout"
          >
            {loggingOut
              ? "Ending Session..."
              : "🚪 Secure Logout"}
          </button>

        </nav>
      </header>

      {/* =====================================================
          WORKSPACE
          ===================================================== */}
      <main className="admin-row-main-area">
        {renderContent()}
      </main>

    </div>
  );
}

export default AdminDashboard;
