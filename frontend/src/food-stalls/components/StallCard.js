import React from 'react';
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
  return (
    <div className={`stall-card ${!store.isOpen ? 'closed' : ''}`}>
      <div className="card-image-box">
        <img src={store.image} alt={store.name} />
        {!store.isOpen && <div className="closed-overlay">Currently Closed</div>}
        <div className="time-badge">
          <ClockIcon /> {store.time}
        </div>
      </div>
      <div className="card-content">
        <div className="card-header">
          <h3>{store.name}</h3>
          <div className="rating">
            <StarIcon />
            <span>{store.rating} <span className="reviews">({store.reviews})</span></span>
          </div>
        </div>
        <div className="tags">
          {store.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StallCard;
