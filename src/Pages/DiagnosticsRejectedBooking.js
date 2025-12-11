import React, { useEffect, useState } from "react";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import * as XLSX from "xlsx";
import { CSVLink } from "react-csv";
import { saveAs } from "file-saver";
import axios from "axios";

const DiagnosticsRejectedBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchRejectedBookings();
  }, []);

  const fetchRejectedBookings = async () => {
    try {
      const response = await axios.get(
        "https://credenhealth.onrender.com/api/admin/allrejecteddiagnosticsbookings"
      );
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error("Error fetching rejected bookings:", error);
    }
  };

  const filteredBookings = bookings.filter((booking) =>
    booking.patient_name?.toLowerCase().includes(search.toLowerCase())
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "RejectedBookings");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(blob, "diagnostic_rejected_bookings.xlsx");
  };

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirst, indexOfLast);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Diagnostics Rejected Bookings</h2>
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
          className="px-4 py-2 bg-green-700 text-white rounded text-sm flex items-center gap-1"
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
            </tr>
          </thead>
          <tbody>
            {currentBookings.map((booking) => (
              <tr key={booking.bookingId} className="hover:bg-gray-50 border-b">
                <td className="p-2 border">{booking.patient_name}</td>
                <td className="p-2 border">{booking.patient_age || booking.age || "N/A"}</td>
                <td className="p-2 border">{booking.patient_gender || booking.gender || "N/A"}</td>
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
                <td className="p-2 border capitalize">{booking.status}</td>
                <td className="p-2 border">
                  {new Date(booking.appointment_date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">{currentPage}</span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLast >= filteredBookings.length}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DiagnosticsRejectedBooking;
