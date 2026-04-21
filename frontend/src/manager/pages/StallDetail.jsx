import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import StallOverview from '../components/stalls/StallOverview';
import StallFeedback from '../components/stalls/StallFeedback';
import '../styles/StallManagement.css';

const StallDetail = ({ user, onLogout }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Hardcoded for now as per design
  const stall = {
    id: id,
    name: 'BIG U',
    logo: '/stalls/bigu.png',
  };

  const handleLoginClick = () => {};

  return (
    <>
      <Navbar onLoginClick={handleLoginClick} user={user} onLogout={onLogout} />
      <main className="stall-management-page">
        <div className="container">
          <div className="stall-detail-header">
            <button className="back-btn" onClick={() => navigate('/manager-stalls')}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <h1 className="page-title">Stall Management</h1>
            <img src={stall.logo} alt={stall.name} className="stall-detail-logo" />
            
            <div className="stall-detail-tabs">
              <button 
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`tab-btn ${activeTab === 'feedback' ? 'active' : ''}`}
                onClick={() => setActiveTab('feedback')}
              >
                Feedback
              </button>
            </div>
          </div>

          <div className="tab-content">
            {activeTab === 'overview' ? (
              <StallOverview stall={stall} />
            ) : (
              <StallFeedback stall={stall} />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default StallDetail;
