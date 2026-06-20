import React, { useState, useEffect, useRef } from "react";
import "../styles/member-overview.css";

function MemberOverview() {
  const [profile, setProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(true);

  // Only used to scroll when the current user sends a message
  const messagesContainerRef = useRef(null);

  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [profileRes, chatRes] = await Promise.all([
          fetch(`${backendUrl}/api/user/${storedUser.id}/profile`, {
            headers,
          }),
          fetch(`${backendUrl}/api/chat/messages`, {
            headers,
          }),
        ]);

        const profileData = await profileRes.json();
        const chatData = await chatRes.json();

        if (profileData.success) setProfile(profileData.data);
        if (chatData.success) setMessages(chatData.data);
      } catch (err) {
        console.error("Failed to load overview data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();

    const interval = setInterval(fetchOverviewData, 4000);

    return () => clearInterval(interval);
  }, [token, storedUser.id, backendUrl]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!chatInput.trim()) return;

    const draft = chatInput;
    setChatInput("");

    try {
      const response = await fetch(`${backendUrl}/api/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message_text: draft }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [...prev, data.data]);

        // Scroll only when the current user sends a message
        setTimeout(() => {
          if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
              top: messagesContainerRef.current.scrollHeight,
              behavior: "smooth",
            });
          }
        }, 0);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const getInitials = (name = "") =>
    name
      .trim()
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  const formatMessageTime = (ts) => {
    if (!ts) return "";

    const d = new Date(ts);

    return d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const shouldGroupWithPrevious = (msg, prevMsg) => {
    if (!prevMsg) return false;

    return prevMsg.sender_id === msg.sender_id;
  };

  return (
    <div className="ov-page">
      {/* ---------- Balance card ---------- */}
      <div className="ov-balance-card">
        <div className="ov-balance-top">
          <span className="ov-balance-label">
            Total Savings Balance
          </span>

          {profile?.username && (
            <span className="ov-balance-greeting">
              Hi, {profile.username} 👋
            </span>
          )}
        </div>

        {loading ? (
          <div className="ov-balance-skeleton" />
        ) : (
          <h1 className="ov-balance-amount">
            ₦{Number(profile?.amount_paid || 0).toLocaleString()}
          </h1>
        )}

        <div className="ov-balance-foot">
          <span className="ov-balance-dot" />
          <span>Updated live · Olofin Heritage Club</span>
        </div>
      </div>

      {/* ---------- Chat ---------- */}
      <div className="ov-chat-card">
        <div className="ov-chat-header">
          <div className="ov-chat-header-left">
            <span className="ov-chat-live-dot" />
            <h4>Club Chat</h4>
          </div>

          <span className="ov-chat-member-count">
            Members online
          </span>
        </div>

        <div
          className="ov-chat-messages"
          ref={messagesContainerRef}
        >
          {messages.length === 0 ? (
            <div className="ov-chat-empty">
              <span className="ov-chat-empty-icon">💬</span>
              <p>No messages yet</p>
              <span>
                Be the first to say something to the group.
              </span>
            </div>
          ) : (
            messages.map((msg, i) => {
              const isMine = msg.sender_id === storedUser.id;
              const grouped = shouldGroupWithPrevious(
                msg,
                messages[i - 1]
              );

              return (
                <div
                  key={msg.id}
                  className={`ov-msg-row ${
                    isMine ? "mine" : "others"
                  } ${grouped ? "grouped" : ""}`}
                >
                  {!isMine && (
                    <div className="ov-msg-avatar">
                      {grouped
                        ? ""
                        : getInitials(msg.sender_name)}
                    </div>
                  )}

                  <div className="ov-msg-stack">
                    {!grouped && !isMine && (
                      <span className="ov-msg-sender">
                        {msg.sender_name}
                      </span>
                    )}

                    <div className="ov-msg-bubble">
                      <span className="ov-msg-text">
                        {msg.message_text}
                      </span>

                      <span className="ov-msg-time">
                        {formatMessageTime(msg.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <form
          onSubmit={handleSendMessage}
          className="ov-chat-input-form"
        >
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Message the group…"
            className="ov-chat-field"
          />

          <button
            type="submit"
            className="ov-chat-send-btn"
            disabled={!chatInput.trim()}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 2 11 13" />
              <path d="M22 2 15 22l-4-9-9-4 20-7z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

export default MemberOverview;