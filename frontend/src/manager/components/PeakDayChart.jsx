import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Color scale based on order count
const getBarColor = (orders, maxOrders) => {
  if (maxOrders === 0) return '#FFE066';
  const ratio = orders / maxOrders;
  if (ratio > 0.8) return '#FF4444'; // Red for peak
  if (ratio > 0.5) return '#FF6B00'; // Orange for high
  if (ratio > 0.3) return '#FFC107'; // Yellow for medium
  return '#2F9E44'; // Green for low
};

const PeakDayChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPeakDay = async () => {
      try {
        const response = await fetch(`${API_URL}/orders/stats/peak-day`);
        if (!response.ok) {
          throw new Error('Failed to fetch peak day data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPeakDay();
  }, []);

  const maxOrders = data.length > 0 ? Math.max(...data.map(d => d.orders)) : 0;

  const dataWithColors = data.map(item => ({
    ...item,
    color: getBarColor(item.orders, maxOrders),
  }));

  if (loading) {
    return (
      <div className="manager-chart-container manager-chart-wide">
        <h3 className="manager-chart-title">PEAK DAY</h3>
        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manager-chart-container manager-chart-wide">
        <h3 className="manager-chart-title">PEAK DAY</h3>
        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="manager-chart-container manager-chart-wide">
      <h3 className="manager-chart-title">PEAK DAY</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={dataWithColors}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="day" 
            tick={{ fontSize: 11, fill: '#666' }}
            axisLine={false}
          />
          <YAxis hide />
          <Tooltip />
          <Bar dataKey="orders" radius={[4, 4, 0, 0]}>
            {dataWithColors.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PeakDayChart;
