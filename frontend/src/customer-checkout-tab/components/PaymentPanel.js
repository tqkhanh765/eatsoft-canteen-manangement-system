import React from 'react';
import { PAYMENT_METHODS } from '../constants/appConstants';
import { SVGIcons } from '../constants/icons';

const PaymentPanel = ({ selectedPayment, onPaymentChange }) => {
  const activePayment = PAYMENT_METHODS.find((m) => m.id === selectedPayment);

  return (
    <div className="payment-panel">
      {/* Payment method selector */}
      <div className="payment-method-row">
        <span className="payment-method-label">Payment method:</span>
        <div className="payment-method-options">
          {PAYMENT_METHODS.map((m) => (
            <button
              key={m.id}
              id={`pm-btn-${m.id}`}
              className={`pm-option-btn${selectedPayment === m.id ? ' active' : ''}`}
              onClick={() => onPaymentChange(m.id)}
              aria-label={m.label}
            >
              {m.logo}
            </button>
          ))}
        </div>
      </div>

      {/* QR code display */}
      {activePayment && (
        <div className="qr-code-section">
          <div
            className="qr-code-frame"
            style={{ borderColor: activePayment.qrBorderColor }}
          >
            <img
              src={activePayment.qrSrc}
              alt={`${activePayment.label} QR Code`}
              className="qr-code-img"
            />
            {selectedPayment === 'momo' && (
              <div className="qr-momo-overlay">
                <svg viewBox="0 0 40 20" width="52" height="26" xmlns="http://www.w3.org/2000/svg">
                  <rect width="40" height="20" rx="4" fill="#a50064"/>
                  <text x="50%" y="14" textAnchor="middle" fill="white" fontFamily="Arial" fontWeight="bold" fontSize="10">mo</text>
                </svg>
              </div>
            )}
          </div>
          <p className="qr-instruction">{activePayment.instruction}</p>
        </div>
      )}
    </div>
  );
};

export default PaymentPanel;
