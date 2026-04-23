import React from "react";

const StallHeroLogo = ({ stall, stallInfo }) => {
  const logoURL = stall?.logoURL || stallInfo?.logoURL;
  const name = stall?.storeName || stallInfo?.name || "Big U";

  if (logoURL) {
    return (
      <div className="stall-hero-logo custom">
        <img src={logoURL} alt={name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
    );
  }

  const style = stall?.style || stallInfo?.style || (name ? name.toLowerCase().replace(/\s/g, '') : '');
  const bg = stall?.bg || stallInfo?.bg;

  const logos = {
    bigu: (
      <div className="stall-hero-logo stall-hero-logo-bigu">
        <div className="stall-hero-burger-icon" />
        <p>BIG U</p>
      </div>
    ),
    comviet: (
      <div className="stall-hero-logo stall-hero-logo-comviet">
        <p>COM VIET</p>
      </div>
    ),
    hdfoodcourt: (
      <div className="stall-hero-logo stall-hero-logo-hd" style={{ background: '#C53030' }}>
        <p>H &amp; D</p>
        <small>FOOD COURT</small>
      </div>
    ),
    gaonoi: (
      <div className="stall-hero-logo stall-hero-logo-gaonoi" style={{ background: '#D4A017' }}>
        <p>Gao &amp; Noi</p>
      </div>
    ),
    coffeestory: (
      <div className="stall-hero-logo stall-hero-logo-coffeestory">
        <p>CAFFE</p>
        <p className="stall-hero-logo-sub">STORY</p>
        <small>EST. 2014</small>
      </div>
    ),
    thezerocoffee: (
      <div className="stall-hero-logo stall-hero-logo-zerocoffee" style={{ background: '#1A1A2E' }}>
        <p>THE ZERO COFFEE</p>
      </div>
    ),
  };

  return logos[style] || (
    <div className="stall-hero-logo stall-hero-logo-default">
      <p>{name}</p>
    </div>
  );
};

const MenuHeader = ({ stall, stallInfo, stats, onBack }) => {
  return (
    <section className="stall-hero-shell">
      <div className="stall-menu-hero">
        <div className="stall-menu-hero-copy">
          {onBack && (
            <button className="stall-menu-back-btn" type="button" onClick={onBack}>
              Back
            </button>
          )}

          <p className="stall-menu-eyebrow">{stallInfo?.tagline || "I'm lovin' it!"}</p>
          <h1 className="stall-menu-title">{stall?.storeName || stallInfo?.name || "Big U"}</h1>

          <div className="stall-hero-badges">
            <div className="stall-hero-badge">
              <span className="hero-badge-icon">¤</span>
              <span>{stallInfo?.minimumOrder || "Minimum order: 12 GBP"}</span>
            </div>
            <div className="stall-hero-badge">
              <span className="hero-badge-icon">o</span>
              <span>{stallInfo?.deliveryTime || "Delivery in 20-25 minutes"}</span>
            </div>
          </div>
        </div>

        <div className="stall-menu-hero-brand-card">
          <div className="brand-card-top">
            <div className="brand-card-score">
              <strong>{stats.rating}</strong>
              <span>★★★★★</span>
              <small>{stats.reviews} reviews</small>
            </div>
            <div className="brand-card-logo">
              <StallHeroLogo stall={stall} stallInfo={stallInfo} />
            </div>
          </div>
        </div>
      </div>

      <div className="stall-menu-timing-pill">
        <span className="timing-pill-icon">o</span>
        <span>{stallInfo?.openHours || "08:00 A.M. - 14:00 P.M."}</span>
      </div>
    </section>
  );
};

export default MenuHeader;
