import React, { useState } from "react";
import axios from "axios"; // import axios
import { useNavigate } from "react-router-dom";

const StaffDetailsForm = ({ companyId, closeModal }) => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [idImage, setIdImage] = useState(null); // second image

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("role", role);
    formData.append("department", department);
    formData.append("contact_number", contactNumber);
    formData.append("email", email);
    formData.append("dob", dob);
    formData.append("gender", gender);
    formData.append("age", age);
    formData.append("address", address);
    if (profileImage) formData.append("profileImage", profileImage);
    if (idImage) formData.append("idImage", idImage);

    try {
      const response = await axios.post(
        `https://credenhealth.onrender.com/api/admin/create-staff/${companyId}`,
        formData
      );

      if (response.status === 201) {
        alert("Staff profile created and linked to company successfully");
        closeModal(); // Close the modal after successful submission
        navigate("/stafflist"); // Redirect to home or other page
      }
    } catch (error) {
      console.error("Error creating staff profile:", error);
      alert("Failed to create staff profile.");
    }
  };

  const handleProfileImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleIdImageChange = (e) => {
    setIdImage(e.target.files[0]);
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h3 className="text-lg font-bold mb-4">Staff Details</h3>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4 mb-4">
          <div className="w-1/4">
            <label className="block text-sm mb-1">Name</label>
            <input
              className="p-2 border rounded w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="w-1/4">
            <label className="block text-sm mb-1">Role</label>
            <input
              className="p-2 border rounded w-full"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          <div className="w-1/4">
            <label className="block text-sm mb-1">Department</label>
            <input
              className="p-2 border rounded w-full"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>

          <div className="w-1/4">
            <label className="block text-sm mb-1">Contact Number</label>
            <input
              className="p-2 border rounded w-full"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="w-1/4">
            <label className="block text-sm mb-1">Email</label>
            <input
              className="p-2 border rounded w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="w-1/4">
            <label className="block text-sm mb-1">Date of Birth</label>
            <input
              type="date"
              className="p-2 border rounded w-full"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>

          <div className="w-1/4">
            <label className="block text-sm mb-1">Gender</label>
            <select
              className="p-2 border rounded w-full"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="w-1/4">
            <label className="block text-sm mb-1">Age</label>
            <input
              type="number"
              className="p-2 border rounded w-full"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="w-2/4">
            <label className="block text-sm mb-1">Address</label>
            <input
              className="p-2 border rounded w-full"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="w-1/4">
            <label className="block text-sm mb-1">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              className="p-2 border rounded w-full"
            />
            {profileImage && (
              <img
                src={URL.createObjectURL(profileImage)}
                alt="Profile Preview"
                className="mt-2 rounded border"
                style={{ height: "80px", width: "auto" }}
              />
            )}
          </div>

          <div className="w-1/4">
            <label className="block text-sm mb-1">ID Proof Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleIdImageChange}
              className="p-2 border rounded w-full"
            />
            {idImage && (
              <img
                src={URL.createObjectURL(idImage)}
                alt="ID Preview"
                className="mt-2 rounded border"
                style={{ height: "80px", width: "auto" }}
              />
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 text-red-700 bg-red-100 border border-red-600 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-blue-700 bg-blue-100 border border-blue-600 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffDetailsForm;
