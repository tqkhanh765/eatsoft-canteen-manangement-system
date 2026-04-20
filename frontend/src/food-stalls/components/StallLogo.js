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

export default StallLogo;
