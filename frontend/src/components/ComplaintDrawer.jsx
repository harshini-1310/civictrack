import { useState } from 'react';
import { X } from 'lucide-react';
import axiosClient from '../services/axiosClient';

export default function ComplaintDrawer({ complaint, isOpen, onClose, onUpdate }) {
  const [isResolving, setIsResolving] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState(complaint?.resolutionNotes || '');
  const [showResolutionForm, setShowResolutionForm] = useState(false);

  const handleResolve = async () => {
    if (!resolutionNotes.trim()) {
      alert('Please provide resolution notes');
      return;
    }

    setIsResolving(true);
    try {
      const response = await axiosClient.put(`/complaints/${complaint._id}`, {
        status: 'Resolved',
        resolutionNotes,
      });

      if (response.data.success) {
        onUpdate(response.data.data);
        setShowResolutionForm(false);
        onClose();
        alert('✅ Complaint marked as resolved!');
      }
    } catch (error) {
      alert('❌ Failed to resolve complaint: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsResolving(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Low':
        return 'green';
      case 'Medium':
        return 'yellow';
      case 'High':
        return 'orange';
      case 'Emergency':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'Low':
        return '🟢';
      case 'Medium':
        return '🟡';
      case 'High':
        return '🔴';
      case 'Emergency':
        return '🚨';
      default:
        return '⭕';
    }
  };

  const formattedDate = new Date(complaint?.createdAt).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  if (!complaint) return null;

  return (
    <div className={`fixed inset-0 z-40 overflow-hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`absolute right-0 top-0 bottom-0 w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Complaint Details</h2>
            <p className="text-blue-100 text-sm mt-1">ID: {complaint._id}</p>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-blue-500 p-2 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{complaint.title}</h3>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold">
              📋 {complaint.category}
            </div>
            <div className={`px-4 py-2 rounded-full font-semibold flex items-center gap-2 ${
              getSeverityColor(complaint.severity) === 'green' ? 'bg-green-100 text-green-800' :
              getSeverityColor(complaint.severity) === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
              getSeverityColor(complaint.severity) === 'orange' ? 'bg-orange-100 text-orange-800' :
              'bg-red-100 text-red-800'
            }`}>
              {getSeverityIcon(complaint.severity)} {complaint.severity}
            </div>
            <div className={`px-4 py-2 rounded-full font-semibold ${
              complaint.status === 'Resolved'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {complaint.status === 'Resolved' ? '✓ Resolved' : '⏳ Pending'}
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{complaint.description}</p>
          </div>

          {/* Location */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">📍 Location</h4>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{complaint.location}</p>
          </div>

          {/* Citizen Email */}
          {complaint.email && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">📧 Citizen Email</h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg break-all">{complaint.email}</p>
            </div>
          )}

          {/* Timestamp */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">📅 Submitted</h4>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{formattedDate}</p>
          </div>

          {/* Resolution Notes (if resolved) */}
          {complaint.resolutionNotes && complaint.status === 'Resolved' && (
            <div>
              <h4 className="font-semibold text-green-900 mb-2">✓ Resolution Notes</h4>
              <p className="text-green-700 bg-green-50 p-4 rounded-lg border-l-4 border-green-500">{complaint.resolutionNotes}</p>
            </div>
          )}

          {/* Resolve Form */}
          {complaint.status === 'Pending' && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              {!showResolutionForm ? (
                <button
                  onClick={() => setShowResolutionForm(true)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition transform hover:scale-105"
                >
                  ✓ Mark as Resolved
                </button>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Resolution Notes (Required)</label>
                    <textarea
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      placeholder="Enter how this complaint was resolved..."
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleResolve}
                      disabled={isResolving}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isResolving ? '⏳ Resolving...' : '✓ Confirm Resolution'}
                    </button>
                    <button
                      onClick={() => {
                        setShowResolutionForm(false);
                        setResolutionNotes(complaint.resolutionNotes || '');
                      }}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-4 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Resolved Badge */}
          {complaint.status === 'Resolved' && (
            <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center font-semibold border-l-4 border-green-500">
              ✓ This complaint has been resolved
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
