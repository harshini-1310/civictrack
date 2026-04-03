import { useState } from 'react';
import axiosClient from '../services/axiosClient';
import { sendEmail } from '../services/emailjsClient';
import AnimatedButton from './AnimatedButton';

export default function ComplaintCard({ complaint, onUpdate }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState(complaint.resolutionNotes || '');
  const [showResolutionForm, setShowResolutionForm] = useState(false);

  const handleResolve = async () => {
    if (!resolutionNotes.trim() && complaint.status === 'Pending') {
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
        alert('✅ Complaint marked as resolved!');

        if (!complaint.email) {
          console.warn('handleResolve: no email present on complaint, skipping EmailJS sendOrder');
        } else {
          const emailResult = await sendEmail(complaint.email, complaint.description || 'Resolved complaint');
          if (emailResult.success) {
            console.log('EmailJS notification sent successfully', { toEmail: complaint.email });
          } else {
            console.error('EmailJS notification had an issue', {
              toEmail: complaint.email,
              issue: complaint.description || 'Resolved complaint',
              message: emailResult.message,
            });
          }
        }
      }
    } catch (error) {
      alert('❌ Failed to resolve complaint: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsResolving(false);
    }
  };

  const getSeverityBadgeClass = (severity) => {
    switch (severity) {
      case 'Low':
        return 'badge-low';
      case 'Medium':
        return 'badge-medium';
      case 'High':
        return 'badge-high';
      case 'Emergency':
        return 'badge-emergency';
      default:
        return 'badge-low';
    }
  };

  const getStatusBadgeClass = (status) => {
    return status === 'Resolved' ? 'badge-resolved' : 'badge-pending';
  };

  const formattedDate = new Date(complaint.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="card">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            📋 {complaint.category}
          </h3>
          <div className="flex gap-2 flex-wrap mt-3">
            <span className={`badge ${getSeverityBadgeClass(complaint.severity)}`}>
              {complaint.severity} Severity
            </span>
            <span className={`badge ${getStatusBadgeClass(complaint.status)}`}>
              {complaint.status}
            </span>
          </div>
        </div>
        <AnimatedButton
          onClick={() => setIsExpanded(!isExpanded)}
          simple
          compact
          iconOnly
          variant="outline"
        >
          {isExpanded ? '▼' : '▶'}
        </AnimatedButton>
      </div>

      {/* Collapsed summary */}
      {!isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-gray-600 text-sm">📍 {complaint.location}</p>
          <p className="text-gray-500 text-xs mt-1">📅 {formattedDate}</p>
        </div>
      )}

      {/* Expanded details */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
          <div>
            <p className="font-semibold text-gray-700">Location:</p>
            <p className="text-gray-600 text-sm">📍 {complaint.location}</p>
          </div>

          {complaint.email && (
            <div>
              <p className="font-semibold text-gray-700">Citizen Email:</p>
              <p className="text-gray-600 text-sm">📧 {complaint.email}</p>
            </div>
          )}

          <div>
            <p className="font-semibold text-gray-700">Submitted:</p>
            <p className="text-gray-600 text-sm">📅 {new Date(complaint.createdAt).toLocaleString()}</p>
          </div>

          {complaint.resolutionNotes && (
            <div className="bg-green-50 p-3 rounded">
              <p className="font-semibold text-green-800">Resolution Notes:</p>
              <p className="text-green-700 text-sm mt-1">{complaint.resolutionNotes}</p>
            </div>
          )}

          {/* Resolution Form */}
          {complaint.status === 'Pending' && (
            <div>
              {!showResolutionForm ? (
                <AnimatedButton
                  onClick={() => setShowResolutionForm(true)}
                  simple
                  fullWidth
                  variant="secondary"
                >
                  ✓ Mark as Resolved
                </AnimatedButton>
              ) : (
                <div className="space-y-3 bg-yellow-50 p-4 rounded">
                  <textarea
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Enter resolution notes (required)"
                    rows="3"
                    className="input-field resize-none"
                  />
                  <div className="flex gap-2">
                    <AnimatedButton
                      onClick={handleResolve}
                      disabled={isResolving}
                      simple
                      fullWidth
                      variant="secondary"
                    >
                      {isResolving ? 'Resolving...' : 'Confirm Resolution'}
                    </AnimatedButton>
                    <AnimatedButton
                      onClick={() => {
                        setShowResolutionForm(false);
                        setResolutionNotes(complaint.resolutionNotes || '');
                      }}
                      simple
                      fullWidth
                      variant="outline"
                    >
                      Cancel
                    </AnimatedButton>
                  </div>
                </div>
              )}
            </div>
          )}

          {complaint.status === 'Resolved' && (
            <div className="bg-green-100 text-green-800 p-3 rounded text-sm text-center font-semibold">
              ✓ This complaint has been resolved
            </div>
          )}
        </div>
      )}
    </div>
  );
}
