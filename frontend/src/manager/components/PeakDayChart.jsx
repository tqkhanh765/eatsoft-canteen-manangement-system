import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { day: 'Monday', orders: 3248, color: '#FFD43B' },
  { day: 'Tuesday', orders: 3890, color: '#FFC107' },
  { day: 'Wednesday', orders: 6412, color: '#FF6B00' },
  { day: 'Thursday', orders: 4120, color: '#FFC107' },
  { day: 'Friday', orders: 6254, color: '#FF4444' },
  { day: 'Saturday', orders: 1254, color: '#2F9E44' },
];

const PeakDayChart = () => {
  return (
    <div className="manager-chart-container manager-chart-wide">
      <h3 className="manager-chart-title">PEAK DAY</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={data}
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
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PeakDayChart;
