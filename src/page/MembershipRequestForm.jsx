import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import "./sign.css";
import bg from "../assets/bg.png";
import logo from "../assets/logo.jpg";

function MembershipRequest() {
  const [formData, setFormData] = useState({ username: "", email: "", phone: "", password: "" });
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  
  // 🎯 ADDED: Loading state for handling button disable/enable
  const [loading, setLoading] = useState(false);

  const triggerPopup = (message, type = "success") => {
    setPopup({ show: true, message, type });
    setTimeout(() => {
      setPopup({ show: false, message: "", type: "" });
    }, 4000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    
    // 🎯 1. Turn on loading when the user clicks the button
    setLoading(true);
    triggerPopup("Sending your form to our team...", "info");

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const res = await fetch(`${backendUrl}/api/auth/membership-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        triggerPopup("✨ Request sent! Our club managers will review your info soon.", "success");
        setFormData({ username: "", email: "", phone: "", password: "" });
      } else {
        triggerPopup(data.message || "We could not submit your form.", "error");
      }
    } catch (err) {
      triggerPopup("Cannot connect to the server right now.", "error");
    } finally {
      // 🎯 2. ALWAYS turn off loading here (makes the button clickable again)
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${bg})` }}>
      
      {popup.show && (
        <div className={`toast-notification ${popup.type}`}>
          <div className="toast-content">
            <span className="toast-icon">
              {popup.type === "success" ? "✅" : popup.type === "info" ? "ℹ️" : "❌"}
            </span>
            <p className="toast-text">{popup.message}</p>
          </div>
          <button className="toast-close-btn" onClick={() => setPopup({ ...popup, show: false })}>×</button>
        </div>
      )}

      <div className="login-card">
        
        <Link to="/" className="logo-link" title="Go back to Home">
          <div className="logo-box">
            <img src={logo} alt="Olofin Heritage Club Logo" className="logo" />
          </div>
        </Link>

        <h2>Apply for Membership</h2>
        <p className="membership-subtitle">
          Fill out this simple form to send your profile details to our club board for account approval.
        </p>

        <form onSubmit={handleRequestSubmit}>
          <input 
            type="text" 
            name="username" 
            placeholder="Choose a Username" 
            value={formData.username} 
            onChange={handleChange} 
            className="form-input"
            required 
            disabled={loading} // Blocks input typing during loading
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Your Email Address" 
            value={formData.email} 
            onChange={handleChange} 
            className="form-input"
            required 
            disabled={loading}
          />
          <input 
            type="text" 
            name="phone" 
            placeholder="Your Phone Number" 
            value={formData.phone} 
            onChange={handleChange} 
            className="form-input"
            required 
            disabled={loading}
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Create a Strong Password" 
            value={formData.password} 
            onChange={handleChange} 
            className="form-input"
            required 
            disabled={loading}
          />

          {/* 🎯 BUTTON CONFIGURATION: Changes text and disables clicks dynamically */}
          <button 
            type="submit" 
            className="login-submit-btn" 
            disabled={loading}
          >
            {loading ? (
              <div className="button-loader-wrapper">
                <span className="spinner-circle"></span>
                Submitting...
              </div>
            ) : (
              "Submit Request"
            )}
          </button>
        </form>

        <div className="signup-redirect-text">
          Already have an account? <Link to="/login">Login here</Link>
        </div>

      </div>
    </div>
  );
}

export default MembershipRequest;