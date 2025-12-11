import React, { useState, useEffect } from 'react';
import { FaCloudUploadAlt, FaEdit, FaTrash } from 'react-icons/fa';

export default function Category() {
  const [categoryName, setCategoryName] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filterService, setFilterService] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      const query = filterService ? `?serviceName=${encodeURIComponent(filterService)}` : '';
      const res = await fetch(`http://31.97.206.144:7021/api/category/allcategories${query}`);
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      setError('Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [filterService]);

  const resetForm = () => {
    setCategoryName('');
    setServiceName('');
    setImageURL('');
    setFile(null);
    setEditingCategory(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const formData = new FormData();
    formData.append('categoryName', categoryName);
    formData.append('serviceName', serviceName);
    if (file) {
      formData.append('image', file);
    } else if (imageURL) {
      formData.append('image', imageURL);
    }

    const endpoint = editingCategory
      ? `http://31.97.206.144:7021/api/category/updatecategory/${editingCategory._id}`
      : 'http://31.97.206.144:7021/api/category/create-category';

    try {
      const res = await fetch(endpoint, {
        method: editingCategory ? 'PUT' : 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Request failed');
      setMessage(data.message);
      resetForm();
      fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setCategoryName(category.categoryName);
    setServiceName(category.serviceName);
    setImageURL(category.image);
    setFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this category?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://31.97.206.144:7021/api/category/deletecategory/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Delete failed');
      setMessage(data.message);
      fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Category Manager</h1>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 bg-white border p-6 rounded-lg shadow"
      >
        <div>
          <label className="block mb-1 font-medium">Category Name</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
            className="w-full p-2 border rounded focus:outline-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Service Name</label>
          <input
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            required
            className="w-full p-2 border rounded focus:outline-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Image URL (optional)</label>
          <input
            type="url"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
            className="w-full p-2 border rounded focus:outline-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Upload Image (optional)</label>
          <label className="flex items-center justify-center p-2 border-2 border-dashed border-blue-400 rounded cursor-pointer hover:bg-blue-50 transition">
            <FaCloudUploadAlt className="text-xl mr-2 text-blue-600" />
            {file ? file.name : 'Choose File'}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>
        <div className="col-span-1 md:col-span-2 flex justify-between mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {editingCategory ? 'Update Category' : 'Create Category'}
          </button>
          {editingCategory && (
            <button
              type="button"
              onClick={resetForm}
              className="ml-4 text-sm text-gray-600 underline hover:text-red-500"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Filter */}
      <div className="mb-6">
        <input
          type="text"
          value={filterService}
          onChange={(e) => setFilterService(e.target.value)}
          placeholder="🔍 Filter by service name..."
          className="w-full p-2 border rounded focus:outline-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white border rounded-lg shadow">
        <table className="w-full table-auto">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Service</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((cat, index) => (
                <tr key={cat._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">
                    <img
                      src={cat.image}
                      alt={cat.categoryName}
                      className="w-12 h-12 rounded object-cover border"
                      onError={(e) =>
                        (e.target.src =
                          'https://via.placeholder.com/80?text=No+Image')
                      }
                    />
                  </td>
                  <td className="p-3 font-medium">{cat.categoryName}</td>
                  <td className="p-3">{cat.serviceName}</td>
                  <td className="p-3 flex gap-3 items-center">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                      onClick={() => handleEdit(cat)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                      onClick={() => handleDelete(cat._id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No categories available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
