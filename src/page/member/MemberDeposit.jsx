import React, { useState } from "react";
import "../styles/member-deposit.css"; // 🔥 Strictly handling styling externally

function MemberDeposit() {
  const [amount, setAmount] = useState("");
  const [proofImage, setProofImage] = useState(""); 
  const [imagePreview, setImagePreview] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const token = localStorage.getItem("token");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.onloadend = () => {
      setProofImage(reader.result); 
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!proofImage) {
      setMessage({ type: "error", text: "Please upload a proof of payment image." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${backendUrl}/api/user/deposit-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          amount: amount, 
          proof_url: proofImage 
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: "Proof of payment submitted successfully for review!" });
        setAmount("");
        setProofImage("");
        setImagePreview(null);
      } else {
        throw new Error(data.message || "Failed to submit request.");
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="deposit-container">
      <h2>Submit Proof of Payment</h2>
      <p className="deposit-subtitle">Upload your payment receipt metrics directly to management for system account approval.</p>

      {message && (
        <div className={`alert-box ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="deposit-grid">
        <div className="instructions-card">
          <h3>Payment Submissions Form</h3>
          <form onSubmit={handleSubmitRequest} className="deposit-form">
            
            <div className="form-group">
              <label className="form-label">Amount Sent (₦)</label>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                placeholder="e.g. 50000" 
                className="form-input"
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Upload Receipt Photo</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="form-file-input"
                required 
              />
            </div>

            {imagePreview && (
              <div className="preview-box">
                <p className="preview-label">Receipt Selected Preview:</p>
                <img 
                  src={imagePreview} 
                  alt="Receipt Preview" 
                  className="preview-image" 
                />
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="submit-request-btn"
            >
              {loading ? "Uploading & Transmitting..." : "Submit Transaction Request"}
            </button>
          </form>
        </div>

        <div className="info-notice-card">
          <h4 className="notice-title">🏛️ Direct Funding Gateway Core</h4>
          <p className="notice-body">
            Remit your financial target capital assets to the following parameters structure before lodging a verification log request:
          </p>
          <div className="bank-details-wrapper">
            <p><strong>Full Name: </strong>Olofin Heritage Club of Nigeria</p>
            <p><strong>Bank Code:</strong> Zenith Bank</p>
            <p><strong>Account Reference ID:</strong> 1310808368</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberDeposit;