import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaFileExcel, FaFileCsv, FaEdit, FaTrash } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const DoctorAppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [editAppointment, setEditAppointment] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 5;

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get("https://credenhealth.onrender.com/api/admin/alldoctorbookings");
      console.log("API RESPONSE:", res.data); // 👈 CHECK THIS

      if (res.data && res.data.appointments) {
        setAppointments(res.data.appointments);
      } else {
        console.warn("No appointments key in response:", res.data);
      }
    } catch (error) {
      console.error("Failed to fetch doctor appointments:", error); // 👈 CHECK THIS TOO
    }
  };

  const handleStatusUpdate = async () => {
    try {
      const lowercaseStatus = newStatus.toLowerCase(); // Convert status to lowercase
  
      const res = await axios.put(
        `https://credenhealth.onrender.com/api/admin/updatestatus/${editAppointment.appointmentId}`,
        { newStatus: lowercaseStatus }
      );
  
      if (res.status === 200) {
        // ✅ Remove the updated appointment from the list
        const updatedAppointments = appointments.filter(
          (appt) => appt.appointmentId !== editAppointment.appointmentId
        );
        setAppointments(updatedAppointments);
  
        // Reset the form state
        setEditAppointment(null);
        setNewStatus("");
      }
    } catch (error) {
      console.error("Failed to update appointment status:", error);
    }
  };
  

  const handleDelete = (id) => {
    setAppointments(appointments.filter((a) => a.appointmentId !== id));
    // Optionally: Send DELETE request
  };

  const filteredAppointments = appointments.filter((appt) =>
    appt.patient_name.toLowerCase().includes(search.toLowerCase())
  );

  // Logic for pagination
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

  // Total pages
  const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);

  const headers = [
    { label: "Appointment ID", key: "appointmentId" },
    { label: "Doctor Name", key: "doctor_name" },
    { label: "Specialization", key: "doctor_specialization" },
    { label: "Patient Name", key: "patient_name" },
    { label: "Relation", key: "patient_relation" },
    { label: "Subtotal", key: "subtotal" },
    { label: "Total", key: "total" },
    { label: "Status", key: "status" },
    { label: "Appointment Date", key: "appointment_date" }
  ];

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredAppointments);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(blob, "doctor_appointments.xlsx");
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Doctor Appointments</h2>
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
              <th className="p-2 border">Doctor</th>
              <th className="p-2 border">Specialization</th>
              <th className="p-2 border">Patient</th>
              <th className="p-2 border">Relation</th>
              <th className="p-2 border">Subtotal</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentAppointments.map((appt) => (
              <tr key={appt.appointmentId} className="hover:bg-gray-50 border-b">
                <td className="p-2 border flex items-center gap-2">
                  <img
                    src={appt.doctor_image}
                    alt={appt.doctor_name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  {appt.doctor_name}
                </td>
                <td className="p-2 border">{appt.doctor_specialization}</td>
                <td className="p-2 border">{appt.patient_name}</td>
                <td className="p-2 border">{appt.patient_relation}</td>
                <td className="p-2 border">₹{appt.subtotal}</td>
                <td className="p-2 border font-semibold">₹{appt.total}</td>
                <td className="p-2 border">{appt.status}</td>
                <td className="p-2 border">
                  {new Date(appt.appointment_date).toLocaleDateString()}
                </td>
                <td className="p-2 border flex gap-2 justify-center">
                  <button
                    onClick={() => {
                      setEditAppointment(appt);
                      setNewStatus(appt.status);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(appt.appointmentId)}
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

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <div className="flex items-center justify-center">
          <span>Page {currentPage} of {totalPages}</span>
        </div>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Status Update Modal */}
      {editAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">Update Status</h3>
            <select
              className="w-full p-2 border rounded mb-4"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="rejected">Select</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>

            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditAppointment(null)}
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

export default DoctorAppointmentList;
