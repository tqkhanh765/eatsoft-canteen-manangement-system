import { useState, useCallback, useEffect } from 'react';
import { fetchOrders, fetchOrderById, createOrder, addItemToOrder } from '../services/orderService';
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

  // Add item to cart
  const addItem = useCallback(async (product, quantity = 1, storeId) => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not logged in');
      }

      // Check if there's a pending order for the current user
      const pendingOrders = await fetchOrders({ user_id: currentUser.userId, status: 'Pending' });
      let orderId;

      if (pendingOrders && pendingOrders.length > 0) {
        // Use existing pending order
        const pendingOrder = pendingOrders[0];
        orderId = pendingOrder.id || pendingOrder.orderId;

        if (orderId) {
          // Check if the existing order is from a different store
          const orderStoreId = pendingOrder.storeId || pendingOrder.store?.storeId;
          const orderItems = pendingOrder.orderItems || pendingOrder.items || pendingOrder.order_items || [];
          
          // If order is empty, delete it and create new one for the new store
          if (orderItems.length === 0) {
            const { deleteOrder } = await import('../services/orderService');
            await deleteOrder(orderId);
            
            const newOrder = await createOrder({
              userId: currentUser.userId,
              storeId: storeId,
              status: 'Pending',
              items: [{
                productId: product.productId || product.id,
                quantity,
                unitPrice: product.price
              }]
            });
            orderId = newOrder.orderId || newOrder.id;
          } else if (orderStoreId && orderStoreId !== Number(storeId)) {
            // If order has items and is from different store, show notification
            throw new Error('You have a pending order from another stall. Please complete or cancel that order before adding items from this stall.');
          } else {
            // Add item to existing order
            await addItemToOrder(orderId, {
              productId: product.productId || product.id,
              quantity,
              unitPrice: product.price
            });
          }
        }
      } else {
        // Create new order with the item
        const newOrder = await createOrder({
          userId: currentUser.userId,
          storeId: storeId,
          status: 'Pending',
          items: [{
            productId: product.productId || product.id,
            quantity,
            unitPrice: product.price
          }]
        });
        orderId = newOrder.orderId || newOrder.id;
      }

      // Reload cart to get updated items
      await loadCart();
      return orderId;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [loadCart]);

  return {
    order,
    items,
    loading,
    error,
    loadCart,
    clearCart,
    addItem,
    setError,
    setItems
  };
};
