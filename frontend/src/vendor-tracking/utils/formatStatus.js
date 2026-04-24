export const formatStatus = (status) => {
    switch (status) {
        case "new": return "🆕 New";
        case "active": return "🔄 Active";
        case "paused": return "⏸ Paused";
        case "done": return "✅ Done";
        default: return status;
    }
};