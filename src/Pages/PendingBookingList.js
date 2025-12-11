import React from "react";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const PendingBookingList = () => {
  // Dummy data for the pending bookings
  const pendingBookings = [
    {
      id: 1,
      userName: "John Doe",
      productName: "Veg Pizza",
      quantity: 2,
      price: 300,
      totalPrice: 600,
      status: "Pending",
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
      status: "Pending",
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
      status: "Pending",
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
      status: "Pending",
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
      status: "Pending",
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

  // Function to export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(pendingBookings); // No filtering now
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pending Bookings");
    XLSX.writeFile(wb, "PendingBookings.xlsx");
  };

  // Function to generate PDF invoice for a specific booking
  const generateInvoice = (booking) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Invoice", 20, 20);
    doc.setFontSize(12);
    doc.text(`Order ID: ${booking.id}`, 20, 30);
    doc.text(`User Name: ${booking.userName}`, 20, 40);
    doc.text(`Product: ${booking.productName}`, 20, 50);
    doc.text(`Quantity: ${booking.quantity}`, 20, 60);
    doc.text(`Price: ₹${booking.price}`, 20, 70);
    doc.text(`Total Price: ₹${booking.totalPrice}`, 20, 80);
    doc.text(`Booking Date: ${booking.bookingDate}`, 20, 90);
    doc.text(`Delivery Date: ${booking.deliveryDate}`, 20, 100);

    doc.autoTable({
      head: [["Item", "Price", "Quantity", "Total"]],
      body: [
        [
          booking.productName,
          `₹${booking.price}`,
          booking.quantity,
          `₹${booking.totalPrice}`,
        ],
      ],
      startY: 110,
    });

    doc.save(`Invoice_${booking.id}.pdf`);
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Pending Order List</h3>
        <div className="space-x-4">
          <button
            onClick={exportToExcel}
            className="text-green-500 hover:text-green-700 flex items-center"
          >
            <FaFileExcel className="mr-2" /> Export to Excel
          </button>
        </div>
      </div>
      <table className="min-w-full border-collapse">
        <thead className="bg-green-100">
          <tr className="border-b">
            <th className="p-4 text-left">User Name</th>
            <th className="p-4 text-left">Product</th>
            <th className="p-4 text-left">Quantity</th>
            <th className="p-4 text-left">Price</th>
            <th className="p-4 text-left">Total Price</th>
            <th className="p-4 text-left">Booking Date</th>
            <th className="p-4 text-left">Delivery Date</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Actions</th> {/* Added Actions Column */}
          </tr>
        </thead>
        <tbody>
          {pendingBookings.map((booking) => (
            <tr key={booking.id} className="border-b">
              <td className="p-4">{booking.userName}</td>
              <td className="p-4">{booking.productName}</td>
              <td className="p-4">{booking.quantity}</td>
              <td className="p-4">₹{booking.price}</td>
              <td className="p-4">₹{booking.totalPrice}</td>
              <td className="p-4">{booking.bookingDate}</td>
              <td className="p-4">{booking.deliveryDate}</td>
              <td className="p-4">
                <span
                  className={`inline-block py-1 px-3 rounded-full ${getStatusClass(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </span>
              </td>
              <td className="p-4 flex space-x-2">
                <button
                  onClick={() => generateInvoice(booking)} // Generate invoice for the specific booking
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaFilePdf /> {/* Generate PDF icon */}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingBookingList;
