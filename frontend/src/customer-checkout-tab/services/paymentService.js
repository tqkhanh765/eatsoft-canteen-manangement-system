// ── Payment service ───────────────────────────────────────────────────────────────
export const processPayment = async (paymentData) => {
  // TODO: Replace with real API call when backend is ready
  await new Promise((resolve) => setTimeout(resolve, 1200)); // simulate network
  return { success: true, message: 'Payment confirmed! Your order is being prepared.' };
};

export const fetchCheckoutData = async () => {
  // TODO: Replace with real API call when backend is ready
  await new Promise((resolve) => setTimeout(resolve, 500)); // simulate network
  return {
    order: {
      id: 1,
      customer_name: 'Nguyen Van A',
      customer_phone: '(+84) 901 234 567',
      store_name: 'Stall A',
    },
    items: [
      { id: 1, product_id: 101, product_name: 'Cơm tấm sườn', store_name: 'Stall A', unit_price: 45000, quantity: 2 },
      { id: 2, product_id: 102, product_name: 'Trà sữa trân châu', store_name: 'Stall A', unit_price: 35000, quantity: 1 },
      { id: 3, product_id: 103, product_name: 'Bánh mì thịt nướng', store_name: 'Stall A', unit_price: 25000, quantity: 4 },
    ],
  };
};
