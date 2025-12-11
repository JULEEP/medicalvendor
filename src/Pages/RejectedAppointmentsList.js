import React, { useEffect, useState } from "react";
import axios from "axios";

const RejectedAppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchRejectedAppointments();
  }, []);

  const fetchRejectedAppointments = async () => {
    try {
      const res = await axios.get("https://credenhealth.onrender.com/api/admin/rejectedappointments");
      if (res.data && res.data.appointments) {
        setAppointments(res.data.appointments);
      }
    } catch (error) {
      console.error("Failed to fetch rejected appointments:", error);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Rejected Appointments</h2>
      <div className="overflow-x-auto">
        <table className="w-full border rounded text-sm">
          <thead className="bg-red-100">
            <tr>
              <th className="p-2 border">Doctor</th>
              <th className="p-2 border">Specialization</th>
              <th className="p-2 border">Patient</th>
              <th className="p-2 border">Relation</th>
              <th className="p-2 border">Subtotal</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Date</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RejectedAppointmentsList;
