import React from 'react';
import DiscoveryHeader from '../components/DiscoveryHeader';
import StallsGrid from '../components/StallsGrid';
import { STORES } from '../data/stores';
import './FoodStallsPage.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const FoodStallsPage = () => {
  const [stores, setStores] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/stores`);
        if (!response.ok) throw new Error('Failed to fetch stores');
        const data = await response.json();
        setStores(data);
      } catch (error) {
        console.error('Error fetching stores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  return (
    <div className="food-stalls-page">
      <DiscoveryHeader />
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>Loading food stalls...</div>
      ) : (
        <StallsGrid stores={stores} />
      )}
    </div>
  );
};

export default FoodStallsPage;
