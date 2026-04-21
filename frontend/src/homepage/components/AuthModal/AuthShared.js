import React, { useState } from 'react';

/* ─── Eye Icon SVG ───────────────────────────────────────────── */
export const EyeIcon = ({ visible, onClick }) => (
  <button
    type="button"
    className="auth-eye-btn"
    onClick={onClick}
    aria-label={visible ? 'Hide password' : 'Show password'}
    tabIndex={-1}
  >
    {visible ? (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ) : (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )}
  </button>
);

/* ─── Password Field with toggle ─────────────────────────────── */
export const PasswordField = ({ id, label, value, onChange, placeholder, disabled, error }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="auth-field">
      <label className="auth-label" htmlFor={id}>{label}</label>
      <div className="auth-input-wrap">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          className="auth-input auth-input-password"
          value={value}
          onChange={onChange}
          placeholder={placeholder || ''}
          autoComplete="current-password"
          disabled={disabled}
          style={error ? { borderColor: '#EF4444' } : {}}
        />
        <EyeIcon visible={show} onClick={() => setShow(v => !v)} />
      </div>
      {error && (
        <span style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>
          {error}
        </span>
      )}
    </div>
  );
};
