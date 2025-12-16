import React, { useEffect, useState, useRef } from "react";
import {
  FaEdit, FaTrash, FaTimes, FaFileInvoiceDollar, FaSearch,
  FaEye, FaUser, FaMapMarkerAlt, FaMoneyBillWave, FaDownload,
  FaCalendarAlt, FaFileExport, FaPhone, FaEnvelope, FaMotorcycle,
  FaClock, FaBox, FaPercentage, FaCreditCard, FaReceipt,
  FaStickyNote, FaTags, FaShield, FaCheckCircle,
  FaChevronLeft, FaChevronRight
} from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusEdit, setStatusEdit] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [dateFilter, setDateFilter] = useState("all"); // "all", "weekly", "monthly"
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const invoiceRef = useRef();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const vendorId = localStorage.getItem("vendorId");
    if (!vendorId) {
      setError("Vendor ID not found in local storage");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://31.97.206.144:7021/api/vendor/orders/${vendorId}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch orders");

      // Use the orders directly from the response
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getUserIdLast4 = (userId) => {
    if (!userId) return "N/A";
    const str = userId.toString();
    return str.slice(-4);
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setStatusEdit(order.status);
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setSelectedOrder(null);
    setShowOrderModal(false);
  };

  const openInvoiceModal = (order) => {
    setSelectedOrder(order);
    setShowInvoiceModal(true);
  };

  const closeInvoiceModal = () => {
    setSelectedOrder(null);
    setShowInvoiceModal(false);
  };

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setStatusEdit(order.status);
    setShowStatusModal(true);
  };

  const closeStatusModal = () => {
    setSelectedOrder(null);
    setShowStatusModal(false);
    setUpdatingStatus(false);
  };

  const handleStatusChange = (e) => {
    setStatusEdit(e.target.value);
  };

  // ✅ NEW: Update Order Status API Integration
  const updateOrderStatus = async () => {
    if (!selectedOrder || !statusEdit) return;

    setUpdatingStatus(true);
    try {
      const vendorId = localStorage.getItem("vendorId");
      if (!vendorId) throw new Error("Vendor ID not found");

      const res = await fetch(
        `http://31.97.206.144:7021/api/vendor/orderstatus/${vendorId}/${selectedOrder._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: statusEdit }),
        }
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update status");

      // Update local state
      setOrders((prev) =>
        prev.map((o) =>
          o._id === selectedOrder._id ? { ...o, status: statusEdit } : o
        )
      );

      // Update selected order if it's currently open in modal
      if (showOrderModal) {
        setSelectedOrder(prev => ({ ...prev, status: statusEdit }));
      }

      alert("Order status updated successfully!");
      closeStatusModal();
    } catch (err) {
      alert(err.message || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await fetch(`http://31.97.206.144:7021/api/vendor/orders/${orderId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete order");

      setOrders((prev) => prev.filter((order) => order._id !== orderId));
      alert("Order deleted successfully!");
    } catch (err) {
      alert(err.message || "Failed to delete order");
    }
  };

  const downloadInvoice = () => {
    const input = invoiceRef.current;
    if (!input) return;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${selectedOrder._id}.pdf`);
    });
  };

  // Get date range for weekly filter (current week)
  const getWeeklyDateRange = () => {
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Calculate Monday (start of week)
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    firstDayOfWeek.setDate(today.getDate() + diffToMonday);
    firstDayOfWeek.setHours(0, 0, 0, 0);

    // Calculate Sunday (end of week)
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
    lastDayOfWeek.setHours(23, 59, 59, 999);

    return {
      start: firstDayOfWeek.toISOString().split('T')[0],
      end: lastDayOfWeek.toISOString().split('T')[0]
    };
  };

  // Get date range for monthly filter (current month)
  const getMonthlyDateRange = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return {
      start: firstDayOfMonth.toISOString().split('T')[0],
      end: lastDayOfMonth.toISOString().split('T')[0]
    };
  };

  // Handle date filter change
  const handleDateFilterChange = (filterType) => {
    setDateFilter(filterType);
    setCurrentPage(1); // Reset to first page when filter changes

    if (filterType === "weekly") {
      const weeklyRange = getWeeklyDateRange();
      setStartDate(weeklyRange.start);
      setEndDate(weeklyRange.end);
    } else if (filterType === "monthly") {
      const monthlyRange = getMonthlyDateRange();
      setStartDate(monthlyRange.start);
      setEndDate(monthlyRange.end);
    } else {
      // "all" - clear date filters
      setStartDate("");
      setEndDate("");
    }
  };

  // Filter the orders based on search query and date range
  const filteredOrders = orders.filter((order) => {
    const matchQuery =
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.userId && order.userId.toString().includes(searchQuery)) ||
      order.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.assignedRider?.name?.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchDate =
      (startDate ? new Date(order.createdAt) >= new Date(startDate) : true) &&
      (endDate ? new Date(order.createdAt) <= new Date(endDate) : true);

    return matchQuery && matchDate;
  });

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  console.log("Filtered Orders:", filteredOrders);
  console.log("Current Orders:", currentOrders);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Change page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Reset to first page when search query changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, startDate, endDate]);

  // Export the filtered orders as CSV
  const exportToCSV = () => {
    const header = ["Order ID", "User ID", "Items", "Total Amount", "Status", "Payment Method", "Rider", "Date"];
    const rows = filteredOrders.map((order) => [
      order._id,
      getUserIdLast4(order.userId),
      order.orderItems.filter(item => item.medicineId).map((med) => `${med.name} × ${med.quantity}`).join(", "),
      `₹${order.totalAmount}`,
      order.status,
      order.paymentMethod,
      order.assignedRider?.name || "Not Assigned",
      new Date(order.createdAt).toLocaleDateString("en-IN"),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      header.join(",") +
      "\n" +
      rows.map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "orders.csv");
    link.click();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Accepted':
        return 'bg-blue-100 text-blue-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'Rider Assigned':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiderStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'text-green-600';
      case 'Rejected':
        return 'text-red-600';
      case 'Pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Orders</h2>
        <div className="text-sm text-gray-500">
          Showing {currentOrders.length} of {filteredOrders.length} order(s)
          {filteredOrders.length > ordersPerPage && (
            <span className="ml-2">(Page {currentPage} of {totalPages})</span>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading orders...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          {/* Search */}
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Orders
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by Order ID, User ID, Status, or Rider Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Quick Date Filters */}
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Filters
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => handleDateFilterChange("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${dateFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                All Time
              </button>
              <button
                onClick={() => handleDateFilterChange("weekly")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${dateFilter === "weekly"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                This Week
              </button>
              <button
                onClick={() => handleDateFilterChange("monthly")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${dateFilter === "monthly"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                This Month
              </button>
            </div>
          </div>

          {/* Date Filters */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setDateFilter("custom");
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setDateFilter("custom");
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Export Button */}
          <div className="w-full lg:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2 invisible">
              Export
            </label>
            <button
              onClick={exportToCSV}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors flex items-center justify-center"
            >
              <FaFileExport className="mr-2" size={16} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Active Filter Info */}
        {(startDate || endDate || dateFilter !== "all") && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {dateFilter === "weekly" && "Showing orders from this week"}
              {dateFilter === "monthly" && "Showing orders from this month"}
              {dateFilter === "custom" && "Showing orders from custom date range"}
              {startDate && endDate && ` (${startDate} to ${endDate})`}
            </div>
            <button
              onClick={() => handleDateFilterChange("all")}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear Dates
            </button>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Details
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment & Rider
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-blue-600" size={16} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          Order #{order._id.slice(-8)}
                        </div>
                        <div className="text-sm text-gray-500">
                          User ID: {getUserIdLast4(order.userId)}
                        </div>
                        {order.isPrescriptionOrder && (
                          <div className="text-xs text-orange-600 font-medium mt-1">
                            Prescription Order
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {order.orderItems.filter(item => item.medicineId).length} item(s)
                    </div>
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {order.orderItems.find(item => item.medicineId)?.name || 'No items'}
                      {order.orderItems.filter(item => item.medicineId).length > 1 && ` +${order.orderItems.filter(item => item.medicineId).length - 1} more`}
                    </div>
                    {order.couponCode && (
                      <div className="text-xs text-green-600 mt-1">
                        Coupon: {order.couponCode}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">
                      {formatCurrency(
                        order.orderItems.reduce(
                          (total, item) => total + (Number(item.price) || Number(item.medicineId.price) || 0),
                          0
                        )
                      )}
                    </div>

                    {order.discountAmount > 0 && (
                      <div className="text-xs text-red-600">
                        -{formatCurrency(order.discountAmount)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 capitalize">
                      {order.paymentMethod}
                    </div>
                    <div className={`text-xs font-medium ${order.paymentStatus === 'Pending' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                      {order.paymentStatus}
                    </div>
                    {order.assignedRider && (
                      <div className="text-xs text-gray-600 mt-1">
                        Rider: {order.assignedRider.name}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    {order.assignedRider && (
                      <div className={`text-xs mt-1 ${getRiderStatusColor(order.assignedRiderStatus)}`}>
                        Rider: {order.assignedRiderStatus}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {/* ✅ EDIT BUTTON ADDED */}
                      <button
                        onClick={() => openStatusModal(order)}
                        className="text-purple-600 hover:text-purple-800 transition-colors p-2 rounded-full hover:bg-purple-50"
                        title="Edit Status"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => openOrderModal(order)}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-full hover:bg-blue-50"
                        title="View Full Details"
                      >
                        <FaEye size={16} />
                      </button>
                      <button
                        onClick={() => openInvoiceModal(order)}
                        className="text-green-600 hover:text-green-800 transition-colors p-2 rounded-full hover:bg-green-50"
                        title="Download Invoice"
                      >
                        <FaFileInvoiceDollar size={16} />
                      </button>
                      <button
                        onClick={() => deleteOrder(order._id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-full hover:bg-red-50"
                        title="Delete Order"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <div className="text-gray-500 text-lg">No orders found</div>
                  <div className="text-gray-400 text-sm mt-2">
                    {searchQuery || startDate || endDate ? 'Try adjusting your search or filters' : 'No orders available'}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Simplified Pagination */}
        {filteredOrders.length > ordersPerPage && (
          <div className="bg-white px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstOrder + 1}</span> to{" "}
                <span className="font-medium">
                  {indexOfLastOrder > filteredOrders.length ? filteredOrders.length : indexOfLastOrder}
                </span> of{" "}
                <span className="font-medium">{filteredOrders.length}</span> results
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  <FaChevronLeft size={14} className="mr-2" />
                  Previous
                </button>

                <div className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </div>

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  Next
                  <FaChevronRight size={14} className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ✅ NEW: Status Update Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Update Order Status</h3>
                <p className="text-gray-500 text-sm mt-1">Order ID: {selectedOrder._id.slice(-8)}</p>
              </div>
              <button
                onClick={closeStatusModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Status: <span className={`font-semibold ${getStatusColor(selectedOrder.status)} px-2 py-1 rounded-full`}>
                    {selectedOrder.status}
                  </span>
                </label>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status
                </label>
                <select
                  value={statusEdit}
                  onChange={handleStatusChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                {statusEdit === 'Rejected' && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Rejecting this order will unassign it from you and it will be reassigned to another vendor after 5 minutes.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={closeStatusModal}
                disabled={updatingStatus}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={updateOrderStatus}
                disabled={updatingStatus || statusEdit === selectedOrder.status}
                className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 flex items-center"
              >
                {updatingStatus ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="mr-2" size={14} />
                    Update Status
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Order Details</h3>
                <p className="text-gray-500 text-sm mt-1">Order ID: {selectedOrder._id}</p>
              </div>
              <button
                onClick={closeOrderModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaBox className="text-blue-600 mr-2" />
                    Order Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Order Status</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="font-medium text-gray-900">{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Payment Status</span>
                      <span className={`font-medium ${selectedOrder.paymentStatus === 'Pending' ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">User ID</span>
                      <span className="font-medium text-gray-900">{selectedOrder.userId}</span>
                    </div>
                  </div>
                </div>

                {/* Order Flags */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Flags</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Prescription Order</span>
                      <span className={`font-medium ${selectedOrder.isPrescriptionOrder ? 'text-green-600' : 'text-gray-600'}`}>
                        {selectedOrder.isPrescriptionOrder ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Reordered</span>
                      <span className={`font-medium ${selectedOrder.isReordered ? 'text-green-600' : 'text-gray-600'}`}>
                        {selectedOrder.isReordered ? 'Yes' : 'No'}
                      </span>
                    </div>
                    {selectedOrder.couponCode && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600">Coupon Code</span>
                        <span className="font-medium text-green-600">{selectedOrder.couponCode}</span>
                      </div>
                    )}
                    {selectedOrder.transactionId && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600">Transaction ID</span>
                        <span className="font-medium text-gray-900 text-sm">{selectedOrder.transactionId}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Update */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h4>
                  <div className="space-y-3">
                    <select
                      value={statusEdit}
                      onChange={handleStatusChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <button
                      onClick={updateOrderStatus}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              </div>

              {/* Rider Information */}
              {selectedOrder.assignedRider && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaMotorcycle className="text-blue-600 mr-2" />
                    Rider Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-4">
                      {selectedOrder.assignedRider.profileImage ? (
                        <img
                          src={selectedOrder.assignedRider.profileImage}
                          alt={selectedOrder.assignedRider.name}
                          className="h-16 w-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaUser className="text-blue-600" size={20} />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{selectedOrder.assignedRider.name}</div>
                        <div className="text-sm text-gray-500">Rider ID: {selectedOrder.assignedRider._id}</div>
                        <div className={`text-sm font-medium mt-1 ${getRiderStatusColor(selectedOrder.assignedRiderStatus)}`}>
                          Status: {selectedOrder.assignedRiderStatus}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-600 flex items-center">
                          <FaEnvelope className="mr-2 text-blue-600" size={12} />
                          Email:
                        </span>
                        <span className="font-medium text-gray-900">{selectedOrder.assignedRider.email}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-600 flex items-center">
                          <FaPhone className="mr-2 text-blue-600" size={12} />
                          Phone:
                        </span>
                        <span className="font-medium text-gray-900">{selectedOrder.assignedRider.phone}</span>
                      </div>
                      {/* <div className="flex justify-between items-center py-1">
                        <span className="text-gray-600">Delivery Charge:</span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(selectedOrder.assignedRider.deliveryCharge || selectedOrder.deliveryCharge)}
                        </span>
                      </div> */}
                    </div>
                  </div>
                </div>
              )}

              {/* Delivery Address */}
              {selectedOrder.deliveryAddress && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaMapMarkerAlt className="text-blue-600 mr-2" />
                    Delivery Address
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">House No.</span>
                        <span className="font-medium text-gray-900">{selectedOrder.deliveryAddress.house}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Street</span>
                        <span className="font-medium text-gray-900">{selectedOrder.deliveryAddress.street}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">City</span>
                        <span className="font-medium text-gray-900">{selectedOrder.deliveryAddress.city}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">State</span>
                        <span className="font-medium text-gray-900">{selectedOrder.deliveryAddress.state}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Pincode</span>
                        <span className="font-medium text-gray-900">{selectedOrder.deliveryAddress.pincode}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Country</span>
                        <span className="font-medium text-gray-900">{selectedOrder.deliveryAddress.country}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.orderItems.map((item, index) => (
                    <div key={item._id} className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{item.name}</div>
                        {item.medicineId && (
                          <div className="text-sm text-gray-500 mt-1">Medicine ID: {item.medicineId}</div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">Quantity: {item.quantity}</div>
                        {item.price ? (
                          <div className="text-sm text-gray-600">Price: {formatCurrency(item.price)}</div>
                        ) : (
                          <div className="text-sm text-gray-600">Price: {formatCurrency(item.medicineId.price)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FaMoneyBillWave className="text-blue-600 mr-2" />
                  Pricing Details
                </h4>
                <div className="space-y-3 max-w-md">
                  {/* <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency((selectedOrder.totalAmount || 0) + (selectedOrder.discountAmount || 0) - (selectedOrder.deliveryCharge || 0) - (selectedOrder.platformCharge || 0))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Delivery Charge</span>
                    <span className="font-medium text-gray-900">{formatCurrency(selectedOrder.deliveryCharge)}</span>
                  </div>
                  {selectedOrder.discountAmount > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600 flex items-center">
                        <FaPercentage className="text-green-600 mr-1" size={12} />
                        Discount ({selectedOrder.couponCode})
                      </span>
                      <span className="font-medium text-green-600">-{formatCurrency(selectedOrder.discountAmount)}</span>
                    </div>
                  )} */}
                  {selectedOrder.orderItems.map((item) => (
                    <div key={item._id} className="flex justify-between text-sm text-gray-600">
                      <span>{item.name}</span>
                      <span>{formatCurrency(item.price || item.medicineId.price || 0)}</span>
                    </div>
                  ))}

                  <hr className="my-3" />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-green-600">
                      {formatCurrency(
                        selectedOrder.orderItems.reduce(
                          (sum, item) => sum + (Number(item.price) || Number(item.medicineId.price) || 0),
                          0
                        )
                      )}
                    </span>
                  </div>

                  {/* {selectedOrder.paymentMethod === 'Cash on Delivery' && (
                    <div className="flex justify-between items-center py-2 border-t border-gray-200">
                      <span className="text-gray-600">COD Amount Received</span>
                      <span className="font-medium text-gray-900">{formatCurrency(selectedOrder.codAmountReceived)}</span>
                    </div>
                  )} */}
                </div>
              </div>

              {/* Customer Notes */}
              {selectedOrder.notes && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaStickyNote className="text-blue-600 mr-2" />
                    Customer Notes
                  </h4>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-700">{selectedOrder.notes}</p>
                  </div>
                </div>
              )}

              {/* Status Timeline */}
              {selectedOrder.statusTimeline && selectedOrder.statusTimeline.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaClock className="text-blue-600 mr-2" />
                    Status Timeline
                  </h4>
                  <div className="space-y-4">
                    {selectedOrder.statusTimeline.map((timeline, index) => (
                      <div key={timeline._id} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1 border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                          <div className="flex justify-between items-start">
                            <span className="font-medium text-gray-900">{timeline.status}</span>
                            <span className="text-sm text-gray-500">{formatDate(timeline.timestamp)}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{timeline.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Voice Note */}
                {selectedOrder.voiceNoteUrl && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Voice Note</h4>
                    <audio controls className="w-full">
                      <source src={selectedOrder.voiceNoteUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}

                {/* Delivery Proof */}
                {selectedOrder.deliveryProof && selectedOrder.deliveryProof.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Delivery Proof</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedOrder.deliveryProof.map((proof, index) => (
                        <img key={index} src={proof} alt={`Delivery proof ${index + 1}`} className="rounded-lg object-cover h-24 w-full" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={closeOrderModal}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  closeOrderModal();
                  openInvoiceModal(selectedOrder);
                }}
                className="px-6 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors flex items-center"
              >
                <FaFileInvoiceDollar className="mr-2" size={14} />
                Generate Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoiceModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Invoice</h3>
                <p className="text-gray-500 text-sm mt-1">Order ID: {selectedOrder._id}</p>
              </div>
              <button
                onClick={closeInvoiceModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <div className="p-6" ref={invoiceRef}>
              <div className="mb-6">
                <div className="text-sm text-gray-500">Date: {formatDate(selectedOrder.createdAt)}</div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Delivery Address:</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium">{selectedOrder.deliveryAddress?.house}</p>
                  <p>{selectedOrder.deliveryAddress?.street}</p>
                  <p>
                    {selectedOrder.deliveryAddress?.city}, {selectedOrder.deliveryAddress?.state} -{" "}
                    {selectedOrder.deliveryAddress?.pincode}
                  </p>
                  <p>{selectedOrder.deliveryAddress?.country}</p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Order Items:</h4>
                <table className="w-full border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Item Name</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.orderItems
                      .filter(item => item.medicineId)
                      .map((item, idx) => (
                        <tr key={idx}>
                          <td className="border px-4 py-2">{item.name}</td>
                          <td className="border px-4 py-2 text-center">
                            ₹{(Number(item.price) || Number(item.medicineId.price) || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                  </tbody>

                  {/* ✅ FOOTER → ONCE */}
                  <tfoot>
                    <tr>
                      <td className="border px-4 py-2 text-right font-semibold">
                        Grand Total:
                      </td>
                      <td className="border px-4 py-2 text-center font-semibold text-green-600">
                        ₹{selectedOrder.orderItems
                          .filter(item => item.medicineId)
                          .reduce((total, item) => total + (Number(item.price) || Number(item.medicineId.price) || 0), 0)
                          .toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>


                </table>

              </div>
            </div>

            <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={closeInvoiceModal}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Close
              </button>
              <button
                onClick={downloadInvoice}
                className="px-6 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors flex items-center"
              >
                <FaDownload className="mr-2" size={14} />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllOrders;