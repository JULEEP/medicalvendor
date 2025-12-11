import React, { useState, useEffect } from "react";
import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function CreateVendorQuery() {
  const [vendorId, setVendorId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false); // Popup state
  const navigate = useNavigate();

  // Fetch vendorId from localStorage
  useEffect(() => {
    const storedVendorId = localStorage.getItem("vendorId");
    if (storedVendorId) {
      setVendorId(storedVendorId);
    } else {
      setError("Vendor ID not found in localStorage. Please login.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!name.trim() || !email.trim() || !mobile.trim() || !message.trim()) {
      setError("All fields are required.");
      return;
    }

    const queryData = {
      name,
      email,
      mobile,
      message,
      vendorId,
    };

    try {
      const response = await fetch(
        `http://31.97.206.144:7021/api/vendor/create-query/${vendorId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(queryData),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error creating query");

      setSuccessMessage(data.message || "Query submitted successfully");

      // Reset form fields
      setName("");
      setEmail("");
      setMobile("");
      setMessage("");

      // Show the success popup
      setShowPopup(true);

      // Optionally redirect to another page (e.g., vendor's dashboard)
      setTimeout(() => {
        navigate("/dashboard"); // Redirect after a delay (for popup display)
      }, 3000); // Adjust delay if needed (3 seconds)
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">Create Vendor Query</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow border"
      >
        {/* Name */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Mobile */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Mobile</label>
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Message */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="4"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-6 text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Submit Query
          </button>
        </div>
      </form>

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto text-center">
            <h3 className="text-xl font-semibold text-blue-700 mb-4">
              Your query has been successfully submitted!
            </h3>
            <p className="text-gray-600 mb-4">
              Our team will contact you shortly. Thank you for reaching out!
            </p>
            <button
              onClick={handlePopupClose}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
