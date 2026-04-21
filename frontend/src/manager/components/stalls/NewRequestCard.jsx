import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/StallManagement.css';

const NewRequestCard = () => {
  const navigate = useNavigate();

  return (
    <div className="stall-card new-request-card" onClick={() => navigate('/manager-stalls/requests')}>
      <h3 className="new-request-title">New Request !</h3>
      <div className="plus-icon-container">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      </div>
      <p className="new-request-text">Click to view new stall request</p>
    </div>
  );
};

export default NewRequestCard;
