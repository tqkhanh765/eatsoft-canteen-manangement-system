import { useOrder } from "../hooks/useOrder";
import VendorOrder from "./VendorOrder";
import "../styles/global.css";
import { filterOrdersByStatus } from "../utils/filterOrders";

const VendorNewOrders = () => {
    const { orders, handleUpdate } = useOrder();

    const newOrders = filterOrdersByStatus(orders, "new");

    return (
        <div className="section">
            <h2 className="section-title">
                🆕 New Orders ({newOrders.length})
            </h2>

            {newOrders.length === 0 ? (
                <p className="empty">No new orders</p>
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