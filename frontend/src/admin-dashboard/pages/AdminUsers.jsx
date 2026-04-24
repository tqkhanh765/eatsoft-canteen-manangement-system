import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import '../styles/Admin.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const ROLE_COLORS = {
  Admin:    'badge-red',
  Manager:  'badge-blue',
  Vendor:   'badge-yellow',
  Customer: 'badge-green',
};

const AdminUsers = ({ user, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [toast, setToast] = useState(null);
  const [actionUser, setActionUser] = useState(null); // for status toggle confirm

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data);
      setFiltered(data);
    } catch { showToast('error', 'Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []); // eslint-disable-line

  useEffect(() => {
    let list = users;
    if (roleFilter !== 'All') list = list.filter(u => u.role?.roleName === roleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(u =>
        u.userName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
      );
    }
    setFiltered(list);
  }, [search, roleFilter, users]);

  const toggleStatus = async (u) => {
    const newStatus = u.status === 'Active' ? 'Inactive' : 'Active';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/users/${u.userId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      showToast('success', `User ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully`);
      fetchUsers();
    } catch { showToast('error', 'Failed to update user status'); }
    setActionUser(null);
  };

  return (
    <AdminLayout user={user} onLogout={onLogout} title="User Management">
      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-search">
          <svg className="admin-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="admin-filter-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="All">All Roles</option>
          <option>Admin</option>
          <option>Manager</option>
          <option>Vendor</option>
          <option>Customer</option>
        </select>
        <span style={{ marginLeft: 'auto', fontSize: 13, color: '#64748B' }}>
          {filtered.length} user{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrapper">
          {loading ? <div className="admin-loading">Loading…</div> : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th><th>Name</th><th>Email</th><th>Phone</th>
                  <th>Role</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', color: '#94A3B8', padding: '40px' }}>No users found</td></tr>
                ) : filtered.map((u, i) => (
                  <tr key={u.userId}>
                    <td style={{ color: '#94A3B8', fontSize: 12 }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{u.userName}</td>
                    <td style={{ color: '#64748B' }}>{u.email}</td>
                    <td style={{ color: '#64748B' }}>{u.phone}</td>
                    <td>
                      <span className={`badge ${ROLE_COLORS[u.role?.roleName] || 'badge-gray'}`}>
                        {u.role?.roleName || '—'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${u.status === 'Active' ? 'badge-green' : 'badge-red'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`admin-btn admin-btn-sm ${u.status === 'Active' ? 'admin-btn-danger' : 'admin-btn-success'}`}
                        onClick={() => setActionUser(u)}
                      >
                        {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Confirm modal */}
      {actionUser && (
        <div className="admin-modal-overlay" onClick={() => setActionUser(null)}>
          <div className="admin-modal-box" onClick={e => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setActionUser(null)}>✕</button>
            <h3 className="admin-modal-title">Confirm Action</h3>
            <p style={{ color: '#64748B', marginBottom: 24 }}>
              Are you sure you want to <strong>{actionUser.status === 'Active' ? 'deactivate' : 'activate'}</strong> user <strong>{actionUser.userName}</strong>?
            </p>
            <div className="admin-modal-actions">
              <button className="admin-btn admin-btn-ghost" onClick={() => setActionUser(null)}>Cancel</button>
              <button
                className={`admin-btn ${actionUser.status === 'Active' ? 'admin-btn-danger' : 'admin-btn-success'}`}
                onClick={() => toggleStatus(actionUser)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`admin-toast admin-toast-${toast.type}`}>{toast.msg}</div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
