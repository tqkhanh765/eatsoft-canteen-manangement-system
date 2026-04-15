import React from 'react';
import { SVGIcons } from '../constants/icons';
import { LOADING_MESSAGES } from '../constants/appConstants';

const ConfirmPaymentButton = ({ onClick, disabled, isLoading }) => {
  return (
    <button
      id="confirm-payment-btn"
      className="confirm-payment-btn"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="confirm-payment-icon">
        {isLoading ? SVGIcons.spinner : SVGIcons.confirmPlus}
      </span>
      <span>{isLoading ? LOADING_MESSAGES.PAYMENT : 'Confirm Payment'}</span>
    </button>
  );
};

export default ConfirmPaymentButton;
