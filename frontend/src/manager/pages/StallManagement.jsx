import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import StallCard from '../components/stalls/StallCard';
import NewRequestCard from '../components/stalls/NewRequestCard';
import StallAvailableCard from '../components/stalls/StallAvailableCard';
import '../styles/StallManagement.css';

const MOCK_STALLS = [
  {
    id: 1,
    name: 'BIG U',
    logo: '/stalls/bigu.png',
    registrationDate: 'April 03, 2026',
    leaseExpiry: 'April 03, 2028',
    progress: 5,
  },
  {
    id: 2,
    name: 'COM VIET',
    logo: '/stalls/comviet.png',
    registrationDate: 'April 03, 2026',
    leaseExpiry: 'April 03, 2028',
    progress: 5,
  },
  {
    id: 3,
    name: 'H&D FOOD COURT',
    logo: '/stalls/hd.png',
    registrationDate: 'April 03, 2026',
    leaseExpiry: 'April 03, 2028',
    progress: 5,
  },
  {
    id: 4,
    name: 'GAO & NOI',
    logo: '/stalls/gaonoi.png',
    registrationDate: 'April 03, 2025',
    leaseExpiry: 'April 03, 2026',
    progress: 97,
  },
  {
    id: 5,
    name: 'CAFFE STORY',
    logo: '/stalls/caffestory.png',
    registrationDate: 'April 03, 2023',
    leaseExpiry: 'April 03, 2025',
    progress: 100,
  },
  {
    id: 6,
    name: 'B&B cafeteria',
    logo: '/stalls/bb.png',
    registrationDate: 'April 03, 2024',
    leaseExpiry: 'Sept 03, 2026',
    progress: 80,
  },
  {
    id: 7,
    name: 'THE ZERO COFFEE',
    logo: '/stalls/zerocoffee.png',
    registrationDate: 'April 03, 2026',
    leaseExpiry: 'April 03, 2028',
    progress: 5,
  },
  {
    id: 8,
    name: 'Starbucks',
    logo: '/stalls/starbucks.png',
    registrationDate: 'April 08, 2026',
    leaseExpiry: 'April 08, 2028',
    progress: 5,
  },
];

const StallManagement = ({ user, onLogout }) => {
  const handleLoginClick = () => {};

  return (
    <>
      <Navbar onLoginClick={handleLoginClick} user={user} onLogout={onLogout} />
      <main className="stall-management-page">
        <div className="container">
          <h1 className="page-title">Stall Management</h1>
          
          <div className="stalls-grid">
            {MOCK_STALLS.map((stall) => (
              <StallCard key={stall.id} stall={stall} />
            ))}
            <NewRequestCard />
            <StallAvailableCard />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default StallManagement;
