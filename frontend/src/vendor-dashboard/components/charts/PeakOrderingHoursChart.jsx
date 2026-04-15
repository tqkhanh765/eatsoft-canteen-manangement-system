import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
    Cell,
} from "recharts";

const data = [
    { time: "8:00 AM", value: 132 },
    { time: "9:00 AM", value: 380 },
    { time: "10:00 AM", value: 612 },
    { time: "11:00 AM", value: 1704 },
    { time: "12:00 PM", value: 984 },
    { time: "1:00 PM", value: 271 },
];

const colors = ["#fde68a", "#fcd34d", "#fbbf24", "#f59e0b", "#fbbf24", "#fde68a"];

export default function PeakOrderingHoursChart() {
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

