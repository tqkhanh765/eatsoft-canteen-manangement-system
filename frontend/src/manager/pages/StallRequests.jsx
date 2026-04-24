import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import '../styles/StallManagement.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const formatDate = (isoStr) => {
  if (!isoStr) return '—';
  const d = new Date(isoStr);
  return `${String(d.getDate()).padStart(2, '0')} - ${String(d.getMonth() + 1).padStart(2, '0')} - ${d.getFullYear()}`;
};

// ── Sub-component: Registration Detail Modal ─────────────────────────────────
const RegistrationModal = ({ reg, onClose, onApprove, onReject, loading }) => {
  const [rejectNote, setRejectNote] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  if (!reg) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        <h2 className="modal-title">Registration Detail</h2>

        <div className="modal-field-grid">
          <div className="modal-field">
            <span className="modal-label">Full Name</span>
            <span className="modal-value">{reg.fullName}</span>
          </div>
          <div className="modal-field">
            <span className="modal-label">Email</span>
            <span className="modal-value">{reg.email}</span>
          </div>
          <div className="modal-field">
            <span className="modal-label">Phone</span>
            <span className="modal-value">{reg.phoneNumber}</span>
          </div>
          <div className="modal-field">
            <span className="modal-label">Stall Name</span>
            <span className="modal-value">{reg.stallName}</span>
          </div>
          <div className="modal-field modal-field--full">
            <span className="modal-label">Description</span>
            <span className="modal-value modal-value--muted">{reg.description || '—'}</span>
          </div>
          <div className="modal-field">
            <span className="modal-label">Submitted</span>
            <span className="modal-value">{formatDate(reg.createdAt)}</span>
          </div>
        </div>

        {!showRejectInput ? (
          <div className="modal-actions">
            <button
              className="btn-approve"
              disabled={loading}
              onClick={() => onApprove(reg.id)}
            >
              {loading ? 'Processing…' : 'Approve'}
            </button>
            <button
              className="btn-reject"
              disabled={loading}
              onClick={() => setShowRejectInput(true)}
            >
              Reject
            </button>
          </div>
        ) : (
          <div className="reject-note-section">
            <label className="modal-label">Rejection reason (will be emailed)</label>
            <textarea
              className="reject-textarea"
              rows={3}
              placeholder="Provide a reason for rejection…"
              value={rejectNote}
              onChange={e => setRejectNote(e.target.value)}
            />
            <div className="modal-actions">
              <button
                className="btn-reject"
                disabled={loading}
                onClick={() => onReject(reg.id, rejectNote)}
              >
                {loading ? 'Sending…' : 'Confirm Reject'}
              </button>
              <button
                className="btn-secondary"
                onClick={() => setShowRejectInput(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const StallRequests = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedReg, setSelectedReg] = useState(null);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg }

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/stall-registrations?status=MANAGER_PENDING`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      setRegistrations(data.registrations || []);
    } catch {
      showToast('error', 'Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRegistrations(); }, []); // eslint-disable-line

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/stall-registrations/${id}/manager-review`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'approve' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Approve failed');
      showToast('success', 'Registration approved successfully');
      setSelectedReg(null);
      await fetchRegistrations();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id, note) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/stall-registrations/${id}/manager-review`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'reject', note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reject failed');
      showToast('success', 'Registration rejected and email sent');
      setSelectedReg(null);
      await fetchRegistrations();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <Navbar onLoginClick={() => {}} user={user} onLogout={onLogout} />
      <main className="stall-management-page">
        <div className="container">
          <h1 className="page-title">Stall Management</h1>

          <button className="back-btn" style={{ marginBottom: 24 }} onClick={() => navigate('/manager-stalls')}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>

          <h2 className="requests-section-title">New Stall Requests</h2>

          {loading ? (
            <div className="stall-detail-loading">Loading…</div>
          ) : registrations.length === 0 ? (
            <div className="no-feedback-msg">No pending registrations at the moment.</div>
          ) : (
            <div className="requests-list">
              {registrations.map((reg) => (
                <div key={reg.id} className="request-row">
                  {/* Logo placeholder */}
                  <div className="request-logo-box">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="#9CA3AF">
                      <path d="M12 2C6.48 2 2 6.48 2 12s10 10 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                      <path d="M4 6h16v2H4zm0 10h16v2H4z" />
                    </svg>
                  </div>

                  {/* Info */}
                  <div className="request-info">
                    <div className="request-stall-name">{reg.stallName}</div>
                    <div className="request-meta">
                      <span>{reg.fullName}</span>
                      <span className="request-meta-sep">·</span>
                      <span>{reg.email}</span>
                      <span className="request-meta-sep">·</span>
                      <span>Submitted: {formatDate(reg.createdAt)}</span>
                    </div>
                    <div className="request-btn-row">
                      <button
                        className="req-btn req-btn--view"
                        onClick={() => setSelectedReg(reg)}
                      >
                        View
                      </button>
                      <button
                        className="req-btn req-btn--approve"
                        onClick={() => handleApprove(reg.id)}
                        disabled={actionLoading}
                      >
                        Approve
                      </button>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="request-status">
                    <span className="status-badge status-badge--pending">Status: Pending</span>
                  </div>

                  {/* Reject icon */}
                  <button
                    className="req-trash-btn"
                    title="Reject"
                    onClick={() => { setSelectedReg(reg); }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4h6v2" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Detail Modal */}
      <RegistrationModal
        reg={selectedReg}
        onClose={() => setSelectedReg(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        loading={actionLoading}
      />

      {/* Toast */}
      {toast && (
        <div className={`toast toast--${toast.type}`}>
          {toast.msg}
        </div>
      )}
    </>
  );
};

export default StallRequests;
