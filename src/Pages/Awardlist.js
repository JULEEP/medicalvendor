import React, { useEffect, useState } from "react";
import { FaFileCsv, FaUpload, FaEye, FaTrash } from "react-icons/fa";  // Import FaEye and FaTrash for the respective icons
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import axios from 'axios'; // Import axios for API calls

const DiagnosticList = () => {
  const [centers, setCenters] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page
  const navigate = useNavigate(); // useNavigate hook for redirection

  // Fetch diagnostic centers from API
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await axios.get("https://credenhealth.onrender.com/api/admin/alldiagnostics");
        setCenters(response.data.diagnostics);
      } catch (error) {
        console.error("Error fetching centers:", error);
      }
    };

    fetchCenters();
  }, []);

  const filteredCenters = centers.filter(center =>
    center.name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastCenter = currentPage * itemsPerPage;
  const indexOfFirstCenter = indexOfLastCenter - itemsPerPage;
  const currentCenters = filteredCenters.slice(indexOfFirstCenter, indexOfLastCenter);

  const totalPages = Math.ceil(filteredCenters.length / itemsPerPage);

  const handleBulkImport = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const parsedData = XLSX.utils.sheet_to_json(sheet);

        console.log("Imported Centers:", parsedData);

        alert("Diagnostic center data imported successfully!");
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleView = (id) => {
    // Redirect to the diagnostic center detail page with the center ID
    navigate(`/diagnostic-center/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      // Call the API to delete the diagnostic center
      const response = await axios.delete(`https://credenhealth.onrender.com/api/admin/diagnostic/${id}`);
      alert("Diagnostic center deleted successfully!");
      
      // Remove the deleted center from the state
      setCenters(centers.filter(center => center._id !== id));
    } catch (error) {
      console.error("Error deleting center:", error);
      alert("Failed to delete the diagnostic center.");
    }
  };

  // Handlers for Pagination
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const headers = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    { label: "Address", key: "address" },
    { label: "Center Type", key: "centerType" },
  ];

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Diagnostic Centers</h2>
      </div>

      <div className="mb-4 flex gap-2 flex-wrap">
        <input
          type="text"
          className="px-3 py-2 border rounded text-sm"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <CSVLink
          data={filteredCenters}
          headers={headers}
          filename="diagnostic_centers.csv"
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
              {headers.map((header, idx) => (
                <th key={idx} className="p-2 border text-left">{header.label}</th>
              ))}
              <th className="p-2 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCenters.map((center, idx) => (
              <tr key={idx} className="hover:bg-gray-100 border-b">
                <td className="p-2 border">{center.name}</td>
                <td className="p-2 border">{center.email}</td>
                <td className="p-2 border">{center.phone}</td>
                <td className="p-2 border">{center.address}</td>
                <td className="p-2 border">{center.centerType}</td>
                <td className="p-2 border flex gap-2 justify-center">
                  <button
                    onClick={() => handleView(center._id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEye /> {/* Eye icon for View */}
                  </button>
                  <button
                    onClick={() => handleDelete(center._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash /> {/* Trash icon for Delete */}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Previous
        </button>

        <div>
          <span className="font-semibold">Page {currentPage} of {totalPages}</span>
        </div>

        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DiagnosticList;
