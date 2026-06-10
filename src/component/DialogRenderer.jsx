import React, { useState, useEffect } from "react";
import "./dialog-renderer.css";

/**
 * DialogRenderer — drop this once inside AdminDashboard (or any root layout).
 * It reads the `dialog` state from useDialog() and renders the correct modal.
 */
function DialogRenderer({ dialog, onConfirm, onCancel }) {
  const [inputValue, setInputValue] = useState("");

  // Reset input each time a new prompt dialog opens
  useEffect(() => {
    if (dialog.open && dialog.kind === "prompt") {
      setInputValue("");
    }
  }, [dialog.open, dialog.kind]);

  if (!dialog.open) return null;

  const typeIcon = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  }[dialog.type] || "ℹ️";

  const typeAccent = {
    success: "#2ecc71",
    error:   "#e74c3c",
    warning: "#f39c12",
    info:    "#3498db",
  }[dialog.type] || "#3498db";

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && dialog.kind === "prompt") onConfirm(inputValue);
    if (e.key === "Escape") onCancel();
  };

  return (
    <div className="dlg-overlay" onKeyDown={handleKeyDown} tabIndex={-1}>
      <div className="dlg-box" style={{ borderTop: `4px solid ${typeAccent}` }}>

        {/* Header */}
        <div className="dlg-header">
          <span className="dlg-icon">{typeIcon}</span>
          <p className="dlg-message">{dialog.message}</p>
        </div>

        {/* Optional detail sub-text */}
        {dialog.detail && (
          <p className="dlg-detail">{dialog.detail}</p>
        )}

        {/* Prompt input field */}
        {dialog.kind === "prompt" && (
          <input
            autoFocus
            type="text"
            className="dlg-input"
            placeholder={dialog.placeholder || ""}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        )}

        {/* Action buttons */}
        <div className="dlg-actions">
          {/* Notify: single OK button */}
          {dialog.kind === "notify" && (
            <button
              className="dlg-btn dlg-btn-confirm"
              style={{ background: typeAccent }}
              onClick={() => onConfirm()}
            >
              OK
            </button>
          )}

          {/* Confirm / Prompt: Cancel + Confirm buttons */}
          {(dialog.kind === "confirm" || dialog.kind === "prompt") && (
            <>
              <button className="dlg-btn dlg-btn-cancel" onClick={onCancel}>
                {dialog.cancelLabel || "Cancel"}
              </button>
              <button
                className="dlg-btn dlg-btn-confirm"
                style={{ background: typeAccent }}
                onClick={() => onConfirm(dialog.kind === "prompt" ? inputValue : true)}
              >
                {dialog.confirmLabel || "Confirm"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DialogRenderer;
