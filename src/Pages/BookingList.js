import React from "react";
import { FaEye, FaEdit, FaTrashAlt, FaFileExcel, FaFilePdf } from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf"; // For PDF generation

const BookingList = () => {
  // Dummy booking data (Veg products only)
  const bookings = [
    {
      bookingId: 2,
      userName: "Jane Smith",
      userEmail: "jane.smith@example.com",
      userPhone: "+1987654321",
      bookingDate: "2025-04-18",
      productName: "Veg Pizza",
      quantity: 1,
      price: 400,
      totalAmount: 400,
      status: "Pending",
    },
    {
      bookingId: 3,
      userName: "Sarah Connor",
      userEmail: "sarah.connor@example.com",
      userPhone: "+1122334455",
      bookingDate: "2025-04-19",
      productName: "Spaghetti Aglio Olio",
      quantity: 3,
      price: 300,
      totalAmount: 900,
      status: "Delivered",
    },
    {
      bookingId: 5,
      userName: "Emily Stone",
      userEmail: "emily.stone@example.com",
      userPhone: "+1445566778",
      bookingDate: "2025-04-17",
      productName: "Chocolate Cake",
      quantity: 2,
      price: 180,
      totalAmount: 360,
      status: "Confirmed",
    },
  ];

  // Function to get the status class
  const getStatusClass = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-transparent border-2 border-green-500 text-green-500";
      case "Pending":
        return "bg-transparent border-2 border-yellow-500 text-yellow-500";
      case "Delivered":
        return "bg-transparent border-2 border-blue-500 text-blue-500";
      case "Cancelled":
        return "bg-transparent border-2 border-red-500 text-red-500";
      default:
        return "bg-transparent border-2 border-gray-500 text-gray-500";
    }
  };

  // Function to download the list as Excel
  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(bookings);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bookings");
    XLSX.writeFile(wb, "BookingList.xlsx");
  };

  // Function to generate PDF Invoice for each booking
  const generateInvoicePDF = (booking) => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "normal");
    doc.text("Invoice", 14, 20);
    doc.text(`Booking ID: ${booking.bookingId}`, 14, 30);
    doc.text(`Name: ${booking.userName}`, 14, 40);
    doc.text(`Email: ${booking.userEmail}`, 14, 50);
    doc.text(`Phone: ${booking.userPhone}`, 14, 60);
    doc.text(`Booking Date: ${booking.bookingDate}`, 14, 70);
    doc.text(`Product: ${booking.productName}`, 14, 80);
    doc.text(`Quantity: ${booking.quantity}`, 14, 90);
    doc.text(`Price: ₹${booking.price}`, 14, 100);
    doc.text(`Total Amount: ₹${booking.totalAmount}`, 14, 110);
    doc.text(`Status: ${booking.status}`, 14, 120);

    doc.save(`Invoice_${booking.bookingId}.pdf`);
  };

  return (
    <div className="p-6 bg-white rounded shadow ml-2">
      <h3 className="text-lg font-bold mb-4">Order List</h3>
      <div className="mb-4">
        <button
          onClick={downloadExcel}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
        >
          <FaFileExcel className="mr-2" />
          Download Excel
        </button>
      </div>

      {/* Add horizontal scroll wrapper here */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-green-100">
            <tr className="border-b">
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">User Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Booking Date</th>
              <th className="p-4 text-left">Product</th>
              <th className="p-4 text-left">Quantity</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Total Amount</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.bookingId} className="border-b">
                <td className="p-4">{booking.bookingId}</td>
                <td className="p-4">{booking.userName}</td>
                <td className="p-4">{booking.userEmail}</td>
                <td className="p-4">{booking.userPhone}</td>
                <td className="p-4">{booking.bookingDate}</td>
                <td className="p-4">{booking.productName}</td>
                <td className="p-4">{booking.quantity}</td>
                <td className="p-4">₹{booking.price}</td>
                <td className="p-4">₹{booking.totalAmount}</td>
                <td className="p-4">
                  <span
                    className={`px-4 py-2 rounded-full text-sm ${getStatusClass(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="p-4 flex space-x-2">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => generateInvoicePDF(booking)}
                  >
                    <FaFilePdf /> {/* PDF Invoice */}
                  </button>
                  <button className="text-blue-500 hover:text-blue-700">
                    <FaEye /> {/* View icon */}
                  </button>
                  <button className="text-yellow-500 hover:text-yellow-700">
                    <FaEdit /> {/* Edit icon */}
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <FaTrashAlt /> {/* Delete icon */}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingList;
