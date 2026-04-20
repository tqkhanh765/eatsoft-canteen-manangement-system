import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

/* ─── Data ─────────────────────────────────────────────────── */
const FOOD_CARDS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=700&h=420&fit=crop',
    discount: '-40%',
    label: 'Restaurant',
    name: 'Chef Burgers London',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=700&h=420&fit=crop',
    discount: '-20%',
    label: 'Restaurant',
    name: 'Grand Ai Cafe London',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=700&h=420&fit=crop',
    discount: '-17%',
    label: 'Restaurant',
    name: "Butterbrot Caf'e London",
  },
];

const CATEGORIES = [
  { id: 1, name: 'Burgers & Fast food', count: '31 Restaurants', bg: '#FFF7ED', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop' },
  { id: 2, name: 'Salads', count: '32 Restaurants', bg: '#F0FDF4', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop' },
  { id: 3, name: 'Pasta & Casuals', count: '4 Restaurants', bg: '#FFF7ED', image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=200&h=200&fit=crop' },
  { id: 4, name: 'Pizza', count: '32 Restaurants', bg: '#FFF1F2', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=200&h=200&fit=crop' },
  { id: 5, name: 'Breakfast', count: '4 Restaurants', bg: '#FEFCE8', image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=200&h=200&fit=crop' },
  { id: 6, name: 'Soups', count: '32 Restaurants', bg: '#FFF7ED', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=200&h=200&fit=crop' },
];

const STALLS = [
  { id: 1, name: 'Big U',          bg: '#fff',     style: 'bigu' },
  { id: 2, name: 'Cơm Việt',       bg: '#fff',     style: 'comviet' },
  { id: 3, name: 'H & D Food Court', bg: '#C53030', style: 'hd' },
  { id: 4, name: 'Gạo & Nồi',     bg: '#D4A017',  style: 'gaonoi' },
  { id: 5, name: 'Coffee Story',   bg: '#fff',     style: 'coffeestory' },
  { id: 6, name: 'The Zero Coffee', bg: '#1A1A2E', style: 'zerocoffee' },
];

const PROMO_FILTERS = ['Vegan', 'Sushi', 'Pizza & Fast food', 'others'];

/* ─── Sub-components ───────────────────────────────────────── */
const FoodCard = ({ card }) => (
  <div className="food-card" id={`food-card-${card.id}`}>
    <img src={card.image} alt={card.name} className="food-card-img" loading="lazy" />
    <span className="food-card-badge">{card.discount}</span>
    <div className="food-card-overlay">
      <span className="food-card-label">{card.label}</span>
      <h3 className="food-card-name">{card.name}</h3>
    </div>
  </div>
);

const CategoryCard = ({ cat }) => (
  <div className="category-card" id={`category-${cat.id}`}>
    <div className="category-img-wrap" style={{ background: cat.bg }}>
      <img src={cat.image} alt={cat.name} loading="lazy" />
    </div>
    <p className="category-name">{cat.name}</p>
    <p className="category-count">{cat.count}</p>
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
  const [activeFilter, setActiveFilter] = useState('Pizza & Fast food');

  return (
    <main className="homepage">
      {/* Promotions */}
      <section className="section" id="section-promotions">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Promotions</h2>
            <div className="filter-tabs" role="group" aria-label="Promotion filters">
              {PROMO_FILTERS.map(f => (
                <button
                  key={f}
                  id={`filter-${f.replace(/\s+/g, '-').toLowerCase()}`}
                  className={`filter-tab ${activeFilter === f ? 'active' : ''}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="cards-grid">
            {FOOD_CARDS.map(card => <FoodCard key={card.id} card={card} />)}
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section className="section" id="section-recommendations">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Today's Recommendations for You</h2>
          </div>
          <div className="cards-grid">
            {FOOD_CARDS.map(card => <FoodCard key={card.id} card={{ ...card, id: `rec-${card.id}` }} />)}
          </div>
        </div>
      </section>

      {/* Most Popular Dishes */}
      <section className="section" id="section-popular">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Most Popular Dishes</h2>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map(cat => <CategoryCard key={cat.id} cat={cat} />)}
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
