import React, { useState, useEffect } from 'react';
import './AuthModal.css';

import LoginView from './LoginView';
import SignupView from './SignupView';
import ForgotPasswordView from './ForgotPasswordView';
import VerifyCodeView from './VerifyCodeView';
import ResetPasswordView from './ResetPasswordView';
import Admin2FAView from './Admin2FAView';

/* ─── Main AuthModal Orchestrator ────────────────────────────── */
const AuthModal = ({ isOpen, defaultView = 'login', onClose, onLoginSuccess, onRegisterStall }) => {
  const [view, setView] = useState(defaultView);

  // Forgot password flow state
  const [resetEmail, setResetEmail] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [resetToken, setResetToken] = useState('');

  // Admin 2FA flow state
  const [admin2FAEmail, setAdmin2FAEmail] = useState('');
  const [admin2FAToken, setAdmin2FAToken] = useState('');

  console.log('[AuthModal] Rendered with isOpen:', isOpen);

  // Reset view whenever modal opens
  useEffect(() => {
    console.log('[AuthModal] isOpen changed to:', isOpen);
    if (isOpen) {
      setView(defaultView);
      setResetEmail('');
      setOtpToken('');
      setResetToken('');
      setAdmin2FAEmail('');
      setAdmin2FAToken('');
    }
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

  // ── Forgot password handlers ───────────────────────────────────
  const handleForgotSubmit = (email, token) => {
    setResetEmail(email);
    setOtpToken(token);
    setView('verify');
  };

  const handleVerify = (token) => {
    setResetToken(token);
    setView('reset');
  };

  const handleResetSuccess = () => {
    setView('login');
  };

  // ── Admin 2FA handler ─────────────────────────────────────────
  // Called by LoginView when backend returns requires2FA: true
  const handleAdmin2FARequired = (email, otpTok) => {
    setAdmin2FAEmail(email);
    setAdmin2FAToken(otpTok);
    setView('admin-2fa');
  };

  // Called by Admin2FAView when OTP verified successfully
  const handleAdmin2FASuccess = (user) => {
    if (onLoginSuccess) onLoginSuccess(user);
    window.location.href = '/admin/dashboard';
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
              onRegisterStall={onRegisterStall}
              onAdmin2FARequired={handleAdmin2FARequired}
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
            <VerifyCodeView
              email={resetEmail}
              otpToken={otpToken}
              onVerify={handleVerify}
            />
          )}
          {view === 'reset' && (
            <ResetPasswordView
              email={resetEmail}
              resetToken={resetToken}
              onSuccess={handleResetSuccess}
            />
          )}
          {view === 'admin-2fa' && (
            <Admin2FAView
              email={admin2FAEmail}
              otpToken={admin2FAToken}
              onSuccess={handleAdmin2FASuccess}
              onBack={() => setView('login')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
