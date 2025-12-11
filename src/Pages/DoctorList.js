import React, { useEffect, useState } from "react";
import { FaFileCsv, FaEdit, FaTrash, FaUpload } from "react-icons/fa";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import axios from "axios"; // Import axios for API calls

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [updatedDoctor, setUpdatedDoctor] = useState({
    name: "",
    specialization: "",
    qualification: "",
    description: "",
    consultation_fee: 0,
    address: "",
    image: "",
    category: "",
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("https://credenhealth.onrender.com/api/admin/getdoctors");
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  const headers = [
    { label: "Name", key: "name" },
    { label: "Category", key: "category" },
    { label: "Specialization", key: "specialization" },
    { label: "Qualification", key: "qualification" },
    { label: "Description", key: "description" },
    { label: "Consultation Fee", key: "consultation_fee" },
    { label: "Address", key: "address" },
  ];

  // Handle bulk import
  const handleBulkImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const importedData = XLSX.utils.sheet_to_json(sheet);

      console.log("Imported Doctors:", importedData);
      alert("Doctor data imported successfully!");
    };

    reader.readAsArrayBuffer(file);
  };

  const handleEdit = (id) => {
    const doctorToEdit = doctors.find((doc) => doc._id === id);
    setEditingDoctor(doctorToEdit);
    setUpdatedDoctor({ ...doctorToEdit }); // Set the initial state for the form
  };

  const handleDelete = (id) => {
    setDoctors(doctors.filter((doc) => doc._id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDoctor((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    // Assuming we will send the updated data to the backend (mocked with a console log)
    console.log("Updated Doctor:", updatedDoctor);
    
    try {
      await axios.put(`https://credenhealth.onrender.com/api/admin/updateDoctor/${editingDoctor._id}`, updatedDoctor);
      setDoctors((prevDoctors) =>
        prevDoctors.map((doc) =>
          doc._id === editingDoctor._id ? { ...updatedDoctor } : doc
        )
      );
      setEditingDoctor(null); // Close the popup after saving
      alert("Doctor details updated successfully!");
    } catch (error) {
      console.error("Error updating doctor:", error);
    }
  };

  const handleCancel = () => {
    setEditingDoctor(null); // Close the popup without saving
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Doctor List</h2>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="text"
          className="px-3 py-2 border rounded text-sm"
          placeholder="Search by doctor name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <CSVLink
          data={filteredDoctors}
          headers={headers}
          filename="doctor_list.csv"
          className="px-4 py-2 bg-green-500 text-white rounded text-sm flex items-center gap-2"
        >
          <FaFileCsv /> CSV
        </CSVLink>

        <label
          htmlFor="file-upload"
          className="px-4 py-2 bg-purple-600 text-white rounded text-sm flex items-center gap-2 cursor-pointer"
        >
          <FaUpload /> Bulk Import
          <input
            id="file-upload"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleBulkImport}
            className="hidden"
          />
        </label>
      </div>

      <div className="overflow-y-auto max-h-[400px]">
        <table className="w-full border rounded text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border text-left">Name</th>
              <th className="p-2 border text-left">Category</th>
              <th className="p-2 border text-left">Specialization</th>
              <th className="p-2 border text-left">Qualification</th>
              <th className="p-2 border text-left">Description</th>
              <th className="p-2 border text-left">Fee</th>
              <th className="p-2 border text-left">Address</th>
              <th className="p-2 border text-left">Image</th>
              <th className="p-2 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map((doc) => (
              <tr key={doc._id} className="hover:bg-gray-100 border-b">
                <td className="p-2 border">{doc.name}</td>
                <td className="p-2 border">{doc.category}</td>
                <td className="p-2 border">{doc.specialization}</td>
                <td className="p-2 border">{doc.qualification}</td>
                <td className="p-2 border">{doc.description}</td>
                <td className="p-2 border">₹{doc.consultation_fee}</td>
                <td className="p-2 border">{doc.address}</td>
                <td className="p-2 border">
                  {doc.image ? (
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td className="p-2 border flex gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(doc._id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

{/* Edit Doctor Modal */}
{editingDoctor && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded shadow-md w-3/4 md:w-2/3 lg:w-1/3">
      <h3 className="text-xl font-semibold mb-4">Edit Doctor Details</h3>
      <form>
        {/* First Row with 3 fields */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={updatedDoctor.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Specialization</label>
            <input
              type="text"
              name="specialization"
              value={updatedDoctor.specialization}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Qualification</label>
            <input
              type="text"
              name="qualification"
              value={updatedDoctor.qualification}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>

        {/* Second Row with 3 fields */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={updatedDoctor.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium">Consultation Fee</label>
            <input
              type="number"
              name="consultation_fee"
              value={updatedDoctor.consultation_fee}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={updatedDoctor.address}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>

        {/* Third Row with 1 field */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Category</label>
          <input
            type="text"
            name="category"
            value={updatedDoctor.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default DoctorList;
