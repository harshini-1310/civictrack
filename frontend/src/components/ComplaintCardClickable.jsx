import { motion } from 'framer-motion';
import { ChevronRight, MapPin, Calendar, Paperclip, Clock, CheckCircle } from 'lucide-react';

export default function ComplaintCardClickable({ complaint, onClick }) {
  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'Low':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-400',
          badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
          icon: '🟢'
        };
      case 'Medium':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-400',
          badge: 'bg-amber-100 text-amber-700 border-amber-200',
          icon: '🟡'
        };
      case 'High':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-400',
          badge: 'bg-orange-100 text-orange-700 border-orange-200',
          icon: '🔴'
        };
      case 'Emergency':
        return {
          bg: 'bg-red-50',
          border: 'border-red-400',
          badge: 'bg-red-100 text-red-700 border-red-200',
          icon: '🚨'
        };
      default:
        return {
          bg: 'bg-slate-50',
          border: 'border-slate-400',
          badge: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: '⚪'
        };
    }
  };

  const getStatusConfig = (status) => {
    return status === 'Resolved'
      ? {
          badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
          icon: CheckCircle,
          label: 'Resolved'
        }
      : {
          badge: 'bg-amber-100 text-amber-700 border-amber-200',
          icon: Clock,
          label: 'Pending'
        };
  };

  const severity = getSeverityConfig(complaint.severity);
  const status = getStatusConfig(complaint.status);
  const StatusIcon = status.icon;

  const formattedDate = new Date(complaint.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
      onClick={onClick}
      className={`card-window group relative bg-white rounded-2xl border-l-4 ${severity.border} p-8 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 shadow-md border border-slate-100`}
    >
      {/* Main Content */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Category */}
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span className="text-xl">📋</span>
            {complaint.category}
          </h3>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${severity.badge}`}>
              {severity.icon} {complaint.severity}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${status.badge}`}>
              <StatusIcon size={12} />
              {status.label}
            </span>
            {complaint.attachment && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border bg-blue-100 text-blue-700 border-blue-200">
                <Paperclip size={12} />
                Attachment
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed">
            {complaint.description}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-slate-400" />
              <span className="truncate max-w-[200px]">{complaint.location}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-slate-400" />
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
          <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* Hover Indicator */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${
        complaint.severity === 'Emergency' ? 'from-red-500 to-rose-500' :
        complaint.severity === 'High' ? 'from-orange-500 to-amber-500' :
        complaint.severity === 'Medium' ? 'from-amber-500 to-yellow-500' :
        'from-emerald-500 to-teal-500'
      } rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    </motion.div>
  );
}
