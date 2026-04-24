import React from 'react';
import '../styles/Toggle.css';

const Toggle = ({ id, on, onChange }) => (
  <label className="toggle-wrapper" htmlFor={`toggle-${id}`}>
    <input
      id={`toggle-${id}`}
      type="checkbox"
      className="toggle-checkbox"
      checked={on}
      onChange={onChange}
    />
    <span className={`toggle-track ${on ? 'on' : ''}`} onClick={onChange}>
      <span className="toggle-thumb" />
    </span>
  </label>
);

export default Toggle;
