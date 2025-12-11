import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx"; // Import the XLSX library
import { FaDownload } from "react-icons/fa"; // Importing the download icon

const StaffHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [diagnosticBookings, setDiagnosticBookings] = useState([]);
  const [walletHistory, setWalletHistory] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [loadingDiagnostics, setLoadingDiagnostics] = useState(false);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [currentDiagnosticPage, setCurrentDiagnosticPage] = useState(1);
  const [diagnosticsPerPage] = useState(5);
  const [currentWalletPage, setCurrentWalletPage] = useState(1);
  const [walletPerPage] = useState(5);

  const staffId = "67f7614ed43c1818f3943c5a"; // Static staffId

  useEffect(() => {
    if (!staffId) return;

    setLoadingAppointments(true);
    axios
      .get(`https://credenhealth.onrender.com/api/staff/getdoctorappointment/${staffId}`)
      .then((res) => {
        if (res.data.appointments) setAppointments(res.data.appointments);
      })
      .catch((err) => {
        console.error("Error fetching appointments:", err);
        alert("Failed to load appointments.");
      })
      .finally(() => setLoadingAppointments(false));
  }, [staffId]);

  useEffect(() => {
    if (!staffId) return;

    setLoadingDiagnostics(true);
    axios
      .get(`https://credenhealth.onrender.com/api/staff/getalldiagbookings/${staffId}`)
      .then((res) => {
        if (res.data.bookings) setDiagnosticBookings(res.data.bookings);
      })
      .catch((err) => {
        console.error("Error fetching diagnostics:", err);
        alert("Failed to load diagnostic bookings.");
      })
      .finally(() => setLoadingDiagnostics(false));
  }, [staffId]);

  useEffect(() => {
    if (!staffId) return;

    setLoadingWallet(true);
    axios
      .get(`https://credenhealth.onrender.com/api/staff/wallet/${staffId}`)
      .then((res) => {
        setWalletBalance(res.data.wallet_balance || 0);
        setWalletHistory(res.data.transaction_history || []);
      })
      .catch((err) => {
        console.error("Error fetching wallet history:", err);
        alert("Failed to load wallet history.");
      })
      .finally(() => setLoadingWallet(false));
  }, [staffId]);

  // Pagination logic
  const currentDiagnosticBookings = diagnosticBookings.slice(
    (currentDiagnosticPage - 1) * diagnosticsPerPage,
    currentDiagnosticPage * diagnosticsPerPage
  );

  const currentWalletTransactions = walletHistory.slice(
    (currentWalletPage - 1) * walletPerPage,
    currentWalletPage * walletPerPage
  );

  // Function to export data to Excel
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // Export Appointments
    const appointmentsData = appointments.map((appointment) => ({
      "Doctor Name": appointment.doctor_name,
      "Specialization": appointment.doctor_specialization,
      "Appointment Date": new Date(appointment.appointment_date).toLocaleString(),
      "Status": appointment.status,
      "Patient Name": appointment.patient_name,
      "Subtotal": `₹${appointment.subtotal}`,
      "Total": `₹${appointment.total}`,
    }));
    const appointmentsSheet = XLSX.utils.json_to_sheet(appointmentsData);
    XLSX.utils.book_append_sheet(wb, appointmentsSheet, "Appointments");

    // Export Diagnostic Bookings
    const diagnosticData = diagnosticBookings.map((booking) => ({
      "Booking ID": booking.bookingId,
      "Patient Name": booking.patient_name,
      "Diagnostic Name": booking.diagnostic_name || "N/A",
      "Appointment Date": new Date(booking.appointment_date).toLocaleString(),
      "Status": booking.status,
      "Subtotal": `₹${booking.subtotal}`,
      "Total": `₹${booking.total}`,
    }));
    const diagnosticSheet = XLSX.utils.json_to_sheet(diagnosticData);
    XLSX.utils.book_append_sheet(wb, diagnosticSheet, "Diagnostics");

    // Export Wallet History
    const walletData = walletHistory.map((txn) => ({
      "Type": txn.type,
      "Amount": `₹${txn.amount}`,
      "Description": txn.description,
      "Time Ago": txn.time_ago,
      "Date": new Date(txn.date).toLocaleString(),
    }));
    const walletSheet = XLSX.utils.json_to_sheet(walletData);
    XLSX.utils.book_append_sheet(wb, walletSheet, "Wallet");

    // Write to Excel file
    XLSX.writeFile(wb, "Staff_History.xlsx");
  };

  return (
    <div className="p-4 bg-white rounded shadow">
    <div className="flex justify-between items-center mb-4">
  {/* Content on the left */}
  
 {/* Excel export button on the right */}
 <button
 onClick={exportToExcel}
 className="px-4 py-2 bg-purple-900 text-white rounded-md hover:bg-green-600 ml-auto flex items-center space-x-2"
>
 {/* Download Icon */}
 <FaDownload />
 <span>Export to Excel</span>
</button>
</div>


      {/* Wallet Section */}
      <div className="mb-6">
        {loadingWallet ? (
          <div className="text-center text-lg">Loading Wallet...</div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Wallet Balance: ₹{walletBalance}
            </h3>
            <h4 className="text-md font-semibold mb-2 text-purple-900">Transaction History</h4>
            <div className="overflow-y-auto max-h-[400px]">
              <table className="w-full border rounded text-sm mb-6">
                <thead className="bg-purple-100">
                  <tr>
                    <th className="p-2 border">Type</th>
                    <th className="p-2 border">Amount</th>
                    <th className="p-2 border">Description</th>
                    <th className="p-2 border">Time Ago</th>
                    <th className="p-2 border">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {currentWalletTransactions.map((txn, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="p-2 border capitalize">{txn.type}</td>
                      <td className="p-2 border">₹{txn.amount}</td>
                      <td className="p-2 border">{txn.description}</td>
                      <td className="p-2 border">{txn.time_ago}</td>
                      <td className="p-2 border">
                        {new Date(txn.date).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Wallet Pagination */}
              <div className="flex justify-center space-x-2 mt-4">
                {Array.from({ length: Math.ceil(walletHistory.length / walletPerPage) }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentWalletPage(i + 1)}
                    className={`px-4 py-2 rounded-lg ${
                      currentWalletPage === i + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Appointments Section */}
      {loadingAppointments ? (
        <div className="text-center text-lg">Loading Appointments...</div>
      ) : (
        <div className="overflow-y-auto max-h-[400px]">
        <h2 className="text-xl font-semibold text-purple-900">Staff Appointment History</h2>
          <table className="w-full border rounded text-sm mb-6 mt-4">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-2 border">Doctor Name</th>
                <th className="p-2 border">Specialization</th>
                <th className="p-2 border">Appointment Date</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Patient Name</th>
                <th className="p-2 border">Subtotal</th>
                <th className="p-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.appointmentId} className="hover:bg-gray-100">
                  <td className="p-2 border">{appointment.doctor_name}</td>
                  <td className="p-2 border">{appointment.doctor_specialization}</td>
                  <td className="p-2 border">
                    {new Date(appointment.appointment_date).toLocaleString()}
                  </td>
                  <td className="p-2 border">{appointment.status}</td>
                  <td className="p-2 border">{appointment.patient_name}</td>
                  <td className="p-2 border">₹{appointment.subtotal}</td>
                  <td className="p-2 border">₹{appointment.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Diagnostic Bookings Section */}
      {loadingDiagnostics ? (
        <div className="text-center text-lg">Loading Diagnostic Bookings...</div>
      ) : (
        <div className="overflow-y-auto max-h-[400px]">
          <h2 className="text-xl font-semibold mb-4 text-purple-900">
            Staff Diagnostic Bookings
          </h2>
          <table className="w-full border rounded text-sm mb-6">
            <thead className="bg-pink-100">
              <tr>
                <th className="p-2 border">Booking ID</th>
                <th className="p-2 border">Patient Name</th>
                <th className="p-2 border">Diagnostic Name</th>
                <th className="p-2 border">Appointment Date</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Subtotal</th>
                <th className="p-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {currentDiagnosticBookings.map((booking) => (
                <tr key={booking.bookingId} className="hover:bg-gray-100">
                  <td className="p-2 border">{booking.bookingId}</td>
                  <td className="p-2 border">{booking.patient_name}</td>
                  <td className="p-2 border">{booking.diagnostic_name || "N/A"}</td>
                  <td className="p-2 border">
                    {new Date(booking.appointment_date).toLocaleString()}
                  </td>
                  <td className="p-2 border">{booking.status}</td>
                  <td className="p-2 border">₹{booking.subtotal}</td>
                  <td className="p-2 border">₹{booking.total}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Diagnostic Pagination */}
          <div className="flex justify-center space-x-2 mt-4">
            {Array.from({ length: Math.ceil(diagnosticBookings.length / diagnosticsPerPage) }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentDiagnosticPage(i + 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentDiagnosticPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffHistory;
