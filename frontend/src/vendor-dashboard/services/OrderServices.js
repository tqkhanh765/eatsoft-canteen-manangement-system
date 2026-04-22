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
        const url = storeId ? `/orders?storeId=${storeId}` : '/orders';
        const response = await API.get(url);
        return response.data.map(mapOrderToDashboard);
    } catch (error) {
        console.error('Failed to fetch vendor dashboard orders:', error);
        return [];
    }
};