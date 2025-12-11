import React, { useState, useEffect } from "react";
import axios from "axios";

const CategoryForm = ({ closeModal }) => {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [categories, setCategories] = useState([]); // To hold the list of categories
  const [selectedCategory, setSelectedCategory] = useState(""); // To store selected category
  const [subCategory, setSubCategory] = useState(""); // To store subcategory entered by user

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://credenhealth.onrender.com/api/admin/get-categories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert("Category name cannot be empty");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", categoryName);
      formData.append("description", description.trim());
      if (image) formData.append("image", image);
      formData.append("parentCategory", selectedCategory); // Add selected category
      formData.append("subCategory", subCategory.trim()); // Add entered subcategory

      const response = await axios.post(
        "https://credenhealth.onrender.com/api/admin/create-category",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 201 || response.status === 200) {
        alert("Category created successfully!");
        closeModal();
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow w-full max-w-md">
      <h3 className="text-lg font-bold mb-4">Create Category</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm mb-1">Category Name</label>
          <input
            className="p-2 border rounded w-full"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Description (optional)</label>
          <textarea
            className="p-2 border rounded w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter category description"
            rows="3"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Subcategory (Enter custom)</label>
          <input
            className="p-2 border rounded w-full"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            placeholder="Enter subcategory name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Upload Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="imageUpload"
          />
          <label
            htmlFor="imageUpload"
            className="cursor-pointer inline-block px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-sm"
          >
            Upload Image
          </label>
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded border"
            />
          )}
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
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
