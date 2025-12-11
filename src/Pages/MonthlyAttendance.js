import React, { useState, useEffect } from "react";
import axios from "axios";

const MonthlyAttendance = () => {
  const [employee, setEmployee] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [timeIn, setTimeIn] = useState("");
  const [timeOut, setTimeOut] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // To control modal visibility
  const [attendanceRecords, setAttendanceRecords] = useState([]); // To store submitted records

  // Fetch the attendance records from the server
  const fetchAttendanceRecords = async () => {
    try {
      const response = await axios.get("https://hr-backend-hifb.onrender.com/api/hr/all-montlyattendance");
      setAttendanceRecords(response.data); // Populate the table with data from the server
    } catch (error) {
      console.error("Error fetching attendance records:", error);
    }
  };

  useEffect(() => {
    fetchAttendanceRecords(); // Fetch attendance data when the component mounts
  }, []);

  // Handle Form Submit
  const handleSubmit = async () => {
    if (!employee || !year || !month || !timeIn || !timeOut) {
      alert("⚠ Please fill in all required fields!");
      return;
    }

    // Create a new attendance record
    const newRecord = {
      employee,
      year,
      month,
      timeIn,
      timeOut,
    };

    try {
      // Send POST request to add monthly attendance record
      await axios.post("https://hr-backend-hifb.onrender.com/api/hr/monthly-attendance", newRecord);

      // Alert for successful submission
      alert(`✅ Monthly Attendance Submitted Successfully!\n👤 Employee: ${employee}\n📅 Year: ${year}, Month: ${month}\n⏰ Time In: ${timeIn}, Time Out: ${timeOut}`);
      
      // Clear form fields after submission
      setEmployee("");
      setYear("");
      setMonth("");
      setTimeIn("");
      setTimeOut("");

      // Close the modal and refresh the attendance records
      setIsModalOpen(false);
      fetchAttendanceRecords(); // Fetch updated records
    } catch (error) {
      console.error("Error submitting attendance:", error);
      alert("❌ Failed to submit attendance. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-5xl p-6 mx-auto">
      {/* Add Monthly Attendance Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed top-24 right-6 px-4 py-2 text-white bg-green-500 rounded shadow-md"
      >
        + Add Monthly Attendance
      </button>

      {/* Table for Showing Attendance Records */}
      <div className="mt-12 bg-white p-6 rounded shadow-lg">
        <h3 className="mb-4 text-xl font-semibold">Monthly Attendance Records</h3>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-6 py-3 text-left">Employee</th>
              <th className="px-6 py-3 text-left">Year</th>
              <th className="px-6 py-3 text-left">Month</th>
              <th className="px-6 py-3 text-left">Time In</th>
              <th className="px-6 py-3 text-left">Time Out</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.length > 0 ? (
              attendanceRecords.map((record, index) => (
                <tr key={index} className="border-b">
                  <td className="px-6 py-3">{record.employee}</td>
                  <td className="px-6 py-3">{record.year}</td>
                  <td className="px-6 py-3">{record.month}</td>
                  <td className="px-6 py-3">{record.timeIn}</td>
                  <td className="px-6 py-3">{record.timeOut}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-3 text-center">
                  No attendance records yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Taking Monthly Attendance */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg w-96">
            <h3 className="mb-4 text-lg font-semibold">Take Monthly Attendance</h3>

            {/* Employee Selection */}
            <div className="mb-4">
              <label className="block font-medium">Employee *</label>
              <select
                className="w-full p-2 border rounded-md"
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
              >
                <option value="">Select one</option>
                <option value="John Doe">John Doe</option>
                <option value="Jane Smith">Jane Smith</option>
              </select>
            </div>

            {/* Year Selection */}
            <div className="mb-4">
              <label className="block font-medium">Year *</label>
              <select
                className="w-full p-2 border rounded-md"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="">Select one</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </select>
            </div>

            {/* Month Selection */}
            <div className="mb-4">
              <label className="block font-medium">Month *</label>
              <select
                className="w-full p-2 border rounded-md"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="">Select one</option>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </select>
            </div>

            {/* Time In Selection */}
            <div className="mb-4">
              <label className="block font-medium">Time In *</label>
              <input
                type="time"
                className="w-full p-2 border rounded-md"
                value={timeIn}
                onChange={(e) => setTimeIn(e.target.value)}
              />
            </div>

            {/* Time Out Selection */}
            <div className="mb-4">
              <label className="block font-medium">Time Out *</label>
              <input
                type="time"
                className="w-full p-2 border rounded-md"
                value={timeOut}
                onChange={(e) => setTimeOut(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-green-700 bg-green-100 border border-green-600 rounded w-full mb-4"
            >
              Submit
            </button>

            {/* Modal Footer (Close Button) */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-red-700 bg-red-100 border border-red-600 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyAttendance;
