import { API_CONFIG } from '../config/apiConfig';

// ── Orders ──────────────────────────────────────────────────────────────────

/**
 * Fetch a single order (with its items) by order ID.
 * GET /api/orders/:id
 */
export const fetchOrderById = async (orderId) => {
  const res = await fetch(`${API_CONFIG.BASE_URL}/orders/${orderId}`);
  if (!res.ok) throw new Error(`Failed to fetch order: ${res.statusText}`);
  return res.json();
};

/**
 * Fetch all orders, optionally filtered.
 * GET /api/orders?user_id=&store_id=&status=
 */
export const fetchOrders = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const res = await fetch(`${API_CONFIG.BASE_URL}/orders${params ? `?${params}` : ''}`);
  if (!res.ok) throw new Error(`Failed to fetch orders: ${res.statusText}`);
  return res.json();
};

/**
 * Create a new order with items in a single transaction.
 * POST /api/orders
 * Body: { user_id, store_id, items: [{product_id, quantity, unit_price}], delivery_address, note }
 */
export const createOrder = async (orderPayload) => {
  const res = await fetch(`${API_CONFIG.BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderPayload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create order');
  }
  return res.json();
};

/**
 * Update only the status of an order.
 * PATCH /api/orders/:id/status
 * Body: { status }  — one of: PENDING, COOKING, COMPLETED
 */
export const updateOrderStatus = async (orderId, status) => {
  const res = await fetch(`${API_CONFIG.BASE_URL}/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update order status');
  }
  return res.json();
};

/**
 * Delete an order entirely.
 * DELETE /api/orders/:id
 */
export const deleteOrder = async (orderId) => {
  const res = await fetch(`${API_CONFIG.BASE_URL}/orders/${orderId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete order: ${res.statusText}`);
  return res.json();
};

// ── Order Items ──────────────────────────────────────────────────────────────

/**
 * Update quantity, unit_price, and/or note of a single order item.
 * PUT /api/order-items/:id
 * Body: { quantity, unit_price, note }
 * Note: backend automatically recalculates order total_price.
 */
export const updateOrderItem = async (itemId, { quantity, unit_price, note }) => {
  const res = await fetch(`${API_CONFIG.BASE_URL}/order-items/${itemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity, unit_price, note }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update item');
  }
  return res.json();
};

/**
 * Remove a single item from an order.
 * DELETE /api/order-items/:id
 * Note: backend automatically recalculates order total_price.
 */
export const deleteOrderItem = async (itemId) => {
  const res = await fetch(`${API_CONFIG.BASE_URL}/order-items/${itemId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete item: ${res.statusText}`);
  return res.json();
};

/**
 * Add an item to an existing order.
 * POST /api/orders/:id/items
 * Body: { productId, quantity, unitPrice, note }
 */
export const addItemToOrder = async (orderId, { productId, quantity, unitPrice, note }) => {
  const res = await fetch(`${API_CONFIG.BASE_URL}/orders/${orderId}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity, unitPrice, note }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to add item to order');
  }
  return res.json();
};
