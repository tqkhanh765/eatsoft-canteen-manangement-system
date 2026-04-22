import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import '../styles/Admin.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const TYPE_OPTIONS = ['all', 'vendors', 'customers'];

const typeLabel = (t) =>
  ({ all: 'All', vendors: 'Vendors', customers: 'Customers' }[t] || t);

const typeBadge = (t) =>
  ({ all: 'badge-blue', vendors: 'badge-yellow', customers: 'badge-green' }[t] || 'badge-gray');

const AdminAnnouncements = ({ user, onLogout }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', type: 'all' });

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/announcements`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch { showToast('error', 'Failed to load announcements'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAnnouncements(); }, []); // eslint-disable-line

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/announcements`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          content: form.content,
          type: form.type,
          createdBy: user?.userId,
        }),
      });
      if (!res.ok) throw new Error();
      showToast('success', 'Announcement created');
      setForm({ title: '', content: '', type: 'all' });
      setShowForm(false);
      fetchAnnouncements();
    } catch { showToast('error', 'Failed to create announcement'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/announcements/${deleteTarget.announcementId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      showToast('success', 'Announcement deleted');
      setDeleteTarget(null);
      fetchAnnouncements();
    } catch { showToast('error', 'Failed to delete'); }
  };

  return (
    <AdminLayout user={user} onLogout={onLogout} title="Announcements">
      <div className="admin-toolbar">
        <span style={{ fontSize: 13, color: '#64748B' }}>
          {announcements.length} announcement{announcements.length !== 1 ? 's' : ''}
        </span>
        <button
          className="admin-btn admin-btn-primary"
          style={{ marginLeft: 'auto' }}
          onClick={() => setShowForm(true)}
        >
          + New Announcement
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrapper">
          {loading ? <div className="admin-loading">Loading…</div> : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th><th>Audience</th><th>Created</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {announcements.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', color: '#94A3B8', padding: '40px' }}>No announcements yet</td></tr>
                ) : announcements.map(a => (
                  <tr key={a.announcementId}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{a.title}</div>
                      <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2, maxWidth: 340, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {a.content}
                      </div>
                    </td>
                    <td><span className={`badge ${typeBadge(a.type)}`}>{typeLabel(a.type)}</span></td>
                    <td style={{ color: '#64748B' }}>{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="admin-btn admin-btn-sm admin-btn-danger"
                        onClick={() => setDeleteTarget(a)}
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

      {/* Create Modal */}
      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin-modal-box" onClick={e => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setShowForm(false)}>✕</button>
            <h3 className="admin-modal-title">New Announcement</h3>
            <form onSubmit={handleCreate}>
              <div className="admin-form-group">
                <label className="admin-form-label">Title</label>
                <input
                  className="admin-form-input"
                  placeholder="Announcement title…"
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Content</label>
                <textarea
                  className="admin-form-textarea"
                  placeholder="Announcement body…"
                  value={form.content}
                  onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Target Audience</label>
                <select
                  className="admin-form-select"
                  value={form.type}
                  onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                >
                  {TYPE_OPTIONS.map(t => (
                    <option key={t} value={t}>{typeLabel(t)}</option>
                  ))}
                </select>
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                  {saving ? 'Publishing…' : 'Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="admin-modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="admin-modal-box" onClick={e => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setDeleteTarget(null)}>✕</button>
            <h3 className="admin-modal-title">Delete Announcement</h3>
            <p style={{ color: '#64748B', marginBottom: 24 }}>
              Delete <strong>"{deleteTarget.title}"</strong>? This cannot be undone.
            </p>
            <div className="admin-modal-actions">
              <button className="admin-btn admin-btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="admin-btn admin-btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`admin-toast admin-toast-${toast.type}`}>{toast.msg}</div>}
    </AdminLayout>
  );
};

export default AdminAnnouncements;
