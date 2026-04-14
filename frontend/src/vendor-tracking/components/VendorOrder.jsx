import "../styles/global.css";
import { formatStatus } from "../utils/formatStatus";
import { getStatusColor } from "../utils/getStatusColor";

const VendorOrder = ({ order, onAction }) => {
    return (
        <div className="card">
            <h3>{order.name}</h3>

            <p className={`status ${getStatusColor(order.status)}`}>
                {formatStatus(order.status)}
            </p>

            {order.status === "new" && (
                <button
                    className="btn btn-accept"
                    onClick={() => onAction(order.id, "active")}
                >
                    Accept
                </button>
            )}

            {order.status === "active" && (
                <button
                    className="btn btn-complete"
                    onClick={() => onAction(order.id, "done")}
                >
                    Complete
                </button>
            )}
        </div>
    );
};

export default VendorOrder;