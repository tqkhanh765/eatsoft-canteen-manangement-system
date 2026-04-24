import React from 'react';
import './Footer.css';

/* ===== ICONS ===== */
const Icon = ({ children }) => (
    <span className="social-icon">{children}</span>
);

const FacebookIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

const InstagramIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" />
    </svg>
);

const TiktokIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-2.88-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 1 0 6.33 6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z" />
    </svg>
);

const SnapchatIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2c1 0 4 .3 5.5 3.7.4 1 .3 2.7.2 4 .3.2.9.2 1.4-.3.3-.3.9-.1.9.3 0 .6-1.2 1-1.6 1.1-.1.6-.4 1.2-1.2 1.7-.7.4-1.5.6-2.3.6-.5 0-.9-.1-1-.1-.6.8-1.2 2-1.5 3.1 1.2.2 2.1.6 2.1 1.1 0 .4-.4.7-1 .9-.3.1-.6.2-.9.3-.4.1-.6.3-.7.5-.1.3-.3.4-.5.4-.2 0-.4-.1-.6-.3-.4-.4-1-.6-1.5-.6s-1.1.2-1.5.6c-.2.2-.4.3-.6.3-.2 0-.4-.1-.5-.4-.1-.2-.3-.4-.7-.5-.3-.1-.6-.2-.9-.3-.6-.2-1-.5-1-.9 0-.5.9-.9 2.1-1.1-.3-1.1-.9-2.3-1.5-3.1-.1 0-.5.1-1 .1-.8 0-1.6-.2-2.3-.6-.8-.5-1.1-1.1-1.2-1.7C3.2 10.4 2 10 2 9.4c0-.4.6-.6.9-.3.5.5 1.1.5 1.4.3-.1-1.3-.2-3 .2-4C6 2.3 9 2 10 2h2z" />
    </svg>
);

/* ===== DATA ===== */
const legalLinks = [
    'Terms and conditions',
    'Privacy',
    'Cookies',
    'Modern Slavery Statement'
];

const importantLinks = [
    'Get help',
    'Add your restaurant',
    'Sign up to deliver',
    'Create a business account'
];

/* ===== COMPONENT ===== */
const Footer = () => {
    return (
        <footer className="footer">

            <div className="footer-main container">

                {/* BRAND */}
                <div className="footer-brand">
                    <img src="/eatsoft-logo.png" alt="EatSoft" />
                    <p>SINCE 2026</p>
                </div>

                {/* NEWSLETTER */}
                <div className="footer-newsletter">
                    <h4>Get Exclusive Deals in your Inbox</h4>

                    <div className="newsletter-form">
                        <input type="email" placeholder="youremail@gmail.com" />
                        <button>Subscribe</button>
                    </div>

                    <p className="note">
                        we won't spam, read our <a href="#">email policy</a>
                    </p>

                    <div className="social-icons">
                        <a href="#"><Icon><FacebookIcon /></Icon></a>
                        <a href="#"><Icon><InstagramIcon /></Icon></a>
                        <a href="#"><Icon><TiktokIcon /></Icon></a>
                        <a href="#"><Icon><SnapchatIcon /></Icon></a>
                    </div>
                </div>

                {/* LEGAL */}
                <div className="footer-links">
                    <h4>Legal Pages</h4>
                    {legalLinks.map((item, i) => (
                        <a key={i} href="#">{item}</a>
                    ))}
                </div>

                {/* IMPORTANT */}
                <div className="footer-links">
                    <h4>Important Links</h4>
                    {importantLinks.map((item, i) => (
                        <a key={i} href="#">{item}</a>
                    ))}
                </div>

            </div>

            {/* BOTTOM */}
            <div className="footer-bottom">
                <div className="container footer-bottom-inner">
                    <span>© 2026 EatSoft. All rights reserved.</span>

                    <div className="footer-bottom-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms</a>
                        <a href="#">Pricing</a>
                        <a href="#">Do not sell my data</a>
                    </div>
                </div>
            </div>

        </footer>
    );
};

export default Footer;