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
  
  // Forgot password flow state
  const [resetEmail, setResetEmail] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [resetToken, setResetToken] = useState('');

  console.log('[AuthModal] Rendered with isOpen:', isOpen);

  // Reset view whenever modal opens
  useEffect(() => {
    console.log('[AuthModal] isOpen changed to:', isOpen);
    if (isOpen) {
      setView(defaultView);
      // Reset forgot password state
      setResetEmail('');
      setOtpToken('');
      setResetToken('');
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
    // Go back to login after successful reset
    setView('login');
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
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
