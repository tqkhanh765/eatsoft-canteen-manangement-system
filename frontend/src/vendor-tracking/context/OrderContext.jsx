import { createContext, useEffect, useState } from "react";
import { getOrders, updateOrder } from "../services/orderService";
import { toggleStoreStatus, getStoreById } from "../services/storeService";

export const OrderContext = createContext();

export const OrderProvider = ({ children, user }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // NEW: trạng thái nhận đơn
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        loadOrders();
        loadStoreStatus();
    }, [user]);

    const loadStoreStatus = async () => {
        try {
            const storeId = user?.stores?.[0]?.storeId;
            if (storeId) {
                const store = await getStoreById(storeId);
                setIsOpen(store.isOpen);
            }
        } catch (err) {
            console.error('Failed to load store status:', err);
        }
    };

    const loadOrders = async () => {
        try {
            setLoading(true);
            // Get storeId from user's stores (vendor manages a store)
            const storeId = user?.stores?.[0]?.storeId;
            if (!storeId) {
                console.error('No store found for vendor, fetching all orders');
                // Fallback: fetch all orders (backend will filter by store from token if available)
                const data = await getOrders();
                setOrders(data);
                return;
            }
            const data = await getOrders(storeId);
            setOrders(data);
        } catch (err) {
            setError("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id, action) => {
        try {
            setOrders(prev =>
                prev.map(o =>
                    o.id === id ? {
                        ...o,
                        status: action,
                        stage: action === 'active' ? 'cooking' : action === 'completed' ? 'done' : o.stage
                    } : o
                )
            );

            await updateOrder(id, action);
        } catch (err) {
            setError("Update failed");
            loadOrders();
        }
    };

    // 🔥 toggle pause ordering
    const toggleStore = async () => {
        try {
            const storeId = user?.stores?.[0]?.storeId;
            if (storeId) {
                await toggleStoreStatus(storeId);
                setIsOpen(prev => !prev);
            }
        } catch (err) {
            console.error('Failed to toggle store status:', err);
        }
    };

    return (
        <OrderContext.Provider
            value={{
                orders,
                handleUpdate,
                loading,
                error,
                isOpen,
                toggleStore
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};