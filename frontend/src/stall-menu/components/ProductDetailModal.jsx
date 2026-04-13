import React, { useState } from "react";

const ProductDetailModal = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
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

  const handleAddToCart = () => {
    console.log("Add to cart:", { product, quantity, note });
    onClose();
  };

  return (
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
  );
};

export default ProductDetailModal;
