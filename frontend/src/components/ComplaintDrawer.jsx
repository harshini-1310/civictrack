import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, Calendar, Mail, Paperclip, Download, CheckCircle,
  Clock, AlertTriangle, FileText, Loader2, RefreshCw, Tag
} from 'lucide-react';
import axiosClient, { getUploadUrl } from '../services/axiosClient';
import { sendComplaintResolution } from '../services/emailjsClient';
import './ComplaintDrawer.css';

export default function ComplaintDrawer({ complaint, isOpen, onClose, onUpdate }) {
  const [isResolving, setIsResolving] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [showResolutionForm, setShowResolutionForm] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    if (complaint) {
      setResolutionNotes(complaint.resolutionNotes || '');
      setShowResolutionForm(false);
      setEmailError(null);
    }
  }, [complaint]);

  const handleResolve = async () => {
    if (!resolutionNotes.trim()) {
      alert('Please provide resolution notes');
      return;
    }

    setIsSendingEmail(true);
    setEmailError(null);

    try {
      if (!complaint.email) {
        throw new Error('Complaint email address is missing');
      }

      const emailResult = await sendComplaintResolution({
        to_email: complaint.email,
        complaintId: complaint.complaintId || complaint._id,
        category: complaint.category || 'General',
        issue: complaint.description || 'Your complaint',
        resolution: resolutionNotes,
      });

      if (!emailResult.success) {
        setEmailError(emailResult.message);
        throw new Error(emailResult.message);
      }

      setIsResolving(true);

      const response = await axiosClient.put(`/complaints/${complaint._id}`, {
        status: 'Resolved',
        resolutionNotes,
      });

      if (response.data.success) {
        onUpdate(response.data.data);
        setShowResolutionForm(false);
        setEmailError(null);
        onClose();
      }
    } catch (error) {
      setEmailError(error?.message || 'Failed to resolve complaint');
      setIsResolving(false);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleRetryEmail = async () => {
    setIsSendingEmail(true);
    setEmailError(null);

    try {
      if (!complaint.email) {
        throw new Error('Complaint email address is missing');
      }

      const emailResult = await sendComplaintResolution({
        to_email: complaint.email,
        complaintId: complaint.complaintId || complaint._id,
        category: complaint.category || 'General',
        issue: complaint.description || 'Your complaint',
        resolution: resolutionNotes,
      });

      if (!emailResult.success) {
        setEmailError(emailResult.message);
        throw new Error(emailResult.message);
      }

      setIsResolving(true);

      const response = await axiosClient.put(`/complaints/${complaint._id}`, {
        status: 'Resolved',
        resolutionNotes,
      });

      if (response.data.success) {
        onUpdate(response.data.data);
        setShowResolutionForm(false);
        setEmailError(null);
        onClose();
      }
    } catch (error) {
      setEmailError(error?.message || 'Retry failed');
      setIsResolving(false);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'Low':
        return { color: 'emerald', icon: '🟢' };
      case 'Medium':
        return { color: 'amber', icon: '🟡' };
      case 'High':
        return { color: 'orange', icon: '🔴' };
      case 'Emergency':
        return { color: 'red', icon: '🚨' };
      default:
        return { color: 'slate', icon: '⚪' };
    }
  };

  if (!complaint) return null;

  const severityConfig = getSeverityConfig(complaint.severity);
  const severityClass = `drawer-severity-${severityConfig.color}`;
  const statusClass = complaint.status === 'Resolved' ? 'drawer-status-resolved' : 'drawer-status-pending';
  const formattedDate = new Date(complaint.createdAt).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="complaint-drawer-backdrop"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="complaint-drawer"
          >
            {/* Header */}
            <div className="complaint-drawer-header">
              <div className="complaint-drawer-header-row">
                <div>
                  <h2 className="complaint-drawer-title">Complaint Details</h2>
                  <p className="complaint-drawer-id">
                    ID: {complaint.complaintId || complaint._id?.slice(-8)}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="complaint-drawer-close"
                >
                  <X size={20} />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="complaint-drawer-content">
              {/* Status Badges */}
              <div className="drawer-badges">
                <span className="drawer-badge drawer-badge-category">
                  <Tag size={14} />
                  {complaint.category}
                </span>
                <span className={`drawer-badge ${severityClass}`}>
                  {severityConfig.icon} {complaint.severity}
                </span>
                <span className={`drawer-badge ${statusClass}`}>
                  {complaint.status === 'Resolved' ? <CheckCircle size={14} /> : <Clock size={14} />}
                  {complaint.status}
                </span>
              </div>

              {/* Description */}
              <div className="drawer-section">
                <h4 className="drawer-label">
                  <FileText size={14} />
                  Description
                </h4>
                <p className="drawer-value">
                  {complaint.description}
                </p>
              </div>

              {/* Location */}
              <div className="drawer-section">
                <h4 className="drawer-label">
                  <MapPin size={14} />
                  Location
                </h4>
                <p className="drawer-value">
                  {complaint.location}
                </p>
              </div>

              {/* Contact & Date */}
              <div className="drawer-grid">
                {complaint.email && (
                  <div className="drawer-section">
                    <h4 className="drawer-label">
                      <Mail size={14} />
                      Citizen Email
                    </h4>
                    <p className="drawer-value drawer-break-all">
                      {complaint.email}
                    </p>
                  </div>
                )}
                <div className="drawer-section">
                  <h4 className="drawer-label">
                    <Calendar size={14} />
                    Submitted
                  </h4>
                  <p className="drawer-value">
                    {formattedDate}
                  </p>
                </div>
              </div>

              {/* Attachment */}
              {complaint.attachment && complaint.attachment.filename && (
                <div className="drawer-section">
                  <h4 className="drawer-label">
                    <Paperclip size={14} />
                    Attachment
                  </h4>
                  <a
                    href={getUploadUrl(complaint.attachment.filename)}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={complaint.attachment.filename}
                    className="drawer-attachment"
                  >
                    <div className="drawer-attachment-left">
                      <div className="drawer-attachment-icon">
                        <Paperclip size={18} />
                      </div>
                      <div>
                        <p className="drawer-attachment-name">
                          {complaint.attachment.filename}
                        </p>
                        <p className="drawer-attachment-size">
                          {(complaint.attachment.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <Download size={18} />
                  </a>
                </div>
              )}

              {/* Resolution Notes (if resolved) */}
              {complaint.status === 'Resolved' && complaint.resolutionNotes && (
                <div className="drawer-resolution-notes">
                  <h4 className="drawer-label drawer-label-success">
                    <CheckCircle size={14} />
                    Resolution Notes
                  </h4>
                  <p>{complaint.resolutionNotes}</p>
                </div>
              )}

              {/* Resolve Actions */}
              {complaint.status === 'Pending' && (
                <div className="drawer-pending-box">
                  {/* Email Error */}
                  {emailError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="drawer-email-error"
                    >
                      <p className="drawer-email-error-title">
                        <AlertTriangle size={16} />
                        {emailError}
                      </p>
                      <p className="drawer-email-error-text">
                        The complaint won't be marked as resolved until the email is sent.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleRetryEmail}
                        disabled={isSendingEmail}
                        className="drawer-btn drawer-btn-warning drawer-btn-full"
                      >
                        {isSendingEmail ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <RefreshCw size={16} />
                        )}
                        {isSendingEmail ? 'Retrying...' : 'Retry Email'}
                      </motion.button>
                    </motion.div>
                  )}

                  {!showResolutionForm ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowResolutionForm(true)}
                      className="drawer-btn drawer-btn-primary drawer-btn-full"
                    >
                      <CheckCircle size={18} />
                      Mark as Resolved
                    </motion.button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="drawer-resolve-form"
                    >
                      <div>
                        <label className="drawer-label">Resolution Notes</label>
                        <textarea
                          value={resolutionNotes}
                          onChange={(e) => setResolutionNotes(e.target.value)}
                          placeholder="Describe how this complaint was resolved..."
                          rows="4"
                          className="drawer-textarea"
                        />
                      </div>
                      <div className="drawer-btn-row">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleResolve}
                          disabled={isSendingEmail || isResolving}
                          className="drawer-btn drawer-btn-primary drawer-btn-full"
                        >
                          {isSendingEmail || isResolving ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <CheckCircle size={16} />
                          )}
                          {isSendingEmail ? 'Sending...' : isResolving ? 'Resolving...' : 'Confirm'}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setShowResolutionForm(false);
                            setResolutionNotes(complaint.resolutionNotes || '');
                            setEmailError(null);
                          }}
                          disabled={isSendingEmail || isResolving}
                          className="drawer-btn drawer-btn-outline drawer-btn-full"
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Resolved Badge */}
              {complaint.status === 'Resolved' && (
                <div className="drawer-resolved-banner">
                  <div className="drawer-resolved-banner-text">
                    <CheckCircle size={20} />
                    This complaint has been resolved
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
