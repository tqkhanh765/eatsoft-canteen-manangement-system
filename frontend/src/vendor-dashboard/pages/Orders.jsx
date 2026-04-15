import { useOrders } from "../hooks/useOrders";
import OrderCard from "../components/orders/OrderCard";

export default function Orders() {
    const { orders } = useOrders();

    return (
        <div>
            <h2>All Orders</h2>

            <div className="order-list">
                {orders.map(o => (
                    <OrderCard key={o.id} order={o} />
                ))}
            </div>
        </div>
    );
}