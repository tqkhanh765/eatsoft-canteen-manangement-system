import { createContext, useEffect, useState } from "react";
import { getOrders } from "../services/OrderServices";

export const OrderContext = createContext();

export const OrderProvider = ({ children, user }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        loadOrders();
    }, [user]);

    const loadOrders = async () => {
        const storeId = user?.stores?.[0]?.storeId;
        const data = await getOrders(storeId);
        setOrders(data);
    };

    return (
        <OrderContext.Provider value={{ orders }}>
            {children}
        </OrderContext.Provider>
    );
};