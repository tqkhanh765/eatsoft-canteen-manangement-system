import React, { useState } from 'react';
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

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'stalls', label: 'Food Stalls' },
  { id: 'history', label: 'Order History' },
];

const Navbar = () => {
  const [active, setActive] = useState('home');

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-container">
        {/* Logo */}
        <a href="/" className="navbar-logo" id="navbar-logo">
          <img src="/eatsoft-logo.png" alt="EatSoft" />
        </a>

        {/* Nav Links */}
        <ul className="navbar-links" role="navigation" aria-label="Main navigation">
          {NAV_LINKS.map(({ id, label }) => (
            <li key={id}>
              <a
                href="#"
                id={`nav-${id}`}
                className={`nav-link ${active === id ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); setActive(id); }}
                aria-current={active === id ? 'page' : undefined}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="navbar-actions">
          <button className="cart-btn" id="navbar-cart" aria-label="Shopping cart">
            <CartIcon />
          </button>
          <button className="login-btn" id="navbar-login">
            <span className="login-avatar"><UserIcon /></span>
            Login/Signup
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
