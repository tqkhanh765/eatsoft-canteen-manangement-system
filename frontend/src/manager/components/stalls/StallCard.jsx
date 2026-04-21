import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/StallManagement.css';

const StallCard = ({ stall }) => {
  const navigate = useNavigate();

  const getProgressColor = (progress) => {
    if (progress >= 90) return '#FF4D4D';
    if (progress >= 70) return '#FFA500';
    return '#10B981';
  };

  const getStatusText = (progress) => {
    if (progress >= 100) return 'Lease Expired';
    if (progress >= 90) return 'Critical expiring soon';
    return 'Lease progress';
  };

  return (
    <div className="stall-card" onClick={() => navigate(`/manager-stalls/${stall.id}`)}>
      <div className="stall-card-logo">
        <img src={stall.logo} alt={stall.name} />
      </div>
      <div className="stall-card-info">
        <div className="info-row">
          <span className="info-label">Registration Date</span>
          <span className="info-value">{stall.registrationDate}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Lease Expiry</span>
          <span className="info-value">{stall.leaseExpiry}</span>
        </div>
      </div>
      <div className="stall-card-progress">
        <div className="progress-header">
          <span className="progress-status" style={{ color: getProgressColor(stall.progress) }}>
            {getStatusText(stall.progress)}
          </span>
          <span className="progress-percentage" style={{ color: getProgressColor(stall.progress) }}>
            {stall.progress}%
          </span>
        </div>
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ 
              width: `${stall.progress}%`, 
              backgroundColor: getProgressColor(stall.progress) 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default StallCard;
