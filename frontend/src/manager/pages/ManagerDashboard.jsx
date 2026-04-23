import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PeakOrderingHoursChart from '../components/PeakOrderingHoursChart';
import TopOrderingChart from '../components/TopOrderingChart';
import PeakDayChart from '../components/PeakDayChart';
import PerformanceTable from '../components/PerformanceTable';
import '../styles/ManagerDashboard.css';

// Default date range: last 30 days → today
const today = () => new Date().toISOString().split('T')[0];
const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
};

const ManagerDashboard = ({ user, onLogout }) => {
  const [startDate, setStartDate] = useState(daysAgo(30));
  const [endDate,   setEndDate]   = useState(today());
  // pending = values in the inputs before Apply is clicked
  const [pendingStart, setPendingStart] = useState(daysAgo(30));
  const [pendingEnd,   setPendingEnd]   = useState(today());
  const [dateError, setDateError] = useState('');

  const handleApply = () => {
    if (pendingStart && pendingEnd && pendingStart > pendingEnd) {
      setDateError('Start date must be before or equal to end date.');
      return;
    }
    setDateError('');
    setStartDate(pendingStart);
    setEndDate(pendingEnd);
  };

  const handleReset = () => {
    const s = daysAgo(30);
    const e = today();
    setPendingStart(s);
    setPendingEnd(e);
    setDateError('');
    setStartDate(s);
    setEndDate(e);
  };

  return (
    <>
      <Navbar onLoginClick={() => {}} user={user} onLogout={onLogout} />
      <main className="manager-dashboard-page">
        <div className="manager-dashboard-container">
          <div className="manager-dashboard-header">
            <h1 className="manager-dashboard-title">Data Analytics</h1>
          </div>

          {/* ── Date Range Picker ──────────────────────────── */}
          <div className="manager-date-range-bar">
            <div className="manager-date-range-inputs">
              <div className="manager-date-field">
                <label htmlFor="chart-start-date">From</label>
                <input
                  id="chart-start-date"
                  type="date"
                  value={pendingStart}
                  max={pendingEnd || today()}
                  onChange={e => setPendingStart(e.target.value)}
                />
              </div>
              <span className="manager-date-separator">—</span>
              <div className="manager-date-field">
                <label htmlFor="chart-end-date">To</label>
                <input
                  id="chart-end-date"
                  type="date"
                  value={pendingEnd}
                  min={pendingStart}
                  max={today()}
                  onChange={e => setPendingEnd(e.target.value)}
                />
              </div>
            </div>

            <div className="manager-date-range-actions">
              <button className="manager-apply-btn" onClick={handleApply}>
                Apply Filter
              </button>
              <button className="manager-reset-btn" onClick={handleReset}>
                Reset
              </button>
            </div>

            {dateError && (
              <span className="manager-date-error">{dateError}</span>
            )}
          </div>

          {/* ── Charts ────────────────────────────────────── */}
          <div className="manager-charts-grid">
            <div className="manager-chart-row">
              <PeakOrderingHoursChart startDate={startDate} endDate={endDate} />
              <TopOrderingChart       startDate={startDate} endDate={endDate} />
            </div>

            <PeakDayChart   startDate={startDate} endDate={endDate} />
            <PerformanceTable />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ManagerDashboard;
