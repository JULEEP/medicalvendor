import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const DiagnosticDetail = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [center, setCenter] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTestEditModal, setShowTestEditModal] = useState(false);
  const [showContactEditModal, setShowContactEditModal] = useState(false);
  const [editedContact, setEditedContact] = useState(null);
  const [editedTest, setEditedTest] = useState(null);

  useEffect(() => {
    const fetchCenterDetails = async () => {
      try {
        const response = await fetch(`https://credenhealth.onrender.com/api/admin/get-single/${id}`);
        const data = await response.json();
        setCenter(data.diagnostic); // Set the fetched data to state
      } catch (error) {
        console.error("Error fetching center details:", error);
      }
    };

    fetchCenterDetails();
  }, [id]); // Trigger fetch when `id` changes

  if (!center) {
    return <div>Loading...</div>;
  }

  const handleEditContact = (contact) => {
    setEditedContact(contact);
    setShowContactEditModal(true);
  };

  const handleEditTest = (test) => {
    setEditedTest(test);
    setShowTestEditModal(true);
  };

  const handleEditCenter = () => {
    setShowEditModal(true);
  };

  const handleDeleteContact = (contactIndex) => {
    // Perform the delete logic here
    const updatedContacts = center.contactPersons.filter((_, idx) => idx !== contactIndex);
    setCenter({ ...center, contactPersons: updatedContacts });
  };

  const handleDeleteTest = (testIndex) => {
    // Perform the delete logic here
    const updatedTests = center.tests.filter((_, idx) => idx !== testIndex);
    setCenter({ ...center, tests: updatedTests });
  };

  // Update the center details
  const handleSubmitEditCenter = (e) => {
    e.preventDefault();
    // Submit the updated center data (you can replace the URL with your actual endpoint)
    fetch(`https://credenhealth.onrender.com/api/admin/edit-center/${id}`, {
      method: "PUT",
      body: JSON.stringify(center),
      headers: { "Content-Type": "application/json" },
    })
      .then(() => {
        alert("Center updated successfully!");
        setShowEditModal(false);
      })
      .catch((err) => {
        console.error("Error updating center", err);
      });
  };

  // Update contact details
  const handleSubmitEditContact = (e) => {
    e.preventDefault();
    // Update contact person data logic here
    const updatedContacts = center.contactPersons.map((contact) =>
      contact.name === editedContact.name ? editedContact : contact
    );
    setCenter({ ...center, contactPersons: updatedContacts });
    setShowContactEditModal(false);
  };

  // Update test details
  const handleSubmitEditTest = (e) => {
    e.preventDefault();
    const updatedTests = center.tests.map((test) =>
      test.test_name === editedTest.test_name ? editedTest : test
    );
    setCenter({ ...center, tests: updatedTests });
    setShowTestEditModal(false);
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold">Diagnostic Center Details</h2>

      {/* Diagnostic Center Details */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full border rounded text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border text-left">Name</th>
              <th className="p-2 border text-left">Email</th>
              <th className="p-2 border text-left">Phone</th>
              <th className="p-2 border text-left">Address</th>
              <th className="p-2 border text-left">Center Type</th>
              <th className="p-2 border text-left">Country</th>
              <th className="p-2 border text-left">State</th>
              <th className="p-2 border text-left">City</th>
              <th className="p-2 border text-left">Pincode</th>
              <th className="p-2 border text-left">GST Number</th>
              <th className="p-2 border text-left">Center Strength</th>
              <th className="p-2 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border">{center.name}</td>
              <td className="p-2 border">{center.email}</td>
              <td className="p-2 border">{center.phone}</td>
              <td className="p-2 border">{center.address}</td>
              <td className="p-2 border">{center.centerType}</td>
              <td className="p-2 border">{center.country}</td>
              <td className="p-2 border">{center.state}</td>
              <td className="p-2 border">{center.city}</td>
              <td className="p-2 border">{center.pincode}</td>
              <td className="p-2 border">{center.gstNumber}</td>
              <td className="p-2 border">{center.centerStrength}</td>
              <td className="p-2 border">
                <button
                  onClick={handleEditCenter}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaEdit />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Contact Persons Table */}
      <h3 className="mt-6 text-lg font-semibold">Contact Persons</h3>
      <div className="overflow-x-auto mt-2">
        <table className="w-full border rounded text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border text-left">Name</th>
              <th className="p-2 border text-left">Designation</th>
              <th className="p-2 border text-left">Email</th>
              <th className="p-2 border text-left">Contact Number</th>
              <th className="p-2 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {center.contactPersons.map((contact, idx) => (
              <tr key={idx} className="hover:bg-gray-100 border-b">
                <td className="p-2 border">{contact.name}</td>
                <td className="p-2 border">{contact.designation}</td>
                <td className="p-2 border">{contact.contactEmail}</td>
                <td className="p-2 border">{contact.contactNumber}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleEditContact(contact)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteContact(idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash  className="ml-2"/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tests Table */}
      <h3 className="mt-6 text-lg font-semibold">Tests Offered</h3>
      <div className="overflow-x-auto mt-2">
        <table className="w-full border rounded text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border text-left">Test Name</th>
              <th className="p-2 border text-left">Description</th>
              <th className="p-2 border text-left">Price</th>
              <th className="p-2 border text-left">Offer Price</th>
              <th className="p-2 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {center.tests.map((test, idx) => (
              <tr key={idx} className="hover:bg-gray-100 border-b">
                <td className="p-2 border">{test.test_name}</td>
                <td className="p-2 border">{test.description}</td>
                <td className="p-2 border">{test.price}</td>
                <td className="p-2 border">{test.offerPrice}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleEditTest(test)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteTest(idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash  className="ml-2"/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Center Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-semibold">Edit Center</h3>
            <form onSubmit={handleSubmitEditCenter}>
              <label className="block mt-4">Name</label>
              <input
                type="text"
                className="w-full border px-3 py-2 mt-1 rounded"
                value={center.name}
                onChange={(e) => setCenter({ ...center, name: e.target.value })}
              />
              <button
                type="submit"
                className="bg-blue-500 text-white mt-4 py-2 px-4 rounded"
              >
                Save Changes
              </button>
              <button
                type="button"
                className="bg-gray-300 text-gray-700 mt-2 ml-4 py-2 px-4 rounded"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Contact Modal */}
      {showContactEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-semibold">Edit Contact Person</h3>
            <form onSubmit={handleSubmitEditContact}>
              <label className="block mt-4">Name</label>
              <input
                type="text"
                className="w-full border px-3 py-2 mt-1 rounded"
                value={editedContact.name}
                onChange={(e) => setEditedContact({ ...editedContact, name: e.target.value })}
              />
              <button
                type="submit"
                className="bg-blue-500 text-white mt-4 py-2 px-4 rounded"
              >
                Save Changes
              </button>
              <button
                type="button"
                className="bg-gray-300 text-gray-700 mt-2 ml-4 py-2 px-4 rounded"
                onClick={() => setShowContactEditModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

{/* Edit Test Modal */}
{showTestEditModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded shadow-md w-96">
      <h3 className="text-lg font-semibold">Edit Test</h3>
      <form onSubmit={handleSubmitEditTest}>
        {/* Test Name Field */}
        <label className="block mt-4">Test Name</label>
        <input
          type="text"
          className="w-full border px-3 py-2 mt-1 rounded"
          value={editedTest.test_name}
          onChange={(e) => setEditedTest({ ...editedTest, test_name: e.target.value })}
        />

        {/* Description Field */}
        <label className="block mt-4">Description</label>
        <textarea
          className="w-full border px-3 py-2 mt-1 rounded"
          value={editedTest.description}
          onChange={(e) => setEditedTest({ ...editedTest, description: e.target.value })}
        />

        {/* Price Field */}
        <label className="block mt-4">Price</label>
        <input
          type="number"
          className="w-full border px-3 py-2 mt-1 rounded"
          value={editedTest.price}
          onChange={(e) => setEditedTest({ ...editedTest, price: e.target.value })}
        />

        {/* Offer Price Field */}
        <label className="block mt-4">Offer Price</label>
        <input
          type="number"
          className="w-full border px-3 py-2 mt-1 rounded"
          value={editedTest.offerPrice}
          onChange={(e) => setEditedTest({ ...editedTest, offerPrice: e.target.value })}
        />

        {/* Save and Cancel Buttons */}
        <button
          type="submit"
          className="bg-blue-500 text-white mt-4 py-2 px-4 rounded"
        >
          Save Changes
        </button>
        <button
          type="button"
          className="bg-gray-300 text-gray-700 mt-2 py-2 px-4 ml-4 rounded"
          onClick={() => setShowTestEditModal(false)}
        >
          Cancel
        </button>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default DiagnosticDetail;
