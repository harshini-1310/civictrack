import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../services/axiosClient';

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center py-12">
      <div className="container mx-auto px-4 max-w-md">
        <div className="card">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {showRegister ? '🔐 Create Admin Account' : '🔐 Admin Login'}
            </h2>
            <p className="text-gray-600">
              {showRegister
                ? 'Create a new admin account'
                : 'Access the administration dashboard'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg text-sm">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="input-field"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="input-field"
                required
              />
            </div>

            {/* Admin Code (only in register mode) */}
            {showRegister && (
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Admin Code</label>
                <input
                  type="password"
                  name="adminCode"
                  value={formData.adminCode}
                  onChange={handleChange}
                  placeholder="Enter admin code"
                  className="input-field"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  🔐 Admin code is required to create an admin account
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Processing...' : showRegister ? '✓ Create Account' : '📝 Login'}
            </button>
          </form>

          {/* Toggle between login and register */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600">
              {showRegister ? "Already have an account? " : "New admin user? "}
              <button
                onClick={() => {
                  setShowRegister(!showRegister);
                  setError('');
                  setFormData({ username: '', password: '', adminCode: '' });
                }}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                {showRegister ? 'Login' : 'Register'}
              </button>
            </p>
          </div>

          {/* Demo info */}
          {!showRegister && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg text-xs text-gray-600">
              <p className="font-semibold mb-2">🆓 Demo Instructions:</p>
              <p>• New users can register a new admin account</p>
              <p>• Choose a username and password (min. 6 characters)</p>
              <p>• Enter the admin code to verify registration</p>
              <p>• Login to access the dashboard</p>
            </div>
          )}

          {/* Registration Info */}
          {showRegister && (
            <div className="mt-6 p-4 bg-orange-50 rounded-lg text-xs text-gray-600">
              <p className="font-semibold mb-2">🔐 Admin Code Required:</p>
              <p>• Admin code is required to create an admin account</p>
              <p>• This prevents unauthorized admin registration</p>
              <p>• Contact your system administrator if you don't have the code</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
