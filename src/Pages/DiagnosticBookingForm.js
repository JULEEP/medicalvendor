import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DiagnosticBookingForm = () => {
  const navigate = useNavigate();

  // State variables
  const [staffList, setStaffList] = useState([]);
  const [diagnosticsList, setDiagnosticsList] = useState([]); // Store diagnostics data
  const [testList, setTestList] = useState([]); // Store tests based on selected diagnostic
  const [selectedStaff, setSelectedStaff] = useState(""); // For staff ID
  const [staffName, setStaffName] = useState(""); // For staff Name
  const [selectedDiagnostic, setSelectedDiagnostic] = useState("");
  const [selectedTests, setSelectedTests] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");

  // Fetch diagnostics on component mount
  useEffect(() => {
    const fetchDiagnostics = async () => {
      try {
        const res = await fetch("https://credenhealth.onrender.com/api/admin/alldiagnostics");
        const data = await res.json();
        setDiagnosticsList(data.diagnostics || []); // Assuming the response structure is { diagnostics: [...] }
      } catch (err) {
        console.error("Error fetching diagnostics:", err);
      }
    };

    fetchDiagnostics();
  }, []);

  // Fetch tests based on selected diagnostic
  useEffect(() => {
    if (selectedDiagnostic) {
      const selectedDiagnosticData = diagnosticsList.find(diagnostic => diagnostic._id === selectedDiagnostic);
      if (selectedDiagnosticData) {
        setTestList(selectedDiagnosticData.tests || []);
      }
    } else {
      setTestList([]); // Clear tests if no diagnostic is selected
    }
  }, [selectedDiagnostic, diagnosticsList]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the diagnostic data to send to the backend
    const diagnosticData = {
      staffId: selectedStaff,
      name: staffName, // Send name if provided
      diagnosticId: selectedDiagnostic,
      tests: selectedTests,
      patient_name: patientName,
      appointment_date: appointmentDate,
      gender,
      age: parseInt(age),
    };

    // Log the data to check what is being sent to the backend
    console.log("Sending the following data to backend:", diagnosticData);

    try {
      // Assuming your API endpoint to create a booking is '/api/book-appointment'
      const response = await axios.post("https://credenhealth.onrender.com/api/booking/book-appointment", diagnosticData);
      alert(response.data.message);
      navigate("/appointments"); // Redirect to appointments page
    } catch (error) {
      console.error("Error booking diagnostic appointment:", error);
      alert("Diagnostic appointment booking failed.");
    }
  };

  // Handle test selection
  const handleTestChange = (e) => {
    const { value, checked } = e.target;
    setSelectedTests((prevSelectedTests) =>
      checked
        ? [...prevSelectedTests, value]
        : prevSelectedTests.filter((test) => test !== value)
    );
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h3 className="text-lg font-bold mb-4">Book Diagnostic Appointment</h3>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4 mb-4">
          {/* Staff Name Input or Select Staff by ID */}
          <div className="w-1/4">
            <label className="block text-sm mb-1">Staff Name</label>
            <input
              type="text"
              className="p-2 border rounded w-full"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              placeholder="Enter Staff Name (optional)"
            />
            <div className="mt-2">
              <label className="block text-sm mb-1">Or Select Staff (ID)</label>
              <select
                className="p-2 border rounded w-full"
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
              >
                <option value="">Select Staff</option>
                {staffList.map((staff) => (
                  <option key={staff._id} value={staff._id}>
                    {staff.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Diagnostic Name Dropdown */}
          <div className="w-1/4">
            <label className="block text-sm mb-1">Diagnostic</label>
            <select
              className="p-2 border rounded w-full"
              value={selectedDiagnostic}
              onChange={(e) => setSelectedDiagnostic(e.target.value)}
            >
              <option value="">Select Diagnostic</option>
              {diagnosticsList.map((diagnostic) => (
                <option key={diagnostic._id} value={diagnostic._id}>
                  {diagnostic.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Test Selection based on Diagnostic */}
        {selectedDiagnostic && (
          <div className="mb-4">
            <label className="block text-sm mb-1">Select Tests</label>
            <div className="flex flex-wrap gap-4">
              {testList.map((test) => (
                <div key={test._id} className="w-1/4">
                  <label className="block text-sm">
                    <input
                      type="checkbox"
                      value={test._id}
                      checked={selectedTests.includes(test._id)}
                      onChange={handleTestChange}
                      className="mr-2 checked:bg-purple-900"  // Add margin-right for spacing and custom color

                    />
                    {test.test_name} - {test.price} INR
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4 mb-4">
          {/* Patient Name Input */}
          <div className="w-1/4">
            <label className="block text-sm mb-1">Patient Name</label>
            <input
              type="text"
              className="p-2 border rounded w-full"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Enter Patient Name"
            />
          </div>

          {/* Patient Age Input */}
          <div className="w-1/4">
            <label className="block text-sm mb-1">Patient Age</label>
            <input
              type="number"
              className="p-2 border rounded w-full"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter Patient Age"
            />
          </div>

          {/* Patient Gender Input */}
          <div className="w-1/4">
          <label className="block text-sm mb-1">Patient Gender</label>
          <select
            className="p-2 border rounded w-full"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          {/* Appointment Date Input */}
          <div className="w-1/4">
            <label className="block text-sm mb-1">Appointment Date</label>
            <input
              type="date"
              className="p-2 border rounded w-full"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-4 py-2 text-red-700 bg-red-100 border border-red-600 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-blue-700 bg-blue-100 border border-blue-600 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default DiagnosticBookingForm;
