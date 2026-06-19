// home.jsx — Olofin Heritage Club Landing Page
// All sections match dropdown anchor IDs in Navbar.jsx

import React from "react";
import Hero from "../component/Hero.jsx/Hero";
import About from "../component/About/About";
import "./home.css";
import Navbar from "../component/nav/Navbar";

function Home() {
  return (
    <div className="home-root">
      <Navbar />
      <Hero />

      {/* ─── MEMBERSHIP ─── */}
      <section id="membership" className="info-section">
        <h2 className="section-title">How to Join</h2>
        <p className="section-lead">
          Olofin Heritage Club is open to mature men and women of reputable
          character, aged 30 years and above.
        </p>
        <div className="card-grid">
          <div className="info-card">
            <h3>Admission Requirements</h3>
            <ul>
              <li>Application and interview with the Screening Committee</li>
              <li>Two financially up-to-date members must guarantee you</li>
              <li>At least 2/3 of existing members must support your entry</li>
              <li>
                Admission fee as decided by the general house from time to time
              </li>
            </ul>
          </div>
          <div className="info-card">
            <h3>Probation Period</h3>
            <p>
              Every new member is placed on probation for a period covering{" "}
              <strong>4 consecutive club meetings</strong>. Missing all 4
              meetings on probation results in automatic loss of membership.
            </p>
          </div>
          <div className="info-card">
            <h3>Re-admission</h3>
            <p>
              A former member may rejoin by writing to the club, clearing all
              outstanding debts, settling with guarantors, paying any applicable
              fines, and receiving a simple majority vote of approval at a
              general meeting.
            </p>
          </div>
        </div>
      </section>

      {/* ─── CONTRIBUTIONS ─── */}
      <section id="contributions" className="info-section alt-bg">
        <h2 className="section-title">Contributions & Monthly Dues</h2>
        <p className="section-lead">
          Every financially active member must keep their contributions and dues
          up to date. Carry-overs attract automatic fines.
        </p>
        <div className="card-grid three-col">
          <div className="stat-card">
            <span className="stat-value">₦5,000</span>
            <span className="stat-label">Minimum Monthly Contribution</span>
            <p>
              Must be paid within each quarter. Carrying over to the following
              quarter attracts a <strong>₦1,000 fine</strong>.
            </p>
          </div>
          <div className="stat-card">
            <span className="stat-value">₦500</span>
            <span className="stat-label">Monthly Dues</span>
            <p>
              Must also be paid within the quarter. Carry-over fine is{" "}
              <strong>₦500</strong>.
            </p>
          </div>
          <div className="stat-card">
            <span className="stat-value">Sources</span>
            <span className="stat-label">How the Club Raises Funds</span>
            <p>
              Dues, levies, fines, application form proceeds, investment
              returns, bank interest, and loan interest.
            </p>
          </div>
        </div>
      </section>

      {/* ─── LOANS ─── */}
      <section id="loans" className="info-section">
        <h2 className="section-title">Loan Benefits</h2>
        <p className="section-lead">
          The club provides two loan types to support members in times of need.
        </p>
        <div className="card-grid">
          <div className="info-card highlight-card">
            <h3>Soft Loan</h3>
            <p>
              A lower-interest support loan available to financially up-to-date
              members who are not currently under any form of punishment. Full
              terms and conditions are stipulated in the Loan Administration
              Handbook.
            </p>
          </div>
          <div className="info-card highlight-card">
            <h3>Normal Loan</h3>
            <p>
              Standard loan facility available to all qualifying members.
              Eligibility requires being financially current. A guarantor who is
              on loan cannot exit the club until at least 70% of the loan amount
              is repaid.
            </p>
          </div>
          <div className="info-card">
            <h3>Loan Default</h3>
            <p>
              Any member who refuses to repay their loan within the stipulated
              time will incur additional interest on the outstanding balance.
              Loan terms are managed and approved by the platform administrators.
            </p>
          </div>
        </div>
      </section>

      {/* ─── BENEFITS ─── */}
      <section id="benefits" className="info-section alt-bg">
        <h2 className="section-title">Member Benefits</h2>
        <p className="section-lead">
          The club stands by its members in every season of life.
        </p>
        <div className="card-grid three-col">
          <div className="benefit-card">
            <div className="benefit-icon">🕊️</div>
            <h3>Deceased Member</h3>
            <p>
              The club sends representatives in the member's honour and provides
              a token of condolence on behalf of the whole club.
            </p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🏥</div>
            <h3>Sick Member</h3>
            <p>
              A special 2-member committee is appointed to visit, assess the
              level of illness, report to the general house, and recommend
              financial assistance.
            </p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🎉</div>
            <h3>Social Occasions</h3>
            <p>
              Members who have been in the club for at least 6 months and are
              financially up to date may invite the club to their personal
              occasions with at least one month's notice.
            </p>
          </div>
        </div>
      </section>

      {/* ─── PLATFORM RULES ─── */}
      <section id="platform-rules" className="info-section">
        <div className="section-eyebrow">Platform Rules</div>
        <h2 className="section-title">How the Platform is Controlled</h2>
        <p className="section-lead">
          These rules protect every naira contributed to the club. They are
          non-negotiable for all users.
        </p>
        <div className="card-grid">
          <div className="rule-card">
            <span className="rule-number">01</span>
            <h3>Admin-Only Account Creation</h3>
            <p>
              Only a verified system administrator can add a new user account to
              the platform. Self-registration is not permitted.
            </p>
          </div>
          <div className="rule-card">
            <span className="rule-number">02</span>
            <h3>Manual Approval Process</h3>
            <p>
              All new profiles remain locked until an admin cross-checks physical
              registration details and manually activates the account.
            </p>
          </div>
          <div className="rule-card">
            <span className="rule-number">03</span>
            <h3>Protected Wallet Balances</h3>
            <p>
              Members cannot edit their own balance. Only an admin may update
              wallet records after verifying real bank receipts or cash
              contributions.
            </p>
          </div>
          <div className="rule-card">
            <span className="rule-number">04</span>
            <h3>Admin-Only Account Deletion</h3>
            <p>
              Removing a member from the platform is exclusively an admin
              function — no member can delete their own account or another's.
            </p>
          </div>
          <div className="rule-card">
            <span className="rule-number">05</span>
            <h3>Private Ledger Separation</h3>
            <p>
              You can only view your own wallet, savings history, and transaction
              ledger. No member can access another member's financial records.
            </p>
          </div>
        </div>
      </section>

      {/* ─── MISCONDUCT ─── */}
      <section id="misconduct" className="info-section alt-bg">
        <h2 className="section-title">Misconduct & Fines</h2>
        <p className="section-lead">
          The club enforces strict discipline to protect collective interests.
        </p>
        <div className="card-grid three-col">
          <div className="fine-card">
            <span className="fine-amount">₦2,000 – ₦10,000</span>
            <h3>General Misconduct</h3>
            <p>
              Abusive language, fighting, or leaving a meeting without the
              president's permission.
            </p>
          </div>
          <div className="fine-card">
            <span className="fine-amount">₦5,000 – ₦50,000</span>
            <h3>Neglect of Duty</h3>
            <p>
              Failing or refusing any duty assigned by the club without good
              reason.
            </p>
          </div>
          <div className="fine-card">
            <span className="fine-amount">₦5,000+</span>
            <h3>Assaulting an Officer</h3>
            <p>
              Assaulting any officer in the course of performing their official
              duties.
            </p>
          </div>
          <div className="fine-card">
            <span className="fine-amount">₦1,000</span>
            <h3>Absent from Meetings</h3>
            <p>
              Missing a scheduled club meeting without a valid reason, as
              determined by the disciplinary committee.
            </p>
          </div>
          <div className="fine-card">
            <span className="fine-amount">Lifetime Ban</span>
            <h3>Misappropriation</h3>
            <p>
              Any member found guilty of embezzling club funds must repay in
              full and is disqualified for life from holding any office.
            </p>
          </div>
          <div className="fine-card">
            <span className="fine-amount">Auto-Expulsion</span>
            <h3>Unpaid Fines</h3>
            <p>
              Failure to pay a fine within the stipulated time results in
              automatic loss of membership.
            </p>
          </div>
        </div>
      </section>

      {/* ─── CESSATION ─── */}
      <section id="cessation" className="info-section">
        <h2 className="section-title">Leaving the Club</h2>
        <p className="section-lead">
          Membership may end in three ways. Each carries specific obligations.
        </p>
        <div className="card-grid three-col">
          <div className="info-card">
            <h3>By Resignation</h3>
            <p>
              A written notice of at least one month is required. The resigning
              member must clear all financial obligations before ceasing to be a
              member. A guarantor on an active loan may not exit until 70% of
              the loan is repaid.
            </p>
          </div>
          <div className="info-card">
            <h3>By Death</h3>
            <p>
              Membership ends upon the member being accorded their final rites.
              The club will send a representative and present a token of
              condolence.
            </p>
          </div>
          <div className="info-card">
            <h3>By Expulsion</h3>
            <p>
              The club may suspend or expel a member whose conduct is inimical
              to club affairs. Expulsion requires a finding of misconduct by the
              disciplinary committee, ratified by a two-third majority vote at a
              general meeting.
            </p>
          </div>
        </div>
      </section>

      {/* ─── SPECIAL CLAUSE ─── */}
      <section id="special-clause" className="info-section alt-bg">
        <h2 className="section-title">Special Clause</h2>
        <div className="notice-banner">
          <span className="notice-icon">⚠️</span>
          <p>
            The funds and property of the club shall not be converted or
            diverted — directly or indirectly — for any personal use by any
            member. Professionals within the club are responsible for overseeing
            any club investments or projects that align with their field of
            expertise.
          </p>
        </div>
      </section>

      {/* ─── OFFICERS ─── */}
      <section id="officers" className="info-section">
        <h2 className="section-title">Officers of the Club</h2>
        <p className="section-lead">
          The club is governed by elected officers who each hold clearly defined
          responsibilities.
        </p>
        <div className="officer-grid">
          {[
            { title: "President", desc: "Chairs all meetings, counter-signs all club vouchers and acts as the highest executive authority." },
            { title: "Vice President", desc: "Supports the President and acts in full capacity in the President's absence." },
            { title: "General Secretary", desc: "Records all meeting proceedings, summons meetings and maintains secretarial duties." },
            { title: "Assistant Secretary", desc: "Assists the Secretary and acts in full capacity during absence." },
            { title: "Financial Secretary", desc: "Collects all fees and levies, issues receipts and prepares annual financial reports." },
            { title: "Treasurer", desc: "Receives all monies from the Financial Secretary and manages club funds." },
            { title: "PRO", desc: "Handles public relations and communications on behalf of the club." },
            { title: "Chief Welfare Officer", desc: "Coordinates welfare activities and liaises on entertainment and social functions." },
          ].map((officer) => (
            <div key={officer.title} className="officer-card">
              <h3>{officer.title}</h3>
              <p>{officer.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── MEETINGS ─── */}
      <section id="meetings" className="info-section alt-bg">
        <h2 className="section-title">Meetings</h2>
        <p className="section-lead">
          The club holds four types of meetings, each with its own notice
          requirements and purpose.
        </p>
        <div className="card-grid">
          {[
            { type: "Annual General Meeting", notice: "1 month notice required", detail: "Held once a year — the highest decision-making gathering of all members." },
            { type: "Monthly Meeting", notice: "24 hours notice required", detail: "Regular monthly gathering to conduct club business and track progress." },
            { type: "Executive / Committee Meeting", notice: "As required", detail: "Officers and committee members convene to manage specific club affairs." },
            { type: "Emergency Meeting", notice: "Convened at any time", detail: "Called to treat urgent matters only. Cannot be used for routine business." },
          ].map((m) => (
            <div key={m.type} className="info-card">
              <h3>{m.type}</h3>
              <span className="notice-badge">{m.notice}</span>
              <p>{m.detail}</p>
            </div>
          ))}
        </div>
        <p className="section-footnote">
          A quorum requires at least <strong>1/3 of members</strong> in
          attendance.
        </p>
      </section>

      {/* ─── ELECTIONS ─── */}
      <section id="elections" className="info-section">
        <h2 className="section-title">Elections</h2>
        <p className="section-lead">
          Officers are elected every two years by secret ballot, physical or
          virtual.
        </p>
        <div className="card-grid three-col">
          <div className="info-card">
            <h3>Eligibility</h3>
            <p>
              A presidential candidate must have spent at least{" "}
              <strong>3 years</strong> with the club. All other positions require
              at least <strong>1 year</strong> of membership.
            </p>
          </div>
          <div className="info-card">
            <h3>Electoral Committee</h3>
            <p>
              A 5-member committee with a chairperson and secretary is nominated
              by the general house 3 months before the election. Committee
              members may vote but may not contest.
            </p>
          </div>
          <div className="info-card">
            <h3>Term Limits</h3>
            <p>
              Any officer who has served two consecutive terms in the same
              position may not be re-elected to that same position in the
              immediately following election.
            </p>
          </div>
        </div>
      </section>

      {/* ─── TRUSTEES ─── */}
      <section id="trustees" className="info-section alt-bg">
        <h2 className="section-title">Board of Trustees</h2>
        <p className="section-lead">
          The Board of Trustees provides long-term oversight and moral authority
          for the club.
        </p>
        <div className="card-grid">
          <div className="info-card">
            <h3>Composition</h3>
            <p>
              A maximum of <strong>5 trustees</strong>, nominated by the
              executive and approved by a 2/3 majority of members at a general
              meeting.
            </p>
          </div>
          <div className="info-card">
            <h3>Qualifications</h3>
            <ul>
              <li>Must have been a member for at least 3 years</li>
              <li>Must be of good character with a verifiable livelihood</li>
              <li>
                Must not have been convicted of any criminal offence by a court
                of competent jurisdiction
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ─── IDENTITY ─── */}
      <section id="identity" className="info-section">
        <h2 className="section-title">Club Identity</h2>
        <div className="identity-grid">
          <div className="identity-item">
            <span className="identity-label">Full Name</span>
            <span className="identity-value">Olofin Heritage Club of Nigeria</span>
          </div>
          <div className="identity-item">
            <span className="identity-label">RC Number</span>
            <span className="identity-value">RC: 7112960</span>
          </div>
          <div className="identity-item">
            <span className="identity-label">Club Account</span>
            <span className="identity-value">1310808368 — Zenith Bank</span>
          </div>
          <div className="identity-item">
            <span className="identity-label">Secretariat</span>
            <span className="identity-value">Okeho, Oyo State</span>
          </div>
          <div className="identity-item">
            <span className="identity-label">Motto</span>
            <span className="identity-value">ONE LOVE KEEP US TOGETHER</span>
          </div>
          <div className="identity-item">
            <span className="identity-label">Slogan</span>
            <span className="identity-value">People of Like Mind</span>
          </div>
          <div className="identity-item">
            <span className="identity-label">Type</span>
            <span className="identity-value">Non-religious, Non-tribal, Non-political, Non-governmental</span>
          </div>
          <div className="identity-item">
            <span className="identity-label">Constitution Dated</span>
            <span className="identity-value">August 2024</span>
          </div>
        </div>
      </section>

      {/* ─── OBJECTIVES ─── */}
      <section id="objectives" className="info-section alt-bg">
        <h2 className="section-title">Aims & Objectives</h2>
        <div className="objectives-list">
          {[
            "Establish high and reputable friendship that will help members see themselves as one.",
            "Promote the general interest of the members and extend its usefulness for the good of our communities.",
            "Promote advancement of knowledge in wealth creation, future security, dreams realization and developmental programs.",
            "Initiate and consider any legislation relevant to the objects of the club.",
            "Engage in any other lawful activities conducive to the promotion of the club's objectives.",
            "Have respect for every member's personality.",
          ].map((obj, i) => (
            <div key={i} className="objective-row">
              <span className="objective-num">0{i + 1}</span>
              <p>{obj}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── VALUES ─── */}
      <section id="values" className="info-section">
        <div className="section-eyebrow">Core Values</div>
        <h2 className="section-title">What We Stand For</h2>
        <div className="card-grid three-col">
          <div className="value-card">
            <div className="value-icon">📖</div>
            <h3>Absolute Honesty</h3>
            <p>
              Every single naira is recorded on an open ledger. No hidden fees,
              no secret transactions, zero guesswork.
            </p>
          </div>
          <div className="value-card">
            <div className="value-icon">🔍</div>
            <h3>Careful Auditing</h3>
            <p>
              Admin teams run constant checks, matching every digital record
              against real-world bank statements.
            </p>
          </div>
          <div className="value-card">
            <div className="value-icon">🤝</div>
            <h3>Total Family Unity</h3>
            <p>
              All members are treated with equal respect and kept fully informed
              of how their contributions are being handled.
            </p>
          </div>
        </div>
      </section>

      <About />

      {/* ─── FOOTER ─── */}
      <footer className="site-footer">
        <div className="footer-logo">
          <span className="footer-name">Olofin Heritage Club</span>
          <span className="footer-motto">ONE LOVE KEEP US TOGETHER</span>
        </div>
        <p className="footer-legal">
          RC: 7112960 · Zenith Bank: 1310808368 · Okeho, Oyo State · Constitution dated August 2024
        </p>
      </footer>
    </div>
  );
}

export default Home;