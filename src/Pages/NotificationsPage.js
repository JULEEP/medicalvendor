import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const vendorId = localStorage.getItem("vendorId");

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!vendorId) {
        setError("Vendor ID not found in localStorage.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://31.97.206.144:7021/api/vendor/notifications/${vendorId}`
        );
        if (response.data.notifications) {
          setNotifications(response.data.notifications.slice().reverse());
        }
      } catch (err) {
        setError("Error fetching notifications");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [vendorId]);

  // ✅ Confirm before deleting notification
  const handleDelete = async (notificationId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this notification?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `http://31.97.206.144:7021/api/vendor/deletenotification/${vendorId}/${notificationId}`
      );

      if (response.status === 200) {
        setNotifications((prev) =>
          prev.filter((notif) => notif._id !== notificationId)
        );
        setSuccessMessage("Notification deleted successfully!");

        // Auto-dismiss success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (err) {
      setError("Error deleting notification");
      console.error("Error deleting notification", err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold text-center mb-6">Vendor Notifications</h1>

      {/* ✅ Success Message */}
      {successMessage && (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4 shadow-md text-center">
          {successMessage}
        </div>
      )}

      {/* Loading and Error Handling */}
      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {/* No notifications */}
      {notifications.length === 0 && !loading && (
        <p className="text-center text-gray-500">No notifications found.</p>
      )}

      {/* ✅ Notifications List */}
      <div className="notification-list space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification._id}
            className="notification-item flex items-center justify-between bg-white p-4 rounded-md shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className="notification-content flex-1 pr-4">
              <p className="text-sm font-medium text-gray-800">
                <strong>Message:</strong> {notification.message}
              </p>
              <p className="text-xs text-gray-600">
                <strong>Order ID:</strong> {notification.orderId}
              </p>
              <p className="text-xs text-gray-500">
                <strong>Status:</strong> {notification.status}
              </p>
              <p className="text-xs text-gray-400">
                <strong>Timestamp:</strong>{" "}
                {new Date(notification.timestamp).toLocaleString()}
              </p>
            </div>

            {/* ✅ Delete button */}
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDelete(notification._id)}
              title="Delete Notification"
            >
              <FaTrashAlt size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
