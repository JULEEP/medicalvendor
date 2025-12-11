import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEye, FaEdit, FaPlus } from 'react-icons/fa';

const PrescriptionsComponent = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [medicines, setMedicines] = useState([]);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // Create Order Modal States
  const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] = useState(false);
  const [orderFormData, setOrderFormData] = useState({
    prescriptionId: "",
    medicineDetails: [{
      medicineId: "",
      name: "",
      quantity: 1,
      mrp: 0,
      dosage: "",
      instructions: ""
    }],
    notes: "",
    paymentMethod: "Credit Card",
    paymentStatus: "Pending"
  });

  // Get vendorId from localStorage
  useEffect(() => {
    const storedVendorId = localStorage.getItem('vendorId');
    if (storedVendorId) {
      setVendorId(storedVendorId);
    } else {
      setError("Vendor ID not found in localStorage");
      setLoading(false);
    }
  }, []);

  // Fetch prescriptions when vendorId is available
  useEffect(() => {
    if (vendorId) {
      fetchPrescriptions();
    }
  }, [vendorId]);

  // Fetch prescriptions function
  const fetchPrescriptions = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`http://31.97.206.144:7021/api/vendor/getprescriptions/${vendorId}`);
      console.log("Prescriptions API Response:", response.data);
      
      if (response.data && response.data.prescriptions) {
        setPrescriptions(response.data.prescriptions);
      } else {
        setError("No prescriptions found.");
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  // Fetch medicines function
  const fetchMedicines = async () => {
    try {
      const response = await axios.get(`http://31.97.206.144:7021/api/vendor/medicines/${vendorId}`);
      console.log("Medicines API Response:", response.data);
      
      if (response.data.medicines && Array.isArray(response.data.medicines)) {
        setMedicines(response.data.medicines);
      } else {
        console.log("No medicines found");
        setMedicines([]);
      }
    } catch (err) {
      console.error("Error fetching medicines:", err);
      setMedicines([]);
    }
  };

  // ✅ FIXED: Status change function
  const handleStatusChange = async () => {
    if (!selectedPrescription || !newStatus) {
      alert("Please select a status");
      return;
    }

    try {
      console.log("Updating status for:", selectedPrescription.prescriptionId);
      console.log("New status:", newStatus);

      const response = await axios.patch(
        `http://31.97.206.144:7021/api/vendor/updatePrescriptionStatus/${selectedPrescription.prescriptionId}`,
        { status: newStatus }
      );

      console.log("Status update response:", response.data);

      // ✅ FIXED: Check if response is successful
      if (response.data && (response.data.success || response.data.message)) {
        // ✅ Update local state
        const updatedPrescriptions = prescriptions.map(prescription => 
          prescription.prescriptionId === selectedPrescription.prescriptionId 
            ? { ...prescription, status: newStatus }
            : prescription
        );
        
        setPrescriptions(updatedPrescriptions);
        
        // ✅ Show success message
        alert("✅ Status updated successfully!");
        
        // ✅ Close modal
        closeModal();
        
      } else {
        alert("❌ Failed to update status");
      }
    } catch (err) {
      console.error("Status update error:", err);
      alert("❌ Error updating status: " + (err.response?.data?.message || err.message));
    }
  };

  // Open status modal
  const openModal = (prescription) => {
    setSelectedPrescription(prescription);
    setNewStatus(prescription.status || "Pending");
    setIsModalOpen(true);
  };

  // Close status modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPrescription(null);
    setNewStatus("");
  };

  // Open Create Order Modal
  const openCreateOrderModal = async (prescription) => {
    await fetchMedicines();
    setOrderFormData({
      prescriptionId: prescription.prescriptionId,
      medicineDetails: [{
        medicineId: "",
        name: "",
        quantity: 1,
        mrp: 0,
        dosage: "",
        instructions: ""
      }],
      notes: "",
      paymentMethod: "Credit Card",
      paymentStatus: "Pending"
    });
    setSelectedPrescription(prescription);
    setIsCreateOrderModalOpen(true);
  };

  // Close Create Order Modal
  const closeCreateOrderModal = () => {
    setIsCreateOrderModalOpen(false);
    setSelectedPrescription(null);
    setOrderFormData({
      prescriptionId: "",
      medicineDetails: [{
        medicineId: "",
        name: "",
        quantity: 1,
        mrp: 0,
        dosage: "",
        instructions: ""
      }],
      notes: "",
      paymentMethod: "Credit Card",
      paymentStatus: "Pending"
    });
  };

  // Handle medicine selection change
  const handleMedicineChange = (index, field, value) => {
    const updatedMedicineDetails = [...orderFormData.medicineDetails];
    
    if (field === 'medicineId') {
      const selectedMedicine = medicines.find(med => med._id === value);
      
      if (selectedMedicine) {
        updatedMedicineDetails[index] = {
          ...updatedMedicineDetails[index],
          medicineId: selectedMedicine._id,
          name: selectedMedicine.name,
          mrp: selectedMedicine.mrp || selectedMedicine.price || 0
        };
      } else {
        updatedMedicineDetails[index] = {
          ...updatedMedicineDetails[index],
          medicineId: value,
          name: "",
          mrp: 0
        };
      }
    } else {
      updatedMedicineDetails[index] = {
        ...updatedMedicineDetails[index],
        [field]: value
      };
    }
    
    setOrderFormData({
      ...orderFormData,
      medicineDetails: updatedMedicineDetails
    });
  };

  // Add new medicine field
  const addMedicineField = () => {
    setOrderFormData({
      ...orderFormData,
      medicineDetails: [
        ...orderFormData.medicineDetails,
        {
          medicineId: "",
          name: "",
          quantity: 1,
          mrp: 0,
          dosage: "",
          instructions: ""
        }
      ]
    });
  };

  // Remove medicine field
  const removeMedicineField = (index) => {
    if (orderFormData.medicineDetails.length > 1) {
      const updatedMedicineDetails = orderFormData.medicineDetails.filter((_, i) => i !== index);
      setOrderFormData({
        ...orderFormData,
        medicineDetails: updatedMedicineDetails
      });
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderFormData({
      ...orderFormData,
      [name]: value
    });
  };

  // Create Order Function
  const handleCreateOrder = async () => {
    try {
      const isValidMedicineDetails = orderFormData.medicineDetails.every(med => 
        med.medicineId && med.quantity > 0
      );

      if (!isValidMedicineDetails) {
        setError("Please fill all medicine details correctly");
        return;
      }

      const payload = {
        prescriptionId: orderFormData.prescriptionId,
        medicineDetails: orderFormData.medicineDetails,
        notes: orderFormData.notes,
        paymentMethod: orderFormData.paymentMethod,
        paymentStatus: orderFormData.paymentStatus
      };

      console.log("Creating order with payload:", payload);

      const response = await axios.post(
        `http://31.97.206.144:7021/api/vendor/createOrderFromPrescription/${vendorId}/${selectedPrescription.userId.userid || selectedPrescription.userId._id || selectedPrescription.userId}`,
        payload
      );

      if (response.status === 201) {
        alert("Order created successfully!");
        closeCreateOrderModal();
        // Refresh prescriptions to show updated status
        fetchPrescriptions();
      } else {
        setError(response.data.message || "Failed to create order");
      }
    } catch (err) {
      setError("Error creating order: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading prescriptions...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Prescriptions from Users:</h2>

      {error && (
        <div className="text-center text-red-600 py-4 mb-4 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Prescription ID</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">User Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Prescription URL</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Uploaded On</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500 text-lg">
                  No prescriptions available
                </td>
              </tr>
            ) : (
              prescriptions.map((prescription) => (
                <tr key={prescription.prescriptionId} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-600">{prescription.prescriptionId}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{prescription.userId?.name || "Unknown"}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    <a
                      href={prescription.prescriptionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Prescription
                    </a>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {new Date(prescription.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      prescription.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      prescription.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {prescription.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <a
                      href={prescription.prescriptionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 inline-block mx-1"
                      title="View Prescription"
                    >
                      <FaEye size={16} />
                    </a>
                    <button
                      onClick={() => openModal(prescription)}
                      className="text-yellow-600 hover:text-yellow-800 mx-1"
                      title="Edit Status"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => openCreateOrderModal(prescription)}
                      className="text-green-600 hover:text-green-800 mx-1"
                      title="Create Order"
                    >
                      <FaPlus size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Status Update Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">Update Prescription Status</h3>
            <p className="text-sm text-gray-600 mb-2">
              Prescription ID: <strong>{selectedPrescription?.prescriptionId}</strong>
            </p>
            <div className="mb-4">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Select Status
              </label>
              <select
                id="status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusChange}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Order Modal */}
      {isCreateOrderModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Create Order from Prescription</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Medicine Details</label>
              {orderFormData.medicineDetails.map((medicine, index) => (
                <div key={index} className="border p-4 rounded-md mb-3 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Medicine</label>
                      <select
                        value={medicine.medicineId}
                        onChange={(e) => handleMedicineChange(index, 'medicineId', e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="">Select Medicine</option>
                        {medicines.map((med) => (
                          <option key={med._id} value={med._id}>
                            {med.name || `Medicine (${med._id})`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Quantity</label>
                      <input
                        type="number"
                        value={medicine.quantity}
                        onChange={(e) => handleMedicineChange(index, 'quantity', parseInt(e.target.value))}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">MRP (₹)</label>
                      <input
                        type="number"
                        value={medicine.mrp}
                        onChange={(e) => handleMedicineChange(index, 'mrp', parseFloat(e.target.value))}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        step="0.01"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Dosage</label>
                      <input
                        type="text"
                        value={medicine.dosage}
                        onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        placeholder="e.g., 500mg"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700">Instructions</label>
                    <input
                      type="text"
                      value={medicine.instructions}
                      onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      placeholder="e.g., Take twice a day"
                    />
                  </div>

                  {orderFormData.medicineDetails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedicineField(index)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Remove Medicine
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addMedicineField}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Add Another Medicine
              </button>
            </div>

            <div className="mb-4">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={orderFormData.notes}
                onChange={handleInputChange}
                rows="3"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                placeholder="Additional notes for the order..."
              />
            </div>

            <div className="mb-4">
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">Payment Method</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={orderFormData.paymentMethod}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="UPI">UPI</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="Net Banking">Net Banking</option>
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700">Payment Status</label>
              <select
                id="paymentStatus"
                name="paymentStatus"
                value={orderFormData.paymentStatus}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            <div className="flex justify-between">
              <button
                onClick={closeCreateOrderModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrder}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Create Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionsComponent;