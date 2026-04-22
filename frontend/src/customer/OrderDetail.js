import React from 'react';
import './OrderDetail.css';

// Helper to format price
const formatPrice = (price) => {
  return `${Number(price).toLocaleString('vi-VN')}VND`;
};

// Helper to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${hours}:${minutes}, ${day}-${month}-${year}`;
};

// Helper to map status
const mapStatus = (status) => {
  if (status === 'PENDING') return 'In progress';
  if (status === 'ACCEPTED') return 'Accepted';
  if (status === 'COOKING') return 'Cooking';
  if (status === 'COMPLETED') return 'Completed';
  return status;
};

// SVG Icons
const IconChevronLeft = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const IconPlaced = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M9 7h6M9 11h6" />
    <path d="M13 14l2 5 2-1-2-5" />
    <path d="M17 13v-2c0-.5-.5-1-1-1s-1 .5-1 1v2" />
  </svg>
);

const IconAccepted = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    <path d="M9 14l2 2 4-4" />
  </svg>
);

const IconPreparing = () => (
  <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4v3" strokeDasharray="2 2" />
    <path d="M8 5v2" strokeDasharray="2 2" />
    <path d="M16 5v2" strokeDasharray="2 2" />
    <path d="M3 13c0 2.2 1.8 4 4 4h10c2.2 0 4-1.8 4-4v-3H3v3z" />
    <path d="M21 10h2" />
  </svg>
);

const IconCompleted = () => (
  <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4a2 2 0 00-2 2v1" />
    <path d="M4 15a8 8 0 0116 0" />
    <path d="M2 15h20v2H2v-2z" />
  </svg>
);

const IconShop = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
);



const OrderDetail = ({ order, onBack }) => {
  if (!order) return <div className="order-detail"><p>No order data</p></div>;

  const orderItems = order.orderItems || [];
  const orderStoreName = order.store?.storeName || 'Unknown';

  return (
    <div className="order-detail">
      <div className="order-header-title">
        <button className="back-btn" onClick={onBack}>
          <IconChevronLeft />
        </button>
        <h1>Order #{order.orderId || "001"}</h1>
      </div>
      
      <div className="detail-grid">
        <div className="left-column">
          <p className="ready-time">Order status: {mapStatus(order.status)}</p>
          
          <div className="order-stepper">
            <div className="step-item completed">
              <div className="step-icon"><IconPlaced /></div>
              <div className="step-label">Order placed</div>
            </div>
            <div className="step-divider" />
            
            <div className="step-item completed">
              <div className="step-icon"><IconAccepted /></div>
              <div className="step-label">Order accepted</div>
            </div>
            <div className="step-divider" />

            <div className={`step-item ${order.status === 'COMPLETED' ? 'completed' : 'active'}`}>
              <div className="step-icon"><IconPreparing /></div>
              <div className="step-label">Preparing dishes</div>
            </div>
            <div className="step-divider dashed" />

            <div className={`step-item ${order.status === 'COMPLETED' ? 'completed' : 'pending'}`}>
              <div className="step-icon"><IconCompleted /></div>
              <div className="step-label">Order completed</div>
            </div>
          </div>

          <div className="items-section">
            <h3>Items ordered</h3>
            <div className="items-list-container">
              {orderItems.map((item, index) => {
                const itemStoreName = item.product?.store?.storeName || 'Unknown';
                return (
                  <div key={index} className="order-item-card">
                    <div className="item-info">
                      <div className="store-name"><IconShop /> {itemStoreName}</div>
                      <p className="food-name">{item.product?.name || 'Unknown'}</p>
                      <div className="food-options">
                        <span>Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="item-qty">{item.quantity}</div>
                    <div className="item-price">{formatPrice(item.unitPrice)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CHECKOUT INFO - Now moved upwards relative to the left column */}
        <div className="right-column">
          <div className="checkout-section">
            <h3>Checkout Info</h3>
            <div className="checkout-info-container">
              <div className="info-table">
                <div className="info-row-detail">
                  <span className="label">Order Date:</span>
                  <span className="value">{formatDate(order.orderDate)}</span>
                </div>
                <div className="info-row-detail">
                  <span className="label">Store:</span>
                  <span className="value">{orderStoreName}</span>
                </div>
                
                <hr className="detail-divider" />
                
                <div className="info-row-detail">
                  <span className="label">Sub Total:</span>
                  <span className="value">{formatPrice(order.totalAmount)}</span>
                </div>
                <div className="info-row-detail grand-total">
                  <span className="label">Total:</span>
                  <span className="value">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>
            
            <button className="feedback-btn">Give feedback</button>
            <p className="contact-seller-text">
              Meet any problems? <a href="#contact">Contact seller</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
