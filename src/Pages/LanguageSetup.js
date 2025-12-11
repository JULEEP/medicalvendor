import React, { useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

const LanguageList = () => {
  const [languages, setLanguages] = useState([
    { id: 1, name: "English", code: "en" },
    { id: 2, name: "Arabic", code: "ar" },
    { id: 3, name: "Cambodian", code: "km" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLanguage, setNewLanguage] = useState({ name: "", code: "" });

  const handleDelete = (id) => {
    setLanguages(languages.filter((lang) => lang.id !== id));
  };

  const handleAdd = () => {
    if (newLanguage.name && newLanguage.code) {
      setLanguages([...languages, { id: Date.now(), ...newLanguage }]);
      setNewLanguage({ name: "", code: "" });
      setIsModalOpen(false);
    }
  };

  return (
    <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Language List</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 text-green-700 bg-green-100 border border-green-600 rounded"
        >
          <FaPlus className="mr-2" /> Add Language
        </button>
      </div>
      <table className="w-full border border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Sl</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Code</th>
            <th className="px-4 py-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {languages.map((lang, index) => (
            <tr key={lang.id}>
              <td className="px-4 py-2 border">{index + 1}</td>
              <td className="px-4 py-2 border">{lang.name}</td>
              <td className="px-4 py-2 border">{lang.code}</td>
              <td className="flex justify-center px-4 py-2 border">
                <button className="px-3 py-1 mr-2 text-blue-700 bg-blue-100 border border-blue-600 rounded">
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(lang.id)}
                  className="px-3 py-1 text-red-700 bg-red-100 border border-red-600 rounded"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg w-96">
            <h3 className="mb-4 text-lg font-semibold">Add Language</h3>
            <label className="block mb-2">Language Name *</label>
            <input
              type="text"
              value={newLanguage.name}
              onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
              placeholder="Enter language name"
            />
            <label className="block mb-2">Language Code</label>
            <input
              type="text"
              value={newLanguage.code}
              onChange={(e) => setNewLanguage({ ...newLanguage, code: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
              placeholder="Enter language code"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-red-700 bg-red-100 border border-red-600 rounded">
                Close
              </button>
              <button onClick={handleAdd} className="px-4 py-2 text-blue-700 bg-blue-100 border border-blue-600 rounded">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageList;
