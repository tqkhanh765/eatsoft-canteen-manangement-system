import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const ForgotPasswordView = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate email format
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          setError('No account found with the corresponding email.');
        } else {
          setError(data.error || 'Failed to send OTP. Please try again.');
        }
        setLoading(false);
        return;
      }

      // Success - pass email and otpToken to parent for verification
      onSubmit(email, data.otpToken);
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-view" id="auth-view-forgot">
      <h1 className="auth-title">Forgot password</h1>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
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
        <div className="auth-field">
          <label className="auth-label" htmlFor="forgot-email">
            Your email
          </label>
          <input
            id="forgot-email"
            type="email"
            className="auth-input"
            placeholder="Enter your email to recover password"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(''); }}
            required
          />
        </div>

        <button 
          type="submit" 
          className="auth-submit-btn" 
          id="btn-forgot-submit"
          disabled={loading}
          style={loading ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
        >
          {loading ? 'Sending...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordView;
