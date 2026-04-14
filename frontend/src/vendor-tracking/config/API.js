import { OrderProvider } from "./context/OrderContext";
import VendorMenu from "./pages/VendorMenu";

function App() {
    return (
        <OrderProvider>
            <VendorMenu />
        </OrderProvider>
    );
}

export default App;