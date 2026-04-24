// ── Currency formatting ───────────────────────────────────────────────────────────
export const formatCurrency = (amount) =>
  Number(amount).toLocaleString('vi-VN') + 'VND';

export const calculateSubtotal = (items) =>
  items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

export const calculateGrandTotal = (subTotal, discount, deliveryFee, isDelivery) =>
  subTotal - discount + (isDelivery ? deliveryFee : 0);
