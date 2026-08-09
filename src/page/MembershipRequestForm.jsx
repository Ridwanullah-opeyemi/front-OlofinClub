import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./sign.css";
import bg from "../assets/bg.png";
import logo from "../assets/logo.jpg";

function MembershipRequest() {

  const [formData, setFormData] = useState({

    // ===========================
    // Account Information
    // ===========================
    username: "",
    email: "",
    phone: "",
    password: "",

    // ===========================
    // Biography Information
    // ===========================
    avatar_url: "",
    position: "",
    town: "",
    state: "",
    country: "",
    occupation: "",
    passion_reason: "",
    age: "",
    family_role: "",

  });

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "",
  });

  const [loading, setLoading] = useState(false);

  // ==========================================
  // Popup Helper
  // ==========================================
  const triggerPopup = (message, type = "success") => {

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

  };

  // ==========================================
  // Handle Inputs
  // ==========================================
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  // ==========================================
  // Submit Membership Request
  // ==========================================
  const handleRequestSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    triggerPopup(
      "Sending your membership application...",
      "info"
    );

    try {

      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const response = await fetch(
        `${backendUrl}/api/auth/membership-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {

        triggerPopup(
          "🎉 Membership application submitted successfully!",
          "success"
        );

        setFormData({

          username: "",
          email: "",
          phone: "",
          password: "",

          avatar_url: "",
          position: "",
          town: "",
          state: "",
          country: "",
          occupation: "",
          passion_reason: "",
          age: "",
          family_role: "",

        });

      } else {

        triggerPopup(
          data.message ||
            "Unable to submit your membership application.",
          "error"
        );

      }

    } catch (err) {

      triggerPopup(
        "Unable to connect to the server.",
        "error"
      );

    } finally {

      setLoading(false);

    }

  };
    return (
    <div
      className="login-container"
      style={{ backgroundImage: `url(${bg})` }}
    >

      {/* ==========================================
          Toast Notification
      =========================================== */}
      {popup.show && (
        <div className={`toast-notification ${popup.type}`}>
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

      {/* ==========================================
          Card
      =========================================== */}
      <div className="login-card">

        <Link
          to="/"
          className="logo-link"
          title="Back to Home"
        >
          <div className="logo-box">
            <img
              src={logo}
              alt="Logo"
              className="logo"
            />
          </div>
        </Link>

        <h2>Membership Application</h2>

        <p className="membership-subtitle">
          Complete the form below to apply for membership in
          Olofin Heritage Club.
        </p>

        <form onSubmit={handleRequestSubmit}>

          {/* ==========================================
              Account Information
          =========================================== */}

          <h3 className="form-section-title">
            Account Information
          </h3>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="form-input"
            required
            disabled={loading}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            required
            disabled={loading}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="form-input"
            required
            disabled={loading}
          />

          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            required
            disabled={loading}
          />

          {/* ==========================================
              Biography Section
          =========================================== */}

          <h3 className="form-section-title">
            Biography Information
          </h3>
                    <input
            type="text"
            name="avatar_url"
            placeholder="Profile Image URL (Optional)"
            value={formData.avatar_url}
            onChange={handleChange}
            className="form-input"
            disabled={loading}
          />

          <input
            type="text"
            name="position"
            placeholder="Position / Title"
            value={formData.position}
            onChange={handleChange}
            className="form-input"
            disabled={loading}
          />

          <input
            type="text"
            name="occupation"
            placeholder="Occupation"
            value={formData.occupation}
            onChange={handleChange}
            className="form-input"
            disabled={loading}
          />

          <input
            type="text"
            name="town"
            placeholder="Town / City"
            value={formData.town}
            onChange={handleChange}
            className="form-input"
            disabled={loading}
          />

          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            className="form-input"
            disabled={loading}
          />

          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            className="form-input"
            disabled={loading}
          />

          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            className="form-input"
            min="1"
            disabled={loading}
          />

          <select
            name="family_role"
            value={formData.family_role}
            onChange={handleChange}
            className="form-input"
            disabled={loading}
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

          <textarea
            name="passion_reason"
            placeholder="Tell us about yourself and why you would like to join Olofin Heritage Club..."
            value={formData.passion_reason}
            onChange={handleChange}
            className="form-input"
            rows={5}
            disabled={loading}
          />

          {/* ==========================================
              Submit Button
          =========================================== */}

          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <div className="button-loader-wrapper">
                <span className="spinner-circle"></span>
                Submitting Application...
              </div>
            ) : (
              "Submit Membership Application"
            )}
          </button>

        </form>

        <div className="signup-redirect-text">
          Already have an account?{" "}
          <Link to="/login">
            Login here
          </Link>
        </div>

      </div>

    </div>
  );
}

export default MembershipRequest;