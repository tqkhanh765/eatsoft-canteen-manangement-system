import { useOrder } from "../hooks/useOrder";
import VendorOrder from "./VendorOrder";
import "../styles/global.css";
import { filterOrdersByStatus } from "../utils/filterOrders";

const VendorActiveOrders = () => {
    const { orders, handleUpdate } = useOrder();

    const activeOrders = filterOrdersByStatus(orders || [], "active");

    return (
        <div className="card">
            <h2 className="section-title">Active Orders</h2>

            {activeOrders.length === 0 ? (
                <p className="muted">No active orders</p>
            ) : (
                activeOrders.map(order => (
                    <VendorOrder
                        key={order.id}
                        order={order}
                        onAction={handleUpdate}
                    />
                ))
            )}
        </div>
    );
};

export default VendorActiveOrders;