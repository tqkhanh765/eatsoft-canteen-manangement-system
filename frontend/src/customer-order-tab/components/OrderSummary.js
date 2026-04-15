import React from 'react';
import { formatCurrency } from '../utils/currencyUtils';
import { APP_CONSTANTS } from '../constants/appConstants';
import { SVGIcons } from '../constants/icons';

/**
 * OrderSummary component for displaying order totals and checkout button
 * @param {Object} props - Component props
 * @param {number} props.subtotal - Order subtotal
 * @param {number} props.discount - Discount amount
 * @param {string} props.deliveryOption - Selected delivery option
 * @param {string} props.couponCode - Current coupon code
 * @param {Function} props.onCouponChange - Function to handle coupon code change
 * @param {Function} props.onCheckout - Function to handle checkout
 * @param {boolean} props.isCheckoutLoading - Whether checkout is in progress
 * @param {boolean} props.isCheckoutDisabled - Whether checkout button should be disabled
 * @returns {JSX.Element} Order summary component
 */
export const OrderSummary = ({ 
  subtotal, 
  discount = 0, 
  deliveryOption, 
  couponCode, 
  onCouponChange, 
  onCheckout, 
  isCheckoutLoading = false, 
  isCheckoutDisabled = false 
}) => {
  const deliveryFee = deliveryOption === APP_CONSTANTS.DELIVERY_OPTIONS.DELIVERY ? APP_CONSTANTS.DELIVERY_FEE : 0;
  const grandTotal = subtotal - discount + deliveryFee;

  return (
    <>
      <div className="summary-section">
        <div className="summary-row">
          <span className="summary-label">Sub Total:</span>
          <span className="summary-value">{formatCurrency(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="summary-row">
            <span className="summary-label">Discount:</span>
            <span className="summary-value">-{formatCurrency(discount)}</span>
          </div>
        )}
        <div className="coupon-row">
          <input
            type="text"
            id="coupon-input"
            className="coupon-input"
            placeholder="Enter your coupon code"
            value={couponCode}
            onChange={(e) => onCouponChange(e.target.value)}
          />
        </div>
        <div className="summary-row">
          <span className="summary-label">Delivery fee:</span>
          <span className="summary-value">
            {deliveryOption === APP_CONSTANTS.DELIVERY_OPTIONS.DELIVERY ? formatCurrency(APP_CONSTANTS.DELIVERY_FEE) : 'Free'}
          </span>
        </div>
        <div className="summary-row grand-total">
          <span className="summary-label">Grand total:</span>
          <span className="summary-value">{formatCurrency(grandTotal)}</span>
        </div>
      </div>

      <button
        id="checkout-btn"
        className="checkout-btn"
        onClick={onCheckout}
        disabled={isCheckoutLoading || isCheckoutDisabled}
      >
        <div className="checkout-icon-wrap">
          {isCheckoutLoading ? SVGIcons.spinner : SVGIcons.checkoutArrow}
        </div>
        <span>{isCheckoutLoading ? APP_CONSTANTS.LOADING_MESSAGES.CHECKOUT : 'Checkout!'}</span>
      </button>
    </>
  );
};
