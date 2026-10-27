import React, { useState, useEffect } from 'react';

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch data from API
  const fetchUsers = async (shouldFail = false) => {
    setLoading(true);
    setError(null);

    const url = shouldFail
      ? 'https://jsonplaceholder.typicode.com/invalid-users-url'
      : 'https://jsonplaceholder.typicode.com/users';

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch data (Status ${response.status})`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message || 'Something went wrong while fetching data.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 rounded border border-gray-200 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600 text-sm mt-1">
            API call demonstration with loading and error states using Tailwind CSS.
          </p>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => fetchUsers(false)}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded text-sm font-medium transition cursor-pointer"
            >
              {loading ? 'Fetching...' : 'Fetch Users (Success)'}
            </button>

            <button
              onClick={() => fetchUsers(true)}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-4 py-2 rounded text-sm font-medium transition cursor-pointer"
            >
              Simulate Error
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span className="text-sm font-medium">Loading data from API, please wait...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="font-semibold text-sm">Error Occurred</p>
              <p className="text-sm">{error}</p>
            </div>
            <button
              onClick={() => fetchUsers(false)}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-medium self-start sm:self-auto cursor-pointer"
            >
              Retry API Call
            </button>
          </div>
        )}

        {/* Success / Data Table */}
        {!loading && !error && users.length > 0 && (
          <div className="bg-white rounded border border-gray-200 overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-base font-semibold text-gray-800">Users List</h2>
              <span className="text-xs text-gray-500 font-medium">Total: {users.length} users</span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-xs">ID</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-xs">Name</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-xs">Email</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-xs">Phone</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-xs">City</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-xs">Company</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 whitespace-nowrap text-gray-500">{user.id}</td>
                      <td className="px-6 py-3 whitespace-nowrap font-medium text-gray-900">{user.name}</td>
                      <td className="px-6 py-3 whitespace-nowrap text-gray-600">{user.email}</td>
                      <td className="px-6 py-3 whitespace-nowrap text-gray-600">{user.phone}</td>
                      <td className="px-6 py-3 whitespace-nowrap text-gray-600">{user.address?.city}</td>
                      <td className="px-6 py-3 whitespace-nowrap text-gray-600">{user.company?.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && users.length === 0 && (
          <div className="bg-white p-8 rounded border border-gray-200 text-center text-gray-500">
            No data available. Click "Fetch Users" above to load data.
          </div>
        )}
      </div>
    </div>
  );
}
