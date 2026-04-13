import React, { useState, useEffect, useCallback } from 'react';
import '../styles/OrderCart.css';
import {
  fetchOrders,
  updateOrderItem,
  deleteOrderItem,
  createOrder,
} from '../services/orderService';

// ── SVG Icons ────────────────────────────────────────────────────────────────
const SVGIcons = {
  shop: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
  edit: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
  delete: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>,
  minus: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  plus: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  delivery: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>,
  stall: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
  editSmall: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
  spinner: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spinner-icon"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>,
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const formatCurrency = (amount) =>
  Number(amount).toLocaleString('vi-VN') + ' VND';

// TODO: Replace with real auth context value when auth is integrated
const MOCK_USER_ID = 1;
const DELIVERY_FEE = 10000;
const DISCOUNT = 0; // will be replaced when coupon system is ready

// ── Component ────────────────────────────────────────────────────────────────
const OrderCart = () => {
  // Pending order fetched from backend (status = 'Pending')
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);

  const [deliveryOption, setDeliveryOption] = useState('delivery');
  const [room, setRoom] = useState('');
  const [couponCode, setCouponCode] = useState('');

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({}); // { [itemId]: true }
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // ── Load pending order for current user ─────────────────────────────────
  const loadCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all Pending orders for the logged-in user
      const orders = await fetchOrders({ user_id: 54, status: 'Pending' });
      if (orders.length > 0) {
        // Use the most recent pending order; it already includes joined store_name
        const latestOrder = orders[0];
        setOrder(latestOrder);
        // Items are bundled in the order if using getOrderById;
        // fetchOrders returns headers only — fetch full detail separately
        const { fetchOrderById } = await import('../services/orderService');
        const detailed = await fetchOrderById(latestOrder.id);
        setItems(detailed.items || []);
        setOrder(detailed);
      } else {
        setOrder(null);
        setItems([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // ── Quantity update ──────────────────────────────────────────────────────
  const handleQuantityChange = async (item, delta) => {
    const newQty = Math.max(1, item.quantity + delta);
    if (newQty === item.quantity) return;

    // Optimistic UI update
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, quantity: newQty } : i))
    );
    setActionLoading((prev) => ({ ...prev, [item.id]: true }));

    try {
      await updateOrderItem(item.id, {
        quantity: newQty,
        unit_price: item.unit_price,
      });
    } catch (err) {
      // Roll back on failure
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, quantity: item.quantity } : i))
      );
      setError(`Could not update quantity: ${err.message}`);
    } finally {
      setActionLoading((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  // ── Remove item ──────────────────────────────────────────────────────────
  const handleRemoveItem = async (itemId) => {
    const snapshot = items;
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    setActionLoading((prev) => ({ ...prev, [itemId]: true }));

    try {
      await deleteOrderItem(itemId);
    } catch (err) {
      setItems(snapshot); // Roll back
      setError(`Could not remove item: ${err.message}`);
    } finally {
      setActionLoading((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  // ── Checkout ─────────────────────────────────────────────────────────────
  const handleCheckout = async () => {
    if (!items.length) return;
    if (!room.trim()) {
      setError('Please enter your room number before checking out.');
      return;
    }

    setCheckoutLoading(true);
    setError(null);

    try {
      if (order) {
        // Order already exists in DB — just update its status to Confirmed/Processing
        // For now we mark it as Cooking to hand it off to the stall
        const { updateOrderStatus } = await import('../services/orderService');
        await updateOrderStatus(order.id, 'Cooking');
      } else {
        // No pending order yet — create one (edge case: cart built client-side)
        await createOrder({
          user_id: MOCK_USER_ID,
          store_id: items[0]?.store_id,
          delivery_address: `IU Campus – Room ${room}`,
          note: couponCode ? `Coupon: ${couponCode}` : '',
          items: items.map((i) => ({
            product_id: i.product_id,
            quantity: i.quantity,
            unit_price: i.unit_price,
          })),
        });
      }

      setSuccessMsg('🎉 Order placed successfully! Sit tight — your food is being prepared.');
      setItems([]);
      setOrder(null);
    } catch (err) {
      setError(`Checkout failed: ${err.message}`);
    } finally {
      setCheckoutLoading(false);
    }
  };

  // ── Derived totals ───────────────────────────────────────────────────────
  const subTotal = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
  const grandTotal = subTotal - DISCOUNT + (deliveryOption === 'delivery' ? DELIVERY_FEE : 0);

  // ── Render ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="order-cart-page">
        <div className="cart-loading-state">
          {SVGIcons.spinner}
          <p>Loading your cart…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-cart-page">
      <div className="order-cart-container">

        {/* ── Error / Success banners ── */}
        {error && (
          <div className="cart-alert cart-alert--error" role="alert">
            {error}
            <button className="cart-alert-close" onClick={() => setError(null)}>✕</button>
          </div>
        )}
        {successMsg && (
          <div className="cart-alert cart-alert--success" role="status">
            {successMsg}
          </div>
        )}

        <main className="cart-main">
          <h1 className="cart-title">My Order Cart</h1>

          {items.length === 0 && !successMsg ? (
            <div className="cart-empty-state">
              <p>Your cart is empty.</p>
            </div>
          ) : (
            <div className="cart-items-wrapper">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`cart-item${actionLoading[item.id] ? ' cart-item--loading' : ''}`}
                >
                  <div className="item-details">
                    <div className="item-shop">
                      {SVGIcons.shop}
                      <span>{item.store_name || order?.store_name || 'Store'}</span>
                    </div>
                    <div className="item-name">{item.product_name || `Product #${item.product_id}`}</div>
                  </div>

                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button
                        className="qty-btn minus"
                        onClick={() => handleQuantityChange(item, -1)}
                        disabled={actionLoading[item.id] || item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        {SVGIcons.minus}
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn plus"
                        onClick={() => handleQuantityChange(item, 1)}
                        disabled={actionLoading[item.id]}
                        aria-label="Increase quantity"
                      >
                        {SVGIcons.plus}
                      </button>
                    </div>

                    <div className="item-price">{formatCurrency(item.unit_price * item.quantity)}</div>

                    <div className="item-buttons">
                      <button className="action-btn edit" aria-label="Edit item">
                        {SVGIcons.edit}
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={actionLoading[item.id]}
                        aria-label="Remove item"
                      >
                        {actionLoading[item.id] ? SVGIcons.spinner : SVGIcons.delete}
                      </button>
                    </div>
                  </div>
                </div>
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
              <span className="info-value">IU Campus, Quarter 6, Linh Trung Ward</span>
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
              <span className="info-value">{order?.customer_name || 'Nguyen Van A'}</span>
            </div>

            {/* ── Pickup / Delivery toggle ── */}
            <div className="pickup-options-section">
              <div className="info-label">Pickup options:</div>
              <div className="pickup-buttons">
                <button
                  id="pickup-delivery-btn"
                  className={`pickup-btn ${deliveryOption === 'delivery' ? 'active' : ''}`}
                  onClick={() => setDeliveryOption('delivery')}
                >
                  <div className="pickup-icon">{SVGIcons.delivery}</div>
                  <div className="pickup-title">Delivery</div>
                  <div className="pickup-time">Estimated waiting time – 20 mins</div>
                </button>
                <button
                  id="pickup-stall-btn"
                  className={`pickup-btn ${deliveryOption === 'pickup' ? 'active' : ''}`}
                  onClick={() => setDeliveryOption('pickup')}
                >
                  <div className="pickup-icon">{SVGIcons.stall}</div>
                  <div className="pickup-title">Pickup at stalls</div>
                  <div className="pickup-time">Estimated waiting time – 10 mins</div>
                </button>
              </div>
            </div>

            {/* ── Order summary ── */}
            <div className="summary-section">
              <div className="summary-row">
                <span className="summary-label">Sub Total:</span>
                <span className="summary-value">{formatCurrency(subTotal)}</span>
              </div>
              {DISCOUNT > 0 && (
                <div className="summary-row">
                  <span className="summary-label">Discount:</span>
                  <span className="summary-value">-{formatCurrency(DISCOUNT)}</span>
                </div>
              )}
              <div className="coupon-row">
                <input
                  type="text"
                  id="coupon-input"
                  className="coupon-input"
                  placeholder="Enter your coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
              </div>
              <div className="summary-row">
                <span className="summary-label">Delivery fee:</span>
                <span className="summary-value">
                  {deliveryOption === 'delivery' ? formatCurrency(DELIVERY_FEE) : 'Free'}
                </span>
              </div>
              <div className="summary-row grand-total">
                <span className="summary-label">Grand total:</span>
                <span className="summary-value">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>

          <button
            id="checkout-btn"
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={checkoutLoading || items.length === 0}
          >
            <div className="checkout-icon-wrap">
              {checkoutLoading ? SVGIcons.spinner : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              )}
            </div>
            <span>{checkoutLoading ? 'Placing order…' : 'Checkout!'}</span>
          </button>
        </aside>

      </div>
    </div>
  );
};

export default OrderCart;