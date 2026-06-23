import React from "react";
import "./Hero.css";
import heroBg from "../../assets/hero-bg.png";

function Hero() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="ohc-hero" style={{ backgroundImage: `url(${heroBg})` }}>
      <div className="ohc-hero-overlay">
        <div className="ohc-hero-content">

          {/* Badge */}
          <span className="ohc-hero-badge">
            <span className="ohc-hero-badge-dot" />
            Registered · RC: 7112960 · Heritage Club
          </span>

          {/* Headline */}
          <h1 className="ohc-hero-h1">
            Olofin Heritage<br />
            <span className="ohc-hero-h1-accent">Club.</span>
          </h1>

          {/* Motto */}
          <p className="ohc-hero-motto">THE PEOPLE OF LIKE MIND</p>

          {/* Description */}
          <p className="ohc-hero-desc">
            Olofin Heritage Club is Humanitarian / Welface programed to hospital, orphanage home or the less privileged in our community. — governed by a clear constitution since 2022.
          </p>

          {/* Buttons */}
          <div className="ohc-hero-btns">
            <button className="ohc-hero-btn-primary" onClick={() => scrollTo("about")}>
              Discover the Club
            </button>
            <button className="ohc-hero-btn-ghost" onClick={() => scrollTo("membership")}>
              How to Join
            </button>
          </div>

          {/* Stat strip */}
          <div className="ohc-hero-stats">
            <div className="ohc-hero-stat">
              <span className="ohc-hero-stat-value">₦5,000</span>
              <span className="ohc-hero-stat-label">Monthly Contribution</span>
            </div>
            <div className="ohc-hero-stat-divider" />
            <div className="ohc-hero-stat">
              <span className="ohc-hero-stat-value">₦500</span>
              <span className="ohc-hero-stat-label">Monthly Dues</span>
            </div>
            <div className="ohc-hero-stat-divider" />
            <div className="ohc-hero-stat">
              <span className="ohc-hero-stat-value">2 Loans</span>
              <span className="ohc-hero-stat-label">Soft & Normal</span>
            </div>
          </div>

          {/* Notice */}
          <div className="ohc-hero-notice">
            <span className="ohc-hero-notice-icon">🔒</span>
            <p>
              <strong>Admin-controlled platform.</strong> Only group administrators
              can create accounts, approve deposits, and update wallet records —
              keeping every naira safe and fully audited.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;