import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const API_BASE_URL = 'http://localhost:8080/api';
const BACKEND_URL = 'http://localhost:8080';

// Helper to get full image URL
const getFullImageUrl = (imageURL) => {
  if (!imageURL) return 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=200&h=200&fit=crop';
  if (imageURL.startsWith('http')) return imageURL;
  if (imageURL.startsWith('/')) return `${BACKEND_URL}${imageURL}`;
  return imageURL;
};

const STALLS = [
  { id: 1, name: 'Big U',          bg: '#fff',     style: 'bigu' },
  { id: 2, name: 'Cơm Việt',       bg: '#fff',     style: 'comviet' },
  { id: 3, name: 'H & D Food Court', bg: '#C53030', style: 'hd' },
  { id: 4, name: 'Gạo & Nồi',     bg: '#D4A017',  style: 'gaonoi' },
  { id: 5, name: 'Coffee Story',   bg: '#fff',     style: 'coffeestory' },
  { id: 6, name: 'The Zero Coffee', bg: '#1A1A2E', style: 'zerocoffee' },
];

/* ─── Sub-components ───────────────────────────────────────── */
const PopularDishCard = ({ dish, onClick }) => (
  <div className="category-card" id={`dish-${dish.productId}`} onClick={onClick}>
    <div className="category-img-wrap" style={{ background: '#FFF7ED' }}>
      <img src={getFullImageUrl(dish.imageURL)} alt={dish.name} loading="lazy" />
    </div>
    <p className="category-name">{dish.name}</p>
    <p className="category-count">{dish.store?.storeName || 'Canteen'}</p>
  </div>
);

const StallLogo = ({ logoURL, name }) => {
  if (logoURL) {
    return (
      <div className="stall-logo custom">
        <img src={logoURL} alt={name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
    );
  }

  // Fallback map for legacy/mocked styles if logoURL is missing
  const style = name.toLowerCase().replace(/\s/g, '');
  const map = {
    bigu:        <div className="stall-logo bigu"><span className="bigu-icon">🍽</span><p>BIG U</p></div>,
    comviet:     <div className="stall-logo comviet"><p>CƠM VIỆT</p></div>,
    hdfoodcourt: <div className="stall-logo hd" style={{ background: '#C53030' }}><p>H &amp; D</p><small>FOOD COURT</small></div>,
    gaonoi:      <div className="stall-logo gaonoi" style={{ background: '#D4A017' }}><p>Gạo &amp; Nồi</p></div>,
    coffeestory: <div className="stall-logo coffeestory"><p>CAFFÈ</p><p className="cs-sub">STORY</p><small>EST. 2014</small></div>,
    thezerocoffee:  <div className="stall-logo zerocoffee" style={{ background: '#1A1A2E' }}><p>THE ZERO COFFEE</p></div>,
  };
  return map[style] || <div className="stall-logo"><p>{name}</p></div>;
};

const StallCard = ({ stall }) => {
  const navigate = useNavigate();

  return (
    <div className="stall-card" id={`stall-${stall.storeId}`}>
      <div className="stall-logo-wrap">
        <StallLogo logoURL={stall.logoURL} name={stall.storeName} />
      </div>
      <div className="stall-card-footer">
        <p className="stall-name">{stall.storeName}</p>
        <button
          className="stall-btn"
          id={`stall-visit-${stall.storeId}`}
          type="button"
          onClick={() => {
            navigate(`/stalls-menu/${stall.storeId}`);
          }}
        >
          Visit
        </button>
      </div>
    </div>
  );
};

/* ─── HomePage ─────────────────────────────────────────────── */
const HomePage = ({ onVisitStall }) => {
  const navigate = useNavigate();
  const [popularDishes, setPopularDishes] = useState([]);
  const [stalls, setStalls] = useState([]);
  const [loadingDishes, setLoadingDishes] = useState(true);
  const [loadingStalls, setLoadingStalls] = useState(true);

  useEffect(() => {
    const fetchPopularDishes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products/popular`);
        if (!response.ok) throw new Error('Failed to fetch popular dishes');
        const data = await response.json();
        setPopularDishes(data);
      } catch (error) {
        console.error('Error fetching popular dishes:', error);
      } finally {
        setLoadingDishes(false);
      }
    };

    const fetchStalls = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/stores`);
        if (!response.ok) throw new Error('Failed to fetch stalls');
        const data = await response.json();
        setStalls(data);
      } catch (error) {
        console.error('Error fetching stalls:', error);
      } finally {
        setLoadingStalls(false);
      }
    };

    fetchPopularDishes();
    fetchStalls();
  }, []);

  const handleDishClick = (dish) => {
    navigate(`/stalls-menu/${dish.storeId}`);
  };

  return (
    <main className="homepage">
      {/* Most Popular Dishes */}
      <section className="section" id="section-popular">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Most Popular Dishes</h2>
          </div>
          <div className="categories-grid">
            {loadingDishes ? (
              <p>Loading popular dishes...</p>
            ) : popularDishes.length === 0 ? (
              <p>No popular dishes found</p>
            ) : (
              popularDishes.map(dish => (
                <PopularDishCard 
                  key={dish.productId} 
                  dish={dish} 
                  onClick={() => handleDishClick(dish)} 
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Associative Food Stalls */}
      <section className="section" id="section-stalls">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Associative Food Stalls</h2>
          </div>
          <div className="stalls-grid">
            {loadingStalls ? (
              <p>Loading stalls...</p>
            ) : stalls.length === 0 ? (
              <p>No stalls found</p>
            ) : (
              stalls.map(stall => <StallCard key={stall.storeId} stall={stall} />)
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
