import React, { useState } from "react";
import "../styles/admin-create-user-isolated.css"; // 🎯 Import our brand new, standalone stylesheet

function AdminCreateUser({ onUserCreated }) {
  const [formData, setFormData] = useState({
    username: "", 
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("✨ New user profile successfully provisioned!");
        setFormData({ username: "", email: "", phone: "", password: "" });
        
        if (onUserCreated) {
          onUserCreated(); 
        }
      } else {
        alert(data.message || "Failed to provision new account context registry entry.");
      }
    } catch (err) {
      console.error("Account Creation Interruption Error:", err);
      alert("Network breakdown during member registration profile transmission.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adjustment-card" style={{ borderTop: "4px solid #3498db" }}>
      <h3>👥 Provision New Member Account</h3>
      <p style={{ color: "#7f8c8d", fontSize: "13px", marginBottom: "15px" }}>
        Directly initialize a verified user profile to the database pool.
      </p>

      <form onSubmit={handleCreateUser} className="adjustment-form">
        <div className="form-group">
          <label className="form-label">System Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            placeholder="e.g. JohnDoe"
            className="admin-create-input-unique" /* 🎯 New Isolated Class */
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="e.g. user@wealthbridge.com"
            className="admin-create-input-unique" /* 🎯 New Isolated Class */
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Phone Contact String</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            placeholder="e.g. +234..."
            className="admin-create-input-unique" /* 🎯 New Isolated Class */
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Initial Temp Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            placeholder="••••••••"
            className="admin-create-input-unique" /* 🎯 New Isolated Class */
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="confirm-btn" style={{ background: "#3498db" }}>
            {loading ? "Registering..." : "⚡ Create Member Account"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminCreateUser;