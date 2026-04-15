import { useState, useCallback, useEffect } from 'react';
import { fetchOrders, fetchOrderById } from '../services/orderService';
import { APP_CONSTANTS } from '../constants/appConstants';

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
      // Fetch all Pending orders for the logged-in user
      const order = await fetchOrderById(51);
      if (order) {
        // Use the most recent pending order; it already includes joined store_name
        setOrder(order);
        // Items are bundled in the order if using getOrderById;
        // fetchOrders returns headers only - fetch full detail separately
        const detailed = await fetchOrderById(order.id);
        setItems(detailed.items || []);
        setOrder(detailed);
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
