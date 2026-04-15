import React from "react";
import { NavLink } from "react-router-dom";
import './Navbar.css';

const Navbar = () => {
    return (
        <header className="navbar">
            <div className="navbar-inner container">

                {/* LEFT - LOGO */}
                <div className="nav-left">
                    <img src="/eatsoft-logo.png" alt="EatSoft" className="nav-logo" />
                </div>

                {/* CENTER - MENU */}
                <nav className="nav-center">
                    <NavLink
                        to="/vendor-dashboard"
                        className={({ isActive }) => (isActive ? "active" : "")}
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/vendor-tracking"
                        className={({ isActive }) => (isActive ? "active" : "")}
                    >
                        Menu
                    </NavLink>
                    <button type="button" className="nav-center-btn">
                        Settings
                    </button>
                </nav>

                {/* RIGHT */}
                <div className="nav-right">
                    <button type="button" className="nav-user-pill" aria-label="Current user">
                        <span className="nav-user-icon" aria-hidden="true">!</span>
                        <span className="nav-user-name">Nguyen Van A</span>
                    </button>

                    <button type="button" className="nav-bell" aria-label="Notifications">
                        <span className="nav-bell-icon" aria-hidden="true">🔔</span>
                        <span className="nav-bell-dot" aria-hidden="true" />
                    </button>
                </div>

            </div>
        </header>
    );
};

export default Navbar;