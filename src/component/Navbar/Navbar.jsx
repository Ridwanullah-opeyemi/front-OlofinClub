import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import logo from "../../assets/logo.jpg";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 🎯 Tracks mobile slide menu state

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
    setIsMobileMenuOpen(false); // Auto-close drawer on link click
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="navbar">
      {/* LOGO */}
      <Link to="/" className="nav-logo" onClick={() => setIsMobileMenuOpen(false)}>
        <img src={logo} alt="logo" />
        <div className="logo-text">
          <h2>Olofin Heritage</h2>
          <span>Club</span>
        </div>
      </Link>

      {/* 🎯 HAMBURGER MENU ICON BUTTON */}
      <button 
        className={`hamburger-toggle-menu ${isMobileMenuOpen ? "active" : ""}`} 
        onClick={toggleMobileMenu}
        aria-label="Toggle navigation drawer menu"
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      {/* NAVIGATION LAYOUT PANEL */}
      <div className={`nav-menu-wrapper ${isMobileMenuOpen ? "open" : ""}`}>
        <nav className="nav-links">
          <button onClick={() => scrollToSection("home")}>HOME</button>
          <button onClick={() => scrollToSection("about")}>ABOUT</button>
          <button onClick={() => scrollToSection("rules")}>RULES</button>
        </nav>

        {/* CONTROLS PROFILE BUTTONS */}
        <div className="nav-buttons">
          <Link to="/MembershipRequestForm" onClick={() => setIsMobileMenuOpen(false)}>
            <button className="signup-btn">MRF</button>
          </Link>
          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
            <button className="login-btn">LOGIN</button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;