import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

/**
 * Login with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Login response with token and user data
 */
const login = async (email, password) => {
  console.log('[authService] Login initiated for email:', email);
  console.log('[authService] API_URL:', API_URL);

  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    console.log('[authService] Login API response status:', response.status);
    console.log('[authService] Login API response data:', response.data);

    if (response.data.success && response.data.token) {
      console.log('[authService] Login successful, storing token and user in localStorage');
      // Store token and user in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      console.log('[authService] Token and user stored successfully');
    } else {
      console.log('[authService] Login response indicated failure:', response.data.error);
    }

    console.log('Token:', localStorage.getItem('token'));
    console.log('User:', JSON.parse(localStorage.getItem('user')));

    return response.data;
  } catch (error) {
    console.error('[authService] Login API error:', error.message);
    console.error('[authService] Error details:', error.response?.data);
    throw error;
  }
};

/**
 * Register a new customer account
 * @param {Object} userData - User registration data
 * @param {string} userData.userName - User's name
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @param {string} [userData.phone] - User's phone number
 * @returns {Promise<Object>} Registration response with token and user data
 */
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);

  if (response.data.success && response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }

  return response.data;
};

/**
 * Logout - clear localStorage
 */
const logout = () => {
  console.log('[authService] Logout initiated - clearing localStorage');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('[authService] localStorage cleared successfully');
};

/**
 * Get current logged-in user from localStorage
 * @returns {Object|null} User data or null
 */
const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  console.log('[authService] getCurrentUser called, user found:', !!user);
  return user ? JSON.parse(user) : null;
};

/**
 * Get auth token from localStorage
 * @returns {string|null} JWT token or null
 */
const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
const isAuthenticated = () => {
  const hasToken = !!getToken();
  console.log('[authService] isAuthenticated called, has token:', hasToken);
  return hasToken;
};

/**
 * Get user role
 * @returns {string|null} User role name or null
 */
const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role?.roleName || null;
};

/**
 * Check if current user is a vendor
 * @returns {boolean}
 */
const isVendor = () => {
  const role = getUserRole();
  const vendorCheck = role === 'Vendor';
  console.log('[authService] isVendor called, role:', role, 'is vendor:', vendorCheck);
  return vendorCheck;
};

/**
 * Check if current user is an admin
 * @returns {boolean}
 */
const isAdmin = () => {
  return getUserRole() === 'Admin';
};

/**
 * Check if current user is a customer
 * @returns {boolean}
 */
const isCustomer = () => {
  return getUserRole() === 'Customer';
};

/**
 * Check if current user is a manager
 * @returns {boolean}
 */
const isManager = () => {
  return getUserRole() === 'Manager';
};

const authService = {
  login,
  register,
  logout,
  getCurrentUser,
  getToken,
  isAuthenticated,
  getUserRole,
  isVendor,
  isAdmin,
  isCustomer,
  isManager,
};

export default authService;
