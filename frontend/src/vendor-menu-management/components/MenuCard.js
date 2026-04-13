import React, { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';
import Toggle from './Toggle';
import { formatVND } from '../constants';
import './MenuCard.css';

const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const MenuCard = ({ item, onEdit, onDelete, onToggle }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleStatusClick = () => setConfirmOpen(true);

  const handleConfirm = () => {
    setConfirmOpen(false);
    onToggle(item.id);
  };

  const dialogMessage = item.available
    ? `Mark "${item.name}" as Sold Out?`
    : `Mark "${item.name}" as Available again?`;

  return (
    <>
      <div className="menu-card" id={`menu-item-${item.id}`}>

        {/* ── Left: square image ── */}
        <div className="menu-card-img-wrap">
          <img src={item.image} alt={item.name} className="menu-card-img" loading="lazy" />
          <span className="menu-type-badge">Type: {item.type}</span>
        </div>

        {/* ── Right: body ── */}
        <div className="menu-card-body">

          {/* Top row: name/desc on left, buttons + price on right */}
          <div className="menu-card-top-row">
            <div className="menu-card-title-block">
              <span className="menu-card-name">{item.name}</span>
              <p className="menu-card-desc">{item.desc}</p>
            </div>
            <div className="menu-card-right-col">
              <div className="menu-card-actions">
                <button className="action-btn edit" id={`edit-item-${item.id}`} onClick={() => onEdit(item)}>
                  <EditIcon /> Edit
                </button>
                <button className="action-btn delete" id={`delete-item-${item.id}`} onClick={() => onDelete(item.id)}>
                  <TrashIcon /> Delete
                </button>
              </div>
              <div className="menu-card-price-block">
                <p className="menu-card-price-label">Price</p>
                <p className="menu-card-price">{formatVND(item.price)}</p>
              </div>
            </div>
          </div>

          {/* Bottom row: availability toggle */}
          <div className="menu-card-footer">
            <div className="availability-row">
              <span className={`availability-label ${item.available ? 'available' : 'soldout'}`}>
                {item.available ? 'Available' : 'Sold Out'}
              </span>
              <Toggle id={item.id} on={item.available} onChange={handleStatusClick} />
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        message={dialogMessage}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
};

export default MenuCard;
