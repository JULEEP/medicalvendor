import React, { useState } from "react";
import { FaFileExcel, FaFileCsv, FaEdit, FaTrash } from "react-icons/fa";
import * as XLSX from "xlsx";
import { CSVLink } from "react-csv";
import { saveAs } from "file-saver";

const DiagnosticsPendingBooking = () => {
  const [bookings, setBookings] = useState([
    {
      bookingId: "B001",
      patient_name: "John Doe",
      patient_age: 30,
      patient_gender: "Male",
      staff_name: "Dr. Smith",
      diagnostic_name: "X-Ray",
      diagnostic_address: "123 Health St.",
      consultation_fee: 500,
      subtotal: 1000,
      gst_on_tests: 90,
      gst_on_consultation: 50,
      total: 1640,
      status: "Pending",
      appointment_date: "2025-04-12",
      tests: [{ test_name: "X-Ray Chest", offerPrice: 1000 }],
    },
    {
      bookingId: "B002",
      patient_name: "Jane Smith",
      patient_age: 40,
      patient_gender: "Female",
      staff_name: "Dr. Brown",
      diagnostic_name: "CT Scan",
      diagnostic_address: "456 Wellness Ave.",
      consultation_fee: 700,
      subtotal: 1400,
      gst_on_tests: 126,
      gst_on_consultation: 70,
      total: 2196,
      status: "Pending",
      appointment_date: "2025-04-15",
      tests: [{ test_name: "CT Scan Brain", offerPrice: 1400 }],
    },
  ]);
  const [search, setSearch] = useState("");
  const [editBooking, setEditBooking] = useState(null);  // To store selected booking for editing
  const [newStatus, setNewStatus] = useState("");

  const filteredBookings = bookings.filter((booking) =>
    booking.patient_name.toLowerCase().includes(search.toLowerCase())
  );

  const headers = [
    { label: "Booking ID", key: "bookingId" },
    { label: "Patient Name", key: "patient_name" },
    { label: "Patient Age", key: "patient_age" },
    { label: "Patient Gender", key: "patient_gender" },
    { label: "Staff Name", key: "staff_name" },
    { label: "Diagnostic Name", key: "diagnostic_name" },
    { label: "Diagnostic Address", key: "diagnostic_address" },
    { label: "Consultation Fee", key: "consultation_fee" },
    { label: "Subtotal", key: "subtotal" },
    { label: "GST on Tests", key: "gst_on_tests" },
    { label: "GST on Consultation", key: "gst_on_consultation" },
    { label: "Total", key: "total" },
    { label: "Status", key: "status" },
    { label: "Appointment Date", key: "appointment_date" },
  ];

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredBookings);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(blob, "diagnostic_bookings.xlsx");
  };

  const handleStatusUpdate = () => {
    // Update the status of the selected booking
    const updatedBookings = bookings.map((booking) =>
      booking.bookingId === editBooking.bookingId
        ? { ...booking, status: newStatus }
        : booking
    );
    setBookings(updatedBookings);
    setEditBooking(null);
    setNewStatus("");
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Diagnostics Booking List (Pending)</h2>
      </div>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          className="px-3 py-2 border rounded text-sm"
          placeholder="Search by patient name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <CSVLink
          data={filteredBookings}
          headers={headers}
          filename="diagnostic_bookings.csv"
          className="px-4 py-2 bg-green-500 text-white rounded text-sm flex items-center gap-1"
        >
          <FaFileCsv /> CSV
        </CSVLink>
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-green-500 text-white rounded text-sm flex items-center gap-1"
        >
          <FaFileExcel /> Excel
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border rounded text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Patient</th>
              <th className="p-2 border">Age</th>
              <th className="p-2 border">Gender</th>
              <th className="p-2 border">Staff</th>
              <th className="p-2 border">Diagnostic</th>
              <th className="p-2 border">Fee</th>
              <th className="p-2 border">Tests</th>
              <th className="p-2 border">Subtotal</th>
              <th className="p-2 border">GST (Tests)</th>
              <th className="p-2 border">GST (Consult.)</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.bookingId} className="hover:bg-gray-50 border-b">
                <td className="p-2 border">{booking.patient_name}</td>
                <td className="p-2 border">{booking.patient_age}</td>
                <td className="p-2 border">{booking.patient_gender}</td>
                <td className="p-2 border">{booking.staff_name}</td>
                <td className="p-2 border">{booking.diagnostic_name}</td>
                <td className="p-2 border">₹{booking.consultation_fee}</td>
                <td className="p-2 border">
                  {booking.tests.map((test, idx) => (
                    <div key={idx}>{test.test_name} (₹{test.offerPrice})</div>
                  ))}
                </td>
                <td className="p-2 border">₹{booking.subtotal}</td>
                <td className="p-2 border">₹{booking.gst_on_tests}</td>
                <td className="p-2 border">₹{booking.gst_on_consultation}</td>
                <td className="p-2 border font-semibold">₹{booking.total}</td>
                <td className="p-2 border">{booking.status}</td>
                <td className="p-2 border">{new Date(booking.appointment_date).toLocaleDateString()}</td>
                <td className="p-2 border text-center flex gap-2 justify-center">
                  <button
                    onClick={() => {
                      setEditBooking(booking);
                      setNewStatus(booking.status); // Pre-fill status with current status
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status Update Modal */}
      {editBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">Update Status</h3>
            <select
              className="w-full p-2 border rounded mb-4"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditBooking(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosticsPendingBooking;
