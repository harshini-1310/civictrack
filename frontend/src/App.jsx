import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import TrackStatus from './pages/TrackStatus';
import { Home as HomeIcon, ArrowLeft } from 'lucide-react';

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
          className="mb-8"
        >
          <span className="text-9xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            404
          </span>
        </motion.div>
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Page Not Found</h1>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved to a different location.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all"
            >
              <HomeIcon size={18} />
              Go Home
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-semibold rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-all"
          >
            <ArrowLeft size={18} />
            Go Back
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin-login' || location.pathname === '/admin-dashboard';
  const isHomePage = location.pathname === '/';
  const shouldShowHeader = !isAdminPage;

  return (
    <div className="flex flex-col min-h-screen">
      {shouldShowHeader && <Header />}

      <main className={`flex-grow ${shouldShowHeader && !isHomePage ? 'pt-16' : ''}`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageWrapper>
                  <Home />
                </PageWrapper>
              }
            />
            <Route
              path="/track-status"
              element={
                <PageWrapper>
                  <TrackStatus />
                </PageWrapper>
              }
            />
            <Route
              path="/admin-login"
              element={
                <PageWrapper>
                  <AdminLogin />
                </PageWrapper>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <PageWrapper>
                  <AdminDashboard />
                </PageWrapper>
              }
            />
            <Route
              path="*"
              element={
                <PageWrapper>
                  <NotFoundPage />
                </PageWrapper>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>

      {!isAdminPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
