import ProfitOfWeekChart from "../components/charts/ProfitOfWeekChart";
import TopMenuPieChart from "../components/charts/TopMenuPieChart";
import PeakOrderingHoursChart from "../components/charts/PeakOrderingHoursChart";
import SummaryTable from "../components/summary/SummaryTable";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../styles/global.css";

export default function Dashboard({ user, onLogout }) {
    const handleLoginClick = () => {
        // Vendor pages are protected, so login click shouldn't happen
        // But keeping the function for Navbar compatibility
    };

    return (
        <>
            <Navbar onLoginClick={handleLoginClick} user={user} onLogout={onLogout} />
            <main className="vd-page">
                <div className="vd-container">
                    <h1 className="vd-title">Dashboard</h1>

                    <section className="vd-card vd-card--wide">
                        <h2 className="vd-card-title">Profit of week</h2>
                        <ProfitOfWeekChart />
                    </section>

                    <section className="vd-grid-2">
                        <div className="vd-card">
                            <h2 className="vd-card-title vd-card-title--center">TOP MENU</h2>
                            <TopMenuPieChart />
                        </div>

                        <div className="vd-card">
                            <h2 className="vd-card-title vd-card-title--center">PEAK ORDERING HOURS</h2>
                            <PeakOrderingHoursChart />
                        </div>
                    </section>

                    <section className="vd-summary">
                        <h2 className="vd-card-title vd-card-title--center">SUMMARIZE PERFORMANCE BY MENU</h2>
                        <SummaryTable />
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}