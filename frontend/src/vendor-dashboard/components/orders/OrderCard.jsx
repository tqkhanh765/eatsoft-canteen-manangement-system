import { formatVND } from "../../../vendor-menu-management/constants";

const IconShop = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
);

export default function OrderCard({ order }) {
    // Format status label logic to match typical string capitalization
    const statusLabel = order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Unknown';
    const statusColor = order.status === 'completed' ? '#16A34A' : order.status === 'preparing' ? '#0085FF' : '#BCB22A';

    // Format items string
    const itemsString = order.items && order.items.length > 0
        ? order.items.map(item => `${item.name} x${item.qty}`).join(', ')
        : 'No items';

    const itemCount = order.items ? order.items.reduce((sum, item) => sum + (item.qty || 0), 0) : 0;

    return (
        <div className="history-item">
            <div className="item-detail">
                <h4 className="order-id">Order {order.id}</h4>
                <span>{order.date}</span>
            </div>

            <div className="item-dish">
                <p className="item-summary"><IconShop /> {itemsString}</p>
            </div>

            <div className="item-quantity">
                {itemCount}
            </div>

            <div className="item-price">
                {order.price > 1000 ? formatVND(order.price) : `${order.price}.000 VND`}
            </div>

            <div className="item-status">
                Status: <span className="status-tag" style={{ color: statusColor }}>{statusLabel}</span>
            </div>
        </div>
    );
}