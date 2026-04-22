import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import '../styles/Admin.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const AdminAnalytics = ({ user, onLogout }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const h = { 'Authorization': `Bearer ${token}` };

    Promise.all([
      fetch(`${API_URL}/stores`, { headers: h }).then(r => r.json()),
      fetch(`${API_URL}/users`, { headers: h }).then(r => r.json()),
      fetch(`${API_URL}/stall-registrations`, { headers: h }).then(r => r.json()),
      fetch(`${API_URL}/products/popular`, { headers: h }).then(r => r.json()).catch(() => []),
      fetch(`${API_URL}/feedbacks`, { headers: h }).then(r => r.json()).catch(() => []),
    ]).then(([stores, users, regs, popular, feedbacks]) => {
      const regList = regs.registrations || [];
      const fbList = Array.isArray(feedbacks) ? feedbacks : [];

      // Per-store order count from feedbacks (rough proxy)
      const storeOrderMap = {};
      fbList.forEach(f => {
        const sid = f.orderItem?.order?.storeId;
        if (sid) storeOrderMap[sid] = (storeOrderMap[sid] || 0) + 1;
      });

      const storesWithOrders = (Array.isArray(stores) ? stores : [])
        .map(s => ({ ...s, orderCount: storeOrderMap[s.storeId] || 0 }))
        .sort((a, b) => b.orderCount - a.orderCount);

      // Avg rating per store
      const storeRatingMap = {};
      const storeRatingCount = {};
      fbList.forEach(f => {
        const sid = f.orderItem?.order?.storeId;
        if (sid) {
          storeRatingMap[sid] = (storeRatingMap[sid] || 0) + f.rating;
          storeRatingCount[sid] = (storeRatingCount[sid] || 0) + 1;
        }
      });

      // Role breakdown
      const roleMap = {};
      (Array.isArray(users) ? users : []).forEach(u => {
        const role = u.role?.roleName || 'Unknown';
        roleMap[role] = (roleMap[role] || 0) + 1;
      });

      const maxRole = Math.max(...Object.values(roleMap), 1);

      setData({
        storesWithOrders,
        popular: Array.isArray(popular) ? popular.slice(0, 5) : [],
        roleMap,
        maxRole,
        totalFeedbacks: fbList.length,
        avgRatingOverall: fbList.length
          ? (fbList.reduce((s, f) => s + f.rating, 0) / fbList.length).toFixed(1)
          : '—',
        totalRegistrations: regList.length,
        completed: regList.filter(r => r.status === 'ADMIN_COMPLETED').length,
      });
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout user={user} onLogout={onLogout} title="Analytics"><div className="admin-loading">Loading…</div></AdminLayout>;

  const maxOrders = Math.max(...(data?.storesWithOrders || []).map(s => s.orderCount), 1);

  return (
    <AdminLayout user={user} onLogout={onLogout} title="Analytics">
      {/* Top stat row */}
      <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 28 }}>
        {[
          {
            label: 'Total Feedback', value: data.totalFeedbacks, bg: '#FEF3C7',
            icon: (
              <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#F59E0B" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            ),
          },
          {
            label: 'Avg Platform Rating', value: data.avgRatingOverall, bg: '#DBEAFE',
            icon: (
              <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#2563EB" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            ),
          },
          {
            label: 'Total Registrations', value: data.totalRegistrations, bg: '#EDE9FE',
            icon: (
              <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#7C3AED" strokeWidth="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                <rect x="9" y="3" width="6" height="4" rx="1"/>
                <path d="M9 12h6M9 16h4"/>
              </svg>
            ),
          },
          {
            label: 'Vendors Created', value: data.completed, bg: '#D1FAE5',
            icon: (
              <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#10B981" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            ),
          },
        ].map(c => (
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

      <div className="analytics-grid">
        {/* Store activity bar chart */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Store Activity (by feedback count)</span>
          </div>
          <div className="analytics-bar-chart">
            {data.storesWithOrders.slice(0, 8).map(s => (
              <div key={s.storeId}>
                <div className="analytics-bar-label">
                  <span>{s.storeName}</span>
                  <span style={{ color: '#64748B' }}>{s.orderCount}</span>
                </div>
                <div className="analytics-bar-track">
                  <div
                    className="analytics-bar-fill"
                    style={{ width: `${Math.round((s.orderCount / maxOrders) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User role breakdown */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Users by Role</span>
          </div>
          <div style={{ padding: '16px 24px' }}>
            {Object.entries(data.roleMap).map(([role, count]) => (
              <div key={role} style={{ marginBottom: 16 }}>
                <div className="analytics-bar-label">
                  <span>{role}</span><span style={{ color: '#64748B' }}>{count}</span>
                </div>
                <div className="analytics-bar-track">
                  <div
                    className="analytics-bar-fill"
                    style={{
                      width: `${Math.round((count / data.maxRole) * 100)}%`,
                      background: { Admin: '#EF4444', Manager: '#3B82F6', Vendor: '#F59E0B', Customer: '#10B981' }[role] || '#94A3B8',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top products */}
      {data.popular.length > 0 && (
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Top Popular Products</span>
          </div>
          <div style={{ padding: '8px 24px 16px' }}>
            {data.popular.map((p, i) => {
              const rankClass = i === 0 ? 'analytics-rank-gold' : i === 1 ? 'analytics-rank-silver' : i === 2 ? 'analytics-rank-bronze' : '';
              return (
                <div key={p.productId} className="analytics-list-item">
                  <div className={`analytics-rank ${rankClass}`}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: '#94A3B8' }}>{p.store?.storeName}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: '#2563EB' }}>×{p.totalQuantity}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminAnalytics;
