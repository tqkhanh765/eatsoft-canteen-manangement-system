export const formatStatus = (status) => {
    switch (status) {
        case "new":
            return "New Order";
        case "active":
            return "In Progress";
        case "done":
            return "Completed";
        default:
            return status;
    }
};