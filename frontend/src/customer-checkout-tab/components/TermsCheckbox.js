import React from 'react';

const TermsCheckbox = ({ agreedToTerms, onChange }) => {
  return (
    <label className="terms-checkbox-label" htmlFor="terms-checkbox">
      <input
        type="checkbox"
        id="terms-checkbox"
        className="terms-checkbox"
        checked={agreedToTerms}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>
        By confirming the order, I accept the{' '}
        <a href="#terms" className="terms-link">terms of user</a>{' '}
        agreement
      </span>
    </label>
  );
};

export default TermsCheckbox;
