import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { utils, writeFile } from "xlsx";

// Generate 5-character coupon code
const generateCouponCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const initialCoupons = [
  { id: 1, name: "Summer Feast", discount: 20, validTill: "31-07-2025", code: generateCouponCode(), category: "Restaurant", status: "Pending" },
  { id: 2, name: "Family Dinner", discount: 15, validTill: "31-12-2025", code: generateCouponCode(), category: "Restaurant", status: "Pending" },
  { id: 3, name: "Pizza Night", discount: 10, validTill: "15-06-2025", code: generateCouponCode(), category: "Restaurant", status: "Pending" },
  { id: 4, name: "Meat Lovers Special", discount: 25, validTill: "31-08-2025", code: generateCouponCode(), category: "Meat Shop", status: "Pending" },
  { id: 5, name: "Healthy Groceries", discount: 15, validTill: "30-09-2025", code: generateCouponCode(), category: "Groceries", status: "Pending" },
  // Add more coupons as needed to test pagination
];

const CouponsTable = () => {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [downloadLimit, setDownloadLimit] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const couponsPerPage = 3;

  const handleStatusChange = (id, newStatus) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    setEditingId(null);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this coupon?");
    if (confirmed) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const filteredCoupons =
    selectedCategory === "All"
      ? coupons
      : coupons.filter((c) => c.category === selectedCategory);

  const indexOfLastCoupon = currentPage * couponsPerPage;
  const indexOfFirstCoupon = indexOfLastCoupon - couponsPerPage;
  const currentCoupons = filteredCoupons.slice(indexOfFirstCoupon, indexOfLastCoupon);
  const totalPages = Math.ceil(filteredCoupons.length / couponsPerPage);

  const categories = ["All", "Restaurant", "Meat Shop", "Groceries"];

  const exportData = (type) => {
    const exportCoupons = filteredCoupons
      .slice(0, downloadLimit)
      .map(({ id, name, discount, validTill, code, category, status }) => ({
        ID: id,
        Name: name,
        Category: category,
        Discount: discount,
        ValidTill: validTill,
        Code: code,
        Status: status,
      }));

    const ws = utils.json_to_sheet(exportCoupons);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Coupons");
    writeFile(wb, `coupons.${type}`);
  };

  return (
    <div className="p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-semibold text-center mb-6 text-gray-700">Coupons List</h1>

      {/* Filters and Export Controls */}
      <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-4 py-2 rounded bg-gray-100 text-gray-700"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <div className="flex gap-2 items-center">
          <select
            value={downloadLimit}
            onChange={(e) => setDownloadLimit(Number(e.target.value))}
            className="p-2 border rounded text-gray-700"
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
          <button
            className="bg-gray-200 px-4 py-2 rounded text-sm"
            onClick={() => exportData("csv")}
          >
            Export CSV
          </button>
          <button
            className="bg-gray-200 px-4 py-2 rounded text-sm"
            onClick={() => exportData("xlsx")}
          >
            Export Excel
          </button>
        </div>
      </div>

      {/* Coupon Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Discount (%)</th>
              <th className="p-2 border">Valid Till</th>
              <th className="p-2 border">Code</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentCoupons.length > 0 ? (
              currentCoupons.map((coupon) => (
                <tr key={coupon.id} className="text-center border-b">
                  <td className="p-2 border">{coupon.id}</td>
                  <td className="p-2 border">{coupon.name}</td>
                  <td className="p-2 border">{coupon.category}</td>
                  <td className="p-2 border">{coupon.discount}</td>
                  <td className="p-2 border">{coupon.validTill}</td>
                  <td className="p-2 border font-mono">{coupon.code}</td>
                  <td className="p-2 border">
                    {editingId === coupon.id ? (
                      <select
                        value={coupon.status}
                        onChange={(e) => handleStatusChange(coupon.id, e.target.value)}
                        className="border p-1 rounded"
                      >
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Pending">Pending</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          coupon.status === "Approved"
                            ? "bg-green-200 text-green-800"
                            : coupon.status === "Rejected"
                            ? "bg-red-200 text-red-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}
                      >
                        {coupon.status}
                      </span>
                    )}
                  </td>
                  <td className="p-2 border flex justify-center gap-3">
                    <button onClick={() => setEditingId(coupon.id)} className="text-blue-600">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(coupon.id)} className="text-red-600">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-500">
                  No coupons found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === idx + 1 ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
          >
            {idx + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CouponsTable;
