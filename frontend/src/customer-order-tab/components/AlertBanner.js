import React from 'react';
import { SVGIcons } from '../constants/icons';

/**
 * AlertBanner component for displaying error and success messages
 * @param {Object} props - Component props
 * @param {string} props.message - The message to display
 * @param {'error'|'success'} props.type - Type of alert
 * @param {Function} props.onClose - Function to call when close button is clicked
 * @returns {JSX.Element} Alert banner component
 */
export const AlertBanner = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div className={`cart-alert cart-alert--${type}`} role={type === 'error' ? 'alert' : 'status'}>
      {message}
      {onClose && (
        <button className="cart-alert-close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
};
