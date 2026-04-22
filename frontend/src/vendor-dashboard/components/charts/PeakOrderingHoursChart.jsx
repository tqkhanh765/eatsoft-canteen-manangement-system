import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
    Cell,
} from "recharts";
import { getPeakOrderingHours } from "../../services/DashboardService";

const colors = ["#fde68a", "#fcd34d", "#fbbf24", "#f59e0b", "#fbbf24", "#fde68a", "#f97316"];

export default function PeakOrderingHoursChart({ storeId }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [storeId]);

    const loadData = async () => {
        setLoading(true);
        try {
            const peakHours = await getPeakOrderingHours(storeId);
            const chartData = peakHours.map((item, index) => ({
                time: item.hour,
                value: item.count
            }));
            setData(chartData);
        } catch (error) {
            console.error("Failed to load peak ordering hours:", error);
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
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 8, right: 10, left: 40, bottom: 0 }}
                >
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="time" tick={{ fontSize: 10 }} width={55} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[6, 6, 6, 6]}>
                        {data.map((d, idx) => (
                            <Cell key={d.time} fill={colors[idx % colors.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

