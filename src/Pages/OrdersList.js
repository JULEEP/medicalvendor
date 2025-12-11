import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa"; // Icons for Edit and Delete

const OrdersList = () => {
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://31.97.206.144:7021/api/admin/getallorders");
        if (response.data && response.data.orders) {
          setOrdersData(response.data.orders);
        }
      } catch (err) {
        setError("Error fetching orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status); // Set the initial status
    setIsModalOpen(true); // Open the modal
  };

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value); // Update the status in the modal
  };

  const handleSaveStatus = async () => {
    if (selectedOrder) {
      try {
        // Update status in the backend
        await axios.put(`http://31.97.206.144:7021/api/admin/orderstatus/${selectedOrder._id}`, { status: newStatus });

        // Update the status in the local state
        setOrdersData((prevOrders) =>
          prevOrders.map((order) =>
            order._id === selectedOrder._id ? { ...order, status: newStatus } : order
          )
        );

        setIsModalOpen(false); // Close the modal
      } catch (err) {
        console.error("Error updating status", err);
      }
    }
  };

  const handleDelete = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axios.delete(`http://31.97.206.144:7021/api/admin/order/${orderId}`); // Call the delete API

        // Remove the order from the local state
        setOrdersData(ordersData.filter((order) => order._id !== orderId));
        alert("Order deleted successfully.");
      } catch (err) {
        console.error("Error deleting order", err);
      }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-blue-900 mb-6">User Orders</h2>

      {ordersData.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="p-2 border">Sl</th>
                <th className="p-2 border">User Name</th>
                <th className="p-2 border">User Email</th>
                <th className="p-2 border">Payment Method</th>
                <th className="p-2 border">Poster Name</th>
                <th className="p-2 border">Total Amount</th>
                <th className="p-2 border">Order Status</th>
                <th className="p-2 border">Order Date</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ordersData.map((order, index) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border">{order.userId.name}</td>
                  <td className="p-2 border">{order.userId.mobile}</td>
                  <td className="p-2 border">{order.paymentMethod}</td>
                  <td className="p-2 border">{order.orderItems[0]?.medicineId?.name}</td>
                  <td className="p-2 border">₹{order.totalAmount}</td>
                  <td className="p-2 border">{order.status}</td>
                  <td className="p-2 border">{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="p-2 border text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleEdit(order)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(order._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Editing Status */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-semibold">Edit Order Status</h2>
            <div className="my-4">
              <label className="block mb-2" htmlFor="status">Status</label>
              <select
                id="status"
                value={newStatus}
                onChange={handleStatusChange}
                className="p-2 border rounded w-full"
              >
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
                {/* Add more options if needed */}
              </select>
            </div>
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStatus}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersList;
