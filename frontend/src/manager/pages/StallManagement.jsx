import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import StallCard from '../components/stalls/StallCard';
import NewRequestCard from '../components/stalls/NewRequestCard';
import '../styles/StallManagement.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const StallManagement = ({ user, onLogout }) => {
  const [stores, setStores] = useState([]);
  const [hasPendingRegistrations, setHasPendingRegistrations] = useState(false);
  const [loading, setLoading] = useState(true);
  const handleLoginClick = () => {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        const [storesRes, regRes] = await Promise.all([
          fetch(`${API_URL}/stores`, { headers }),
          fetch(`${API_URL}/stall-registrations?status=MANAGER_PENDING`, { headers }),
        ]);

        if (storesRes.ok) {
          const data = await storesRes.json();
          setStores(data.map(store => ({
            id: store.storeId,
            name: store.storeName,
            logo: store.logo || null,
            location: store.location,
            isOpen: store.isOpen,
            registrationDate: store.createdAt
              ? new Date(store.createdAt).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })
              : '—',
            leaseExpiry: store.leaseExpiry
              ? new Date(store.leaseExpiry).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })
              : 'April 03, 2028',
            progress: store.leaseProgress || 5,
          })));
        }

        if (regRes.ok) {
          const regData = await regRes.json();
          setHasPendingRegistrations((regData.registrations || []).length > 0);
        }
      } catch (err) {
        console.error('StallManagement fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Total grid slots = stores + (newRequest if any) + 1 available slot
  const totalCards = stores.length + (hasPendingRegistrations ? 1 : 0) + 1;
  const gridCols = 3;
  const remainder = totalCards % gridCols;
  const emptySlots = remainder === 0 ? 0 : gridCols - remainder;

  return (
    <>
      <Navbar onLoginClick={handleLoginClick} user={user} onLogout={onLogout} />
      <main className="stall-management-page">
        <div className="container">
          <h1 className="page-title">Stall Management</h1>

          {loading ? (
            <div className="stall-detail-loading">Loading stores…</div>
          ) : (
            <div className="stalls-grid">
              {hasPendingRegistrations && <NewRequestCard />}

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
