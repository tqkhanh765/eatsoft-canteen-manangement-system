import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import '../styles/Admin.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// ── SVG Icon Components ───────────────────────────────────────────────────────
const UsersIcon = () => (
  <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#2563EB" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
);

const StoreIcon = () => (
  <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#10B981" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#F59E0B" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const ShoppingBagIcon = () => (
  <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#7C3AED" strokeWidth="2">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);

// ── Status badge helper ───────────────────────────────────────────────────────
const statusBadge = (status) => {
  const map = {
    MANAGER_PENDING:  ['badge-yellow', 'Manager Review'],
    MANAGER_APPROVED: ['badge-blue',   'Pending Admin'],
    MANAGER_REJECTED: ['badge-red',    'Rejected'],
    ADMIN_COMPLETED:  ['badge-green',  'Completed'],
    ADMIN_REJECTED:   ['badge-red',    'Admin Rejected'],
  };
  const [cls, label] = map[status] || ['badge-gray', status];
  return <span className={`badge ${cls}`}>{label}</span>;
};

// ── Page ──────────────────────────────────────────────────────────────────────
const AdminDashboard = ({ user, onLogout }) => {
  const [stats, setStats] = useState({ users: 0, stores: 0, pendingReg: 0, orders: 0 });
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const h = { 'Authorization': `Bearer ${token}` };

    Promise.all([
      fetch(`${API_URL}/users`, { headers: h }).then(r => r.json()),
      fetch(`${API_URL}/stores`, { headers: h }).then(r => r.json()),
      fetch(`${API_URL}/stall-registrations`, { headers: h }).then(r => r.json()),
      fetch(`${API_URL}/orders`, { headers: h }).then(r => r.json()).catch(() => []),
    ]).then(([users, stores, regs, orders]) => {
      const regList = regs.registrations || [];
      setStats({
        users:      Array.isArray(users)  ? users.length  : 0,
        stores:     Array.isArray(stores) ? stores.length : 0,
        pendingReg: regList.filter(r => r.status === 'MANAGER_APPROVED').length,
        orders:     Array.isArray(orders) ? orders.length : 0,
      });
      setRecentRegistrations(regList.slice(0, 5));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = [
    { label: 'Total Users',       value: stats.users,      bg: '#DBEAFE', icon: <UsersIcon />       },
    { label: 'Active Stores',     value: stats.stores,     bg: '#D1FAE5', icon: <StoreIcon />       },
    { label: 'Pending Approvals', value: stats.pendingReg, bg: '#FEF3C7', icon: <ClockIcon />       },
    { label: 'Total Orders',      value: stats.orders,     bg: '#EDE9FE', icon: <ShoppingBagIcon /> },
  ];

  return (
    <AdminLayout user={user} onLogout={onLogout} title="Dashboard">
      {loading ? (
        <div className="admin-loading">Loading…</div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="admin-stats-grid">
            {STAT_CARDS.map(c => (
              <div className="admin-stat-card" key={c.label}>
                <div className="admin-stat-icon" style={{ background: c.bg }}>
                  {c.icon}
                </div>
                <div>
                  <div className="admin-stat-label">{c.label}</div>
                  <div className="admin-stat-value">{c.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Registrations */}
          <div className="admin-card">
            <div className="admin-card-header">
              <span className="admin-card-title">Recent Stall Registrations</span>
            </div>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Stall Name</th>
                    <th>Applicant</th>
                    <th>Email</th>
                    <th>Submitted</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', color: '#94A3B8', padding: '32px' }}>
                        No registrations yet
                      </td>
                    </tr>
                  ) : recentRegistrations.map(r => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 600 }}>{r.stallName}</td>
                      <td>{r.fullName}</td>
                      <td style={{ color: '#64748B' }}>{r.email}</td>
                      <td style={{ color: '#64748B' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                      <td>{statusBadge(r.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
