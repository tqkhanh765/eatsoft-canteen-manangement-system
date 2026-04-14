// services/orderService.js

let mockOrders = [
    { id: 1, name: "Fried Rice", status: "new" },
    { id: 2, name: "Milk Tea", status: "new" },
    { id: 3, name: "Pho", status: "active" }
];

export const getOrders = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockOrders);
        }, 300); // giả loading
    });
};

export const updateOrder = async (id, action) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            mockOrders = mockOrders.map(o =>
                o.id === id ? { ...o, status: action } : o
            );
            resolve({ success: true });
        }, 200);
    });
};