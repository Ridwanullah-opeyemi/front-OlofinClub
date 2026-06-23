import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import "./Navbar.css";

const NAV_ITEMS = [
  {
    label: "ABOUT",
    dropdown: [
      {
        heading: "What Olofin Does",
        items: [
          { label: "Our Mission & Vision", anchor: "platforms-rules", desc: "Why we exist and where we are headed" },
          { label: "Club Identity", anchor: "identity", desc: "Name, motto, slogan and registration details" },
          { label: "Aims & Objectives", anchor: "objectives", desc: "Six core goals that guide the club" },
          { label: "Core Values", anchor: "values", desc: "Honesty, auditing and family unity" },
        ],
      },
    ],
  },
  {
    label: "HOW IT WORKS",
    dropdown: [
      {
        heading: "Platform Flow",
        items: [
          { label: "How to Join", anchor: "membership", desc: "Qualification, admission steps and probation" },
          { label: "Contributions & Dues", anchor: "contributions", desc: "Monthly ₦5,000 contribution & ₦500 dues explained" },
          { label: "Loan Benefits", anchor: "loans", desc: "Soft loan and normal loan — who qualifies" },
          { label: "Member Benefits", anchor: "benefits", desc: "Support for sick, deceased and social occasions" },
        ],
      },
    ],
  },
  {
    label: "RULES",
    dropdown: [
      {
        heading: "Club Rules",
        items: [
          { label: "Platform Rules", anchor: "platform-rules", desc: "Admin control, account creation and wallet protection" },
          { label: "Misconduct & Fines", anchor: "misconduct", desc: "Offences, fines from ₦2,000 up to ₦50,000" },
          { label: "Cessation of Membership", anchor: "cessation", desc: "Resignation, death and expulsion procedures" },
          { label: "Special Clause", anchor: "special-clause", desc: "No personal diversion of club funds" },
        ],
      },
    ],
  },
  {
    label: "GOVERNANCE",
    dropdown: [
      {
        heading: "Who Runs the Club",
        items: [
          { label: "Officers & Roles", anchor: "officers", desc: "President, Secretary, Treasurer and more" },
          { label: "Meetings", anchor: "meetings", desc: "AGM, monthly, executive and emergency meetings" },
          { label: "Elections", anchor: "elections", desc: "How officials are elected every 2 years" },
          { label: "Trustees", anchor: "trustees", desc: "Board of up to 5 trustees and their qualifications" },
        ],
      },
    ],
  },
];

function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [navH, setNavH] = useState(72);
  const navRef = useRef(null);

  useEffect(() => {
    if (navRef.current) setNavH(navRef.current.getBoundingClientRect().height);
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenMenu(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  const goTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpenMenu(null);
    setIsMobileOpen(false);
    setMobileExpanded(null);
  };

  const drawer = isMobileOpen
    ? createPortal(
        <div className="ohc-drawer" style={{ top: navH }}>
          <button className="ohc-drawer-home" onClick={() => goTo("home")}>
            <span>Home</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>

          {NAV_ITEMS.map((item) => (
            <div key={item.label} className="ohc-drawer-section">
              <button
                className={`ohc-drawer-trigger ${mobileExpanded === item.label ? "is-open" : ""}`}
                onClick={() => setMobileExpanded((p) => (p === item.label ? null : item.label))}
              >
                <span>{item.label.charAt(0) + item.label.slice(1).toLowerCase()}</span>
                <svg
                  className="ohc-drawer-chevron"
                  width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {mobileExpanded === item.label && (
                <div className="ohc-drawer-body">
                  {item.dropdown[0].items.map((sub) => (
                    <button key={sub.anchor} className="ohc-drawer-sub" onClick={() => goTo(sub.anchor)}>
                      <span className="ohc-drawer-sub-label">{sub.label}</span>
                      <span className="ohc-drawer-sub-desc">{sub.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="ohc-drawer-actions">
            <Link to="/MembershipRequestForm" onClick={() => setIsMobileOpen(false)}>
              <button className="ohc-btn-ghost">Apply to Join</button>
            </Link>
            <Link to="/login" onClick={() => setIsMobileOpen(false)}>
              <button className="ohc-btn-solid">Member Login</button>
            </Link>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <header className="ohc-nav" ref={navRef}>
        {/* Left: vertical accent + logo */}
        <Link to="/" className="ohc-brand" onClick={() => { setIsMobileOpen(false); setOpenMenu(null); }}>
          <div className="ohc-brand-accent" />
          <img src={logo} alt="Olofin Heritage Club" className="ohc-brand-img" />
          <div className="ohc-brand-text">
            <span className="ohc-brand-name">Olofin Heritage</span>
            <span className="ohc-brand-sub">Savings Club · Est. 2020</span>
          </div>
        </Link>

        {/* Center: desktop links */}
        <nav className="ohc-links" aria-label="Main navigation">
          <button className="ohc-link" onClick={() => goTo("home")}>Home</button>

          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className={`ohc-drop-wrap ${openMenu === item.label ? "is-open" : ""}`}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button
                className="ohc-link ohc-link--drop"
                onClick={() => setOpenMenu((p) => (p === item.label ? null : item.label))}
                onMouseEnter={() => setOpenMenu(item.label)}
                aria-expanded={openMenu === item.label}
              >
                {item.label.charAt(0) + item.label.slice(1).toLowerCase()}
                <svg
                  className="ohc-chevron"
                  width="12" height="12" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5"
                  aria-hidden="true"
                >
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {openMenu === item.label && (
                <div className="ohc-drop">
                  <p className="ohc-drop-heading">{item.dropdown[0].heading}</p>
                  {item.dropdown[0].items.map((sub) => (
                    <button key={sub.anchor} className="ohc-drop-item" onClick={() => goTo(sub.anchor)}>
                      <span className="ohc-drop-label">{sub.label}</span>
                      <span className="ohc-drop-desc">{sub.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right: CTA buttons + hamburger */}
        <div className="ohc-right">
          <div className="ohc-ctas">
            <Link to="/MembershipRequestForm">
              <button className="ohc-btn-ghost">Apply</button>
            </Link>
            <Link to="/login">
              <button className="ohc-btn-solid">Login</button>
            </Link>
          </div>

          <button
            className={`ohc-hamburger ${isMobileOpen ? "is-open" : ""}`}
            onClick={() => setIsMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={isMobileOpen}
          >
            <span className="ohc-bar" />
            <span className="ohc-bar" />
            <span className="ohc-bar" />
          </button>
        </div>
      </header>

      {drawer}
    </>
  );
}

export default Navbar;