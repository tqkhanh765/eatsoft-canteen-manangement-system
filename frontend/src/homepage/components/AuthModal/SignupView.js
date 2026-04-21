import React, { useState } from 'react';
import { PasswordField } from './AuthShared';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const SignupView = ({ onClose, onSwitchLogin }) => {
  const [form, setForm] = useState({
    email: '',
    fullName: '',
    phone: '',
    password: '',
    confirm: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const validateForm = () => {
    const newErrors = {};

    if (!form.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!form.fullName) {
      newErrors.fullName = 'Full name is required';
    }

    if (!form.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,11}$/.test(form.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid phone number format';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!form.confirm) {
      newErrors.confirm = 'Please confirm your password';
    } else if (form.password !== form.confirm) {
      newErrors.confirm = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: form.fullName,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'Email already exists') {
          setErrors({ email: data.error });
        } else if (data.error === 'Phone number already exists') {
          setErrors({ phone: data.error });
        } else {
          setErrors({ general: data.error || 'Registration failed' });
        }
        return;
      }

      // Success - show notification and redirect to login
      setSuccessMessage('Account registered successfully');
      setTimeout(() => {
        onSwitchLogin();
      }, 1500);
    } catch (err) {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-view" id="auth-view-signup">
      <h1 className="auth-title">Sign up</h1>
      
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

      {errors.general && (
        <div style={{
          backgroundColor: '#EF4444',
          color: 'white',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px',
          textAlign: 'center',
          fontWeight: '600',
        }}>
          {errors.general}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <label className="auth-label" htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            type="email"
            className="auth-input"
            value={form.email}
            onChange={set('email')}
            autoComplete="email"
            required
            style={errors.email ? { borderColor: '#EF4444' } : {}}
          />
          {errors.email && (
            <span style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>
              {errors.email}
            </span>
          )}
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="signup-fullname">Full name</label>
          <input
            id="signup-fullname"
            type="text"
            className="auth-input"
            value={form.fullName}
            onChange={set('fullName')}
            autoComplete="name"
            required
            style={errors.fullName ? { borderColor: '#EF4444' } : {}}
          />
          {errors.fullName && (
            <span style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>
              {errors.fullName}
            </span>
          )}
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="signup-phone">Phone number</label>
          <input
            id="signup-phone"
            type="tel"
            className="auth-input"
            value={form.phone}
            onChange={set('phone')}
            autoComplete="tel"
            style={errors.phone ? { borderColor: '#EF4444' } : {}}
          />
          {errors.phone && (
            <span style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>
              {errors.phone}
            </span>
          )}
        </div>

        <PasswordField
          id="signup-password"
          label="Password"
          value={form.password}
          onChange={set('password')}
          error={errors.password}
        />

        <PasswordField
          id="signup-confirm"
          label="Confirm password"
          value={form.confirm}
          onChange={set('confirm')}
          error={errors.confirm}
        />

        <button 
          type="submit" 
          className="auth-submit-btn" 
          id="btn-signup-submit"
          disabled={loading}
          style={loading ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
        >
          {loading ? 'Signing up...' : 'Sign up'}
        </button>
      </form>

      <p className="auth-switch">
        Already have an account?{' '}
        <button
          type="button"
          className="auth-link auth-link-bold"
          id="btn-go-login"
          onClick={onSwitchLogin}
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default SignupView;
