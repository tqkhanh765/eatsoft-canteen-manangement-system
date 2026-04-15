import { createContext, useEffect, useState } from "react";
import { getOrders, updateOrder } from "../services/orderService";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 🔥 NEW: trạng thái nhận đơn
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await getOrders();
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
                    o.id === id ? { ...o, status: action } : o
                )
            );

            await updateOrder(id, action);
        } catch (err) {
            setError("Update failed");
            loadOrders();
        }
    };

    // 🔥 toggle pause ordering
    const toggleStore = () => {
        setIsOpen(prev => !prev);
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