// services/orderService.js
// Fetch real orders from backend for vendor tracking

import API from './API';

// Map backend order status to vendor UI status
const mapStatusToVendor = (status) => {
  const statusMap = {
    'Pending': 'new',
    'Cooking': 'active',
    'Ready': 'done',
    'Delivering': 'delivering',
    'Completed': 'completed',
    'Cancelled': 'cancelled'
  };
  return statusMap[status] || 'new';
};

// Map backend order to vendor UI format
const mapOrderToVendor = (order) => ({
  id: order.orderId,
  status: mapStatusToVendor(order.status),
  stage: order.status === 'Cooking' ? 'cooking' : order.status === 'Ready' ? 'done' : null,
  table: order.userId, // Using userId as table identifier for now
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
    // Filter orders that are not Pending (cart) or Cancelled
    const activeOrders = response.data.filter(order =>
      order.status !== 'Pending' && order.status !== 'Cancelled'
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
      'active': 'Cooking',
      'done': 'Ready',
      'delivering': 'Delivering',
      'completed': 'Completed'
    };
    const status = statusMap[action] || action;

    await API.patch(`/orders/${orderId}/status`, { status });
    return { success: true };
  } catch (error) {
    console.error('Failed to update order:', error);
    return { success: false };
  }
};