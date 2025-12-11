import React from "react";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf"; // For PDF generation

const CompletedBookingList = () => {
  // Dummy data for the completed bookings
  const completedBookings = [
    {
      id: 1,
      userName: "John Doe",
      productName: "Veg Pizza",
      quantity: 2,
      price: 300,
      totalPrice: 600,
      status: "Delivered",
      bookingDate: "2025-04-20",
      deliveryDate: "2025-04-22",
    },
    {
      id: 2,
      userName: "Jane Smith",
      productName: "Veg Pizza",
      quantity: 1,
      price: 450,
      totalPrice: 450,
      status: "Delivered",
      bookingDate: "2025-04-18",
      deliveryDate: "2025-04-20",
    },
    {
      id: 3,
      userName: "Emily Johnson",
      productName: "Spaghetti Aglio Olio",
      quantity: 3,
      price: 350,
      totalPrice: 1050,
      status: "Delivered",
      bookingDate: "2025-04-19",
      deliveryDate: "2025-04-21",
    },
    {
      id: 4,
      userName: "Michael Brown",
      productName: "Cheese Burger",
      quantity: 1,
      price: 250,
      totalPrice: 250,
      status: "Delivered",
      bookingDate: "2025-04-17",
      deliveryDate: "2025-04-19",
    },
    {
      id: 5,
      userName: "Sarah Davis",
      productName: "Chocolate Cake",
      quantity: 2,
      price: 200,
      totalPrice: 400,
      status: "Delivered",
      bookingDate: "2025-04-16",
      deliveryDate: "2025-04-18",
    },
  ];

  // Function to determine status class
  const getStatusClass = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-500 text-white";
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
    const ws = XLSX.utils.json_to_sheet(completedBookings);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Completed Bookings");
    XLSX.writeFile(wb, "CompletedBookingList.xlsx");
  };

  // Function to generate PDF Invoice for each completed booking
  const generateInvoicePDF = (booking) => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "normal");
    doc.text("Invoice", 14, 20);
    doc.text(`Booking ID: ${booking.id}`, 14, 30);
    doc.text(`Name: ${booking.userName}`, 14, 40);
    doc.text(`Product: ${booking.productName}`, 14, 50);
    doc.text(`Quantity: ${booking.quantity}`, 14, 60);
    doc.text(`Price: ₹${booking.price}`, 14, 70);
    doc.text(`Total Price: ₹${booking.totalPrice}`, 14, 80);
    doc.text(`Status: ${booking.status}`, 14, 90);
    doc.text(`Booking Date: ${booking.bookingDate}`, 14, 100);
    doc.text(`Delivery Date: ${booking.deliveryDate}`, 14, 110);

    doc.save(`Invoice_${booking.id}.pdf`);
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h3 className="text-lg font-bold mb-4">Completed Order List</h3>
      <div className="mb-4">
        <button
          onClick={downloadExcel}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
        >
          <FaFileExcel className="mr-2" />
          Download Excel
        </button>
      </div>
      <div className="mb-4">
        {/* You can add a button for downloading as PDF for all bookings, if needed */}
      </div>
      <table className="min-w-full border-collapse">
        <thead className="bg-blue-100">
          <tr className="border-b">
            <th className="p-4 text-left">User Name</th>
            <th className="p-4 text-left">Product</th>
            <th className="p-4 text-left">Quantity</th>
            <th className="p-4 text-left">Price</th>
            <th className="p-4 text-left">Total Price</th>
            <th className="p-4 text-left">Booking Date</th>
            <th className="p-4 text-left">Delivery Date</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {completedBookings.map((booking) => (
            <tr key={booking.id} className="border-b">
              <td className="p-4">{booking.userName}</td>
              <td className="p-4">{booking.productName}</td>
              <td className="p-4">{booking.quantity}</td>
              <td className="p-4">₹{booking.price}</td>
              <td className="p-4">₹{booking.totalPrice}</td>
              <td className="p-4">{booking.bookingDate}</td>
              <td className="p-4">{booking.deliveryDate}</td>
              <td className="p-4">
                <span className={`inline-block py-1 px-3 rounded-full ${getStatusClass(booking.status)}`}>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompletedBookingList;
