import { useState, useEffect } from 'react';
import { fetchCheckoutData } from '../services/paymentService';
import { DEFAULT_ROOM, DEFAULT_PAYMENT_METHOD, DEFAULT_DELIVERY_OPTION } from '../constants/appConstants';

export const useCheckout = () => {
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        const data = await fetchCheckoutData();
        setOrder(data.order);
        setItems(data.items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, []);

  return {
    order,
    items,
    loading,
    error,
    setError,
    setOrder,
    setItems,
  };
};

export const useCheckoutForm = () => {
  const [deliveryOption, setDeliveryOption] = useState(DEFAULT_DELIVERY_OPTION);
  const [room, setRoom] = useState(DEFAULT_ROOM);
  const [selectedPayment, setSelectedPayment] = useState(DEFAULT_PAYMENT_METHOD);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  return {
    deliveryOption,
    setDeliveryOption,
    room,
    setRoom,
    selectedPayment,
    setSelectedPayment,
    agreedToTerms,
    setAgreedToTerms,
  };
};
