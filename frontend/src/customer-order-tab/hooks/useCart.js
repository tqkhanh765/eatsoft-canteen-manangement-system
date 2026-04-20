import { useState, useCallback, useEffect } from 'react';
import { fetchOrders, fetchOrderById } from '../services/orderService';
import { APP_CONSTANTS } from '../constants/appConstants';
import authService from '../../services/authService';

/**
 * Custom hook for managing cart state and operations
 * @returns {Object} Cart state and functions
 */
export const useCart = () => {
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load pending order for current user
  const loadCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        setOrder(null);
        setItems([]);
        setLoading(false);
        return;
      }

      // Fetch all Pending orders for the logged-in user
      const orders = await fetchOrders({ user_id: currentUser.userId, status: 'Pending' });

      if (orders && orders.length > 0) {
        // Use the most recent pending order
        const pendingOrder = orders[0];
        const orderId = pendingOrder.id || pendingOrder.orderId;

        if (!orderId) {
          setOrder(null);
          setItems([]);
        } else {
          // Fetch full details with items
          const detailed = await fetchOrderById(orderId);
          const items = detailed.items || detailed.orderItems || detailed.order_items || [];
          setOrder(detailed);
          setItems(items);
        }
      } else {
        setOrder(null);
        setItems([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Clear cart after successful checkout
  const clearCart = useCallback(() => {
    setItems([]);
    setOrder(null);
  }, []);

  return {
    order,
    items,
    loading,
    error,
    loadCart,
    clearCart,
    setError
  };
};
