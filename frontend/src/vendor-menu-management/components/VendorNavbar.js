import React, { useState } from 'react';
import '../../components/Navbar.css';
import '../styles/VendorNavbar.css';

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const UserIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.67 0 4.8-2.13 4.8-4.8S14.67 2.4 12 2.4 7.2 4.53 7.2 7.2 9.33 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
  </svg>
);

const NAV_LINKS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'menu',      label: 'Menu'      },
  { id: 'settings',  label: 'Settings'  },
];

const VendorNavbar = () => {
  const [active, setActive] = useState('menu');

  return (
    <nav className="navbar" id="vendor-navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo" id="vendor-navbar-logo">
          <img src="/eatsoft-logo.png" alt="EatSoft" />
        </Link>

        <ul className="navbar-links" role="navigation" aria-label="Vendor navigation">
          {NAV_LINKS.map(({ id, label }) => (
            <li key={id}>
              <a
                href="#!"
                id={`vendor-nav-${id}`}
                className={`nav-link ${active === id ? 'active' : ''}`}
                onClick={() => setActive(id)}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          <button className="vendor-nav-bell" id="vendor-nav-bell" aria-label="Notifications">
            <BellIcon />
          </button>
          <button className="login-btn" id="vendor-nav-user">
            <span className="login-avatar"><UserIcon /></span>
            Nguyễn Văn A
          </button>
        </div>
      </div>
    </nav>
  );
};

export default VendorNavbar;
