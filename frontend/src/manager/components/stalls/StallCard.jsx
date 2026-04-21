import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/StallManagement.css';

const StallCard = ({ stall }) => {
  const navigate = useNavigate();

  return (
    <div className="stall-card" onClick={() => navigate(`/manager-stalls/${stall.id}`)}>
      <div className="stall-card-logo">
        <img src={stall.logo} alt={stall.name} />
      </div>
      <h3 className="stall-card-name">{stall.name}</h3>
    </div>
  );
};

export default StallCard;
