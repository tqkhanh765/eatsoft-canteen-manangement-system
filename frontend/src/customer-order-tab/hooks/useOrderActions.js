import { useState, useCallback } from 'react';
import { updateOrderItem, deleteOrderItem, createOrder, updateOrderStatus } from '../services/orderService';
import { APP_CONSTANTS } from '../constants/appConstants';

/**
 * Custom hook for managing order actions (quantity updates, item removal, checkout)
 * @param {Object} cartState - Cart state from useCart hook
 * @returns {Object} Order action functions and loading states
 */
export const useOrderActions = (cartState) => {
  const { items, setItems, setError, clearCart, order } = cartState;
  
  const [actionLoading, setActionLoading] = useState({}); // { [itemId]: true }
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Quantity update with optimistic UI
  const handleQuantityChange = useCallback(async (item, delta) => {
    const newQty = Math.max(1, item.quantity + delta);
    if (newQty === item.quantity) return;

    const itemId = item.orderItemId || item.id;
    const unitPrice = Number(item.unit_price || item.unitPrice || item.product?.price || 0);

    // Optimistic UI update
    setItems((prev) =>
      prev.map((i) => (i.orderItemId === itemId ? { ...i, quantity: newQty } : i))
    );
    setActionLoading((prev) => ({ ...prev, [itemId]: true }));

    try {
      await updateOrderItem(itemId, {
        quantity: newQty,
        unitPrice: unitPrice,
      });
    } catch (err) {
      // Roll back on failure
      setItems((prev) =>
        prev.map((i) => (i.orderItemId === itemId ? { ...i, quantity: item.quantity } : i))
      );
      setError(APP_CONSTANTS.ERROR_MESSAGES.UPDATE_QUANTITY + err.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [itemId]: false }));
    }
  }, [setItems, setError]);

  // Remove item with optimistic UI
  const handleRemoveItem = useCallback(async (itemId) => {
    const snapshot = items;
    setItems((prev) => prev.filter((i) => i.orderItemId !== itemId && i.id !== itemId));
    setActionLoading((prev) => ({ ...prev, [itemId]: true }));

    try {
      await deleteOrderItem(itemId);
    } catch (err) {
      setItems(snapshot); // Roll back
      setError(APP_CONSTANTS.ERROR_MESSAGES.REMOVE_ITEM + err.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [itemId]: false }));
    }
  }, [items, setItems, setError]);

  // Checkout process
  const handleCheckout = useCallback(async (deliveryOption, room, couponCode) => {
    if (!items.length) return;
    if (!room.trim()) {
      setError(APP_CONSTANTS.ERROR_MESSAGES.ROOM_REQUIRED);
      return;
    }

    setCheckoutLoading(true);
    setError(null);

    try {
      if (order) {
        // Order already exists in DB - just update its status to Cooking
        await updateOrderStatus(order.id, APP_CONSTANTS.ORDER_STATUS.COOKING);
      } else {
        // No pending order yet - create one (edge case: cart built client-side)
        await createOrder({
          user_id: APP_CONSTANTS.MOCK_USER_ID,
          store_id: items[0]?.store_id,
          delivery_address: `IU Campus - Room ${room}`,
          note: couponCode ? `Coupon: ${couponCode}` : '',
          items: items.map((i) => ({
            product_id: i.product_id,
            quantity: i.quantity,
            unit_price: i.unit_price,
          })),
        });
      }

      clearCart();
      return APP_CONSTANTS.SUCCESS_MESSAGES.CHECKOUT;
    } catch (err) {
      setError(APP_CONSTANTS.ERROR_MESSAGES.CHECKOUT + err.message);
      return null;
    } finally {
      setCheckoutLoading(false);
    }
  }, [items, order, setError, clearCart]);

  return {
    actionLoading,
    checkoutLoading,
    handleQuantityChange,
    handleRemoveItem,
    handleCheckout
  };
};
