import React, { useState } from 'react';
import { PasswordField } from './AuthShared';

const ResetPasswordView = ({ onReset, onClose }) => {
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) return;
    onReset(newPass);
  };

  return (
    <div className="auth-view" id="auth-view-reset">
      <h1 className="auth-title">Create new password</h1>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <PasswordField
          id="reset-new-password"
          label="New password"
          value={newPass}
          onChange={e => setNewPass(e.target.value)}
        />
        <PasswordField
          id="reset-confirm-password"
          label="Confirm new password"
          value={confirmPass}
          onChange={e => setConfirmPass(e.target.value)}
        />
        <button type="submit" className="auth-submit-btn" id="btn-reset-submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordView;
