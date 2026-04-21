import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Color scale based on order count
const getBarColor = (orders, maxOrders) => {
  if (maxOrders === 0) return '#FFE066';
  const ratio = orders / maxOrders;
  if (ratio > 0.8) return '#FFA500'; // Orange for peak
  if (ratio > 0.5) return '#FFD43B'; // Yellow for medium
  return '#FFE066'; // Light yellow for low
};

const PeakOrderingHoursChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPeakHours = async () => {
      try {
        const response = await fetch(`${API_URL}/orders/stats/peak-hours`);
        if (!response.ok) {
          throw new Error('Failed to fetch peak ordering hours');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPeakHours();
  }, []);

  const maxOrders = data.length > 0 ? Math.max(...data.map(d => d.orders)) : 0;

  if (loading) {
    return (
      <div className="manager-chart-container">
        <h3 className="manager-chart-title">PEAK ORDERING HOURS</h3>
        <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manager-chart-container">
        <h3 className="manager-chart-title">PEAK ORDERING HOURS</h3>
        <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="manager-chart-container">
      <h3 className="manager-chart-title">PEAK ORDERING HOURS</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="time" 
            type="category" 
            width={80}
            tick={{ fontSize: 12, fill: '#666' }}
          />
          <Tooltip />
          <Bar dataKey="orders" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.orders, maxOrders)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PeakOrderingHoursChart;
