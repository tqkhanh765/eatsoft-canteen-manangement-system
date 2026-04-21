import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Color palette for bars
const COLORS = ['#E649A6', '#D0BFFF', '#FA5252', '#FAB005', '#22B8CF', '#FD7E14', '#228BE6'];

const TopOrderingChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopOrdering = async () => {
      try {
        const response = await fetch(`${API_URL}/orders/stats/top-ordering`);
        if (!response.ok) {
          throw new Error('Failed to fetch top ordering data');
        }
        const result = await response.json();
        // Add colors to the data
        const dataWithColors = result.map((item, index) => ({
          ...item,
          color: COLORS[index % COLORS.length],
        }));
        setData(dataWithColors);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopOrdering();
  }, []);

  // Calculate dynamic Y-axis domain and ticks based on highest value
  const getYAxisConfig = () => {
    if (data.length === 0) return { domain: [0, 100], ticks: [0, 25, 50, 75, 100] };
    
    const maxValue = Math.max(...data.map(d => d.products));
    // Round up to nearest 10 and add some padding
    const maxDomain = Math.ceil(maxValue / 10) * 10 + 10;
    
    // Create 5 evenly spaced ticks
    const step = Math.ceil(maxDomain / 5 / 10) * 10; // Round step to nearest 10
    const ticks = [];
    for (let i = 0; i <= maxDomain; i += step) {
      ticks.push(i);
    }
    
    return { domain: [0, maxDomain], ticks };
  };

  const { domain, ticks } = getYAxisConfig();

  if (loading) {
    return (
      <div className="manager-chart-container">
        <h3 className="manager-chart-title">TOP ORDERING</h3>
        <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manager-chart-container">
        <h3 className="manager-chart-title">TOP ORDERING</h3>
        <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="manager-chart-container">
      <h3 className="manager-chart-title">TOP ORDERING</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          barCategoryGap="10%"
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 11, fill: '#666' }}
            angle={-35}
            textAnchor="end"
            height={80}
            interval={0}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#666' }}
            width={40}
            domain={domain}
            ticks={ticks}
          />
          <Tooltip />
          <Bar dataKey="products" radius={[6, 6, 0, 0]} barSize={45}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopOrderingChart;
