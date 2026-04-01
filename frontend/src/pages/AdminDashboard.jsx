import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, CheckCircle, AlertCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import axiosClient from '../services/axiosClient';
import ComplaintCardClickable from '../components/ComplaintCardClickable';
import ComplaintDrawer from '../components/ComplaintDrawer';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in - IMPORTANT: Protect this route
    const token = localStorage.getItem('adminToken');
    if (!token) {
      // Redirect to login immediately if not authenticated
      navigate('/admin-login', { replace: true });
      return;
    }

    fetchComplaints();
  }, [navigate]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/complaints');

      if (response.data.success) {
        setComplaints(response.data.data);
        setSummary(response.data.summary);
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch complaints. Please try again.');
      if (err.response?.status === 401) {
        navigate('/admin-login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleComplaintUpdate = (updatedComplaint) => {
    setComplaints((prev) =>
      prev.map((c) => (c._id === updatedComplaint._id ? updatedComplaint : c))
    );

    // Refresh summary
    fetchComplaints();
  };

  // Filter complaints
  const filteredComplaints = complaints.filter((complaint) => {
    const matchStatus = filterStatus === 'All' || complaint.status === filterStatus;
    const matchSeverity = filterSeverity === 'All' || complaint.severity === filterSeverity;
    const matchSearch =
      searchTerm === '' ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.location.toLowerCase().includes(searchTerm.toLowerCase());

    return matchStatus && matchSeverity && matchSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} flex-shrink-0 bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 z-50 shadow-xl h-screen sticky top-0`}>
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">Admin</h2>
              <p className="text-xs text-slate-400 mt-1">CivicTrack</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:bg-slate-700 p-2 rounded-lg transition"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveSection('dashboard')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition ${
              activeSection === 'dashboard'
                ? 'bg-blue-600 shadow-lg text-white'
                : 'hover:bg-slate-700 text-slate-200'
            }`}
          >
            <span className="text-xl">📊</span>
            {sidebarOpen && <span className="font-medium">Dashboard</span>}
          </button>

          <button
            onClick={() => setActiveSection('complaints')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition ${
              activeSection === 'complaints'
                ? 'bg-blue-600 shadow-lg text-white'
                : 'hover:bg-slate-700 text-slate-200'
            }`}
          >
            <span className="text-xl">📋</span>
            {sidebarOpen && <span className="font-medium">Complaints</span>}
          </button>

          <button
            onClick={() => setActiveSection('analytics')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition ${
              activeSection === 'analytics'
                ? 'bg-blue-600 shadow-lg text-white'
                : 'hover:bg-slate-700 text-slate-200'
            }`}
          >
            <span className="text-xl">📈</span>
            {sidebarOpen && <span className="font-medium">Analytics</span>}
          </button>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-6 left-4 right-4">
          <button
            onClick={() => {
              localStorage.removeItem('adminToken');
              localStorage.removeItem('adminUsername');
              navigate('/admin-login');
            }}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition font-semibold shadow-lg"
          >
            <span className="text-xl">🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto h-screen">
        <div className="p-8 h-full flex flex-col">
          <div className="max-w-7xl mx-auto w-full flex flex-col flex-1 min-h-0">
            {/* Header */}
            <div className="mb-12">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-5xl font-extrabold text-gray-900 mb-2">📊 Dashboard</h1>
                  <p className="text-lg text-gray-600">Manage and track all citizen complaints efficiently</p>
                </div>
                <button
                  onClick={fetchComplaints}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105 flex items-center gap-2"
                >
                  🔄 Refresh Data
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-100 text-red-800 rounded-xl shadow-md border-l-4 border-red-500">
                ❌ {error}
              </div>
            )}
            {/* Summary Stats Cards */}
            {summary && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {/* Total Complaints Card */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-8 border-l-4 border-blue-600 hover:shadow-2xl hover:scale-105 transition transform duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-200 rounded-lg">
                      <FileText size={32} className="text-blue-600" />
                    </div>
                    <span className="text-3xl font-bold text-blue-600">{summary.total}</span>
                  </div>
                  <p className="text-gray-700 font-semibold text-lg">Total Complaints</p>
                  <p className="text-gray-500 text-sm mt-2">All complaints in system</p>
                </div>

                {/* Pending Card */}
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-lg p-8 border-l-4 border-yellow-600 hover:shadow-2xl hover:scale-105 transition transform duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-yellow-200 rounded-lg">
                      <Clock size={32} className="text-yellow-600" />
                    </div>
                    <span className="text-3xl font-bold text-yellow-600">{summary.pending}</span>
                  </div>
                  <p className="text-gray-700 font-semibold text-lg">Pending</p>
                  <p className="text-gray-500 text-sm mt-2">Awaiting action</p>
                </div>

                {/* Resolved Card */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-8 border-l-4 border-green-600 hover:shadow-2xl hover:scale-105 transition transform duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-200 rounded-lg">
                      <CheckCircle size={32} className="text-green-600" />
                    </div>
                    <span className="text-3xl font-bold text-green-600">{summary.resolved}</span>
                  </div>
                  <p className="text-gray-700 font-semibold text-lg">Resolved</p>
                  <p className="text-gray-500 text-sm mt-2">Completed issues</p>
                </div>

                {/* Emergency Card */}
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-lg p-8 border-l-4 border-red-600 hover:shadow-2xl hover:scale-105 transition transform duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-red-200 rounded-lg">
                      <AlertCircle size={32} className="text-red-600" />
                    </div>
                    <span className="text-3xl font-bold text-red-600">{summary.bySeverity.emergency}</span>
                  </div>
                  <p className="text-gray-700 font-semibold text-lg">Emergency</p>
                  <p className="text-gray-500 text-sm mt-2">Critical issues</p>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">🔍 Filter & Search</h3>
              <p className="text-gray-600 text-sm mb-6">Find complaints quickly by applying filters</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Search */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wide">Search Complaints</label>
                  <input
                    type="text"
                    placeholder="Search by description, location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wide">Filter by Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">⏳ Pending</option>
                    <option value="Resolved">✓ Resolved</option>
                  </select>
                </div>

                {/* Severity Filter */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wide">Filter by Severity</label>
                  <select
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="All">All Severities</option>
                    <option value="Low">🟢 Low</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="High">🔴 High</option>
                    <option value="Emergency">🚨 Emergency</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Complaints List */}
            <div className="flex-1 flex flex-col min-h-0 pb-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">📌 All Complaints</h3>
                  <p className="text-gray-600 text-sm mt-1">Total: <span className="font-semibold text-blue-600">{filteredComplaints.length}</span> complaints</p>
                </div>
              </div>

              {filteredComplaints.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-16 text-center flex-1 flex flex-col items-center justify-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <p className="text-gray-600 text-xl font-semibold">
                    {searchTerm || filterStatus !== 'All' || filterSeverity !== 'All'
                      ? 'No complaints match your filters'
                      : 'No complaints found'}
                  </p>
                  {searchTerm || filterStatus !== 'All' || filterSeverity !== 'All' && (
                    <p className="text-gray-500 text-sm mt-2">Try adjusting your search criteria</p>
                  )}
                </div>
              ) : (
                <div className="space-y-8 mx-4 overflow-y-auto flex-1 pr-2">
                  {filteredComplaints.map((complaint) => (
                    <ComplaintCardClickable
                      key={complaint._id}
                      complaint={complaint}
                      onClick={() => {
                        setSelectedComplaint(complaint);
                        setIsDrawerOpen(true);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Complaint Drawer */}
            <ComplaintDrawer
              complaint={selectedComplaint}
              isOpen={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
              onUpdate={handleComplaintUpdate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
