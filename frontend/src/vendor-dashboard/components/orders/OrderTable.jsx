import { useOrders } from "../../hooks/useOrders";
import StatusBadge from "./StatusBadge";

export default function OrderTable() {
    const { orders } = useOrders();

    return (
        <div className="card">
            <h3>Orders</h3>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Status</th>
                    <th>Price</th>
                </tr>
                </thead>
                <tbody>
                {orders.map(o => (
                    <tr key={o.id}>
                        <td>{o.id}</td>
                        <td><StatusBadge status={o.status} /></td>
                        <td>{o.price}$</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}