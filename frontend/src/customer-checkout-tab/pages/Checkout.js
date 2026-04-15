import React, { useState, useEffect } from 'react';
import '../styles/Checkout.css';

// ── Payment methods ───────────────────────────────────────────────────────────
const PAYMENT_METHODS = [
  {
    id: 'momo',
    label: 'MoMo',
    logo: (
      <span className="pm-badge pm-momo">
        <svg viewBox="0 0 40 20" width="48" height="24" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="20" rx="4" fill="#a50064"/>
          <text x="50%" y="14" textAnchor="middle" fill="white" fontFamily="Arial" fontWeight="bold" fontSize="10">mo</text>
        </svg>
      </span>
    ),
    qrSrc: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=momo-payment-demo',
    qrBorderColor: '#a50064',
    instruction: (
      <>
        Scan this code using the <strong>MoMo App</strong> or <strong>your phone's camera</strong>.
      </>
    ),
  },
  {
    id: 'vnpay',
    label: 'VNPay',
    logo: (
      <span className="pm-badge pm-vnpay">
        <svg viewBox="0 0 40 20" width="48" height="24" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="20" rx="4" fill="#005baa"/>
          <text x="50%" y="14" textAnchor="middle" fill="white" fontFamily="Arial" fontWeight="bold" fontSize="9">VNPAY</text>
        </svg>
      </span>
    ),
    qrSrc: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=vnpay-payment-demo',
    qrBorderColor: '#005baa',
    instruction: (
      <>
        Scan this code using any <strong>VNPay-supported banking app</strong>.
      </>
    ),
  },
  {
    id: 'zalopay',
    label: 'ZaloPay',
    logo: (
      <span className="pm-badge pm-zalopay">
        <svg viewBox="0 0 48 20" width="56" height="24" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="20" rx="4" fill="#0068ff"/>
          <text x="50%" y="14" textAnchor="middle" fill="white" fontFamily="Arial" fontWeight="bold" fontSize="9">ZaloPay</text>
        </svg>
      </span>
    ),
    qrSrc: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=zalopay-payment-demo',
    qrBorderColor: '#0068ff',
    instruction: (
      <>
        Scan this code using the <strong>ZaloPay App</strong> or <strong>your phone's camera</strong>.
      </>
    ),
  },
];

// ── SVG Icons ────────────────────────────────────────────────────────────────
const SVGIcons = {
  delivery: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>,
  stall: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
  spinner: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spinner-icon"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>,
  back: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>,
  confirmPlus: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const formatCurrency = (amount) =>
  Number(amount).toLocaleString('vi-VN') + 'VND';

const DELIVERY_FEE = 10000;
const DISCOUNT = 20000;

// ── Component ────────────────────────────────────────────────────────────────
const Checkout = () => {
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);

  const [deliveryOption, setDeliveryOption] = useState('delivery');
  const [room, setRoom] = useState('A1.409');
  const [selectedPayment, setSelectedPayment] = useState('momo');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // ── Mock data ────────────────────────────────────────────────────────────
  useEffect(() => {
    setOrder({
      id: 1,
      customer_name: 'Nguyen Van A',
      customer_phone: '(+84) 901 234 567',
      store_name: 'Stall A',
    });
    setItems([
      { id: 1, product_id: 101, product_name: 'Cơm tấm sườn', store_name: 'Stall A', unit_price: 45000, quantity: 2 },
      { id: 2, product_id: 102, product_name: 'Trà sữa trân châu', store_name: 'Stall A', unit_price: 35000, quantity: 1 },
      { id: 3, product_id: 103, product_name: 'Bánh mì thịt nướng', store_name: 'Stall A', unit_price: 25000, quantity: 4 },
    ]);
    setLoading(false);
  }, []);

  // ── Confirm Payment ───────────────────────────────────────────────────────
  const handleConfirmPayment = async () => {
    if (!agreedToTerms) {
      setError('Please accept the terms of user agreement to proceed.');
      return;
    }
    if (!items.length) return;

    setCheckoutLoading(true);
    setError(null);

    try {
      // TODO: replace with real API call when backend is ready
      await new Promise((res) => setTimeout(res, 1200)); // simulate network
      setSuccessMsg('🎉 Payment confirmed! Your order is being prepared.');
      setItems([]);
      setOrder(null);
    } catch (err) {
      setError(`Payment failed: ${err.message}`);
    } finally {
      setCheckoutLoading(false);
    }
  };

  // ── Derived totals ────────────────────────────────────────────────────────
  const subTotal = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
  const grandTotal = subTotal - DISCOUNT + (deliveryOption === 'delivery' ? DELIVERY_FEE : 0);

  const activePayment = PAYMENT_METHODS.find((m) => m.id === selectedPayment);

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="checkout-page">
        <div className="checkout-loading-state">
          {SVGIcons.spinner}
          <p>Loading checkout…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">

        {/* ── Error / Success banners ── */}
        {error && (
          <div className="checkout-alert checkout-alert--error" role="alert">
            {error}
            <button className="checkout-alert-close" onClick={() => setError(null)}>✕</button>
          </div>
        )}
        {successMsg && (
          <div className="checkout-alert checkout-alert--success" role="status">
            {successMsg}
          </div>
        )}

        {/* ── Left: Payment panel ── */}
        <main className="checkout-main">
          <button className="back-link" onClick={() => window.history.back()}>
            {SVGIcons.back}
            <span>Back</span>
          </button>

          <h1 className="checkout-title">Checkout</h1>

          <div className="payment-panel">
            {/* Payment method selector */}
            <div className="payment-method-row">
              <span className="payment-method-label">Payment method:</span>
              <div className="payment-method-options">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.id}
                    id={`pm-btn-${m.id}`}
                    className={`pm-option-btn${selectedPayment === m.id ? ' active' : ''}`}
                    onClick={() => setSelectedPayment(m.id)}
                    aria-label={m.label}
                  >
                    {m.logo}
                  </button>
                ))}
              </div>
            </div>

            {/* QR code display */}
            {activePayment && (
              <div className="qr-code-section">
                <div
                  className="qr-code-frame"
                  style={{ borderColor: activePayment.qrBorderColor }}
                >
                  <img
                    src={activePayment.qrSrc}
                    alt={`${activePayment.label} QR Code`}
                    className="qr-code-img"
                  />
                  {selectedPayment === 'momo' && (
                    <div className="qr-momo-overlay">
                      <svg viewBox="0 0 40 20" width="52" height="26" xmlns="http://www.w3.org/2000/svg">
                        <rect width="40" height="20" rx="4" fill="#a50064"/>
                        <text x="50%" y="14" textAnchor="middle" fill="white" fontFamily="Arial" fontWeight="bold" fontSize="10">mo</text>
                      </svg>
                    </div>
                  )}
                </div>
                <p className="qr-instruction">{activePayment.instruction}</p>
              </div>
            )}
          </div>
        </main>

        {/* ── Right: Delivery info sidebar ── */}
        <aside className="checkout-sidebar">
          <h2 className="delivery-title">Delivery Info</h2>

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
                placeholder="Enter your room"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
              />
            </div>
            <div className="info-row">
              <span className="info-label">Name:</span>
              <span className="info-value">{order?.customer_name || 'Nguyen Van A'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Phone:</span>
              <span className="info-value">{order?.customer_phone || '(+84) 901 234 567'}</span>
            </div>

            {/* Pickup / Delivery toggle */}
            <div className="pickup-options-section">
              <div className="info-label">Pickup options:</div>
              <div className="pickup-buttons">
                <button
                  id="pickup-delivery-btn"
                  className={`pickup-btn${deliveryOption === 'delivery' ? ' active' : ''}`}
                  onClick={() => setDeliveryOption('delivery')}
                >
                  <div className="pickup-icon">{SVGIcons.delivery}</div>
                  <div className="pickup-title">Delivery</div>
                  <div className="pickup-time">Estimated waiting time – 20 mins</div>
                </button>
                <button
                  id="pickup-stall-btn"
                  className={`pickup-btn${deliveryOption === 'pickup' ? ' active' : ''}`}
                  onClick={() => setDeliveryOption('pickup')}
                >
                  <div className="pickup-icon">{SVGIcons.stall}</div>
                  <div className="pickup-title">Pickup at stalls</div>
                  <div className="pickup-time">Estimated waiting time – 10 mins</div>
                </button>
              </div>
            </div>

            {/* Order summary */}
            <div className="summary-section">
              <div className="summary-row">
                <span className="summary-label">Sub Total:</span>
                <span className="summary-value">{formatCurrency(subTotal)}</span>
              </div>
              <div className="summary-row discount-row">
                <span className="summary-label">Discount:</span>
                <span className="summary-value discount-value">-{formatCurrency(DISCOUNT)}</span>
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

          {/* Terms checkbox */}
          <label className="terms-checkbox-label" htmlFor="terms-checkbox">
            <input
              type="checkbox"
              id="terms-checkbox"
              className="terms-checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />
            <span>
              By confirming the order, I accept the{' '}
              <a href="#terms" className="terms-link">terms of user</a>{' '}
              agreement
            </span>
          </label>

          {/* Confirm Payment button */}
          <button
            id="confirm-payment-btn"
            className="confirm-payment-btn"
            onClick={handleConfirmPayment}
            disabled={checkoutLoading || items.length === 0 || !agreedToTerms}
          >
            <span className="confirm-payment-icon">
              {checkoutLoading ? SVGIcons.spinner : SVGIcons.confirmPlus}
            </span>
            <span>{checkoutLoading ? 'Processing…' : 'Confirm Payment'}</span>
          </button>
        </aside>

      </div>
    </div>
  );
};

export default Checkout;