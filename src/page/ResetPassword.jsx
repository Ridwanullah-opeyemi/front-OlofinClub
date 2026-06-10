import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./sign.css";

import bg from "../assets/bg.png";
import logo from "../assets/logo.jpg";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "",
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

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

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      return triggerPopup(
        "Password must be at least 6 characters.",
        "error"
      );
    }

    if (newPassword !== confirmPassword) {
      return triggerPopup(
        "Passwords do not match.",
        "error"
      );
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${backendUrl}/api/auth/reset-password/${token}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Password reset process failed."
        );
      }

      triggerPopup(
        "Password updated successfully. Redirecting to login...",
        "success"
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      triggerPopup(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      {popup.show && (
        <div
          className={`toast-notification ${popup.type}`}
        >
          <div className="toast-content">
            <span className="toast-icon">
              {popup.type === "success"
                ? "✅"
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

      <div className="login-card">
        <Link to="/">
          <div className="logo-box">
            <img
              src={logo}
              alt="logo"
              className="logo"
            />
          </div>
        </Link>

        <h2>Reset Password</h2>

        <p className="login-subtitle">
          Create a new secure password for your
          account
        </p>

        <form onSubmit={handleResetPassword}>
          <div className="password-input-wrapper">
            <input
              type={
                showPassword ? "text" : "password"
              }
              placeholder="New Password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              className="password-field-input"
              style={{ color: "#ffffff" }}
              required
            />
          </div>

          <div className="password-input-wrapper">
            <input
              type={
                showPassword ? "text" : "password"
              }
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              className="password-field-input"
              style={{ color: "#ffffff" }}
              required
            />
          </div>

          <div
            style={{
              textAlign: "right",
              marginBottom: "15px",
            }}
          >
            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="password-toggle-btn"
            >
              {showPassword
                ? "Hide Password"
                : "Show Password"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-submit-btn"
          >
            {loading
              ? "Updating Password..."
              : "Reset Password"}
          </button>
        </form>

        <p className="signup-redirect-text">
          Remember your password?{" "}
          <Link to="/login">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;