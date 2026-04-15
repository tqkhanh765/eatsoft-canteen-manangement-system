import VendorNewOrders from "../components/Vendor-NewOrders";
import VendorActiveOrders from "../components/Vendor-ActiveOrders";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useOrder } from "../hooks/useOrder";
import "../styles/global.css";

const VendorMenu = ({ user, onLogout }) => {
    const { isOpen, toggleStore } = useOrder();

    const handleLoginClick = () => {
        // Vendor pages are protected, so login click shouldn't happen
        // But keeping the function for Navbar compatibility
    };

    return (
        <>
            <Navbar onLoginClick={handleLoginClick} user={user} onLogout={onLogout} />
            <main className="vendor-page">
                <div className="container">
                    <div className="vendor-grid">
                        <div className="vendor-left">
                            <VendorNewOrders />
                            <VendorActiveOrders />
                        </div>

                        <aside className="vendor-right">
                            <div className="card">
                                <h2 className="panel-title">Order Controlling</h2>

                                <div className="control-row">
                                    <div className="control-label">Pause Orders:</div>
                                    <button
                                        type="button"
                                        className={`toggle-btn ${isOpen ? "on" : "off"}`}
                                        aria-pressed={isOpen}
                                        onClick={toggleStore}
                                    >
                                        <span className="toggle-knob" />
                                    </button>
                                </div>

                                <div className="control-note">
                                    <div className="control-note-label">Status:</div>
                                    <div className="control-note-value">
                                        {isOpen ? "Open" : "Close"}
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>

                </div>
            </main>
            <Footer />
        </>
    );
};

export default VendorMenu;