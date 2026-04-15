/**
 * API Configuration
 */

export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api',
  
  ENDPOINTS: {
    ORDERS: '/orders',
    ORDER_ITEMS: '/order-items',
    ORDER_STATUS: (orderId) => `/orders/${orderId}/status`
  },
  
  TIMEOUT: 10000, // 10 seconds
  
  HEADERS: {
    'Content-Type': 'application/json'
  }
};
