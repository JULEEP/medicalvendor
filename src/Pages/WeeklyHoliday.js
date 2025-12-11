import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";

const WeeklyHoliday = () => {
  const [holidays, setHolidays] = useState([{ id: 1, days: ["Saturday", "Sunday"] }]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editHoliday, setEditHoliday] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [updateMessage, setUpdateMessage] = useState("");

  // Function to handle edit click
  const handleEditClick = (holiday) => {
    setEditHoliday(holiday);
    setSelectedDays(holiday.days);
  };

  // Function to handle update
  const handleUpdate = () => {
    setHolidays(
      holidays.map((h) =>
        h.id === editHoliday.id ? { ...h, days: selectedDays } : h
      )
    );
    setEditHoliday(null);
    setUpdateMessage("✅ Weekly Holiday Updated Successfully!");

    // Hide message after 3 seconds
    setTimeout(() => setUpdateMessage(""), 3000);
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-5xl p-4 bg-white rounded-lg shadow-md">
        {/* Title */}
        <h2 className="mb-3 text-lg font-semibold">Weekly Holiday</h2>

        {/* Top Controls */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <label className="text-sm">Show</label>
            <select className="p-1 text-sm border rounded">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <label className="text-sm">entries</label>
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="p-1 text-sm border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-300 rounded-md">
            <thead>
              <tr className="h-10 bg-gray-200">
                <th className="w-20 p-2 text-left border">Sl</th>
                <th className="p-2 text-left border w-96">Day Name</th>
                <th className="w-24 p-2 text-left border">Action</th>
              </tr>
            </thead>
            <tbody>
              {holidays.map((holiday, index) => (
                <tr key={holiday.id} className="h-8 hover:bg-gray-100">
                  <td className="p-2 border">{index + 1}</td>
                  {/* Days in horizontal format */}
                  <td className="p-2 border">{holiday.days.join(", ")}</td>
                  <td className="p-2 border">
                    <button
                      className="p-1 text-blue-600 border border-blue-500 rounded hover:bg-blue-100"
                      onClick={() => handleEditClick(holiday)}
                    >
                      <FaEdit size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-2 text-sm">
          <p>Showing 1 to {holidays.length} of {holidays.length} entries</p>
          <div className="flex space-x-1">
            <button className="px-3 py-1 bg-gray-200 border rounded">Previous</button>
            <button className="px-3 py-1 text-white bg-green-600 border rounded">1</button>
            <button className="px-3 py-1 bg-gray-200 border rounded">Next</button>
          </div>
        </div>
      </div>

      {/* Edit Holiday Section */}
      {editHoliday && (
        <div className="w-full max-w-5xl p-4 mt-4 bg-white rounded-lg shadow-md">
          <h2 className="mb-3 text-lg font-semibold">Weekly Holiday Update</h2>
          <label className="block mb-2 text-sm">Weekly leave day</label>
          <select
            multiple
            className="w-full p-2 border rounded"
            value={selectedDays}
            onChange={(e) =>
              setSelectedDays([...e.target.selectedOptions].map((o) => o.value))
            }
          >
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
          <button
            className="px-4 py-2 mt-3 text-green-700 bg-green-100 border border-green-600 rounded"
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
      )}

      {/* Update Success Message */}
      {updateMessage && (
        <div className="px-4 py-2 mt-4 text-white bg-green-500 rounded">
          {updateMessage}
        </div>
      )}
    </div>
  );
};

export default WeeklyHoliday;
