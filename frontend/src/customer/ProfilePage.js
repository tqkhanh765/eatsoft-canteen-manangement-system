import React, { useState } from 'react';
import './ProfilePage.css';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('info'); // 'info' hoặc 'history'
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock data
  const userData = {
    firstName: "Quoc Khanh",
    lastName: "Truong",
    studentId: "ITCSIU23015",
    phone: "+84 38-485-xxxx",
    email: "ITCSIU23015@student.hcmiu.edu.vn",
    country: "Vietnam",
    university: "International University"
  };

  const orders = [
    { id: '#001', items: 'Big U, Com Viet, +1 more', count: 5, time: '12:00, 25-03-2026', total: '350.000VND', status: 'In progress' },
    { id: '#001', items: 'Big U, Com Viet, +1 more', count: 5, time: '12:00, 25-03-2026', total: '350.000VND', status: 'In progress' },
    { id: '#001', items: 'Big U, Com Viet, +1 more', count: 5, time: '12:00, 25-03-2026', total: '350.000VND', status: 'In progress' },
  ];

  return (
    <div className="profile-container">
      <aside className="sidebar">
        <div className="user-avatar-section">
          <div className="avatar-circle">
            <i className="fas fa-user"></i>
          </div>
          <h3>Nguyen Van A</h3>
          <p>ID: 001</p>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={activeTab === 'info' ? 'active' : ''} 
            onClick={() => {setActiveTab('info'); setSelectedOrder(null);}}
          >
            <i className="fas fa-user-circle"></i> PERSONAL INFORMATION
          </button>
          <button 
            className={activeTab === 'history' ? 'active' : ''} 
            onClick={() => setActiveTab('history')}
          >
            <i className="fas fa-history"></i> ORDER HISTORY
          </button>
        </nav>
      </aside>

      <main className="profile-content">
        {selectedOrder ? (
          /* ORDER DETAIL */
          <div className="order-detail">
            <button className="back-btn" onClick={() => setSelectedOrder(null)}>
              ← Order {selectedOrder.id}
            </button>
            <p className="ready-time">Order will be ready in about 5 minutes</p>
            
            <div className="order-stepper">
              <div className="step completed">Order placed</div>
              <div className="step completed">Order accepted</div>
              <div className="step active">Preparing dishes</div>
              <div className="step pending">Order completed</div>
            </div>

            <div className="detail-grid">
              <div className="items-list">
                <h3>Items ordered</h3>
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="order-item-card">
                    <div className="item-info">
                      <strong>Big U</strong>
                      <p>Cơm gà xé Hội An</p>
                      <span>Không ớt, ít cơm</span>
                    </div>
                    <div className="item-qty">
                      <button>-</button> <span>2</span> <button>+</button>
                    </div>
                    <div className="item-price">70.000VND</div>
                    <div className="item-actions">
                      <button className="edit-icon">✎</button>
                      <button className="delete-icon">🗑</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* ✅ UPDATED CHECKOUT INFO */}
              <div className="checkout-info">
                <h3>Checkout Info</h3>
                <div className="info-table">
                  <div className="info-row-detail">
                    <span className="label">Location:</span>
                    <span className="value">IU Campus, Quarter 6, Linh Trung Ward</span>
                  </div>
                  <div className="info-row-detail">
                    <span className="label">Room:</span>
                    <span className="value">A1.409</span>
                  </div>
                  <div className="info-row-detail">
                    <span className="label">Name:</span>
                    <span className="value">Nguyen Van A</span>
                  </div>
                  <div className="info-row-detail">
                    <span className="label">Phone:</span>
                    <span className="value">(+84) 901 234 567</span>
                  </div>
                  <div className="info-row-detail">
                    <span className="label">Pickup options:</span>
                    <span className="value">Delivery</span>
                  </div>
                  <div className="info-row-detail">
                    <span className="label">Payment method:</span>
                    <span className="value">Momo</span>
                  </div>
                  
                  <hr className="detail-divider" />
                  
                  <div className="info-row-detail">
                    <span className="label">Sub Total:</span>
                    <span className="value">350.000VND</span>
                  </div>
                  <div className="info-row-detail">
                    <span className="label">Discount:</span>
                    <span className="value">-20.000VND</span>
                  </div>
                  <div className="info-row-detail">
                    <span className="label">Delivery fee:</span>
                    <span className="value">10.000VND</span>
                  </div>
                  <div className="info-row-detail grand-total">
                    <span className="label">Grand total:</span>
                    <span className="value">340.000VND</span>
                  </div>
                </div>
                
                <button className="feedback-btn">Give feedback</button>
                <p className="contact-seller-text">
                  Meet any problems? <a href="#">Contact seller</a>
                </p>
              </div>

            </div>
          </div>
        ) : activeTab === 'info' ? (
          /* PERSONAL INFO */
          <div className="personal-info">
            <h2>Personal Information</h2>
            <div className="info-card">
              <div className="input-group-row">
                <div className="input-field">
                  <label>First Name</label>
                  <input type="text" defaultValue={userData.firstName} readOnly />
                </div>
                <div className="input-field">
                  <label>Last Name</label>
                  <input type="text" defaultValue={userData.lastName} readOnly />
                </div>
              </div>
              <div className="input-group-row">
                <div className="input-field">
                  <label>Student ID</label>
                  <input type="text" defaultValue={userData.studentId} readOnly />
                </div>
                <div className="input-field">
                  <label>Phone Number</label>
                  <input type="text" defaultValue={userData.phone} readOnly />
                </div>
              </div>
              <div className="input-field">
                <label>Email Address</label>
                <input type="email" defaultValue={userData.email} readOnly />
              </div>
              <button className="edit-btn">EDIT</button>
            </div>
          </div>
        ) : (
          /* ORDER HISTORY */
          <div className="order-history">
            <h2>Order History</h2>
            <div className="history-list">
              {orders.map((order, index) => (
                <div key={index} className="history-item">
                  <div className="item-main">
                    <p className="item-summary">🛒 {order.items}</p>
                    <h4 className="order-id">Order {order.id}</h4>
                    <span>{order.count} items | Created at: {order.time}</span>
                  </div>
                  <div className="item-price">{order.total}</div>
                  <div className="item-status">
                    Status: <span className="status-tag">{order.status}</span>
                  </div>
                  <button className="view-btn" onClick={() => setSelectedOrder(order)}>👁</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;