import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

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

const MANAGER_LINKS = [
  { id: 'sales', label: 'Sales analytics', path: '/manager-dashboard' },
  { id: 'announcement', label: 'Announcement', path: '/manager-announcement' },
  { id: 'stalls', label: 'Stall management', path: '/manager-stalls' },
];

const Navbar = ({ onLoginClick, user, onLogout }) => {
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const notifRef = useRef(null);

  const isVendor = user?.role?.roleName === 'Vendor';
  const isManager = user?.role?.roleName === 'Manager';
  const navLinks = isManager ? MANAGER_LINKS : isVendor ? VENDOR_LINKS : CUSTOMER_LINKS;
  const active = navLinks.find(link => location.pathname === link.path)?.id || '';

  // Fetch pending registrations for manager
  useEffect(() => {
    if (!isManager) return;
    const fetchPending = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/stall-registrations?status=MANAGER_PENDING`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setPendingRegistrations(data.registrations || []);
      } catch {
        // silent
      }
    };
    fetchPending();
    // Poll every 30 seconds
    const interval = setInterval(fetchPending, 30000);
    return () => clearInterval(interval);
  }, [isManager]);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const pendingCount = pendingRegistrations.length;

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
          {!isManager && (
            <Link to="/cart" className="cart-btn" id="navbar-cart" aria-label="Shopping cart">
              <CartIcon />
            </Link>
          )}
          {user ? (
            <>
              {/* Bell with notification dropdown */}
              <div className="bell-wrapper" ref={notifRef}>
                <button
                  className="bell-btn"
                  id="navbar-bell"
                  aria-label="Notifications"
                  onClick={() => setShowNotifications(prev => !prev)}
                >
                  <BellIcon />
                  {isManager && pendingCount > 0 && (
                    <span className="bell-badge">{pendingCount}</span>
                  )}
                </button>

                {showNotifications && isManager && (
                  <div className="notif-dropdown">
                    <div className="notif-header">Notifications</div>
                    <div className="notif-list">
                      {pendingCount === 0 ? (
                        <div className="notif-empty">No new notifications</div>
                      ) : (
                        pendingRegistrations.map(reg => (
                          <Link
                            key={reg.id}
                            to="/manager-stalls/requests"
                            className="notif-item"
                            onClick={() => setShowNotifications(false)}
                          >
                            <span className="notif-dot" />
                            <span className="notif-text">
                              New stall registration by <strong>{reg.email}</strong> is waiting for approval
                            </span>
                          </Link>
                        ))
                      )}
                    </div>
                    <Link
                      to="/manager-stalls/requests"
                      className="notif-footer"
                      onClick={() => setShowNotifications(false)}
                    >
                      View all requests
                    </Link>
                  </div>
                )}
              </div>

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
                    {!isManager && <Link to="/profile" className="dropdown-item">User Profile</Link>}
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
