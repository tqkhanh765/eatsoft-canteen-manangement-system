import React, { useRef, useState } from 'react';
import Footer from '../../components/Footer';
import ConfirmDialog from './ConfirmDialog';
import { CATEGORIES } from '../constants';
import '../styles/ItemForm.css';

// Error message component
const FieldError = ({ message }) =>
  message ? <span className="field-error">{message}</span> : null;

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
 *   isSaving   {boolean}  – whether save operation is in progress
 */
const ItemForm = ({ title, form, onChange, onSave, onCancel, saveLabel, isSaving }) => {
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);

  // Dialog state: which dialog is open and what action it will confirm
  const [dialog, setDialog] = useState(null); // null | 'cancel' | 'save'

  // Validation errors
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.image)                      e.image    = 'Please upload a photo.';
    if (!form.name?.trim())               e.name     = 'Item name is required.';
    if (!form.price && form.price !== 0)  e.price    = 'Price is required.';
    if (Number(form.price) <= 0)          e.price    = 'Price must be greater than 0.';
    if (!form.desc?.trim())               e.desc     = 'Description is required.';
    if (!form.type)                       e.type     = 'Please select a category.';
    return e;
  };

  /* ── File upload to Cloudinary ── */
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:8080/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload image');

      const data = await response.json();
      onChange('image', data.url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  /* ── Dialog helpers ── */
  const askCancel   = () => setDialog('cancel');
  const closeDialog = () => setDialog(null);

  const askSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    setDialog('save');
  };

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
          <div className="field-group">
            <div
              className={`photo-upload-area${errors.image ? ' field-input-error' : ''}`}
              id="photo-upload-area"
              onClick={() => !uploading && fileRef.current.click()}
              style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}
            >
              {uploading ? (
                <div className="photo-placeholder">
                  <span>Uploading...</span>
                </div>
              ) : form.image ? (
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
                required
                style={{ display: 'none' }}
                onChange={handleFileChange}
                disabled={uploading}
              />
            </div>
            <FieldError message={errors.image} />
          </div>

          {/* Name */}
          <div className="field-group">
            <label className="field-label" htmlFor="field-name">Name of dish: <span className="required-star">*</span></label>
            <input
              id="field-name"
              className={`field-input${errors.name ? ' field-input-error' : ''}`}
              type="text"
              placeholder="Item name"
              value={form.name}
              required
              onChange={(e) => { onChange('name', e.target.value); setErrors(prev => ({ ...prev, name: '' })); }}
            />
            <FieldError message={errors.name} />
          </div>

          {/* Price */}
          <div className="field-group">
            <label className="field-label" htmlFor="field-price">Price: <span className="required-star">*</span></label>
            <input
              id="field-price"
              className={`field-input${errors.price ? ' field-input-error' : ''}`}
              type="number"
              placeholder="0.00"
              min="0.01"
              step="0.01"
              value={form.price}
              required
              onChange={(e) => { onChange('price', e.target.value); setErrors(prev => ({ ...prev, price: '' })); }}
            />
            <FieldError message={errors.price} />
          </div>

          {/* Description */}
          <div className="field-group">
            <label className="field-label" htmlFor="field-desc">Description: <span className="required-star">*</span></label>
            <textarea
              id="field-desc"
              className={`field-input field-textarea${errors.desc ? ' field-input-error' : ''}`}
              placeholder="Write your description..."
              value={form.desc}
              required
              onChange={(e) => { onChange('desc', e.target.value); setErrors(prev => ({ ...prev, desc: '' })); }}
            />
            <FieldError message={errors.desc} />
          </div>

          {/* Category */}
          <div className="field-group">
            <label className="field-label" htmlFor="field-category">Category: <span className="required-star">*</span></label>
            <select
              id="field-category"
              className={`field-input field-select${errors.type ? ' field-input-error' : ''}`}
              value={form.type}
              required
              onChange={(e) => { onChange('type', e.target.value); setErrors(prev => ({ ...prev, type: '' })); }}
            >
              <option value="" disabled>Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <FieldError message={errors.type} />
          </div>

          {/* Action buttons – both open a confirmation dialog first */}
          <div className="form-page-actions">
            <button className="form-btn-cancel" id="form-cancel-btn" onClick={askCancel} disabled={isSaving}>
              Cancel
            </button>
            <button className="form-btn-save" id="form-save-btn" onClick={askSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : saveLabel}
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
