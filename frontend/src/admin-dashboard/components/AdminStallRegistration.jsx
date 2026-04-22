import React, { useState, useEffect } from 'react';
import './AdminStallRegistration.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const AdminStallRegistration = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [formData, setFormData] = useState({
    vendorPassword: '',
    storeLocation: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [filter, setFilter] = useState('MANAGER_APPROVED');

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

  const validateForm = () => {
    const errors = {};
    
    if (!formData.vendorPassword || formData.vendorPassword.length < 6) {
      errors.vendorPassword = 'Password must be at least 6 characters';
    }
    
    if (!formData.storeLocation.trim()) {
      errors.storeLocation = 'Store location is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCreateVendor = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSubmitLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_URL}/stall-registrations/${selectedRegistration.id}/create-vendor`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        alert(data.error || 'Failed to create vendor');
        setSubmitLoading(false);
        return;
      }
      
      alert(`Vendor account created successfully!\n\nEmail: ${data.vendor.email}\nStore: ${data.store.storeName}`);
      
      // Reset and refresh
      setSelectedRegistration(null);
      setFormData({ vendorPassword: '', storeLocation: '' });
      fetchRegistrations();
    } catch (err) {
      alert('Network error. Please try again.');
      setSubmitLoading(false);
    }
  };

  const handleAdminReject = async () => {
    const note = prompt('Enter rejection reason (optional):');
    if (note === null) return; // Cancelled
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_URL}/stall-registrations/${selectedRegistration.id}/admin-reject`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ note }),
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        alert(data.error || 'Failed to reject application');
        return;
      }
      
      alert('Application rejected');
      setSelectedRegistration(null);
      fetchRegistrations();
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'MANAGER_APPROVED': { label: 'Pending Admin', class: 'status-pending' },
      'ADMIN_COMPLETED': { label: 'Completed', class: 'status-completed' },
      'ADMIN_REJECTED': { label: 'Rejected', class: 'status-rejected' },
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
    return <div className="admin-registrations-loading">Loading...</div>;
  }

  return (
    <div className="admin-stall-registration">
      <div className="admin-header">
        <h2>Stall Registration Management</h2>
        
        <div className="admin-filter-tabs">
          <button 
            className={filter === 'MANAGER_APPROVED' ? 'active' : ''}
            onClick={() => setFilter('MANAGER_APPROVED')}
          >
            Pending Admin Action
          </button>
          <button 
            className={filter === 'ADMIN_COMPLETED' ? 'active' : ''}
            onClick={() => setFilter('ADMIN_COMPLETED')}
          >
            Completed
          </button>
          <button 
            className={filter === 'ADMIN_REJECTED' ? 'active' : ''}
            onClick={() => setFilter('ADMIN_REJECTED')}
          >
            Rejected
          </button>
        </div>
      </div>

      {error && <div className="admin-error-message">{error}</div>}

      {registrations.length === 0 ? (
        <div className="admin-no-registrations">
          <p>No {filter === 'MANAGER_APPROVED' ? 'pending' : ''} applications found.</p>
        </div>
      ) : (
        <div className="admin-registrations-list">
          {registrations.map((reg) => (
            <div 
              key={reg.id} 
              className="admin-registration-card"
              onClick={() => filter === 'MANAGER_APPROVED' && setSelectedRegistration(reg)}
            >
              <div className="admin-registration-header">
                <div className="admin-stall-info">
                  <h3>{reg.stallName}</h3>
                  <p className="admin-applicant-name">by {reg.fullName}</p>
                </div>
                {getStatusBadge(reg.status)}
              </div>
              
              <div className="admin-registration-details">
                <div className="admin-detail-row">
                  <span className="admin-label">Email:</span>
                  <span className="admin-value">{reg.email}</span>
                </div>
                <div className="admin-detail-row">
                  <span className="admin-label">Phone:</span>
                  <span className="admin-value">{reg.phoneNumber}</span>
                </div>
                {reg.description && (
                  <div className="admin-detail-row admin-description">
                    <span className="admin-label">Description:</span>
                    <span className="admin-value">{reg.description}</span>
                  </div>
                )}
                <div className="admin-detail-row">
                  <span className="admin-label">Manager Approved:</span>
                  <span className="admin-value">{formatDate(reg.reviewedAt || reg.createdAt)}</span>
                </div>
                {reg.manager && (
                  <div className="admin-detail-row">
                    <span className="admin-label">Reviewed By:</span>
                    <span className="admin-value">{reg.manager.userName}</span>
                  </div>
                )}
              </div>
              
              {reg.managerNote && (
                <div className="admin-manager-note">
                  <span className="admin-label">Manager Note:</span>
                  <p>{reg.managerNote}</p>
                </div>
              )}
              
              {filter === 'MANAGER_APPROVED' && (
                <div className="admin-action-prompt">
                  Click to create vendor account
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Vendor Modal */}
      {selectedRegistration && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <button 
              className="admin-close-btn"
              onClick={() => {
                setSelectedRegistration(null);
                setFormData({ vendorPassword: '', storeLocation: '' });
                setFormErrors({});
              }}
            >
              ×
            </button>
            
            <h3>Create Vendor Account</h3>
            
            <div className="admin-summary">
              <div className="admin-summary-item">
                <label>Stall Name</label>
                <p>{selectedRegistration.stallName}</p>
              </div>
              <div className="admin-summary-row">
                <div className="admin-summary-item">
                  <label>Applicant</label>
                  <p>{selectedRegistration.fullName}</p>
                </div>
                <div className="admin-summary-item">
                  <label>Email</label>
                  <p>{selectedRegistration.email}</p>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleCreateVendor}>
              <div className="admin-form-group">
                <label htmlFor="vendorPassword">
                  Set Vendor Password *
                </label>
                <input
                  type="text"
                  id="vendorPassword"
                  name="vendorPassword"
                  value={formData.vendorPassword}
                  onChange={handleChange}
                  placeholder="Enter password for vendor account"
                  className={formErrors.vendorPassword ? 'error' : ''}
                />
                {formErrors.vendorPassword && (
                  <span className="admin-error-text">{formErrors.vendorPassword}</span>
                )}
                <small className="admin-help-text">
                  Vendor will use their email and this password to login
                </small>
              </div>
              
              <div className="admin-form-group">
                <label htmlFor="storeLocation">
                  Store Location *
                </label>
                <input
                  type="text"
                  id="storeLocation"
                  name="storeLocation"
                  value={formData.storeLocation}
                  onChange={handleChange}
                  placeholder="e.g., Building A, Floor 2, Stall 15"
                  className={formErrors.storeLocation ? 'error' : ''}
                />
                {formErrors.storeLocation && (
                  <span className="admin-error-text">{formErrors.storeLocation}</span>
                )}
              </div>
              
              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-btn-reject"
                  onClick={handleAdminReject}
                  disabled={submitLoading}
                >
                  Reject Application
                </button>
                <button
                  type="submit"
                  className="admin-btn-create"
                  disabled={submitLoading}
                >
                  {submitLoading ? 'Creating...' : 'Create Vendor & Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStallRegistration;
