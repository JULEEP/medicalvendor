import React, { useEffect, useState } from "react";
import axios from "axios";

const AcceptedAppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false); // State to toggle the modal visibility
  const [selectedAppointment, setSelectedAppointment] = useState(null); // Selected appointment for prescription upload
  const [prescriptionFile, setPrescriptionFile] = useState(null); // State for prescription file

  useEffect(() => {
    fetchAcceptedAppointments();
  }, []);

  const fetchAcceptedAppointments = async () => {
    try {
      const res = await axios.get("https://credenhealth.onrender.com/api/admin/acceptedappointments");
      if (res.data && res.data.appointments) {
        setAppointments(res.data.appointments);
      }
    } catch (error) {
      console.error("Failed to fetch accepted appointments:", error);
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setPrescriptionFile(e.target.files[0]);
  };

  // Handle file upload (prescription)
  const handleFileUpload = async () => {
    if (!prescriptionFile || !selectedAppointment) return;

    const formData = new FormData();
    formData.append("prescription", prescriptionFile);
    formData.append("appointmentId", selectedAppointment.appointmentId);

    try {
      await axios.post("https://credenhealth.onrender.com/api/admin/upload-prescription", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Prescription uploaded successfully!");
      setShowModal(false); // Close modal
    } catch (error) {
      console.error("Error uploading prescription:", error);
      alert("Failed to upload prescription.");
    }
  };

  // Render the modal
  const renderModal = () => {
    if (!showModal || !selectedAppointment) return null;

    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-md w-96">
          <h3 className="text-lg font-semibold mb-4">Upload Prescription for {selectedAppointment.patient_name}</h3>
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
      <h2 className="text-xl font-semibold mb-4">Accepted Appointments</h2>
      <div className="overflow-x-auto">
        <table className="w-full border rounded text-sm">
          <thead className="bg-green-100">
            <tr>
              <th className="p-2 border">Doctor</th>
              <th className="p-2 border">Specialization</th>
              <th className="p-2 border">Patient</th>
              <th className="p-2 border">Relation</th>
              <th className="p-2 border">Subtotal</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Add Prescription</th> {/* New column for prescription */}
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
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
                <td className="p-2 border capitalize">{appt.status}</td>
                <td className="p-2 border">{new Date(appt.appointment_date).toLocaleDateString()}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => {
                      setSelectedAppointment(appt); // Set the selected appointment
                      setShowModal(true); // Show the modal
                    }}
                    className="px-4 py-2 bg-blue-900 text-white rounded-md"
                  >
                    Add
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Render Modal */}
      {renderModal()}
    </div>
  );
};

export default AcceptedAppointmentsList;
