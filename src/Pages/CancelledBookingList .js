import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const CancelledBookingList = () => {
  // Dummy data for the cancelled bookings
  const cancelledBookings = [
    {
      id: 1,
      userName: "John Doe",
      productName: "Veg Pizza",
      quantity: 2,
      price: 300,
      totalPrice: 600,
      status: "Cancelled",
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
      status: "Cancelled",
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
      status: "Cancelled",
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
      status: "Cancelled",
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
      status: "Cancelled",
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

  // Function to generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Cancelled Booking List", 20, 20);

    // Table Data
    const tableData = cancelledBookings.map((booking) => [
      booking.userName,
      booking.productName,
      booking.quantity,
      `₹${booking.price}`,
      `₹${booking.totalPrice}`,
      booking.bookingDate,
      booking.deliveryDate,
      booking.status,
    ]);

    // Add table to PDF
    doc.autoTable({
      head: [
        [
          "User Name",
          "Product",
          "Quantity",
          "Price",
          "Total Price",
          "Booking Date",
          "Delivery Date",
          "Status",
        ],
      ],
      body: tableData,
      startY: 40, // Position of the table in the PDF
    });

    doc.save("Cancelled_Booking_List.pdf");
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h3 className="text-lg font-bold mb-4">Cancelled Order List</h3>
      <button
        onClick={generatePDF}
        className="bg-blue-500 text-white p-2 rounded mb-4"
      >
        Download PDF
      </button>
      <table className="min-w-full border-collapse">
        <thead className="bg-red-100">
          <tr className="border-b">
            <th className="p-4 text-left">User Name</th>
            <th className="p-4 text-left">Product</th>
            <th className="p-4 text-left">Quantity</th>
            <th className="p-4 text-left">Price</th>
            <th className="p-4 text-left">Total Price</th>
            <th className="p-4 text-left">Booking Date</th>
            <th className="p-4 text-left">Delivery Date</th>
            <th className="p-4 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {cancelledBookings.map((booking) => (
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CancelledBookingList;
