const StallLogo = ({ logoURL, name }) => {
  if (logoURL) {
    return (
      <div className="stall-logo custom">
        <img src={logoURL} alt={name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
    );
  }

  // Fallback map for legacy/mocked styles if logoURL is missing
  const style = name ? name.toLowerCase().replace(/\s/g, '') : '';
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

export default StallLogo;
