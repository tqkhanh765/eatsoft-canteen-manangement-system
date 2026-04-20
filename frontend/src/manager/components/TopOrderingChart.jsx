import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'B&B Cafeteria', value: 25, color: '#E649A6' },
  { name: 'H&D Food', value: 15, color: '#228BE6' },
  { name: 'Com Viet', value: 12, color: '#FAB005' },
  { name: 'Coffee Story', value: 10, color: '#FA5252' },
  { name: 'Gạo&Nói', value: 18, color: '#22B8CF' },
  { name: 'The Zero Coffee', value: 12, value: 20, color: '#FD7E14' },
  { name: 'BigU', value: 8, color: '#D0BFFF' },
];

const TopOrderingChart = () => {
  return (
    <div className="manager-chart-container">
      <h3 className="manager-chart-title">TOP ORDERING</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="rect"
            wrapperStyle={{ fontSize: '10px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopOrderingChart;
