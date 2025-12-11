import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash, FiEye, FiFilter, FiDownload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";

export default function MedicineList() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    name: "",
    price: "",
    description: "",
    categoryName: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    pharmacy: "",
  });

  const navigate = useNavigate();
  const itemsPerPage = 5;

  const fetchMedicines = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://31.97.206.144:7021/api/pharmacy/allmedicine");
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch medicines");

      setMedicines(data.medicines || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medicine?")) return;

    try {
      const res = await fetch(`http://31.97.206.144:7021/api/pharmacy/deletemedicine/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");

      alert("Medicine deleted successfully!");
      fetchMedicines();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  const openEditPopup = (med) => {
    setEditData({
      id: med.medicineId,
      name: med.name,
      price: med.price,
      description: med.description,
      categoryName: med.categoryName || "",
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    // Prepare the body to only include the updated fields
    const updatedFields = {};

    if (editData.name !== medicines.find((med) => med.medicineId === editData.id)?.name) {
      updatedFields.name = editData.name;
    }

    if (editData.price !== medicines.find((med) => med.medicineId === editData.id)?.price) {
      updatedFields.price = editData.price;
    }

    if (editData.description !== medicines.find((med) => med.medicineId === editData.id)?.description) {
      updatedFields.description = editData.description;
    }

    if (editData.categoryName !== medicines.find((med) => med.medicineId === editData.id)?.categoryName) {
      updatedFields.categoryName = editData.categoryName;
    }

    if (Object.keys(updatedFields).length === 0) {
      alert("No changes detected.");
      setIsEditOpen(false);
      return;
    }

    try {
      const res = await fetch(
        `http://31.97.206.144:7021/api/pharmacy/updatemedicine/${editData.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFields),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      alert("Medicine updated successfully!");
      setIsEditOpen(false);
      fetchMedicines();
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };

  // Filter medicines based on filter criteria
  const filteredMedicines = medicines.filter((med) => {
    const nameMatch = !filters.name || med.name.toLowerCase().includes(filters.name.toLowerCase());
    const categoryMatch = !filters.category || (med.categoryName && med.categoryName.toLowerCase().includes(filters.category.toLowerCase()));
    const minPriceMatch = !filters.minPrice || (med.price && Number(med.price) >= Number(filters.minPrice));
    const maxPriceMatch = !filters.maxPrice || (med.price && Number(med.price) <= Number(filters.maxPrice));
    const pharmacyMatch = !filters.pharmacy || (med.pharmacy?.name && med.pharmacy.name.toLowerCase().includes(filters.pharmacy.toLowerCase()));

    return nameMatch && categoryMatch && minPriceMatch && maxPriceMatch && pharmacyMatch;
  });

  // Prepare data for CSV export
  const prepareCSVData = () => {
    const headers = [
      { label: "Medicine ID", key: "medicineId" },
      { label: "Name", key: "name" },
      { label: "Price (₹)", key: "price" },
      { label: "Category", key: "category" },
      { label: "Description", key: "description" },
      { label: "Pharmacy", key: "pharmacy" },
      { label: "Location", key: "location" },
      { label: "Image Count", key: "imageCount" },
    ];

    const data = filteredMedicines.map((med) => ({
      medicineId: med.medicineId,
      name: med.name,
      price: med.price,
      category: med.categoryName || "N/A",
      description: med.description || "N/A",
      pharmacy: med.pharmacy?.name || "N/A",
      location: med.pharmacy?.location?.coordinates
        ? `${med.pharmacy.location.coordinates[1]}, ${med.pharmacy.location.coordinates[0]}`
        : "N/A",
      imageCount: med.images?.length || 0,
    }));

    return { headers, data };
  };

  // Get unique categories for filter dropdown
  const uniqueCategories = [...new Set(medicines.map((med) => med.categoryName).filter((cat) => cat))].sort();

  // Get unique pharmacies for filter dropdown
  const uniquePharmacies = [...new Set(medicines.map((med) => med.pharmacy?.name).filter((pharm) => pharm))].sort();

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMedicines.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800">Medicines List</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
          >
            <FiFilter /> Filters
          </button>
          {filteredMedicines.length > 0 && (
            <CSVLink
              {...prepareCSVData()}
              filename="medicines-export.csv"
              className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded hover:bg-green-700 no-underline"
              style={{ textDecoration: "none" }}
            >
              <FiDownload /> Export CSV
            </CSVLink>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white p-4 rounded shadow-md mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={filters.name}
                onChange={(e) => {
                  setFilters({ ...filters, name: e.target.value });
                  setCurrentPage(1);
                }}
                placeholder="Search by name"
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => {
                  setFilters({ ...filters, category: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full p-2 border rounded"
              >
                <option value="">All Categories</option>
                {uniqueCategories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pharmacy</label>
              <select
                value={filters.pharmacy}
                onChange={(e) => {
                  setFilters({ ...filters, pharmacy: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full p-2 border rounded"
              >
                <option value="">All Pharmacies</option>
                {uniquePharmacies.map((pharmacy, index) => (
                  <option key={index} value={pharmacy}>
                    {pharmacy}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => {
                  setFilters({ ...filters, minPrice: e.target.value });
                  setCurrentPage(1);
                }}
                placeholder="Min Price"
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => {
                  setFilters({ ...filters, maxPrice: e.target.value });
                  setCurrentPage(1);
                }}
                placeholder="Max Price"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
      )}

      {/* Medicine Table */}
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-800">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Price (₹)</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Pharmacy</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center p-4">
                Loading...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="6" className="text-center p-4 text-red-500">
                {error}
              </td>
            </tr>
          ) : currentItems.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center p-4">
                No medicines found.
              </td>
            </tr>
          ) : (
            currentItems.map((med) => (
              <tr key={med.medicineId}>
                <td className="p-2 border">{med.medicineId}</td>
                <td className="p-2 border">{med.name}</td>
                <td className="p-2 border">{med.price}</td>
                <td className="p-2 border">{med.categoryName}</td>
                <td className="p-2 border">{med.pharmacy?.name || "N/A"}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => openEditPopup(med)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-400"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(med.medicineId)}
                    className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-400"
                  >
                    <FiTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstItem + 1} to {indexOfLastItem} of {filteredMedicines.length} items
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400 disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400 disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
{/* Edit Popup */}
{isEditOpen && (
  <div className="fixed inset-0 flex justify-center items-center bg-gray-300 bg-opacity-20 backdrop-blur-sm z-50">
    <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-96">
      <h3 className="text-xl font-semibold mb-4">Edit Medicine</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700">Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Price</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={editData.price}
            onChange={(e) => setEditData({ ...editData, price: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Description</label>
          <textarea
            className="w-full p-2 border rounded"
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Category</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={editData.categoryName}
            onChange={(e) => setEditData({ ...editData, categoryName: e.target.value })}
          />
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={() => setIsEditOpen(false)}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
)}


    </div>
  );
}
