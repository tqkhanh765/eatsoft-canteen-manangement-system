import React, { useState } from 'react';
import './StallRegistrationForm.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const StallRegistrationForm = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    stallName: '',
    description: '',
    documents: [],
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Don't render if modal is not open - must be after all hooks
  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    
    if (!formData.stallName.trim()) {
      newErrors.stallName = 'Stall name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, you would upload these files to get URLs
    // For now, we'll just store the file names
    setFormData(prev => ({
      ...prev,
      documents: files.map(f => f.name),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/stall-registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setErrors({ submit: data.error || 'Failed to submit registration' });
        setLoading(false);
        return;
      }
      
      setSubmitSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose?.();
      }, 3000);
    } catch (err) {
      setErrors({ submit: 'Network error. Please try again.' });
      setLoading(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="registration-form-modal">
        <div className="registration-form success">
          <div className="success-icon">✓</div>
          <h2>Application Submitted!</h2>
          <p>Your stall registration has been received.</p>
          <p>You will receive an email notification when a manager reviews your application.</p>
          <button className="btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="registration-form-modal">
      <div className="registration-form">
        <button className="close-btn" onClick={onClose}>×</button>
        
        <h2>Register Your Stall</h2>
        <p className="subtitle">Fill in the details below to apply for a stall at IU EatSoft</p>
        
        {errors.submit && (
          <div className="error-banner">{errors.submit}</div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={errors.fullName ? 'error' : ''}
            />
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Your phone number"
                className={errors.phoneNumber ? 'error' : ''}
              />
              {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label>Stall Name *</label>
            <input
              type="text"
              name="stallName"
              value={formData.stallName}
              onChange={handleChange}
              placeholder="What will you call your stall?"
              className={errors.stallName ? 'error' : ''}
            />
            {errors.stallName && <span className="error-text">{errors.stallName}</span>}
          </div>
          
          <div className="form-group">
            <label>Stall Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your stall, food type, specialties, etc."
              rows={4}
            />
          </div>
          
          <div className="form-group">
            <label>Supporting Documents</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <small className="help-text">
              Upload business license, food safety certificates, or menu samples (PDF, JPG, PNG)
            </small>
            {formData.documents.length > 0 && (
              <div className="file-list">
                {formData.documents.map((doc, i) => (
                  <span key={i} className="file-tag">{doc}</span>
                ))}
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StallRegistrationForm;
