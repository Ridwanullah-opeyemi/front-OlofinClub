import { useState, useEffect } from "react";

/**
 * useAdminData
 *
 * Accepts { notify, confirm, prompt, triggerPopup } from the parent component
 * so all native browser dialogs are replaced with the custom OHC dialog system.
 */
export const useAdminData = ({ notify, confirm, prompt, triggerPopup } = {}) => {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loanRequests, setLoanRequests] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [actionType, setActionType] = useState("credit");
  const [loading, setLoading] = useState(false);
  const [viewTab, setViewTab] = useState("users");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const token = localStorage.getItem("token");
  const currentAdminSession = JSON.parse(localStorage.getItem("user"));
  const isMainAdmin =
    currentAdminSession?.role_tier === "main_admin" ||
    currentAdminSession?.is_primary_founder === true;

  /* ── Cooperative Finance Calculators ─────────────────────────────── */
  const totalPoolLiquidity = users.reduce((sum, u) => sum + (Number(u.amount_paid) || 0), 0);
  const totalActiveLoansIssued = users.reduce((sum, u) => sum + (Number(u.loan_balance) || 0), 0);
  const availableClubCash = totalPoolLiquidity - totalActiveLoansIssued;

  /* ── Data Fetching ────────────────────────────────────────────────── */
  const fetchData = async () => {
    try {
      const headerObj = { headers: { Authorization: `Bearer ${token}` } };

      const usersRes = await fetch(`${backendUrl}/api/auth/users`, headerObj);
      const usersData = await usersRes.json();
      if (usersData.success) setUsers(usersData.data);

      const reqsRes = await fetch(`${backendUrl}/api/auth/membership-requests/pending`, headerObj);
      const reqsData = await reqsRes.json();
      if (reqsData.success) setRequests(reqsData.data);
    } catch (err) {
      console.error("Data tracking loading exception:", err);
    }
  };

  const fetchPendingLoans = async () => {
    try {
      const headerObj = { headers: { Authorization: `Bearer ${token}` } };
      const res = await fetch(`${backendUrl}/api/auth/loans/pending`, headerObj);
      const data = await res.json();
      if (data.success) {
        setLoanRequests(data.data);
      } else {
        setLoanRequests([
          { id: 1, username: "Contributor_Alpha", amount_requested: 8000, purpose: "Business equipment development facility expansion" },
        ]);
      }
    } catch (e) {
      console.error("Error loading pending loans:", e);
    }
  };

  useEffect(() => {
    fetchData();
    fetchPendingLoans();
  }, []);

  /* ── Balance / Loan Repayment Handler ────────────────────────────── */
  const handleBalanceAdjustment = async (e) => {
    e.preventDefault();
    if (!amount || !selectedUser) return;
    setLoading(true);

    const isLoanPayment = actionType === "pay_loan";
    const endpoint = isLoanPayment
      ? `${backendUrl}/api/auth/loans/repay-direct/${selectedUser.id}`
      : `${backendUrl}/api/auth/users/${selectedUser.id}/${actionType}`;

    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: Number(amount) }),
      });

      if (response.ok) {
        triggerPopup(`Transaction executed: ${actionType.toUpperCase()} successful!`, "success");
        setAmount("");
        setSelectedUser(null);
        setIsModalOpen(false);
        fetchData();
      } else {
        const errData = await response.json();
        triggerPopup(errData.message || "Failed to process transaction.", "error");
      }
    } catch (err) {
      console.error("Balance alteration submission error:", err);
      triggerPopup("Network error during transaction processing.", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ── Resolve Loan (with liquidity guard) ─────────────────────────── */
  const handleResolveLoan = async (requestId, action) => {
    const targetLoan = loanRequests.find((l) => l.id === requestId);

    // Liquidity guard — show custom notify instead of alert
    if (action === "approved" && targetLoan) {
      const loanAmountNeeded = Number(targetLoan.amount_requested);
      if (loanAmountNeeded > availableClubCash) {
        await notify(
          `TRANSACTION REJECTED\n\nRequested Loan: ₦${loanAmountNeeded.toLocaleString()}\nAvailable Club Cash: ₦${availableClubCash.toLocaleString()}\n\nThis loan exceeds the available vault cash and cannot be approved.`,
          "error"
        );
        return;
      }
    }

    const confirmed = await confirm(
      `Are you sure you want to mark this loan application as ${action}?`,
      {
        confirmLabel: action === "approved" ? "Yes, Disburse" : "Yes, Decline",
        cancelLabel: "Cancel",
        type: action === "approved" ? "success" : "warning",
      }
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`${backendUrl}/api/auth/loans/${requestId}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        triggerPopup(`Loan application successfully marked as ${action}!`, "success");
        fetchData();
        setLoanRequests((prev) => prev.filter((item) => item.id !== requestId));
      }
    } catch (err) {
      console.error("Loan resolution transit fault:", err);
      triggerPopup("Network error during loan resolution.", "error");
    }
  };

  /* ── Delete User ──────────────────────────────────────────────────── */
  const handleDeleteUser = async (user) => {
    if (user.is_primary_founder || user.role_tier === "main_admin") {
      await notify(
        "Security Violation: The primary organisation owner cannot be removed from the ledger.",
        "error"
      );
      return;
    }

    const firstConfirmed = await confirm(
      `⚠️ Are you sure you want to permanently delete '${user.username}'?\n\nThis action cannot be undone.`,
      { confirmLabel: "Yes, Delete", cancelLabel: "Cancel", type: "warning" }
    );
    if (!firstConfirmed) return;

    // Prompt for the confirmation string (replaces window.prompt)
    const typedValue = await prompt(
      `Type DELETE to confirm permanent account removal for ${user.username}:`,
      { placeholder: "DELETE", confirmLabel: "Execute Removal", cancelLabel: "Cancel", type: "error" }
    );
    if (typedValue === null) return; // user cancelled

    if (typedValue !== "DELETE") {
      await notify("Account deletion cancelled — validation string did not match.", "warning");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/auth/users/${user.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        triggerPopup(data.message || "User profile cleanly removed.", "success");
        if (selectedUser?.id === user.id) setSelectedUser(null);
        fetchData();
      } else {
        triggerPopup(data.message || "Failed to delete user.", "error");
      }
    } catch (err) {
      console.error(err);
      triggerPopup("Network error during account deletion.", "error");
    }
  };

  /* ── Resolve Membership Request ───────────────────────────────────── */
  const handleResolveRequest = async (id, action) => {
    let declineReason = null;

    if (action === "declined") {
      // Prompt replaces window.prompt for decline reason
      declineReason = await prompt(
        "Provide a reason for declining this membership application:",
        { placeholder: "Enter reason...", confirmLabel: "Submit Decision", cancelLabel: "Cancel", type: "warning" }
      );
      if (declineReason === null) return; // user cancelled
    }

    try {
      const res = await fetch(`${backendUrl}/api/auth/membership-requests/${id}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action, declineReason }),
      });
      if (res.ok) {
        triggerPopup("Membership decision submitted successfully!", "success");
        fetchData();
      }
    } catch (err) {
      console.error(err);
      triggerPopup("Network error submitting membership decision.", "error");
    }
  };

  /* ── Role Change ──────────────────────────────────────────────────── */
  const handleRoleChange = async (userId, targetRole) => {
    try {
      const res = await fetch(`${backendUrl}/api/auth/users/${userId}/alter-role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ targetRole }),
      });
      const data = await res.json();
      triggerPopup(data.message || "Role updated successfully.", "success");
      fetchData();
    } catch (err) {
      console.error(err);
      triggerPopup("Network error changing user role.", "error");
    }
  };

  return {
    users, requests, loanRequests, selectedUser, setSelectedUser,
    isModalOpen, setIsModalOpen,
    amount, setAmount, actionType, setActionType, loading, viewTab, setViewTab, isMainAdmin,
    fetchData, handleBalanceAdjustment, handleResolveLoan,
    handleDeleteUser, handleResolveRequest, handleRoleChange,
    totalPoolLiquidity, totalActiveLoansIssued, availableClubCash,
  };
};
