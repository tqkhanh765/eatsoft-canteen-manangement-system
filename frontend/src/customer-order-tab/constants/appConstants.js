// Application Constants
export const APP_CONSTANTS = {
  // User and Authentication
  MOCK_USER_ID: 1,
  
  // Pricing
  DELIVERY_FEE: 10000,
  DEFAULT_DISCOUNT: 0,
  
  // Order Status
  ORDER_STATUS: {
    PENDING: 'PENDING',
    COOKING: 'COOKING',
    COMPLETED: 'COMPLETED'
  },
  
  // Delivery Options
  DELIVERY_OPTIONS: {
    DELIVERY: 'delivery',
    PICKUP: 'pickup'
  },
  
  // Delivery Time Estimates (in minutes)
  DELIVERY_TIMES: {
    DELIVERY: 20,
    PICKUP: 10
  },
  
  // Location
  DEFAULT_LOCATION: 'IU Campus, Quarter 6, Linh Trung Ward',
  
  // Default Customer Name
  DEFAULT_CUSTOMER_NAME: 'Nguyen Van A',
  
  // Loading Messages
  LOADING_MESSAGES: {
    CART: 'Loading your cart...',
    CHECKOUT: 'Placing order...'
  },
  
  // Success Messages
  SUCCESS_MESSAGES: {
    CHECKOUT: 'Order placed successfully! Sit tight - your food is being prepared.'
  },
  
  // Error Messages
  ERROR_MESSAGES: {
    ROOM_REQUIRED: 'Please enter your room number before checking out.',
    UPDATE_QUANTITY: 'Could not update quantity: ',
    REMOVE_ITEM: 'Could not remove item: ',
    CHECKOUT: 'Checkout failed: '
  }
};
