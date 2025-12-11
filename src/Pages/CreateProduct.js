import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateProductForm = () => {
  const navigate = useNavigate();

  // State variables to store form data
  const [restaurantName, setRestaurantName] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [images, setImages] = useState([]); // Array to hold image files
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]); // To store categories
  const [subcategories, setSubcategories] = useState([]); // To store subcategories
  const [loading, setLoading] = useState(false); // Loading state for form submission

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://your-api-url.com/api/get-categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories based on the selected category
  useEffect(() => {
    if (category) {
      const fetchSubcategories = async () => {
        try {
          const response = await axios.get(`https://your-api-url.com/api/get-subcategories/${category}`);
          setSubcategories(response.data);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      };
      fetchSubcategories();
    }
  }, [category]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to handle file and form data
    const formData = new FormData();
    formData.append("restaurantName", restaurantName);
    formData.append("address", address);
    formData.append("category", category);
    formData.append("subcategory", subcategory);
    formData.append("price", price);
    formData.append("offerPrice", offerPrice);
    formData.append("productName", productName);
    formData.append("description", description);

    // Append all images to the FormData
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      setLoading(true); // Set loading to true before making the request

      // Send POST request to the backend
      const response = await axios.post("https://your-api-url.com/api/create-product", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for sending form data with files
        },
      });

      // Handle successful product creation
      alert("Product created successfully!");
      navigate("/"); // Redirect after successful product creation
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Error creating product. Please try again.");
    } finally {
      setLoading(false); // Reset loading state after submission
    }
  };

  // Handle image file change (e.g., when the user uploads an image)
  const handleImageChange = (e) => {
    const files = e.target.files;
    setImages([...images, ...files]); // Add the new images to the images state
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h3 className="text-lg font-bold mb-4">Create Product</h3>
      <form onSubmit={handleSubmit}>
        {/* Product Basic Details */}
        <div className="flex gap-4 mb-4">
          <div className="w-1/4">
            <label className="block text-sm mb-1">Restaurant Name</label>
            <input
              className="p-2 border rounded w-full"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              required
            />
          </div>

          <div className="w-1/4">
            <label className="block text-sm mb-1">Address</label>
            <input
              className="p-2 border rounded w-full"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Category and Price */}
        <div className="flex gap-4 mb-4">
          <div className="w-1/4">
            <label className="block text-sm mb-1">Category</label>
            <select
              className="p-2 border rounded w-full"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-1/4">
            <label className="block text-sm mb-1">Subcategory</label>
            <select
              className="p-2 border rounded w-full"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              required
              disabled={!category} // Disable if no category is selected
            >
              <option value="">Select a subcategory</option>
              {subcategories.map((subcat) => (
                <option key={subcat._id} value={subcat._id}>
                  {subcat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-1/4">
            <label className="block text-sm mb-1">Price</label>
            <input
              type="number"
              className="p-2 border rounded w-full"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="w-1/4">
            <label className="block text-sm mb-1">Offer Price</label>
            <input
              type="number"
              className="p-2 border rounded w-full"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
            />
          </div>
        </div>

        {/* Product Name and Description */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Product Name</label>
          <input
            className="p-2 border rounded w-full"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Description</label>
          <textarea
            className="p-2 border rounded w-full"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Product Images */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Upload Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="p-2 border rounded w-full"
          />
          {images.length > 0 && (
            <div className="mt-2 flex gap-2">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index}`}
                  className="h-16 w-16 object-cover rounded"
                />
              ))}
            </div>
          )}
        </div>

        {/* Form Action Buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-4 py-2 text-red-700 bg-red-100 border border-red-600 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-blue-700 bg-blue-100 border border-blue-600 rounded"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProductForm;
