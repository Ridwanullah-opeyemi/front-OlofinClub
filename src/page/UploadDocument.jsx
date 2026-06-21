import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/UploadDocument.css";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

function UploadDocument() {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const resetState = () => {
    setProgress(0);
    setResult(null);
    setError("");
  };

  const handleFileChange = (e) => {
    resetState();
    const file = e.target.files[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only .jpg, .png, and .pdf files are allowed.");
      setSelectedFile(null);
      e.target.value = "";
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setError("File is too large. Maximum size is 10MB.");
      setSelectedFile(null);
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  // Plain XHR is used here (instead of fetch) so we can report
  // real upload progress, same approach as the rest of the dashboard's
  // network calls but with a progress listener attached.
  const handleUpload = () => {
    if (!selectedFile) return;

    resetState();
    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${backendUrl}/api/auth/upload`);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setProgress(Math.round((event.loaded * 100) / event.total));
      }
    };

    xhr.onload = () => {
      setUploading(false);
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && data.success) {
          setResult(data);
        } else {
          setError(data.message || "Upload failed. Please try again.");
        }
      } catch {
        setError("Unexpected response from server.");
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      setError("Network error — please check your connection and try again.");
    };

    xhr.send(formData);
  };

  const handlePickAnother = () => {
    resetState();
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="upload-page">
      <div className="upload-card">
        <button type="button" className="upload-back-btn" onClick={() => navigate("/admin-dashboard")}>
          ← Back to dashboard
        </button>

        <h1>Upload Document</h1>
        <p className="upload-subtitle">
          Accepted formats: JPG, PNG, PDF — up to 10MB. Files are saved to Google Drive.
        </p>

        <label className="file-drop-zone" htmlFor="file-input">
          <input
            id="file-input"
            type="file"
            ref={fileInputRef}
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileChange}
            disabled={uploading}
          />

          {selectedFile ? (
            <div className="file-chosen">
              <span className="file-icon">📄</span>
              <div>
                <span className="file-name">{selectedFile.name}</span>
                <span className="file-size">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
          ) : (
            <div className="file-placeholder">
              <span className="file-icon">⬆️</span>
              <span>Click to choose a file</span>
            </div>
          )}
        </label>

        {error && <p className="upload-error">{error}</p>}

        {uploading && (
          <div className="progress-wrapper">
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="progress-label">{progress}%</span>
          </div>
        )}

        <div className="upload-actions">
          <button
            type="button"
            className="btn-primary"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
          >
            {uploading ? "Uploading…" : "Upload File"}
          </button>

          {(selectedFile || result) && !uploading && (
            <button type="button" className="btn-ghost" onClick={handlePickAnother}>
              Choose Another File
            </button>
          )}
        </div>

        {result && (
          <div className="upload-result">
            <span className="upload-result-icon">✅</span>
            <div className="upload-result-body">
              <p className="upload-result-title">Upload complete</p>
              <p className="upload-result-name">{result.fileName}</p>
              <a
                href={result.fileLink}
                target="_blank"
                rel="noopener noreferrer"
                className="upload-result-link"
              >
                Open file in Google Drive →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadDocument;