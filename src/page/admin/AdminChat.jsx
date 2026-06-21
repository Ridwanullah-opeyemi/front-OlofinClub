import React, { useState, useEffect } from "react";
import "../styles/admin-chat.css";

function AdminChat({ triggerPopup }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchChatStream = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/chat/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(data.data || []);
      }
    } catch (err) {
      console.error("Chat fetch loop error:", err);
    }
  };

  useEffect(() => {
    fetchChatStream();

    const interval = setInterval(fetchChatStream, 3000);

    return () => clearInterval(interval);
  }, [token, backendUrl]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    setSending(true);

    try {
      const response = await fetch(`${backendUrl}/api/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message_text: newMessage,
        }),
      });

      if (response.ok) {
        setNewMessage("");
        fetchChatStream();
      } else {
        const errorData = await response.json();

        triggerPopup(
          errorData.message || "Failed to broadcast message.",
          "error"
        );
      }
    } catch (err) {
      console.error("Transmission breakdown:", err);

      triggerPopup(
        "Network error — message could not be sent.",
        "error"
      );
    } finally {
      setSending(false);
    }
  };

  const getInitials = (name = "") =>
    name
      .trim()
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";

    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const shouldGroupWithPrevious = (msg, prevMsg) => {
    if (!prevMsg) return false;

    return String(prevMsg.sender_id) === String(msg.sender_id);
  };

  return (
    <div className="admin-chat-container">
      <div className="ov-chat-card">
        <div className="ov-chat-header">
          <div className="ov-chat-header-left">
            <span className="ov-chat-live-dot" />
            <h4>Management Operations Hub</h4>
          </div>

          <span className="ov-chat-member-count">
            Live Broadcast
          </span>
        </div>

        <div className="ov-chat-messages">
          {messages.length === 0 ? (
            <div className="ov-chat-empty">
              <span className="ov-chat-empty-icon">💬</span>

              <p>No messages yet</p>

              <span>
                No active records inside current chat logs.
              </span>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMine =
                String(msg.sender_id) === String(storedUser?.id);

              const grouped = shouldGroupWithPrevious(
                msg,
                messages[index - 1]
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
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Broadcast notice or respond to members…"
            className="ov-chat-field"
            disabled={sending}
            required
          />

          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="ov-chat-send-btn"
          >
            {sending ? (
              "..."
            ) : (
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
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminChat;