import React, { useState, useEffect } from 'react';
import './AuthModal.css';

import LoginView from './LoginView';
import SignupView from './SignupView';
import ForgotPasswordView from './ForgotPasswordView';
import VerifyCodeView from './VerifyCodeView';
import ResetPasswordView from './ResetPasswordView';

/* ─── Main AuthModal Orchestrator ────────────────────────────── */
const AuthModal = ({ isOpen, defaultView = 'login', onClose, onLoginSuccess }) => {
  const [view, setView] = useState(defaultView);

  console.log('[AuthModal] Rendered with isOpen:', isOpen);

  // Reset view whenever modal opens
  useEffect(() => {
    console.log('[AuthModal] isOpen changed to:', isOpen);
    if (isOpen) setView(defaultView);
  }, [isOpen, defaultView]);

  // Prevent body scroll when modal open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleForgotSubmit = (contact) => {
    // TODO: API call to send code
    console.log('Send reset code to:', contact);
    setView('verify');
  };

  const handleVerify = (code) => {
    // TODO: API call to verify code
    console.log('Verifying code:', code);
    setView('reset');
  };

  const handleReset = (newPass) => {
    // TODO: API call to reset password
    console.log('Reset password:', newPass);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="auth-backdrop"
      id="auth-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Authentication"
    >
      <div
        className={`auth-modal ${view === 'signup' ? 'auth-modal--tall' : ''}`}
        id="auth-modal"
      >
        <button
          type="button"
          className="auth-close-btn"
          id="btn-auth-close"
          onClick={onClose}
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="auth-modal-body">
          {view === 'login' && (
            <LoginView
              onClose={onClose}
              onSwitchSignup={() => setView('signup')}
              onForgotPassword={() => setView('forgot')}
              onLoginSuccess={onLoginSuccess}
            />
          )}
          {view === 'signup' && (
            <SignupView
              onClose={onClose}
              onSwitchLogin={() => setView('login')}
            />
          )}
          {view === 'forgot' && (
            <ForgotPasswordView onSubmit={handleForgotSubmit} />
          )}
          {view === 'verify' && (
            <VerifyCodeView onVerify={handleVerify} />
          )}
          {view === 'reset' && (
            <ResetPasswordView onReset={handleReset} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
