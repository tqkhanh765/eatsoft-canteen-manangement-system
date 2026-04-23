import { formatVND } from "../../../vendor-menu-management/constants";
import { useState } from "react";

const IconShop = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
);

export default function OrderCard({ order }) {
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    // Format status label logic to match typical string capitalization
    const statusLabel = order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Unknown';
    const statusColor = order.status === 'completed' ? '#16A34A' : order.status === 'preparing' ? '#0085FF' : '#BCB22A';

    // Format items string
    const itemsString = order.items && order.items.length > 0
        ? order.items.map(item => `${item.name} x${item.qty}`).join(', ')
        : 'No items';

    // Check if order has any feedback
    const hasFeedback = order.items && order.items.some(item => item.feedback);

    return (
        <div className="history-item">
            <div className="item-detail">
                <h4 className="order-id">Order {order.id}</h4>
                <span>{order.date}</span>
            </div>

            <div className="item-dish">
                <p className="item-summary"><IconShop /> {itemsString}</p>
            </div>

            <div className="item-price">
                {order.price > 1000 ? formatVND(order.price) : `${order.price}.000 VND`}
            </div>

            <div className="item-status">
                Status: <span className="status-tag" style={{ color: statusColor }}>{statusLabel}</span>
            </div>

            <button 
                className="view-feedback-btn"
                onClick={() => setShowFeedbackModal(true)}
            >
                View Feedback
            </button>

            {showFeedbackModal && (
                <div className="feedback-modal-overlay" onClick={() => setShowFeedbackModal(false)}>
                    <div className="feedback-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="feedback-modal-header">
                            <h3>Order {order.id} Feedback</h3>
                            <button className="close-btn" onClick={() => setShowFeedbackModal(false)}>×</button>
                        </div>
                        <div className="feedback-items-list">
                            {order.items.map((item, index) => (
                                <div key={index} className="feedback-item">
                                    <div className="feedback-item-name">{item.name} x{item.qty}</div>
                                    {item.feedback ? (
                                        <>
                                            <div className="feedback-item-rating">
                                                <span className="stars">{'★'.repeat(item.feedback.rating)}{'☆'.repeat(5 - item.feedback.rating)}</span>
                                                <span className="rating-number">{item.feedback.rating}/5</span>
                                            </div>
                                            {item.feedback.comment && (
                                                <div className="feedback-item-comment">"{item.feedback.comment}"</div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="no-item-feedback">No feedback submitted yet</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}