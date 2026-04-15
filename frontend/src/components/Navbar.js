import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const CartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const UserIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.67 0 4.8-2.13 4.8-4.8S14.67 2.4 12 2.4 7.2 4.53 7.2 7.2 9.33 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const CUSTOMER_LINKS = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'stalls', label: 'Food Stalls', path: '/stalls' },
  { id: 'history', label: 'Order History', path: '/order-history' },
];

const VENDOR_LINKS = [
  { id: 'tracking', label: 'Order Tracking', path: '/vendor-tracking' },
  { id: 'menu', label: 'My Menu', path: '/vendor-menu' },
  { id: 'all-orders', label: 'All Orders', path: '/vendor-orders' },
  { id: 'dashboard', label: 'My Dashboard', path: '/dashboard' },
];

const Navbar = ({ onLoginClick, user, onLogout }) => {
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Determine navigation links based on user role
  const isVendor = user?.role?.roleName === 'Vendor';
  const navLinks = isVendor ? VENDOR_LINKS : CUSTOMER_LINKS;

  // Get active link based on current path
  const active = navLinks.find(link => location.pathname === link.path)?.id || '';

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" id="navbar-logo">
          <img src="/eatsoft-logo.png" alt="EatSoft" />
        </Link>

        {/* Nav Links */}
        <ul className="navbar-links" role="navigation" aria-label="Main navigation">
          {navLinks.map(({ id, label, path }) => (
            <li key={id}>
              <Link
                to={path}
                id={`nav-${id}`}
                className={`nav-link ${active === id ? 'active' : ''}`}
                aria-current={active === id ? 'page' : undefined}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="navbar-actions">
          <Link to="/cart" className="cart-btn" id="navbar-cart" aria-label="Shopping cart">
            <CartIcon />
          </Link>
          {user ? (
            <>
              <button className="bell-btn" id="navbar-bell" aria-label="Notifications">
                <BellIcon />
              </button>
              <div className="user-menu-wrapper">
                <button
                  className="login-btn user-menu-btn"
                  id="navbar-user"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <span className="login-avatar"><UserIcon /></span>
                  {user.userName}
                </button>
                {showUserMenu && (
                  <div className="user-dropdown">
                    <Link to="/profile" className="dropdown-item">User Profile</Link>
                    <button className="dropdown-item dropdown-item--danger" onClick={onLogout}>Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              className="login-btn"
              id="navbar-login"
              onClick={() => onLoginClick('login')}
            >
              <span className="login-avatar"><UserIcon /></span>
              Login/Signup
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
