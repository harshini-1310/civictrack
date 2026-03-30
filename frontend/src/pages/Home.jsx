import ComplaintForm from '../components/ComplaintForm';

export default function Home() {
  return (
    <div className="flex flex-col bg-gray-50 min-h-screen w-full">
      <div className="flex-1 w-full px-4 md:px-6 py-8">
        <div className="w-full mx-auto space-y-10">
          {/* Page Header */}
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-2">
              Civic<span className="text-blue-600">Track</span>
            </h1>
            <p className="text-xl text-blue-600 font-semibold mb-4">Track. Report. Resolve.</p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Help improve our community by reporting public issues. Your voice matters!
            </p>
          </div>

          {/* Quick Tips Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="font-semibold text-gray-900 mb-2">Be Specific</h3>
              <p className="text-gray-600 text-sm">Provide clear details about the issue location and nature</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-semibold text-gray-900 mb-2">Set Priority</h3>
              <p className="text-gray-600 text-sm">Select appropriate severity level for faster resolution</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-3">📧</div>
              <h3 className="font-semibold text-gray-900 mb-2">Get Updates</h3>
              <p className="text-gray-600 text-sm">Provide email to receive notifications when issue is resolved</p>
            </div>
          </div>

          {/* Complaint Form */}
          <ComplaintForm />
        </div>
      </div>
    </div>
  );
}
