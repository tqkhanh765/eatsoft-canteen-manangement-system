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

const StallLogo = ({ style, name, bg }) => {
  const map = {
    bigu:        <div className="stall-logo bigu"><span className="bigu-icon">🍽</span><p>BIG U</p></div>,
    comviet:     <div className="stall-logo comviet"><p>CƠM VIỆT</p></div>,
    hd:          <div className="stall-logo hd" style={{ background: bg }}><p>H &amp; D</p><small>FOOD COURT</small></div>,
    gaonoi:      <div className="stall-logo gaonoi" style={{ background: bg }}><p>Gạo &amp; Nồi</p></div>,
    coffeestory: <div className="stall-logo coffeestory"><p>CAFFÈ</p><p className="cs-sub">STORY</p><small>EST. 2014</small></div>,
    zerocoffee:  <div className="stall-logo zerocoffee" style={{ background: bg }}><p>THE ZERO COFFEE</p></div>,
  };
  return map[style] || <div className="stall-logo"><p>{name}</p></div>;
};

const StallCard = ({ stall, onVisit }) => {
  const navigate = useNavigate();

  return (
    <div className="stall-card" id={`stall-${stall.id}`}>
      <div className="stall-logo-wrap">
        <StallLogo style={stall.style} name={stall.name} bg={stall.bg} />
      </div>
      <div className="stall-card-footer">
        <p className="stall-name">{stall.name}</p>
        <button
          className="stall-btn"
          id={`stall-visit-${stall.id}`}
          type="button"
          onClick={() => {
            navigate(`/stalls-menu/${stall.id}`);
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularDishes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products/popular`);
        if (!response.ok) throw new Error('Failed to fetch popular dishes');
        const data = await response.json();
        setPopularDishes(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching popular dishes:', error);
        setLoading(false);
      }
    };

    fetchPopularDishes();
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
            {loading ? (
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
            {STALLS.map(stall => <StallCard key={stall.id} stall={stall} onVisit={onVisitStall} />)}
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
