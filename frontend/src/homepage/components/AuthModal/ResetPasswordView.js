import React, { useState } from 'react';
import { PasswordField } from './AuthShared';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const ResetPasswordView = ({ email, resetToken, onSuccess }) => {
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords
    if (!newPass || newPass.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (newPass !== confirmPass) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword: newPass, resetToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'New password must not be the same as current password') {
          setError('New password must not be the same as current password');
        } else {
          setError(data.error || 'Failed to reset password. Please try again.');
        }
        setLoading(false);
        return;
      }

      // Success
      setSuccessMessage('Password reset successfully! Please login with your new password.');
      
      // Delay before calling onSuccess to show success message
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-view" id="auth-view-reset">
      <h1 className="auth-title">Create new password</h1>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {successMessage && (
          <div style={{
            backgroundColor: '#22C55E',
            color: 'white',
            padding: '12px',
            borderRadius: '6px',
            textAlign: 'center',
            fontWeight: '600',
            fontSize: '13px',
          }}>
            {successMessage}
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: '#EF4444',
            color: 'white',
            padding: '12px',
            borderRadius: '6px',
            textAlign: 'center',
            fontWeight: '600',
            fontSize: '13px',
          }}>
            {error}
          </div>
        )}

        <PasswordField
          id="reset-new-password"
          label="New password"
          value={newPass}
          onChange={e => { setNewPass(e.target.value); setError(''); }}
          error={error && (newPass.length < 6 || newPass !== confirmPass) ? '' : null}
        />
        <PasswordField
          id="reset-confirm-password"
          label="Confirm new password"
          value={confirmPass}
          onChange={e => { setConfirmPass(e.target.value); setError(''); }}
          error={error && newPass !== confirmPass ? '' : null}
        />

        <button 
          type="submit" 
          className="auth-submit-btn" 
          id="btn-reset-submit"
          disabled={loading || successMessage}
          style={(loading || successMessage) ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
        >
          {loading ? 'Resetting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordView;
