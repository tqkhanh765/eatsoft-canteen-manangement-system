import React from 'react';
import './Footer.css';

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const TiktokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z" />
  </svg>
);
const SnapchatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.166 2c.93 0 4.04.27 5.53 3.78.41 1 .31 2.68.23 3.99l.02.1c.1.06.28.12.51.12.34 0 .72-.15.99-.4.13-.12.26-.17.39-.17.26 0 .5.19.5.44 0 .6-1.12 1.04-1.47 1.16-.04.26-.13 1.06-1.22 1.72-.66.41-1.44.62-2.32.62-.52 0-.9-.08-1.04-.12-.64.85-1.24 2.04-1.54 3.18 1.18.21 2.08.57 2.08 1.08 0 .37-.4.71-.98.91-.26.09-.57.2-.94.3-.45.14-.62.33-.71.54-.12.27-.29.41-.5.41-.18 0-.39-.09-.61-.31-.42-.42-.96-.65-1.55-.65-.6 0-1.14.23-1.55.65-.22.22-.43.31-.61.31-.22 0-.38-.14-.5-.41-.09-.21-.26-.4-.71-.54-.37-.1-.68-.21-.94-.3-.58-.2-.98-.54-.98-.91 0-.51.9-.87 2.08-1.08-.3-1.14-.9-2.33-1.54-3.18-.14.04-.52.12-1.04.12-.88 0-1.66-.21-2.32-.62-1.09-.66-1.18-1.46-1.22-1.72C3.12 10.44 2 10 2 9.4c0-.25.24-.44.5-.44.13 0 .26.05.39.17.27.25.65.4.99.4.23 0 .41-.06.51-.12l.02-.1c-.08-1.31-.18-2.99.23-3.99C6.13 2.27 9.24 2 10.17 2h1.999z" />
  </svg>
);

const Footer = () => (
  <footer className="footer" id="main-footer">
    <div className="footer-main container">
      {/* Logo column */}
      <div className="footer-brand">
        <img src="/eatsoft-logo.png" alt="EatSoft" className="footer-logo" />
        <p className="footer-since">SINCE 2026</p>
      </div>

      {/* Newsletter */}
      <div className="footer-newsletter">
        <h4>Get Exclusive Deals in your Inbox</h4>
        <div className="newsletter-form">
          <input id="newsletter-email" type="email" placeholder="youremail@gmail.com" />
          <button id="newsletter-subscribe">Subscribe</button>
        </div>
        <p className="newsletter-note">we won't spam, read our <a href="#!">email policy</a></p>
        <div className="social-icons">
          <a href="#!" id="social-facebook" aria-label="Facebook"><FacebookIcon /></a>
          <a href="#!" id="social-instagram" aria-label="Instagram"><InstagramIcon /></a>
          <a href="#!" id="social-tiktok" aria-label="TikTok"><TiktokIcon /></a>
          <a href="#!" id="social-snapchat" aria-label="Snapchat"><SnapchatIcon /></a>
        </div>
      </div>

      {/* Legal Pages */}
      <div className="footer-links-col">
        <h4>Legal Pages</h4>
        <ul>
          <li><a href="#!">Terms and conditions</a></li>
          <li><a href="#!">Privacy</a></li>
          <li><a href="#!">Cookies</a></li>
          <li><a href="#!">Modern Slavery Statement</a></li>
        </ul>
      </div>

      {/* Important Links */}
      <div className="footer-links-col">
        <h4>Important Links</h4>
        <ul>
          <li><a href="#!">Get help</a></li>
          <li><a href="#!">Add your restaurant</a></li>
          <li><a href="#!">Sign up to deliver</a></li>
          <li><a href="#!">Create a business account</a></li>
        </ul>
      </div>
    </div>

    {/* Bottom bar */}
    <div className="footer-bottom">
      <div className="footer-bottom-inner container">
        <span>EatSoft Copyright 2026, All Rights Reserved.</span>
        <div className="footer-bottom-links">
          <a href="#!">Privacy Policy</a>
          <a href="#!">Terms</a>
          <a href="#!">Pricing</a>
          <a href="#!">Do not sell or share my personal information</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
