import React, { useState, useEffect } from 'react';
import './PersonalInfo.css';
import authService from '../services/authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const PersonalInfo = ({ onUserUpdate }) => {
  const [userData, setUserData] = useState({
    userName: '',
    email: '',
    phone: '',
    studentId: '',
    universityName: '',
    country: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setFetchLoading(true);
      const token = authService.getToken();
      
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      
      if (data.success && data.user) {
        setUserData({
          userName: data.user.userName || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          studentId: data.user.studentId || '',
          universityName: data.user.universityName || '',
          country: data.user.country || '',
        });
      }
    } catch (err) {
      setError('Failed to load user information');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setUserData(prev => ({ ...prev, [field]: e.target.value }));
    setError('');
  };

  const validateForm = () => {
    if (!userData.userName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!userData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(userData.email)) {
      setError('Invalid email format');
      return false;
    }
    if (!userData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');

      const token = authService.getToken();
      
      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update profile');
        return;
      }

      if (data.success) {
        setSuccessMessage('Profile updated successfully');
        setIsEditing(false);
        
        // Update local storage user data
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          const updatedUser = { ...currentUser, ...data.user };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          // Notify parent component of user update
          if (onUserUpdate) {
            onUserUpdate(updatedUser);
          }
        }
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    fetchUserData(); // Re-fetch to reset to original data
  };

  if (fetchLoading) {
    return (
      <div className="personal-info">
        <h1>Personal Information</h1>
        <div className="info-card" style={{ textAlign: 'center', padding: '40px' }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="personal-info">
      <h1>Personal Information</h1>
      
      {successMessage && (
        <div style={{
          backgroundColor: '#22C55E',
          color: 'white',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px',
          textAlign: 'center',
          fontWeight: '600',
        }}>
          {successMessage}
        </div>
      )}

      {error && (
        <div style={{
          backgroundColor: '#EF4444',
          color: 'white',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px',
          textAlign: 'center',
          fontWeight: '600',
        }}>
          {error}
        </div>
      )}

      <div className="info-card">
        <div className="info-grid">
          <div className="input-field full-width">
            <label>Full Name *</label>
            <input 
              type="text" 
              value={userData.userName} 
              onChange={handleChange('userName')}
              readOnly={!isEditing}
            />
          </div>

          <div className="input-field">
            <label>Email Address *</label>
            <input 
              type="email" 
              value={userData.email} 
              onChange={handleChange('email')}
              readOnly={!isEditing}
            />
          </div>
          <div className="input-field">
            <label>Phone Number *</label>
            <input 
              type="text" 
              value={userData.phone} 
              onChange={handleChange('phone')}
              readOnly={!isEditing}
            />
          </div>

          <div className="input-field">
            <label>Student ID</label>
            <input 
              type="text" 
              value={userData.studentId} 
              onChange={handleChange('studentId')}
              readOnly={!isEditing}
              placeholder={isEditing ? 'Optional' : ''}
            />
          </div>
          <div className="input-field">
            <label>Country</label>
            <input 
              type="text" 
              value={userData.country} 
              onChange={handleChange('country')}
              readOnly={!isEditing}
              placeholder={isEditing ? 'Optional' : ''}
            />
          </div>

          <div className="input-field full-width">
            <label>University</label>
            <input 
              type="text" 
              value={userData.universityName} 
              onChange={handleChange('universityName')}
              readOnly={!isEditing}
              placeholder={isEditing ? 'Optional' : ''}
            />
          </div>
        </div>

        {isEditing ? (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="edit-btn" 
              onClick={handleSave}
              disabled={loading}
              style={loading ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
            >
              {loading ? 'Saving...' : 'SAVE CHANGES'}
            </button>
            <button 
              className="edit-btn" 
              onClick={handleCancel}
              disabled={loading}
              style={{ 
                backgroundColor: '#6B7280', 
                boxShadow: '0 2px 5px rgba(107, 114, 128, 0.3)',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              CANCEL
            </button>
          </div>
        ) : (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            EDIT
          </button>
        )}
      </div>
    </div>
  );
};

export default PersonalInfo;
