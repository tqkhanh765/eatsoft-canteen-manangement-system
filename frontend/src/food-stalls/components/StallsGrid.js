import React from 'react';
import StallCard from './StallCard';
import './StallsGrid.css';

const StallsGrid = ({ stores }) => {
  return (
    <div className="stalls-grid-wrapper">
      <div className="stalls-grid">
        {stores.map((store) => (
          <StallCard key={store.id} store={store} />
        ))}
      </div>
    </div>
  );
};

export default StallsGrid;
