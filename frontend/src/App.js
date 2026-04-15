import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './homepage/components/AuthModal';
import VendorMenuPage from './vendor-menu-management/pages/VendorMenuPage';
import HomePage from './homepage/pages/HomePage';
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
const MainLayout = ({ onLoginClick, user, onLogout }) => (
  <>
    <Navbar onLoginClick={onLoginClick} user={user} onLogout={onLogout} />
    <HomePage />
    <Footer />
  </>
);

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
            element={<MainLayout onLoginClick={openAuth} user={user} onLogout={handleLogout} />}
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

