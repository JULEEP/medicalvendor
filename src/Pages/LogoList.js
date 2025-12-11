import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

const LogoList = () => {
  // Dummy data for logos
  const [logos, setLogos] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const logosPerPage = 5;

  useEffect(() => {
    // Fetch logos data (this would be replaced with your actual API)
    setLogos([
      {
        id: 1,
        logoName: "Tech Logo",
        description: "A modern tech company logo.",
        logoImage: "https://mir-s3-cdn-cf.behance.net/projects/original/ec753e129429523.61a1e79332f16.png",
      },
      {
        id: 2,
        logoName: "Food Logo",
        description: "A logo for a food company.",
        logoImage: "https://mir-s3-cdn-cf.behance.net/projects/original/ec753e129429523.61a1e79332f16.png",
      },
      {
        id: 3,
        logoName: "Travel Logo",
        description: "A logo for a travel agency.",
        logoImage: "https://mir-s3-cdn-cf.behance.net/projects/original/ec753e129429523.61a1e79332f16.png",
      },
      // Add more logos if needed
    ]);
  }, []);

  const filteredLogos = logos.filter((logo) =>
    logo.logoName.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastLogo = currentPage * logosPerPage;
  const indexOfFirstLogo = indexOfLastLogo - logosPerPage;
  const currentLogos = filteredLogos.slice(indexOfFirstLogo, indexOfLastLogo);
  const totalPages = Math.ceil(filteredLogos.length / logosPerPage);

  const handleEdit = (id) => {
    console.log("Editing logo with ID:", id);
    // Implement edit functionality here
  };

  const handleDelete = (id) => {
    setLogos(logos.filter((logo) => logo.id !== id));
    alert("Logo deleted successfully!");
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-900">Logo List</h2>
        <input
          className="w-1/3 p-2 border rounded"
          placeholder="Search by logo name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-purple-600 text-white">
              <th className="p-2 border">Sl</th>
              <th className="p-2 border">Logo Image</th>
              <th className="p-2 border">Logo Name</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentLogos.map((logo, index) => (
              <tr key={logo.id} className="border-b">
                <td className="p-2 border">{index + 1 + indexOfFirstLogo}</td>
                <td className="p-2 border">
                  <img
                    src={logo.logoImage}
                    alt={logo.logoName}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="p-2 border">{logo.logoName}</td>
                <td className="p-2 border">{logo.description}</td>
                <td className="p-2 border flex gap-2">
                  <button
                    className="bg-blue-500 text-white p-1 rounded"
                    onClick={() => handleEdit(logo.id)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="bg-red-500 text-white p-1 rounded"
                    onClick={() => handleDelete(logo.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4 gap-4">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LogoList;
