import React, { useEffect, useState } from "react";
import "../styles/member-profile.css";

function MemberProfile() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  // ==========================================================
  // Profile State
  // ==========================================================
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    avatar_url: "",
    position: "",
    occupation: "",
    town: "",
    state: "",
    country: "",
    age: "",
    family_role: "",
    passion_reason: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // ==========================================================
  // Fetch Existing User Profile on Mount
  // ==========================================================
  useEffect(() => {
    const fetchUserProfile = async () => {
      // 1. Get stored user object from localStorage
      const storedUser = JSON.parse(localStorage.getItem("user")) || {};

      // 2. Fallback check for user ID in different formats
      const userId =
        storedUser.id || storedUser.user_id || localStorage.getItem("userId");

      if (!userId) {
        console.warn(
          "No user ID found! Make sure data.user.id is saved to localStorage on login."
        );
        return;
      }

      try {
        // Fetch full profile from GET /api/user/:id/profile
        const response = await fetch(`${backendUrl}/api/user/${userId}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && (data.data || data.user)) {
          const userProfile = data.data || data.user;

          // Populate component state with ALL backend fields
          setFormData({
            username: userProfile.username || "",
            email: userProfile.email || "",
            password: "",
            avatar_url: userProfile.avatar_url || "",
            position: userProfile.position || "",
            occupation: userProfile.occupation || "",
            town: userProfile.town || "",
            state: userProfile.state || "",
            country: userProfile.country || "",
            age: userProfile.age || "",
            family_role: userProfile.family_role || "",
            passion_reason: userProfile.passion_reason || "",
          });

          // Keep localStorage updated with complete user info
          localStorage.setItem(
            "user",
            JSON.stringify({ ...storedUser, ...userProfile })
          );
        }
      } catch (err) {
        console.error("Failed to fetch profile details:", err);
      }
    };

    if (token) {
      fetchUserProfile();
    }
  }, [backendUrl, token]);

  // ==========================================================
  // Handle Inputs
  // ==========================================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================================
  // Update Profile
  // ==========================================================
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
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update profile.");
      }

      setMessage({
        type: "success",
        text: "Profile updated successfully.",
      });

      // Keep localStorage synced with returned user data
      if (data.user) {
        const storedUser = JSON.parse(localStorage.getItem("user")) || {};
        localStorage.setItem(
          "user",
          JSON.stringify({ ...storedUser, ...data.user })
        );
      }

      setFormData((prev) => ({
        ...prev,
        password: "",
      }));
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h2>Member Profile</h2>
      <p className="profile-subtitle">
        Manage your personal information and account settings.
      </p>

      {message && (
        <div className={`alert-box ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="profile-card">
        <form onSubmit={handleUpdateProfile} className="profile-form">
          {/* Account Information */}
          <h3 className="profile-section-title">Account Information</h3>

          <div className="profile-group">
            <label className="profile-label">Email Address</label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="profile-input disabled-field"
            />
          </div>

          <div className="profile-group">
            <label className="profile-label">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="profile-input"
              required
            />
          </div>

          <div className="profile-group">
            <label className="profile-label">New Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              className="profile-input"
            />
          </div>

          {/* Biography Information */}
          <h3 className="profile-section-title">Biography Information</h3>

          <div className="profile-group">
            <label className="profile-label">Avatar URL</label>
            <input
              type="text"
              name="avatar_url"
              value={formData.avatar_url}
              onChange={handleChange}
              placeholder="https://..."
              className="profile-input"
            />
          </div>

          <div className="profile-group">
            <label className="profile-label">Position / Title</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="profile-input"
            />
          </div>

          <div className="profile-group">
            <label className="profile-label">Occupation</label>
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              className="profile-input"
            />
          </div>

          <div className="profile-group">
            <label className="profile-label">Town / City</label>
            <input
              type="text"
              name="town"
              value={formData.town}
              onChange={handleChange}
              className="profile-input"
            />
          </div>

          <div className="profile-group">
            <label className="profile-label">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="profile-input"
            />
          </div>

          <div className="profile-group">
            <label className="profile-label">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="profile-input"
            />
          </div>

          <div className="profile-group">
            <label className="profile-label">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="1"
              className="profile-input"
            />
          </div>

          <div className="profile-group">
            <label className="profile-label">Family Role</label>
            <select
              name="family_role"
              value={formData.family_role}
              onChange={handleChange}
              className="profile-input"
            >
              <option value="">Select Family Role</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Son">Son</option>
              <option value="Daughter">Daughter</option>
              <option value="Brother">Brother</option>
              <option value="Sister">Sister</option>
              <option value="Guardian">Guardian</option>
            </select>
          </div>

          <div className="profile-group">
            <label className="profile-label">About You / Passion</label>
            <textarea
              name="passion_reason"
              value={formData.passion_reason}
              onChange={handleChange}
              rows={5}
              className="profile-input profile-textarea"
              placeholder="Tell other members about yourself..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="save-profile-btn"
          >
            {loading ? "Saving Changes..." : "Save Profile Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default MemberProfile;