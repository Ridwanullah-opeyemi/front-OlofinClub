import React, { useState, useEffect } from "react";
import "../styles/member-overview.css"; // 🔥 Imported external CSS

function MemberOverview() {
  const [profile, setProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [profileRes, chatRes] = await Promise.all([
          fetch(`${backendUrl}/api/user/${storedUser.id}/profile`, { headers }),
          fetch(`${backendUrl}/api/chat/messages`, { headers })
        ]);

        const profileData = await profileRes.json();
        const chatData = await chatRes.json();

        if (profileData.success) setProfile(profileData.data);
        if (chatData.success) setMessages(chatData.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOverviewData();
    const interval = setInterval(fetchOverviewData, 4000);
    return () => clearInterval(interval);
  }, [token, storedUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    try {
      const response = await fetch(`${backendUrl}/api/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message_text: chatInput }),
      });
      const data = await response.json();
      if (data.success) {
        setMessages([...messages, data.data]);
        setChatInput("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="overview-container">
      <h2>Dashboard Overview</h2>
      <p className="welcome-text">Hello, <strong>{profile?.username}</strong>! Here is an overview of your activity.</p>

      <div className="balance-card">
        <span className="card-label">Total Contribution Balance</span>
        <h1 className="balance-amount">₦{profile?.amount_paid?.toLocaleString()}</h1>
      </div>

      <div className="chat-box-container">
        <h4 className="chat-header">Live Group Chat Room</h4>
        <div className="chat-messages-area">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`message-row ${msg.sender_id === storedUser.id ? "mine" : "others"}`}
            >
              <small className="message-sender">{msg.sender_name}</small>
              <span className="message-text-bubble">{msg.message_text}</span>
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="chat-input-form">
          <input 
            type="text" 
            value={chatInput} 
            onChange={(e) => setChatInput(e.target.value)} 
            placeholder="Type your contribution chat announcement..." 
            className="chat-field"
          />
          <button type="submit" className="chat-send-btn">Send</button>
        </form>
      </div>
    </div>
  );
}

export default MemberOverview;