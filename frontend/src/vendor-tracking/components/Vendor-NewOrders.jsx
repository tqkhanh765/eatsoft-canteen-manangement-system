import { useOrder } from "../hooks/useOrder";
import VendorOrder from "./VendorOrder";
import "../styles/global.css";
import { filterOrdersByStatus } from "../utils/filterOrders";

const VendorNewOrders = () => {
    const { orders, handleUpdate, isOpen } = useOrder();

    // ❌ nếu pause thì không nhận đơn mới
    if (!isOpen) {
        return (
            <div className="card">
                <h2 className="section-title">New Orders</h2>
                <p className="muted">Ordering is paused</p>
            </div>
        );
    }

    const newOrders = filterOrdersByStatus(orders || [], "new");

    return (
        <div className="card">
            <h2 className="section-title">New Orders</h2>

            {newOrders.length === 0 ? (
                <p className="muted">No new orders</p>
            ) : (
                newOrders.map(order => (
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

export default VendorNewOrders;