// services/orderService.js
// Mock data shaped to match the vendor dashboard UI.

let mockOrders = [
    {
        id: 81,
        status: "new",
        table: 2,
        total: 70000,
        currency: "VND",
        items: [
            { name: "Cơm gà xối mỡ", qty: 1 },
            { name: "Canh bí", qty: 1 }
        ],
        createdAt: Date.now() - 1000 * 60 * 2
    },
    {
        id: 83,
        status: "new",
        table: 2,
        total: 70000,
        currency: "VND",
        items: [{ name: "Cơm gà xối mỡ", qty: 1 }],
        createdAt: Date.now() - 1000 * 60 * 5
    },
    {
        id: 84,
        status: "new",
        table: 2,
        total: 70000,
        currency: "VND",
        items: [{ name: "Cơm gà xối mỡ", qty: 1 }],
        createdAt: Date.now() - 1000 * 60 * 6
    },
    {
        id: 86,
        status: "active",
        stage: "cooking",
        table: 2,
        total: 70000,
        currency: "VND",
        items: [{ name: "Cơm gà xối mỡ", qty: 1 }],
        createdAt: Date.now() - 1000 * 60 * 10
    },
    {
        id: 85,
        status: "active",
        stage: "done",
        table: 2,
        total: 70000,
        currency: "VND",
        items: [{ name: "Cơm gà xối mỡ", qty: 1 }],
        createdAt: Date.now() - 1000 * 60 * 18
    }
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
                o.id === id
                    ? {
                        ...o,
                        status: action,
                        stage:
                            action === "active"
                                ? (o.stage ?? "cooking")
                                : action === "done"
                                    ? "done"
                                    : o.stage
                    }
                    : o
            );
            resolve({ success: true });
        }, 200);
    });
};