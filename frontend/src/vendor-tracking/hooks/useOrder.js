import { useContext } from "react";
import { OrderContext } from "../context/OrderContext";

export const useOrder = () => {
    const context = useContext(OrderContext);

    if (!context) {
        console.error("useOrder must be used inside OrderProvider");
        return {
            orders: [],
            handleUpdate: () => {},
            isOpen: true,
            toggleStore: () => {}
        };
    }

    return context;
};