
import React, { useEffect, useState } from "react";
import "../styles/admin-profile.css";

function AdminProfile({ triggerPopup }) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

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

  const [roleTier, setRoleTier] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser =
          JSON.parse(localStorage.getItem("user")) || {};

        const userId =
          storedUser.id ||
          storedUser.user_id ||
          localStorage.getItem("userId");

        if (!userId) {
          setMessage({
            type: "error",
            text: "Unable to identify your account.",
          });
          return;
        }

        setRoleTier(storedUser.role_tier || "admin");

        const response = await fetch(
          `${backendUrl}/api/user/${userId}/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load profile."
          );
        }

        const profile = data.data || data.user;

        if (!profile) {
          throw new Error("Profile information was not found.");
        }

        setFormData({
          username: profile.username || "",
          email: profile.email || "",
          password: "",
          avatar_url: profile.avatar_url || "",
          position: profile.position || "",
          occupation: profile.occupation || "",
          town: profile.town || "",
          state: profile.state || "",
          country: profile.country || "",
          age: profile.age || "",
          family_role: profile.family_role || "",
          passion_reason: profile.passion_reason || "",
        });

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...storedUser,
            ...profile,
          })
        );
      } catch (error) {
        console.error(error);

        setMessage({
          type: "error",
          text: error.message || "Failed to load profile.",
        });
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [backendUrl, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        `${backendUrl}/api/user/update-profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update profile."
        );
      }

      setMessage({
        type: "success",
        text: "Your profile has been updated successfully.",
      });

      const storedUser =
        JSON.parse(localStorage.getItem("user")) || {};

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          ...(data.user || formData),
        })
      );

      setFormData((prev) => ({
        ...prev,
        password: "",
      }));

      if (typeof triggerPopup === "function") {
        triggerPopup(
          "Profile updated successfully.",
          "success"
        );
      }
    } catch (error) {
      console.error(error);

      setMessage({
        type: "error",
        text:
          error.message ||
          "Something went wrong while saving your profile.",
      });

      if (typeof triggerPopup === "function") {
        triggerPopup(
          error.message || "Failed to update profile.",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const formattedRole = roleTier
    ? roleTier
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : "Administrator";

  const initials =
    formData.username
      ?.trim()
      ?.split(" ")
      ?.map((word) => word[0])
      ?.join("")
      ?.slice(0, 2)
      ?.toUpperCase() || "AD";

  return (
    <div className="admin-profile-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="admin-profile-page-header">
        <div>
          <div className="admin-breadcrumb">
            Administration <span>/</span> Profile Settings
          </div>

          <h2>Profile Settings</h2>

          <p>
            Manage your administrator information and account
            preferences.
          </p>
        </div>
      </div>

      {/* =====================================================
          ALERT
      ===================================================== */}

      {message && (
        <div
          className={`admin-profile-alert ${message.type}`}
        >
          <span className="admin-alert-icon">
            {message.type === "success" ? "✓" : "!"}
          </span>

          <span>{message.text}</span>
        </div>
      )}

      {/* =====================================================
          PROFILE HERO
      ===================================================== */}

      <div className="admin-profile-hero">

        <div className="admin-profile-avatar-wrap">

          {formData.avatar_url ? (
            <img
              src={formData.avatar_url}
              alt="Administrator"
              className="admin-profile-avatar"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextSibling.style.display = "flex";
              }}
            />
          ) : null}

          <div
            className="admin-profile-avatar-fallback"
            style={{
              display: formData.avatar_url ? "none" : "flex",
            }}
          >
            {initials}
          </div>

          <span className="admin-online-dot" />
        </div>

        <div className="admin-profile-hero-info">

          <div className="admin-profile-name-row">
            <h1>
              {formData.username || "Administrator"}
            </h1>

            <span className="admin-verified-badge">
              ✓ Verified Admin
            </span>
          </div>

          <p className="admin-profile-email">
            {formData.email || "Administrator account"}
          </p>

          <div className="admin-profile-meta">
            <span>
              <strong>Role</strong>
              {formattedRole}
            </span>

            {formData.position && (
              <span>
                <strong>Position</strong>
                {formData.position}
              </span>
            )}

            {formData.country && (
              <span>
                <strong>Location</strong>
                {formData.country}
              </span>
            )}
          </div>
        </div>

        <div className="admin-profile-status">
          <span className="admin-status-dot" />
          Account Active
        </div>

      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <form
        onSubmit={handleSubmit}
        className="admin-profile-layout"
      >

        {/* ===================================================
            LEFT COLUMN
            =================================================== */}

        <div className="admin-profile-main">

          {/* PERSONAL INFORMATION */}

          <section className="admin-settings-card">

            <div className="admin-card-header">
              <div className="admin-card-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M5 20c.7-4 3-6 7-6s6.3 2 7 6" />
                </svg>
              </div>

              <div>
                <h3>Personal Information</h3>
                <p>
                  Your basic profile information.
                </p>
              </div>
            </div>

            <div className="admin-form-grid">

              <div className="admin-field">
                <label>Username</label>

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  required
                />
              </div>

              <div className="admin-field">
                <label>Email Address</label>

                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="admin-input-disabled"
                />

                <small>
                  Email address cannot be changed here.
                </small>
              </div>

              <div className="admin-field">
                <label>Position / Title</label>

                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="e.g. President"
                />
              </div>

              <div className="admin-field">
                <label>Occupation</label>

                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="Your occupation"
                />
              </div>

            </div>

          </section>

          {/* LOCATION */}

          <section className="admin-settings-card">

            <div className="admin-card-header">
              <div className="admin-card-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </div>

              <div>
                <h3>Location & Personal Details</h3>
                <p>
                  Keep your personal information up to date.
                </p>
              </div>
            </div>

            <div className="admin-form-grid">

              <div className="admin-field">
                <label>Town / City</label>

                <input
                  type="text"
                  name="town"
                  value={formData.town}
                  onChange={handleChange}
                  placeholder="Town or city"
                />
              </div>

              <div className="admin-field">
                <label>State</label>

                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                />
              </div>

              <div className="admin-field">
                <label>Country</label>

                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
                />
              </div>

              <div className="admin-field">
                <label>Age</label>

                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="1"
                  placeholder="Age"
                />
              </div>

              <div className="admin-field admin-full-field">
                <label>Family Role</label>

                <select
                  name="family_role"
                  value={formData.family_role}
                  onChange={handleChange}
                >
                  <option value="">
                    Select family role
                  </option>
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

            </div>

          </section>

          {/* ABOUT */}

          <section className="admin-settings-card">

            <div className="admin-card-header">
              <div className="admin-card-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M4 5h16M4 12h16M4 19h10" />
                </svg>
              </div>

              <div>
                <h3>About You</h3>
                <p>
                  Tell members a little about yourself.
                </p>
              </div>
            </div>

            <div className="admin-field">
              <label>
                Biography / Passion
              </label>

              <textarea
                name="passion_reason"
                value={formData.passion_reason}
                onChange={handleChange}
                rows={6}
                placeholder="Write something about yourself..."
              />
            </div>

          </section>

          {/* SECURITY */}

          <section className="admin-settings-card">

            <div className="admin-card-header">
              <div className="admin-card-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect
                    x="5"
                    y="10"
                    width="14"
                    height="10"
                    rx="2"
                  />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
              </div>

              <div>
                <h3>Security</h3>
                <p>
                  Change your password when necessary.
                </p>
              </div>
            </div>

            <div className="admin-field">
              <label>New Password</label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
              />

              <small>
                For security, use a strong password that
                you do not use elsewhere.
              </small>
            </div>

          </section>

        </div>

        {/* ===================================================
            RIGHT SIDEBAR
            =================================================== */}

        <aside className="admin-profile-sidebar">

          {/* PROFILE IMAGE */}

          <section className="admin-side-card">

            <div className="admin-side-title">
              Profile Photo
            </div>

            <div className="admin-large-avatar">

              {formData.avatar_url ? (
                <img
                  src={formData.avatar_url}
                  alt="Profile"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                initials
              )}

            </div>

            <div className="admin-field admin-avatar-field">
              <label>Image URL</label>

              <input
                type="text"
                name="avatar_url"
                value={formData.avatar_url}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            <p className="admin-photo-note">
              Use a clear professional image. Your profile
              photo may be visible to authorized members.
            </p>

          </section>

          {/* ACCOUNT STATUS */}

          <section className="admin-side-card">

            <div className="admin-side-title">
              Account Overview
            </div>

            <div className="admin-overview-row">
              <span>Account Type</span>
              <strong>Administrator</strong>
            </div>

            <div className="admin-overview-row">
              <span>Role</span>
              <strong>{formattedRole}</strong>
            </div>

            <div className="admin-overview-row">
              <span>Status</span>

              <span className="admin-active-label">
                Active
              </span>
            </div>

          </section>

          {/* SAVE */}

          <section className="admin-save-card">

            <div className="admin-save-icon">
              ✓
            </div>

            <div>
              <h4>Ready to save?</h4>

              <p>
                Your changes will be applied to your
                administrator profile.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="admin-save-btn"
            >
              {loading ? (
                <>
                  <span className="admin-spinner" />
                  Saving...
                </>
              ) : (
                <>
                  Save Changes
                  <span>→</span>
                </>
              )}
            </button>

          </section>

        </aside>

      </form>

    </div>
  );
}

export default AdminProfile;
