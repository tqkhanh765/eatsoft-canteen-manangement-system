import React, { useState } from 'react';

const ForgotPasswordView = ({ onSubmit }) => {
  const [contact, setContact] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(contact);
  };

  return (
    <div className="auth-view" id="auth-view-forgot">
      <h1 className="auth-title">Forgot password</h1>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <label className="auth-label" htmlFor="forgot-contact">
            Your email/phone number
          </label>
          <input
            id="forgot-contact"
            type="text"
            className="auth-input"
            placeholder="Enter your email/phone number to recover password"
            value={contact}
            onChange={e => setContact(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="auth-submit-btn" id="btn-forgot-submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordView;
