import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const PerformanceTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    // Default to today
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const fetchPerformanceData = async (date) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/orders/stats/performance?date=${date}`);
      if (!response.ok) {
        throw new Error('Failed to fetch performance data');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformanceData(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  if (loading) {
    return (
      <div className="manager-table-container">
        <h3 className="manager-chart-title">SUMMARIZE PERFORMANCE BY STALL</h3>
        <div className="date-picker-container" style={{ marginBottom: '20px' }}>
          <label htmlFor="performance-date" style={{ marginRight: '10px' }}>Select Date:</label>
          <input
            type="date"
            id="performance-date"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>
        <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manager-table-container">
        <h3 className="manager-chart-title">SUMMARIZE PERFORMANCE BY STALL</h3>
        <div className="date-picker-container" style={{ marginBottom: '20px' }}>
          <label htmlFor="performance-date" style={{ marginRight: '10px' }}>Select Date:</label>
          <input
            type="date"
            id="performance-date"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>
        <div style={{ padding: '40px', textAlign: 'center', color: '#EF4444' }}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="manager-table-container">
      <h3 className="manager-chart-title">SUMMARIZE PERFORMANCE BY STALL</h3>
      <div className="date-picker-container" style={{ marginBottom: '20px' }}>
        <label htmlFor="performance-date" style={{ marginRight: '10px' }}>Select Date:</label>
        <input
          type="date"
          id="performance-date"
          value={selectedDate}
          onChange={handleDateChange}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        />
      </div>
      <table className="manager-performance-table">
        <thead>
          <tr>
            <th>Stall</th>
            <th>Avg Rating</th>
            <th>Daily Orders</th>
            <th>Daily Income</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.storeName}</td>
              <td>{row.avgRating}</td>
              <td>{row.dailyOrders}</td>
              <td>{row.dailyIncome}</td>
              <td>
                <span className={`status-badge ${row.isOpen ? 'open' : 'closed'}`}>
                  {row.isOpen ? 'OPEN' : 'CLOSED'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PerformanceTable;
