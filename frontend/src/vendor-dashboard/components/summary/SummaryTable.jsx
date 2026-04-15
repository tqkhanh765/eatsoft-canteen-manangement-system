import React from "react";
import { formatPrice } from "../../utils/format";

const rows = [
    { menu: "Cơm gà xối mỡ", revenue: 120000, order: 30000, avg: 22000, status: "Open" },
    { menu: "Phở bò", revenue: 110000, order: 28000, avg: 22000, status: "Open" },
    { menu: "Bún chả", revenue: 90000, order: 20000, avg: 22000, status: "Close" },
    { menu: "Trà sữa", revenue: 80000, order: 20000, avg: 22000, status: "Open" },
    { menu: "Cà phê sữa", revenue: 100000, order: 16000, avg: 22000, status: "Close" },
    { menu: "Bánh mì", revenue: 85000, order: 18000, avg: 22000, status: "Close" },
    { menu: "Nước suối", revenue: 70000, order: 15000, avg: 22000, status: "Open" },
];

export default function SummaryTable() {
    return (
        <div className="vd-card" style={{ paddingTop: 12 }}>
            <table className="vd-table">
                <thead>
                <tr>
                    <th>Menu</th>
                    <th>Revenue</th>
                    <th>Order</th>
                    <th>Avg Orders</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {rows.map((r) => (
                    <tr key={r.menu}>
                        <td>{r.menu}</td>
                        <td>{formatPrice(r.revenue)}</td>
                        <td>{r.order.toLocaleString("vi-VN")}</td>
                        <td>{r.avg.toLocaleString("vi-VN")}</td>
                        <td className={`vd-status ${r.status.toLowerCase()}`}>{r.status}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

