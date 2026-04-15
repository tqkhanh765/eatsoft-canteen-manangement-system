export const getStatusColor = (status) => {
    switch (status) {
        case "new": return "status-new";
        case "active": return "status-active";
        case "paused": return "status-paused";
        case "done": return "status-done";
        default: return "";
    }
};