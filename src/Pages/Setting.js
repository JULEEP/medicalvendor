import React, { useState } from "react";
import axios from "axios"; // import axios
import { useNavigate } from "react-router-dom";

const Settings = ({ userId, closeModal }) => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notifications, setNotifications] = useState(false); // To toggle notifications

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("contact_number", contactNumber);
    formData.append("dob", dob);
    formData.append("gender", gender);
    formData.append("new_password", newPassword);
    formData.append("confirm_password", confirmPassword);
    formData.append("notifications", notifications);
    if (profileImage) formData.append("profile_image", profileImage);

    try {
      const response = await axios.put(
        `http://localhost:4000/api/user/update-settings/${userId}`,
        formData
      );

      if (response.status === 200) {
        alert("Settings updated successfully");
        closeModal(); // Close the modal after successful submission
        navigate("/"); // Redirect to home or other page
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Failed to update settings.");
    }
  };

  const handleProfileImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h3 className="text-lg font-bold mb-4">Settings</h3>
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
            <label className="block text-sm mb-1">Email</label>
            <input
              className="p-2 border rounded w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <div className="w-1/4">
            <label className="block text-sm mb-1">Date of Birth</label>
            <input
              type="date"
              className="p-2 border rounded w-full"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-4 mb-4">
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
        </div>

        <div className="flex gap-4 mb-4">
          <div className="w-1/4">
            <label className="block text-sm mb-1">New Password</label>
            <input
              type="password"
              className="p-2 border rounded w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="w-1/4">
            <label className="block text-sm mb-1">Confirm Password</label>
            <input
              type="password"
              className="p-2 border rounded w-full"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="w-1/4">
            <label className="block text-sm mb-1">Notifications</label>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="mr-2"
              />
              <span>Enable Notifications</span>
            </div>
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
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
