import React from 'react';
import DiscoveryHeader from '../components/DiscoveryHeader';
import StallsGrid from '../components/StallsGrid';
import { STORES } from '../data/stores';
import './FoodStallsPage.css';

const FoodStallsPage = () => {
  return (
    <div className="food-stalls-page">
      <DiscoveryHeader />
      <StallsGrid stores={STORES} />
    </div>
  );
};

export default FoodStallsPage;
