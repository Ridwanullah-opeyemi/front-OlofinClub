import React, { useState, useEffect, useRef } from "react";
import "../styles/admin-chat.css"; // 🔥 Kept styling completely external 

function AdminChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  
  const token = localStorage.getItem("token");
  // ✅ Fixed: Added storedUser retrieval so the "isMe" check works perfectly
  const storedUser = JSON.parse(localStorage.getItem("user")); 
  const chatEndRef = useRef(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // 📥 Fetch the current chat history stream
  const fetchChatStream = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/chat/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setMessages(data.data || []);
      }
    } catch (err) {
      console.error("Chat fetch loop error:", err);
    }
  };

  // Poll for new updates automatically every 3 seconds to keep things lively
  useEffect(() => {
    fetchChatStream();
    const interval = setInterval(fetchChatStream, 3000);
    return () => clearInterval(interval);
  }, []);

  // Automatically scroll down to the newest message text block
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const response = await fetch(`${backendUrl}/api/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message_text: newMessage }) 
      });

      if (response.ok) {
        setNewMessage("");
        fetchChatStream(); // Reload the message logs instantly
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to broadcast message.");
      }
    } catch (err) {
      console.error("Transmission breakdown:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="admin-chat-container">
      <h2>📢 Management Operations Hub</h2>
      <p className="chat-subtitle">Broadcast critical notices, field support questions, or chat with active users in real time.</p>

      <div className="chat-window-board">
        <div className="chat-messages-stream">
          {messages.length === 0 ? (
            <div className="empty-stream-text">No message records active inside current chat logs.</div>
          ) : (
            // ✅ Fixed: Cleaned up the tangled syntax and kept ONLY the correct schema map loop
            messages.map((msg) => {
              const isMe = String(msg.sender_id) === String(storedUser?.id);
              
              return (
                <div 
                  key={msg.id} 
                  className={`message-bubble-wrapper ${isMe ? "is-admin-author" : "is-user-author"}`}
                >
                  <div className="message-header-meta">
                    <span className="author-name">{msg.sender_name}</span>
                    {isMe && <span className="author-tag-badge">Admin</span>}
                  </div>
                  
                  <div className="message-body-text">{msg.message_text}</div>
                  
                  <div className="message-timestamp-label">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="chat-action-footer">
          <input 
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type corporate announcement or community response..."
            className="chat-text-input"
            disabled={sending}
            required
          />
          <button type="submit" disabled={sending || !newMessage.trim()} className="chat-send-btn">
            {sending ? "..." : "⚡ Broadcast"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminChat;