import React, { useState, useEffect } from "react";
import { FaCheck, FaTrash } from "react-icons/fa";

const LeaveApplicationList = () => {
  const [search, setSearch] = useState("");
  const [leaveData, setLeaveData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Fetch data from the backend API
    const fetchLeaveApplications = async () => {
      try {
        const response = await fetch("https://hr-backend-hifb.onrender.com/api/hr/all-approval");
        const data = await response.json();

        if (data && data.message) {
          setErrorMessage(data.message); // If no leave data, show the message
        } else {
          setLeaveData(data); // Set the data if it's present
        }
      } catch (error) {
        setErrorMessage("Error fetching data from the server."); // Handle fetch error
      }
    };

    fetchLeaveApplications();
  }, []);

  const filteredData = leaveData.filter((item) =>
    item.employee.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Leave Approval List</h2>
        <input
          type="text"
          placeholder="Search employee"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        />
      </div>
      
      {errorMessage ? (
        // Show message if there is no data or an error
        <div className="text-center text-red-500">{errorMessage}</div>
      ) : (
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="text-left bg-gray-200">
              <th className="px-4 py-2 border">SI</th>
              <th className="px-4 py-2 border">Employee Name</th>
              <th className="px-4 py-2 border">Type</th>
              <th className="px-4 py-2 border">Apply Date</th>
              <th className="px-4 py-2 border">Leave Start Date</th>
              <th className="px-4 py-2 border">Leave End Date</th>
              <th className="px-4 py-2 border">Days</th>
              <th className="px-4 py-2 border">Approved Date</th>
              <th className="px-4 py-2 border">Approved Start Date</th>
              <th className="px-4 py-2 border">Approved End Date</th>
              <th className="px-4 py-2 border">Approved Days</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{item.employee}</td>
                  <td className="px-4 py-2 border">{item.type}</td>
                  <td className="px-4 py-2 border">{item.applyDate}</td>
                  <td className="px-4 py-2 border">{item.startDate}</td>
                  <td className="px-4 py-2 border">{item.endDate}</td>
                  <td className="px-4 py-2 border">{item.days}</td>
                  <td className="px-4 py-2 border">{item.approvedDate}</td>
                  <td className="px-4 py-2 border">{item.approvedStart}</td>
                  <td className="px-4 py-2 border">{item.approvedEnd}</td>
                  <td className="px-4 py-2 border">{item.approvedDays}</td>
                  <td className="px-4 py-2 border">
                    <span className="px-2 py-1 text-xs text-white bg-green-500 rounded-lg">
                      {item.status}
                    </span>
                  </td>
                  <td className="flex gap-2 px-4 py-2 border">
                    <button className="text-green-600">
                      <FaCheck />
                    </button>
                    <button className="text-red-600">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="13" className="text-center p-4">
                  No leave applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeaveApplicationList;
