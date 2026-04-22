import API from '../../vendor-tracking/services/API';

// Map backend order to vendor dashboard format
const mapOrderToDashboard = (order) => ({
    id: `#${order.orderId}`,
    status: order.status?.toLowerCase() || 'pending',
    price: Number(order.totalAmount),
    date: new Date(order.orderDate).toLocaleDateString('vi-VN', { weekday: 'short' }),
    items: order.orderItems?.map(item => ({
        name: item.product?.name || 'Unknown',
        qty: item.quantity
    })) || []
});

export const getOrders = async (storeId) => {
    try {
        const response = await API.get('/orders');
        // Filter orders that belong to this store using storeId from order entity
        const storeOrders = storeId 
            ? response.data.filter(order => order.storeId === storeId || order.store?.storeId === storeId)
            : response.data;
        return storeOrders.map(mapOrderToDashboard);
    } catch (error) {
        console.error('Failed to fetch vendor dashboard orders:', error);
        return [];
    }
};