import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash, FiEye, FiFilter, FiDownload } from "react-icons/fi";
import { Link } from "react-router-dom";
import { CSVLink } from "react-csv";
import { useNavigate } from "react-router-dom";


export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate(); // ✅ navigation hook

  const [filters, setFilters] = useState({
    name: "",
    mobile: "",
    aadhaar: "",
    status: ""
  });

  const itemsPerPage = 5;

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://31.97.206.144:7021/api/admin/getallusers");
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch users");

      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`http://31.97.206.144:7021/api/admin/deleteusers/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");

      alert("User deleted successfully!");
      fetchUsers();
      setIsDeleteOpen(false);
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  const openEditPopup = (user) => {
    setSelectedUser({
      id: user.id,
      name: user.name,
      mobile: user.mobile,
      aadhaarCardNumber: user.aadhaarCardNumber || "",
      status: user.status || "active"
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(
        `http://31.97.206.144:7021/api/admin/updateusers/${selectedUser.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: selectedUser.name,
            mobile: selectedUser.mobile,
            status: selectedUser.status
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      alert("User updated successfully!");
      setIsEditOpen(false);
      fetchUsers();
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };

  // Filter users based on filter criteria
  const filteredUsers = users.filter(user => {
    const nameMatch = !filters.name ||
      (user.name && user.name.toLowerCase().includes(filters.name.toLowerCase()));
    const mobileMatch = !filters.mobile ||
      (user.mobile && user.mobile.includes(filters.mobile));
    const aadhaarMatch = !filters.aadhaar ||
      (user.aadhaarCardNumber && user.aadhaarCardNumber.includes(filters.aadhaar));
    const statusMatch = !filters.status ||
      (user.status && user.status.toLowerCase() === filters.status.toLowerCase());

    return nameMatch && mobileMatch && aadhaarMatch && statusMatch;
  });

  // Prepare data for CSV export
  const prepareCSVData = () => {
    const headers = [
      { label: "User ID", key: "_id" },
      { label: "Name", key: "name" },
      { label: "Mobile", key: "mobile" },
      { label: "Status", key: "status" },
      { label: "Join Date", key: "createdAt" }
    ];

    const data = filteredUsers.map(user => ({
      _id: user._id,
      name: user.name,
      mobile: user.mobile || "N/A",
      aadhaarCardNumber: user.aadhaarCardNumber || "N/A",
      status: user.status || "active",
      createdAt: new Date(user.createdAt).toLocaleString()
    }));

    return { headers, data };
  };

  // Get unique statuses for filter dropdown
  const uniqueStatuses = [...new Set(
    users
      .map(user => user.status)
      .filter(status => status)
  )].sort();

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800">Users List</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
          >
            <FiFilter /> Filters
          </button>

          {filteredUsers.length > 0 && (
            <CSVLink
              {...prepareCSVData()}
              filename="users-export.csv"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <FiDownload /> Export CSV
            </CSVLink>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white p-4 rounded shadow-md mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
              <input
                type="text"
                value={filters.mobile}
                onChange={(e) => {
                  setFilters({ ...filters, mobile: e.target.value });
                  setCurrentPage(1);
                }}
                placeholder="Search by mobile"
                className="w-full p-2 border rounded"
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => {
                  setFilters({ ...filters, status: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full p-2 border rounded"
              >
                <option value="">All Statuses</option>
                {uniqueStatuses.map((status, index) => (
                  <option key={index} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-500">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>
      )}

      {loading && <p>Loading users...</p>}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto border rounded shadow bg-white">
            <table className="w-full table-auto">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Profile</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Mobile</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((user, idx) => (
                    <tr
                      key={user._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3">{indexOfFirstItem + idx + 1}</td>
                      <td className="p-3">
                        <img
                          src={user.profileImage}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) =>
                            (e.target.src = "https://via.placeholder.com/50?text=No+Img")
                          }
                        />
                      </td>
                      <td className="p-3 font-semibold">{user.name}</td>
                      <td className="p-3">{user.mobile || (
                        <span className="text-gray-400">N/A</span>
                      )}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'active' ? 'bg-green-100 text-green-800' :
                          user.status === 'inactive' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                          {user.status || "active"}
                        </span>
                      </td>
                      <td className="p-3 flex space-x-3 text-lg">
                        <FiEye
                          onClick={() => {
                            console.log("User ID:", user.id); // ✅ ye console pe userId dega
                            navigate(`/users/${user.id}`);   // ✅ ye navigate karega detail page pe
                          }}
                          className="text-green-500 cursor-pointer hover:text-green-600"
                          title="View"
                        />

                        <FiEdit
                          onClick={() => openEditPopup(user)}
                          className="text-yellow-500 cursor-pointer hover:text-yellow-600"
                          title="Edit"
                        />
                        <FiTrash
                          onClick={() => {
                            setSelectedUser(user); // ✅ set correct user to delete
                            setIsDeleteOpen(true); // ✅ open confirmation modal
                          }}
                        />

                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="p-4 text-center text-gray-500 font-medium"
                    >
                      {users.length === 0
                        ? "No users found."
                        : "No users match your filters."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-4 space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className={`px-3 py-1 border rounded ${currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${currentPage === i + 1
                  ? "bg-blue-700 text-white"
                  : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
              className={`px-3 py-1 border rounded ${currentPage === totalPages || totalPages === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Edit User Modal */}
      {isEditOpen && selectedUser && (
        <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg border border-gray-200">
            <h2 className="text-lg font-bold mb-4">Edit User</h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                <input
                  type="text"
                  value={selectedUser.mobile}
                  onChange={(e) => setSelectedUser({ ...selectedUser, mobile: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={selectedUser.status}
                  onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && selectedUser && (
        <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg border border-gray-200">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete user <strong>{selectedUser.name}</strong>?</p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selectedUser.id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}