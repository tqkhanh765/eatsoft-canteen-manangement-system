import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import '../styles/StallManagement.css';

const StallRequests = ({ user, onLogout }) => {
  const handleLoginClick = () => {};

  return (
    <>
      <Navbar onLoginClick={handleLoginClick} user={user} onLogout={onLogout} />
      <main className="vendor-form-page">
        <div className="container">
          <h1 className="page-title">Stall Management</h1>
          
          <div className="vendor-form-container">
            <h2 className="form-title">Vendor Form</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Stall name</label>
                <p>Starbucks</p>
              </div>
              <div className="form-group">
                <label>Stall number</label>
                <p>03</p>
              </div>
              <div className="form-group full-width">
                <label>Products to be sold</label>
                <p>Drinks</p>
              </div>
              <div className="form-group full-width">
                <label>Description</label>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque 
                  faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi 
                  pretium tellus duis convallis. Tempus leo eu aenean sed diam urna 
                  tempor. Pulvinar vivamus fringilla lacus nec metus bibendum 
                  egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. 
                  Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora 
                  torquent per conubia nostra inceptos himenaeos.
                </p>
              </div>
            </div>

            <div className="logo-section">
              <label className="logo-label">Logo</label>
              <img src="/stalls/starbucks.png" alt="Logo" className="logo-preview" />
            </div>

            <div className="form-actions">
              <button className="btn-reject">Reject</button>
              <button className="btn-approve">Approve</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default StallRequests;
