import React, { useState, useEffect } from "react";
import { FaCloudUploadAlt, FaTimes, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function CreateMedicine() {
  const [vendorId, setVendorId] = useState("");
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [description, setDescription] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [images, setImages] = useState([]);
  const [imageURLs, setImageURLs] = useState([""]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // For Category Popup
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: "", image: null });
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  // Fetch categories for this vendor (pharmacy)
  useEffect(() => {
    const storedVendorId = localStorage.getItem("vendorId");
    if (storedVendorId) {
      setVendorId(storedVendorId);
      fetchCategories(storedVendorId);
    } else {
      setError("Vendor ID not found in localStorage. Please login.");
    }
  }, []);

  const fetchCategories = (vendorId) => {
    fetch(`http://31.97.206.144:7021/api/vendor/categories/${vendorId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.categories) {
          setCategories(data.categories);
        } else {
          setCategories([]);
        }
      })
      .catch(() => setError("Failed to load vendor categories"));
  };

  // Image Handlers
  const handleImageFileChange = (e) => {
    setImages([...images, ...Array.from(e.target.files)]);
  };

  const handleImageURLChange = (index, value) => {
    const updated = [...imageURLs];
    updated[index] = value;
    setImageURLs(updated);
  };

  const addImageURLField = () => {
    setImageURLs([...imageURLs, ""]);
  };

  const removeImageURLField = (index) => {
    if (imageURLs.length === 1) return;
    const updated = [...imageURLs];
    updated.splice(index, 1);
    setImageURLs(updated);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Category Popup Handlers
  const openCategoryPopup = () => {
    setCategoryForm({ name: "", image: null });
    setShowCategoryPopup(true);
    setError("");
    setMessage("");
  };

  const handlePopupClose = () => {
    if (!uploading) setShowCategoryPopup(false);
  };

  const handleCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryForm((prev) => ({ ...prev, image: file }));
    }
  };

  // API call to update categories of the selected vendor (pharmacy)
  const updateVendorCategories = async (categoryData) => {
      try {
      const formData = new FormData();

      const categoriesArray = [
        {
          name: categoryData.name.trim(),
          image: "", // Image will be uploaded separately
        },
      ];

      formData.append("categories", JSON.stringify(categoriesArray));

      if (categoryData.image instanceof File) {
        formData.append("categoryImages", categoryData.image);
      }

      const response = await fetch(
        `http://31.97.206.144:7021/api/pharmacy/updatepharmacy/${vendorId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Update failed");

      return data.pharmacy;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  // Submit handler for category popup form
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      setError("Category name is required");
      return;
    }
    if (!categoryForm.image) {
      setError("Category image is required");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const updatedVendor = await updateVendorCategories(categoryForm);
      // Update local categories state with new categories from updated vendor
      setCategories(updatedVendor.categories || []);
      setCategoryName(categoryForm.name.trim());
      setShowCategoryPopup(false);
      setMessage("Category added successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!vendorId) {
      setError("Vendor ID missing. Cannot create medicine.");
      return;
    }

    if (!categoryName) {
      setError("Please select a category.");
      return;
    }

    if (!name.trim()) {
      setError("Medicine name is required.");
      return;
    }

    if (!price || isNaN(price) || parseFloat(price) <= 0) {
      setError("Please enter a valid price.");
      return;
    }

    // Validate that MRP is not less than price
    if (mrp && parseFloat(mrp) < parseFloat(price)) {
      setError("MRP cannot be less than selling price");
      return;
    }

    if (!description.trim()) {
      setError("Description is required.");
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("price", parseFloat(price));
    formData.append("mrp", mrp ? parseFloat(mrp) : "");
    formData.append("description", description.trim());
    formData.append("categoryName", categoryName);

    // Append uploaded image files (if any)
    if (images.length > 0) {
      images.forEach((file) => formData.append("images", file));
    }

    // Append image URLs
    const validUrls = imageURLs.filter((url) => url.trim().startsWith("http"));
    if (validUrls.length > 0) {
      formData.append("images", JSON.stringify(validUrls));
    }

    try {
      const res = await fetch(
        `http://31.97.206.144:7021/api/vendor/addmedicine/${vendorId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      alert(data.message || "Medicine added successfully");
      setMessage(data.message || "Medicine added successfully");

      // Reset form fields
      setName("");
      setPrice("");
      setMrp("");
      setDescription("");
      setCategoryName("");
      setImages([]);
      setImageURLs([""]);

      navigate("/medicines");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">Create Medicine</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}
      {message && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow border"
        encType="multipart/form-data"
      >
        {/* Category Select */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Select Category</label>
          <select
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
            className="w-full p-2 border rounded"
            disabled={!categories.length}
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          
          {/* Add Category button */}
          <div className="mt-2">
            <button
              type="button"
              onClick={openCategoryPopup}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              + Add New Category
            </button>
          </div>
          
          {!categories.length && (
            <p className="text-sm text-gray-500 mt-1">
              No categories found. Please add a category first.
            </p>
          )}
        </div>

        {/* Medicine Name */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Medicine Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Price & MRP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1 font-medium">Price (₹)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="any"
              min="0"
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">MRP (₹)</label>
            <input
              type="number"
              value={mrp}
              onChange={(e) => setMrp(e.target.value)}
              step="any"
              min="0"
              className="w-full p-2 border rounded"
            />
            {mrp && price && parseFloat(mrp) > parseFloat(price) && (
              <p className="text-sm text-green-600 mt-1">
                Discount: {Math.round(((mrp - price) / mrp) * 100)}% off
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Upload Images */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Upload Images</label>
          <label className="flex items-center p-2 border-2 border-dashed border-blue-400 rounded cursor-pointer hover:bg-blue-50 transition">
            <FaCloudUploadAlt className="text-xl mr-2 text-blue-600" />
            Choose Files
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageFileChange}
              className="hidden"
            />
          </label>
          {images.length > 0 && (
            <p className="text-sm mt-2">{images.length} file(s) selected</p>
          )}
        </div>

        {/* Display uploaded images */}
        {images.length > 0 && (
          <div className="mb-4">
            <h3 className="font-medium mb-2">Uploaded Images</h3>
            <div className="flex gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Uploaded Image ${index + 1}`}
                    className="w-32 h-32 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 text-red-600 bg-white p-1 rounded-full"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image URLs */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Image URLs</label>
          {imageURLs.map((url, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="url"
                value={url}
                onChange={(e) => handleImageURLChange(index, e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 p-2 border rounded-l"
              />
              <button
                type="button"
                onClick={() => removeImageURLField(index)}
                disabled={imageURLs.length === 1}
                className="bg-red-500 text-white px-3 rounded-r disabled:bg-gray-400"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addImageURLField}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            + Add URL
          </button>
        </div>

        <div className="mt-6 text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Create Medicine
          </button>
        </div>
      </form>

      {/* Category Popup */}
      {/* Category Popup */}
      {showCategoryPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add New Category</h3>
              <button
                onClick={handlePopupClose}
                className="text-gray-500 hover:text-gray-700"
                disabled={uploading}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCategorySubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter category name"
                  required
                  disabled={uploading}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCategoryImageChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                  disabled={uploading}
                />
                {categoryForm.image instanceof File && (
                  <div className="mt-2 text-sm text-gray-600">
                    Selected file: {categoryForm.image.name}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handlePopupClose}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}