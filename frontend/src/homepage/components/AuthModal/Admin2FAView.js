import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

/**
 * Admin2FAView
 * Shown after admin credentials are verified. The user must enter the OTP
 * sent to their email to receive the real JWT.
 *
 * Props:
 *   email      – admin's email (for display + API call)
 *   otpToken   – short-lived token returned by /login
 *   onSuccess  – called with { token, user } once 2FA passes
 *   onBack     – goes back to login view
 */
const Admin2FAView = ({ email, otpToken, onSuccess, onBack }) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.trim().length !== 6) {
      setError('Please enter the 6-digit code sent to your email.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/admin-2fa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otp.trim(), otpToken }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Verification failed. Please try again.');
        return;
      }

      // Persist token + user in localStorage (same as normal login)
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      onSuccess(data.user);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-view" id="auth-view-admin-2fa">
      {/* Shield icon */}
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 60, height: 60, borderRadius: '50%',
          background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
          marginBottom: 8,
        }}>
          <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <polyline points="9 12 11 14 15 10"/>
          </svg>
        </div>
        <h1 className="auth-title" style={{ marginBottom: 6 }}>Two-Factor Authentication</h1>
        <p style={{ color: '#6B7280', fontSize: 14, margin: 0 }}>
          A 6-digit code has been sent to<br />
          <strong style={{ color: '#111827' }}>{email}</strong>
        </p>
      </div>

      {error && (
        <div className="auth-error" style={{ color: '#EF4444', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <label className="auth-label" htmlFor="admin-otp">Verification Code</label>
          <input
            id="admin-otp"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            className="auth-input"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
            autoFocus
            required
            disabled={isLoading}
            style={{ letterSpacing: '0.3em', fontSize: 22, textAlign: 'center', fontWeight: 700 }}
          />
        </div>

        <button
          type="submit"
          className="auth-submit-btn"
          id="btn-admin-2fa-submit"
          disabled={isLoading || otp.length < 6}
          style={{ opacity: (isLoading || otp.length < 6) ? 0.65 : 1 }}
        >
          {isLoading ? 'Verifying…' : 'Verify & Login'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#6B7280' }}>
        Didn't receive the code?{' '}
        <button
          type="button"
          className="auth-link"
          onClick={onBack}
          style={{ fontSize: 13 }}
        >
          Go back and try again
        </button>
      </p>
    </div>
  );
};

export default Admin2FAView;
