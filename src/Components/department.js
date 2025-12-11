
import React, { useState, useEffect } from "react";
import { Pencil, Trash } from "lucide-react";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState("");

  // Fetch departments from the API
  const fetchDepartments = async () => {
    try {
      const response = await fetch("https://hr-backend-hifb.onrender.com/api/hr/get-department");
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Function to handle edit
  const handleEdit = (dept) => {
    setEditId(dept.id);
    setEditName(dept.name);
    setEditStatus(dept.status);
  };

  // Function to save edit
  const saveEdit = async () => {
    try {
      const response = await fetch(
        `https://hr-backend-hifb.onrender.com/api/hr/update-department/${editId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editName,
            status: editStatus,
          }),
        }
      );
      const updatedDept = await response.json();
      setDepartments((prev) =>
        prev.map((dept) => (dept.id === editId ? updatedDept : dept))
      );
      setEditId(null);
    } catch (error) {
      console.error("Error saving edit:", error);
    }
  };

  // Function to delete department
  const handleDelete = async (id) => {
    try {
      await fetch(`https://hr-backend-hifb.onrender.com/api/hr/delete-department/${id}`, {
        method: "DELETE",
      });
      setDepartments(departments.filter((dept) => dept.id !== id));
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  // Function to download data as Excel
  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(departments);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Departments");
    XLSX.writeFile(wb, "departments.xlsx");
  };

  return (
    <div className="p-6">
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Department List</h2>
          <div className="flex gap-2">
            <CSVLink
              data={departments}
              filename="departments.csv"
              className="bg-blue-600 text-white px-3 py-1.5 text-sm rounded"
            >
              Download CSV
            </CSVLink>
            <button
              onClick={downloadExcel}
              className="bg-blue-600 text-white px-3 py-1.5 text-sm rounded"
            >
              Download Excel
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-800 text-white text-sm">
                <th className="p-2 w-12">#</th>
                <th className="p-2">Department Name</th>
                <th className="p-2">Status</th>
                <th className="p-2 w-24 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept, index) => (
                <tr key={dept.id} className="border-b">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">
                    {editId === dept.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border p-1 text-sm rounded w-full"
                      />
                    ) : (
                      dept.name
                    )}
                  </td>
                  <td className="p-2">
                    {editId === dept.id ? (
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="border p-1 text-sm rounded w-full"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          dept.status === "Active"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {dept.status}
                      </span>
                    )}
                  </td>
                  <td className="p-2 flex justify-center gap-2">
                    {editId === dept.id ? (
                      <button
                        onClick={saveEdit}
                        className="text-green-600 text-sm px-2 py-1 border rounded"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(dept)}
                        className="text-blue-600"
                      >
                        <Pencil size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(dept.id)}
                      className="text-red-600"
                    >
                      <Trash size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DepartmentList;





