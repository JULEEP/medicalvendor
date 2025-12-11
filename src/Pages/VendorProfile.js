import React, { useEffect, useState } from "react";
import axios from "axios";

const VendorProfile = () => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [showBankModal, setShowBankModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isBankDetailsEditing, setIsBankDetailsEditing] = useState(false);
  const [editedVendor, setEditedVendor] = useState({});
  const [editedBankDetails, setEditedBankDetails] = useState({
    accountNumber: "",
    ifscCode: "",
    branchName: "",
    bankName: "",
    accountHolderName: "",
  });
  const [bankDetailId, setBankDetailId] = useState(null);

  useEffect(() => {
    const vendorId = localStorage.getItem("vendorId");

    if (!vendorId) {
      setError("Vendor ID is required.");
      setLoading(false);
      return;
    }

    const fetchVendorProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://31.97.206.144:7021/api/vendor/getvendorprofile/${vendorId}`
        );
        setVendor(res.data.vendor);
        setStatus(res.data.vendor.status);
        setEditedVendor(res.data.vendor);
        setEditedBankDetails(res.data.vendor.bankDetails?.[0] || {
          accountNumber: "",
          ifscCode: "",
          branchName: "",
          bankName: "",
          accountHolderName: "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch vendor profile");
      } finally {
        setLoading(false);
      }
    };

    fetchVendorProfile();
  }, []);

  const toggleStatus = async () => {
    try {
      const vendorId = localStorage.getItem("vendorId");
      const newStatus = status === "Active" ? "Inactive" : "Active";
      setStatus(newStatus);

      const res = await axios.put(
        `http://31.97.206.144:7021/api/vendor/updatestatus/${vendorId}`,
        { status: newStatus }
      );
      console.log(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
      setStatus(status === "Active" ? "Inactive" : "Active");
    }
  };

  const handleVendorProfileUpdate = async () => {
    try {
      const vendorId = localStorage.getItem("vendorId");
      const response = await axios.put(
        `http://31.97.206.144:7021/api/vendor/updatevendorprofile/${vendorId}`,
        editedVendor
      );
      setVendor(response.data.vendor);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleBankDetailSubmit = async () => {
    try {
      const vendorId = localStorage.getItem("vendorId");
      const response = await axios.post(
        `http://31.97.206.144:7021/api/vendor/addbankdetails/${vendorId}`,
        editedBankDetails
      );
      console.log("Bank details added: ", response.data);
      setShowBankModal(false);
      setVendor(response.data.vendor);
      setIsBankDetailsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add bank details");
    }
  };

  const handleBankDetailEdit = async () => {
    try {
      const vendorId = localStorage.getItem("vendorId");

      if (!bankDetailId) {
        setError("Bank detail ID is missing");
        return;
      }

      const response = await axios.put(
        `http://31.97.206.144:7021/api/vendor/editbankdetails/${vendorId}/${bankDetailId}`,
        editedBankDetails
      );
      
      console.log("Bank details updated: ", response.data);
      setVendor(response.data.vendor);
      setIsBankDetailsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update bank details");
    }
  };



  const handleFileChange = (e, field) => {
  const file = e.target.files[0]; // Get the selected file
  if (file) {
    // Create a FormData object to handle file upload (if needed)
    const formData = new FormData();
    formData.append("file", file);

    // Here you can implement your file upload logic, e.g., uploading to Cloudinary
    // or another cloud service. After successful upload, get the URL of the file.

    // For now, we'll simulate the file upload by setting a sample URL
    const fileUrl = URL.createObjectURL(file); // Local URL for preview

    // Update the state with the file URL
    setEditedVendor({
      ...editedVendor,
      [field]: fileUrl, // Dynamically update the respective field
    });
  }
};


  const resetBankDetailsForm = () => {
    setEditedBankDetails({
      accountNumber: "",
      ifscCode: "",
      branchName: "",
      bankName: "",
      accountHolderName: "",
    });
    setBankDetailId(null);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditedVendor(vendor);
  };

  const cancelBankEdit = () => {
    setIsBankDetailsEditing(false);
    setEditedBankDetails(vendor.bankDetails?.[0] || {
      accountNumber: "",
      ifscCode: "",
      branchName: "",
      bankName: "",
      accountHolderName: "",
    });
    setBankDetailId(null);
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-600">{error}</div>;
  if (!vendor) return <div className="text-center p-4">No vendor data available.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow-lg">
      {/* Header Section with Status and Actions */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vendor Profile</h1>
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-white ${
            status === "Active" ? "bg-green-500" : "bg-red-500"
          }`}>
            {status}
          </span>
          {/* <button
            onClick={toggleStatus}
            className={`px-4 py-2 rounded ${
              status === "Active" 
                ? "bg-red-500 hover:bg-red-600" 
                : "bg-green-500 hover:bg-green-600"
            } text-white`}
          >
            {status === "Active" ? "Deactivate" : "Activate"}
          </button> */}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded ${
            isEditing ? "bg-gray-500 hover:bg-gray-600" : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
        >
          {isEditing ? "Cancel Edit" : "Edit Profile"}
        </button>
        
        {(!vendor.bankDetails || vendor.bankDetails.length === 0) && !isBankDetailsEditing && (
          <button
            onClick={() => setShowBankModal(true)}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
          >
            Add Bank Details
          </button>
        )}
      </div>

<div className="mb-6">
  <h2 className="text-2xl font-semibold mb-4">Vendor Information</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Vendor Name */}
    <div className="border rounded-lg p-4">
      <label className="block font-semibold mb-2">Vendor Name</label>
      {isEditing ? (
        <input
          type="text"
          value={editedVendor.vendorName || ""}
          onChange={(e) =>
            setEditedVendor({ ...editedVendor, vendorName: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
      ) : (
        <p className="p-2">{vendor.vendorName}</p>
      )}
    </div>

    {/* Vendor Email */}
    <div className="border rounded-lg p-4">
      <label className="block font-semibold mb-2">Vendor Email</label>
      {isEditing ? (
        <input
          type="email"
          value={editedVendor.vendorEmail || ""}
          onChange={(e) =>
            setEditedVendor({ ...editedVendor, vendorEmail: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
      ) : (
        <p className="p-2">{vendor.vendorEmail}</p>
      )}
    </div>

    {/* Vendor Phone */}
    <div className="border rounded-lg p-4">
      <label className="block font-semibold mb-2">Vendor Phone</label>
      {isEditing ? (
        <input
          type="tel"
          value={editedVendor.vendorPhone || ""}
          onChange={(e) =>
            setEditedVendor({ ...editedVendor, vendorPhone: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
      ) : (
        <p className="p-2">{vendor.vendorPhone}</p>
      )}
    </div>

    {/* Pharmacy Name */}
    <div className="border rounded-lg p-4">
      <label className="block font-semibold mb-2">Pharmacy Name</label>
      {isEditing ? (
        <input
          type="text"
          value={editedVendor.name || ""}
          onChange={(e) => setEditedVendor({ ...editedVendor, name: e.target.value })}
          className="w-full p-2 border rounded"
        />
      ) : (
        <p className="p-2">{vendor.name}</p>
      )}
    </div>

    {/* Pharmacy Address */}
    <div className="border rounded-lg p-4 md:col-span-2">
      <label className="block font-semibold mb-2">Pharmacy Address</label>
      {isEditing ? (
        <textarea
          value={editedVendor.address || ""}
          onChange={(e) => setEditedVendor({ ...editedVendor, address: e.target.value })}
          className="w-full p-2 border rounded"
          rows="3"
        />
      ) : (
        <p className="p-2">{vendor.address}</p>
      )}
    </div>

    {/* Aadhar */}
    <div className="border rounded-lg p-4">
      <label className="block font-semibold mb-2">Aadhar</label>
      {isEditing ? (
        <input
          type="text"
          value={editedVendor.aadhar || ""}
          onChange={(e) =>
            setEditedVendor({ ...editedVendor, aadhar: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
      ) : (
        <p className="p-2">{vendor.aadhar}</p>
      )}
    </div>

    {/* PAN Card */}
    <div className="border rounded-lg p-4">
      <label className="block font-semibold mb-2">PAN Card</label>
      {isEditing ? (
        <input
          type="text"
          value={editedVendor.panCard || ""}
          onChange={(e) =>
            setEditedVendor({ ...editedVendor, panCard: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
      ) : (
        <p className="p-2">{vendor.panCard}</p>
      )}
    </div>

    {/* License */}
    <div className="border rounded-lg p-4">
      <label className="block font-semibold mb-2">License</label>
      {isEditing ? (
        <input
          type="text"
          value={editedVendor.license || ""}
          onChange={(e) =>
            setEditedVendor({ ...editedVendor, license: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
      ) : (
        <p className="p-2">{vendor.license}</p>
      )}
    </div>

    {/* Aadhar File */}
    <div className="border rounded-lg p-4">
      <label className="block font-semibold mb-2">Aadhar File</label>
      {isEditing ? (
        <input
          type="file"
          onChange={(e) => handleFileChange(e, 'aadharFile')}
          className="w-full p-2 border rounded"
        />
      ) : (
        <a
          href={vendor.aadharFile}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500"
        >
          View Aadhar File
        </a>
      )}
    </div>

    {/* PAN Card File */}
    <div className="border rounded-lg p-4">
      <label className="block font-semibold mb-2">PAN Card File</label>
      {isEditing ? (
        <input
          type="file"
          onChange={(e) => handleFileChange(e, 'panCardFile')}
          className="w-full p-2 border rounded"
        />
      ) : (
        <a
          href={vendor.panCardFile}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500"
        >
          View PAN Card File
        </a>
      )}
    </div>

    {/* License File */}
    <div className="border rounded-lg p-4">
      <label className="block font-semibold mb-2">License File</label>
      {isEditing ? (
        <input
          type="file"
          onChange={(e) => handleFileChange(e, 'licenseFile')}
          className="w-full p-2 border rounded"
        />
      ) : (
        <a
          href={vendor.licenseFile}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500"
        >
          View License File
        </a>
      )}
    </div>
  </div>


        {/* Save Button for Profile Edit */}
        {isEditing && (
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={handleVendorProfileUpdate}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
            >
              Save Changes
            </button>
            <button
              onClick={cancelEdit}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Bank Details Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Bank Details</h2>
          {vendor.bankDetails && vendor.bankDetails.length > 0 && !isBankDetailsEditing && (
            <button
              onClick={() => {
                setEditedBankDetails(vendor.bankDetails[0]);
                setBankDetailId(vendor.bankDetails[0]._id);
                setIsBankDetailsEditing(true);
              }}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
              Edit Bank Details
            </button>
          )}
        </div>

        {vendor.bankDetails && vendor.bankDetails.length > 0 ? (
          <div>
            {isBankDetailsEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-lg p-4">
                <div>
                  <label className="block font-semibold mb-2">Bank Name</label>
                  <input
                    type="text"
                    value={editedBankDetails.bankName || ""}
                    onChange={(e) =>
                      setEditedBankDetails({ ...editedBankDetails, bankName: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Account Number</label>
                  <input
                    type="text"
                    value={editedBankDetails.accountNumber || ""}
                    onChange={(e) =>
                      setEditedBankDetails({ ...editedBankDetails, accountNumber: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">IFSC Code</label>
                  <input
                    type="text"
                    value={editedBankDetails.ifscCode || ""}
                    onChange={(e) =>
                      setEditedBankDetails({ ...editedBankDetails, ifscCode: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Branch Name</label>
                  <input
                    type="text"
                    value={editedBankDetails.branchName || ""}
                    onChange={(e) =>
                      setEditedBankDetails({ ...editedBankDetails, branchName: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-semibold mb-2">Account Holder Name</label>
                  <input
                    type="text"
                    value={editedBankDetails.accountHolderName || ""}
                    onChange={(e) =>
                      setEditedBankDetails({ ...editedBankDetails, accountHolderName: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end space-x-2">
                  <button
                    onClick={handleBankDetailEdit}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
                  >
                    Save Bank Details
                  </button>
                  <button
                    onClick={cancelBankEdit}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-4">
                {vendor.bankDetails.map((bankDetail, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <strong>Bank Name:</strong> {bankDetail.bankName}
                    </div>
                    <div>
                      <strong>Account Number:</strong> {bankDetail.accountNumber}
                    </div>
                    <div>
                      <strong>IFSC Code:</strong> {bankDetail.ifscCode}
                    </div>
                    <div>
                      <strong>Branch Name:</strong> {bankDetail.branchName}
                    </div>
                    <div className="md:col-span-2">
                      <strong>Account Holder Name:</strong> {bankDetail.accountHolderName}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-4 border rounded-lg">
            <p className="text-gray-500 mb-4">No bank details added yet.</p>
            <button
              onClick={() => setShowBankModal(true)}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
            >
              Add Bank Details
            </button>
          </div>
        )}
      </div>

      {/* Modal to Add Bank Details */}
      {showBankModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Bank Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Bank Name</label>
                <input
                  type="text"
                  placeholder="Bank Name"
                  value={editedBankDetails.bankName}
                  onChange={(e) =>
                    setEditedBankDetails({ ...editedBankDetails, bankName: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Account Number</label>
                <input
                  type="text"
                  placeholder="Account Number"
                  value={editedBankDetails.accountNumber}
                  onChange={(e) =>
                    setEditedBankDetails({ ...editedBankDetails, accountNumber: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">IFSC Code</label>
                <input
                  type="text"
                  placeholder="IFSC Code"
                  value={editedBankDetails.ifscCode}
                  onChange={(e) =>
                    setEditedBankDetails({ ...editedBankDetails, ifscCode: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Branch Name</label>
                <input
                  type="text"
                  placeholder="Branch Name"
                  value={editedBankDetails.branchName}
                  onChange={(e) =>
                    setEditedBankDetails({ ...editedBankDetails, branchName: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Account Holder Name</label>
                <input
                  type="text"
                  placeholder="Account Holder Name"
                  value={editedBankDetails.accountHolderName}
                  onChange={(e) =>
                    setEditedBankDetails({ ...editedBankDetails, accountHolderName: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={handleBankDetailSubmit}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowBankModal(false);
                  resetBankDetailsForm();
                }}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorProfile;