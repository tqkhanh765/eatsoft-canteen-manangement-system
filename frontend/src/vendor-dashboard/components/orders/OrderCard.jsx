import StatusBadge from "./StatusBadge";
import { formatPrice } from "../../utils/format";

export default function OrderCard({ order }) {
    return (
        <div className="order-card">
            <div className="row">
                <strong>{order.id}</strong>
                <StatusBadge status={order.status} />
            </div>

            <div className="row">
                <span>{order.date}</span>
                <span>{formatPrice(order.price)}</span>
            </div>
        </div>
    );
}