import React from 'react';
import Navbar from './homepage/components/Navbar';
import Footer from './homepage/components/Footer';
import HomePage from './homepage/pages/HomePage';
import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <HomePage />
      <Footer />
    </div>
  );
}

export default App;
