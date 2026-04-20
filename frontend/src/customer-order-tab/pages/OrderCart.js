import React, { useState } from 'react';
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

// ── Component ────────────────────────────────────────────────────────────────
const OrderCart = () => {
  // Form state
  const [deliveryOption, setDeliveryOption] = useState(APP_CONSTANTS.DELIVERY_OPTIONS.DELIVERY);
  const [room, setRoom] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Cart state and actions
  const cartState = useCart();
  const { order, items, loading, error, setError } = cartState;
  const orderActions = useOrderActions(cartState);
  const { actionLoading, checkoutLoading, handleQuantityChange, handleRemoveItem } = orderActions;

  // ── Checkout ─────────────────────────────────────────────────────────────
  const handleCheckout = async () => {
    const successMessage = await orderActions.handleCheckout(deliveryOption, room, couponCode);
    if (successMessage) {
      setSuccessMsg('🎉 ' + successMessage);
    }
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
                  isLoading={actionLoading[item.orderItemId]}
                  storeName={item.store_name || order?.store_name}
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
              />
            </div>
            <div className="info-row">
              <span className="info-label">Name:</span>
              <span className="info-value">{order?.customer_name || APP_CONSTANTS.DEFAULT_CUSTOMER_NAME}</span>
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
    </div>
  );
};

export default OrderCart;