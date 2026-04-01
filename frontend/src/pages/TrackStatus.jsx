import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import axiosClient from '../services/axiosClient';

const categories = [
  'Roads & Potholes',
  'Drainage & Sewage',
  'Street Lighting',
  'Public Buildings',
  'Electricity Issues',
  'Water Supply',
  'Garbage Collection',
  'Internet / Cable',
  'Traffic Signals',
  'Illegal Parking',
  'Accidents / Hazards',
  'Fire Safety',
  'Air Pollution',
  'Water Pollution',
  'Noise Pollution',
  'Tree Damage',
  'Hospitals',
  'Schools',
  'Government Offices',
  'Public Transport',
  'Miscellaneous',
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
        alert('✅ Complaint updated successfully!');
      }
    } catch (err) {
      alert('❌ Failed to update complaint: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setEditData({});
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Emergency':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Medium':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
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

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen w-full">
      <div className="flex-1 w-full px-4 md:px-6 py-8">
        <div className="w-full mx-auto space-y-8 max-w-2xl">
          {/* Page Header */}
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-2">
              Track<span className="text-blue-600">Status</span>
            </h1>
            <p className="text-lg text-gray-600">
              Enter your complaint ID to check the status
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Complaint ID <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={complaintId}
                    onChange={(e) => setComplaintId(e.target.value)}
                    placeholder="Paste your complaint ID here"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </div>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm font-medium">
                ⚠️ {error}
              </div>
            )}

            {complaint && (
              <div className="mt-8 space-y-6 border-t border-gray-200 pt-8">
                {/* Status Header */}
                <div className="text-center pb-6 border-b border-gray-200">
                  <p className="text-gray-600 text-sm mb-3">Current Status</p>
                  <div className={`inline-block px-6 py-3 rounded-full border-2 font-bold text-lg ${getStatusColor(complaint.status)}`}>
                    {complaint.status === 'Resolved' ? '✅' : '⏳'} {complaint.status}
                  </div>
                </div>

                {/* Edit/View Toggle */}
                {!isEditMode && complaint.status === 'Pending' && (
                  <button
                    onClick={handleEditClick}
                    className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-2 px-4 rounded-lg transition"
                  >
                    ✏️ Edit Details
                  </button>
                )}

                {isEditMode ? (
                  // Edit Form
                  <div className="space-y-4 bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="font-bold text-gray-900 mb-4">📝 Modify Complaint Details</h3>

                    {/* Description */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={editData.description}
                        onChange={(e) => handleEditChange('description', e.target.value)}
                        rows="4"
                        maxLength="1000"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">{editData.description?.length || 0}/1000 characters</p>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Category</label>
                      <select
                        value={editData.category}
                        onChange={(e) => handleEditChange('category', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Severity */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Severity</label>
                      <select
                        value={editData.severity}
                        onChange={(e) => handleEditChange('severity', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Low">🟢 Low</option>
                        <option value="Medium">🟡 Medium</option>
                        <option value="High">🔴 High</option>
                        <option value="Emergency">🚨 Emergency</option>
                      </select>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editData.location}
                        onChange={(e) => handleEditChange('location', e.target.value)}
                        placeholder="Enter location"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Save/Cancel Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-blue-300">
                      <button
                        onClick={handleSaveChanges}
                        disabled={isSaving}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                      >
                        {isSaving ? '⏳ Saving...' : '✓ Save Changes'}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition"
                      >
                        ✕ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Description (Full width) */}
                    <div className="md:col-span-2">
                      <h3 className="text-sm font-semibold text-gray-600 mb-2">Description</h3>
                      <p className="text-gray-900 text-base leading-relaxed">{complaint.description}</p>
                    </div>

                    {/* Category */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-2">Category</h3>
                      <p className="text-gray-900">{complaint.category}</p>
                    </div>

                    {/* Severity */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-2">Severity</h3>
                      <div className={`inline-block px-4 py-2 rounded-lg border-2 font-semibold text-sm ${getSeverityColor(complaint.severity)}`}>
                        {complaint.severity}
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-2">Location</h3>
                      <p className="text-gray-900">{complaint.location}</p>
                    </div>

                    {/* Submitted Date */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-2">Submitted On</h3>
                      <p className="text-gray-900">{formatDate(complaint.createdAt)}</p>
                    </div>

                    {/* Resolution Notes (if resolved) */}
                    {complaint.status === 'Resolved' && complaint.resolutionNotes && (
                      <div className="md:col-span-2">
                        <h3 className="text-sm font-semibold text-gray-600 mb-2">Resolution Notes</h3>
                        <div className="bg-green-50 p-4 rounded border border-green-200 text-gray-900">
                          {complaint.resolutionNotes}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {!complaint && !error && complaintId && !loading && (
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-sm">
                Enter your complaint ID and click Search to track your complaint.
              </div>
            )}
          </div>

          {/* Help Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 md:p-8">
            <h3 className="font-semibold text-gray-900 mb-3">💡 Where is my Complaint ID?</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>✓ You received it when your complaint was submitted successfully</li>
              <li>✓ It appears in the success message on the Report Issue page</li>
              <li>✓ Copy and paste it here to track your complaint status anytime</li>
            </ul>

            <h3 className="font-semibold text-gray-900 mb-3 mt-5">✏️ Need to modify your complaint?</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>✓ You can edit your complaint details if it's still pending</li>
              <li>✓ Click the "Edit Details" button to modify description, category, severity, or location</li>
              <li>✓ Once your complaint is resolved, editing will not be available</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
