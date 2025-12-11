import React, { useState, useEffect } from "react";

const GetContactUsPage = () => {
  // Dummy data for the Contact Us submission
  const [contactUsData, setContactUsData] = useState(null);

  useEffect(() => {
    // Simulating fetching the Contact Us data from an API or backend
    const fetchContactUsData = () => {
      const dummyData = {
        name: "John Doe",
        email: "johndoe@example.com",
        subject: "Inquiry about services",
        message:
          "Hello, I would like to know more about the services you offer. Can you please provide more information?",
        submittedDate: "2025-05-05",
      };

      // Set the fetched data (dummy data here)
      setContactUsData(dummyData);
    };

    fetchContactUsData(); // Fetching the dummy data
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-blue-900 mb-6">Contact Us - Message</h2>

      {/* Display Contact Us Data */}
      {contactUsData ? (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Message from {contactUsData.name}</h3>
          <p className="text-sm text-gray-500 mb-2">Email: {contactUsData.email}</p>
          <p className="text-sm text-gray-500 mb-2">Subject: {contactUsData.subject}</p>
          <p className="text-gray-700 mb-4">{contactUsData.message}</p>
          <p className="text-sm text-gray-500">Submitted on: {contactUsData.submittedDate}</p>
        </div>
      ) : (
        <div className="text-gray-500">Loading Contact Us message...</div>
      )}
    </div>
  );
};

export default GetContactUsPage;
