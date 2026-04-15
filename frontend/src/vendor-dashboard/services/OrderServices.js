export const getOrders = async () => {
    return [
        { id: "#101", status: "pending", price: 50, date: "Mon" },
        { id: "#102", status: "preparing", price: 80, date: "Tue" },
        { id: "#103", status: "completed", price: 120, date: "Wed" },
        { id: "#104", status: "completed", price: 200, date: "Thu" },
    ];
};