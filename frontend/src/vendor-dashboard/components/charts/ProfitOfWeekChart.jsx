import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

const data = [
    { day: "Monday", value: 3348, color: "#facc15" },
    { day: "Tuesday", value: 3860, color: "#fbbf24" },
    { day: "Wednesday", value: 5437, color: "#f97316" },
    { day: "Thursday", value: 4160, color: "#fbbf24" },
    { day: "Friday", value: 6254, color: "#ef4444" },
    { day: "Saturday", value: 1264, color: "#22c55e" },
];

export default function ProfitOfWeekChart() {
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

