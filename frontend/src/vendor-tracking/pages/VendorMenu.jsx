import VendorNewOrders from "../components/Vendor-NewOrders";
import VendorActiveOrders from "../components/Vendor-ActiveOrders";
import "../styles/global.css";

const VendorMenu = () => {
    return (
        <div className="container">
            <h1>🍽️ EatSoft Vendor Dashboard</h1>

            <div className="grid">
                <VendorNewOrders />
                <VendorActiveOrders />
            </div>
        </div>
    );
};

export default VendorMenu;