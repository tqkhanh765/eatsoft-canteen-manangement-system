import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { getWeeklyProfit } from "../../services/DashboardService";

const colors = ["#facc15", "#fbbf24", "#f97316", "#fbbf24", "#ef4444", "#22c55e", "#3b82f6"];

export default function ProfitOfWeekChart({ storeId }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [storeId]);

    const loadData = async () => {
        setLoading(true);
        try {
            const profitData = await getWeeklyProfit(storeId);
            const chartData = profitData.map((item, index) => ({
                day: item.date,
                value: item.profit,
                color: colors[index % colors.length]
            }));
            setData(chartData);
        } catch (error) {
            console.error("Failed to load profit data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={{ height: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
    }

    return (
        <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 8, right: 18, left: 0, bottom: 0 }}>
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} width={30} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {data.map((entry) => (
                            <Cell key={entry.day} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

