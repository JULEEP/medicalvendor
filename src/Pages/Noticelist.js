import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { utils, writeFile } from "xlsx";
import axios from "axios";

export default function NoticeList() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [formData, setFormData] = useState({ type: "", description: "", date: "", noticeBy: "" });
  const [notices, setNotices] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const noticesPerPage = 5;

  useEffect(() => {
    // Fetch all notices on initial render
    axios
      .get("https://hr-backend-hifb.onrender.com/api/hr/get-all")
      .then((response) => {
        setNotices(response.data); // Assuming the API returns an array of notices
      })
      .catch((error) => {
        console.error("Error fetching notices:", error);
      });
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const exportData = (type) => {
    const filteredNotices = notices.filter((notice) => notice.type.toLowerCase().includes(search.toLowerCase()));
    const ws = utils.json_to_sheet(filteredNotices);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Notices");
    writeFile(wb, `notices.${type}`);
  };

  const handleDelete = () => {
    axios
      .delete(`https://hr-backend-hifb.onrender.com/api/hr/delete-notice/${selectedNotice.id}`)
      .then(() => {
        setNotices(notices.filter((notice) => notice.id !== selectedNotice.id));
        setDeleteModal(false);
        setSuccessModal(true);
      })
      .catch((error) => {
        console.error("Error deleting notice:", error);
      });
  };

  const handleEdit = () => {
    axios
      .put(`https://hr-backend-hifb.onrender.com/api/hr/update-notice/${selectedNotice.id}`, formData)
      .then(() => {
        const updatedNotices = notices.map((notice) =>
          notice.id === selectedNotice.id ? { ...notice, ...formData } : notice
        );
        setNotices(updatedNotices);
        setEditModal(false);
        setSuccessModal(true);
      })
      .catch((error) => {
        console.error("Error updating notice:", error);
      });
  };

  const handleAddNotice = () => {
    axios
      .post("https://hr-backend-hifb.onrender.com/api/hr/create-notice", formData)
      .then((response) => {
        setNotices([...notices, response.data]); // Assuming API returns the newly created notice
        setFormData({ type: "", description: "", date: "", noticeBy: "" });
        setShowModal(false);
        setSuccessModal(true);
      })
      .catch((error) => {
        console.error("Error creating notice:", error);
      });
  };

  // Pagination: Get the current page's notices
  const filteredNotices = notices.filter((notice) =>
    notice.type ? notice.type.toLowerCase().includes(search.toLowerCase()) : ''
  );
  const indexOfLastNotice = currentPage * noticesPerPage;
  const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
  const currentNotices = filteredNotices.slice(indexOfFirstNotice, indexOfLastNotice);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredNotices.length / noticesPerPage);

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-900">Notice List</h2>
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          onClick={() => setShowModal(true)}
        >
          + Add New Notice
        </button>
      </div>
      <div className="flex justify-between mb-4">
        <input
          className="w-1/3 p-2 border rounded"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => exportData("csv")}>CSV</button>
          <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => exportData("xlsx")}>Excel</button>
        </div>
      </div>
      {/* Table Wrapper with overflow */}
      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-purple-600">
              <th className="p-2 border text-white">Sl</th>
              <th className="p-2 border text-white">Notice Type</th>
              <th className="p-2 border text-white">Description</th>
              <th className="p-2 border text-white">Date</th>
              <th className="p-2 border text-white">Notice By</th>
              <th className="p-2 border text-white">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentNotices.map((notice, index) => (
              <tr key={notice.id} className="border-b">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{notice.type}</td>
                <td className="p-2 border">{notice.description}</td>
                <td className="p-2 border">{notice.date}</td>
                <td className="p-2 border">{notice.noticeBy}</td>
                <td className="p-2 border flex gap-2">
                  <button
                    className="bg-blue-500 text-white p-1 rounded"
                    onClick={() => {
                      setEditModal(true);
                      setSelectedNotice(notice);
                      setFormData(notice);
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="bg-red-500 text-white p-1 rounded"
                    onClick={() => {
                      setDeleteModal(true);
                      setSelectedNotice(notice);
                    }}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`px-4 py-2 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Next
        </button>
      </div>

      {/* Add New Notice Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl">
            <h2 className="text-lg font-semibold mb-4">Add New Notice</h2>

            <input
              className="w-full p-2 border rounded mb-2"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              placeholder="Notice Type"
            />
            <input
              className="w-full p-2 border rounded mb-2"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
            />
            <input
              className="w-full p-2 border rounded mb-2"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              placeholder="Date"
            />
            <input
              className="w-full p-2 border rounded mb-2"
              name="noticeBy"
              value={formData.noticeBy}
              onChange={handleInputChange}
              placeholder="Notice By"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleAddNotice}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Notice Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl">
            <h2 className="text-lg font-semibold mb-4">Edit Notice</h2>

            <input
              className="w-full p-2 border rounded mb-2"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              placeholder="Notice Type"
            />
            <input
              className="w-full p-2 border rounded mb-2"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
            />
            <input
              className="w-full p-2 border rounded mb-2"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              placeholder="Date"
            />
            <input
              className="w-full p-2 border rounded mb-2"
              name="noticeBy"
              value={formData.noticeBy}
              onChange={handleInputChange}
              placeholder="Notice By"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleEdit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl">
            <h2 className="text-lg font-semibold mb-4">Are you sure you want to delete this notice?</h2>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-semibold mb-4">Notice has been successfully updated!</h2>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => setSuccessModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
