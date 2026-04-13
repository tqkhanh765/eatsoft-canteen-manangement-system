import React from 'react';
import './ConfirmDialog.css';

const WarningIcon = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
    <path
      d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
      fill="#F97316"
      stroke="#F97316"
      strokeWidth="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line x1="12" y1="9" x2="12" y2="13" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="17" x2="12.01" y2="17" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

/**
 * ConfirmDialog
 *
 * Props:
 *   isOpen      {boolean}  – controls visiblity
 *   message     {string}   – main body text shown to the user
 *   onConfirm   {function} – called when user clicks "OK"
 *   onCancel    {function} – called when user clicks "Cancel" (dismiss dialog)
 */
const ConfirmDialog = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div
      className="cd-overlay"
      id="confirm-dialog-overlay"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
      role="dialog"
      aria-modal="true"
      aria-label="Confirmation"
    >
      <div className="cd-box">
        <div className="cd-icon">
          <WarningIcon />
        </div>

        <p className="cd-heading">NOTICE</p>
        <p className="cd-message">{message}</p>

        <div className="cd-actions">
          <button className="cd-btn cd-btn-cancel" id="cd-cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="cd-btn cd-btn-ok" id="cd-ok-btn" onClick={onConfirm}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
