import React, { useEffect, useState } from "react";
import "./styles/memberSection.css";

const MembersSection = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/public/members`);
        const result = await response.json();
        if (response.ok && result.data) {
          setMembers(result.data);
        }
      } catch (error) {
        console.error("Error fetching public members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [backendUrl]);

  return (
    <section className="public-members-section">
      <div className="members-container">
        <span className="members-badge">OUR COMMUNITY</span>
        <h2 className="members-title">Active Club Members</h2>
        <p className="members-subtitle">
          Meet the dedicated sons and daughters driving community development and unity.
        </p>

        {loading ? (
          <div className="members-loading">Loading members directory...</div>
        ) : (
          <div className="members-grid">
            {members.map((member) => {
              // Combine location values safely
              const locationParts = [member.town, member.state, member.country].filter(Boolean);
              const locationText =
                locationParts.length > 0 ? locationParts.join(", ") : "Not Specified";

              return (
                <div key={member.id} className="member-card">
                  {/* Top Avatar Area */}
                  <div className="avatar-wrapper">
                    {member.avatar_url ? (
                      <img
                        src={
                          member.avatar_url.startsWith("http")
                            ? member.avatar_url
                            : `https://${member.avatar_url}`
                        }
                        alt={member.username}
                        className="member-avatar"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            member.username || "Member"
                          )}&background=0284c7&color=fff`;
                        }}
                      />
                    ) : (
                      <div className="member-avatar-placeholder">
                        <svg
                          className="human-icon"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                    )}

                    {/* Verification Badge */}
                    {member.is_verified && (
                      <span className="verified-icon" title="Verified Member">
                        ✓
                      </span>
                    )}
                  </div>

                  {/* Header / Name */}
                  <h3 className="member-name">{member.username || "Member"}</h3>

                  {/* Position / Title */}
                  <p className="member-position">
                    {member.position || (member.role ? member.role.toUpperCase() : "CLUB MEMBER")}
                  </p>

                  {/* All Details Box Under Avatar */}
                  <div className="member-details-box">
                    <p className="member-detail">
                      <span className="detail-icon">💼</span>
                      <span><strong>Occupation:</strong> {member.occupation || "Member"}</span>
                    </p>

                    <p className="member-detail">
                      <span className="detail-icon">📍</span>
                      <span><strong>Location:</strong> {locationText}</span>
                    </p>

                    {member.family_role && (
                      <p className="member-detail">
                        <span className="detail-icon">👥</span>
                        <span><strong>Family Role:</strong> {member.family_role}</span>
                      </p>
                    )}

                    {member.age && (
                      <p className="member-detail">
                        <span className="detail-icon">🎂</span>
                        <span><strong>Age:</strong> {member.age} yrs</span>
                      </p>
                    )}
                  </div>

                  {/* Passion / About Reason */}
                  {member.passion_reason && (
                    <div className="member-passion-box">
                      <span className="passion-title">About / Passion</span>
                      <p className="passion-text">{member.passion_reason}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default MembersSection;