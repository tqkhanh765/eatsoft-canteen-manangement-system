import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useOrders } from "../../hooks/useOrders";

export default function CustomPieChart() {
    const { orders } = useOrders();

    const statusMap = {};
    orders.forEach(o => {
        statusMap[o.status] = (statusMap[o.status] || 0) + 1;
    });

    const data = Object.keys(statusMap).map(key => ({
        name: key,
        value: statusMap[key]
    }));

    const COLORS = ["#facc15", "#22d3ee", "#4ade80", "#f87171"];

    return (
        <div className="card">
            <h3>Order Distribution</h3>
            <PieChart width={300} height={250}>
                <Pie data={data} dataKey="value" outerRadius={80}>
                    {data.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </div>
    );
}