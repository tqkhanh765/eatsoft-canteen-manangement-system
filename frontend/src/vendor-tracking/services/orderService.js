// services/orderService.js
// Fetch real orders from backend for vendor tracking

import API from './API';

// Map backend order status to vendor UI status
const mapStatusToVendor = (status) => {
  const statusMap = {
    'PENDING': 'new',
    'ACCEPTED': 'new',
    'COOKING': 'active',
    'COMPLETED': 'completed'
  };
  return statusMap[status] || 'new';
};

// Map backend order to vendor UI format
const mapOrderToVendor = (order) => ({
  id: order.orderId,
  status: mapStatusToVendor(order.status),
  stage: order.status === 'COOKING' ? 'cooking' : order.status === 'COMPLETED' ? 'done' : null,
  customerName: order.user?.userName || 'Unknown',
  total: Number(order.totalAmount),
  currency: "VND",
  items: order.orderItems?.map(item => ({
    name: item.product?.name || 'Unknown',
    qty: item.quantity
  })) || [],
  createdAt: new Date(order.orderDate).getTime()
});

export const getOrders = async (storeId) => {
  try {
    const url = storeId ? `/orders?storeId=${storeId}` : '/orders';
    const response = await API.get(url);
    // Filter orders that are not PENDING (cart) or Cancelled
    const activeOrders = response.data.filter(order =>
      order.status !== 'PENDING' && order.status !== 'Cancelled'
    );
    return activeOrders.map(mapOrderToVendor);
  } catch (error) {
    console.error('Failed to fetch vendor orders:', error);
    return [];
  }
};

export const updateOrder = async (orderId, action) => {
  try {
    // Map vendor UI action to backend status
    const statusMap = {
      'active': 'COOKING',
      'done': 'COMPLETED',
      'delivering': 'COMPLETED',
      'completed': 'COMPLETED'
    };
    const status = statusMap[action] || action;

    await API.patch(`/orders/${orderId}/status`, { status });
    return { success: true };
  } catch (error) {
    console.error('Failed to update order:', error);
    return { success: false };
  }
};