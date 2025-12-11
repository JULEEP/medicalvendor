import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DiagnostiCreate = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null); // for image upload
  const [centerType, setCenterType] = useState(""); // Center Type (Diagnostic, Hospital, Clinic)
  const [methodology, setMethodology] = useState(""); // Methodology/Radiology
  const [pathologyAccredited, setPathologyAccredited] = useState(""); // Pathology - NABL Accredited
  const [gstNumber, setGstNumber] = useState("");
  const [centerStrength, setCenterStrength] = useState("");
  const [location, setLocation] = useState(""); // Location (Address)
  const [country, setCountry] = useState(""); // Country
  const [state, setState] = useState(""); // State
  const [city, setCity] = useState(""); // City
  const [pincode, setPincode] = useState(""); // Pincode
  const [tests, setTests] = useState([{ test_name: "", description: "", price: "", offerPrice: "", image: null }]);

  // Contact person fields
  const [contactPersons, setContactPersons] = useState([{ name: "", designation: "", gender: "", contactEmail: "", contactNumber: "" }]);

  const handleAddTest = () => {
    setTests([...tests, { test_name: "", description: "", price: "", offerPrice: "", image: null }]);
  };

  const handleTestChange = (index, field, value) => {
    const updated = [...tests];
    updated[index][field] = value;
    setTests(updated);
  };

  const handleImageChange = (index, event) => {
    const file = event.target.files[0];
    const updated = [...tests];
    updated[index].image = file;
    setTests(updated);
  };

  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...contactPersons];
    updatedContacts[index][field] = value;
    setContactPersons(updatedContacts);
  };

  const handleAddContactPerson = () => {
    setContactPersons([...contactPersons, { name: "", designation: "", gender: "", contactEmail: "", contactNumber: "" }]);
  };

  const createCenter = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    
    // Append the form fields to FormData
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("centerType", centerType);
    formData.append("methodology", methodology);
    formData.append("pathologyAccredited", pathologyAccredited);
    formData.append("gstNumber", gstNumber);
    formData.append("centerStrength", centerStrength);
    formData.append("location", location);
    formData.append("country", country);
    formData.append("state", state);
    formData.append("city", city);
    formData.append("pincode", pincode);
    
    // Add image if available
    if (image) {
      formData.append("image", image);
    }
  
    // Adding tests to the formData
    tests.forEach((test, index) => {
      formData.append(`tests[${index}].test_name`, test.test_name);
      formData.append(`tests[${index}].description`, test.description);
      formData.append(`tests[${index}].price`, test.price);
      formData.append(`tests[${index}].offerPrice`, test.offerPrice);
      if (test.image) formData.append(`testImage`, test.image);  // Just append `testImage`

    });
    
    // Adding contact persons to the formData
    contactPersons.forEach((person, index) => {
      formData.append(`contactPersons[${index}].name`, person.name);
      formData.append(`contactPersons[${index}].designation`, person.designation);
      formData.append(`contactPersons[${index}].gender`, person.gender);
      formData.append(`contactPersons[${index}].contactEmail`, person.contactEmail);
      formData.append(`contactPersons[${index}].contactNumber`, person.contactNumber);
    });
    
    try {
      const response = await fetch("https://credenhealth.onrender.com/api/admin/create-diagnostic", {
        method: "POST",
        body: formData,
      });
    
      if (response.ok) {
        const data = await response.json();
        alert("Diagnostic Center Created Successfully!");
        navigate("/"); // Navigate back to the list page
      } else {
        const error = await response.json();
        alert("Error: " + error.message);
      }
    } catch (err) {
      console.error("Error occurred while creating diagnostic center:", err);
      alert("An error occurred. Please try again.");
    }
  };
  
  

  return (
    <div className="p-6 bg-white rounded shadow">
      <h3 className="text-lg font-bold mb-4">Create Diagnostic Center</h3>
      <form onSubmit={createCenter}>
        <div className="flex gap-4 mb-4">
          {/* Name Field */}
          <div className="w-1/4">
            <label className="block text-sm mb-1">Name</label>
            <input
              className="p-2 border rounded"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email Field */}
          <div className="w-1/4">
            <label className="block text-sm mb-1">Email</label>
            <input
              className="p-2 border rounded"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Phone Field */}
          <div className="w-1/4">
            <label className="block text-sm mb-1">Phone</label>
            <input
              className="p-2 border rounded"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Image Upload Field */}
          <div className="w-1/4">
            <label className="block text-sm mb-1">Upload Image</label>
            <input
              type="file"
              className="p-2 border rounded"
              onChange={(e) => setImage(e.target.files[0])}
            />
            {image && <p className="mt-2 text-sm">Selected Image: {image.name}</p>}
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          {/* Center Type Dropdown */}
          <div className="w-1/4">
            <label className="block text-sm mb-1">Center Type</label>
            <select
              className="p-2 border rounded"
              value={centerType}
              onChange={(e) => setCenterType(e.target.value)}
            >
              <option value="">Select Center Type</option>
              <option value="Diagnostic">Diagnostic</option>
              <option value="Hospital">Hospital</option>
              <option value="Clinic">Clinic</option>
            </select>
          </div>

          {/* Methodology/Radiology Dropdown */}
          <div className="w-1/4">
            <label className="block text-sm mb-1">Methodology/Radiology</label>
            <select
              className="p-2 border rounded"
              value={methodology}
              onChange={(e) => setMethodology(e.target.value)}
            >
              <option value="">Select Methodology/Radiology</option>
              <option value="Methodology">Methodology</option>
              <option value="Radiology">Radiology</option>
            </select>
          </div>

          {/* Pathology - NABL Accredited Dropdown */}
          <div className="w-1/4">
            <label className="block text-sm mb-1">Pathology - NABL Accredited</label>
            <select
              className="p-2 border rounded"
              value={pathologyAccredited}
              onChange={(e) => setPathologyAccredited(e.target.value)}
            >
              <option value="">Select Pathology - NABL Accredited</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* GST Number Field */}
          <div className="w-1/4">
            <label className="block text-sm mb-1">GST Number</label>
            <input
              className="p-2 border rounded"
              placeholder="GST Number"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          {/* Center Strength Field */}
          <div className="w-1/4">
            <label className="block text-sm mb-1">Center Strength</label>
            <input
              className="p-2 border rounded"
              placeholder="Center Strength"
              value={centerStrength}
              onChange={(e) => setCenterStrength(e.target.value)}
            />
          </div>

          {/* Location Field */}
          <div className="w-1/4">
            <label className="block text-sm mb-1">Location</label>
            <input
              className="p-2 border rounded"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          {/* Country Dropdown */}
          <div className="w-1/4">
            <label className="block text-sm mb-1">Country</label>
            <select
              className="p-2 border rounded"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">Select Country</option>
              <option value="India">India</option>
              {/* You can add more countries dynamically */}
            </select>
          </div>

          {/* State Dropdown */}
          <div className="w-1/4">
            <label className="block text-sm mb-1">State</label>
            <select
              className="p-2 border rounded"
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              <option value="">Select State</option>
              <option value="State 1">State 1</option>
              <option value="State 2">State 2</option>
              {/* You can add more states dynamically */}
            </select>
          </div>

          {/* City Dropdown */}
          <div className="w-1/4">
            <label className="block text-sm mb-1">City</label>
            <select
              className="p-2 border rounded"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">Select City</option>
              <option value="City 1">City 1</option>
              <option value="City 2">City 2</option>
              {/* You can add more cities dynamically */}
            </select>
          </div>

          {/* Pincode Field */}
          <div className="w-1/4">
            <label className="block text-sm mb-1">Pincode</label>
            <input
              className="p-2 border rounded"
              placeholder="Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
          </div>
        </div>

        {/* Contact Persons Fields */}
        <h4 className="font-semibold mb-2">Contact Person(s)</h4>
        {contactPersons.map((person, idx) => (
          <div key={idx} className="mb-4 border p-4 rounded">
            <div className="flex gap-4 mb-4">
              <div className="w-1/4">
                <label className="block text-sm mb-1">Name</label>
                <input
                  className="p-1 border rounded"
                  placeholder="Name"
                  value={person.name}
                  onChange={(e) => handleContactChange(idx, "name", e.target.value)}
                />
              </div>
              <div className="w-1/4">
                <label className="block text-sm mb-1">Designation</label>
                <input
                  className="p-1 border rounded"
                  placeholder="Designation"
                  value={person.designation}
                  onChange={(e) => handleContactChange(idx, "designation", e.target.value)}
                />
              </div>
              <div className="w-1/4">
                <label className="block text-sm mb-1">Gender</label>
                <select
                  className="p-1 border rounded"
                  value={person.gender}
                  onChange={(e) => handleContactChange(idx, "gender", e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="w-1/4">
                <label className="block text-sm mb-1">Email</label>
                <input
                  className="p-1 border rounded"
                  placeholder="Email"
                  value={person.contactEmail}
                  onChange={(e) => handleContactChange(idx, "contactEmail", e.target.value)}
                />
              </div>
              <div className="w-1/4">
                <label className="block text-sm mb-1">Contact Number</label>
                <input
                  className="p-1 border rounded"
                  placeholder="Contact Number"
                  value={person.contactNumber}
                  onChange={(e) => handleContactChange(idx, "contactNumber", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddContactPerson}
          className="mb-4 px-2 py-1 bg-blue-200 text-blue-800 rounded"
        >
          + Add Contact Person
        </button>

        {/* Tests Section */}
        <h4 className="font-semibold mb-2">Tests</h4>
        {tests.map((test, idx) => (
          <div key={idx} className="mb-4 border p-4 rounded">
            <div className="flex gap-4 mb-4">
              <div className="w-1/4">
                <label className="block text-sm mb-1">Test Name</label>
                <input
                  className="p-1 border rounded"
                  placeholder="Test Name"
                  value={test.test_name}
                  onChange={(e) => handleTestChange(idx, "test_name", e.target.value)}
                />
              </div>
              <div className="w-1/4">
                <label className="block text-sm mb-1">Description</label>
                <input
                  className="p-1 border rounded"
                  placeholder="Description"
                  value={test.description}
                  onChange={(e) => handleTestChange(idx, "description", e.target.value)}
                />
              </div>
              <div className="w-1/4">
                <label className="block text-sm mb-1">Price</label>
                <input
                  className="p-1 border rounded"
                  placeholder="Price"
                  value={test.price}
                  onChange={(e) => handleTestChange(idx, "price", e.target.value)}
                />
              </div>
              <div className="w-1/4">
                <label className="block text-sm mb-1">Offer Price</label>
                <input
                  className="p-1 border rounded"
                  placeholder="Offer Price"
                  value={test.offerPrice}
                  onChange={(e) => handleTestChange(idx, "offerPrice", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Upload Test Image</label>
              <input
                type="file"
                className="p-1 border rounded"
                onChange={(e) => handleImageChange(idx, e)}
              />
              {test.image && <p>Selected Image: {test.image.name}</p>}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddTest}
          className="mb-4 px-2 py-1 bg-blue-200 text-blue-800 rounded"
        >
          + Add Test
        </button>

        {/* Form Submit */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-4 py-2 text-red-700 bg-red-100 border border-red-600 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-blue-700 bg-blue-100 border border-blue-600 rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default DiagnostiCreate;
