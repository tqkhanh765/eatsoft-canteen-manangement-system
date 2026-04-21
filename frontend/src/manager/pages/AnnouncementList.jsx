import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AnnouncementCard from '../components/AnnouncementCard';
import '../styles/Announcement.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const AnnouncementList = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/announcements`);
      if (!response.ok) {
        throw new Error('Failed to fetch announcements');
      }
      const data = await response.json();
      // Map backend data to frontend format
      const mappedData = data.map(ann => ({
        id: ann.announcementId,
        title: ann.title,
        summary: ann.content.length > 100 ? ann.content.substring(0, 100) + '...' : ann.content,
        content: ann.content,
        type: ann.status === 'published' ? 'Update' : 'Draft',
        target: ann.type === 'all' ? 'All' : ann.type === 'vendors' ? 'Vendors' : 'Customers',
        createdAt: new Date(ann.createdAt).toISOString().split('T')[0],
        sentTo: ann.type === 'all' ? 'All Users' : ann.type === 'vendors' ? 'All Vendors' : 'All Customers'
      }));
      setAnnouncements(mappedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {};

  const getFilteredAnnouncements = () => {
    if (activeTab === 'All') {
      return announcements;
    }
    if (activeTab === 'Vendors') {
      return announcements.filter(ann => ann.target === 'Vendors');
    }
    return announcements.filter(ann => ann.target === 'Customers');
  };

  const filteredAnnouncements = getFilteredAnnouncements();

  if (loading) {
    return (
      <>
        <Navbar onLoginClick={handleLoginClick} user={user} onLogout={onLogout} />
        <main className="manager-announcement-page">
          <div className="announcement-container">
            <h1 className="announcement-title">Announcement</h1>
            <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar onLoginClick={handleLoginClick} user={user} onLogout={onLogout} />
        <main className="manager-announcement-page">
          <div className="announcement-container">
            <h1 className="announcement-title">Announcement</h1>
            <div style={{ padding: '40px', textAlign: 'center', color: '#EF4444' }}>
              Error: {error}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar onLoginClick={handleLoginClick} user={user} onLogout={onLogout} />
      <main className="manager-announcement-page">
        <div className="announcement-container">
          <h1 className="announcement-title">Announcement</h1>

          <div className="announcement-tabs-header">
            <div className="announcement-tabs">
              <button
                className={`tab-btn ${activeTab === 'All' ? 'active' : ''}`}
                onClick={() => setActiveTab('All')}
              >
                All
              </button>
              <button
                className={`tab-btn ${activeTab === 'Vendors' ? 'active' : ''}`}
                onClick={() => setActiveTab('Vendors')}
              >
                Vendors
              </button>
              <button
                className={`tab-btn ${activeTab === 'Customers' ? 'active' : ''}`}
                onClick={() => setActiveTab('Customers')}
              >
                Customers
              </button>
            </div>
            <button
              className="create-announcement-btn"
              onClick={() => navigate('/manager-announcement/create')}
            >
              + Create
            </button>
          </div>

          <div className="announcement-cards">
            {filteredAnnouncements.map(announcement => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AnnouncementList;
