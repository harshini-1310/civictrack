import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Menu, X, LogOut, LayoutDashboard, FileText, Search, User, ChevronRight } from 'lucide-react';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminLoggedIn = localStorage.getItem('adminToken');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 18);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const navLinks = !isAdminLoggedIn
    ? [
        { path: '/', label: 'Report Issue', icon: FileText },
        { path: '/track-status', label: 'Track Status', icon: Search },
        { path: '/admin-login', label: 'Admin', icon: User },
      ]
    : [{ path: '/admin-dashboard', label: 'Dashboard', icon: LayoutDashboard }];

  const adminUsername = localStorage.getItem('adminUsername') || 'Admin';

  return (
    <header className={`app-navbar ${isScrolled ? 'is-scrolled' : 'is-top'}`}>
      <div className="app-navbar-inner">
        <Link to="/" className="app-brand">
          <span className="app-brand-badge">CT</span>
          <span className="app-brand-text">
            <span className="app-brand-title">CivicTrack</span>
            <span className="app-brand-subtitle">Community First</span>
          </span>
        </Link>

        <nav className="app-nav-desktop">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;

            return (
              <Link key={link.path} to={link.path} className={`app-nav-link ${isActive ? 'active' : ''}`}>
                <Icon size={16} />
                <span>{link.label}</span>
              </Link>
            );
          })}

          {isAdminLoggedIn && (
            <>
              <span className="app-nav-divider" />
              <div className="app-admin-chip" title={adminUsername}>
                <span className="app-admin-avatar">{adminUsername.charAt(0).toUpperCase()}</span>
                <span className="app-admin-name">{adminUsername}</span>
              </div>
              <button type="button" className="app-nav-btn app-nav-btn-danger" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          )}
        </nav>

        <button
          type="button"
          className="app-nav-toggle"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="app-nav-mobile">
          <nav className="app-nav-mobile-list">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const Icon = link.icon;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`app-nav-mobile-link ${isActive ? 'active' : ''}`}
                >
                  <span className="app-nav-mobile-left">
                    <Icon size={16} />
                    <span>{link.label}</span>
                  </span>
                  <ChevronRight size={16} />
                </Link>
              );
            })}

            {isAdminLoggedIn && (
              <>
                <div className="app-nav-mobile-divider" />
                <div className="app-admin-chip app-admin-chip-mobile" title={adminUsername}>
                  <span className="app-admin-avatar">{adminUsername.charAt(0).toUpperCase()}</span>
                  <span className="app-admin-name">{adminUsername}</span>
                </div>
                <button type="button" className="app-nav-mobile-link app-nav-mobile-logout" onClick={handleLogout}>
                  <span className="app-nav-mobile-left">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </span>
                  <ChevronRight size={16} />
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}




