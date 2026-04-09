import React, { useState } from 'react';
import { PasswordField } from './AuthShared';

const LoginView = ({ onClose, onSwitchSignup, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: integrate with auth API
    console.log('Login:', { email, password, remember });
  };

  return (
    <div className="auth-view" id="auth-view-login">
      <h1 className="auth-title">Log in</h1>
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
          />
        </div>

        <PasswordField
          id="login-password"
          label="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
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

        <button type="submit" className="auth-submit-btn" id="btn-login-submit">
          Log in
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
    </div>
  );
};

export default LoginView;
