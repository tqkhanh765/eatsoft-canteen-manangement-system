import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const VerifyCodeView = ({ email, otpToken, onVerify }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!code || code.length < 4) {
      setError('Please enter the OTP code');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: code, otpToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          setError('Incorrect OTP. Check your email carefully and enter the OTP again.');
        } else {
          setError(data.error || 'Failed to verify OTP. Please try again.');
        }
        setLoading(false);
        return;
      }

      // Success - pass resetToken to parent
      onVerify(data.resetToken);
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-view" id="auth-view-verify">
      <h1 className="auth-title">Enter verified code</h1>
      <p className="auth-subtitle">
        A verified code has been sent to your email
      </p>
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
          <input
            id="verify-code"
            type="text"
            className="auth-input"
            placeholder="Enter the verified code"
            value={code}
            onChange={e => { setCode(e.target.value); setError(''); }}
            required
            maxLength={8}
          />
        </div>

        <button 
          type="submit" 
          className="auth-submit-btn" 
          id="btn-verify-submit"
          disabled={loading}
          style={loading ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
        >
          {loading ? 'Verifying...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default VerifyCodeView;
