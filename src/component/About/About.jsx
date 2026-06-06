import React from "react";
import "./About.css";

function About() {
  return (
    <section id="about" className="about-section">
      <div className="about-overlay">

        {/* HEADER SECTION */}
        <div className="about-header">
          <span>ABOUT OLOFIN HERITAGE CLUB</span>
          <h2>A Simple and Honest Place for Group Financial Growth</h2>
          <p>
            Olofin Heritage Club is a community platform where trusted members gather to save money together. 
            We believe that financial growth happens best when people help each other. Through our organized system, 
            every single contribution is fully recorded and transparent, while our group administrators monitor 
            all daily activities to protect our shared funds, keep records straight, and maintain absolute honesty.
          </p>
        </div>

        {/* MAIN DEEP INFORMATION GRID */}
        <div className="about-grid">

          {/* EXTENDED MISSION CARD */}
          <div className="about-card">
            <h3>Our Big Mission</h3>
            <p>
              Our main focus is to build a very safe, clean, and cooperative digital space where members can pool 
              their financial resources together without any fear of loss or missing records. We aim to break down 
              complex financial barriers by combining modern database tracking with deep traditional community values. 
              By working as a single team, we ensure that every member can steadily stack up their long-term savings, 
              access critical financial support when they need it most, and achieve total peace of mind regarding 
              their hard-earned money.
            </p>
          </div>

          {/* EXTENDED VISION CARD */}
          <div className="about-card">
            <h3>Our Future Vision</h3>
            <p>
              We want to expand the Olofin Heritage Club into a massive, highly trusted mutual-aid network that 
              serves generations to come. We plan to build smarter automated ledger systems that make community 
              banking smooth and simple. Our ultimate goal is financial freedom for all registered members. 
              By providing easy tools for saving money, tracking historical performance, and managing small business 
              credit, we are steadily building a strong foundation where everyone survives financial emergencies 
              and grows wealthy together.
            </p>
          </div>

          {/* EXTENDED PLATFORM RULES CARD */}
          <div className="about-card text-left-card" id="rules">
            <h3>Strict Platform Rules</h3>
            <p className="card-sub-intro">
              To keep our community completely clean and protect everyone from fraud, we follow a very strict set of 
              internal operating procedures:
            </p>
            <ul>
              <li>
                <strong>Admin Creation Control:</strong> Regular people cannot join or create profiles on their own. 
                Only a verified system admin can add a new user account into the master directory database.
              </li>
              <li>
                <strong>Manual Approval Process:</strong> Every profile remains completely locked until an official admin 
                checks the physical registration details and manually moves the user to verified status.
              </li>
              <li>
                <strong>Protected Balance Changes:</strong> Members cannot randomly type or change their balance amounts. 
                Only an admin can update your wallet logs after verifying your real bank money receipt.
              </li>
              <li>
                <strong>Total Account Erasure:</strong> If a member chooses to leave the club entirely, only authorized 
                administrators have the power to delete their data from the live platform.
              </li>
              <li>
                <strong>Private Ledger Separation:</strong> Members can only view their own specific wallet info, personal 
                saving progress, and private transaction ledger sheets. You can never see another user's balance.
              </li>
            </ul>
          </div>

          {/* EXTENDED CORE VALUES CARD */}
          <div className="about-card text-left-card">
            <h3>Our Core Values</h3>
            <p className="card-sub-intro">
              Everything we do inside the Olofin Heritage Club is guided by three basic pillars that protect our 
              collective financial strength:
            </p>
            <ul>
              <li>
                <strong>Absolute Honesty:</strong> Every single naira that enters the club is immediately written down 
                on an open ledger sheet. There are no hidden fees, no secret transactions, and zero guesswork.
              </li>
              <li>
                <strong>Careful Auditing:</strong> Our admin teams run constant checks on our database inputs. We match 
                every digital request against real-world bank statements to make sure things add up perfectly.
              </li>
              <li>
                <strong>Total Family Unity:</strong> We treat all group members with the same respect. We share our financial 
                rules clearly so that everyone knows exactly how their contributions are being handled at all times.
              </li>
            </ul>
          </div>

        </div>

        {/* ROLE CAPABILITIES SECTION */}
        <div className="role-section">
          <h2>Clear System Capabilities</h2>
          <p className="role-section-subtitle">
            Here is a long, detailed breakdown of exactly what each account type is allowed to do inside the 
            Olofin Heritage Club platform:
          </p>

          <div className="role-grid">

            {/* FULL ADMIN OPERATIONS */}
            <div className="role-card">
              <div className="role-title">ADMINISTRATOR FUNCTIONS</div>
              <ul>
                <li>
                  <strong>Member Directory Control:</strong> They have the absolute power to manually add new members to the portal 
                  or delete profiles if someone breaks club rules.
                </li>
                <li>
                  <strong>Verification Pipeline Audit:</strong> They review pending applications, crosscheck submitted club fees, 
                  and unlock member accounts safely.
                </li>
                <li>
                  <strong>Wallet Override Adjustments:</strong> They manually update user wallet balances after checking real 
                  bank transaction receipts or cash contributions.
                </li>
                <li>
                  <strong>Master Database Access:</strong> They can see all system users, examine group histories, and track 
                  overall platform metrics on a master screen.
                </li>
                <li>
                  <strong>Credit and Loan Management:</strong> They look at user loan requests, check background records, and 
                  manually approve or decline payout funds.
                </li>
                <li>
                  <strong>Global Broadcast Notices:</strong> They can send out mass messages and announcements to all members' 
                  user dashboards instantly.
                </li>
              </ul>
            </div>

            {/* FULL USER OPERATIONS */}
            <div className="role-card">
              <div className="role-title">CLUB MEMBER FUNCTIONS</div>
              <ul>
                <li>
                  <strong>Personal Wallet Tracking:</strong> You can view your current total contribution balances, paid dues, 
                  and total active savings milestones at any time.
                </li>
                <li>
                  <strong>Private Statement Downloads:</strong> You can scroll through a clean history list showing every single 
                  deposit or loan transaction you have ever made.
                </li>
                <li>
                  <strong>Notice Board Access:</strong> You can read all active news, dynamic changes, updates, and instructions 
                  posted by the management team.
                </li>
                <li>
                  <strong>Community Chat Hub:</strong> You can securely chat, interact, and plan club activities with other 
                  registered members inside the closed portal.
                </li>
                <li>
                  <strong>Secure Profile Insulation:</strong> Your data is completely locked down. You have access *only* to your 
                  own wallet, keeping your financial information hidden from other members.
                </li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default About;