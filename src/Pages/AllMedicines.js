import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaSearch, FaDownload } from "react-icons/fa";

const AllMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // 🔃 Fetch medicines from backend on mount
  useEffect(() => {
    const fetchMedicines = async () => {
      const vendorId = localStorage.getItem("vendorId");
      if (!vendorId) {
        setError("Vendor ID not found. Please log in.");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`https://api.simcurarx.com/api/vendor/medicines/${vendorId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch medicines");

        setMedicines(data.medicines || []);
        setFilteredMedicines(data.medicines || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  const handleEdit = (medicine) => {
    setSelectedMedicine(medicine);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    const vendorId = localStorage.getItem("vendorId");
    if (!vendorId) {
      alert("Vendor ID not found");
      return;
    }

    const confirm = window.confirm("Are you sure you want to delete this medicine?");
    if (!confirm) return;

    try {
      const res = await fetch(`https://api.simcurarx.com/api/vendor/deletemedicines/${vendorId}/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");

      setMedicines((prev) => prev.filter((med) => med._id !== id));
      setFilteredMedicines((prev) => prev.filter((med) => med._id !== id));
      alert("Medicine deleted successfully");
    } catch (err) {
      alert(err.message || "Something went wrong");
    }
  };

  const handleUpdate = async () => {
    const vendorId = localStorage.getItem("vendorId");
    if (!vendorId) {
      alert("Vendor ID not found");
      return;
    }

    try {
      const res = await fetch(`https://api.simcurarx.com/api/vendor/updatemedicines/${vendorId}/${selectedMedicine._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedMedicine),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");

      setMedicines((prev) =>
        prev.map((med) =>
          med._id === selectedMedicine._id ? data.medicine : med
        )
      );
      setFilteredMedicines((prev) =>
        prev.map((med) =>
          med._id === selectedMedicine._id ? data.medicine : med
        )
      );

      setShowEditModal(false);
      alert("Medicine updated successfully!");
    } catch (err) {
      alert(err.message || "Something went wrong");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedMedicine((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    filterMedicines(e.target.value);
  };

  const filterMedicines = (term) => {
    if (term === "") {
      setFilteredMedicines(medicines);
    } else {
      const filtered = medicines.filter((med) =>
        med.name.toLowerCase().includes(term.toLowerCase()) ||
        med.categoryName.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredMedicines(filtered);
    }
  };

  const handleCSVExport = () => {
    const headers = ["Name", "Category", "Price", "MRP", "Description", "Created At"];
    const rows = filteredMedicines.map((med) => [
      med.name,
      med.categoryName,
      med.price,
      med.mrp || "N/A",
      med.description,
      new Date(med.createdAt).toLocaleDateString("en-IN"),
    ]);

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\n";
    rows.forEach((row) => {
      csvContent += row.map(field => `"${field}"`).join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "medicines.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-3 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4">All Medicines</h2>

      {loading && <p className="text-center py-4">Loading medicines...</p>}
      {error && <p className="text-red-500 mb-4 p-3 bg-red-50 rounded text-sm">{error}</p>}

      {/* Search and Export Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        {/* Search Bar */}
        <div className="w-full md:flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search medicines..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Export Button */}
        <div className="w-full md:w-auto">
          <button
            onClick={handleCSVExport}
            className="w-full md:w-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <FaDownload size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* FIXED: Table Container with PROPER Horizontal Scroll */}
      <div className="relative">
        <div className="overflow-x-auto overflow-y-hidden whitespace-nowrap">
          <div className="min-w-[1000px]">
            <table className="w-full border border-gray-200 bg-white shadow-sm rounded-lg">
              <thead className="bg-gray-50 text-gray-700 text-sm">
                <tr>
                  <th className="px-4 py-3 text-left font-medium min-w-[80px]">Image</th>
                  <th className="px-4 py-3 text-left font-medium min-w-[120px]">Name</th>
                  <th className="px-4 py-3 text-left font-medium min-w-[100px]">Category</th>
                  <th className="px-4 py-3 text-left font-medium min-w-[80px]">Price</th>
                  <th className="px-4 py-3 text-left font-medium min-w-[80px]">MRP</th>
                  <th className="px-4 py-3 text-left font-medium min-w-[150px]">Description</th>
                  <th className="px-4 py-3 text-left font-medium min-w-[100px]">Created At</th>
                  <th className="px-4 py-3 text-left font-medium min-w-[100px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedicines.map((med) => (
                  <tr key={med._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img
                        src={med.images?.[0]}
                        alt={med.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">{med.name}</td>
                    <td className="px-4 py-3">{med.categoryName}</td>
                    <td className="px-4 py-3 text-green-600 font-semibold">₹{med.price}</td>
                    <td className="px-4 py-3">
                      {med.mrp ? (
                        <span className="text-gray-700">₹{med.mrp}</span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3 max-w-[150px]">
                      <div className="truncate" title={med.description}>
                        {med.description}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(med.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(med)}
                          className="text-blue-500 hover:text-blue-700 p-1"
                          title="Edit"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(med._id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Delete"
                        >
                          <FaTrashAlt size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredMedicines.length === 0 && !loading && (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-gray-500">
                      No medicines found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Scroll indicator for mobile */}
        <div className="md:hidden text-xs text-gray-500 text-center mt-2 animate-pulse">
          ← Scroll horizontally →
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-5 md:p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Medicine</h3>

              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medicine Image</label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <img
                      src={selectedMedicine.images[0]}
                      alt="Medicine"
                      className="w-24 h-24 object-cover rounded-lg border"
                    />
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            setSelectedMedicine((prev) => ({
                              ...prev,
                              images: [reader.result],
                            }));
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
                    <input
                      type="text"
                      name="name"
                      value={selectedMedicine.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      name="categoryName"
                      value={selectedMedicine.categoryName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (₹)</label>
                      <input
                        type="number"
                        name="price"
                        value={selectedMedicine.price}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">MRP (₹)</label>
                      <input
                        type="number"
                        name="mrp"
                        value={selectedMedicine.mrp || ""}
                        onChange={handleChange}
                        placeholder="Optional"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={selectedMedicine.description}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-6 pt-4 border-t">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllMedicines;