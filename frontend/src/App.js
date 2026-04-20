import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './homepage/components/AuthModal';
import VendorMenuPage from './vendor-menu-management/pages/VendorMenuPage';
import HomePage from './homepage/pages/HomePage';
import OrderHistory from './customer/OrderHistory';
import ProfilePage from './customer/ProfilePage';
import OrderCart from './customer-order-tab/pages/OrderCart';
import Checkout from './customer-checkout-tab/pages/Checkout';
import Dashboard from './vendor-dashboard/pages/Dashboard';
import Orders from './vendor-dashboard/pages/Orders';
import { OrderProvider } from './vendor-dashboard/context/OrderContext';
import FoodStallsPage from './food-stalls/pages/FoodStallsPage';
import StallMenuPage from './stall-menu/pages/StallMenuPage';
import VendorMenu from './vendor-tracking/pages/VendorMenu';
import authService from './services/authService';
import './App.css';

// Protected Route wrapper - redirects to home if not authenticated or not vendor
const ProtectedVendorRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    console.log('[ProtectedVendorRoute] Checking authorization...');
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      const isVendor = authService.isVendor();
      console.log('[ProtectedVendorRoute] isAuth:', isAuth, 'isVendor:', isVendor);

      const authorized = isAuth && isVendor;
      console.log('[ProtectedVendorRoute] Authorization result:', authorized);

      setIsAuthorized(authorized);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  if (isLoading) {
    console.log('[ProtectedVendorRoute] Still loading...');
    return <div className="loading-screen">Loading...</div>;
  }

  if (!isAuthorized) {
    console.log('[ProtectedVendorRoute] Not authorized, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('[ProtectedVendorRoute] Authorized, rendering children');
  return children;
};

// Main Layout with Navbar and Footer for public pages
const MainLayout = ({ onLoginClick, user, onLogout, children }) => (
  <>
    <Navbar onLoginClick={onLoginClick} user={user} onLogout={onLogout} />
    {children}
    <Footer />
  </>
);

// Protected Route wrapper for authenticated users
const ProtectedRoute = ({ children, onLoginClick }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('[ProtectedRoute] Checking authorization...');
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      console.log('[ProtectedRoute] isAuth:', isAuth);

      setIsAuthorized(isAuth);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  if (isLoading) {
    console.log('[ProtectedRoute] Still loading...');
    return <div className="loading-screen">Loading...</div>;
  }

  if (!isAuthorized) {
    console.log('[ProtectedRoute] Not authorized, triggering login modal');
    onLoginClick('login');
    navigate('/');
    return null;
  }

  console.log('[ProtectedRoute] Authorized, rendering children');
  return children;
};

function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authView, setAuthView] = useState('login');
  const [user, setUser] = useState(null);

  // Check for logged-in user on mount
  useEffect(() => {
    console.log('[App] Component mounted, checking for existing user...');
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      console.log('[App] Found existing user:', currentUser.userName, 'Role:', currentUser.role?.roleName);
      setUser(currentUser);
    } else {
      console.log('[App] No existing user found');
    }
  }, []);

  const openAuth = useCallback((view = 'login') => {
    console.log('[App] openAuth called with view:', view);
    setAuthView(view);
    setAuthOpen(true);
    console.log('[App] authOpen set to true');
  }, []);

  const closeAuth = useCallback(() => setAuthOpen(false), []);

  // Handle successful login
  const handleLoginSuccess = useCallback((userData) => {
    console.log('[App] Login success handler called with user:', userData?.userName);
    setUser(userData);
    closeAuth();
    console.log('[App] User state updated and auth modal closed');
  }, [closeAuth]);

  // Handle logout
  const handleLogout = useCallback(() => {
    console.log('[App] Logout handler called');
    authService.logout();
    setUser(null);
    console.log('[App] User state cleared, redirecting to home');
    window.location.href = '/';
  }, []);

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public Homepage - default route */}
          <Route
            path="/"
            element={
              <MainLayout onLoginClick={openAuth} user={user} onLogout={handleLogout}>
                <HomePage />
              </MainLayout>
            }
          />

          {/* Food Stalls Page - public/semi-public route */}
          <Route
            path="/stalls"
            element={
              <MainLayout onLoginClick={openAuth} user={user} onLogout={handleLogout}>
                <FoodStallsPage />
              </MainLayout>
            }
          />

          {/* Stall Menu Page - public/semi-public route */}
          <Route
            path="/stalls-menu/:stallId"
            element={
              <MainLayout onLoginClick={openAuth} user={user} onLogout={handleLogout}>
                <StallMenuPage />
              </MainLayout>
            }
          />

          {/* Order History Page - requires authentication */}
          <Route
            path="/order-history"
            element={
              <ProtectedRoute onLoginClick={openAuth}>
                <MainLayout onLoginClick={openAuth} user={user} onLogout={handleLogout}>
                  <ProfilePage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* User Profile Page - requires authentication */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute onLoginClick={openAuth}>
                <MainLayout onLoginClick={openAuth} user={user} onLogout={handleLogout}>
                  <ProfilePage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Cart Page - requires authentication */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute onLoginClick={openAuth}>
                <MainLayout onLoginClick={openAuth} user={user} onLogout={handleLogout}>
                  <OrderCart />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Checkout Page - requires authentication */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute onLoginClick={openAuth}>
                <MainLayout onLoginClick={openAuth} user={user} onLogout={handleLogout}>
                  <Checkout />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Protected Vendor Menu Page */}
          <Route
            path="/vendor-menu"
            element={
              <ProtectedVendorRoute>
                <VendorMenuPage user={user} onLogout={handleLogout} />
              </ProtectedVendorRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedVendorRoute>
                <Dashboard user={user} onLogout={handleLogout} />
              </ProtectedVendorRoute>
            }
          />

          {/* Order Tracking Page - requires vendor authentication */}
          <Route
            path="/vendor-tracking"
            element={
              <ProtectedVendorRoute>
                <VendorMenu user={user} onLogout={handleLogout} />
              </ProtectedVendorRoute>
            }
          />

          {/* All Orders Page - requires vendor authentication */}
          <Route
            path="/vendor-orders"
            element={
              <ProtectedVendorRoute>
                <OrderProvider>
                  <Orders user={user} onLogout={handleLogout} />
                </OrderProvider>
              </ProtectedVendorRoute>
            }
          />

          {/* Redirect all other routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Auth Modal - shown on homepage when triggered */}
        <AuthModal
          isOpen={authOpen}
          defaultView={authView}
          onClose={closeAuth}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    </Router>
  );
}

export default App;

