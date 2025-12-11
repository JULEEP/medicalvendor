import { useState } from "react";
import { utils, writeFile } from "xlsx";
import { FaEdit } from "react-icons/fa"; // Importing the Edit icon from react-icons

export default function AllPayments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [exportLimit, setExportLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const vendorsPerPage = 5; // Number of payments to show per page

  const payments = [
    {
      id: 1,
      vendorName: "Vendor One",
      amount: 30,
      couponAmount: 5,
      billAmount: 25,
      date: "2025-04-10",
      status: "Paid",
    },
    {
      id: 2,
      vendorName: "Vendor Two",
      amount: 15,
      couponAmount: 3,
      billAmount: 12,
      date: "2025-04-12",
      status: "Paid",
    },
    {
      id: 3,
      vendorName: "Vendor One",
      amount: 20,
      couponAmount: 4,
      billAmount: 16,
      date: "2025-05-01",
      status: "Paid",
    },
    {
      id: 4,
      vendorName: "Vendor Three",
      amount: 25,
      couponAmount: 5,
      billAmount: 20,
      date: "2025-05-05",
      status: "Pending",
    },
    {
      id: 5,
      vendorName: "Vendor Four",
      amount: 40,
      couponAmount: 10,
      billAmount: 30,
      date: "2025-05-07",
      status: "Paid",
    },
    // Add more payments if needed for testing pagination
  ];

  const filteredPayments = payments.filter(
    (payment) =>
      payment.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPayment = currentPage * vendorsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - vendorsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstPayment, indexOfLastPayment);
  const totalPages = Math.ceil(filteredPayments.length / vendorsPerPage);

  const exportCSV = () => {
    const exportData = filteredPayments
      .slice(0, exportLimit)
      .map(({ id, vendorName, amount, couponAmount, billAmount, date, status }) => ({
        ID: id,
        "Vendor Name": vendorName,
        Amount: amount,
        "Coupon Amount": couponAmount,
        "Bill Amount": billAmount,
        Date: date,
        Status: status,
      }));

    const ws = utils.json_to_sheet(exportData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "ReceivedPayments");
    writeFile(wb, `received_payments_${exportLimit}.csv`);
  };

  const handleDownloadInvoice = (id) => {
    alert(`Downloading invoice for payment ID: ${id}`);
    // Ideally, trigger invoice download logic here
  };

  const handleEditStatus = (id, currentStatus) => {
    setSelectedPaymentId(id);
    setNewStatus(currentStatus);
    setShowModal(true); // Show the modal
  };

  const handleSaveStatus = () => {
    const updatedPayments = payments.map((payment) =>
      payment.id === selectedPaymentId ? { ...payment, status: newStatus } : payment
    );
    // Update the payments array with the new status
    setShowModal(false);
    alert(`Status updated to ${newStatus} for payment ID: ${selectedPaymentId}`);
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-semibold text-blue-900 mb-4">All Payments</h2>

      <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by vendor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/3"
        />

        <div className="flex gap-4">
          <select
            value={exportLimit}
            onChange={(e) => setExportLimit(Number(e.target.value))}
            className="border p-2 rounded"
          >
            <option value={10}>Export 10</option>
            <option value={50}>Export 50</option>
            <option value={100}>Export 100</option>
            <option value={200}>Export 200</option>
          </select>

          <button
            onClick={exportCSV}
            className="bg-gray-300 px-4 py-2 rounded text-sm"
          >
            Download CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-2 border">Sl</th>
              <th className="p-2 border">Vendor Name</th>
              <th className="p-2 border">Amount ($)</th>
              <th className="p-2 border">Coupon Amount ($)</th>
              <th className="p-2 border">Bill Amount ($)</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPayments.map((payment, index) => (
              <tr key={payment.id}>
                <td className="p-2 border">{index + 1 + indexOfFirstPayment}</td>
                <td className="p-2 border">{payment.vendorName}</td>
                <td className="p-2 border">${payment.amount}</td>
                <td className="p-2 border">${payment.couponAmount}</td>
                <td className="p-2 border">${payment.billAmount}</td>
                <td className="p-2 border">{payment.date}</td>
                <td className="p-2 border">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      payment.status === "Paid"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-400 text-black"
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="p-2 border flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-4 py-1 rounded"
                    onClick={() => handleDownloadInvoice(payment.id)}
                  >
                    Download Invoice
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-4 py-1 rounded flex items-center"
                    onClick={() => handleEditStatus(payment.id, payment.status)}
                  >
                    <FaEdit className="mr-2" /> Edit Status
                  </button>
                </td>
              </tr>
            ))}
            {currentPayments.length === 0 && (
              <tr>
                <td className="p-2 border text-center" colSpan="8">
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Next
        </button>
      </div>

      {/* Modal for editing status */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">Edit Payment Status</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select Status</label>
              <select
                className="border p-2 rounded w-full"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStatus}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
