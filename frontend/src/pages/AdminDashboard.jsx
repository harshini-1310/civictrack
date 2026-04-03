import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../services/axiosClient';
import ComplaintDrawer from '../components/ComplaintDrawer';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchComplaints = useCallback(async (showRefreshState = false) => {
    try {
      if (showRefreshState) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await axiosClient.get('/complaints');

      if (response.data.success) {
        setComplaints(response.data.data || []);
        setSummary(response.data.summary || null);
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch complaints. Please try again.');
      if (err.response?.status === 401) {
        navigate('/admin-login');
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin-login', { replace: true });
      return;
    }

    fetchComplaints();
  }, [navigate, fetchComplaints]);

  const handleComplaintUpdate = (updatedComplaint) => {
    setComplaints((prev) =>
      prev.map((item) => (item._id === updatedComplaint._id ? updatedComplaint : item))
    );
    fetchComplaints(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    navigate('/admin-login');
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const description = (complaint.description || '').toLowerCase();
    const location = (complaint.location || '').toLowerCase();
    const q = searchTerm.toLowerCase();

    const matchStatus = filterStatus === 'All' || complaint.status === filterStatus;
    const matchSeverity = filterSeverity === 'All' || complaint.severity === filterSeverity;
    const matchSearch = q === '' || description.includes(q) || location.includes(q);

    return matchStatus && matchSeverity && matchSearch;
  });

  const getStatusClass = (status) => `status-${(status || '').toLowerCase()}`;

  const getSeverityClass = (severity) => {
    const level = (severity || '').toLowerCase();
    if (['low', 'medium', 'high', 'emergency'].includes(level)) {
      return `severity-${level}`;
    }

    return 'severity-low';
  };

  const summaryCards = summary
    ? [
        { label: 'Total', value: summary.total },
        { label: 'Pending', value: summary.pending, className: 'pending' },
        { label: 'Resolved', value: summary.resolved, className: 'resolved' },
        { label: 'Emergency', value: summary.bySeverity?.emergency || 0, className: 'emergency' },
      ]
    : [];

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-spinner">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="welcome-text">Welcome back, {localStorage.getItem('adminUsername') || 'Admin'}</p>
        </div>

        <div className="header-actions">
          <button className="btn btn-secondary" type="button" onClick={() => fetchComplaints(true)} disabled={isRefreshing}>
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
          <button className="btn btn-outline" type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      {summary && (
        <section className="stats-grid">
          {summaryCards.map((card) => (
            <article key={card.label} className={`stat-card ${card.className || ''}`.trim()}>
              <span className="stat-label">{card.label}</span>
              <span className="stat-value">{card.value}</span>
            </article>
          ))}
        </section>
      )}

      <section className="filters-bar">
        <div className="search-wrapper">
          <input
            className="search-input"
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by description or location"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="status">Status</label>
          <select
            className="filter-select"
            id="status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="severity">Severity</label>
          <select
            className="filter-select"
            id="severity"
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Emergency">Emergency</option>
          </select>
        </div>
      </section>

      <section className="complaints-section">
        <h2>Complaints ({filteredComplaints.length})</h2>

        {filteredComplaints.length === 0 ? (
          <div className="empty-state">No complaints found.</div>
        ) : (
          <div className="complaints-grid">
            {filteredComplaints.map((complaint) => (
              <button
                className="complaint-card"
                key={complaint._id}
                type="button"
                onClick={() => {
                  setSelectedComplaint(complaint);
                  setIsDrawerOpen(true);
                }}
              >
                <span className="complaint-category">{complaint.category}</span>
                <div className="complaint-description">{complaint.description}</div>
                <div className="complaint-meta">
                  <span className={`status-badge ${getStatusClass(complaint.status)}`}>
                    {complaint.status}
                  </span>
                  <span className={`severity-badge ${getSeverityClass(complaint.severity)}`}>
                    {complaint.severity}
                  </span>
                </div>
                <div className="complaint-location">📍 {complaint.location}</div>
                <div className="complaint-date">
                  📅{' '}
                  {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      <ComplaintDrawer
        complaint={selectedComplaint}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onUpdate={handleComplaintUpdate}
      />
    </div>
  );
}
