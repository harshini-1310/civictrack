import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import axiosClient from '../services/axiosClient';

export default function TrackStatus() {
  const [complaintId, setComplaintId] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setComplaint(null);

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

                {/* Complaint Details */}
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

                  {/* Complaint ID */}
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Complaint ID</h3>
                    <div className="bg-gray-100 px-4 py-2 rounded border border-gray-300 font-mono text-sm break-all text-gray-800">
                      {complaint._id}
                    </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}
