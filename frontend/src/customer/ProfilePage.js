import React, { useState } from 'react';
import './ProfilePage.css';

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Mock Data
    const userData = {
        name: "Giao Vo",
        id: "ITDSIU23036",
        email: "itdsiu23036@student.hcmiu.edu.vn",
        phone: "+84 901 234 567"
    };

    const orders = [
        { id: "EAT-2026-001", date: "Apr 12, 2026", outlet: "Big U", total: "50,000 VND", status: "Completed", items: ["Chicken Rice x1", "Iced Tea x1"] },
        { id: "EAT-2026-002", date: "Apr 15, 2026", outlet: "Gạo và Nồi", total: "30,000 VND", status: "Processing", items: ["Chicken Banh Mi x1"] }
    ];

    return (
        <div className="profile-container">
            <h1 className="profile-header">Settings</h1>

            <div className="tab-bar">
                <button 
                    className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => {setActiveTab('profile'); setSelectedOrder(null);}}>
                    Personal Information
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => {setActiveTab('history'); setSelectedOrder(null);}}>
                    Order History
                </button>
            </div>

            <div className="content-box">
                {/* 1. Personal Info Tab */}
                {activeTab === 'profile' && (
                    <div className="fade-in">
                        <h3 className="section-title">Personal Details</h3>
                        <div className="input-group">
                            <label>Full Name</label>
                            <input type="text" className="input-field" defaultValue={userData.name} />
                        </div>
                        <div className="input-group">
                            <label>Student ID / Account ID</label>
                            <input type="text" className="input-field" value={userData.id} disabled />
                        </div>
                        <div className="input-group">
                            <label>Email Address</label>
                            <input type="email" className="input-field" value={userData.email} disabled />
                        </div>
                        <button className="primary-btn">Update Profile</button>
                    </div>
                )}

                {/* 2. Order History List */}
                {activeTab === 'history' && !selectedOrder && (
                    <div className="fade-in">
                        <h3 className="section-title">Your Orders</h3>
                        <table className="order-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                    <th>Outlet</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id}>
                                        <td><strong>{order.id}</strong></td>
                                        <td>{order.date}</td>
                                        <td>{order.outlet}</td>
                                        <td>
                                            <span className={order.status === 'Completed' ? 'status-completed' : 'status-processing'}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="view-detail-link" onClick={() => setSelectedOrder(order)}>View Detail</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* 3. Order Detail View */}
                {selectedOrder && (
                    <div className="fade-in">
                        <p className="view-detail-link" onClick={() => setSelectedOrder(null)}>← Back to History</p>
                        <h3 className="section-title" style={{marginTop: '20px'}}>Order Summary: {selectedOrder.id}</h3>
                        <div style={{background: '#fcfcfc', padding: '30px', borderRadius: '15px', border: '1px dashed #DDD'}}>
                            <p><strong>Vendor:</strong> {selectedOrder.outlet}</p>
                            <p><strong>Order Date:</strong> {selectedOrder.date}</p>
                            <hr style={{margin: '20px 0', border: '0.5px solid #EEE'}} />
                            <h4>Order Items:</h4>
                            <ul style={{listStyle: 'none', padding: 0}}>
                                {selectedOrder.items.map((item, idx) => (
                                    <li key={idx} style={{padding: '8px 0', borderBottom: '1px solid #F1F1F1'}}>{item}</li>
                                ))}
                            </ul>
                            <h3 style={{textAlign: 'right', color: 'var(--primary-orange)'}}>Total: {selectedOrder.total}</h3>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;