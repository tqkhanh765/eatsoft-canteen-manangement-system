export const filterOrdersByStatus = (orders, status) => {
    return orders.filter(order => order.status === status);
};