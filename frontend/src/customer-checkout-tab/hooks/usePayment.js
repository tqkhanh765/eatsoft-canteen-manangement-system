import { useState } from 'react';
import { processPayment } from '../services/paymentService';
import { ERROR_MESSAGES } from '../constants/appConstants';
import { updateOrderStatus } from '../../customer-order-tab/services/orderService';

export const usePayment = (checkoutState, formState, navigate) => {
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleConfirmPayment = async () => {
    const { agreedToTerms } = formState;
    const { items, setError, setItems, setOrder, order } = checkoutState;

    if (!agreedToTerms) {
      setError(ERROR_MESSAGES.TERMS_REQUIRED);
      return;
    }
    if (!items.length) return;

    setCheckoutLoading(true);
    setError(null);

    try {
      const result = await processPayment({
        items,
        order,
        ...formState,
      });
      setSuccessMsg('🎉 ' + result.message);

      // Update order status to ACCEPTED (for vendor to see in new orders)
      if (order) {
        const orderId = order.orderId || order.id;
        await updateOrderStatus(orderId, 'ACCEPTED');
      }
      
      // Clear cart and order
      setItems([]);
      setOrder(null);
      
      // Navigate to main page after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setError(`${ERROR_MESSAGES.PAYMENT_FAILED}: ${err.message}`);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return {
    checkoutLoading,
    successMsg,
    setSuccessMsg,
    handleConfirmPayment,
  };
};
