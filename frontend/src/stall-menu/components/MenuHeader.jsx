import React from "react";

const StallHeroLogo = ({ stall, stallInfo }) => {
  const style = stall?.style || stallInfo?.style;
  const bg = stall?.bg || stallInfo?.bg;
  const name = stall?.name || stallInfo?.name || "Big U";

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
    hd: (
      <div className="stall-hero-logo stall-hero-logo-hd" style={{ background: bg }}>
        <p>H &amp; D</p>
        <small>FOOD COURT</small>
      </div>
    ),
    gaonoi: (
      <div className="stall-hero-logo stall-hero-logo-gaonoi" style={{ background: bg }}>
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
    zerocoffee: (
      <div className="stall-hero-logo stall-hero-logo-zerocoffee" style={{ background: bg }}>
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
          <h1 className="stall-menu-title">{stall?.name || stallInfo?.name || "Big U"}</h1>

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
              <small>{stats.reviews}</small>
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
