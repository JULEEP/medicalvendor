import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DoctorDetailsForm = () => {
  const navigate = useNavigate();

  // State variables to store form data
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [qualification, setQualification] = useState("");
  const [description, setDescription] = useState("");
  const [consultationFee, setConsultationFee] = useState("");
  const [address, setAddress] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [schedule, setSchedule] = useState([]); // State for storing schedule
  const [loading, setLoading] = useState(false); // Loading state for form submission

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to handle file and form data
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("specialization", specialization);
    formData.append("qualification", qualification);
    formData.append("description", description);
    formData.append("consultation_fee", consultationFee);
    formData.append("address", address);

    // Append the image file if provided
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // Append the doctor's schedule (stringify the schedule array)
    formData.append("schedule", JSON.stringify(schedule));

    try {
      setLoading(true); // Set loading to true before making the request

      // Send POST request to the backend (update URL to your local server)
      const response = await axios.post("https://credenhealth.onrender.com/api/admin/create-doctor", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for sending form data with files
        },
      });

      // Handle successful doctor creation
      alert("Doctor created successfully!");
    } catch (error) {
      console.error("Error creating doctor:", error);
      alert("Error creating doctor. Please try again.");
    } finally {
      setLoading(false); // Reset loading state after submission
    }
  };

  // Handle image file change (e.g., when the user uploads an image)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file); // Set the selected image file
  };

  // Handle adding a new schedule time slot
  const handleAddSchedule = () => {
    setSchedule([...schedule, { day: "", startTime: "", endTime: "" }]); // Add a new empty schedule entry
  };

  // Handle changes to schedule inputs (day, start time, end time)
  const handleScheduleChange = (index, field, value) => {
    const newSchedule = [...schedule];
    newSchedule[index][field] = value; // Update specific field of schedule entry
    setSchedule(newSchedule);
  };

  // Handle removal of a schedule entry
  const handleRemoveSchedule = (index) => {
    const newSchedule = schedule.filter((_, i) => i !== index); // Filter out the entry to be removed
    setSchedule(newSchedule);
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h3 className="text-lg font-bold mb-4">Doctor Details</h3>
      <form onSubmit={handleSubmit}>
        {/* Doctor Basic Details */}
        <div className="flex gap-4 mb-4">
          <div className="w-1/4">
            <label className="block text-sm mb-1">Name</label>
            <input
              className="p-2 border rounded w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="w-1/4">
            <label className="block text-sm mb-1">Category</label>
            <input
              className="p-2 border rounded w-full"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>

          <div className="w-1/4">
            <label className="block text-sm mb-1">Specialization</label>
            <input
              className="p-2 border rounded w-full"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              required
            />
          </div>

          <div className="w-1/4">
            <label className="block text-sm mb-1">Qualification</label>
            <input
              className="p-2 border rounded w-full"
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Doctor Description */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Description</label>
          <textarea
            className="p-2 border rounded w-full"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Doctor's Fee and Address */}
        <div className="flex gap-4 mb-4">
          <div className="w-1/4">
            <label className="block text-sm mb-1">Consultation Fee</label>
            <input
              type="number"
              className="p-2 border rounded w-full"
              value={consultationFee}
              onChange={(e) => setConsultationFee(e.target.value)}
              required
            />
          </div>

          <div className="w-2/4">
            <label className="block text-sm mb-1">Clinic Address</label>
            <input
              className="p-2 border rounded w-full"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="w-1/4">
            <label className="block text-sm mb-1">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="p-2 border rounded w-full"
            />
            {imageFile && (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                className="mt-2 rounded border"
                style={{ height: "80px", width: "auto" }}
              />
            )}
          </div>
        </div>

        {/* Doctor's Schedule Section */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Doctor's Schedule</label>
          <button
            type="button"
            onClick={handleAddSchedule}
            className="px-4 py-2 bg-purple-900 text-white rounded"
          >
            Add Schedule
          </button>

          {schedule.map((s, index) => (
            <div key={index} className="flex gap-4 mb-4 mt-4">
              {/* Day Input with Label */}
              <div className="w-1/4">
                <label className="block text-sm mb-1">Day</label>
                <input
                  className="p-2 border rounded w-full"
                  placeholder="e.g., Monday"
                  value={s.day}
                  onChange={(e) => handleScheduleChange(index, "day", e.target.value)}
                />
              </div>

              {/* Start Time Input with Label */}
              <div className="w-1/4">
                <label className="block text-sm mb-1">Start Time</label>
                <input
                  type="time"
                  className="p-2 border rounded w-full"
                  value={s.startTime}
                  onChange={(e) => handleScheduleChange(index, "startTime", e.target.value)}
                />
              </div>

              {/* End Time Input with Label */}
              <div className="w-1/4">
                <label className="block text-sm mb-1">End Time</label>
                <input
                  type="time"
                  className="p-2 border rounded w-full"
                  value={s.endTime}
                  onChange={(e) => handleScheduleChange(index, "endTime", e.target.value)}
                />
              </div>

              {/* Remove Button */}
              <div className="w-1/4 flex justify-center items-center">
                <button
                  type="button"
                  onClick={() => handleRemoveSchedule(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Form Action Buttons */}
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
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorDetailsForm;
