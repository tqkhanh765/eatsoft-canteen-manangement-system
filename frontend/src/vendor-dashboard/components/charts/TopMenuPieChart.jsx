import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { getTopMenuItems } from "../../services/DashboardService";

const colors = ["#2563eb", "#ef4444", "#f59e0b", "#9ca3af", "#fca5a5", "#22c55e", "#a855f7"];

export default function TopMenuPieChart({ storeId }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [storeId]);

    const loadData = async () => {
        setLoading(true);
        try {
            const topItems = await getTopMenuItems(storeId, 7);
            const chartData = topItems.map((item, index) => ({
                name: item.name,
                value: item.quantity,
                color: colors[index % colors.length]
            }));
            setData(chartData);
        } catch (error) {
            console.error("Failed to load top menu data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={{ height: 240, display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
    }

    return (
        <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="45%"
                        outerRadius={78}
                        innerRadius={0}
                    >
                        {data.map((d) => (
                            <Cell key={d.name} fill={d.color} />
                        ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={60} wrapperStyle={{ fontSize: 10 }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

