import { API_CONFIG } from '../../customer-order-tab/config/apiConfig';
import authService from '../../services/authService';

// ── Payment service ───────────────────────────────────────────────────────────────
export const processPayment = async (paymentData) => {
  // TODO: Replace with real API call when backend is ready
  await new Promise((resolve) => setTimeout(resolve, 1200)); // simulate network
  return { success: true, message: 'Payment confirmed! Your order is being prepared.' };
};

export const fetchCheckoutData = async () => {
  const currentUser = authService.getCurrentUser();
  if (!currentUser) {
    throw new Error('User not authenticated');
  }

  // Fetch pending order for the current user
  const res = await fetch(`${API_CONFIG.BASE_URL}/orders?userId=${currentUser.userId}&status=PENDING`);
  if (!res.ok) throw new Error(`Failed to fetch order: ${res.statusText}`);
  
  const orders = await res.json();
  
  if (!orders || orders.length === 0) {
    return {
      order: null,
      items: [],
    };
  }

  const order = orders[0];
  const items = order.orderItems || order.items || order.order_items || [];
  
  return {
    order: {
      id: order.orderId || order.id,
      customer_name: order.customer_name || currentUser.userName,
      customer_phone: order.customer_phone || currentUser.phone,
      store_name: order.store?.storeName || order.store_name,
    },
    items: items.map(item => ({
      id: item.orderItemId || item.id,
      product_id: item.productId || item.product_id,
      product_name: item.product?.name || item.product_name,
      store_name: order.store?.storeName || order.store_name,
      unit_price: item.unitPrice || item.unit_price,
      quantity: item.quantity,
    })),
  };
};
