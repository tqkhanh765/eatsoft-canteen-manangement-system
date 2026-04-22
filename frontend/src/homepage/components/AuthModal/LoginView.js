import React, { useState } from 'react';
import { PasswordField } from './AuthShared';
import authService from '../../../services/authService';

const LoginView = ({ onClose, onSwitchSignup, onForgotPassword, onLoginSuccess, onRegisterStall, onAdmin2FARequired }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[LoginView] Login form submitted for email:', email);
    setError('');
    setIsLoading(true);

    try {
      console.log('[LoginView] Calling authService.login...');
      const result = await authService.login(email, password);
      console.log('[LoginView] authService.login result:', result);

      if (result.success) {
        // ── Admin 2FA intercept ─────────────────────────────────
        if (result.requires2FA) {
          console.log('[LoginView] Admin 2FA required, switching view');
          if (onAdmin2FARequired) onAdmin2FARequired(result.email, result.otpToken);
          return;
        }
        // ──────────────────────────────────────────────────────

        console.log('[LoginView] Login successful for user:', result.user?.userName);
        console.log('[LoginView] User role:', result.user?.role?.roleName);

        if (onLoginSuccess) {
          console.log('[LoginView] Calling onLoginSuccess callback');
          onLoginSuccess(result.user);
        }

        if (result.user?.role?.roleName === 'Vendor') {
          console.log('[LoginView] User is vendor, redirecting to /vendor-menu');
          window.location.href = '/vendor-menu';
        } else {
          console.log('[LoginView] User is not vendor, closing modal');
          onClose();
        }
      } else {
        console.error('[LoginView] Login failed:', result.error);
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('[LoginView] Login error caught:', err);
      console.error('[LoginView] Error response:', err.response?.data);
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      console.log('[LoginView] Login attempt completed');
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-view" id="auth-view-login">
      <h1 className="auth-title">Log in</h1>

      {/* Error message */}
      {error && (
        <div className="auth-error" style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <label className="auth-label" htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            className="auth-input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            required
            disabled={isLoading}
          />
        </div>

        <PasswordField
          id="login-password"
          label="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={isLoading}
        />

        <div className="auth-row">
          <label className="auth-remember" htmlFor="login-remember">
            <input
              id="login-remember"
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
            />
            <span className="auth-remember-box" aria-hidden="true" />
            Remember me
          </label>
          <button
            type="button"
            className="auth-link"
            id="btn-forgot-password"
            onClick={onForgotPassword}
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className="auth-submit-btn"
          id="btn-login-submit"
          disabled={isLoading}
          style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
        >
          {isLoading ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="auth-switch">
        Didn't have an account?{' '}
        <button
          type="button"
          className="auth-link auth-link-bold"
          id="btn-go-register"
          onClick={onSwitchSignup}
        >
          Register now
        </button>
      </p>

      <p className="auth-switch partner-link">
        Want to be our partner?{' '}
        <button
          type="button"
          className="auth-link auth-link-bold stall-register-link"
          id="btn-register-stall"
          onClick={onRegisterStall}
        >
          Register your stall here
        </button>
      </p>
    </div>
  );
};

export default LoginView;
