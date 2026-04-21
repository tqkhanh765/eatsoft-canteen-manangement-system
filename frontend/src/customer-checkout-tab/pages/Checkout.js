import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/layout.css';
import '../styles/alerts.css';
import '../styles/states.css';
import '../styles/payment.css';
import '../styles/delivery.css';
import '../styles/summary.css';
import '../styles/buttons.css';
import '../styles/animations.css';

import { useCheckout, useCheckoutForm } from '../hooks/useCheckout';
import { usePayment } from '../hooks/usePayment';
import { SVGIcons } from '../constants/icons';
import { LOADING_MESSAGES } from '../constants/appConstants';

import PaymentPanel from '../components/PaymentPanel';
import DeliveryInfoCard from '../components/DeliveryInfoCard';
import OrderSummary from '../components/OrderSummary';
import TermsCheckbox from '../components/TermsCheckbox';
import ConfirmPaymentButton from '../components/ConfirmPaymentButton';

// ── Component ────────────────────────────────────────────────────────────────
const Checkout = () => {
  const navigate = useNavigate();
  const checkoutState = useCheckout();
  const formState = useCheckoutForm();
  const paymentState = usePayment(checkoutState, formState, navigate);

  const { order, items, loading, error, setError } = checkoutState;
  const { deliveryOption, room, selectedPayment, setDeliveryOption, setRoom, setSelectedPayment, agreedToTerms, setAgreedToTerms } = formState;
  const { checkoutLoading, successMsg, setSuccessMsg, handleConfirmPayment } = paymentState;

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="checkout-page">
        <div className="checkout-loading-state">
          {SVGIcons.spinner}
          <p>{LOADING_MESSAGES.CHECKOUT}</p>
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

          <PaymentPanel
            selectedPayment={selectedPayment}
            onPaymentChange={setSelectedPayment}
          />
        </main>

        {/* ── Right: Delivery info sidebar ── */}
        <aside className="checkout-sidebar">
          <h2 className="delivery-title">Delivery Info</h2>

          <DeliveryInfoCard
            order={order}
            deliveryOption={deliveryOption}
            room={room}
            onDeliveryChange={setDeliveryOption}
            onRoomChange={setRoom}
          />

          <OrderSummary
            items={items}
            deliveryOption={deliveryOption}
          />

          <TermsCheckbox
            agreedToTerms={agreedToTerms}
            onChange={setAgreedToTerms}
          />

          <ConfirmPaymentButton
            onClick={handleConfirmPayment}
            disabled={checkoutLoading || items.length === 0 || !agreedToTerms}
            isLoading={checkoutLoading}
          />
        </aside>

      </div>
    </div>
  );
};

export default Checkout;