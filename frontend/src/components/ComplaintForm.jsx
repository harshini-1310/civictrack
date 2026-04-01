import { useState } from 'react';
import axiosClient from '../services/axiosClient';
import { sendComplaintSubmission } from '../services/emailjsClient';

const categories = ['Roads', 'Water', 'Electricity', 'Sanitation', 'Other'];

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => /^\d{10}$/.test(phone);

export default function ComplaintForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    category: '',
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFileError('');

    if (!file) {
      setUploadedFile(null);
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError('File size must be less than 5MB');
      setUploadedFile(null);
      return;
    }

    // Validate file type (allow images, PDFs, documents)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setFileError('Only images, PDFs, and documents (Word) are allowed');
      setUploadedFile(null);
      return;
    }

    setUploadedFile(file);
  };

  // Remove uploaded file
  const removeUploadedFile = () => {
    setUploadedFile(null);
    setFileError('');
  };

  // Real-time location detection using Geolocation API
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
          // Try to get address from coordinates using OpenStreetMap Nominatim API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          // Get address or use coordinates
          const address = data.address?.road || data.address?.city || data.address?.town || `Latitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)}`;
          
          setFormData((prev) => ({
            ...prev,
            location: `${address} (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
          }));
        } catch (err) {
          // Fallback to coordinates if API fails
          setFormData((prev) => ({
            ...prev,
            location: `Latitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)}`,
          }));
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
    
    // Prevent duplicate submissions
    if (isSubmitting || loading) {
      return;
    }

    setIsSubmitting(true);
    setLoading(true);
    setError('');
    setMessage('');
    setEmailMessage('');

    try {
      // Validate required fields - trim whitespace
      if (!formData.description.trim() || !formData.category.trim() || !formData.severity?.trim?.() || !formData.location.trim() || !formData.email.trim()) {
        setError('Please fill in all required fields including email');
        setIsSubmitting(false);
        setLoading(false);
        return;
      }

      const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailPattern.test(formData.email.trim())) {
        setError('Please enter a valid email address');
        setIsSubmitting(false);
        setLoading(false);
        return;
      }

      // Create FormData to handle file upload
      const submitData = new FormData();
      
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('severity', formData.severity);
      submitData.append('location', formData.location);
      submitData.append('email', formData.email);
      
      // Add fullName and phone if provided
      if (formData.fullName?.trim?.()) {
        submitData.append('fullName', formData.fullName.trim());
      }
      if (formData.phone?.trim?.()) {
        submitData.append('phone', formData.phone.trim());
      }

      // Append file if present
      if (uploadedFile) {
        submitData.append('file', uploadedFile);
      }

      // STEP 1: Submit complaint to backend API
      console.info('Submitting complaint to backend...');
      const response = await axiosClient.post('/complaints', submitData);

      if (response.data.success) {
        // Extract complaint data from backend response
        const complaint = response.data.data;
        const complaintIdValue = complaint.complaintId || complaint._id;
        const userFullName = formData.fullName?.trim?.() || 'Valued Citizen';

        setComplaintId(complaintIdValue);
        setMessage(`✅ Complaint submitted successfully! Your complaint ID: ${complaintIdValue}`);

        // STEP 2: Send confirmation email using EmailJS
        console.info('Sending complaint submission email...', {
          name: userFullName,
          email: formData.email,
          complaintId: complaintIdValue,
          category: formData.category,
        });

        const emailResult = await sendComplaintSubmission({
          to_email: formData.email,
          complaintId: complaintIdValue,
          name: userFullName,
          category: formData.category,
        });

        // Handle email result
        if (emailResult.success) {
          console.info('✅ Submission email sent successfully');
          setEmailMessage('📧 Confirmation email sent successfully');
        } else {
          console.warn('⚠️ Email sending failed, but complaint was submitted:', emailResult.message);
          setEmailMessage(`📧 Note: Confirmation email could not be sent (${emailResult.message}). Your complaint has been registered successfully.`);
        }

        // Reset form
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
        setUploadedFile(null);

        // Clear messages after 10 seconds
        setTimeout(() => {
          setMessage('');
          setComplaintId('');
          setEmailMessage('');
        }, 10000);
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

  return (
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">📋 Report a Public Issue</h2>

      {message && (
        <div className="mb-6 p-5 bg-green-50 border-2 border-green-300 text-green-900 rounded-lg font-medium space-y-3">
          <div className="text-lg">{message.split('ID:')[0]}ID:</div>
          {complaintId && (
            <div className="flex items-center gap-3 bg-white p-3 rounded border border-green-300">
              <span className="text-sm text-gray-600 whitespace-nowrap">Complaint ID:</span>
              <code className="flex-1 bg-gray-100 px-3 py-2 rounded font-mono text-sm font-bold text-gray-800 break-all">
                {complaintId}
              </code>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(complaintId);
                  alert('Complaint ID copied to clipboard!');
                }}
                className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition whitespace-nowrap"
              >
                Copy ID
              </button>
            </div>
          )}
          {emailMessage && (
            <div className="text-sm bg-white p-3 rounded border border-green-300">
              {emailMessage}
            </div>
          )}
          <p className="text-sm text-green-700 italic">
            Use this ID to track your complaint status anytime!
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Issue Details Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            🔍 Issue Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Description - Full Width */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide detailed information about the issue"
                rows="5"
                maxLength="1000"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                required
              />
              <p className="text-xs text-gray-500 mt-1">{formData.description.length}/1000 characters</p>
            </div>

            {/* Category and Severity - Two Columns */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                required
              >
                <option value="">Select a category</option>
                <option value="Roads & Potholes">🛣️ Roads & Potholes</option>
                <option value="Drainage & Sewage">💧 Drainage & Sewage</option>
                <option value="Street Lighting">💡 Street Lighting</option>
                <option value="Public Buildings">🏛️ Public Buildings</option>
                <option value="Electricity Issues">⚡ Electricity Issues</option>
                <option value="Water Supply">🚰 Water Supply</option>
                <option value="Garbage Collection">🗑️ Garbage Collection</option>
                <option value="Internet / Cable">📡 Internet / Cable</option>
                <option value="Traffic Signals">🚦 Traffic Signals</option>
                <option value="Illegal Parking">🚗 Illegal Parking</option>
                <option value="Accidents / Hazards">⚠️ Accidents / Hazards</option>
                <option value="Fire Safety">🔥 Fire Safety</option>
                <option value="Air Pollution">💨 Air Pollution</option>
                <option value="Water Pollution">🌊 Water Pollution</option>
                <option value="Noise Pollution">🔊 Noise Pollution</option>
                <option value="Tree Damage">🌳 Tree Damage</option>
                <option value="Hospitals">🏥 Hospitals</option>
                <option value="Schools">🎓 Schools</option>
                <option value="Government Offices">📋 Government Offices</option>
                <option value="Public Transport">🚌 Public Transport</option>
                <option value="Miscellaneous">🔧 Miscellaneous</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Severity <span className="text-red-500">*</span>
              </label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                required
              >
                <option value="">Select severity level</option>
                <option value="Low">🟢 Low</option>
                <option value="Medium">🟡 Medium</option>
                <option value="High">🔴 High</option>
                <option value="Emergency">🚨 Emergency</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            📍 Location
          </h3>
          <label className="block text-gray-700 font-medium mb-2">
            Location <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter the location or address"
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              required
            />
            <button
              type="button"
              onClick={getRealtimeLocation}
              disabled={locationLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2.5 px-5 rounded-lg transition duration-200 flex items-center gap-2 hover:shadow-md hover:scale-[1.02] whitespace-nowrap text-sm"
            >
              {locationLoading ? '⏳' : '📍'} {locationLoading ? 'Getting...' : 'Get Current'}
            </button>
          </div>
          {locationError && (
            <p className="text-xs text-red-600 mt-2">⚠️ {locationError}</p>
          )}
          {formData.location && !locationError && (
            <p className="text-xs text-green-600 mt-2">✓ Location detected</p>
          )}
        </div>

        {/* File Upload Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            📎 Attach Evidence (Optional)
          </h3>
          <p className="text-gray-600 text-sm mb-3">Upload photos, videos, or documents related to the issue (Max 5MB)</p>
          
          {!uploadedFile ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-3xl mb-2">📁</div>
                <p className="text-gray-700 font-medium mb-1">Click to upload or drag and drop</p>
                <p className="text-gray-500 text-xs">Images (JPEG, PNG, GIF), PDF, Word documents</p>
              </label>
            </div>
          ) : (
            <div className="border border-green-300 bg-green-50 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="text-gray-700 font-medium text-sm">{uploadedFile.name}</p>
                  <p className="text-gray-500 text-xs">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <button
                type="button"
                onClick={removeUploadedFile}
                className="text-red-600 hover:text-red-800 font-semibold text-sm"
              >
                Remove
              </button>
            </div>
          )}
          {fileError && (
            <p className="text-xs text-red-600 mt-2">⚠️ {fileError}</p>
          )}
        </div>

        {/* Contact Information Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            📧 Contact Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Full Name <span className="text-gray-500 font-normal text-sm">(optional)</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Phone <span className="text-gray-500 font-normal text-sm">(optional)</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit phone number"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Email - Full Width */}
          <div className="mt-6">
            <label className="block text-gray-700 font-medium mb-2">
              Email <span className="text-red-500">*</span> <span className="text-gray-500 font-normal text-sm">(required - receive updates)</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 text-lg font-semibold rounded-lg transition duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '⏳ Submitting...' : '📤 Submit Complaint'}
        </button>
      </form>
    </div>
  );
}
