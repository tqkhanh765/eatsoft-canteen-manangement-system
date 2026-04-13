import React, { useEffect, useState } from 'react';
import Navbar from './homepage/components/Navbar';
import Footer from './homepage/components/Footer';
import HomePage from './homepage/pages/HomePage';
import StallMenuPage from './stall-menu/pages/StallMenuPage';
import './App.css';

function App() {
  const [selectedStall, setSelectedStall] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedStall]);

  return (
    <div className="app">
      <Navbar />
      {selectedStall ? (
        <StallMenuPage stall={selectedStall} onBack={() => setSelectedStall(null)} />
      ) : (
        <HomePage onVisitStall={setSelectedStall} />
      )}
      <Footer />
    </div>
  );
}

export default App;
