import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Upload, X, CheckCircle, AlertCircle, Loader2,
  FileText, Mail, Send
} from 'lucide-react';
import axiosClient from '../services/axiosClient';
import { sendComplaintSubmission } from '../services/emailjsClient';
import './ComplaintForm.css';

const _Motion = motion;
const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;

const categoryOptions = [
  { value: 'Roads & Potholes', label: 'Roads & Potholes', icon: '🛣️' },
  { value: 'Drainage & Sewage', label: 'Drainage & Sewage', icon: '💧' },
  { value: 'Street Lighting', label: 'Street Lighting', icon: '💡' },
  { value: 'Public Buildings', label: 'Public Buildings', icon: '🏛️' },
  { value: 'Electricity Issues', label: 'Electricity Issues', icon: '⚡' },
  { value: 'Water Supply', label: 'Water Supply', icon: '🚰' },
  { value: 'Garbage Collection', label: 'Garbage Collection', icon: '🗑️' },
  { value: 'Internet / Cable', label: 'Internet / Cable', icon: '📡' },
  { value: 'Traffic Signals', label: 'Traffic Signals', icon: '🚦' },
  { value: 'Illegal Parking', label: 'Illegal Parking', icon: '🚗' },
  { value: 'Accidents / Hazards', label: 'Accidents / Hazards', icon: '⚠️' },
  { value: 'Fire Safety', label: 'Fire Safety', icon: '🔥' },
  { value: 'Air Pollution', label: 'Air Pollution', icon: '💨' },
  { value: 'Water Pollution', label: 'Water Pollution', icon: '🌊' },
  { value: 'Noise Pollution', label: 'Noise Pollution', icon: '🔊' },
  { value: 'Tree Damage', label: 'Tree Damage', icon: '🌳' },
  { value: 'Hospitals', label: 'Hospitals', icon: '🏥' },
  { value: 'Schools', label: 'Schools', icon: '🎓' },
  { value: 'Government Offices', label: 'Government Offices', icon: '📋' },
  { value: 'Public Transport', label: 'Public Transport', icon: '🚌' },
  { value: 'Miscellaneous', label: 'Miscellaneous', icon: '🔧' },
];

const severityOptions = [
  { value: 'Low', label: 'Low', color: 'emerald', description: 'Minor inconvenience' },
  { value: 'Medium', label: 'Medium', color: 'amber', description: 'Moderate impact' },
  { value: 'High', label: 'High', color: 'orange', description: 'Significant issue' },
  { value: 'Emergency', label: 'Emergency', color: 'red', description: 'Immediate action needed' },
];

export default function ComplaintForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    category: '',
    severity: '',
    location: '',
    description: '',
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [complaintId, setComplaintId] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [fieldErrors, setFieldErrors] = useState({});

  const validateField = (fieldName, rawValue) => {
    const value = typeof rawValue === 'string' ? rawValue.trim() : rawValue;

    if (fieldName === 'description') {
      if (!value) return 'Description is required';
      if (value.length < 10) return 'Description must be at least 10 characters';
      return '';
    }

    if (fieldName === 'category') {
      return value ? '' : 'Category is required';
    }

    if (fieldName === 'severity') {
      return value ? '' : 'Please select a severity level';
    }

    if (fieldName === 'location') {
      return value ? '' : 'Location is required';
    }

    if (fieldName === 'email') {
      if (!value) return 'Email is required';
      return emailPattern.test(value) ? '' : 'Please enter a valid email address';
    }

    if (fieldName === 'phone') {
      if (!value) return '';
      const phoneDigits = value.replace(/\D/g, '');
      return phoneDigits.length === 10 ? '' : 'Phone must be a valid 10-digit number';
    }

    if (fieldName === 'fullName') {
      if (!value) return '';
      return value.length >= 2 ? '' : 'Name must be at least 2 characters';
    }

    return '';
  };

  const validateFields = (fieldNames) => {
    const nextErrors = { ...fieldErrors };
    let hasError = false;

    fieldNames.forEach((fieldName) => {
      const message = validateField(fieldName, formData[fieldName]);
      if (message) {
        nextErrors[fieldName] = message;
        hasError = true;
      } else {
        delete nextErrors[fieldName];
      }
    });

    setFieldErrors(nextErrors);
    return !hasError;
  };

  const getSectionFields = (sectionIndex) => {
    if (sectionIndex === 0) return ['description', 'category', 'severity'];
    if (sectionIndex === 1) return ['location'];
    if (sectionIndex === 3) return ['email', 'fullName', 'phone'];
    return [];
  };

  const handleNextStep = () => {
    const sectionFields = getSectionFields(activeSection);
    if (sectionFields.length > 0) {
      const isSectionValid = validateFields(sectionFields);
      if (!isSectionValid) {
        setError('Please fix highlighted fields before continuing.');
        return;
      }
    }

    setError('');
    setActiveSection(Math.min(formSections.length - 1, activeSection + 1));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const message = validateField(name, value);
    setFieldErrors((prev) => {
      const nextErrors = { ...prev };
      if (message) {
        nextErrors[name] = message;
      } else {
        delete nextErrors[name];
      }
      return nextErrors;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFileError('');

    if (!file) {
      setUploadedFile(null);
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError('File size must be less than 5MB');
      setUploadedFile(null);
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setFileError('Only images, PDFs, and documents (Word) are allowed');
      setUploadedFile(null);
      return;
    }

    setUploadedFile(file);
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    setFileError('');
  };

  const getRealtimeLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setLocationLoading(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          const address = data.address?.road || data.address?.city || data.address?.town || `Latitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)}`;

          setFormData((prev) => ({
            ...prev,
            location: `${address} (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
          }));
          setFieldErrors((prev) => {
            const nextErrors = { ...prev };
            delete nextErrors.location;
            return nextErrors;
          });
        } catch {
          setFormData((prev) => ({
            ...prev,
            location: `Latitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)}`,
          }));
          setFieldErrors((prev) => {
            const nextErrors = { ...prev };
            delete nextErrors.location;
            return nextErrors;
          });
        }

        setLocationLoading(false);
      },
      (error) => {
        setLocationError(`Unable to get location: ${error.message}`);
        setLocationLoading(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting || loading) {
      return;
    }

    setIsSubmitting(true);
    setLoading(true);
    setError('');
    setMessage('');
    setEmailMessage('');

    try {
      const isFormValid = validateFields(['description', 'category', 'severity', 'location', 'email', 'fullName', 'phone']);
      if (!isFormValid) {
        setError('Please fix highlighted fields before submitting.');
        setIsSubmitting(false);
        setLoading(false);
        return;
      }

      const submitData = new FormData();

      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('severity', formData.severity);
      submitData.append('location', formData.location);
      submitData.append('email', formData.email);

      if (formData.fullName?.trim?.()) {
        submitData.append('fullName', formData.fullName.trim());
      }
      if (formData.phone?.trim?.()) {
        submitData.append('phone', formData.phone.trim());
      }

      if (uploadedFile) {
        submitData.append('file', uploadedFile);
      }

      const response = await axiosClient.post('/complaints', submitData);

      if (response.data.success) {
        const complaint = response.data.data;
        const complaintIdValue = complaint.complaintId || complaint._id;
        const complaintCategoryValue = complaint.category || formData.category || 'General';
        const userFullName = formData.fullName?.trim?.() || 'Valued Citizen';

        setComplaintId(complaintIdValue);
        setMessage(`Complaint submitted successfully!`);

        const emailResult = await sendComplaintSubmission({
          to_email: formData.email,
          complaintId: complaintIdValue,
          name: userFullName,
          category: complaintCategoryValue,
        });

        if (emailResult.success) {
          setEmailMessage('Confirmation email sent successfully');
        } else {
          setEmailMessage(`Note: Confirmation email could not be sent. Your complaint has been registered successfully.`);
        }

        setFormData({
          fullName: '',
          email: '',
          phone: '',
          description: '',
          category: '',
          severity: '',
          location: '',
          image: null,
        });
        setFieldErrors({});
        setUploadedFile(null);

        setTimeout(() => {
          setMessage('');
          setComplaintId('');
          setEmailMessage('');
        }, 15000);
      } else {
        setError(response.data.message || 'Failed to submit complaint. Please try again.');
      }
    } catch (err) {
      console.error('Complaint submission error:', err);
      setError(err.response?.data?.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const formSections = [
    { title: 'Issue Details', icon: FileText },
    { title: 'Location', icon: MapPin },
    { title: 'Evidence', icon: Upload },
    { title: 'Contact', icon: Mail },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="complaint-form"
    >
      <div className="cf-header">
        <div className="cf-header-stack">
          <div className="cf-header-main">
            <div className="cf-header-icon-wrap">
              <FileText size={28} className="text-white" />
            </div>
            <div className="cf-header-copy">
              <h2 className="cf-title">Report a Public Issue</h2>
              <p className="cf-subtitle">Help us improve your community</p>
            </div>
          </div>

          <div className="cf-progress">
            {formSections.map((section, index) => (
              <motion.button
                key={section.title}
                type="button"
                onClick={() => setActiveSection(index)}
                whileHover={{ scale: 1 }}
                whileTap={{ scale: 1 }}
                className={`cf-progress-btn ${activeSection === index ? 'is-active' : ''}`}
              >
                <section.icon size={16} />
                <span>{section.title}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="cf-body">
        <div className="cf-panel">
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="cf-alert cf-alert-success"
            >
              <div className="cf-alert-row">
                <div className="cf-alert-icon">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <div className="cf-alert-content">
                  <h3 className="cf-alert-title">{message}</h3>
                  {complaintId && (
                    <div className="cf-id-card">
                      <div className="cf-id-row">
                        <div>
                          <span className="cf-id-label">Your Complaint ID</span>
                          <code className="cf-id-value">{complaintId}</code>
                        </div>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            navigator.clipboard.writeText(complaintId);
                          }}
                          className="cf-btn cf-btn-success"
                        >
                          Copy ID
                        </motion.button>
                      </div>
                    </div>
                  )}
                  {emailMessage && (
                    <div className="cf-email-note">
                      <Mail size={16} />
                      <span>{emailMessage}</span>
                    </div>
                  )}
                  <p className="cf-alert-hint">
                    Save this ID to track your complaint status anytime!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="cf-alert cf-alert-error"
            >
              <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="cf-form">
          <AnimatePresence mode="wait">
            {activeSection === 0 && (
              <motion.div
                key="issue-details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="cf-section-head">
                  <div className="cf-section-icon tone-blue">
                    <FileText size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="cf-section-title">Issue Details</h3>
                    <p className="cf-section-note">Describe the problem you want to report</p>
                  </div>
                </div>

                <div className="cf-stack">
                  <div className="cf-field">
                    <label className="cf-label cf-label-required">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Provide detailed information about the issue..."
                      rows="5"
                      maxLength="1000"
                      className={`cf-input cf-textarea ${fieldErrors.description ? 'is-error' : ''}`}
                      aria-invalid={Boolean(fieldErrors.description)}
                      required
                    />
                    {fieldErrors.description && (
                      <div className="cf-error">
                        <AlertCircle size={14} />
                        <span>{fieldErrors.description}</span>
                      </div>
                    )}
                    <div className="cf-counter-row">
                      <span className="cf-hint">Be as specific as possible</span>
                      <span className={`cf-counter ${formData.description.length > 900 ? 'is-warning' : ''}`}>
                        {formData.description.length}/1000
                      </span>
                    </div>
                  </div>

                  <div className="cf-grid-2">
                    <div className="cf-field">
                      <label className="cf-label cf-label-required">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`cf-input cf-select ${fieldErrors.category ? 'is-error' : ''}`}
                        aria-invalid={Boolean(fieldErrors.category)}
                        required
                      >
                        <option value="">Select a category</option>
                        {categoryOptions.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.icon} {cat.label}
                          </option>
                        ))}
                      </select>
                      {fieldErrors.category && (
                        <div className="cf-error">
                          <AlertCircle size={14} />
                          <span>{fieldErrors.category}</span>
                        </div>
                      )}
                    </div>

                    <div className="cf-field">
                      <label className="cf-label cf-label-required">Severity</label>
                      <div className="cf-severity-grid">
                        {severityOptions.map((option) => (
                          <motion.button
                            key={option.value}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, severity: option.value }));
                              setFieldErrors((prev) => {
                                const nextErrors = { ...prev };
                                delete nextErrors.severity;
                                return nextErrors;
                              });
                            }}
                            className={`cf-severity-btn tone-${option.color} ${formData.severity === option.value ? 'is-selected' : ''}`}
                          >
                            <span className="cf-severity-title">
                              {option.label}
                            </span>
                            <span className="cf-severity-desc">{option.description}</span>
                          </motion.button>
                        ))}
                      </div>
                      {fieldErrors.severity && (
                        <div className="cf-error">
                          <AlertCircle size={14} />
                          <span>{fieldErrors.severity}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Section 2: Location */}
            {activeSection === 1 && (
              <motion.div
                key="location"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="cf-section-head">
                  <div className="cf-section-icon tone-emerald">
                    <MapPin size={20} className="text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="cf-section-title">Location</h3>
                    <p className="cf-section-note">Where is this issue located?</p>
                  </div>
                </div>

                <div className="cf-stack">
                  <div className="cf-location-row">
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Enter the address or location"
                      className={`cf-input ${fieldErrors.location ? 'is-error' : ''}`}
                      aria-invalid={Boolean(fieldErrors.location)}
                      required
                    />
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={getRealtimeLocation}
                      disabled={locationLoading}
                      className="cf-btn cf-btn-success"
                    >
                      {locationLoading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <MapPin size={18} />
                      )}
                      <span className="hidden sm:inline">
                        {locationLoading ? 'Getting...' : 'Auto-detect'}
                      </span>
                    </motion.button>
                  </div>

                  {locationError && (
                    <div className="cf-inline-note cf-inline-note-error">
                      <AlertCircle size={16} />
                      <span>{locationError}</span>
                    </div>
                  )}

                  {fieldErrors.location && (
                    <div className="cf-error">
                      <AlertCircle size={14} />
                      <span>{fieldErrors.location}</span>
                    </div>
                  )}

                  {formData.location && !locationError && (
                    <div className="cf-inline-note cf-inline-note-success">
                      <CheckCircle size={16} />
                      <span>Location detected successfully</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Section 3: Evidence */}
            {activeSection === 2 && (
              <motion.div
                key="evidence"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="cf-section-head">
                  <div className="cf-section-icon tone-amber">
                    <Upload size={20} className="text-amber-600" />
                  </div>
                  <div>
                    <h3 className="cf-section-title">Evidence (Optional)</h3>
                    <p className="cf-section-note">Attach photos or documents to support your report</p>
                  </div>
                </div>

                {!uploadedFile ? (
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="cf-upload-zone"
                  >
                    <input
                      type="file"
                      id="file-upload"
                      onChange={handleFileChange}
                      className="cf-upload-input"
                      accept="image/*,.pdf,.doc,.docx"
                    />
                    <label htmlFor="file-upload" className="cf-upload-main">
                      <Upload size={68} />
                      <p>Browse File to upload!</p>
                    </label>
                    <label htmlFor="file-upload" className="cf-upload-footer">
                      <FileText size={18} />
                      <p>Not selected file</p>
                      <Upload size={18} />
                    </label>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="cf-upload-zone"
                  >
                    <div className="cf-upload-main">
                      <CheckCircle size={68} className="text-emerald-500" />
                      <p>File selected successfully</p>
                    </div>
                    <div className="cf-upload-footer">
                      <FileText size={18} />
                      <p>{uploadedFile.name}</p>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={removeUploadedFile}
                        className="cf-upload-remove"
                        aria-label="Remove file"
                      >
                        <X size={16} />
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {fileError && (
                  <div className="cf-inline-note cf-inline-note-error">
                    <AlertCircle size={16} />
                    <span>{fileError}</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Section 4: Contact */}
            {activeSection === 3 && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="cf-section-head">
                  <div className="cf-section-icon tone-indigo">
                    <Mail size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="cf-section-title">Contact Information</h3>
                    <p className="cf-section-note">How can we reach you with updates?</p>
                  </div>
                </div>

                <div className="cf-stack">
                  <div className="cf-grid-2">
                    <div className="cf-field">
                      <label className="cf-label">
                        Full Name <span className="cf-label-note">(optional)</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className={`cf-input ${fieldErrors.fullName ? 'is-error' : ''}`}
                        aria-invalid={Boolean(fieldErrors.fullName)}
                      />
                      {fieldErrors.fullName && (
                        <div className="cf-error">
                          <AlertCircle size={14} />
                          <span>{fieldErrors.fullName}</span>
                        </div>
                      )}
                    </div>

                    <div className="cf-field">
                      <label className="cf-label">
                        Phone <span className="cf-label-note">(optional)</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit phone number"
                        className={`cf-input ${fieldErrors.phone ? 'is-error' : ''}`}
                        aria-invalid={Boolean(fieldErrors.phone)}
                      />
                      {fieldErrors.phone && (
                        <div className="cf-error">
                          <AlertCircle size={14} />
                          <span>{fieldErrors.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="cf-field">
                    <label className="cf-label cf-label-required">
                      Email
                      <span className="cf-label-note">(required for updates)</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className={`cf-input ${fieldErrors.email ? 'is-error' : ''}`}
                      aria-invalid={Boolean(fieldErrors.email)}
                      required
                    />
                    {fieldErrors.email && (
                      <div className="cf-error">
                        <AlertCircle size={14} />
                        <span>{fieldErrors.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="cf-nav">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
              disabled={activeSection === 0}
              className="cf-btn cf-btn-outline"
            >
              Previous
            </motion.button>

            {activeSection < formSections.length - 1 ? (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNextStep}
                className="cf-btn cf-btn-primary"
              >
                Next Step
                <Send size={18} />
              </motion.button>
            ) : (
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="cf-btn cf-btn-success"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Report
                  </>
                )}
              </motion.button>
            )}
          </div>
        </form>
        </div>
      </div>
    </motion.div>
  );
}
