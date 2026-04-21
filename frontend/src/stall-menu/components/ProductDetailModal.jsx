import React, { useState } from "react";
import { useCart } from "../../customer-order-tab/hooks/useCart";

const ProductDetailModal = ({ product, onClose, storeId }) => {
  const { addItem, clearCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const currency = product.currency || "GBP";
  const priceLabel =
    currency === "VND"
      ? `${Math.round(product.price).toLocaleString("vi-VN")}VND`
      : `${currency} ${product.price.toFixed(2)}`;
  const totalPrice = product.price * quantity;
  const totalLabel =
    currency === "VND"
      ? `${Math.round(totalPrice).toLocaleString("vi-VN")}VND`
      : `${currency} ${totalPrice.toFixed(2)}`;

  const handleAddToCart = async () => {
    try {
      await addItem(product, quantity, storeId);
      onClose();
    } catch (error) {
      console.error("Failed to add to cart:", error);
      if (error.message.includes("another stall") || error.message.includes("empty")) {
        setModalMessage(error.message);
        setShowConfirmModal(true);
      } else {
        alert("Failed to add to cart. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="product-modal"
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-modal-title"
        >
          <button className="close-btn" onClick={onClose} type="button" aria-label="Close modal">
            ×
          </button>

          <div className="modal-content">
            <div className="modal-heading">
              <h2 id="product-modal-title">{product.name}</h2>
              <div className="modal-price-row">
                <strong className="modal-main-price">{priceLabel}</strong>
                <span className="modal-sold-count">Sold: {product.soldCount || 20}</span>
              </div>
              <p>{product.description}</p>
            </div>

          <div className="note-section">
            <label htmlFor="product-note">Note for seller</label>
            <textarea
              id="product-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add note..."
            />
          </div>

            <div className="modal-footer-bar">
              <div className="modal-quantity-block">
                <span className="modal-footer-label">Quantity</span>
                <div className="quantity-stepper">
                  <button
                    type="button"
                    className="quantity-step-btn"
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  >
                    -
                  </button>
                  <span className="quantity-value">{quantity}</span>
                  <button
                    type="button"
                    className="quantity-step-btn"
                    onClick={() => setQuantity((value) => value + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <strong className="modal-total-price">{totalLabel}</strong>

              <div className="modal-action-buttons">
                <button className="order-now-btn" type="button" disabled={product.isAvailable === false}>
                  Order now
                </button>
                <button
                  className="add-cart-btn"
                  onClick={handleAddToCart}
                  type="button"
                  disabled={product.isAvailable === false}
                >
                  {product.isAvailable === false ? "Unavailable" : "Add to cart"}
                </button>
              </div>
            </div>
          </div>

          <div className="modal-media-wrap">
            <img src={product.image} alt={product.name} className="modal-image" />
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="modal-overlay" style={{ zIndex: 9999, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowConfirmModal(false)}>
          <div
            style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', maxWidth: '400px', width: '90%', zIndex: 10000, boxShadow: '0 24px 64px rgba(13, 18, 39, 0.3)' }}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', color: '#111827' }}>Notification</h2>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#374151', lineHeight: '1.5' }}>
              {modalMessage}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#6b7280', color: '#fff', fontSize: '14px', cursor: 'pointer' }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetailModal;
