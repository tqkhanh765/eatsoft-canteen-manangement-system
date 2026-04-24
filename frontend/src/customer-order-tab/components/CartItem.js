import React, { useState } from 'react';
import { SVGIcons } from '../constants/icons';
import { formatItemPrice } from '../utils/currencyUtils';
import { QuantityControls } from './QuantityControls';

/**
 * CartItem component for displaying a single item in the cart
 * @param {Object} props - Component props
 * @param {Object} props.item - The item object
 * @param {Function} props.onQuantityChange - Function to handle quantity changes
 * @param {Function} props.onRemove - Function to handle item removal
 * @param {Function} props.onUpdateNote - Function to handle note updates
 * @param {boolean} props.isLoading - Whether the item is currently loading
 * @param {string} props.storeName - The store name
 * @returns {JSX.Element} Cart item component
 */
export const CartItem = ({
  item,
  onQuantityChange,
  onRemove,
  onUpdateNote,
  isLoading = false,
  storeName
}) => {
  const [editingNote, setEditingNote] = useState(false);
  const [noteValue, setNoteValue] = useState(item.note || '');

  const handleIncrease = () => onQuantityChange(item, 1);
  const handleDecrease = () => onQuantityChange(item, -1);

  const handleEditNote = () => {
    setNoteValue(item.note || '');
    setEditingNote(true);
  };

  const handleSaveNote = () => {
    onUpdateNote(item.id || item.orderItemId, noteValue);
    setEditingNote(false);
  };

  const handleCancelNote = () => {
    setNoteValue(item.note || '');
    setEditingNote(false);
  };

  return (
    <div className={`cart-item${isLoading ? ' cart-item--loading' : ''}`}>
      <div className="item-details">
        <div className="item-shop">
          {SVGIcons.shop}
          <span>{storeName || 'Store'}</span>
        </div>
        <div className="item-name">{item.product_name || item.product?.name || `Product #${item.product_id || item.productId}`}</div>
        {item.note && !editingNote && (
          <div className="item-note">{item.note}</div>
        )}
        {editingNote && (
          <div className="item-note-editor">
            <textarea
              value={noteValue}
              onChange={(e) => setNoteValue(e.target.value)}
              placeholder="Add a note..."
              rows="2"
            />
            <div className="note-editor-actions">
              <button onClick={handleCancelNote} className="note-btn-cancel">Cancel</button>
              <button onClick={handleSaveNote} className="note-btn-save">Save</button>
            </div>
          </div>
        )}
      </div>

      <div className="item-actions">
        <QuantityControls
          quantity={item.quantity}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          disabled={isLoading}
          canDecrease={item.quantity > 1}
        />

        <div className="item-price">{formatItemPrice(item.unit_price || item.unitPrice, item.quantity)}</div>

        <div className="item-buttons">
          <button
            className="action-btn edit"
            onClick={handleEditNote}
            disabled={isLoading || editingNote}
            aria-label="Edit item note"
          >
            {SVGIcons.edit}
          </button>
          <button
            className="action-btn delete"
            onClick={() => onRemove(item.id || item.orderItemId)}
            disabled={isLoading}
            aria-label="Remove item"
          >
            {isLoading ? SVGIcons.spinner : SVGIcons.delete}
          </button>
        </div>
      </div>
    </div>
  );
};
