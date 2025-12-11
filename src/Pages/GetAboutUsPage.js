import React, { useState, useEffect } from "react";

const GetAboutUsPage = () => {
  // Dummy data for the About Us section
  const [aboutUsData, setAboutUsData] = useState(null);

  useEffect(() => {
    // Simulating fetching the About Us data from an API or backend
    const fetchAboutUsData = () => {
      const dummyData = {
        title: "About Our Company",
        content:
          "We are a leading company in the tech industry, providing top-notch services to our customers. Our mission is to innovate and make technology accessible for everyone. Our team is passionate about creating solutions that make a real impact.",
        date: "2025-05-05",
      };

      // Set the fetched data (dummy data here)
      setAboutUsData(dummyData);
    };

    fetchAboutUsData(); // Fetching the dummy data
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-blue-900 mb-6">About Us</h2>

      {/* Display About Us Data */}
      {aboutUsData ? (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">{aboutUsData.title}</h3>
          <p className="text-gray-700 mb-4">{aboutUsData.content}</p>
          <p className="text-sm text-gray-500">Published on: {aboutUsData.date}</p>
        </div>
      ) : (
        <div className="text-gray-500">Loading About Us information...</div>
      )}
    </div>
  );
};

export default GetAboutUsPage;
