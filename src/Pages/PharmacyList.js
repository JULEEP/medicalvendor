import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash, FiEye  } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function PharmacyList() {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
   const navigate = useNavigate();

  const [editingPharmacy, setEditingPharmacy] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    latitude: "",
    longitude: "",
    vendorName: "",
    vendorEmail: "",
    vendorPhone: "",
    image: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editMessage, setEditMessage] = useState("");

  const fetchPharmacies = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://31.97.206.144:7021/api/pharmacy/getallpjarmacy");
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch");

      setPharmacies(data.pharmacies || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const openEditModal = (pharmacy) => {
    setEditingPharmacy(pharmacy);
    setEditForm({
      name: pharmacy.name,
      latitude: pharmacy.latitude,
      longitude: pharmacy.longitude,
      vendorName: pharmacy.vendorName || "",
      vendorEmail: pharmacy.vendorEmail || "",
      vendorPhone: pharmacy.vendorPhone || "",
      image: pharmacy.image || "",
    });
    setEditError("");
    setEditMessage("");
  };

  const closeEditModal = () => setEditingPharmacy(null);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    setEditMessage("");

    try {
      const res = await fetch(
        `http://31.97.206.144:7021/api/pharmacy/updatepharmacy/${editingPharmacy._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editForm.name,
            latitude: parseFloat(editForm.latitude),
            longitude: parseFloat(editForm.longitude),
            vendorName: editForm.vendorName,
            vendorEmail: editForm.vendorEmail,
            vendorPhone: editForm.vendorPhone,
            image: editForm.image, // allow updating via URL
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      setEditMessage("Pharmacy updated successfully!");
      fetchPharmacies();
      setTimeout(() => closeEditModal(), 1500);
    } catch (err) {
      setEditError(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pharmacy?")) return;

    try {
      const res = await fetch(`http://31.97.206.144:7021/api/pharmacy/deletepharmacy/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");

      alert("Pharmacy deleted successfully!");
      fetchPharmacies();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Pharmacies List</h1>

      {loading && <p>Loading pharmacies...</p>}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto border rounded shadow bg-white">
          <table className="w-full table-auto">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Latitude</th>
                <th className="p-3 text-left">Longitude</th>
                <th className="p-3 text-left">Categories</th>
                <th className="p-3 text-left">Vendor</th>
                <th className="p-3 text-left">Created At</th>
                <th className="p-3 text-left">Updated At</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pharmacies.length > 0 ? (
                pharmacies.map((pharmacy, idx) => (
                  <tr
                    key={pharmacy._id}
                    className="border-b hover:bg-gray-50 align-top"
                  >
                    <td className="p-3">{idx + 1}</td>
                    <td className="p-3 font-semibold">{pharmacy.name}</td>
                    <td className="p-3">
                      <img
                        src={pharmacy.image}
                        alt={pharmacy.name}
                        className="w-16 h-16 rounded object-cover border"
                        onError={(e) =>
                          (e.target.src =
                            "https://via.placeholder.com/80?text=No+Image")
                        }
                      />
                    </td>
                    <td className="p-3">{pharmacy.latitude}</td>
                    <td className="p-3">{pharmacy.longitude}</td>
                    <td className="p-3 max-w-xs">
                      {pharmacy.categories.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                          {pharmacy.categories.map((cat) => (
                            <div
                              key={cat._id}
                              className="flex flex-col items-center w-20"
                            >
                              <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-12 h-12 rounded object-cover border mb-1"
                                onError={(e) =>
                                  (e.target.src =
                                    "https://via.placeholder.com/48?text=No+Image")
                                }
                              />
                              <span className="text-sm text-center truncate">
                                {cat.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500">No categories</span>
                      )}
                    </td>
                    <td className="p-3 text-sm">
                      <div><b>{pharmacy.vendorName}</b></div>
                      <div>{pharmacy.vendorEmail}</div>
                      <div>{pharmacy.vendorPhone}</div>
                    </td>
                    <td className="p-3">
                      {new Date(pharmacy.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3">
                      {new Date(pharmacy.updatedAt).toLocaleString()}
                    </td>
                    <td className="p-3 flex space-x-3 text-lg">
                        <FiEye
                        onClick={() => navigate(`/pharmacy/${pharmacy._id}`)}
                        className="text-blue-500 cursor-pointer hover:text-blue-600"
                        title="View"
                      />
                      <FiEdit
                        onClick={() => openEditModal(pharmacy)}
                        className="text-yellow-500 cursor-pointer hover:text-yellow-600"
                        title="Edit"
                      />
                      <FiTrash
                        onClick={() => handleDelete(pharmacy._id)}
                        className="text-red-500 cursor-pointer hover:text-red-600"
                        title="Delete"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="10"
                    className="p-4 text-center text-gray-500 font-medium"
                  >
                    No pharmacies found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editingPharmacy && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg border">
            <h2 className="text-xl font-semibold mb-4">Edit Pharmacy</h2>

            {editError && (
              <div className="mb-2 p-2 bg-red-100 text-red-700 rounded">
                {editError}
              </div>
            )}
            {editMessage && (
              <div className="mb-2 p-2 bg-green-100 text-green-700 rounded">
                {editMessage}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  required
                  className="w-full p-2 border rounded focus:outline-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Latitude</label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={editForm.latitude}
                  onChange={handleEditChange}
                  required
                  className="w-full p-2 border rounded focus:outline-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Longitude</label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={editForm.longitude}
                  onChange={handleEditChange}
                  required
                  className="w-full p-2 border rounded focus:outline-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Vendor Name</label>
                <input
                  type="text"
                  name="vendorName"
                  value={editForm.vendorName}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded focus:outline-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Vendor Email</label>
                <input
                  type="email"
                  name="vendorEmail"
                  value={editForm.vendorEmail}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded focus:outline-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Vendor Phone</label>
                <input
                  type="text"
                  name="vendorPhone"
                  value={editForm.vendorPhone}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded focus:outline-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={editForm.image}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded focus:outline-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                  disabled={editLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  disabled={editLoading}
                >
                  {editLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
