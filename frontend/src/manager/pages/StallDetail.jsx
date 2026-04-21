import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import StallOverview from '../components/stalls/StallOverview';
import StallFeedback from '../components/stalls/StallFeedback';
import '../styles/StallManagement.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const StallDetail = ({ user, onLogout }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stall, setStall] = useState(null);
  const [products, setProducts] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // Fetch store details + products (with category) in parallel
        const [storeRes, productsRes, feedbackRes] = await Promise.all([
          fetch(`${API_URL}/stores/${id}`, { headers }),
          fetch(`${API_URL}/products?storeId=${id}`, { headers }),
          fetch(`${API_URL}/feedbacks`, { headers }),
        ]);

        if (!storeRes.ok) throw new Error('Failed to fetch store details');
        const storeData = await storeRes.json();

        setStall({
          id: storeData.storeId,
          name: storeData.storeName,
          location: storeData.location,
          isOpen: storeData.isOpen,
          description: storeData.description,
          logo: storeData.logo || '/stalls/bigu.png',
          sell: storeData.category || 'Food',
          stallNumber: storeData.stallNumber || storeData.storeId,
        });

        // Products from dedicated endpoint – includes category
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(productsData);
        }

        // Feedbacks filtered by store
        if (feedbackRes.ok) {
          const allFeedbacks = await feedbackRes.json();
          setFeedbacks(
            allFeedbacks.filter(f => f.orderItem?.order?.storeId === Number(id))
          );
        }
      } catch (err) {
        console.error('StallDetail fetch error:', err);
        // Fallback mock so the UI still renders
        setStall({
          id,
          name: 'BIG U',
          logo: '/stalls/bigu.png',
          sell: 'Food',
          stallNumber: '01',
          description:
            'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.',
        });
        setProducts([]);
        setFeedbacks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar onLoginClick={() => {}} user={user} onLogout={onLogout} />
        <main className="stall-detail-page">
          <div className="stall-detail-loading">Loading…</div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar onLoginClick={() => {}} user={user} onLogout={onLogout} />
      <main className="stall-detail-page">
        <div className="stall-detail-container">
          <h1 className="page-title">Stall Management</h1>

          <button className="back-btn" onClick={() => navigate('/manager-stalls')}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>

          <div className="stall-logo-wrapper">
            <img src={stall?.logo} alt={stall?.name} className="stall-detail-logo-img" />
          </div>

          <div className="stall-detail-tabs">
            <button
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`tab-btn ${activeTab === 'feedback' ? 'active' : ''}`}
              onClick={() => setActiveTab('feedback')}
            >
              Feedback
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'overview' ? (
              <StallOverview stall={stall} products={products} />
            ) : (
              <StallFeedback feedbacks={feedbacks} />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default StallDetail;