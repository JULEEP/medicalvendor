import React, { useState, useEffect } from "react";
import axios from "axios";

const AttendanceForm = () => {
  const [employee, setEmployee] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("Present"); // Default status is "Present"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]); // To store attendance records
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch all attendance records on component mount
  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      try {
        const response = await axios.get("https://hr-backend-hifb.onrender.com/api/hr/all-attendance");
        setAttendanceRecords(response.data);
      } catch (error) {
        console.error("Error fetching attendance records:", error);
      }
    };

    fetchAttendanceRecords();
  }, []);

  // Handle Single Employee Submit (POST request)
  const handleSubmit = async () => {
    if (!employee || !time) {
      alert("Please select an employee and choose a time!");
      return;
    }

    const newRecord = {
      employee,
      time,
      status,
    };

    try {
      const response = await axios.post(
        "https://hr-backend-hifb.onrender.com/api/hr/create-attendance",
        newRecord
      );
      alert(`✅ Attendance submitted successfully!\n👤 Employee: ${response.data.employee}\n📅 Time: ${response.data.time}\nStatus: ${response.data.status}`);
      // After successful submit, update the records list
      setAttendanceRecords([...attendanceRecords, response.data]);
    } catch (error) {
      alert("Error submitting attendance");
      console.error("Error creating attendance:", error);
    }

    setEmployee("");
    setTime("");
    setStatus("Present"); // Reset status to "Present" after submission
  };

  // Handle File Selection for Bulk Import
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle Bulk Import (not fully implemented here, assuming you want to handle file import separately)
  const handleImport = async () => {
    if (!selectedFile) {
      alert("Please choose an Excel file before importing!");
      return;
    }

    alert(`Bulk attendance imported successfully!\nFile: ${selectedFile.name}`);
    setIsModalOpen(false);
    setSelectedFile(null);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Add Attendance Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed top-22 right-6 px-4 py-2 text-white bg-green-500 rounded shadow-md"
      >
        + Add Attendance
      </button>

      {/* Table for Showing Attendance Records */}
      <div className="mt-12 bg-white p-6 rounded shadow-lg">
        <h3 className="mb-4 text-xl font-semibold">Attendance Records</h3>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">Employee</th>
              <th className="px-4 py-2 text-left">Time</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.length > 0 ? (
              attendanceRecords.map((record) => (
                <tr key={record._id} className="border-b">
                  <td className="px-4 py-2">{record.employee}</td>
                  <td className="px-4 py-2">{new Date(record.time).toLocaleString()}</td>
                  <td className="px-4 py-2">{record.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-4 py-2 text-center">
                  No attendance records yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Taking Attendance */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg w-96">
            <h3 className="mb-4 text-lg font-semibold">Take Attendance</h3>

            {/* Employee Selection */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">
                Employee <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-green-500"
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
              >
                <option value="">Select one</option>
                <option value="John Doe">John Doe</option>
                <option value="Jane Smith">Jane Smith</option>
              </select>
            </div>

            {/* Time Selection */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">
                Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-green-500"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            {/* Status Selection */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-green-500"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-green-700 bg-green-100 border border-green-600 rounded w-full mb-4"
            >
              Submit
            </button>

            {/* Bulk Insert Modal */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-red-700 bg-red-100 border border-red-600 rounded"
              >
                Close
              </button>
              <button
                onClick={handleImport}
                className="px-4 py-2 text-green-700 bg-green-100 border border-green-600 rounded"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceForm;
