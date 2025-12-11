import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AppointmentBookingForm = () => {
  const navigate = useNavigate();

  // State variables
  const [staffList, setStaffList] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientRelation, setPatientRelation] = useState("");
  const [doctorSchedule, setDoctorSchedule] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);  // To hold the response data for display

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorResponse = await axios.get("https://credenhealth.onrender.com/api/admin/getdoctors");
        setDoctorList(doctorResponse.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchData();
  }, []);

  // Handle doctor selection
  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    setSelectedDoctor(doctorId);

    // Find the selected doctor's schedule
    const doctor = doctorList.find((doc) => doc._id === doctorId);
    if (doctor) {
      setDoctorSchedule(doctor.schedule);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const appointmentData = {
      staffId: '',  // leave this empty
      name: selectedStaff,  // send staff name from the input
      doctorId: selectedDoctor,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      patient_name: patientName,
      patient_relation: patientRelation,
    };
    

    try {
      const response = await axios.post("https://credenhealth.onrender.com/api/staff/bookappoint", appointmentData);
      alert(response.data.message);
      setSubmittedData(response.data.appointment);  // Save response data to show confirmation
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Appointment booking failed.");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h3 className="text-lg font-bold mb-4">Book Appointment</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Staff Name Input */}
          <div className="w-full">
            <label className="block text-sm font-medium mb-1">Staff Name</label>
            <input
              type="text"
              className="p-3 border rounded w-full"
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              placeholder="Enter staff name"
            />
          </div>

          {/* Doctor Dropdown */}
          <div className="w-full">
            <label className="block text-sm font-medium mb-1">Select Doctor</label>
            <select
              className="p-3 border rounded w-full"
              value={selectedDoctor}
              onChange={handleDoctorChange}
            >
              <option value="">Select Doctor</option>
              {doctorList.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Display Doctor Schedule */}
        {doctorSchedule && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold mb-2">Doctor's Schedule</h4>
            <ul className="list-disc pl-5">
              {doctorSchedule.map((slot) => (
                <li key={slot._id} className="text-sm">
                  {slot.day}: {slot.startTime} - {slot.endTime}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {/* Appointment Date Input */}
          <div className="w-full">
            <label className="block text-sm font-medium mb-1">Appointment Date</label>
            <input
              type="date"
              className="p-3 border rounded w-full"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
            />
          </div>

          {/* Appointment Time Input */}
          <div className="w-full">
            <label className="block text-sm font-medium mb-1">Appointment Time</label>
            <input
              type="time"
              className="p-3 border rounded w-full"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
            />
          </div>

          {/* Patient Name Input */}
          <div className="w-full">
            <label className="block text-sm font-medium mb-1">Patient Name</label>
            <input
              type="text"
              className="p-3 border rounded w-full"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />
          </div>

          {/* Patient Relation Input */}
          <div className="w-full">
            <label className="block text-sm font-medium mb-1">Patient Relation</label>
            <input
              type="text"
              className="p-3 border rounded w-full"
              value={patientRelation}
              onChange={(e) => setPatientRelation(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-6 py-3 text-red-700 bg-red-100 border border-red-600 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 text-blue-700 bg-blue-100 border border-blue-600 rounded"
          >
            Submit
          </button>
        </div>
      </form>

      {/* Show Confirmation of Appointment */}
      {submittedData && (
        <div className="mt-6 p-4 border border-green-400 bg-green-50 rounded">
          <h4 className="text-lg font-bold">Appointment Booked Successfully</h4>
          <p><strong>Doctor:</strong> {submittedData.doctor_name}</p>
          <p><strong>Patient:</strong> {submittedData.patient_name} ({submittedData.patient_relation})</p>
          <p><strong>Appointment Date:</strong> {new Date(submittedData.appointment_date).toLocaleString()}</p>
          <p><strong>Status:</strong> {submittedData.status}</p>
          <p><strong>Subtotal:</strong> ${submittedData.subtotal}</p>
          <p><strong>Total:</strong> ${submittedData.total}</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentBookingForm;
