import SideBar from "./SideBar";
import Header from "./Header";

export default function DashboardLayout({ children }) {
    return (
        <div className="app">
            <SideBar />
            <div className="main">
                <Header />
                <div className="content">{children}</div>
            </div>
        </div>
    );
}