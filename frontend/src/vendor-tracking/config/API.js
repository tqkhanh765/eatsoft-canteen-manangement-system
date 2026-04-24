import { OrderProvider } from "../context/OrderContext";
import VendorMenu from "../pages/VendorMenu";

function App({ user }) {
    return (
        <OrderProvider user={user}>
            <VendorMenu user={user} />
        </OrderProvider>
    );
}

export default App;