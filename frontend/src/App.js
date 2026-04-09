import React, { useState, useCallback } from 'react';
import Navbar from './homepage/components/Navbar';
import Footer from './homepage/components/Footer';
import HomePage from './homepage/pages/HomePage';
import AuthModal from './homepage/components/AuthModal';
import './App.css';

function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authView, setAuthView] = useState('login');

  const openAuth = useCallback((view = 'login') => {
    setAuthView(view);
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => setAuthOpen(false), []);

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
