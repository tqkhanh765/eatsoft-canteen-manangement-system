import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { time: '8:00 AM', orders: 112 },
  { time: '9:00 AM', orders: 389 },
  { time: '10:00 AM', orders: 812 },
  { time: '11:00 AM', orders: 1704 },
  { time: '12:00 AM', orders: 981 },
  { time: '13:00 PM', orders: 211 },
  { time: '14:00 PM', orders: 150 },
];

const colors = ['#FFE066', '#FFE066', '#FFD43B', '#FAB005', '#FCC419', '#FFE066', '#FFE066'];

const PeakOrderingHoursChart = () => {
  return (
    <div className="manager-chart-container">
      <h3 className="manager-chart-title">PEAK ORDERING HOURS</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PeakOrderingHoursChart;
