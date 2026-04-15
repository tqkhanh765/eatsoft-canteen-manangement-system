import React from 'react';
import './OrderHistory.css';

const IconShop = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
);

const IconEye = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const OrderHistory = ({ onSelectOrder }) => {
  const orders = [
    { id: '#001', items: 'Big U, Com Viet, +1 more', count: 5, time: '12:00, 25-03-2026', total: '350.000VND', status: 'Completed' },
    { id: '#001', items: 'Big U, Com Viet, +1 more', count: 5, time: '12:00, 25-03-2026', total: '350.000VND', status: 'In progress' },
    { id: '#001', items: 'Big U, Com Viet, +1 more', count: 5, time: '12:00, 25-03-2026', total: '350.000VND', status: 'In progress' },
    { id: '#001', items: 'Big U, Com Viet, +1 more', count: 5, time: '12:00, 25-03-2026', total: '350.000VND', status: 'In progress' },
    { id: '#001', items: 'Big U, Com Viet, +1 more', count: 5, time: '12:00, 25-03-2026', total: '350.000VND', status: 'In progress' },
    { id: '#001', items: 'Big U, Com Viet, +1 more', count: 5, time: '12:00, 25-03-2026', total: '350.000VND', status: 'In progress' },
    { id: '#001', items: 'Big U, Com Viet, +1 more', count: 5, time: '12:00, 25-03-2026', total: '350.000VND', status: 'In progress' },
  ];

  return (
    <div className="order-history">
      <h1>Order History</h1>
      <div className="history-list">
        {orders.map((order, index) => (
          <div key={index} className="history-item">
            <div className="item-main">
              <p className="item-summary"><IconShop /> {order.items}</p>
              <h4 className="order-id">Order {order.id}</h4>
              <span>{order.count} items <br/> Created at: {order.time}</span>
            </div>
            <div className="item-price">{order.total}</div>
            <div className="item-status">
              Status: <span className="status-tag">{order.status}</span>
            </div>
            <button className="view-btn" onClick={() => onSelectOrder(order)}>
              <IconEye />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
