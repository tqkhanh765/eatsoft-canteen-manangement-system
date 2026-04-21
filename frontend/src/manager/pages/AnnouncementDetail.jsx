import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import '../styles/Announcement.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const AnnouncementDetail = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLoginClick = () => {};

  useEffect(() => {
    fetchAnnouncement();
  }, [id]);

  const fetchAnnouncement = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/announcements/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch announcement');
      }
      const data = await response.json();
      // Map backend data to frontend format
      setAnnouncement({
        id: data.announcementId,
        title: data.title,
        content: data.content,
        type: data.type,
        status: data.status,
        createdAt: new Date(data.createdAt).toISOString().split('T')[0],
        creator: data.creator
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar onLoginClick={handleLoginClick} user={user} onLogout={onLogout} />
        <main className="manager-announcement-page">
          <div className="announcement-container">
            <h1 className="announcement-title">Announcement</h1>
            <button className="back-btn" onClick={() => navigate('/manager-announcement')}>
              ←
            </button>
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
            <button className="back-btn" onClick={() => navigate('/manager-announcement')}>
              ←
            </button>
            <div style={{ padding: '40px', textAlign: 'center', color: '#EF4444' }}>
              Error: {error}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!announcement) {
    return (
      <>
        <Navbar onLoginClick={handleLoginClick} user={user} onLogout={onLogout} />
        <main className="manager-announcement-page">
          <div className="announcement-container">
            <h1 className="announcement-title">Announcement</h1>
            <button className="back-btn" onClick={() => navigate('/manager-announcement')}>
              ←
            </button>
            <div style={{ padding: '40px', textAlign: 'center', color: '#EF4444' }}>
              Announcement not found
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

          <button className="back-btn" onClick={() => navigate('/manager-announcement')}>
            ←
          </button>

          <div className="announcement-detail">
            <div className="detail-section">
              <span className="detail-label">Title:</span>
              <span className="detail-value">{announcement.title}</span>
            </div>

            <div className="detail-section">
              <span className="detail-label">Type:</span>
              <span className="detail-value">{announcement.type === 'all' ? 'All' : announcement.type === 'vendors' ? 'Vendors' : 'Customers'}</span>
            </div>

            <div className="detail-section">
              <span className="detail-label">Status:</span>
              <span className="detail-value" style={{ textTransform: 'capitalize' }}>{announcement.status}</span>
            </div>

            <div className="detail-section">
              <span className="detail-label">Created At:</span>
              <span className="detail-value">{announcement.createdAt}</span>
            </div>

            {announcement.creator && (
              <div className="detail-section">
                <span className="detail-label">Created By:</span>
                <span className="detail-value">{announcement.creator.userName}</span>
              </div>
            )}

            <div className="detail-section">
              <span className="detail-label">Content:</span>
              <div className="detail-content">
                {announcement.content.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AnnouncementDetail;
