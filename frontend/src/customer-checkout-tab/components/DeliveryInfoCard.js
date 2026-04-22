import React from 'react';
import { SVGIcons } from '../constants/icons';
import { DEFAULT_LOCATION, DEFAULT_CUSTOMER_NAME, DEFAULT_CUSTOMER_PHONE } from '../constants/appConstants';

const DeliveryInfoCard = ({ order, deliveryOption, room, onDeliveryChange, onRoomChange, readOnly = false }) => {
  return (
    <div className="delivery-info-card">
      <div className="info-row">
        <span className="info-label">Location:</span>
        <span className="info-value">{DEFAULT_LOCATION}</span>
      </div>
      <div className="info-row">
        <span className="info-label">Room:</span>
        <input
          type="text"
          id="room-input"
          className="info-input"
          placeholder="Enter your room"
          value={room}
          onChange={(e) => onRoomChange(e.target.value)}
          readOnly={readOnly}
        />
      </div>
      <div className="info-row">
        <span className="info-label">Name:</span>
        <span className="info-value">{order?.customer_name || DEFAULT_CUSTOMER_NAME}</span>
      </div>
      <div className="info-row">
        <span className="info-label">Phone:</span>
        <span className="info-value">{order?.customer_phone || DEFAULT_CUSTOMER_PHONE}</span>
      </div>

      {/* Pickup / Delivery toggle */}
      <div className="pickup-options-section">
        <div className="info-label">Pickup options:</div>
        <div className="pickup-buttons">
          <button
            id="pickup-delivery-btn"
            className={`pickup-btn${deliveryOption === 'delivery' ? ' active' : ''}`}
            onClick={() => !readOnly && onDeliveryChange('delivery')}
            disabled={readOnly}
          >
            <div className="pickup-icon">{SVGIcons.delivery}</div>
            <div className="pickup-title">Delivery</div>
            <div className="pickup-time">Estimated waiting time – 20 mins</div>
          </button>
          <button
            id="pickup-stall-btn"
            className={`pickup-btn${deliveryOption === 'pickup' ? ' active' : ''}`}
            onClick={() => !readOnly && onDeliveryChange('pickup')}
            disabled={readOnly}
          >
            <div className="pickup-icon">{SVGIcons.stall}</div>
            <div className="pickup-title">Pickup at stalls</div>
            <div className="pickup-time">Estimated waiting time – 10 mins</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInfoCard;
