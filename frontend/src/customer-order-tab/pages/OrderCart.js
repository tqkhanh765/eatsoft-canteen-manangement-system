import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/layout.css';
import '../styles/cart-items.css';
import '../styles/delivery.css';
import '../styles/summary.css';
import '../styles/states.css';
import '../styles/alerts.css';
import '../styles/animations.css';
import { useCart } from '../hooks/useCart';
import { useOrderActions } from '../hooks/useOrderActions';
import { APP_CONSTANTS } from '../constants/appConstants';
import { SVGIcons } from '../constants/icons';
import { calculateSubtotal, calculateGrandTotal } from '../utils/currencyUtils';
import { AlertBanner } from '../components/AlertBanner';
import { CartItem } from '../components/CartItem';
import { DeliveryOptions } from '../components/DeliveryOptions';
import { OrderSummary } from '../components/OrderSummary';
import authService from '../../services/authService';

// ── Component ────────────────────────────────────────────────────────────────
const OrderCart = () => {
  const navigate = useNavigate();
  // Form state
  const [deliveryOption, setDeliveryOption] = useState(APP_CONSTANTS.DELIVERY_OPTIONS.DELIVERY);
  const [room, setRoom] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Cart state and actions
  const cartState = useCart();
  const { order, items, loading, error, setError, updateItemNote } = cartState;
  const orderActions = useOrderActions(cartState);
  const { actionLoading, checkoutLoading, handleQuantityChange, handleRemoveItem } = orderActions;

  // Get current user
  const currentUser = authService.getCurrentUser();

  // ── Checkout ─────────────────────────────────────────────────────────────
  const handleCheckout = async () => {
    if (deliveryOption === APP_CONSTANTS.DELIVERY_OPTIONS.DELIVERY && !room.trim()) {
      setErrorMessage('Please enter your room number');
      setShowErrorModal(true);
      return;
    }
    navigate('/checkout', { state: { deliveryOption, room } });
  };

  // ── Derived totals ───────────────────────────────────────────────────────
  const subTotal = calculateSubtotal(items);
  const grandTotal = calculateGrandTotal(
    subTotal, 
    APP_CONSTANTS.DELIVERY_FEE, 
    APP_CONSTANTS.DEFAULT_DISCOUNT, 
    deliveryOption === APP_CONSTANTS.DELIVERY_OPTIONS.DELIVERY
  );

  // ── Render ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="order-cart-page">
        <div className="cart-loading-state">
          {SVGIcons.spinner}
          <p>{APP_CONSTANTS.LOADING_MESSAGES.CART}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-cart-page">
      <div className="order-cart-container">

        {/* ── Error / Success banners ── */}
        <AlertBanner 
          message={error} 
          type="error" 
          onClose={() => setError(null)} 
        />
        <AlertBanner 
          message={successMsg} 
          type="success" 
        />

        <main className="cart-main">
          <h1 className="cart-title">My Order Cart</h1>

          {items.length === 0 && !successMsg ? (
            <div className="cart-empty-state">
              <p>Your cart is empty.</p>
            </div>
          ) : (
            <div className="cart-items-wrapper">
              {items.map((item) => (
                <CartItem
                  key={item.orderItemId}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                  onUpdateNote={updateItemNote}
                  isLoading={actionLoading[item.orderItemId]}
                  storeName={order?.store?.storeName || order?.store_name || 'Store'}
                />
              ))}
            </div>
          )}
        </main>

        <aside className="cart-sidebar">
          <div className="delivery-header">
            <h2>Delivery Info</h2>
            <button className="edit-delivery-btn" aria-label="Edit delivery info">
              {SVGIcons.editSmall}
            </button>
          </div>

          <div className="delivery-info-card">
            <div className="info-row">
              <span className="info-label">Location:</span>
              <span className="info-value">{APP_CONSTANTS.DEFAULT_LOCATION}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Room:</span>
              <input
                type="text"
                id="room-input"
                className="info-input"
                placeholder="Enter your room number"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                disabled={deliveryOption === APP_CONSTANTS.DELIVERY_OPTIONS.PICKUP}
                style={deliveryOption === APP_CONSTANTS.DELIVERY_OPTIONS.PICKUP ? { backgroundColor: '#f3f4f6', cursor: 'not-allowed' } : {}}
              />
            </div>
            <div className="info-row">
              <span className="info-label">Name:</span>
              <span className="info-value">{currentUser?.userName || order?.user?.userName || order?.customer_name || APP_CONSTANTS.DEFAULT_CUSTOMER_NAME}</span>
            </div>

            {/* ── Pickup / Delivery toggle ── */}
            <DeliveryOptions
              selectedOption={deliveryOption}
              onOptionChange={setDeliveryOption}
            />

            {/* ── Order summary ── */}
            <OrderSummary
              subtotal={subTotal}
              discount={APP_CONSTANTS.DEFAULT_DISCOUNT}
              deliveryOption={deliveryOption}
              couponCode={couponCode}
              onCouponChange={setCouponCode}
              onCheckout={handleCheckout}
              isCheckoutLoading={checkoutLoading}
              isCheckoutDisabled={items.length === 0}
            />
          </div>

        </aside>

      </div>

      {showErrorModal && (
        <div className="modal-overlay" style={{ zIndex: 9999, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowErrorModal(false)}>
          <div
            style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', maxWidth: '400px', width: '90%', zIndex: 10000, boxShadow: '0 24px 64px rgba(13, 18, 39, 0.3)' }}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', color: '#111827' }}>Notification</h2>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#374151', lineHeight: '1.5' }}>
              {errorMessage}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowErrorModal(false)}
                style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#6b7280', color: '#fff', fontSize: '14px', cursor: 'pointer' }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCart;