import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './homepage/components/Navbar';
import Footer from './homepage/components/Footer';
import HomePage from './homepage/pages/HomePage';
import ProfilePage from './customer/ProfilePage'; // <--- Import file bạn vừa tạo
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} /> {/* <--- Thêm dòng này */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;