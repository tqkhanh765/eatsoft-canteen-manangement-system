import React, { useRef, useState } from 'react';
import Footer from '../../components/Footer';
import ConfirmDialog from './ConfirmDialog';
import { CATEGORIES } from '../constants';
import './ItemForm.css';

const ImageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

/**
 * ItemForm
 *
 * Props:
 *   title      {string}   – page heading: "Add Item" or "Edit Item"
 *   form       {object}   – { name, type, price, desc, image }
 *   onChange   {function} – (field, value) => void
 *   onSave     {function} – called when the user confirms saving
 *   onCancel   {function} – called when the user confirms cancelling
 *   saveLabel  {string}   – button label: "Publish" or "Save"
 */
const ItemForm = ({ title, form, onChange, onSave, onCancel, saveLabel }) => {
  const fileRef = useRef();

  // Dialog state: which dialog is open and what action it will confirm
  const [dialog, setDialog] = useState(null); // null | 'cancel' | 'save'

  /* ── File upload ── */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onChange('image', URL.createObjectURL(file));
  };

  /* ── Dialog helpers ── */
  const askCancel    = () => setDialog('cancel');
  const askSave      = () => setDialog('save');
  const closeDialog  = () => setDialog(null);

  const handleConfirm = () => {
    closeDialog();
    if (dialog === 'cancel') onCancel();
    if (dialog === 'save')   onSave();
  };

  // Dynamic messages per action
  const dialogMessage =
    dialog === 'cancel'
      ? `Your changes will be lost if you cancel ${title === 'Add Item' ? 'adding' : 'editing'} item.`
      : `Are you sure you want to ${saveLabel === 'Publish' ? 'publish' : 'save changes to'} this item?`;

  return (
    <>
      <div className="form-page-wrapper">
        <div className="form-page-container">
          <h1 className="form-page-title">{title}</h1>

          {/* Photo upload */}
          <div
            className="photo-upload-area"
            id="photo-upload-area"
            onClick={() => fileRef.current.click()}
          >
            {form.image ? (
              <img src={form.image} alt="Preview" className="photo-preview" />
            ) : (
              <div className="photo-placeholder">
                <ImageIcon />
                <span>+ Add Photo</span>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>

          {/* Name */}
          <div className="field-group">
            <label className="field-label" htmlFor="field-name">Name of dish:</label>
            <input
              id="field-name"
              className="field-input"
              type="text"
              placeholder="Item name"
              value={form.name}
              onChange={(e) => onChange('name', e.target.value)}
            />
          </div>

          {/* Price */}
          <div className="field-group">
            <label className="field-label" htmlFor="field-price">Price:</label>
            <input
              id="field-price"
              className="field-input"
              type="number"
              placeholder="0.00"
              value={form.price}
              onChange={(e) => onChange('price', e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="field-group">
            <label className="field-label" htmlFor="field-desc">Description:</label>
            <textarea
              id="field-desc"
              className="field-input field-textarea"
              placeholder="Write your description..."
              value={form.desc}
              onChange={(e) => onChange('desc', e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="field-group">
            <label className="field-label" htmlFor="field-category">Category:</label>
            <select
              id="field-category"
              className="field-input field-select"
              value={form.type}
              onChange={(e) => onChange('type', e.target.value)}
            >
              <option value="" disabled>Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Action buttons – both open a confirmation dialog first */}
          <div className="form-page-actions">
            <button className="form-btn-cancel" id="form-cancel-btn" onClick={askCancel}>
              Cancel
            </button>
            <button className="form-btn-save" id="form-save-btn" onClick={askSave}>
              {saveLabel}
            </button>
          </div>
        </div>
      </div>

      <Footer />

      {/* Confirmation dialog */}
      <ConfirmDialog
        isOpen={dialog !== null}
        message={dialogMessage}
        onConfirm={handleConfirm}
        onCancel={closeDialog}
      />
    </>
  );
};

export default ItemForm;
