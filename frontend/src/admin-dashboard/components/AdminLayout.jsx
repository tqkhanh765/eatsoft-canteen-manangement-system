import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/Admin.css';

const NAV = [
  {
    section: 'Overview',
    items: [
      {
        label: 'Dashboard',
        path: '/admin/dashboard',
        icon: (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
          </svg>
        ),
      },
    ],
  },
  {
    section: 'Management',
    items: [
      {
        label: 'Stall Registrations',
        path: '/admin/registrations',
        icon: (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="1"/>
            <path d="M9 12h6M9 16h4"/>
          </svg>
        ),
      },
      {
        label: 'User Management',
        path: '/admin/users',
        icon: (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
          </svg>
        ),
      },
      {
        label: 'Store Management',
        path: '/admin/stores',
        icon: (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        ),
      },
      {
        label: 'Announcements',
        path: '/admin/announcements',
        icon: (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
        ),
      },
    ],
  },
  {
    section: 'Insights',
    items: [
      {
        label: 'Analytics',
        path: '/admin/analytics',
        icon: (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        ),
      },
    ],
  },
];

const AdminLayout = ({ user, onLogout, children, title }) => {
  const navigate = useNavigate();

  const initials = user?.userName
    ? user.userName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'AD';

  return (
    <div className="admin-layout">
      {/* ── Sidebar ───────────────────────── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <img src="/eatsoft-logo.png" alt="EatSoft" />
          <div>
            <div className="admin-sidebar-logo-text">EatSoft</div>
            <div className="admin-sidebar-logo-sub">Admin Portal</div>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          {NAV.map(group => (
            <div key={group.section}>
              <div className="admin-nav-section-label">{group.section}</div>
              {group.items.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `admin-nav-item${isActive ? ' active' : ''}`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">{initials}</div>
            <div>
              <div className="admin-user-name">{user?.userName || 'Admin'}</div>
              <div className="admin-user-role">Administrator</div>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={onLogout}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────── */}
      <div className="admin-main">
        <header className="admin-topbar">
          <h1 className="admin-topbar-title">{title}</h1>
        </header>
        <main className="admin-page">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
