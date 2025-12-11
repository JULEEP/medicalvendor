import React, { useState } from "react";

const AboutUsFormPage = () => {
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutContent, setAboutContent] = useState("");
  const [date, setDate] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // You can add the API call logic here to submit the form data to your backend.
    // Example: axios.post('http://localhost:4000/api/about-us', { title, content, date });

    setSuccessMessage("About Us section saved successfully!");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-blue-900 mb-6">Create About Us</h2>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
          {successMessage}
        </div>
      )}

      {/* About Us Form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="aboutTitle" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="aboutTitle"
            value={aboutTitle}
            onChange={(e) => setAboutTitle(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
            placeholder="Enter the title of your About Us section"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="aboutContent" className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            id="aboutContent"
            value={aboutContent}
            onChange={(e) => setAboutContent(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
            placeholder="Enter the content of your About Us section"
            rows="8"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save About Us
          </button>
        </div>
      </form>
    </div>
  );
};

export default AboutUsFormPage;
