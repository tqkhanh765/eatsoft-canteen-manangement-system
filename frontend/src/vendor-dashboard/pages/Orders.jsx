import { useOrders } from "../hooks/useOrders";
import OrderCard from "../components/orders/OrderCard";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../customer/OrderHistory.css";

export default function Orders({ user, onLogout }) {
    const { orders } = useOrders();

    const handleLoginClick = () => {
        // Vendor pages are protected, so login click shouldn't happen
        // But keeping the function for Navbar compatibility
    };

    return (
        <>
            <Navbar onLoginClick={handleLoginClick} user={user} onLogout={onLogout} />
            <main className="order-history" style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
                <h1 style={{ marginBottom: '30px' }}>All Orders</h1>

                <div className="history-list" style={{ maxHeight: 'none', overflowY: 'visible' }}>
                    {orders.map(o => (
                        <OrderCard key={o.id} order={o} />
                    ))}
                </div>
            </main>
            <Footer />
        </>
    );
}