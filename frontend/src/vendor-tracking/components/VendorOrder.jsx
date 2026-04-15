import React from "react";
import "../styles/global.css";

const formatMoney = (amount, currency) => {
    if (typeof amount !== "number") return "";
    const formatted = amount.toLocaleString("vi-VN");
    return currency ? `${formatted} ${currency}` : formatted;
};

const getStageLabel = (order) => {
    if (order?.status !== "active") return "";
    return order?.stage === "done" ? "Done" : "Cooking";
};

export default function VendorOrder({ order, onAction }) {
    const itemsLine =
        Array.isArray(order?.items) && order.items.length > 0
            ? order.items
                .slice(0, 2)
                .map((i) => `${i.name}${i.qty ? ` (${i.qty})` : ""}`)
                .join(", ")
            : order?.name ?? "Order items";

    const totalLine = formatMoney(order?.total, order?.currency);

    return (
        <div className="order-row">
            <div className="order-left">
                <div className="order-id">
                    <span className="order-dot" aria-hidden="true" />
                    Order #{order?.id ?? "-"}
                </div>
                <div className="order-items">{itemsLine}</div>
            </div>

            <div className="order-mid">
                <div className="order-table">Total:</div>
                <div className="order-table-value">{order?.table ?? "-"}</div>
            </div>

            <div className="order-right">
                <div className="order-total">{totalLine}</div>

                {order?.status === "new" ? (
                    <div className="order-actions">
                        <button
                            type="button"
                            className="icon-btn icon-accept"
                            aria-label="Accept order"
                            onClick={() => onAction?.(order.id, "active")}
                        >
                            ✓
                        </button>
                        <button
                            type="button"
                            className="icon-btn icon-reject"
                            aria-label="Reject order"
                            onClick={() => onAction?.(order.id, "cancelled")}
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <div className={`pill ${order?.stage === "done" ? "pill-done" : "pill-cooking"}`}>
                        {getStageLabel(order)}
                    </div>
                )}
            </div>
        </div>
    );
}