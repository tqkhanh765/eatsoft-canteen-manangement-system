/**
 * Currency formatting utilities
 */

/**
 * Formats an amount as Vietnamese Dong currency
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return Number(amount).toLocaleString('vi-VN') + ' VND';
};

/**
 * Calculates the subtotal for an array of items
 * @param {Array} items - Array of items with unit_price and quantity
 * @returns {number} The subtotal amount
 */
export const calculateSubtotal = (items) => {
  return items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
};

/**
 * Calculates the grand total including delivery fee and discount
 * @param {number} subtotal - The subtotal amount
 * @param {number} deliveryFee - The delivery fee
 * @param {number} discount - The discount amount
 * @param {boolean} isDelivery - Whether delivery is selected
 * @returns {number} The grand total amount
 */
export const calculateGrandTotal = (subtotal, deliveryFee, discount = 0, isDelivery = true) => {
  return subtotal - discount + (isDelivery ? deliveryFee : 0);
};

/**
 * Formats an item price with quantity
 * @param {number} unitPrice - The unit price
 * @param {number} quantity - The quantity
 * @returns {string} Formatted price string
 */
export const formatItemPrice = (unitPrice, quantity) => {
  return formatCurrency(unitPrice * quantity);
};
