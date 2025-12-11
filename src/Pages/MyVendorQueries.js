import React, { useEffect, useState } from "react";

export default function MyVendorQueries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const vendorId = localStorage.getItem("vendorId");

  useEffect(() => {
    const fetchQueries = async () => {
      if (!vendorId) {
        setError("Vendor ID not found. Please login again.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://31.97.206.144:7021/api/vendor/myqueries/${vendorId}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Failed to fetch queries.");

        setQueries(data.queries || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, [vendorId]);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return "bg-green-100 text-green-800";
      case "in progress":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-blue-700">My Submitted Queries</h2>
      </div>

      {loading && <p className="text-gray-600">Loading queries...</p>}

      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && queries.length === 0 && (
        <p className="text-gray-600 text-center">No queries found.</p>
      )}

      {!loading && !error && queries.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
            <thead className="bg-blue-50 text-sm font-semibold text-blue-700 uppercase">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Mobile</th>
                <th className="px-6 py-3 text-left">Message</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Submitted At</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y">
              {queries.map((query) => (
                <tr key={query._id}>
                  <td className="px-6 py-4">{query.name}</td>
                  <td className="px-6 py-4">{query.email}</td>
                  <td className="px-6 py-4">{query.mobile}</td>
                  <td className="px-6 py-4 max-w-xs truncate">{query.message}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(query.status)}`}
                    >
                      {query.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(query.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
