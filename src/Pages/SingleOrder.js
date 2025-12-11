import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiDownload } from "react-icons/fi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function SingleOrder() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://31.97.206.144:7021/api/admin/singleorder/${orderId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch order");
      setOrder(data.order);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const generatePDF = () => {
    if (!order) return;
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Invoice", 14, 20);

    // Customer Info
    doc.setFontSize(12);
    doc.text(`Order ID: ${order._id}`, 14, 30);
    doc.text(`Customer: ${order.userId?.name || "N/A"}`, 14, 36);
    doc.text(`Mobile: ${order.userId?.mobile || "N/A"}`, 14, 42);
    doc.text(`Email: ${order.userId?.email || "N/A"}`, 14, 48);

    // Delivery Address
    doc.text(
      `Address: ${order.deliveryAddress?.house || ""}, ${order.deliveryAddress?.street || ""}, ${order.deliveryAddress?.city || ""}, ${order.deliveryAddress?.state || ""} - ${order.deliveryAddress?.pincode || ""}, ${order.deliveryAddress?.country || ""}`,
      14,
      54,
      { maxWidth: 180 }
    );

    // Ordered Medicines Table
    const tableColumn = ["Medicine", "Pharmacy", "Price", "Qty", "Total"];
    const tableRows = [];
    order.orderItems?.forEach(item => {
      const row = [
        item.medicineId?.name || "N/A",
        item.medicineId?.pharmacyId?.name || "N/A",
        `₹${item.medicineId?.price || 0}`,
        item.quantity || 0,
        `₹${(item.medicineId?.price || 0) * (item.quantity || 1)}`
      ];
      tableRows.push(row);
    });

    autoTable(doc, {
      startY: 65,
      head: [tableColumn],
      body: tableRows,
    });

    let y = doc.lastAutoTable.finalY + 10;

    // Payment & Status
    doc.text(`Total Amount: ₹${order.orderItems?.reduce(
      (sum, item) => sum + (item.medicineId?.price || 0) * (item.quantity || 1),
      0
    )}`, 14, y);
    y += 6;
    doc.text(`Payment Method: ${order.paymentMethod || "N/A"}`, 14, y);
    y += 6;
    doc.text(`Status: ${order.status || "N/A"}`, 14, y);
    y += 6;
    doc.text(`Notes: ${order.notes || "No notes"}`, 14, y);

    // Status Timeline
    if (order.statusTimeline?.length) {
      y += 10;
      doc.text("Status Timeline:", 14, y);
      y += 6;
      order.statusTimeline.forEach((st, idx) => {
        doc.text(
          `${idx + 1}. ${st.status} - ${st.message} (${new Date(st.timestamp).toLocaleString()})`,
          14,
          y
        );
        y += 6;
      });
    }

    doc.save(`Invoice_${order._id}.pdf`);
  };

  if (loading) return <div className="p-6">Loading order details...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!order) return <div className="p-6">No order found.</div>;

  const totalPrice = order.orderItems?.reduce(
    (sum, item) => sum + (item.medicineId?.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      {/* Back + Download Button */}
      <div className="flex justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:underline"
        >
          <FiArrowLeft className="mr-1" /> Back
        </button>
        <button
          onClick={generatePDF}
          className="flex items-center text-green-600 hover:underline"
        >
          <FiDownload className="mr-1" /> Download Invoice
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-4">Order Details</h1>

      {/* Customer Info */}
      <div className="mb-6 border-b pb-4">
        <h2 className="font-semibold text-lg mb-2">Customer Info</h2>
        <div className="flex items-center gap-3">
          {order.userId?.profileImage && (
            <img
              src={order.userId.profileImage}
              alt={order.userId.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
          <div>
            <div className="font-bold">{order.userId?.name || "N/A"}</div>
            <div className="text-sm text-gray-500">{order.userId?.mobile || "N/A"}</div>
            <div className="text-sm text-gray-500">{order.userId?.email || "N/A"}</div>
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="mb-6 border-b pb-4">
        <h2 className="font-semibold text-lg mb-2">Delivery Address</h2>
        <p>
          {order.deliveryAddress?.house}, {order.deliveryAddress?.street},<br />
          {order.deliveryAddress?.city}, {order.deliveryAddress?.state} -{" "}
          {order.deliveryAddress?.pincode}, {order.deliveryAddress?.country}
        </p>
      </div>

      {/* Order Items */}
      <div className="mb-6 border-b pb-4">
        <h2 className="font-semibold text-lg mb-2">Ordered Medicines</h2>
        {order.orderItems?.map((item, idx) => (
          <div key={idx} className="border p-3 rounded mb-3">
            <div className="flex justify-between">
              <div>
                <div className="font-medium">{item.medicineId?.name}</div>
                <div className="text-sm text-gray-600">
                  ₹{item.medicineId?.price} × {item.quantity}
                </div>
                {item.medicineId?.description && (
                  <div className="text-xs text-gray-500">{item.medicineId.description}</div>
                )}
                {item.medicineId?.pharmacyId && (
                  <div className="text-xs text-gray-500 mt-1">
                    {item.medicineId.pharmacyId.name} —{" "}
                    {item.medicineId.pharmacyId.location?.coordinates?.join(", ")}
                  </div>
                )}
              </div>
              <div className="flex gap-1">
                {item.medicineId?.images?.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={item.medicineId?.name}
                    className="w-12 h-12 object-cover rounded border"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment & Notes */}
      <div className="mb-6 border-b pb-4">
        <h2 className="font-semibold text-lg mb-2">Payment & Notes</h2>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p><strong>Notes:</strong> {order.notes || "No notes"}</p>
        {order.voiceNoteUrl && (
          <div className="mt-2">
            <strong>Voice Note:</strong>
            <audio controls src={order.voiceNoteUrl} className="mt-1" />
          </div>
        )}
      </div>

      {/* Status Timeline */}
      <div className="mb-6 border-b pb-4">
        <h2 className="font-semibold text-lg mb-2">Status Timeline</h2>
        {order.statusTimeline?.map((status, i) => (
          <div key={i} className="text-sm mb-2">
            <span className="font-bold">{status.status}</span> - {status.message}
            <div className="text-gray-500">
              {new Date(status.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between font-bold text-lg">
          <span>Total Price:</span>
          <span>₹{totalPrice}</span>
        </div>
        <div className="mt-2">
          <span className="font-medium">Current Status:</span> {order.status}
        </div>
        <div>
          <span className="font-medium">Placed On:</span>{" "}
          {new Date(order.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
