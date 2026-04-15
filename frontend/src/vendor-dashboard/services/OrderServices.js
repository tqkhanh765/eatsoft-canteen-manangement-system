export const getOrders = async () => {
    return [
        { id: "#101", status: "pending", price: 50, date: "Mon", items: [{ name: "Cơm gà xé", qty: 2 }, { name: "Nước suối", qty: 1 }] },
        { id: "#102", status: "preparing", price: 80, date: "Tue", items: [{ name: "Phở bò", qty: 1 }, { name: "Trà sữa", qty: 2 }] },
        { id: "#103", status: "completed", price: 120, date: "Wed", items: [{ name: "Bún chả", qty: 2 }, { name: "Nước ép cam", qty: 1 }] },
        { id: "#104", status: "completed", price: 200, date: "Thu", items: [{ name: "Cơm tấm", qty: 3 }, { name: "Pepsi", qty: 2 }] },
    ];
};