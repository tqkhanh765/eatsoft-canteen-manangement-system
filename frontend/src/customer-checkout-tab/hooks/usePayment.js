import { useState } from 'react';
import { processPayment } from '../services/paymentService';
import { ERROR_MESSAGES } from '../constants/appConstants';

export const usePayment = (checkoutState, formState) => {
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleConfirmPayment = async () => {
    const { agreedToTerms } = formState;
    const { items, setError, setItems, setOrder } = checkoutState;

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
        ...formState,
      });
      setSuccessMsg('🎉 ' + result.message);
      setItems([]);
      setOrder(null);
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
