// LandingPage.jsx

import React from "react";
import { Link } from "react-router-dom";

import "./LandingPage.css";

import logo from "../assets/logo.png";
import bg from "../assets/bg.png";

export default function LandingPage() {
  return (
    <div
      className="landing-page"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-logo">
          <img src={logo} alt="logo" />
          <div>
            <h2>Olofin Heritage Club</h2>
            <span>Contribution</span>
          </div>
        </div>

        <div className="nav-links">
          <a href="#about">ABOUT</a>
          <a href="#rules">RULES</a>
          <a href="#general">
            GENERAL INFO
          </a>

          <Link to="/">
            <button className="login-btn">
              LOGIN
            </button>
          </Link>
        </div>
      </nav>

      {/* NOTICE */}
      <div className="notice-bar">
        <strong>Notice:</strong> Only
        Admins can create new user
        accounts and delete users.
        All new account creations and
        user deletions are handled by
        Platform Administration.
      </div>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="overlay">
          <h1>
            EMPOWERING COMMUNITY
            GROWTH:
            <br />
            WEALTHBRIDGE
            CONTRIBUTION
          </h1>

          <p>
            A transparent and
            controlled platform for
            communal financial
            support.
          </p>

          <button>
            HOW IT WORKS
          </button>
        </div>
      </section>

      {/* ABOUT & RULES */}
      <section
        className="info-section"
        id="about"
      >
        <div className="left-info">
          <h2>
            ABOUT & OPERATIONAL
            RULES
          </h2>

          <div className="glass-card">
            <h3>Platform Mission:</h3>

            <p>
              To provide a secure,
              transparent, and
              manageable environment
              for collective financial
              contribution and growth,
              guided by core principles
              of integrity and
              community trust.
            </p>
          </div>

          <div
            className="glass-card"
            id="rules"
          >
            <h3>Platform Rules:</h3>

            <ol>
              <li>
                Only Admin is
                permitted to sign up
                (create) new users.
              </li>

              <li>
                Only Admin can delete
                users.
              </li>

              <li>
                Admin manages and
                approves all monetary
                contributions.
              </li>

              <li>
                User sign-up requests
                must be sent to the
                Platform Administrator
                for approval.
              </li>
            </ol>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="right-info">
          <h2>
            ROLE CAPABILITIES &
            FEATURES
          </h2>

          <div className="role-boxes">
            {/* ADMIN */}
            <div className="role-card">
              <h3>ADMIN FUNCTIONS</h3>

              <ul>
                <li>
                  Create & Delete
                  Users
                </li>

                <li>
                  Approve User
                  Contributions
                </li>

                <li>
                  View All User
                  Details & All
                  Contributions
                </li>

                <li>
                  Update User Status
                </li>
              </ul>
            </div>

            {/* USER */}
            <div className="role-card">
              <h3>USER FUNCTIONS</h3>

              <ul>
                <li>
                  View General
                  Platform
                  Notifications
                </li>

                <li>
                  View Only Own
                  Account Balance
                </li>

                <li>
                  View Own
                  Transaction
                  History
                </li>

                <li>
                  Group Chat / Direct
                  Messaging
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM CONTROLS */}
      <section
        className="controls-section"
        id="general"
      >
        <h2>PLATFORM CONTROLS</h2>

        <div className="controls-grid">

          <div className="control-card">
            <h3>ADMIN CONTROLS</h3>

            <ul>
              <li>
                Create/Delete User
                Accounts
              </li>

              <li>
                Change User Status
              </li>

              <li>
                Approve Contributions
              </li>
            </ul>
          </div>

          <div className="control-card">
            <h3>USER CONTROLS</h3>

            <ul>
              <li>
                View Private Balance
              </li>

              <li>
                View Private
                Transaction History
              </li>

              <li>
                Access Community
                Chat
              </li>
            </ul>
          </div>

        </div>
      </section>
    </div>
  );
}