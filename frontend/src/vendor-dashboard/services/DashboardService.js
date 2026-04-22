import API from '../../vendor-tracking/services/API';
import productService from '../../vendor-menu-management/services/productService';

/**
 * Get weekly profit data
 * @param {number} storeId - The store ID
 * @returns {Promise<Array>} Array of daily profits for the past 7 days
 */
export const getWeeklyProfit = async (storeId) => {
  try {
    const response = await API.get('/orders');
    const orders = storeId 
      ? response.data.filter(order => order.storeId === storeId || order.store?.storeId === storeId)
      : response.data;
    
    // Filter completed orders only
    const completedOrders = orders.filter(order => order.status === 'COMPLETED');
    
    // Calculate profit for each of the past 7 days
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayOrders = completedOrders.filter(order => {
        const orderDate = new Date(order.orderDate).toISOString().split('T')[0];
        return orderDate === dateStr;
      });
      
      const totalProfit = dayOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
      
      days.push({
        date: date.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric' }),
        profit: totalProfit
      });
    }
    
    return days;
  } catch (error) {
    console.error('Failed to fetch weekly profit:', error);
    return [];
  }
};

/**
 * Get top menu items by quantity
 * @param {number} storeId - The store ID
 * @param {number} limit - Number of top items to return (default: 7)
 * @returns {Promise<Array>} Array of top menu items with quantity
 */
export const getTopMenuItems = async (storeId, limit = 7) => {
  try {
    const response = await API.get('/orders');
    const orders = storeId 
      ? response.data.filter(order => order.storeId === storeId || order.store?.storeId === storeId)
      : response.data;
    
    // Aggregate quantities by product
    const productQuantities = {};
    const productNames = {};
    
    orders.forEach(order => {
      if (order.orderItems) {
        order.orderItems.forEach(item => {
          const productId = item.productId;
          const productName = item.product?.name || `Product ${productId}`;
          const quantity = item.quantity || 0;
          
          if (productQuantities[productId]) {
            productQuantities[productId] += quantity;
          } else {
            productQuantities[productId] = quantity;
            productNames[productId] = productName;
          }
        });
      }
    });
    
    // Convert to array and sort by quantity
    const sortedItems = Object.entries(productQuantities)
      .map(([id, quantity]) => ({ name: productNames[id], quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, limit);
    
    return sortedItems;
  } catch (error) {
    console.error('Failed to fetch top menu items:', error);
    return [];
  }
};

/**
 * Get peak ordering hours
 * @param {number} storeId - The store ID
 * @returns {Promise<Array>} Array of hourly order counts
 */
export const getPeakOrderingHours = async (storeId) => {
  try {
    const response = await API.get('/orders');
    const orders = storeId 
      ? response.data.filter(order => order.storeId === storeId || order.store?.storeId === storeId)
      : response.data;
    
    // Count orders by time period (8 AM - 2 PM)
    const periodCounts = {};
    
    orders.forEach(order => {
      const orderDate = new Date(order.orderDate);
      const hour = orderDate.getHours();
      
      // Only count hours between 8 AM and 2 PM
      if (hour >= 8 && hour <= 14) {
        // Determine which period this hour belongs to
        const periodStart = hour;
        const periodEnd = hour + 1;
        const periodLabel = `${periodStart}:00-${periodEnd}:00`;
        
        if (periodCounts[periodLabel]) {
          periodCounts[periodLabel]++;
        } else {
          periodCounts[periodLabel] = 1;
        }
      }
    });
    
    // Convert to array in chronological order (8-9, 9-10, ..., 1-2)
    const periods = [];
    for (let h = 8; h <= 13; h++) {
      const periodLabel = `${h}:00-${h + 1}:00`;
      periods.push({
        hour: periodLabel,
        count: periodCounts[periodLabel] || 0
      });
    }
    
    return periods;
  } catch (error) {
    console.error('Failed to fetch peak ordering hours:', error);
    return [];
  }
};

/**
 * Get menu performance summary
 * @param {number} storeId - The store ID
 * @returns {Promise<Array>} Array of menu items with revenue, order count, and average
 */
export const getMenuPerformance = async (storeId) => {
  try {
    const response = await API.get('/orders');
    const orders = storeId 
      ? response.data.filter(order => order.storeId === storeId || order.store?.storeId === storeId)
      : response.data;
    
    // Filter completed orders only
    const completedOrders = orders.filter(order => order.status === 'COMPLETED');
    
    // Fetch products to get availability status
    const products = await productService.getProductsByStore(storeId);
    const productAvailability = {};
    products.forEach(p => {
      productAvailability[p.id] = p.available;
    });
    
    // Aggregate metrics by product
    const productMetrics = {};
    
    completedOrders.forEach(order => {
      if (order.orderItems) {
        order.orderItems.forEach(item => {
          const productId = item.productId;
          const productName = item.product?.name || `Product ${productId}`;
          const quantity = item.quantity || 0;
          const unitPrice = Number(item.unitPrice) || 0;
          const revenue = quantity * unitPrice;
          
          if (!productMetrics[productId]) {
            productMetrics[productId] = {
              id: productId,
              name: productName,
              revenue: 0,
              totalQuantity: 0,
              uniqueOrders: new Set()
            };
          }
          
          productMetrics[productId].revenue += revenue;
          productMetrics[productId].totalQuantity += quantity;
          productMetrics[productId].uniqueOrders.add(order.orderId || order.id);
        });
      }
    });
    
    // Convert to array and calculate average
    const performanceData = Object.values(productMetrics).map(item => ({
      name: item.name,
      revenue: item.revenue,
      orderCount: item.uniqueOrders.size,
      totalQuantity: item.totalQuantity,
      status: productAvailability[item.id] ? 'Available' : 'Sold Out'
    }));
    
    // Sort by revenue
    performanceData.sort((a, b) => b.revenue - a.revenue);
    
    return performanceData;
  } catch (error) {
    console.error('Failed to fetch menu performance:', error);
    return [];
  }
};
