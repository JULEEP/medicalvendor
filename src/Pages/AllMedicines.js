import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaUpload, FaSearch, FaDownload } from "react-icons/fa";

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
        const res = await fetch(`http://31.97.206.144:7021/api/vendor/medicines/${vendorId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch medicines");

        setMedicines(data.medicines || []);
        setFilteredMedicines(data.medicines || []);  // Initial filter set to all medicines
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
      const res = await fetch(`http://31.97.206.144:7021/api/vendor/deletemedicines/${vendorId}/${id}`, {
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
      const res = await fetch(`http://31.97.206.144:7021/api/vendor/updatemedicines/${vendorId}/${selectedMedicine._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedMedicine),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");

      // Update in local state
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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Medicines</h2>

      {loading && <p>Loading medicines...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex mb-4 space-x-6">
        {/* Left side: Search filter */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search medicines..."
              className="w-full px-4 py-2 border rounded-md"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Right side: Export CSV button */}
        <div>
          <button
            onClick={handleCSVExport}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center space-x-2"
          >
            <FaDownload size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 bg-white shadow-md rounded">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">MRP</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Created At</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.map((med) => (
              <tr key={med._id} className="border-t text-sm hover:bg-gray-50">
                <td className="px-4 py-2">
                  <img
                    src={med.images?.[0]}
                    alt={med.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-2 font-semibold">{med.name}</td>
                <td className="px-4 py-2">{med.categoryName}</td>
                <td className="px-4 py-2 text-green-600 font-medium">₹{med.price}</td>
                <td className="px-4 py-2">
                  {med.mrp ? (
                    <span className="text-gray-700">₹{med.mrp}</span>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
                <td className="px-4 py-2 max-w-xs truncate" title={med.description}>
                  {med.description}
                </td>
                <td className="px-4 py-2">
                  {new Date(med.createdAt).toLocaleDateString("en-IN")}
                </td>
                <td className="px-4 py-2 flex space-x-3">
                  <button
                    onClick={() => handleEdit(med)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(med._id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <FaTrashAlt size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredMedicines.length === 0 && !loading && (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  No medicines found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔧 Edit Modal */}
    {showEditModal && selectedMedicine && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-300 bg-opacity-20 backdrop-blur-sm transition-all duration-300">
    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Edit Medicine</h3>

      <div className="space-y-4">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Image</label>
          <div className="flex items-center space-x-4">
            <img
              src={selectedMedicine.images[0]}
              alt="Medicine"
              className="w-20 h-20 object-cover rounded border"
            />

            <input
              type="file"
              accept="image/*"
              id="imageUpload"
              className="hidden"
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
            <label
              htmlFor="imageUpload"
              className="cursor-pointer p-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            >
              Upload
            </label>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={selectedMedicine.name}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            name="categoryName"
            value={selectedMedicine.categoryName}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Price + MRP */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Selling Price (₹)</label>
            <input
              type="number"
              name="price"
              value={selectedMedicine.price}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">MRP (₹)</label>
            <input
              type="number"
              name="mrp"
              value={selectedMedicine.mrp || ""}
              onChange={handleChange}
              placeholder="Enter MRP"
              className="w-full border border-gray-300 px-3 py-2 rounded mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={selectedMedicine.description}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={() => setShowEditModal(false)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default AllMedicines;