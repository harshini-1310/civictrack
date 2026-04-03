import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../services/axiosClient';
import './AdminLogin.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    adminCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminCode, setShowAdminCode] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axiosClient.post('/auth/login', formData);

      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminUsername', response.data.admin.username);
        navigate('/admin-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axiosClient.post('/auth/register', formData);

      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminUsername', response.data.admin.username);
        navigate('/admin-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = showRegister ? handleRegister : handleLogin;

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate('/');
  };

  return (
    <div className="admin-login-modern">
      <div className="admin-login-shell">
        <div className="admin-login-card">
          <button
            type="button"
            onClick={handleGoBack}
            className="admin-login-back"
          >
            Go Back
          </button>

          <h1 className="admin-login-title">
            {showRegister ? 'Create Account' : 'Admin Login'}
          </h1>
          <p className="admin-login-subtitle">
            {showRegister ? 'Register a new admin account' : 'Sign in to access the dashboard'}
          </p>

          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="admin-login-group">
              <label htmlFor="username" className="admin-login-label">
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="admin-login-input"
                required
              />
            </div>

            <div className="admin-login-group">
              <label htmlFor="password" className="admin-login-label">
                Password
              </label>
              <div className="admin-login-input-row">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="admin-login-input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="admin-login-visibility-btn"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {showRegister && (
              <div className="admin-login-group">
                <label htmlFor="adminCode" className="admin-login-label">
                  Admin Code
                </label>
                <div className="admin-login-input-row">
                  <input
                    id="adminCode"
                    type={showAdminCode ? 'text' : 'password'}
                    name="adminCode"
                    value={formData.adminCode}
                    onChange={handleChange}
                    placeholder="Enter admin registration code"
                    className="admin-login-input"
                    required={showRegister}
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminCode(!showAdminCode)}
                    className="admin-login-visibility-btn"
                    aria-label={showAdminCode ? 'Hide admin code' : 'Show admin code'}
                  >
                    {showAdminCode ? 'Hide' : 'Show'}
                  </button>
                </div>
                <p className="admin-login-helper">
                  Contact your administrator for the registration code.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="admin-login-submit"
            >
              {loading
                ? showRegister
                  ? 'Creating Account...'
                  : 'Signing In...'
                : showRegister
                  ? 'Create Account'
                  : 'Sign In'}
            </button>
          </form>

          <p className="admin-login-footer">
            {showRegister ? 'Already have an account?' : 'New admin user?'}{' '}
            <button
              type="button"
              onClick={() => {
                setShowRegister(!showRegister);
                setError('');
                setFormData({ username: '', password: '', adminCode: '' });
              }}
              className="admin-login-toggle"
            >
              {showRegister ? 'Sign In' : 'Register'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
