import { useState, useEffect } from 'react';
import { getOrders } from '../services/OrderServices';

export const useOrders = (storeId) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const data = await getOrders(storeId);
                setOrders(data);
            } catch (err) {
                setError(err);
                console.error('useOrders: failed to fetch orders', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [storeId]);

    return { orders, loading, error };
};
