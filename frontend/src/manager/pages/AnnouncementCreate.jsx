import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import '../styles/Announcement.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// SVG Icons
const CustomersIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const VendorsIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const AllIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11l18-5v12L3 14v-3z"></path>
    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path>
  </svg>
);

const TARGET_USERS = [
  { id: 'All', label: 'All', Icon: AllIcon },
  { id: 'Vendors', label: 'Vendors', Icon: VendorsIcon },
  { id: 'Customers', label: 'Customers', Icon: CustomersIcon }
];

const ANNOUNCEMENT_TYPES = [
  { id: 'Update', label: 'Update', color: '#22C55E' },
  { id: 'Warning', label: 'Warning', color: '#F97316' },
  { id: 'News', label: 'News', color: '#3B82F6' }
];

const MOCK_VENDORS = [
  'B&B Cafeteria',
  'H&D Food',
  'Coffee Story',
  'Gạo & Nồi',
  'Com Việt',
  'The Zero Coffee',
  'BigU'
];

const WarningIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#EF4444">
    <path d="M12 2L1 21h22L12 2zm0 3.5L19.5 19h-15L12 5.5zM11 10v6h2v-6h-2zm0 8v2h2v-2h-2z"/>
  </svg>
);

const AnnouncementCreate = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [targetUser, setTargetUser] = useState('All');
  const [type, setType] = useState('Update');
  const [selectedVendor, setSelectedVendor] = useState('');
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(true);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoadingVendors(true);
      const response = await fetch(`${API_URL}/announcements/vendors`);
      if (!response.ok) {
        throw new Error('Failed to fetch vendors');
      }
      const data = await response.json();
      setVendors(data);
    } catch (err) {
      console.error('Failed to fetch vendors:', err);
    } finally {
      setLoadingVendors(false);
    }
  };

  const handleLoginClick = () => {};

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    navigate('/manager-announcement');
  };

  const handleCloseModal = () => {
    setShowCancelModal(false);
  };

  const handlePublish = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate user is logged in
      if (!user || !user.userId) {
        throw new Error('User not authenticated. Please log in again.');
      }
      
      // Map targetUser to backend type
      const typeMapping = {
        'All': 'all',
        'Vendors': 'vendors',
        'Customers': 'customers'
      };
      
      const announcementData = {
        title,
        content,
        type: typeMapping[targetUser] || 'all',
        createdBy: user.userId,
        vendorIds: targetUser === 'Vendors' ? selectedVendors : []
      };
      
      const response = await fetch(`${API_URL}/announcements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(announcementData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create announcement');
      }
      
      navigate('/manager-announcement');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleVendorToggle = (vendorId) => {
    setSelectedVendors(prev => {
      if (prev.includes(vendorId)) {
        return prev.filter(id => id !== vendorId);
      } else {
        return [...prev, vendorId];
      }
    });
  };

  const handleSelectAllVendors = () => {
    if (selectedVendors.length === vendors.length) {
      setSelectedVendors([]);
    } else {
      setSelectedVendors(vendors.map(v => v.userId.toString()));
    }
  };

  return (
    <>
      <Navbar onLoginClick={handleLoginClick} user={user} onLogout={onLogout} />
      <main className="manager-announcement-page">
        <div className="announcement-container">
          <h1 className="announcement-title">Announcement</h1>

          <div className="announcement-form">
            <div className="form-row">
              <div className="form-section">
                <label className="form-label">Select target user</label>
                <div className="target-user-options">
                  {TARGET_USERS.map((target) => (
                    <div
                      key={target.id}
                      className={`target-user-card ${targetUser === target.id ? 'selected' : ''}`}
                      onClick={() => setTargetUser(target.id)}
                    >
                      <div className="target-user-icon"><target.Icon /></div>
                      <div className="target-user-label">{target.label}</div>
                      <div className="selection-dot">
                        {targetUser === target.id && <div className="dot-active"></div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <label className="form-label">Announcement Type</label>
                <div className="color-code-options">
                  {ANNOUNCEMENT_TYPES.map((t) => (
                    <div
                      key={t.id}
                      className={`color-code-card ${type === t.id ? 'selected' : ''}`}
                      onClick={() => setType(t.id)}
                    >
                      <div
                        className="color-box"
                        style={{ backgroundColor: t.color }}
                      ></div>
                      <div className="color-label">{t.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {targetUser === 'Vendors' && (
              <div className="form-group">
                <label className="form-label">Select Vendors</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedVendors.length === vendors.length && vendors.length > 0}
                      onChange={handleSelectAllVendors}
                      disabled={loadingVendors}
                    />
                    <span style={{ fontWeight: '600' }}>Select All Vendors ({selectedVendors.length}/{vendors.length} selected)</span>
                  </label>
                  {loadingVendors ? (
                    <div style={{ padding: '20px', textAlign: 'center' }}>Loading vendors...</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}>
                      {vendors.map(vendor => (
                        <label key={vendor.userId} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px', borderRadius: '4px', backgroundColor: selectedVendors.includes(vendor.userId.toString()) ? '#E8F5E9' : 'transparent' }}>
                          <input
                            type="checkbox"
                            checked={selectedVendors.includes(vendor.userId.toString())}
                            onChange={() => handleVendorToggle(vendor.userId.toString())}
                          />
                          <span>{vendor.userName} ({vendor.email})</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="form-group" style={{ color: '#EF4444', padding: '10px', backgroundColor: '#FEF2F2', borderRadius: '6px' }}>
                <p>Error: {error}</p>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter announcement title"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea
                className="form-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter announcement content"
                rows="10"
              />
            </div>

            <div className="form-actions">
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
              <button 
                className="publish-btn" 
                onClick={handlePublish}
                disabled={loading || !title || !content || (targetUser === 'Vendors' && selectedVendors.length === 0)}
              >
                {loading ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {showCancelModal && (
        <div className="modal-overlay">
          <div className="cancel-modal">
            <div className="modal-header">
              <WarningIcon />
              <span className="modal-title">NOTICE</span>
            </div>
            <div className="modal-body">
              <p>Your changes will be lost if you cancel adding item.</p>
            </div>
            <div className="modal-actions">
              <button className="modal-cancel-btn" onClick={handleCloseModal}>
                Cancel
              </button>
              <button className="modal-ok-btn" onClick={handleConfirmCancel}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default AnnouncementCreate;
