import React, { useState } from "react";
import { FaFileExcel, FaFileCsv, FaEdit, FaTrash } from "react-icons/fa";
import * as XLSX from "xlsx";
import { CSVLink } from "react-csv";
import { saveAs } from "file-saver";

const DoctorAppointmentListPending = () => {
  const [appointments, setAppointments] = useState([
    {
      appointmentId: "A001",
      doctor_name: "Dr. John Smith",
      doctor_specialization: "Cardiology",
      doctor_image: "https://randomuser.me/api/portraits/men/1.jpg",
      patient_name: "Alice Johnson",
      patient_relation: "Daughter",
      subtotal: 500,
      total: 600,
      status: "Pending",
      appointment_date: "2025-04-20",
    },
    {
      appointmentId: "A002",
      doctor_name: "Dr. Emily Davis",
      doctor_specialization: "Dermatology",
      doctor_image: "https://randomuser.me/api/portraits/women/2.jpg",
      patient_name: "Bob Lee",
      patient_relation: "Son",
      subtotal: 300,
      total: 350,
      status: "Pending",
      appointment_date: "2025-04-22",
    },
    {
      appointmentId: "A003",
      doctor_name: "Dr. Michael Brown",
      doctor_specialization: "Pediatrics",
      doctor_image: "https://randomuser.me/api/portraits/men/3.jpg",
      patient_name: "Catherine Lee",
      patient_relation: "Mother",
      subtotal: 450,
      total: 500,
      status: "Pending",
      appointment_date: "2025-04-23",
    },
  ]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const filteredAppointments = appointments.filter((appt) =>
    appt.patient_name.toLowerCase().includes(search.toLowerCase())
  );

  const headers = [
    { label: "Appointment ID", key: "appointmentId" },
    { label: "Doctor Name", key: "doctor_name" },
    { label: "Specialization", key: "doctor_specialization" },
    { label: "Patient Name", key: "patient_name" },
    { label: "Relation", key: "patient_relation" },
    { label: "Subtotal", key: "subtotal" },
    { label: "Total", key: "total" },
    { label: "Status", key: "status" },
    { label: "Appointment Date", key: "appointment_date" },
  ];

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredAppointments);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(blob, "doctor_appointments_pending.xlsx");
  };

  const openEditModal = (appointment) => {
    setSelectedAppointment(appointment);
    setNewStatus(appointment.status);
    setIsModalOpen(true);
  };

  const handleStatusChange = () => {
    const updatedAppointments = appointments.map((appt) =>
      appt.appointmentId === selectedAppointment.appointmentId
        ? { ...appt, status: newStatus }
        : appt
    );
    setAppointments(updatedAppointments);
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Doctor Appointments (Pending)</h2>
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
          data={filteredAppointments}
          headers={headers}
          filename="doctor_appointments_pending.csv"
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
            {filteredAppointments.map((appt) => (
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
                <td className="p-2 border text-center flex gap-2 justify-center">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => openEditModal(appt)}
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

      {/* Edit Status Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Edit Status</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2 border rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleStatusChange}
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointmentListPending;
