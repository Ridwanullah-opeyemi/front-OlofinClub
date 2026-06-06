import React, { useState, useEffect } from "react";
import "../styles/member-profile.css"; // 🔥 Strictly handling formatting externally

function MemberProfile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // Populate current active cache profile context data parameters
    if (storedUser) {
      setUsername(storedUser.username || "");
      setEmail(storedUser.email || "");
    }
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${backendUrl}/api/user/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: "Profile details written successfully!" });
        setPassword(""); // Clear input field area
        
        // Update browser local storage context so layout displays the new name
        const updatedUser = { ...storedUser, username: data.user.username };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        throw new Error(data.message || "Failed to alter profiling indexes.");
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h2>Account Security & Settings</h2>
      <p className="profile-subtitle">Manage your personal identification parameters and platform interface password security settings.</p>

      {message && (
        <div className={`alert-box ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="profile-card">
        <h3>Edit Personal Information</h3>
        <form onSubmit={handleUpdateProfile} className="profile-form">
          
          <div className="profile-group">
            <label className="profile-label">Email Address (Locked Reference)</label>
            <input 
              type="email" 
              value={email} 
              className="profile-input disabled-field" 
              disabled 
            />
          </div>

          <div className="profile-group">
            <label className="profile-label">Account Display Name</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="profile-input"
              required 
            />
          </div>

          <div className="profile-group">
            <label className="profile-label">New Password (Leave blank to keep current)</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              className="profile-input"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="save-profile-btn"
          >
            {loading ? "Processing Updates..." : "Save Profile Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default MemberProfile;