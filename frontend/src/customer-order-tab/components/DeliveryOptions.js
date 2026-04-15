import React from 'react';
import { SVGIcons } from '../constants/icons';
import { APP_CONSTANTS } from '../constants/appConstants';

/**
 * DeliveryOptions component for selecting delivery or pickup
 * @param {Object} props - Component props
 * @param {string} props.selectedOption - Currently selected option
 * @param {Function} props.onOptionChange - Function to handle option change
 * @returns {JSX.Element} Delivery options component
 */
export const DeliveryOptions = ({ selectedOption, onOptionChange }) => {
  return (
    <div className="pickup-options-section">
      <div className="info-label">Pickup options:</div>
      <div className="pickup-buttons">
        <button
          id="pickup-delivery-btn"
          className={`pickup-btn ${selectedOption === APP_CONSTANTS.DELIVERY_OPTIONS.DELIVERY ? 'active' : ''}`}
          onClick={() => onOptionChange(APP_CONSTANTS.DELIVERY_OPTIONS.DELIVERY)}
        >
          <div className="pickup-icon">{SVGIcons.delivery}</div>
          <div className="pickup-title">Delivery</div>
          <div className="pickup-time">Estimated waiting time - {APP_CONSTANTS.DELIVERY_TIMES.DELIVERY} mins</div>
        </button>
        <button
          id="pickup-stall-btn"
          className={`pickup-btn ${selectedOption === APP_CONSTANTS.DELIVERY_OPTIONS.PICKUP ? 'active' : ''}`}
          onClick={() => onOptionChange(APP_CONSTANTS.DELIVERY_OPTIONS.PICKUP)}
        >
          <div className="pickup-icon">{SVGIcons.stall}</div>
          <div className="pickup-title">Pickup at stalls</div>
          <div className="pickup-time">Estimated waiting time - {APP_CONSTANTS.DELIVERY_TIMES.PICKUP} mins</div>
        </button>
      </div>
    </div>
  );
};
