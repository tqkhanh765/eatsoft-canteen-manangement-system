import { useContext } from "react";
import { OrderContext } from "../context/OrderContext";

export const useOrders = () => {
    return useContext(OrderContext);
};