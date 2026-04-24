import React, { useState, useEffect } from 'react';
import './StallRegistrationReview.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const StallRegistrationReview = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [reviewNote, setReviewNote] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [filter, setFilter] = useState('MANAGER_PENDING');

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/stall-registrations?status=${filter}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Failed to fetch registrations');
        return;
      }
      
      setRegistrations(data.registrations);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [filter]);

  const handleReview = async (action) => {
    if (!selectedRegistration) return;
    
    setReviewLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_URL}/stall-registrations/${selectedRegistration.id}/manager-review`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            action,
            note: reviewNote,
          }),
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        alert(data.error || 'Failed to submit review');
        setReviewLoading(false);
        return;
      }
      
      // Close modal and refresh list
      setSelectedRegistration(null);
      setReviewNote('');
      fetchRegistrations();
      alert(`Application ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
    } catch (err) {
      alert('Network error. Please try again.');
      setReviewLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'MANAGER_PENDING': { label: 'Pending Review', class: 'status-pending' },
      'MANAGER_APPROVED': { label: 'Manager Approved', class: 'status-approved' },
      'MANAGER_REJECTED': { label: 'Manager Rejected', class: 'status-rejected' },
      'ADMIN_PENDING': { label: 'Admin Pending', class: 'status-pending' },
      'ADMIN_COMPLETED': { label: 'Completed', class: 'status-approved' },
      'ADMIN_REJECTED': { label: 'Admin Rejected', class: 'status-rejected' },
    };
    
    const config = statusConfig[status] || { label: status, class: 'status-default' };
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="registrations-loading">Loading...</div>;
  }

  return (
    <div className="stall-registration-review">
      <div className="review-header">
        <h2>Stall Registration Applications</h2>
        
        <div className="filter-tabs">
          <button 
            className={filter === 'MANAGER_PENDING' ? 'active' : ''}
            onClick={() => setFilter('MANAGER_PENDING')}
          >
            Pending Review
          </button>
          <button 
            className={filter === 'MANAGER_APPROVED' ? 'active' : ''}
            onClick={() => setFilter('MANAGER_APPROVED')}
          >
            Approved
          </button>
          <button 
            className={filter === 'MANAGER_REJECTED' ? 'active' : ''}
            onClick={() => setFilter('MANAGER_REJECTED')}
          >
            Rejected
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {registrations.length === 0 ? (
        <div className="no-registrations">
          <p>No {filter === 'MANAGER_PENDING' ? 'pending' : ''} applications found.</p>
        </div>
      ) : (
        <div className="registrations-list">
          {registrations.map((reg) => (
            <div 
              key={reg.id} 
              className="registration-card"
              onClick={() => filter === 'MANAGER_PENDING' && setSelectedRegistration(reg)}
            >
              <div className="registration-header">
                <div className="stall-info">
                  <h3>{reg.stallName}</h3>
                  <p className="applicant-name">by {reg.fullName}</p>
                </div>
                {getStatusBadge(reg.status)}
              </div>
              
              <div className="registration-details">
                <div className="detail-row">
                  <span className="label">Email:</span>
                  <span className="value">{reg.email}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Phone:</span>
                  <span className="value">{reg.phoneNumber}</span>
                </div>
                {reg.description && (
                  <div className="detail-row description">
                    <span className="label">Description:</span>
                    <span className="value">{reg.description}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="label">Submitted:</span>
                  <span className="value">{formatDate(reg.createdAt)}</span>
                </div>
              </div>
              
              {reg.documents && reg.documents.length > 0 && (
                <div className="documents-section">
                  <span className="label">Documents:</span>
                  <div className="document-tags">
                    {reg.documents.map((doc, i) => (
                      <span key={i} className="document-tag">{doc}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {filter === 'MANAGER_PENDING' && (
                <div className="review-prompt">
                  Click to review this application
                </div>
              )}
              
              {reg.managerNote && (
                <div className="review-note">
                  <span className="label">Note:</span>
                  <p>{reg.managerNote}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedRegistration && (
        <div className="review-modal">
          <div className="review-modal-content">
            <button 
              className="close-btn"
              onClick={() => {
                setSelectedRegistration(null);
                setReviewNote('');
              }}
            >
              ×
            </button>
            
            <h3>Review Application</h3>
            
            <div className="applicant-details">
              <div className="detail-group">
                <label>Stall Name</label>
                <p>{selectedRegistration.stallName}</p>
              </div>
              
              <div className="detail-row">
                <div className="detail-group">
                  <label>Applicant</label>
                  <p>{selectedRegistration.fullName}</p>
                </div>
                <div className="detail-group">
                  <label>Email</label>
                  <p>{selectedRegistration.email}</p>
                </div>
              </div>
              
              <div className="detail-group">
                <label>Phone</label>
                <p>{selectedRegistration.phoneNumber}</p>
              </div>
              
              {selectedRegistration.description && (
                <div className="detail-group">
                  <label>Description</label>
                  <p className="description-text">{selectedRegistration.description}</p>
                </div>
              )}

              {selectedRegistration.logoURL && (
                <div className="detail-group">
                  <label>Stall Logo</label>
                  <div className="review-logo-preview">
                    <img src={selectedRegistration.logoURL} alt="Stall logo" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="review-form">
              <label htmlFor="review-note">Review Note (optional)</label>
              <textarea
                id="review-note"
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="Add any notes about your decision..."
                rows={3}
              />
            </div>
            
            <div className="review-actions">
              <button
                className="btn-reject"
                onClick={() => handleReview('reject')}
                disabled={reviewLoading}
              >
                {reviewLoading ? 'Processing...' : 'Reject Application'}
              </button>
              <button
                className="btn-approve"
                onClick={() => handleReview('approve')}
                disabled={reviewLoading}
              >
                {reviewLoading ? 'Processing...' : 'Approve & Send to Admin'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StallRegistrationReview;
