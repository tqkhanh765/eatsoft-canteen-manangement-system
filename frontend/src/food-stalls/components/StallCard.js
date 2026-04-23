import React from 'react';
import { useNavigate } from 'react-router-dom';
import StallLogo from './StallLogo';
import './StallCard.css';

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFC107" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const StallCard = ({ store }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/stalls-menu/${store.storeId}`);
  };

  return (
    <div className={`stall-card ${!store.isOpen ? 'closed' : ''}`} onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className="card-image-box">
        <div className="stall-logo-wrap">
          <StallLogo logoURL={store.logoURL} name={store.storeName} />
        </div>
        {!store.isOpen && <div className="closed-overlay">Currently Closed</div>}
      </div>
      <div className="card-content">
        <div className="card-header">
          <div className="card-title-group">
            <h3>{store.storeName}</h3>
            <div className="card-time-info">
              <ClockIcon /> 8:00 AM - 14:00 PM
            </div>
          </div>
          <div className="rating">
            <StarIcon />
            <span>{store.rating || 'New'} <span className="reviews">({store.reviews || '0'})</span></span>
          </div>
        </div>
        <div className="tags">
          {(store.tags || ['Asian', 'Quick Bite']).map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StallCard;
