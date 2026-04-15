import RevenueChart from "../components/charts/RevenueChart";
import OrderStatusChart from "../components/charts/OrderStatusChart";
import CustomPieChart from "../components/charts/PieChart";
import OrderTable from "../components/orders/OrderTable";
import Card from "../components/common/Card";
import { useOrders } from "../hooks/useOrders";

export default function Dashboard() {
    const { orders } = useOrders();

    const totalRevenue = orders.reduce((sum, o) => sum + o.price, 0);

    return (
        <>
            <div className="card-grid">
                <Card title="Revenue" value={totalRevenue + "$"} />
                <Card title="Orders" value={orders.length} />
            </div>

            <div className="grid">
                <RevenueChart />
                <CustomPieChart />
            </div>

            <OrderTable />
        </>
    );
}