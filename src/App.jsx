import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Public Pages
import Home from "./page/home";
import Login from "./page/login";
import MembershipRequest from "./page/MembershipRequestForm";

// Protected Dashboard Pages
import MemberDashboard from "./page/MemberDashboard";
import AdminDashboard from "./page/AdminDashboard";

import "./App.css";
import ResetPassword from "./page/ResetPassword";

// 🛡️ Guard for Regular Users/Members
const MemberRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// 👑 Guard for Multi-Tier Admins
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // 🛡️ Array matching all authorized management roles
  const administrativeTiers = ["main_admin", "admin", "chief", "senator"];

  // 🔥 UPDATED: Checks against the new role_tier architecture instead of user.role
  if (!token || !user || !administrativeTiers.includes(user.role_tier)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🌐 PUBLIC LANDING ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* 📩 UPDATED: Dynamic route string matching the exact Link path from your Login interface */}
        <Route path="/MembershipRequestForm" element={<MembershipRequest />} />

        {/* 👥 PROTECTED MEMBER ROUTE */}
        <Route
          path="/dashboard"
          element={
            <MemberRoute>
              <MemberDashboard />
            </MemberRoute>
          }
        />

        {/* 👑 PROTECTED ADMIN ROUTE */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

        {/* 🔄 FALLBACK CATCH-ALL: Redirects random typos back to the landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;