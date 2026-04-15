import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { useOrders } from "../../hooks/useOrders";

export default function RevenueChart() {
    const { orders } = useOrders();

    const data = orders.map(o => ({
        day: o.date,
        revenue: o.price
    }));

    return (
        <div className="card">
            <h3>Revenue</h3>
            <LineChart width={500} height={250} data={data}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line dataKey="revenue" stroke="#00ffcc" />
            </LineChart>
        </div>
    );
}