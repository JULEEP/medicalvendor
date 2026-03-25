import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaBox,
  FaShoppingBag,
  FaPlusCircle,
  FaBolt,
  FaChartBar,
  FaClock,
  FaEnvelope,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaClock as FaClockIcon,
  FaTimesCircle,
  FaRupeeSign
} from "react-icons/fa";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Reusable Stat Card
const StatCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-100",
    green: "text-green-600 bg-green-100",
    purple: "text-purple-600 bg-purple-100",
    yellow: "text-yellow-600 bg-yellow-100",
    orange: "text-orange-600 bg-orange-100",
    red: "text-red-600 bg-red-100",
    emerald: "text-emerald-600 bg-emerald-100",
  };

  return (
    <div className="bg-white rounded-lg shadow p-3 md:p-4 flex items-center justify-between">
      <div className={`p-2 md:p-3 rounded-full ${colorClasses[color]}`}>
        <Icon className="text-xl md:text-2xl" />
      </div>
      <div className="text-right">
        <p className="text-gray-500 text-xs md:text-sm">{label}</p>
        <p className="text-lg md:text-xl font-bold">{value}</p>
      </div>
    </div>
  );
};

const QuickActionButton = ({ label, route }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(route)}
      className="bg-gray-100 hover:bg-gray-200 py-2 md:py-3 rounded text-center font-medium text-sm md:text-base w-full transition-colors duration-200"
    >
      {label}
    </button>
  );
};

// Message Table Component (Mobile Responsive)
const MessageTable = ({ messages, currentPage, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(messages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMessages = messages.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Message
              </th>
              <th scope="col" className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedMessages.length > 0 ? (
              paginatedMessages.map((message, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 md:px-6 py-2 md:py-4 whitespace-normal text-xs md:text-sm text-gray-900 max-w-xs truncate md:max-w-none">
                    <span className="block md:hidden font-medium mb-1">Message:</span>
                    {message.message}
                  </td>
                  <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                    <span className="block md:hidden font-medium mb-1">Date:</span>
                    {formatDate(message.sentAt)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">
                  No messages found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls - Mobile Responsive */}
      {messages.length > itemsPerPage && (
        <div className="bg-white px-3 md:px-4 py-2 md:py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between items-center flex-wrap gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-3 md:px-4 py-1 md:py-2 border border-gray-300 text-xs md:text-sm font-medium rounded-md ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FaChevronLeft className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </button>

            <span className="text-xs md:text-sm text-gray-700 px-2">
              Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
            </span>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-3 md:px-4 py-1 md:py-2 border border-gray-300 text-xs md:text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
              <FaChevronRight className="h-3 w-3 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Payment Table Component (Mobile Responsive)
const PaymentTable = ({ paymentStatus, revenueByMonth }) => {
  const formatMonth = (monthString) => {
    const [year, month] = monthString.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'paid':
        return {
          icon: FaCheckCircle,
          color: 'text-green-600 bg-green-100',
          text: 'Paid'
        };
      case 'pending':
        return {
          icon: FaClockIcon,
          color: 'text-yellow-600 bg-yellow-100',
          text: 'Pending'
        };
      default:
        return {
          icon: FaTimesCircle,
          color: 'text-red-600 bg-red-100',
          text: 'Unpaid'
        };
    }
  };

  const paymentData = useMemo(() => {
    if (!paymentStatus || !revenueByMonth) return [];
    
    const months = Object.keys(paymentStatus);
    return months
      .map(month => ({
        month,
        formattedMonth: formatMonth(month),
        status: paymentStatus[month],
        revenue: revenueByMonth[month]?.amount || 0,
        ...getStatusInfo(paymentStatus[month])
      }))
      .sort((a, b) => b.month.localeCompare(a.month));
  }, [paymentStatus, revenueByMonth]);

  if (paymentData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4 md:p-6 text-center">
        <p className="text-gray-500 text-sm md:text-base">No payment data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Month
              </th>
              <th scope="col" className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Revenue
              </th>
              <th scope="col" className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paymentData.map((payment, index) => {
              const StatusIcon = payment.icon;
              return (
                <tr key={payment.month} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900">
                    <span className="md:hidden font-medium text-gray-500 mr-2">Month:</span>
                    {payment.formattedMonth}
                  </td>
                  <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                    <div className="flex items-center">
                      <FaRupeeSign className="h-3 w-3 mr-1 text-gray-600" />
                      <span className="md:hidden font-medium text-gray-500 mr-2">Revenue:</span>
                      {payment.revenue.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 md:px-2.5 md:py-0.5 rounded-full text-xs font-medium ${payment.color}`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      <span className="hidden sm:inline">{payment.text}</span>
                      <span className="sm:hidden">{payment.text.charAt(0)}</span>
                    </span>
                  </td>
                  <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                    <span className="md:hidden font-medium text-gray-500 mr-2">Action:</span>
                    {payment.status === 'paid' ? (
                      <button 
                        className="text-green-600 hover:text-green-900 font-medium text-xs md:text-sm"
                        onClick={() => alert(`Payment details for ${payment.formattedMonth}`)}
                      >
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">View</span>
                      </button>
                    ) : (
                      <button 
                        className="text-blue-600 hover:text-blue-900 font-medium text-xs md:text-sm"
                        onClick={() => alert(`Initiate payment for ${payment.formattedMonth}`)}
                      >
                        <span className="hidden sm:inline">Pay Now</span>
                        <span className="sm:hidden">Pay</span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DashboardVendor = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [vendorData, setVendorData] = useState(null);
  const [chartFilter, setChartFilter] = useState("7days");
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState("");
  const [messagesPage, setMessagesPage] = useState(1);
  const itemsPerPage = 5;

  const vendorId = localStorage.getItem("vendorId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://31.97.206.144:7021/api/vendor/dashboard/${vendorId}?duration=${chartFilter}`
        );
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching dashboard");
      } finally {
        setLoading(false);
      }
    };

    const fetchVendorProfile = async () => {
      try {
        const response = await axios.get(
          `http://31.97.206.144:7021/api/vendor/getvendorprofile/${vendorId}`
        );
        setVendorData(response.data.vendor);
      } catch (err) {
        console.error("Error fetching vendor profile:", err);
      }
    };

    const fetchMessages = async () => {
      try {
        setMessagesLoading(true);
        const response = await axios.get(
          `http://31.97.206.144:7021/api/vendor/getmessages/${vendorId}`
        );
        setMessages(response.data.messages || []);
      } catch (err) {
        setMessagesError(err.response?.data?.message || "Error fetching messages");
      } finally {
        setMessagesLoading(false);
      }
    };

    if (vendorId) {
      fetchDashboard();
      fetchVendorProfile();
      fetchMessages();
    } else {
      setError("Vendor ID not found.");
      setLoading(false);
    }
  }, [vendorId, chartFilter]);

  const revenueChartData = useMemo(() => {
    return data?.trends?.revenueTrend?.map((item) => ({
      day: item.date,
      revenue: item.revenue,
    })) || [];
  }, [data]);

  const orderChartData = useMemo(() => {
    return data?.trends?.orderTrend?.map((item) => ({
      day: item.date,
      orders: item.count,
    })) || [];
  }, [data]);

  const handleFilterChange = (e) => {
    setChartFilter(e.target.value);
  };

  const handleMessagesPageChange = (newPage) => {
    setMessagesPage(newPage);
  };

  if (loading) return <div className="p-4 md:p-6 text-center text-base md:text-lg">Loading dashboard...</div>;
  if (error) return <div className="p-4 md:p-6 text-center text-red-600 font-semibold">Error: {error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen p-3 md:p-4 lg:p-6 space-y-4 md:space-y-5 lg:space-y-6">
      {/* Summary Cards - Mobile Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div onClick={() => navigate('/orders')} className="cursor-pointer">
          <StatCard
            icon={FaBox}
            label="Total Orders"
            value={data?.summary?.orders ?? 0}
            color="green"
          />
        </div>

        <div onClick={() => navigate('/medicines')} className="cursor-pointer">
          <StatCard
            icon={FaShoppingBag}
            label="Medicines Available"
            value={data?.summary?.medicinesCount ?? 0}
            color="purple"
          />
        </div>

        <div onClick={() => navigate('/orders')} className="cursor-pointer">
          <StatCard
            icon={FaChartBar}
            label="Total Revenue"
            value={`₹${data?.summary?.revenue ?? 0}`}
            color="emerald"
          />
        </div>

        <div onClick={() => navigate('/orders')} className="cursor-pointer">
          <StatCard
            icon={FaClock}
            label="Today's Orders"
            value={data?.summary?.todaysOrders ?? 0}
            color="blue"
          />
        </div>
      </div>

      {/* Quick Actions - Mobile Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <QuickActionButton label="Add New Medicine" route="/add-medicine" />
        <QuickActionButton label="View Orders" route="/orders" />
        <QuickActionButton label="View Revenue" route="/orders" />
      </div>

      {/* Revenue Chart - Mobile Responsive */}
      <div className="bg-white rounded-lg shadow p-3 md:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 md:mb-4">
          <h2 className="text-base md:text-lg font-semibold mb-2 sm:mb-0">Revenue Trends</h2>
          <select 
            value={chartFilter} 
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-1 text-sm w-full sm:w-auto"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>
        <div className="h-[200px] sm:h-[250px] md:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueChartData}>
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  if (window.innerWidth < 640) {
                    return value.split('-').slice(1).join('-');
                  }
                  return value;
                }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  if (value >= 1000) return `${value/1000}k`;
                  return value;
                }}
              />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#00C49F" fill="#00C49F" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Order Chart - Mobile Responsive */}
      <div className="bg-white rounded-lg shadow p-3 md:p-4">
        <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Order Trends</h2>
        <div className="h-[200px] sm:h-[250px] md:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={orderChartData}>
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  if (window.innerWidth < 640) {
                    return value.split('-').slice(1).join('-');
                  }
                  return value;
                }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Area type="monotone" dataKey="orders" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Messages Table - Mobile Responsive */}
      <div>
        <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Messages</h2>
        {messagesLoading ? (
          <div className="bg-white rounded-lg shadow p-4 md:p-6 text-center text-sm md:text-base">Loading messages...</div>
        ) : messagesError ? (
          <div className="bg-white rounded-lg shadow p-4 md:p-6 text-center text-red-600 text-sm md:text-base">{messagesError}</div>
        ) : (
          <MessageTable
            messages={messages}
            currentPage={messagesPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handleMessagesPageChange}
          />
        )}
      </div>

      {/* Payment History Table - Mobile Responsive */}
      <div>
        <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Payment History</h2>
        {vendorData && vendorData.paymentStatus && vendorData.revenueByMonth ? (
          <PaymentTable 
            paymentStatus={vendorData.paymentStatus} 
            revenueByMonth={vendorData.revenueByMonth} 
          />
        ) : (
          <div className="bg-white rounded-lg shadow p-4 md:p-6 text-center">
            <p className="text-gray-500 text-sm md:text-base">No payment data available</p>
          </div>
        )}
      </div>

      {/* Mobile-specific spacing */}
      <div className="h-4 sm:hidden"></div>
    </div>
  );
};

export default DashboardVendor;