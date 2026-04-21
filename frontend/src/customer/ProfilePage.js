import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PersonalInfo from './PersonalInfo';
import OrderHistory from './OrderHistory';
import OrderDetail from './OrderDetail';
import authService from '../services/authService';
import './ProfilePage.css';

// SVGs for Sidebar
const IconUserAvatar = () => (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconUserTab = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '12px'}}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconHistoryTab = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '12px'}}>
    <path d="M12 8v4l3 3" />
    <circle cx="12" cy="12" r="10" />
    <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
  </svg>
);

const ProfilePage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('info'); // 'info' or 'history'
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [user, setUser] = useState(null);

  // Fetch current user data
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  // Handle user data update from PersonalInfo
  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  // Set active tab based on URL path
  useEffect(() => {
    if (location.pathname === '/order-history') {
      setActiveTab('history');
    } else if (location.pathname === '/profile') {
      setActiveTab('info');
    }
  }, [location.pathname]);

  return (
    <div className={`profile-container ${selectedOrder ? 'full-width' : ''}`}>
      {!selectedOrder && (
        <aside className="sidebar">
          <div className="user-avatar-section">
            <div className="avatar-circle">
              <IconUserAvatar />
            </div>
            <h3>{user?.userName || 'Loading...'}</h3>
            <p>ID: {user?.userId || '---'}</p>
          </div>

          <nav className="sidebar-nav">
            <button 
              className={activeTab === 'info' ? 'active tab-btn' : 'tab-btn'} 
              onClick={() => {setActiveTab('info'); setSelectedOrder(null);}}
            >
              <IconUserTab active={activeTab === 'info'} />
              PERSONAL INFORMATION
            </button>

            <button 
              className={activeTab === 'history' ? 'active tab-btn' : 'tab-btn'} 
              onClick={() => setActiveTab('history')}
            >
              <IconHistoryTab active={activeTab === 'history'} />
              ORDER HISTORY
            </button>
          </nav>
        </aside>
      )}

      <main className="profile-content">
        {selectedOrder ? (
          /* ORDER DETAIL */
          <OrderDetail order={selectedOrder} onBack={() => setSelectedOrder(null)} />
        ) : activeTab === 'info' ? (
          /* PERSONAL INFO */
          <PersonalInfo onUserUpdate={handleUserUpdate} />
        ) : (
          /* ORDER HISTORY */
          <OrderHistory onSelectOrder={setSelectedOrder} />
        )}
      </main>
    </div>
  );
};

export default ProfilePage;