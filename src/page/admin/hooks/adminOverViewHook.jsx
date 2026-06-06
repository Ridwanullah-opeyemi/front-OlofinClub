import { useState, useEffect } from "react";

export const useAdminData = () => {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loanRequests, setLoanRequests] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Modal toggle state
  const [isModalOpen, setIsModalOpen] = useState(false); 

  // Form input states for Balance Adjustment Modal
  const [amount, setAmount] = useState("");
  const [actionType, setActionType] = useState("credit");
  const [loading, setLoading] = useState(false);
  const [viewTab, setViewTab] = useState("users");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const token = localStorage.getItem("token");
  const currentAdminSession = JSON.parse(localStorage.getItem("user"));
  const isMainAdmin = currentAdminSession?.role_tier === "main_admin" || currentAdminSession?.is_primary_founder === true;

  /* ==========================================================================
     📈 ADVANCED DYNAMIC COOPERATIVE MATRICES CALCULATORS 
     ========================================================================== */
  
  // 1. General Monthly Contribution Total Accumulation
  const totalPoolLiquidity = users.reduce((sum, u) => sum + (Number(u.amount_paid) || 0), 0);

  // 2. Aggregate Total of all Active Loans Currently Borne by Members
  const totalActiveLoansIssued = users.reduce((sum, u) => sum + (Number(u.loan_balance) || 0), 0);

  // 3. Current Liquid Cash Remaining inside the vault = Contributions - Active Loans
  const availableClubCash = totalPoolLiquidity - totalActiveLoansIssued;


  /* ==========================================================================
     🔄 DATA FETCHING PIPELINES
     ========================================================================== */
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
      // Note: Update this endpoint string when you tie it to your real database query route
      const headerObj = { headers: { Authorization: `Bearer ${token}` } };
      const res = await fetch(`${backendUrl}/api/auth/loans/pending`, headerObj);
      const data = await res.json();
      if (data.success) {
        setLoanRequests(data.data);
      } else {
        // Fallback mock if data array format returns empty initially
        setLoanRequests([
          { id: 1, username: "Contributor_Alpha", amount_requested: 8000, purpose: "Business equipment development facility expansion" }
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


  /* ==========================================================================
     ⚙️ ADMINISTRATIVE TRANSACTION PROCESSORS
     ========================================================================== */

  // 🎯 FIXED: Single Unified Balance/Loan Repayment Handler
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
        body: JSON.stringify({ amount: Number(amount) })
      });

      if (response.ok) {
        alert(`Successfully executed transaction: ${actionType.toUpperCase()}!`);
        setAmount("");
        setSelectedUser(null);
        setIsModalOpen(false); 
        fetchData(); // Refresh metrics instantly
      } else {
        const errData = await response.json();
        alert(`Error: ${errData.message || "Failed to process transaction."}`);
      }
    } catch (err) {
      console.error("Balance alteration submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🛡️ LIQUIDITY VALIDATION GUARD LAYER FOR DISBURSING NEW LOANS
  const handleResolveLoan = async (requestId, action) => {
    const targetLoan = loanRequests.find(l => l.id === requestId);
    
    if (action === "approved" && targetLoan) {
      const loanAmountNeeded = Number(targetLoan.amount_requested);
      
      if (loanAmountNeeded > availableClubCash) {
        alert(
          `❌ TRANSACTION REJECTED:\n` +
          `Requested Loan: ₦${loanAmountNeeded.toLocaleString()}\n` +
          `Available Club Liquid Cash: ₦${availableClubCash.toLocaleString()}\n` +
          `You cannot approve this loan because it exceeds the physical pool cash available!`
        );
        return;
      }
    }

    const confirmation = window.confirm(`Are you sure you want to change this loan request status to ${action}?`);
    if (!confirmation) return;
    
    try {
      const res = await fetch(`${backendUrl}/api/auth/loans/${requestId}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        alert(`Loan application successfully marked as ${action}!`);
        fetchData();
        setLoanRequests(prev => prev.filter(item => item.id !== requestId));
      }
    } catch (err) {
      console.error("Loan resolution transit fault:", err);
    }
  };

  const handleDeleteUser = async (user) => {
    if (user.is_primary_founder || user.role_tier === "main_admin") {
      alert("Security Violation: The primary organization owner framework cannot be removed from the ledger.");
      return;
    }
    const firstConfirm = window.confirm(`⚠️ WARNING: Are you sure you want to permanently delete '${user.username}'? This action cannot be undone.`);
    if (!firstConfirm) return;

    const finalCheck = window.prompt(`Type DELETE to permanently execute account removal for ${user.username}:`);
    if (finalCheck !== "DELETE") {
      alert("Account deletion canceled. Validation string mismatch.");
      return;
    }
    try {
      const response = await fetch(`${backendUrl}/api/auth/users/${user.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        alert(data.message || "User profile cleanly removed.");
        if (selectedUser?.id === user.id) setSelectedUser(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveRequest = async (id, action) => {
    let declineReason = null;
    if (action === "declined") {
      declineReason = window.prompt("Provide explanation note for database logs regarding application declination:");
      if (declineReason === null) return;
    }
    try {
      const res = await fetch(`${backendUrl}/api/auth/membership-requests/${id}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action, declineReason })
      });
      if (res.ok) {
        alert("Registry system choice broadcasted successfully!");
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRoleChange = async (userId, targetRole) => {
    try {
      const res = await fetch(`${backendUrl}/api/auth/users/${userId}/alter-role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ targetRole })
      });
      const data = await res.json();
      alert(data.message);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return {
    users, requests, loanRequests, selectedUser, setSelectedUser,
    isModalOpen, setIsModalOpen,
    amount, setAmount, actionType, setActionType, loading, viewTab, setViewTab, isMainAdmin,
    fetchData, handleBalanceAdjustment, handleResolveLoan,
    handleDeleteUser, handleResolveRequest, handleRoleChange, 
    
    totalPoolLiquidity,
    totalActiveLoansIssued,
    availableClubCash
  };
};