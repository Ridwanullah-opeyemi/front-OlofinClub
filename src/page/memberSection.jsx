import React, { useEffect, useState } from "react";
import "./styles/memberSection.css";

const MembersSection = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showAllModal, setShowAllModal] = useState(false);
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

  const openMemberModal = (member) => setSelectedMember(member);
  const closeMemberModal = () => setSelectedMember(null);
  const openAllModal = () => setShowAllModal(true);
  const closeAllModal = () => setShowAllModal(false);

  const getLocationText = (member) => {
    const parts = [member.town, member.state, member.country].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Not Specified";
  };

  const renderAvatar = (member, className) => {
    if (member.avatar_url) {
      return (
        <img
          src={
            member.avatar_url.startsWith("http")
              ? member.avatar_url
              : `https://${member.avatar_url}`
          }
          alt={member.username}
          className={className}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
              member.username || "Member"
            )}&background=0284c7&color=fff`;
          }}
        />
      );
    }
    return (
      <div className="member-avatar-placeholder">
        <svg className="human-icon" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </div>
    );
  };

  const renderMemberCard = (member, index, keyPrefix = "card") => {
    const locationText = getLocationText(member);

    return (
      <div
        key={`${keyPrefix}-${member.id}-${index}`}
        className="member-card"
        onClick={() => openMemberModal(member)}
      >
        <div className="avatar-wrapper">
          {renderAvatar(member, "member-avatar")}
          {member.is_verified && (
            <span className="verified-icon" title="Verified Member">
              ✓
            </span>
          )}
        </div>

        <h3 className="member-name">{member.username || "Member"}</h3>

        <p className="member-position">
          {member.position || (member.role ? member.role.toUpperCase() : "CLUB MEMBER")}
        </p>

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

        {member.passion_reason && (
          <div className="member-passion-box">
            <span className="passion-title">About / Passion</span>
            <p className="passion-text">{member.passion_reason}</p>
          </div>
        )}
      </div>
    );
  };

  const VISIBLE_IN_ROW = 5;
  const previewMembers = members.slice(0, VISIBLE_IN_ROW);
  const hasMore = members.length > VISIBLE_IN_ROW;

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
          <div className="members-scroll-wrapper">
            <div className="members-track">
              {previewMembers.map((member, index) => renderMemberCard(member, index))}

              {hasMore && (
                <div className="see-more-card" onClick={openAllModal}>
                  <div className="see-more-icon">+{members.length - VISIBLE_IN_ROW}</div>
                  <p className="see-more-text">See More Members</p>
                  <span className="see-more-arrow">→</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* All Members Modal */}
      {showAllModal && (
        <div className="member-modal-overlay" onClick={closeAllModal}>
          <div className="all-members-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="member-modal-close" onClick={closeAllModal}>
              &times;
            </button>
            <div className="all-members-modal-header">
              <span className="members-badge">OUR COMMUNITY</span>
              <h2 className="all-members-modal-title">All Club Members</h2>
              <p className="all-members-modal-subtitle">
                {members.length} members and counting
              </p>
            </div>
            <div className="members-grid all-members-grid">
              {members.map((member, index) => renderMemberCard(member, index, "all"))}
            </div>
          </div>
        </div>
      )}

      {/* Single Member Detail Modal */}
      {selectedMember && (
        <div className="member-modal-overlay member-detail-overlay" onClick={closeMemberModal}>
          <div className="member-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="member-modal-close" onClick={closeMemberModal}>
              &times;
            </button>

            <div className="member-modal-avatar-wrapper">
              {renderAvatar(selectedMember, "member-modal-avatar")}
              {selectedMember.is_verified && (
                <span className="verified-icon" title="Verified Member">
                  ✓
                </span>
              )}
            </div>

            <h3 className="member-name">{selectedMember.username || "Member"}</h3>
            <p className="member-position">
              {selectedMember.position ||
                (selectedMember.role ? selectedMember.role.toUpperCase() : "CLUB MEMBER")}
            </p>

            <div className="member-details-box">
              <p className="member-detail">
                <span className="detail-icon">💼</span>
                <span><strong>Occupation:</strong> {selectedMember.occupation || "Member"}</span>
              </p>
              <p className="member-detail">
                <span className="detail-icon">📍</span>
                <span><strong>Location:</strong> {getLocationText(selectedMember)}</span>
              </p>
              {selectedMember.family_role && (
                <p className="member-detail">
                  <span className="detail-icon">👥</span>
                  <span><strong>Family Role:</strong> {selectedMember.family_role}</span>
                </p>
              )}
              {selectedMember.age && (
                <p className="member-detail">
                  <span className="detail-icon">🎂</span>
                  <span><strong>Age:</strong> {selectedMember.age} yrs</span>
                </p>
              )}
            </div>

            {selectedMember.passion_reason && (
              <div className="member-passion-box">
                <span className="passion-title">About / Passion</span>
                <p className="passion-text">{selectedMember.passion_reason}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default MembersSection;