export const filterOrdersByStatus = (orders, status) => {
    return orders.filter(o => o.status === status);
};