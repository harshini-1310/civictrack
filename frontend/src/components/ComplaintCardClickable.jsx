import { ChevronRight } from 'lucide-react';

export default function ComplaintCardClickable({ complaint, onClick }) {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Low':
        return { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700', badge: 'bg-green-100 text-green-800' };
      case 'Medium':
        return { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-800' };
      case 'High':
        return { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-800' };
      case 'Emergency':
        return { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', badge: 'bg-red-100 text-red-800' };
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-700', badge: 'bg-gray-100 text-gray-800' };
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

  const getStatusColor = (status) => {
    return status === 'Resolved'
      ? { bg: 'bg-green-50', border: 'border-green-300', badge: 'bg-green-100 text-green-800' }
      : { bg: 'bg-yellow-50', border: 'border-yellow-300', badge: 'bg-yellow-100 text-yellow-800' };
  };

  const colors = getSeverityColor(complaint.severity);
  const statusColor = getStatusColor(complaint.status);
  const formattedDate = new Date(complaint.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      onClick={onClick}
      className={`${colors.bg} border-l-4 ${colors.border} rounded-lg p-8 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-102 bg-white shadow-md hover:shadow-lg hover:-translate-y-1`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Category as Main Highlight */}
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            📋 {complaint.category}
          </h3>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`${colors.badge} px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1`}>
              {getSeverityIcon(complaint.severity)} {complaint.severity}
            </span>
            <span className={`${statusColor.badge} px-3 py-1 rounded-full text-sm font-semibold`}>
              {complaint.status === 'Resolved' ? '✓ Resolved' : '⏳ Pending'}
            </span>
            {complaint.attachment && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                📎 Attachment
              </span>
            )}
          </div>

          {/* Description preview */}
          <p className="text-gray-700 text-sm line-clamp-2 mb-4 font-medium">{complaint.description}</p>

          {/* Location and Date */}
          <div className="flex gap-4 text-xs text-gray-500 mt-2">
            <span>📍 {complaint.location}</span>
            <span>📅 {formattedDate}</span>
          </div>
        </div>

        {/* Chevron */}
        <div className="ml-4 flex-shrink-0">
          <ChevronRight size={24} className="text-gray-400 group-hover:text-gray-600" />
        </div>
      </div>
    </div>
  );
}
