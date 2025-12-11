import React, { useState } from 'react';

const RedeemedCouponsList = () => {
  const allCoupons = [
    {
      id: 1,
      customerId: 'CUST001',
      vendorName: 'FreshMeat Shop',
      vendorCategory: 'Meat Shop',
      productName: 'Chicken Thali',
      couponId: 'CPN001',
      couponName: 'Meat Lovers Special',
      couponCode: 'MTS25',
      discount: 25,
      downloadDate: '2025-04-29',
      redeemedDate: '2025-05-01',
      redeemedTime: '14:32',
      orderDetails: '2x Chicken Thali, 1x Coke',
      orderValue: 599,
      feedback: 'Very tasty & affordable!',
    },
    {
      id: 2,
      customerId: 'CUST002',
      vendorName: 'Daily Fresh Groceries',
      vendorCategory: 'Groceries',
      productName: 'Basmati Rice Pack',
      couponId: 'CPN002',
      couponName: 'Healthy Groceries',
      couponCode: 'HLT15',
      discount: 15,
      downloadDate: '2025-05-02',
      redeemedDate: '2025-05-04',
      redeemedTime: '10:45',
      orderDetails: '1x Rice Pack, 2x Dal',
      orderValue: 820,
      feedback: 'Good quality & service',
    },
    // Add more data here to test pagination
  ];

  const [filter, setFilter] = useState('all');
  const [downloadLimit, setDownloadLimit] = useState(10);
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filterCoupons = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const startOfWeek = new Date();
    startOfWeek.setDate(now.getDate() - now.getDay());

    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
    const endOfLastWeek = new Date(startOfWeek);
    endOfLastWeek.setDate(endOfLastWeek.getDate() - 1);

    switch (filter) {
      case 'today':
        return allCoupons.filter(c => c.redeemedDate === today);
      case 'yesterday':
        return allCoupons.filter(c => c.redeemedDate === yesterdayStr);
      case 'thisWeek':
        return allCoupons.filter(c => new Date(c.redeemedDate) >= startOfWeek);
      case 'lastWeek':
        return allCoupons.filter(c => {
          const date = new Date(c.redeemedDate);
          return date >= startOfLastWeek && date <= endOfLastWeek;
        });
      case 'custom':
        if (!customFrom || !customTo) return [];
        return allCoupons.filter(c => {
          const date = new Date(c.redeemedDate);
          return date >= new Date(customFrom) && date <= new Date(customTo);
        });
      default:
        return allCoupons;
    }
  };

  const redeemedCoupons = filterCoupons();

  const totalPages = Math.ceil(redeemedCoupons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = redeemedCoupons.slice(startIndex, startIndex + itemsPerPage);

  const handleDownload = () => {
    const dataToDownload = redeemedCoupons.slice(0, downloadLimit);
    if (dataToDownload.length === 0) return;

    const headers = Object.keys(dataToDownload[0]);
    const csv = [
      headers.join(','),
      ...dataToDownload.map(row => headers.map(field => `"${row[field]}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'redeemed_coupons.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFilterChange = (value) => {
    setFilter(value);
    setCurrentPage(1); // reset to first page when filter changes
  };

  return (
    <div className="p-6 bg-white shadow rounded overflow-x-auto">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <select
            className="border border-gray-300 p-2 rounded"
            value={filter}
            onChange={e => handleFilterChange(e.target.value)}
          >
            <option value="all">All</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="thisWeek">This Week</option>
            <option value="lastWeek">Last Week</option>
            <option value="custom">Custom Date</option>
          </select>

          {filter === 'custom' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="border border-gray-300 p-2 rounded"
                value={customFrom}
                onChange={e => setCustomFrom(e.target.value)}
              />
              <span className="text-gray-600">to</span>
              <input
                type="date"
                className="border border-gray-300 p-2 rounded"
                value={customTo}
                onChange={e => setCustomTo(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="flex gap-2 items-center">
          <select
            className="border border-gray-300 p-2 rounded"
            value={downloadLimit}
            onChange={e => setDownloadLimit(parseInt(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={100}>100</option>
            <option value={500}>500</option>
            <option value={1000}>1000</option>
          </select>
          <button
            onClick={handleDownload}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Download CSV
          </button>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-center mb-6 text-blue-800">Redeemed Coupons List</h2>

      {/* Table */}
      <table className="min-w-[1200px] w-full border border-gray-300 text-sm">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-2 border">SI No</th>
            <th className="p-2 border">Customer ID</th>
            <th className="p-2 border">Vendor Name</th>
            <th className="p-2 border">Vendor Category</th>
            <th className="p-2 border">Product Name</th>
            <th className="p-2 border">Coupon ID</th>
            <th className="p-2 border">Coupon Name</th>
            <th className="p-2 border">Coupon Code</th>
            <th className="p-2 border">Discount (%)</th>
            <th className="p-2 border">Download Date</th>
            <th className="p-2 border">Redeemed Date</th>
            <th className="p-2 border">Redeemed Time</th>
            <th className="p-2 border">Order Details</th>
            <th className="p-2 border">Order Value (₹)</th>
            <th className="p-2 border">Feedback</th>
          </tr>
        </thead>
        <tbody>
          {currentData.length > 0 ? (
            currentData.map((item, index) => (
              <tr key={item.id} className="text-center border-b">
                <td className="p-2 border">{startIndex + index + 1}</td>
                <td className="p-2 border">{item.customerId}</td>
                <td className="p-2 border">{item.vendorName}</td>
                <td className="p-2 border">{item.vendorCategory}</td>
                <td className="p-2 border">{item.productName}</td>
                <td className="p-2 border">{item.couponId}</td>
                <td className="p-2 border">{item.couponName}</td>
                <td className="p-2 border font-mono">{item.couponCode}</td>
                <td className="p-2 border">{item.discount}%</td>
                <td className="p-2 border">{item.downloadDate}</td>
                <td className="p-2 border">{item.redeemedDate}</td>
                <td className="p-2 border">{item.redeemedTime}</td>
                <td className="p-2 border">{item.orderDetails}</td>
                <td className="p-2 border">₹{item.orderValue}</td>
                <td className="p-2 border text-left">{item.feedback}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="15" className="text-center p-4 text-gray-500">
                No data available for the selected filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {redeemedCoupons.length > itemsPerPage && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default RedeemedCouponsList;
