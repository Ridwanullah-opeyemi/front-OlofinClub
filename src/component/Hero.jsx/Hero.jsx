import React from "react";
import "./Hero.css";

import heroBg from "../../assets/hero-bg.png";

function Hero() {
  // Smooth scroll helper to jump directly to sections on the landing page
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="home"
      className="hero"
      style={{
        backgroundImage: `url(${heroBg})`,
      }}
    >
      <div className="hero-overlay">
        <div className="hero-content">
          
          <span className="hero-badge">
            TRUSTED CLUB FOR SAVING TOGETHER
          </span>

          <h1>
            SAVE YOUR MONEY AND GROW SECURELY WITH US
          </h1>

          <p>
            Welcome to Olofin Heritage Club. We provide a safe, simple, and honest 
            space where members can save money together, request quick group help, 
            and track their financial progress without any worries.
          </p>

          <div className="hero-btns">
            <button 
              className="primary-btn"
              onClick={() => scrollToSection("about")}
            >
              Learn More
            </button>

            <button 
              className="secondary-btn"
              onClick={() => scrollToSection("rules")}
            >
              Club Rules
            </button>
          </div>

          <div className="notice-card">
            <h4>IMPORTANT NOTICE</h4>
            <p>
              To protect our funds, only group administrators are allowed to create 
              accounts, approve deposits, change money records, or remove users 
              from this network.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;