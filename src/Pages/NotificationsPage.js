import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";

const PER_PAGE = 5;

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const vendorId = localStorage.getItem("vendorId");

  // ✅ Fetch
  useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `http://31.97.206.144:7021/api/vendor/notifications/${vendorId}`
      );

      const data = res.data.notifications || [];
      setNotifications([...data].reverse());
    } catch (err) {
      setError("Error fetching notifications");
    } finally {
      setLoading(false);
    }
  };

  fetchNotifications(); // initial load

  const interval = setInterval(() => {
    fetchNotifications();
  }, 10000); // 10 seconds

  return () => clearInterval(interval); // cleanup
}, [vendorId]);

  // ✅ Pagination
  const totalPages = Math.ceil(notifications.length / PER_PAGE);

  const paginated = notifications.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE
  );

  // ✅ Ellipsis Pagination
  const getPagination = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return [...Array(totalPages)].map((_, i) => i + 1);
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    pages.push(1);

    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < totalPages - 1) pages.push("...");

    pages.push(totalPages);

    return pages;
  };

  // ✅ Select logic
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selected.length === paginated.length) {
      setSelected([]);
    } else {
      setSelected(paginated.map((n) => n._id));
    }
  };

  // ✅ Delete single
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notification?")) return;

    await axios.delete(
      `http://31.97.206.144:7021/api/vendor/deletenotification/${vendorId}/${id}`
    );

    setNotifications((prev) => prev.filter((n) => n._id !== id));
    setSuccessMessage("Deleted successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // ✅ Bulk delete
  const handleBulkDelete = async () => {
    if (!selected.length) return;

    const confirmDelete = window.confirm(
      `Delete ${selected.length} notifications?`
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);

      const successIds = [];
      const failedIds = [];

      // ✅ DELETE ONE BY ONE (safe for your API)
      for (let id of selected) {
        try {
          await axios.delete(
            `http://31.97.206.144:7021/api/vendor/deletenotification/${vendorId}/${id}`
          );
          successIds.push(id);
        } catch (err) {
          console.error("Failed:", id);
          failedIds.push(id);
        }
      }

      // ✅ Update UI
      setNotifications((prev) =>
        prev.filter((n) => !successIds.includes(n._id))
      );

      setSelected([]);

      // ✅ Messages
      if (failedIds.length === 0) {
        setSuccessMessage("All notifications deleted!");
      } else {
        setError(`${failedIds.length} failed to delete`);
      }

      setTimeout(() => {
        setSuccessMessage("");
        setError("");
      }, 3000);

    } catch (err) {
      setError("Bulk delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-xl sm:text-2xl font-bold">
          Notifications
        </h1>

        {selected.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaTrashAlt /> Delete ({selected.length})
          </button>
        )}
      </div>

      {/* Success */}
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-center">
          {successMessage}
        </div>
      )}

      {/* Loading / Error */}
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Empty */}
      {!loading && notifications.length === 0 && (
        <p className="text-center text-gray-500">
          No notifications found
        </p>
      )}

      {/* Table */}
      {!loading && notifications.length > 0 && (
        <>
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">
                    <input
                      type="checkbox"
                      onChange={selectAll}
                      checked={
                        selected.length === paginated.length &&
                        paginated.length > 0
                      }
                    />
                  </th>
                  <th className="p-3 text-left">Message</th>
                  <th className="p-3">Order</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {paginated.map((n) => (
                  <tr key={n._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(n._id)}
                        onChange={() => toggleSelect(n._id)}
                      />
                    </td>

                    <td className="p-3 font-medium text-gray-800">
                      {n.message}
                    </td>

                    <td className="p-3 text-center text-xs">
                      {n.orderId || "-"}
                    </td>

                    <td className="p-3 text-center">
                      <span className="px-2 py-1 text-xs bg-blue-100 rounded">
                        {n.status}
                      </span>
                    </td>

                    <td className="p-3 text-xs text-gray-500 text-center">
                      {new Date(n.timestamp).toLocaleString()}
                    </td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(n._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6 gap-2 flex-wrap">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              Prev
            </button>

            {getPagination().map((p, i) =>
              p === "..." ? (
                <span key={i} className="px-2">
                  ...
                </span>
              ) : (
                <button
                  key={i}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 rounded ${page === p
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                    }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              onClick={() =>
                setPage((p) => Math.min(p + 1, totalPages))
              }
              className="px-3 py-1 bg-gray-200 rounded"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationsPage;