import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import '../styles/Announcement.css';

const mockAnnouncements = {
  1: {
    title: 'Platform Improvements Deployed',
    content: `We are pleased to announce that a new set of platform improvements has been successfully deployed. These updates focus on enhancing overall system performance, stability, and responsiveness to ensure a more seamless user experience. Users may notice faster page loading times, smoother navigation across different modules, and improved reliability when performing daily operations.

In addition to performance enhancements, several background optimizations have been implemented to support better scalability and efficiency as system usage continues to grow. These changes are part of our ongoing commitment to delivering a high-quality, dependable platform for all users.

We encourage you to explore the system and take advantage of these improvements. Should you encounter any issues or have feedback, please do not hesitate to reach out for support.`
  }
};

const AnnouncementDetail = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const announcement = mockAnnouncements[id] || mockAnnouncements[1];

  const handleLoginClick = () => {};

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
