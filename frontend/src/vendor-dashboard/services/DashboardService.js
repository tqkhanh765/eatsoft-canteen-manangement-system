import API from '../../vendor-tracking/services/API';

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
    const completedOrders = orders.filter(order => order.status === 'Completed');
    
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
    
    orders.forEach(order => {
      if (order.orderItems) {
        order.orderItems.forEach(item => {
          const productName = item.product?.name || 'Unknown';
          const quantity = item.quantity || 0;
          
          if (productQuantities[productName]) {
            productQuantities[productName] += quantity;
          } else {
            productQuantities[productName] = quantity;
          }
        });
      }
    });
    
    // Convert to array and sort by quantity
    const sortedItems = Object.entries(productQuantities)
      .map(([name, quantity]) => ({ name, quantity }))
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
    
    // Count orders by hour (8 AM - 5 PM)
    const hourCounts = {};
    
    orders.forEach(order => {
      const orderDate = new Date(order.orderDate);
      const hour = orderDate.getHours();
      
      // Only count hours between 8 AM and 5 PM
      if (hour >= 8 && hour <= 17) {
        const hourStr = `${hour}:00`;
        if (hourCounts[hourStr]) {
          hourCounts[hourStr]++;
        } else {
          hourCounts[hourStr] = 1;
        }
      }
    });
    
    // Convert to array and sort
    const sortedHours = Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => b.count - a.count);
    
    return sortedHours;
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
    
    // Aggregate metrics by product
    const productMetrics = {};
    
    orders.forEach(order => {
      if (order.orderItems) {
        order.orderItems.forEach(item => {
          const productName = item.product?.name || 'Unknown';
          const quantity = item.quantity || 0;
          const unitPrice = Number(item.unitPrice) || 0;
          const revenue = quantity * unitPrice;
          
          if (!productMetrics[productName]) {
            productMetrics[productName] = {
              name: productName,
              revenue: 0,
              orderCount: 0,
              totalQuantity: 0
            };
          }
          
          productMetrics[productName].revenue += revenue;
          productMetrics[productName].totalQuantity += quantity;
          productMetrics[productName].orderCount += 1;
        });
      }
    });
    
    // Calculate average and convert to array
    const performanceData = Object.values(productMetrics).map(item => ({
      name: item.name,
      revenue: item.revenue,
      orderCount: item.orderCount,
      avgOrders: item.orderCount > 0 ? Math.round(item.totalQuantity / item.orderCount) : 0,
      status: 'Available' // This could be based on product availability
    }));
    
    // Sort by revenue
    performanceData.sort((a, b) => b.revenue - a.revenue);
    
    return performanceData;
  } catch (error) {
    console.error('Failed to fetch menu performance:', error);
    return [];
  }
};
