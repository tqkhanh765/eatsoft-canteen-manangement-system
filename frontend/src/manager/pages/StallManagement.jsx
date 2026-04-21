import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import StallCard from '../components/stalls/StallCard';
import NewRequestCard from '../components/stalls/NewRequestCard';
import '../styles/StallManagement.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const StallManagement = ({ user, onLogout }) => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const handleLoginClick = () => {};

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/stores`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch stores');
        }

        const data = await response.json();
        
        // Transform store data to match StallCard format
        const transformedStores = data.map(store => ({
          id: store.storeId,
          name: store.storeName,
          logo: store.logo || 'https://via.placeholder.com/150?text=No+Logo',
          location: store.location,
          isOpen: store.isOpen,
        }));

        setStores(transformedStores);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  return (
    <>
      <Navbar onLoginClick={handleLoginClick} user={user} onLogout={onLogout} />
      <main className="stall-management-page">
        <div className="container">
          <h1 className="page-title">Stall Management</h1>
          
          {error && <div className="error-message">{error}</div>}
          
          {loading ? (
            <div className="loading-message">Loading stores...</div>
          ) : (
            <div className="stalls-grid">
              <NewRequestCard />
              {stores.map((stall) => (
                <StallCard key={stall.id} stall={stall} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default StallManagement;
