import React, { useState } from 'react';
import { PasswordField } from './AuthShared';

const SignupView = ({ onClose, onSwitchLogin }) => {
  const [form, setForm] = useState({
    email: '',
    fullName: '',
    phone: '',
    password: '',
    confirm: '',
  });

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: integrate with auth API
    console.log('Signup:', form);
  };

  return (
    <div className="auth-view" id="auth-view-signup">
      <h1 className="auth-title">Sign up</h1>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <label className="auth-label" htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            type="email"
            className="auth-input"
            value={form.email}
            onChange={set('email')}
            autoComplete="email"
            required
          />
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="signup-fullname">Full name</label>
          <input
            id="signup-fullname"
            type="text"
            className="auth-input"
            value={form.fullName}
            onChange={set('fullName')}
            autoComplete="name"
            required
          />
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="signup-phone">Phone number</label>
          <input
            id="signup-phone"
            type="tel"
            className="auth-input"
            value={form.phone}
            onChange={set('phone')}
            autoComplete="tel"
          />
        </div>

        <PasswordField
          id="signup-password"
          label="Password"
          value={form.password}
          onChange={set('password')}
        />

        <PasswordField
          id="signup-confirm"
          label="Confirm password"
          value={form.confirm}
          onChange={set('confirm')}
        />

        <button type="submit" className="auth-submit-btn" id="btn-signup-submit">
          Sign up
        </button>
      </form>

      <p className="auth-switch">
        Already have an account?{' '}
        <button
          type="button"
          className="auth-link auth-link-bold"
          id="btn-go-login"
          onClick={onSwitchLogin}
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default SignupView;
