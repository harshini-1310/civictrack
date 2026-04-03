import { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
  Search, CheckCircle, Clock, AlertCircle, Edit3, Save, X,
  MapPin, Tag, AlertTriangle, Calendar, FileText, Loader2, Info
} from 'lucide-react';
import axiosClient from '../services/axiosClient';
import './TrackStatus.css';

const categories = [
  'Roads & Potholes', 'Drainage & Sewage', 'Street Lighting', 'Public Buildings',
  'Electricity Issues', 'Water Supply', 'Garbage Collection', 'Internet / Cable',
  'Traffic Signals', 'Illegal Parking', 'Accidents / Hazards', 'Fire Safety',
  'Air Pollution', 'Water Pollution', 'Noise Pollution', 'Tree Damage',
  'Hospitals', 'Schools', 'Government Offices', 'Public Transport', 'Miscellaneous',
];

export default function TrackStatus() {
  const [complaintId, setComplaintId] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setComplaint(null);
    setIsEditMode(false);

    if (!complaintId.trim()) {
      setError('Please enter a complaint ID');
      setLoading(false);
      return;
    }

    try {
      const response = await axiosClient.get(`/complaints/track/${complaintId}`);
      if (response.data.success) {
        setComplaint(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Complaint not found. Please check the ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setEditData({
      description: complaint.description,
      category: complaint.category,
      severity: complaint.severity,
      location: complaint.location,
    });
    setIsEditMode(true);
  };

  const handleEditChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (!editData.description.trim()) {
      alert('Description is required');
      return;
    }
    if (!editData.location.trim()) {
      alert('Location is required');
      return;
    }

    setIsSaving(true);
    try {
      const response = await axiosClient.put(`/complaints/${complaint._id}`, {
        description: editData.description,
        category: editData.category,
        severity: editData.severity,
        location: editData.location,
      });

      if (response.data.success) {
        setComplaint(response.data.data);
        setIsEditMode(false);
      }
    } catch (err) {
      alert('Failed to update complaint: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setEditData({});
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Resolved':
        return {
          icon: CheckCircle,
          color: 'resolved',
        };
      case 'Pending':
        return {
          icon: Clock,
          color: 'pending',
        };
      default:
        return {
          icon: AlertCircle,
          color: 'default',
        };
    }
  };

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'Emergency':
        return { color: 'red', icon: '🚨' };
      case 'High':
        return { color: 'orange', icon: '🔴' };
      case 'Medium':
        return { color: 'amber', icon: '🟡' };
      case 'Low':
        return { color: 'emerald', icon: '🟢' };
      default:
        return { color: 'slate', icon: '⚪' };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusConfig = complaint ? getStatusConfig(complaint.status) : null;
  const severityConfig = complaint ? getSeverityConfig(complaint.severity) : null;
  const statusClass = complaint ? `ts-status-${statusConfig.color}` : '';
  const severityClass = complaint ? `ts-severity-${severityConfig.color}` : '';

  return (
    <div className="track-status-page relative min-h-screen overflow-hidden">

      {/* Hero Section */}
      <section className="relative overflow-hidden text-white min-h-[calc(100vh-4rem)] flex items-center py-10 md:py-14 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Hero background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
        </div>

        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
        </div>

        <div className="relative page-container flex justify-center lg:translate-x-28">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="ts-hero-panel"
          >
            <div className="ts-hero-chip">
              <Search size={20} />
              <span>Track Your Complaint</span>
            </div>

            <h1 className="ts-hero-title">
              Track Status
            </h1>
            <p className="ts-hero-subtitle">
              Enter your complaint ID to check the current status of your reported issue
            </p>

            {/* Search Form */}
            <Motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onSubmit={handleSearch}
              className="ts-hero-form"
            >
              <div className="ts-hero-search-shell">
                <input
                  type="text"
                  value={complaintId}
                  onChange={(e) => setComplaintId(e.target.value)}
                  placeholder="Enter your complaint ID"
                  className="ts-admin-input ts-hero-search-input"
                />
                <Motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="ts-admin-btn ts-admin-btn-primary ts-hero-search-btn"
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Search size={20} />
                  )}
                  <span>{loading ? 'Searching...' : 'Search'}</span>
                </Motion.button>
              </div>
            </Motion.form>
          </Motion.div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-20 md:h-28" preserveAspectRatio="none" viewBox="0 0 1200 120">
            <path
              d="M0,45 C150,125 300,-10 500,55 C700,120 900,-5 1200,70 L1200,120 L0,120 Z"
              className="fill-slate-50"
            />
          </svg>
        </div>
      </section>

      {/* Results Section */}
      <section className="section relative overflow-hidden pt-8 md:pt-12 bg-gradient-to-b from-slate-50 via-white to-slate-100">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-16 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl" />
        </div>
        <div className="relative page-container max-w-4xl mx-auto lg:translate-x-6">
          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <Motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="alert alert-error p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={24} className="text-red-500" />
                </div>
                <div>
                  <h3 className="font-bold text-red-800 mb-1">Complaint Not Found</h3>
                  <p className="text-red-600">{error}</p>
                </div>
              </Motion.div>
            )}
          </AnimatePresence>

          {/* Complaint Result */}
          <AnimatePresence>
            {complaint && (
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="track-result-stack ts-admin-stack"
              >
                {/* Status Card */}
                <div className={`ts-admin-status-card ${statusClass}`}>
                  <div className="ts-admin-status-row">
                    <div>
                      <p className="ts-admin-status-label">Current Status</p>
                      <h2 className="ts-admin-status-value">
                        <statusConfig.icon size={20} />
                        <span>{complaint.status}</span>
                      </h2>
                    </div>
                    {complaint.status === 'Pending' && !isEditMode && (
                      <button
                        onClick={handleEditClick}
                        className="ts-admin-btn ts-admin-btn-primary"
                      >
                        <Edit3 size={16} />
                        Edit Details
                      </button>
                    )}
                  </div>
                </div>

                {/* Details Card */}
                <div className="ts-admin-details-card">
                  {isEditMode ? (
                    <Motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="ts-admin-edit-wrap"
                    >
                      <h3 className="ts-admin-section-title">Edit Details</h3>

                      <div className="ts-admin-form-grid">
                        <div className="ts-admin-field">
                          <label className="ts-admin-field-label">Description</label>
                          <textarea
                            value={editData.description}
                            onChange={(e) => handleEditChange('description', e.target.value)}
                            rows="4"
                            maxLength="1000"
                            className="ts-admin-input ts-admin-textarea"
                          />
                          <p className="ts-admin-counter">{editData.description?.length || 0}/1000</p>
                        </div>

                        <div className="ts-admin-two-cols">
                          <div className="ts-admin-field">
                            <label className="ts-admin-field-label">Category</label>
                            <select
                              value={editData.category}
                              onChange={(e) => handleEditChange('category', e.target.value)}
                              className="ts-admin-input ts-admin-select"
                            >
                              {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>

                          <div className="ts-admin-field">
                            <label className="ts-admin-field-label">Severity</label>
                            <select
                              value={editData.severity}
                              onChange={(e) => handleEditChange('severity', e.target.value)}
                              className="ts-admin-input ts-admin-select"
                            >
                              <option value="Low">🟢 Low</option>
                              <option value="Medium">🟡 Medium</option>
                              <option value="High">🔴 High</option>
                              <option value="Emergency">🚨 Emergency</option>
                            </select>
                          </div>
                        </div>

                        <div className="ts-admin-field">
                          <label className="ts-admin-field-label">Location</label>
                          <input
                            type="text"
                            value={editData.location}
                            onChange={(e) => handleEditChange('location', e.target.value)}
                            className="ts-admin-input"
                          />
                        </div>

                        <div className="ts-admin-actions">
                          <button
                            onClick={handleSaveChanges}
                            disabled={isSaving}
                            className="ts-admin-btn ts-admin-btn-primary ts-admin-btn-full"
                          >
                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                          </button>
                          <button
                            onClick={handleCancel}
                            className="ts-admin-btn ts-admin-btn-outline"
                          >
                            <X size={18} />
                            Cancel
                          </button>
                        </div>
                      </div>
                    </Motion.div>
                  ) : (
                    <div className="ts-admin-view-wrap">
                      <div className="ts-admin-field">
                        <h4>Description</h4>
                        <p>{complaint.description}</p>
                      </div>

                      <div className="ts-admin-two-cols">
                        <div className="ts-admin-field">
                          <h4>Category</h4>
                          <p>{complaint.category}</p>
                        </div>

                        <div className="ts-admin-field">
                          <h4>Severity</h4>
                          <p className={`ts-admin-pill ${severityClass}`}>
                            {severityConfig.icon} {complaint.severity}
                          </p>
                        </div>

                        <div className="ts-admin-field">
                          <h4>Location</h4>
                          <p>{complaint.location}</p>
                        </div>

                        <div className="ts-admin-field">
                          <h4>Submitted</h4>
                          <p>{formatDate(complaint.createdAt)}</p>
                        </div>
                      </div>

                      {/* Resolution Notes */}
                      {complaint.status === 'Resolved' && complaint.resolutionNotes && (
                        <div className="ts-admin-resolution">
                          <div className="ts-admin-resolution-title">
                            <CheckCircle size={16} />
                            Resolution Notes
                          </div>
                          <p>{complaint.resolutionNotes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Motion.div>
            )}
          </AnimatePresence>

          {/* Help Section */}
          {!complaint && !error && (
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="track-help-section mt-3"
            >
              <div className="track-help-header flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                    <Info size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Need Help?</h3>
                    <p className="text-sm text-slate-600">Here's how to find and use your complaint ID</p>
                  </div>
                </div>
                <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  Quick Guide
                </span>
              </div>

              <div className="track-help-grid mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                <Motion.article
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.35 }}
                  className="track-help-card track-help-card-id"
                >
                  <div className="track-help-card-bg" />
                  <div className="track-help-card-blob" />
                  <div className="track-help-card-content">
                    <div className="mb-4 flex items-start gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">?</span>
                      <h4 className="text-base font-semibold text-emerald-900">Where is my Complaint ID?</h4>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-sm text-slate-700">
                        <CheckCircle size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                        <span>You received it when your complaint was submitted</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-700">
                        <CheckCircle size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                        <span>Check your email confirmation</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-700">
                        <CheckCircle size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                        <span>It was shown in the success message</span>
                      </li>
                    </ul>
                  </div>
                </Motion.article>

                <Motion.article
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="track-help-card track-help-card-edit"
                >
                  <div className="track-help-card-bg" />
                  <div className="track-help-card-blob" />
                  <div className="track-help-card-content">
                    <div className="mb-4 flex items-start gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white">!</span>
                      <h4 className="text-base font-semibold text-amber-900">Can I modify my complaint?</h4>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-sm text-slate-700">
                        <CheckCircle size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                        <span>Edit details while status is "Pending"</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-700">
                        <CheckCircle size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                        <span>Update description, category, severity, or location</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-700">
                        <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-500" />
                        <span>Editing is disabled once resolved</span>
                      </li>
                    </ul>
                  </div>
                </Motion.article>
              </div>
            </Motion.div>
          )}
        </div>
      </section>
    </div>
  );
}

