import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminLoggedIn = localStorage.getItem('adminToken');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    navigate('/');
  };

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            Civic<span className="text-yellow-300">Track</span>
          </Link>

          <nav className="flex gap-6 items-center">
            {!isAdminLoggedIn ? (
              <>
                <Link
                  to="/"
                  className={`hover:text-blue-200 transition ${
                    location.pathname === '/' ? 'border-b-2 border-white' : ''
                  }`}
                >
                  Report Issue
                </Link>
                <Link
                  to="/track-status"
                  className={`hover:text-blue-200 transition ${
                    location.pathname === '/track-status' ? 'border-b-2 border-white' : ''
                  }`}
                >
                  Track Status
                </Link>
                <Link
                  to="/admin-login"
                  className={`hover:text-blue-200 transition ${
                    location.pathname === '/admin-login' ? 'border-b-2 border-white' : ''
                  }`}
                >
                  Admin Login
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/admin-dashboard"
                  className={`hover:text-blue-200 transition ${
                    location.pathname === '/admin-dashboard' ? 'border-b-2 border-white' : ''
                  }`}
                >
                  Dashboard
                </Link>
                <span className="text-sm bg-blue-700 px-3 py-1 rounded">
                  {localStorage.getItem('adminUsername')}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
