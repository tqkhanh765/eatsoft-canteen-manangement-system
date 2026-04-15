import React from 'react';
import { formatCurrency, calculateSubtotal, calculateGrandTotal } from '../utils/currencyUtils';
import { DELIVERY_FEE, DISCOUNT } from '../constants/appConstants';

const OrderSummary = ({ items, deliveryOption }) => {
  const subTotal = calculateSubtotal(items);
  const grandTotal = calculateGrandTotal(
    subTotal,
    DISCOUNT,
    DELIVERY_FEE,
    deliveryOption === 'delivery'
  );

  return (
    <div className="summary-section">
      <div className="summary-row">
        <span className="summary-label">Sub Total:</span>
        <span className="summary-value">{formatCurrency(subTotal)}</span>
      </div>
      <div className="summary-row discount-row">
        <span className="summary-label">Discount:</span>
        <span className="summary-value discount-value">-{formatCurrency(DISCOUNT)}</span>
      </div>
      <div className="summary-row">
        <span className="summary-label">Delivery fee:</span>
        <span className="summary-value">
          {deliveryOption === 'delivery' ? formatCurrency(DELIVERY_FEE) : 'Free'}
        </span>
      </div>
      <div className="summary-row grand-total">
        <span className="summary-label">Grand total:</span>
        <span className="summary-value">{formatCurrency(grandTotal)}</span>
      </div>
    </div>
  );
};

export default OrderSummary;
