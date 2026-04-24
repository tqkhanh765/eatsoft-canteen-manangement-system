import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminStallRegistration from '../components/AdminStallRegistration';
import '../styles/Admin.css';

const AdminRegistrations = ({ user, onLogout }) => (
  <AdminLayout user={user} onLogout={onLogout} title="Stall Registrations">
    <AdminStallRegistration />
  </AdminLayout>
);

export default AdminRegistrations;
