import React, { useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

export default function CreatePharmacy() {
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [vendorName, setVendorName] = useState('');
  const [vendorEmail, setVendorEmail] = useState('');
  const [vendorPhone, setVendorPhone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const addCategory = () => {
    setCategories([...categories, { name: '', imageURL: '', imageFile: null }]);
  };

  const updateCategory = (index, field, value) => {
    const updated = [...categories];
    updated[index][field] = value;
    setCategories(updated);
  };

  const removeCategory = (index) => {
    const updated = [...categories];
    updated.splice(index, 1);
    setCategories(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('vendorName', vendorName);
    formData.append('vendorEmail', vendorEmail);
    formData.append('vendorPhone', vendorPhone);

    if (imageFile) {
      formData.append('image', imageFile);
    } else if (imageURL) {
      formData.append('image', imageURL);
    }

    const catData = categories.map((cat) => ({ name: cat.name, image: cat.imageURL }));
    formData.append('categories', JSON.stringify(catData));

    categories.forEach((cat, i) => {
      if (cat.imageFile) {
        formData.append('categoryImages', cat.imageFile);
      }
    });

    try {
      const res = await fetch('http://31.97.206.144:7021/api/pharmacy/create-pharmacy', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      setMessage(data.message);

      // Reset form
      setName('');
      setLatitude('');
      setLongitude('');
      setImageURL('');
      setImageFile(null);
      setCategories([]);
      setVendorName('');
      setVendorEmail('');
      setVendorPhone('');

      navigate("/pharmacylist");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">Create Pharmacy</h2>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium">Pharmacy Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border rounded focus:outline-blue-500"
            />
          </div>

          {/* Vendor Name */}
          <div>
            <label className="block mb-1 font-medium">Vendor Name</label>
            <input
              type="text"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              required
              className="w-full p-2 border rounded focus:outline-blue-500"
            />
          </div>

          {/* Vendor Email */}
          <div>
            <label className="block mb-1 font-medium">Vendor Email</label>
            <input
              type="email"
              value={vendorEmail}
              onChange={(e) => setVendorEmail(e.target.value)}
              required
              className="w-full p-2 border rounded focus:outline-blue-500"
            />
          </div>

          {/* Vendor Phone */}
          <div>
            <label className="block mb-1 font-medium">Vendor Phone</label>
            <input
              type="text"
              value={vendorPhone}
              onChange={(e) => setVendorPhone(e.target.value)}
              required
              className="w-full p-2 border rounded focus:outline-blue-500"
            />
          </div>

          {/* Coordinates */}
          <div>
            <label className="block mb-1 font-medium">Latitude</label>
            <input
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              step="any"
              required
              className="w-full p-2 border rounded focus:outline-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Longitude</label>
            <input
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              step="any"
              required
              className="w-full p-2 border rounded focus:outline-blue-500"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block mb-1 font-medium">Pharmacy Image URL (optional)</label>
            <input
              type="url"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Upload Image */}
          <div>
            <label className="block mb-1 font-medium">Upload Pharmacy Image (optional)</label>
            <label className="flex items-center p-2 border-2 border-dashed border-blue-400 rounded cursor-pointer hover:bg-blue-50 transition">
              <FaCloudUploadAlt className="text-xl mr-2 text-blue-600" />
              {imageFile ? imageFile.name : 'Choose File'}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Categories */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Categories</h3>
            <button
              type="button"
              onClick={addCategory}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              + Add Category
            </button>
          </div>

          {categories.map((cat, index) => (
            <div key={index} className="grid md:grid-cols-3 gap-4 items-end mb-4 border p-3 rounded">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium">Category Name</label>
                <input
                  type="text"
                  value={cat.name}
                  onChange={(e) => updateCategory(index, 'name', e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium">Category Image URL (optional)</label>
                <input
                  type="url"
                  value={cat.imageURL}
                  onChange={(e) => updateCategory(index, 'imageURL', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Upload */}
              <div>
                <label className="block text-sm font-medium mb-1">Upload Category Image</label>
                <label className="flex items-center p-2 border-2 border-dashed border-blue-300 rounded cursor-pointer hover:bg-blue-50">
                  <FaCloudUploadAlt className="mr-2 text-blue-600" />
                  {cat.imageFile ? cat.imageFile.name : 'Choose File'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => updateCategory(index, 'imageFile', e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="md:col-span-3 text-right mt-2">
                <button
                  type="button"
                  onClick={() => removeCategory(index)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Remove Category
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Create Pharmacy
          </button>
        </div>
      </form>
    </div>
  );
}
