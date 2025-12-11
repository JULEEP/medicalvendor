import React, { useState } from "react";
import axios from "axios";

const CreateVendor = () => {
  const [vendorName, setVendorName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [address, setAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!vendorName || !email || !phone || !company || !address) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    const data = {
      vendorName,
      email,
      phone,
      company,
      address,
    };

    try {
      const response = await axios.post("https://your-backend-api.com/api/vendors/create", data);
      alert("Vendor created successfully!");
      console.log("Response:", response.data);

      // Reset form
      setVendorName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setAddress("");
      setErrorMessage("");
    } catch (error) {
      console.error("Error creating vendor:", error);
      setErrorMessage("Failed to create vendor. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded p-6">
      <h2 className="text-2xl font-semibold mb-4 text-blue-900">Create New Vendor</h2>

      {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className="w-full p-3 border rounded"
          placeholder="Vendor Name"
          value={vendorName}
          onChange={(e) => setVendorName(e.target.value)}
        />

        <input
          type="email"
          className="w-full p-3 border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="tel"
          className="w-full p-3 border rounded"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="text"
          className="w-full p-3 border rounded"
          placeholder="Company Name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

        <input
          type="text"
          className="w-full p-3 border rounded"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-900 text-white p-3 rounded hover:bg-blue-800 transition"
        >
          Create Vendor
        </button>
      </form>
    </div>
  );
};

export default CreateVendor;
