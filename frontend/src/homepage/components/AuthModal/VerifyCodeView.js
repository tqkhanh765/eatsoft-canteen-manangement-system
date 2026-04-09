import React, { useState } from 'react';

const VerifyCodeView = ({ onVerify }) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onVerify(code);
  };

  return (
    <div className="auth-view" id="auth-view-verify">
      <h1 className="auth-title">Enter verified code</h1>
      <p className="auth-subtitle">
        A verified code has been sent to your email/phone number
      </p>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <input
            id="verify-code"
            type="text"
            className="auth-input"
            placeholder="Enter the verified code"
            value={code}
            onChange={e => setCode(e.target.value)}
            required
            maxLength={8}
          />
        </div>

        <button type="submit" className="auth-submit-btn" id="btn-verify-submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default VerifyCodeView;
