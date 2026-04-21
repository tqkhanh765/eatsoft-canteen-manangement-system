import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AnnouncementCard from '../components/AnnouncementCard';
import '../styles/Announcement.css';

const mockAnnouncements = {
  vendor: [
    {
      id: 1,
      title: 'Platform Improvements Deployed',
      summary: 'Recent updates have improved system speed and responsiveness. Users should experience smoother navigation and faster data loading.',
      type: 'Update',
      target: 'Vendors',
      createdAt: '2024-01-15',
      sentTo: 'B&B Cafeteria, H&D Food, Coffee Story, Gạo & Nồi, Com Việt, The Zero Coffee, BigU'
    },
    {
      id: 2,
      title: 'Upcoming Maintenance Notice',
      summary: 'The system will undergo scheduled maintenance soon. During this time, some services may be temporarily unavailable.',
      type: 'Update',
      target: 'Vendors',
      createdAt: '2024-01-14',
      sentTo: 'All Vendors'
    },
    {
      id: 3,
      title: 'Maintenance Impact Notice',
      summary: 'Upcoming maintenance may temporarily affect vendor functionalities, including product updates and order processing.',
      type: 'Warning',
      target: 'Vendors',
      createdAt: '2024-01-13',
      sentTo: 'All Vendors'
    },
    {
      id: 4,
      title: 'Vendor Guidelines Updated',
      summary: 'Updated guidelines and best practices are now available to help vendors maintain consistency and improve service quality across the platform.',
      type: 'Update',
      target: 'Vendors',
      createdAt: '2024-01-12',
      sentTo: 'All Vendors'
    }
  ],
  customer: [
    {
      id: 5,
      title: 'Platform Improvements Deployed',
      summary: 'Recent updates have improved system speed and responsiveness. Users should experience smoother navigation and faster data loading.',
      type: 'Update',
      target: 'Customers',
      createdAt: '2024-01-15',
      sentTo: 'All Customers'
    },
    {
      id: 6,
      title: 'Scheduled Maintenance Notice',
      summary: 'The system will undergo maintenance soon, which may temporarily limit access to student services.',
      type: 'Warning',
      target: 'Customers',
      createdAt: '2024-01-14',
      sentTo: 'All Customers'
    },
    {
      id: 7,
      title: 'Student Portal Updated',
      summary: 'The student portal has been improved with a more user-friendly interface, making it easier to access key features and information.',
      type: 'News',
      target: 'Customers',
      createdAt: '2024-01-13',
      sentTo: 'All Customers'
    }
  ]
};

const AnnouncementList = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');

  const handleLoginClick = () => {};

  const getFilteredAnnouncements = () => {
    if (activeTab === 'All') {
      return [...mockAnnouncements.vendor, ...mockAnnouncements.customer];
    }
    if (activeTab === 'Vendors') {
      return mockAnnouncements.vendor;
    }
    return mockAnnouncements.customer;
  };

  const filteredAnnouncements = getFilteredAnnouncements();

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
