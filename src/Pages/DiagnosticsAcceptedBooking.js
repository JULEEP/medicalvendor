import React, { useEffect, useState } from "react";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import * as XLSX from "xlsx";
import { CSVLink } from "react-csv";
import { saveAs } from "file-saver";
import axios from "axios";

const DiagnosticsAcceptedBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false); // For controlling modal visibility
  const [selectedBooking, setSelectedBooking] = useState(null); // For tracking the selected booking for prescription upload
  const [prescriptionFile, setPrescriptionFile] = useState(null); // For storing the file to upload

  useEffect(() => {
    fetchAcceptedBookings();
  }, []);

  const fetchAcceptedBookings = async () => {
    try {
      const response = await axios.get("https://credenhealth.onrender.com/api/admin/allaccepteddiagnosticsbookings");
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error("Error fetching accepted bookings:", error);
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "AcceptedBookings");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(blob, "diagnostic_accepted_bookings.xlsx");
  };

  const handleFileChange = (e) => {
    setPrescriptionFile(e.target.files[0]); // Set the selected file
  };

  const handleFileUpload = async () => {
    if (!prescriptionFile || !selectedBooking) return; // If no file or booking selected, return

    const formData = new FormData();
    formData.append("prescription", prescriptionFile);
    formData.append("bookingId", selectedBooking.bookingId); // Attach bookingId for backend identification

    try {
      await axios.post("https://credenhealth.onrender.com/api/admin/upload-prescription", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Prescription uploaded successfully!");
      setShowModal(false); // Close modal after successful upload
    } catch (error) {
      console.error("Error uploading prescription:", error);
      alert("Failed to upload prescription.");
    }
  };

  const renderModal = () => {
    if (!showModal || !selectedBooking) return null;

    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-md w-96">
          <h3 className="text-lg font-semibold mb-4">Upload Prescription for {selectedBooking.patient_name}</h3>
          <div className="mb-4">
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={handleFileChange}
              className="border p-2 w-full"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleFileUpload}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Upload
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="ml-2 px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Diagnostics Accepted Bookings</h2>
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
          className="px-4 py-2 bg-purple-900 text-white rounded-md hover:bg-purple-600"
        >
          <FaFileExcel />
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
              <th className="p-2 border">Add Prescription</th> {/* New column for Prescription Upload */}
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
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
                <td className="p-2 border">
                  <button
                    onClick={() => {
                      setSelectedBooking(booking); // Set selected booking
                      setShowModal(true); // Show modal
                    }}
                    className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-900"
                  >
                    Add
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Render the Modal */}
      {renderModal()}
    </div>
  );
};

export default DiagnosticsAcceptedBooking;
