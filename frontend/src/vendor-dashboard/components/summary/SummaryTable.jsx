import React, { useEffect, useState } from "react";
import { formatPrice } from "../../utils/format";
import { getMenuPerformance } from "../../services/DashboardService";

export default function SummaryTable({ storeId }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [storeId]);

    const loadData = async () => {
        setLoading(true);
        try {
            const performanceData = await getMenuPerformance(storeId);
            setData(performanceData);
        } catch (error) {
            console.error("Failed to load menu performance:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="vd-card" style={{ paddingTop: 12 }}>Loading...</div>;
    }

    return (
        <div className="vd-card" style={{ paddingTop: 12 }}>
            <table className="vd-table">
                <thead>
                <tr>
                    <th>Menu</th>
                    <th>Revenue</th>
                    <th>Order</th>
                    <th>Total Quantity</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {data.map((r) => (
                    <tr key={r.name}>
                        <td>{r.name}</td>
                        <td>{formatPrice(r.revenue || 0)}</td>
                        <td>{(r.orderCount || 0).toLocaleString("vi-VN")}</td>
                        <td>{(r.totalQuantity || 0).toLocaleString("vi-VN")}</td>
                        <td className={`vd-status ${(r.status || 'Available').toLowerCase()}`}>{r.status || 'Available'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

