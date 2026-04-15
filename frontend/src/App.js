import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './homepage/components/Navbar';
import Footer from './homepage/components/Footer';
import HomePage from './homepage/pages/HomePage';
import ProfilePage from './customer/ProfilePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        
        {/* Phần nội dung chính sẽ co giãn để chiếm không gian còn trống */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;