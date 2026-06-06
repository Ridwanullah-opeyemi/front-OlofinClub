import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./sign.css"; 

import bg from "../assets/bg.png";
import logo from "../assets/logo.jpg";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [forgotEmail, setForgotEmail] = useState(""); // 🎯 Separate input state for password recovery
  const [isForgotPasswordView, setIsForgotPasswordView] = useState(false); // 🎯 Toggle view layout state
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 🎯 Toast Notification State
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const triggerPopup = (message, type = "success") => {
    setPopup({ show: true, message, type });
    setTimeout(() => {
      setPopup({ show: false, message: "", type: "" });
    }, 4000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // ⚙️ AUTH PIPELINE: Handles Normal User Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong during login.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      triggerPopup("Authentication valid! Redirecting...", "success");

      const administrativeTiers = ["main_admin", "admin", "chief", "senator"];
      
      setTimeout(() => {
        if (administrativeTiers.includes(data.user.role_tier)) {
          navigate("/admin-dashboard");
        } else {
          navigate("/dashboard");
        }
      }, 1000);

    } catch (err) {
      triggerPopup(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // ⚙️ RECOVERY PIPELINE: Handles Forgot Password Email Submissions
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to issue password recovery token.");
      }

      triggerPopup(data.message, "success");
      setForgotEmail(""); // Clean recovery text field input
      setIsForgotPasswordView(false); // Switch user layout back to normal login view

    } catch (err) {
      triggerPopup(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${bg})` }}>
      
      {/* 🔔 FLOATING TOAST POPOUT MESSAGES */}
      {popup.show && (
        <div className={`toast-notification ${popup.type}`}>
          <div className="toast-content">
            <span className="toast-icon">
              {popup.type === "success" ? "✅" : "❌"}
            </span>
            <p className="toast-text">{popup.message}</p>
          </div>
          <button className="toast-close-btn" onClick={() => setPopup({ ...popup, show: false })}>×</button>
        </div>
      )}

      <div className="login-card">
        <Link to="/">
          <div className="logo-box">
            <img src={logo} alt="logo" className="logo" />
          </div>
        </Link>

        {/* 🎯 CONDITIONAL VIEW RENDERING SWITCH */}
        {!isForgotPasswordView ? (
          <>
            <h2>Welcome Back</h2>
            <p className="login-subtitle">Login to continue to your account</p>

            <form onSubmit={handleLogin}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className="form-input"
                style={{ color: "#ffffff" }}
                required
              />

              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="password-field-input"
                  style={{ color: "#ffffff" }}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="password-toggle-btn"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* 🎯 FORGOT PASSWORD INTERFACE LINK */}
              <div style={{ textAlign: "right", margin: "-5px 0 15px 0" }}>
                <span 
                  onClick={() => setIsForgotPasswordView(true)} 
                  style={{ color: "#e67e22", cursor: "pointer", fontSize: "13px", fontWeight: "500" }}
                >
                  Forgot Password?
                </span>
              </div>

              <button type="submit" disabled={loading} className="login-submit-btn">
                {loading ? "Authenticating..." : "Login"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2>Recover Password</h2>
            <p className="login-subtitle">Enter your email to receive a password reset link</p>

            <form onSubmit={handleForgotPasswordSubmit}>
              <input
                type="email"
                placeholder="Enter registered email address"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                disabled={loading}
                className="form-input"
                style={{ color: "#ffffff", marginBottom: "15px" }}
                required
              />

              <button type="submit" disabled={loading} className="login-submit-btn">
                {loading ? "Sending link..." : "Send Reset Link"}
              </button>

              <div style={{ textAlign: "center", marginTop: "15px" }}>
                <span 
                  onClick={() => setIsForgotPasswordView(false)} 
                  style={{ color: "#ffffff", cursor: "pointer", fontSize: "13px", textDecoration: "underline" }}
                >
                  Back to Login
                </span>
              </div>
            </form>
          </>
        )}

        <p className="signup-redirect-text">
          Want to become a member? <Link to="/request-membership">Apply Here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;