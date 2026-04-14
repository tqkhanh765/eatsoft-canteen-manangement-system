export const getStatusColor = (status) => {
    switch (status) {
        case "new":
            return "status-new";
        case "active":
            return "status-active";
        case "done":
            return "status-done";
        default:
            return "";
    }
};