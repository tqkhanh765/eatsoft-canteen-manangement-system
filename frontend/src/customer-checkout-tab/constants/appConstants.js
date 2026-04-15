// ── Payment methods ───────────────────────────────────────────────────────────
export const PAYMENT_METHODS = [
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

// ── Pricing constants ───────────────────────────────────────────────────────────
export const DELIVERY_FEE = 10000;
export const DISCOUNT = 20000;

// ── Default values ───────────────────────────────────────────────────────────────
export const DEFAULT_ROOM = 'A1.409';
export const DEFAULT_PAYMENT_METHOD = 'momo';
export const DEFAULT_DELIVERY_OPTION = 'delivery';
export const DEFAULT_LOCATION = 'IU Campus, Quarter 6, Linh Trung Ward';
export const DEFAULT_CUSTOMER_NAME = 'Nguyen Van A';
export const DEFAULT_CUSTOMER_PHONE = '(+84) 901 234 567';

// ── Loading messages ───────────────────────────────────────────────────────────
export const LOADING_MESSAGES = {
  CHECKOUT: 'Loading checkout…',
  PAYMENT: 'Processing…',
};

// ── Error messages ────────────────────────────────────────────────────────────
export const ERROR_MESSAGES = {
  TERMS_REQUIRED: 'Please accept the terms of user agreement to proceed.',
  PAYMENT_FAILED: 'Payment failed',
};
