import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './homepage/components/AuthModal';
import StallRegistrationForm from './components/StallRegistrationForm';
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
import VendorTrackingApp from './vendor-tracking/config/API';
import ManagerDashboard from './manager/pages/ManagerDashboard';
import AnnouncementList from './manager/pages/AnnouncementList';
import AnnouncementCreate from './manager/pages/AnnouncementCreate';
import AnnouncementDetail from './manager/pages/AnnouncementDetail';
import StallManagement from './manager/pages/StallManagement';
import StallDetail from './manager/pages/StallDetail';
import StallRequests from './manager/pages/StallRequests';
import AdminDashboard from './admin-dashboard/pages/AdminDashboard';
import AdminRegistrations from './admin-dashboard/pages/AdminRegistrations';
import AdminUsers from './admin-dashboard/pages/AdminUsers';
import AdminStores from './admin-dashboard/pages/AdminStores';
import AdminAnnouncements from './admin-dashboard/pages/AdminAnnouncements';
import AdminAnalytics from './admin-dashboard/pages/AdminAnalytics';
import authService from './services/authService';
import './App.css';

// Protected Route wrapper for customers only - excludes vendors and managers
const ProtectedCustomerRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    console.log('[ProtectedCustomerRoute] Checking authorization...');
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      const isVendor = authService.isVendor();
      const isManager = authService.isManager?.() || authService.getUserRole() === 'Manager';
      console.log('[ProtectedCustomerRoute] isAuth:', isAuth, 'isVendor:', isVendor, 'isManager:', isManager);

      const authorized = isAuth && !isVendor && !isManager;
      console.log('[ProtectedCustomerRoute] Authorization result:', authorized);

      setIsAuthorized(authorized);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  if (isLoading) {
    console.log('[ProtectedCustomerRoute] Still loading...');
    return <div className="loading-screen">Loading...</div>;
  }

  if (!isAuthorized) {
    console.log('[ProtectedCustomerRoute] Not authorized, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('[ProtectedCustomerRoute] Authorized, rendering children');
  return children;
};

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

// Protected Route wrapper - redirects to home if not authenticated or not manager
const ProtectedManagerRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    console.log('[ProtectedManagerRoute] Checking authorization...');
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      const isManager = authService.isManager?.() || authService.getUserRole() === 'Manager';
      console.log('[ProtectedManagerRoute] isAuth:', isAuth, 'isManager:', isManager);

      const authorized = isAuth && isManager;
      console.log('[ProtectedManagerRoute] Authorization result:', authorized);

      setIsAuthorized(authorized);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  if (isLoading) {
    console.log('[ProtectedManagerRoute] Still loading...');
    return <div className="loading-screen">Loading...</div>;
  }

  if (!isAuthorized) {
    console.log('[ProtectedManagerRoute] Not authorized, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('[ProtectedManagerRoute] Authorized, rendering children');
  return children;
};

// Protected Route wrapper - redirects to home if not authenticated or not admin
const ProtectedAdminRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      const isAdmin = authService.getUserRole?.() === 'Admin';
      setIsAuthorized(isAuth && isAdmin);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  if (isLoading) return <div className="loading-screen">Loading...</div>;
  if (!isAuthorized) return <Navigate to="/" replace />;
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
  const [stallRegOpen, setStallRegOpen] = useState(false);

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

  // Open stall registration form (close auth modal first)
  const openStallRegistration = useCallback(() => {
    console.log('[App] Opening stall registration form');
    setAuthOpen(false); // Close auth modal
    setStallRegOpen(true); // Open stall registration
  }, []);

  const closeStallRegistration = useCallback(() => setStallRegOpen(false), []);

  // Handle successful login
  const handleLoginSuccess = useCallback((userData) => {
    console.log('[App] Login success handler called with user:', userData?.userName);
    setUser(userData);
    closeAuth();
    // Redirect admin to admin portal
    if (userData?.role?.roleName === 'Admin') {
      window.location.href = '/admin/dashboard';
    }
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
                <StallMenuPage onLoginClick={openAuth} />
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

          {/* Cart Page - requires authentication and customer role */}
          <Route
            path="/cart"
            element={
              <ProtectedCustomerRoute>
                <MainLayout onLoginClick={openAuth} user={user} onLogout={handleLogout}>
                  <OrderCart />
                </MainLayout>
              </ProtectedCustomerRoute>
            }
          />

          {/* Checkout Page - requires authentication and customer role */}
          <Route
            path="/checkout"
            element={
              <ProtectedCustomerRoute>
                <MainLayout onLoginClick={openAuth} user={user} onLogout={handleLogout}>
                  <Checkout />
                </MainLayout>
              </ProtectedCustomerRoute>
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
                <VendorTrackingApp user={user} />
              </ProtectedVendorRoute>
            }
          />

          {/* All Orders Page - requires vendor authentication */}
          <Route
            path="/vendor-orders"
            element={
              <ProtectedVendorRoute>
                <OrderProvider user={user}>
                  <Orders user={user} onLogout={handleLogout} />
                </OrderProvider>
              </ProtectedVendorRoute>
            }
          />

          {/* Manager Dashboard Page - requires manager authentication */}
          <Route
            path="/manager-dashboard"
            element={
              <ProtectedManagerRoute>
                <ManagerDashboard user={user} onLogout={handleLogout} />
              </ProtectedManagerRoute>
            }
          />

          {/* Manager Announcement Pages - requires manager authentication */}
          <Route
            path="/manager-announcement"
            element={
              <ProtectedManagerRoute>
                <AnnouncementList user={user} onLogout={handleLogout} />
              </ProtectedManagerRoute>
            }
          />
          <Route
            path="/manager-announcement/create"
            element={
              <ProtectedManagerRoute>
                <AnnouncementCreate user={user} onLogout={handleLogout} />
              </ProtectedManagerRoute>
            }
          />
          <Route
            path="/manager-announcement/:id"
            element={
              <ProtectedManagerRoute>
                <AnnouncementDetail user={user} onLogout={handleLogout} />
              </ProtectedManagerRoute>
            }
          />

          <Route
            path="/manager-stalls"
            element={
              <ProtectedManagerRoute>
                <StallManagement user={user} onLogout={handleLogout} />
              </ProtectedManagerRoute>
            }
          />
          <Route
            path="/manager-stalls/:id"
            element={
              <ProtectedManagerRoute>
                <StallDetail user={user} onLogout={handleLogout} />
              </ProtectedManagerRoute>
            }
          />
          <Route
            path="/manager-stalls/requests"
            element={
              <ProtectedManagerRoute>
                <StallRequests user={user} onLogout={handleLogout} />
              </ProtectedManagerRoute>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/dashboard"
            element={<ProtectedAdminRoute><AdminDashboard user={user} onLogout={handleLogout} /></ProtectedAdminRoute>}
          />
          <Route path="/admin/registrations"
            element={<ProtectedAdminRoute><AdminRegistrations user={user} onLogout={handleLogout} /></ProtectedAdminRoute>}
          />
          <Route path="/admin/users"
            element={<ProtectedAdminRoute><AdminUsers user={user} onLogout={handleLogout} /></ProtectedAdminRoute>}
          />
          <Route path="/admin/stores"
            element={<ProtectedAdminRoute><AdminStores user={user} onLogout={handleLogout} /></ProtectedAdminRoute>}
          />
          <Route path="/admin/announcements"
            element={<ProtectedAdminRoute><AdminAnnouncements user={user} onLogout={handleLogout} /></ProtectedAdminRoute>}
          />
          <Route path="/admin/analytics"
            element={<ProtectedAdminRoute><AdminAnalytics user={user} onLogout={handleLogout} /></ProtectedAdminRoute>}
          />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

          {/* Redirect all other routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Auth Modal - shown on homepage when triggered */}
        <AuthModal
          isOpen={authOpen}
          defaultView={authView}
          onClose={closeAuth}
          onLoginSuccess={handleLoginSuccess}
          onRegisterStall={openStallRegistration}
        />

        {/* Stall Registration Modal */}
        <StallRegistrationForm
          isOpen={stallRegOpen}
          onClose={closeStallRegistration}
          onSuccess={() => {
            console.log('[App] Stall registration submitted successfully');
          }}
        />
      </div>
    </Router>
  );
}

export default App;

