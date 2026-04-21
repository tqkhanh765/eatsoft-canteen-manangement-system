import React, { useState, useEffect } from 'react';
import './OrderHistory.css';
import { fetchOrders } from '../customer-order-tab/services/orderService';
import authService from '../services/authService';

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

// Helper to format price
const formatPrice = (price) => {
  return `${Number(price).toLocaleString('vi-VN')}VND`;
};

// Helper to map status
const mapStatus = (status) => {
  if (status === 'Pending') return 'In progress';
  if (status === 'Completed') return 'Completed';
  return status;
};

// Helper to get store name from order (each order has only one store)
const getStoreName = (order) => {
  return order.store?.storeName || 'Unknown';
};

const OrderHistory = ({ onSelectOrder }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
          setError('Please login to view orders');
          setLoading(false);
          return;
        }

        console.log('Current user ID:', currentUser.userId);
        
        // Fetch orders for current user with Pending or Completed status
        const allOrders = await fetchOrders({ userId: currentUser.userId });
        console.log('Fetched orders:', allOrders);
        
        // Filter only Pending and Completed orders
        const filteredOrders = allOrders.filter(order => 
          order.status === 'Pending' || order.status === 'Completed'
        );
        console.log('Filtered orders:', filteredOrders);

        // Map to display format
        const mappedOrders = filteredOrders.map(order => ({
          id: `#${order.orderId.toString().padStart(3, '0')}`,
          orderId: order.orderId,
          items: getStoreName(order),
          count: order.orderItems?.length || 0,
          time: formatDate(order.orderDate),
          total: formatPrice(order.totalAmount),
          status: mapStatus(order.status),
          rawStatus: order.status,
          orderData: order // Keep full data for detail view
        }));

        setOrders(mappedOrders);
        setLoading(false);
      } catch (err) {
        console.error('Error loading orders:', err);
        setError('Failed to load orders');
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) return <div className="order-history"><h1>Order History</h1><p>Loading...</p></div>;
  if (error) return <div className="order-history"><h1>Order History</h1><p className="error">{error}</p></div>;

  return (
    <div className="order-history">
      <h1>Order History</h1>
      <div className="history-list">
        {orders.length === 0 ? (
          <p className="no-orders">No orders found</p>
        ) : (
          orders.map((order, index) => (
            <div key={index} className="history-item">
              <div className="item-main">
                <p className="item-summary"><IconShop /> {order.items}</p>
                <h4 className="order-id">Order {order.id}</h4>
                <span>{order.count} items <br/> Created at: {order.time}</span>
              </div>
              <div className="item-price">{order.total}</div>
              <div className="item-status">
                Status: <span className={`status-tag ${order.rawStatus.toLowerCase()}`}>{order.status}</span>
              </div>
              <button className="view-btn" onClick={() => onSelectOrder(order.orderData)}>
                <IconEye />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
