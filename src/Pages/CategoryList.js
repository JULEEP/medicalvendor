import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { utils, writeFile } from "xlsx";
import axios from "axios";

export default function CategoryList() {
  const [categories, setCategories] = useState([
    { _id: 1, categoryName: "Restaurant", createdAt: new Date() },
    { _id: 2, categoryName: "Meat Shop", createdAt: new Date() },
    { _id: 3, categoryName: "Groceries", createdAt: new Date() },
  ]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedCategory, setEditedCategory] = useState({ _id: null, categoryName: "" });
  const [exportLimit, setExportLimit] = useState(10);

  const categoriesPerPage = 5;

  useEffect(() => {
    // You can uncomment this and use actual API
    /*
    axios
      .get("https://posterbnaobackend.onrender.com/api/category/getall-cateogry")
      .then((res) => {
        if (res.data && res.data.categories) {
          setCategories(res.data.categories);
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
    */
  }, []);

  const exportData = (type) => {
    const exportItems = filteredCategories
      .slice(0, exportLimit)
      .map(({ _id, categoryName }) => ({
        id: _id,
        categoryName: categoryName || "N/A",
      }));

    const ws = utils.json_to_sheet(exportItems);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Categories");
    writeFile(wb, `categories.${type}`);
  };

  const filteredCategories = categories.filter((cat) =>
    cat.categoryName.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * categoriesPerPage;
  const indexOfFirst = indexOfLast - categoriesPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

  const handleEditCategory = (category) => {
    setEditedCategory({ _id: category._id, categoryName: category.categoryName });
    setIsEditModalOpen(true);
  };

  const handleSaveEditedCategory = () => {
    const updatedCategories = categories.map((cat) =>
      cat._id === editedCategory._id ? editedCategory : cat
    );
    setCategories(updatedCategories);
    setIsEditModalOpen(false);
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-900">All Categories</h2>
      </div>

      <div className="flex justify-between mb-4">
        <input
          className="w-1/3 p-2 border rounded"
          placeholder="Search by category name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2 items-center">
          <select
            className="border border-gray-300 p-2 rounded"
            value={exportLimit}
            onChange={(e) => setExportLimit(parseInt(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={100}>100</option>
            <option value={500}>500</option>
            <option value={1000}>1000</option>
          </select>
          <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => exportData("csv")}>
            CSV
          </button>
          <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => exportData("xlsx")}>
            Excel
          </button>
        </div>
      </div>

      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-2 border">Sl</th>
              <th className="p-2 border">Category Name</th>
              <th className="p-2 border">Created At</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.map((cat, index) => (
              <tr key={cat._id} className="border-b">
                <td className="p-2 border">{index + 1 + indexOfFirst}</td>
                <td className="p-2 border">{cat.categoryName || "N/A"}</td>
                <td className="p-2 border">{new Date(cat.createdAt).toLocaleDateString()}</td>
                <td className="p-2 border flex gap-2">
                  <button
                    className="bg-blue-500 text-white p-1 rounded"
                    onClick={() => handleEditCategory(cat)}
                  >
                    <FaEdit />
                  </button>
                  <button className="bg-red-500 text-white p-1 rounded">
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

      {/* Edit Category Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Edit Category</h3>
            <input
              type="text"
              value={editedCategory.categoryName}
              onChange={(e) =>
                setEditedCategory({ ...editedCategory, categoryName: e.target.value })
              }
              className="w-full p-3 border rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditedCategory}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
