import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaFileExcel, FaFileCsv, FaEdit, FaTrash } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const DiagnosticsBookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [editBooking, setEditBooking] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("https://credenhealth.onrender.com/api/admin/alldiagnosticsbookings");
      setBookings(res.data.bookings || []);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      const lowercaseStatus = newStatus.toLowerCase(); // Convert status to lowercase
  
      const res = await axios.put(
        `https://credenhealth.onrender.com/api/admin/update/${editBooking.bookingId}`,
        { newStatus: lowercaseStatus }
      );
  
      if (res.status === 200) {
        // Handle "accepted" status
        if (lowercaseStatus === "accepted") {
          // Remove the booking from the current list and update state for accepted bookings
          const updatedBookings = bookings.filter((b) => b.bookingId !== editBooking.bookingId);
          setBookings(updatedBookings);
        }
  
        // Handle "rejected" status
        if (lowercaseStatus === "rejected") {
          // Remove the booking from the current list and update state for rejected bookings
          const updatedBookings = bookings.filter((b) => b.bookingId !== editBooking.bookingId);
          setBookings(updatedBookings);
        }
        // Reset edit form
        setEditBooking(null);
        setNewStatus("");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };
  
  
  const handleDelete = (id) => {
    setBookings(bookings.filter((b) => b.bookingId !== id));
    // Optionally: Send DELETE request to API
  };

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
    { label: "Appointment Date", key: "appointment_date" }
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

  // Pagination logic
  const indexOfLastBooking = currentPage * itemsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Diagnostics Booking List</h2>
      </div>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          className="px-3 py-2 border rounded text-sm"
          placeholder="Search by patient name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
            {currentBookings.map((booking) => (
              <tr key={booking.bookingId} className="hover:bg-gray-50 border-b">
                <td className="p-2 border">{booking.patient_name}</td>
                <td className="p-2 border">{booking.patient_age || booking.age}</td>
                <td className="p-2 border">{booking.patient_gender || booking.gender}</td>
                <td className="p-2 border">{booking.staff_name}</td>
                <td className="p-2 border">{booking.diagnostic_name}</td>
                <td className="p-2 border">₹{booking.consultation_fee}</td>
                <td className="p-2 border">
                  {booking.tests?.length
                    ? booking.tests.map((test, idx) => (
                        <div key={idx}>{test.test_name} (₹{test.offerPrice})</div>
                      ))
                    : "No tests"}
                </td>
                <td className="p-2 border">₹{booking.subtotal}</td>
                <td className="p-2 border">₹{booking.gst_on_tests}</td>
                <td className="p-2 border">₹{booking.gst_on_consultation}</td>
                <td className="p-2 border font-semibold">₹{booking.total}</td>
                <td className="p-2 border">{booking.status}</td>
                <td className="p-2 border">
                  {new Date(booking.appointment_date).toLocaleDateString()}
                </td>
                <td className="p-2 border text-center flex gap-2 justify-center">
                  <button
                    onClick={() => {
                      setEditBooking(booking);
                      setNewStatus(booking.status);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(booking.bookingId)}
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

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          className="px-4 py-2 bg-gray-300 rounded-l"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          className="px-4 py-2 bg-gray-300 rounded-r"
          disabled={currentPage * itemsPerPage >= filteredBookings.length}
        >
          Next
        </button>
      </div>

      {/* Modal for status update */}
      {editBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">Update Booking</h3>
            <div className="mb-4">
              <label className="block text-sm">Patient Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={editBooking.patient_name}
                onChange={(e) => setEditBooking({ ...editBooking, patient_name: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm">Staff Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={editBooking.staff_name}
                onChange={(e) => setEditBooking({ ...editBooking, staff_name: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm">Status</label>
              <select
                className="w-full p-2 border rounded"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="Rejected">Select</option>
                <option value="Accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
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

export default DiagnosticsBookingList;
