import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PeakOrderingHoursChart from '../components/PeakOrderingHoursChart';
import TopOrderingChart from '../components/TopOrderingChart';
import PeakDayChart from '../components/PeakDayChart';
import PerformanceTable from '../components/PerformanceTable';
import '../styles/ManagerDashboard.css';

const ManagerDashboard = ({ user, onLogout }) => {
  const handleLoginClick = () => {
    // Manager pages are protected, so login click shouldn't happen
    // But keeping the function for Navbar compatibility
  };

  const handleExportCSV = () => {
    // TODO: Implement CSV export functionality
    console.log('Exporting CSV...');
  };

  return (
    <>
      <Navbar onLoginClick={handleLoginClick} user={user} onLogout={onLogout} />
      <main className="manager-dashboard-page">
        <div className="manager-dashboard-container">
          <div className="manager-dashboard-header">
            <h1 className="manager-dashboard-title">Analysis</h1>
            <button className="manager-export-btn" onClick={handleExportCSV}>
              Export CSV
            </button>
          </div>

          <div className="manager-charts-grid">
            <div className="manager-chart-row">
              <PeakOrderingHoursChart />
              <TopOrderingChart />
            </div>

            <PeakDayChart />
            <PerformanceTable />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ManagerDashboard;
