import React, { useEffect, useState } from "react";
import { FaFileCsv, FaEdit, FaTrash, FaUpload } from "react-icons/fa";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const StaffList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const companyId = new URLSearchParams(location.search).get("companyId");

  const [staffs, setStaffs] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [amountToAdd, setAmountToAdd] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatedStaff, setUpdatedStaff] = useState({});

  useEffect(() => {
    if (!companyId) {
      console.error("companyId is missing");
      return;
    }

    axios
      .get(`https://credenhealth.onrender.com/api/admin/companystaffs/${companyId}`)
      .then((response) => {
        setStaffs(response.data.company.staff);
      })
      .catch((error) => {
        console.error("Error fetching staff data:", error);
      });
  }, [companyId]);

  const filteredStaffs = staffs.filter((staff) =>
    staff.name.toLowerCase().includes(search.toLowerCase())
  );

  const headers = [
    { label: "Name", key: "name" },
    { label: "Role", key: "role" },
    { label: "Department", key: "department" },
    { label: "Contact Number", key: "contact" },
    { label: "Email", key: "email" },
    { label: "DOB", key: "dob" },
    { label: "Gender", key: "gender" },
    { label: "Age", key: "age" },
    { label: "Address", key: "address" },
    { label: "Wallet Amount", key: "wallet_balance" },
  ];

  const handleBulkImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // Prepare the file for upload
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      // Send the file to the server
      const response = await fetch(`http://localhost:4000/api/admin/import-staffs`, {
        method: "POST",
        body: formData,
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert("Staff data imported successfully!");
        console.log("Imported Staffs:", result.data);
        
        // Assuming the imported data is an array of staff
        setStaffs((prevStaffs) => [...prevStaffs, ...result.data]); // Add newly imported staff to state
        
        // Optional: You can also refresh the staff list or perform other updates here
      } else {
        alert("Error importing data: " + result.error);
        console.error("Error importing data:", result.error);
      }
    } catch (error) {
      console.error("Error during file upload:", error);
      alert("Failed to upload file.");
    }
};


  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setUpdatedStaff(staff);
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    setStaffs(staffs.filter((s) => s._id !== id));
  };

  const openAddAmountModal = (staff) => {
    setSelectedStaff(staff);
    setAmountToAdd("");
    setShowModal(true);
  };

  const closeAddAmountModal = () => {
    setSelectedStaff(null);
    setShowModal(false);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedStaff(null);
  };

  const handleAddAmount = async () => {
    if (!amountToAdd || isNaN(amountToAdd)) {
      alert("Please enter a valid amount.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `https://credenhealth.onrender.com/api/admin/addamount/${selectedStaff._id}/${companyId}`,
        {
          amount: parseFloat(amountToAdd),
          from: "Admin",
        }
      );

      if (res.status === 200) {
        const updatedStaffs = staffs.map((staff) =>
          staff._id === selectedStaff._id
            ? {
                ...staff,
                wallet_balance:
                  (parseFloat(staff.wallet_balance) || 0) + parseFloat(amountToAdd),
              }
            : staff
        );
        setStaffs(updatedStaffs);
        closeAddAmountModal();
        alert("Amount added successfully!");
      } else {
        alert("Failed to add amount. Please try again.");
      }
    } catch (error) {
      console.error("Error adding amount:", error);
      alert("Failed to add amount.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `https://credenhealth.onrender.com/api/admin/editstaff/${selectedStaff._id}`,
        updatedStaff
      );

      if (res.status === 200) {
        const updatedStaffs = staffs.map((s) =>
          s._id === selectedStaff._id ? { ...s, ...updatedStaff } : s
        );
        setStaffs(updatedStaffs);
        setShowEditModal(false);
        alert("Staff updated successfully!");
      } else {
        alert("Failed to update staff.");
      }
    } catch (error) {
      console.error("Error updating staff:", error);
      alert("Error updating staff.");
    }
  };

  const handleViewHistory = (staffId) => {
    navigate(`/staff-history/${staffId}`);
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Staff List</h2>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="text"
          className="px-3 py-2 border rounded text-sm"
          placeholder="Search by staff name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <CSVLink
          data={filteredStaffs}
          headers={headers}
          filename="staff_list.csv"
          className="px-4 py-2 bg-green-500 text-white rounded text-sm flex items-center gap-2"
        >
          <FaFileCsv /> CSV
        </CSVLink>

        <label
          htmlFor="import-file"
          className="px-4 py-2 bg-purple-600 text-white rounded text-sm flex items-center gap-2 cursor-pointer"
        >
          <FaUpload /> Bulk Import
          <input
            type="file"
            accept=".xlsx, .xls"
            id="import-file"
            onChange={handleBulkImport}
            className="hidden"
          />
        </label>
      </div>

      <div className="overflow-y-auto max-h-[400px]">
        <table className="w-full border rounded text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Department</th>
              <th className="p-2 border">Contact</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Address</th>
              <th className="p-2 border">Profile Image</th>
              <th className="p-2 border">ID Image</th>
              <th className="p-2 border">Wallet Amount</th>
              <th className="p-2 border">Add Amount</th>
              <th className="p-2 border">Actions</th>
              <th className="p-2 border">View History</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaffs.map((staff) => (
              <tr key={staff._id} className="hover:bg-gray-100">
                <td className="p-2 border">{staff.name}</td>
                <td className="p-2 border">{staff.role}</td>
                <td className="p-2 border">{staff.department}</td>
                <td className="p-2 border">{staff.contact}</td>
                <td className="p-2 border">{staff.email}</td>
                <td className="p-2 border">{staff.address}</td>
                <td className="p-2 border">
                  {staff.profileImage ? (
                    <img
                      src={staff.profileImage}
                      alt="profile"
                      className="h-12 w-12 object-cover rounded"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td className="p-2 border">
                  {staff.idImage ? (
                    <img
                      src={staff.idImage}
                      alt="ID"
                      className="h-12 w-12 object-cover rounded"
                    />
                  ) : (
                    "No ID"
                  )}
                </td>
                <td className="p-2 border">₹{staff.wallet_balance}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => openAddAmountModal(staff)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                  >
                    Add Amount
                  </button>
                </td>
                <td className="p-2 border flex gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(staff)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(staff._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
                         {/* ✅ View History Button */}
                         <td className="p-2 border">
                         <button
                           onClick={() => handleViewHistory(staff._id)}
                           className="bg-indigo-500 text-white px-2 py-1 rounded text-xs hover:bg-indigo-600"
                         >
                           View
                         </button>
                       </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals for Add Amount & Edit Staff (Same as before) */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[300px]">
            <h3 className="text-lg font-semibold mb-4">
              Add Amount to {selectedStaff?.name}'s Wallet
            </h3>
            <input
              type="number"
              className="w-full border p-2 mb-4 rounded"
              placeholder="Enter amount"
              value={amountToAdd}
              onChange={(e) => setAmountToAdd(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={closeAddAmountModal}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAmount}
                disabled={loading}
                className={`px-3 py-1 rounded text-white ${
                  loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {loading ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[300px]">
            <h3 className="text-lg font-semibold mb-4">
              Edit {selectedStaff?.name}'s Details
            </h3>
            <form onSubmit={handleSubmitEdit}>
              <input
                type="text"
                className="w-full border p-2 mb-4 rounded"
                placeholder="Name"
                value={updatedStaff.name}
                onChange={(e) => setUpdatedStaff({ ...updatedStaff, name: e.target.value })}
              />
              <input
                type="text"
                className="w-full border p-2 mb-4 rounded"
                placeholder="Role"
                value={updatedStaff.role}
                onChange={(e) => setUpdatedStaff({ ...updatedStaff, role: e.target.value })}
              />
              <input
                type="text"
                className="w-full border p-2 mb-4 rounded"
                placeholder="Department"
                value={updatedStaff.department}
                onChange={(e) => setUpdatedStaff({ ...updatedStaff, department: e.target.value })}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffList;
