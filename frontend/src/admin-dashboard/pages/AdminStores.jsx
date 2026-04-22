import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import '../styles/Admin.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const AdminStores = ({ user, onLogout }) => {
  const [stores, setStores] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchStores = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/stores`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      setStores(data);
      setFiltered(data);
    } catch { showToast('error', 'Failed to load stores'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStores(); }, []); // eslint-disable-line

  useEffect(() => {
    if (!search.trim()) { setFiltered(stores); return; }
    const q = search.toLowerCase();
    setFiltered(stores.filter(s =>
      s.storeName?.toLowerCase().includes(q) || s.location?.toLowerCase().includes(q)
    ));
  }, [search, stores]);

  const toggleOpen = async (store) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/stores/${store.storeId}/toggle`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      showToast('success', `Store ${store.isOpen ? 'closed' : 'opened'} successfully`);
      fetchStores();
    } catch { showToast('error', 'Failed to toggle store status'); }
  };

  const deleteStore = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/stores/${deleteTarget.storeId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      showToast('success', 'Store deleted successfully');
      setDeleteTarget(null);
      fetchStores();
    } catch { showToast('error', 'Failed to delete store'); }
  };

  return (
    <AdminLayout user={user} onLogout={onLogout} title="Store Management">
      <div className="admin-toolbar">
        <div className="admin-search">
          <svg className="admin-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            placeholder="Search by name or location…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <span style={{ marginLeft: 'auto', fontSize: 13, color: '#64748B' }}>
          {filtered.length} store{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrapper">
          {loading ? <div className="admin-loading">Loading…</div> : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th><th>Store Name</th><th>Location</th>
                  <th>Vendor</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: '#94A3B8', padding: '40px' }}>No stores found</td></tr>
                ) : filtered.map((s, i) => (
                  <tr key={s.storeId}>
                    <td style={{ color: '#94A3B8', fontSize: 12 }}>{i + 1}</td>
                    <td style={{ fontWeight: 700 }}>{s.storeName}</td>
                    <td style={{ color: '#64748B' }}>{s.location}</td>
                    <td style={{ color: '#64748B' }}>{s.manager?.userName || '—'}</td>
                    <td>
                      <span className={`badge ${s.isOpen ? 'badge-green' : 'badge-red'}`}>
                        {s.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </td>
                    <td style={{ display: 'flex', gap: 8 }}>
                      <button
                        className={`admin-btn admin-btn-sm ${s.isOpen ? 'admin-btn-danger' : 'admin-btn-success'}`}
                        onClick={() => toggleOpen(s)}
                      >
                        {s.isOpen ? 'Close' : 'Open'}
                      </button>
                      <button
                        className="admin-btn admin-btn-sm admin-btn-ghost"
                        onClick={() => setDeleteTarget(s)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="admin-modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="admin-modal-box" onClick={e => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setDeleteTarget(null)}>✕</button>
            <h3 className="admin-modal-title">Delete Store</h3>
            <p style={{ color: '#64748B', marginBottom: 24 }}>
              This will permanently delete <strong>{deleteTarget.storeName}</strong> and all its data. This cannot be undone.
            </p>
            <div className="admin-modal-actions">
              <button className="admin-btn admin-btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="admin-btn admin-btn-danger" onClick={deleteStore}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`admin-toast admin-toast-${toast.type}`}>{toast.msg}</div>}
    </AdminLayout>
  );
};

export default AdminStores;
