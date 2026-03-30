export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold mb-4">About CivicTrack</h3>
            <p className="text-sm">
              A platform for citizens to report public issues and for administrators to manage and resolve them efficiently.
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Categories</h3>
            <ul className="text-sm space-y-2">
              <li>🛣️ Road Issues</li>
              <li>⚡ Electricity</li>
              <li>💧 Drainage</li>
              <li>🔧 Other</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Contact</h3>
            <p className="text-sm">Email: support@civictrack.com</p>
            <p className="text-sm">Phone: +1-800-CITIZEN</p>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-sm">
          <p>&copy; 2024 CivicTrack. All rights reserved. 📍</p>
        </div>
      </div>
    </footer>
  );
}
