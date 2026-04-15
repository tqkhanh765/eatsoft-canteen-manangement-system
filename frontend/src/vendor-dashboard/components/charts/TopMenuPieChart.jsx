import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const data = [
    { name: "Food 1", value: 12, color: "#2563eb" },
    { name: "Food 2", value: 10, color: "#ef4444" },
    { name: "Food 3", value: 8, color: "#f59e0b" },
    { name: "Food 4", value: 7, color: "#9ca3af" },
    { name: "Food 5", value: 9, color: "#fca5a5" },
    { name: "Food 6", value: 6, color: "#22c55e" },
    { name: "Food 7", value: 11, color: "#a855f7" },
];

export default function TopMenuPieChart() {
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

