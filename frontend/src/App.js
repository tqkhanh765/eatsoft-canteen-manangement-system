import React, { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './homepage/components/AuthModal';
import VendorMenuPage from './vendor-menu-management/pages/VendorMenuPage';
import HomePage from './homepage/pages/HomePage';
import './App.css'; 

// Temporary dev page switcher (replace with React Router later)
const DEV_PAGE = 'home'; // Change to 'vendor' to see the vendor page

function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authView, setAuthView] = useState('login');

  const openAuth = useCallback((view = 'login') => {
    setAuthView(view);
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => setAuthOpen(false), []);

  if (DEV_PAGE === 'vendor') {
    return <VendorMenuPage />;
  }

  return (
    <div className="app">
      <Navbar onLoginClick={() => openAuth('login')} />
      <HomePage />
      <Footer />
      <AuthModal
        isOpen={authOpen}
        defaultView={authView}
        onClose={closeAuth}
      />
    </div>
  );
}

export default App;

