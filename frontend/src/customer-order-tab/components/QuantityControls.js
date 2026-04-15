import React from 'react';
import { SVGIcons } from '../constants/icons';

/**
 * QuantityControls component for managing item quantity
 * @param {Object} props - Component props
 * @param {number} props.quantity - Current quantity
 * @param {Function} props.onIncrease - Function to call when increase button is clicked
 * @param {Function} props.onDecrease - Function to call when decrease button is clicked
 * @param {boolean} props.disabled - Whether controls are disabled
 * @param {boolean} props.canDecrease - Whether decrease button should be enabled
 * @returns {JSX.Element} Quantity controls component
 */
export const QuantityControls = ({ 
  quantity, 
  onIncrease, 
  onDecrease, 
  disabled = false, 
  canDecrease = true 
}) => {
  return (
    <div className="quantity-controls">
      <button
        className="qty-btn minus"
        onClick={onDecrease}
        disabled={disabled || !canDecrease}
        aria-label="Decrease quantity"
      >
        {SVGIcons.minus}
      </button>
      <span className="qty-value">{quantity}</span>
      <button
        className="qty-btn plus"
        onClick={onIncrease}
        disabled={disabled}
        aria-label="Increase quantity"
      >
        {SVGIcons.plus}
      </button>
    </div>
  );
};
