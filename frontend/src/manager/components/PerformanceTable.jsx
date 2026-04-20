import React from 'react';

const performanceData = [
  { stall: 'B&B Cafeteria', revenue: '120.000.000', orders: '30.000', avgOrders: '22.000', status: 'Open' },
  { stall: 'H&D Food', revenue: '120.000.000', orders: '30.000', avgOrders: '22.000', status: 'Open' },
  { stall: 'Coffee Story', revenue: '90.000.000', orders: '20.000', avgOrders: '22.000', status: 'Close' },
  { stall: 'Gạo&Nói', revenue: '90.000.000', orders: '20.000', avgOrders: '22.000', status: 'Open' },
  { stall: 'Com Việt', revenue: '70.000.000', orders: '15.000', avgOrders: '22.000', status: 'Close' },
  { stall: 'The Zero Coffee', revenue: '85.000.000', orders: '18.000', avgOrders: '22.000', status: 'Close' },
  { stall: 'BigU', revenue: '70.000.000', orders: '15.000', avgOrders: '22.000', status: 'Open' },
];

const PerformanceTable = () => {
  return (
    <div className="manager-table-container">
      <h3 className="manager-chart-title">SUMMARIZE PERFORMANCE BY STALL</h3>
      <table className="manager-performance-table">
        <thead>
          <tr>
            <th>Stall</th>
            <th>Revenue</th>
            <th>Order</th>
            <th>Avg Orders</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {performanceData.map((row, index) => (
            <tr key={index}>
              <td>{row.stall}</td>
              <td>{row.revenue}</td>
              <td>{row.orders}</td>
              <td>{row.avgOrders}</td>
              <td>
                <span className={`status-badge ${row.status.toLowerCase()}`}>
                  {row.status}
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
