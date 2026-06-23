import React, { useState } from "react";
import "./About.css";

// All content sourced from the Olofin Heritage Club Constitution PDF
const ABOUT_CARDS = [
  {
    id: "mission",
    icon: "🎯",
    title: "Mission & Vision",
    summary: "Why we exist and where we are headed",
    content: {
      heading: "Our Mission & Vision",
      body: [
        "Olofin Heritage Club (OHC) is a non-profit, non-political, and indigenous organization established by sons and daughters of Kajola to promote unity, cultural preservation, community development, and the welfare of its members.",
        "Our mission is to foster meaningful relationships among members while contributing positively to the social, educational, economic, and infrastructural development of Kajola and its surrounding communities.",
        "Through collaboration, service, and community engagement, we strive to create opportunities that improve the quality of life for our people and preserve the rich heritage and values of our land for future generations.",
        "Olofin Heritage Club remains committed to promoting peace, mutual support, leadership, and collective progress, working together to build a stronger and more prosperous Kajola for all.",
      ],
    },
  },
  {
    id: "identity",
    icon: "🏛️",
    title: "Club Identity",
    summary: "Name, motto, slogan and registration details",
    content: {
      heading: "Club Identity",
      table: [
        { label: "Full Name", value: "Olofin Heritage Club of Nigeria" },
        { label: "RC Number", value: "RC: 7112960" },
        { label: "Bank Account", value: "1310808368 — Zenith Bank" },
        { label: "Secretariat", value: "Okeho, Oyo State" },
        { label: "Motto", value: "ONE LOVE KEEP US TOGETHER" },
        { label: "Slogan", value: "People of Like Mind" },
        { label: "Type", value: "Non-religious, Non-tribal, Non-political, Non-governmental" },
        { label: "Constitution", value: "Dated August 2024" },
      ],
    },
  },
  {
    id: "objectives",
    icon: "📋",
    title: "Aims & Objectives",
    summary: "Six core goals that guide everything we do",
    content: {
      heading: "Aims & Objectives",
      list: [
        "Establish high and reputable friendship that will help members see themselves as one.",
        "Promote the general interest of the members and extend its usefulness for the good of our communities.",
        "Promote advancement of knowledge in wealth creation, future security, dreams realisation and developmental programs.",
        "Initiate and consider any legislation relevant to the objects of the club.",
        "Engage in any other lawful activities conducive to the promotion of the club's objectives, for profit or non-profit purposes.",
        "Have respect for every member's personality.",
      ],
    },
  },
  {
    id: "values",
    icon: "💎",
    title: "Core Values",
    summary: "Honesty, auditing and family unity",
    content: {
      heading: "Core Values",
      values: [
        {
          icon: "📖",
          name: "Absolute Honesty",
          desc: "Every single naira that enters the club is immediately recorded on an open ledger. No hidden fees, no secret transactions, zero guesswork.",
        },
        {
          icon: "🔍",
          name: "Careful Auditing",
          desc: "Admin teams run constant checks on all database inputs, matching every digital record against real-world bank statements.",
        },
        {
          icon: "🤝",
          name: "Total Family Unity",
          desc: "All members are treated with equal respect and kept fully informed of how their contributions are being handled at all times.",
        },
      ],
    },
  },
  {
    id: "platform-rules",
    icon: "🛡️",
    title: "Platform Rules",
    summary: "Admin control, account creation and wallet protection",
    content: {
      heading: "Platform Rules",
      list: [
        "Only a verified system administrator can add a new user account. Self-registration is not permitted.",
        "Every profile remains locked until an admin cross-checks physical registration details and manually activates the account.",
        "Members cannot change their own wallet balances. Only an admin can update your wallet after verifying a real bank receipt.",
        "Only authorised administrators have the power to delete a member's data from the platform.",
        "Members can only view their own wallet info, saving progress and transaction history — never another member's balance.",
      ],
    },
  },
  {
    id: "officers",
    icon: "👥",
    title: "Officers & Roles",
    summary: "President, Secretary, Treasurer and more",
    content: {
      heading: "Officers of the Club",
      roles: [
        { name: "President", duty: "Presides over all meetings and events; category 'A' signatory to the club's account; gives annual stewardship report." },
        { name: "Vice President", duty: "Assists the President and assumes full capacity in his absence; Chairman of the Financial Committee." },
        { name: "General Secretary", duty: "Records all meeting proceedings; summons meetings in consultation with the President; jointly signs adopted minutes." },
        { name: "Assistant Secretary", duty: "Assists the Secretary in all duties and acts in full capacity during absence." },
        { name: "Financial Secretary", duty: "Collects all fees, levies and monies; category 'B' signatory; prepares annual financial reports." },
        { name: "Treasurer", duty: "Safeguards the club's money; issues receipts; deposits all meeting funds to the club's account within 3 days." },
        { name: "PRO", duty: "Handles all public statements, communications, publications and social media for the club." },
        { name: "Welfare Officer", duty: "Responsible for general welfare; arranges member travel for club activities; chairs the welfare committee." },
      ],
    },
  },
];

function Modal({ card, onClose }) {
  if (!card) return null;
  const { content } = card;

  return (
    <div className="ohc-modal-backdrop" onClick={onClose} >
      <div className="ohc-modal" onClick={(e) => e.stopPropagation()}>
        <button className="ohc-modal-close" onClick={onClose} aria-label="Close">✕</button>
        <h2 className="ohc-modal-title">{content.heading}</h2>

        {/* Plain paragraphs */}
        {content.body && content.body.map((p, i) => (
          <p key={i} className="ohc-modal-para">{p}</p>
        ))}

        {/* Identity table */}
        {content.table && (
          <div className="ohc-modal-table">
            {content.table.map((row) => (
              <div key={row.label} className="ohc-modal-row">
                <span className="ohc-modal-label">{row.label}</span>
                <span className="ohc-modal-value">{row.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Numbered list */}
        {content.list && (
          <ol className="ohc-modal-list">
            {content.list.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        )}

        {/* Values */}
        {content.values && (
          <div className="ohc-modal-values">
            {content.values.map((v) => (
              <div key={v.name} className="ohc-modal-value-row">
                <span className="ohc-modal-value-icon">{v.icon}</span>
                <div>
                  <strong>{v.name}</strong>
                  <p>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Roles */}
        {content.roles && (
          <div className="ohc-modal-roles">
            {content.roles.map((r) => (
              <div key={r.name} className="ohc-modal-role-row">
                <span className="ohc-modal-role-name">{r.name}</span>
                <p className="ohc-modal-role-duty">{r.duty}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function About() {
  const [activeCard, setActiveCard] = useState(null);

  return (
    <section id="about" className="ohc-about">
      {/* Section header */}
      <div className="ohc-about-header">
        <span className="ohc-about-eyebrow">About Olofin Heritage Club</span>
        <h2 className="ohc-about-title">Built on Trust, Guided by a Constitution</h2>
        <p className="ohc-about-lead">
          A registered Nigerian savings club where members pool resources, support each
          other, and grow wealth together — governed by a clear constitution since 2022.
          Tap any card to read the full details.
        </p>
      </div>

      {/* Clickable cards grid */}
      <div className="ohc-about-grid">
        {ABOUT_CARDS.map((card) => (
          <button
            key={card.id}
            className="ohc-about-card"
            onClick={() => setActiveCard(card)}
            aria-label={`Read more about ${card.title}`}
          >
            <span className="ohc-about-card-icon">{card.icon}</span>
            <h3 className="ohc-about-card-title">{card.title}</h3>
            <p className="ohc-about-card-summary">{card.summary}</p>
            <span className="ohc-about-card-cta">Read more →</span>
          </button>
        ))}
      </div>

      {/* Modal */}
      <Modal card={activeCard} onClose={() => setActiveCard(null)} />
    </section>
  );
}

export default About;