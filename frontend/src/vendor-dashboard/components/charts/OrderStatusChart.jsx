import { PieChart, Pie, Cell } from "recharts";
import { useOrders } from "../../hooks/useOrders";

export default function OrderStatusChart() {
    const { orders } = useOrders();

    const statusCount = {};

    orders.forEach(o => {
        statusCount[o.status] = (statusCount[o.status] || 0) + 1;
    });

    const data = Object.keys(statusCount).map(key => ({
        name: key,
        value: statusCount[key]
    }));

    return (
        <div className="card">
            <h3>Status</h3>
            <PieChart width={300} height={200}>
                <Pie data={data} dataKey="value">
                    {data.map((_, i) => (
                        <Cell key={i} fill={["yellow", "cyan", "lime"][i % 3]} />
                    ))}
                </Pie>
            </PieChart>
        </div>
    );
}