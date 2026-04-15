import React, { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './homepage/components/AuthModal';
import './App.css';
import Checkout from './customer-checkout-tab/pages/Checkout';  
import OrderCart from './customer-order-tab/pages/OrderCart'; 

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
      <OrderCart />
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
