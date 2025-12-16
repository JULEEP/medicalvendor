import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCloudUploadAlt, FaTimes, FaEye, FaStore, FaUser, FaMapMarkerAlt, FaIdCard, FaFileSignature, FaShieldAlt, FaExclamationTriangle, FaCrosshairs } from 'react-icons/fa';
import { Link } from "react-router-dom";

const VendorRegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    image: null,
    latitude: '',
    longitude: '',
    address: '',
    categories: [{ name: '', image: null }],
    vendorName: '',
    vendorEmail: '',
    vendorPhone: '',
    aadhar: '',
    aadharFile: null,
    panCard: '',
    panCardFile: null,
    license: '',
    licenseFile: null,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [imagePreviews, setImagePreviews] = useState({
    image: null,
    aadharFile: null,
    panCardFile: null,
    licenseFile: null,
    categoryImages: []
  });
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const navigate = useNavigate();

  // ✅ GET CURRENT LOCATION FUNCTION
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setFormData(prev => ({
          ...prev,
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6)
        }));

        setIsGettingLocation(false);

        // Optional: Auto-fill address using reverse geocoding
        reverseGeocode(latitude, longitude);
      },
      (error) => {
        setIsGettingLocation(false);
        let errorMessage = 'Location access denied or failed';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please allow location access or enter manually.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable. Please enter manually.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again or enter manually.';
            break;
          default:
            errorMessage = 'An unknown error occurred. Please enter location manually.';
            break;
        }

        setError(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // ✅ OPTIONAL: REVERSE GEOCODING FOR ADDRESS
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();

      if (data && data.display_name) {
        setFormData(prev => ({
          ...prev,
          address: data.display_name
        }));
      }
      console.log('Reverse geocoding successful:', data);
    } catch (error) {
      console.log('Reverse geocoding failed, user can enter address manually');
    }
  };

  // File preview generator
  const generatePreview = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  };

  const handleChange = async (e, categoryIndex, isCategory = false) => {
    const { name, value, files } = e.target;

    // Clear missing fields when user starts typing
    if (missingFields.length > 0) {
      setMissingFields([]);
      setError('');
    }

    if (isCategory) {
      setFormData((prev) => {
        const categories = [...prev.categories];
        if (name === 'image') {
          categories[categoryIndex].image = files[0];

          // Generate preview for category image
          if (files[0]) {
            generatePreview(files[0]).then(preview => {
              setImagePreviews(prevPreviews => {
                const categoryImages = [...prevPreviews.categoryImages];
                categoryImages[categoryIndex] = preview;
                return { ...prevPreviews, categoryImages };
              });
            });
          }
        } else {
          categories[categoryIndex].name = value;
        }
        return { ...prev, categories };
      });
    } else {
      if (files) {
        setFormData((prev) => ({ ...prev, [name]: files[0] }));

        // Generate preview for main files
        if (files[0]) {
          const preview = await generatePreview(files[0]);
          setImagePreviews(prev => ({ ...prev, [name]: preview }));
        }
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  // Remove file function
  const removeFile = (fieldName, categoryIndex = null) => {
    if (categoryIndex !== null) {
      // Remove category image
      setFormData(prev => {
        const categories = [...prev.categories];
        categories[categoryIndex].image = null;
        return { ...prev, categories };
      });

      setImagePreviews(prev => {
        const categoryImages = [...prev.categoryImages];
        categoryImages[categoryIndex] = null;
        return { ...prev, categoryImages };
      });
    } else {
      // Remove main file
      setFormData(prev => ({ ...prev, [fieldName]: null }));
      setImagePreviews(prev => ({ ...prev, [fieldName]: null }));

      // Reset file input
      const fileInput = document.getElementById(fieldName);
      if (fileInput) fileInput.value = '';
    }
  };

  const addCategory = () => {
    setFormData((prev) => ({
      ...prev,
      categories: [...prev.categories, { name: '', image: null }],
    }));
    setImagePreviews(prev => ({
      ...prev,
      categoryImages: [...prev.categoryImages, null]
    }));
  };

  const removeCategory = (index) => {
    setFormData((prev) => {
      const categories = [...prev.categories];
      categories.splice(index, 1);
      return { ...prev, categories };
    });

    setImagePreviews(prev => {
      const categoryImages = [...prev.categoryImages];
      categoryImages.splice(index, 1);
      return { ...prev, categoryImages };
    });
  };

  // Function to validate all fields
  const validateForm = () => {
    const missing = [];

    // Pharmacy Information
    if (!formData.name.trim()) missing.push('Pharmacy Name');
    if (!formData.image) missing.push('Pharmacy Image');
    if (!formData.latitude.trim()) missing.push('Latitude');
    if (!formData.longitude.trim()) missing.push('Longitude');
    if (!formData.address.trim()) missing.push('Address');

    // Categories Validation
    formData.categories.forEach((category, index) => {
      if (!category.name.trim()) missing.push(`Category ${index + 1} Name`);
      if (!category.image) missing.push(`Category ${index + 1} Image`);
    });

    // Vendor Details
    if (!formData.vendorName.trim()) missing.push('Vendor Name');
    if (!formData.vendorEmail.trim()) missing.push('Vendor Email');
    if (!formData.vendorPhone.trim()) missing.push('Vendor Phone');
    if (!formData.aadhar.trim()) missing.push('Aadhar Number');

    // Document Uploads
    if (!formData.aadharFile) missing.push('Aadhar Document');
    if (!formData.panCard.trim()) missing.push('PAN Card Number');
    if (!formData.panCardFile) missing.push('PAN Card Document');
    if (!formData.license.trim()) missing.push('License Number');
    if (!formData.licenseFile) missing.push('License Document');

    return missing;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setMissingFields([]);
    setIsLoading(true);

    const missingFieldsList = validateForm();

    if (missingFieldsList.length > 0) {
      setMissingFields(missingFieldsList);
      setError(`Please fill in all required fields (${missingFieldsList.length} missing)`);
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('latitude', formData.latitude);
      data.append('longitude', formData.longitude);
      data.append('address', formData.address);
      data.append('vendorName', formData.vendorName);
      data.append('vendorEmail', formData.vendorEmail);
      data.append('vendorPhone', formData.vendorPhone);
      data.append('aadhar', formData.aadhar);
      data.append('panCard', formData.panCard);
      data.append('license', formData.license);

      if (formData.image) data.append('image', formData.image);
      if (formData.aadharFile) data.append('aadharFile', formData.aadharFile);
      if (formData.panCardFile) data.append('panCardFile', formData.panCardFile);
      if (formData.licenseFile) data.append('licenseFile', formData.licenseFile);

      formData.categories.forEach((cat) => {
        if (cat.image) data.append('categoryImages', cat.image);
      });

      const categoryNamesOnly = formData.categories.map((cat) => ({ name: cat.name }));
      data.append('categories', JSON.stringify(categoryNamesOnly));

      const response = await axios.post(
        'http://31.97.206.144:7021/api/pharmacy/create-pharmacy',
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const successMessage = `Pharmacy registered successfully!\n\nYour Vendor ID: ${response.data.vendorCredentials.vendorId}\nPassword: ${response.data.vendorCredentials.password}`;

      // Set in UI
      setSuccess(successMessage);

      // Show as alert
      window.alert(successMessage);

      // Redirect after a short delay
      setTimeout(() => navigate('/login'), 5000);

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // File preview component
  const FilePreview = ({ file, preview, fieldName, categoryIndex = null, isImage = true }) => {
    if (!file) return null;

    return (
      <div className="mt-2 p-3 border border-blue-200 rounded-lg bg-blue-50 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isImage && preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-12 h-12 object-cover rounded-lg border-2 border-blue-200 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => window.open(preview, '_blank')}
                  className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-1 text-xs shadow-md hover:bg-blue-600 transition-colors"
                  title="View Full Image"
                >
                  <FaEye size={8} />
                </button>
              </div>
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center border-2 border-blue-200 shadow-sm">
                <span className="text-xs font-bold text-blue-600">PDF</span>
              </div>
            )}
            <div>
              <span className="text-sm font-semibold text-gray-800 block">{file.name}</span>
              <span className="text-xs text-gray-600 font-medium">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => removeFile(fieldName, categoryIndex)}
            className="text-red-500 hover:text-red-700 p-1 transition-colors bg-red-50 rounded-full hover:bg-red-100"
            title="Remove File"
          >
            <FaTimes />
          </button>
        </div>
      </div>
    );
  };

  // Function to highlight missing fields
  const isFieldMissing = (fieldName) => {
    return missingFields.includes(fieldName);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 px-4 py-8">
      <div className="bg-white/95 backdrop-blur-lg shadow-2xl rounded-2xl max-w-6xl w-full p-8 sm:p-10 border border-white/50">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl shadow-lg">
              <FaStore className="text-white text-3xl" />
            </div>
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text mb-2">
            SIMCURARX Vendor Registration
          </h1>
          <p className="text-gray-600 font-medium">Join our network of trusted pharmacy partners</p>
        </div>

        {/* Error Display with Missing Fields */}
        {error && (
          <div className="p-4 text-red-700 bg-red-50 border border-red-200 rounded-xl shadow-sm text-sm mb-6">
            <div className="flex items-center mb-2">
              <FaExclamationTriangle className="mr-2 text-red-500" />
              <span className="font-bold">{error}</span>
            </div>
            {missingFields.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold mb-1">Missing Fields:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                  {missingFields.map((field, index) => (
                    <div key={index} className="flex items-center text-xs">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      {field}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {success && (
          <div className="p-4 text-green-700 bg-green-50 border border-green-200 rounded-xl shadow-sm text-sm mb-6 flex items-center">
            <FaShieldAlt className="mr-2 text-green-500" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pharmacy Information Section */}
          <div className={`bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border ${isFieldMissing('Pharmacy Name') || isFieldMissing('Pharmacy Image') || isFieldMissing('Latitude') || isFieldMissing('Longitude') || isFieldMissing('Address') ? 'border-red-300 ring-2 ring-red-100' : 'border-blue-100'} shadow-sm transition-all`}>
            <div className="flex items-center mb-4">
              <FaStore className="text-blue-600 mr-3 text-lg" />
              <h2 className="text-xl font-bold text-gray-800">Pharmacy Information</h2>
            </div>

            <div className="space-y-4">
              {/* Pharmacy Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pharmacy Name *
                  {isFieldMissing('Pharmacy Name') && <span className="text-red-500 ml-2">← This field is required</span>}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter pharmacy name"
                  required
                  className={`w-full px-4 py-3 text-sm border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${isFieldMissing('Pharmacy Name')
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                    }`}
                />
              </div>

              {/* Pharmacy Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pharmacy Image *
                  {isFieldMissing('Pharmacy Image') && <span className="text-red-500 ml-2">← This field is required</span>}
                </label>
                <label
                  htmlFor="image"
                  className={`flex items-center px-6 py-3 text-white rounded-xl cursor-pointer transition-all shadow-lg w-fit font-semibold ${isFieldMissing('Pharmacy Image')
                    ? 'bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                    }`}
                >
                  <FaCloudUploadAlt className="mr-3" /> Upload Pharmacy Image
                </label>
                <input
                  type="file"
                  name="image"
                  id="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                  required
                />
                <FilePreview
                  file={formData.image}
                  preview={imagePreviews.image}
                  fieldName="image"
                  isImage={true}
                />
              </div>

              {/* Location Information with Clickable Icon */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Latitude *
                    {isFieldMissing('Latitude') && <span className="text-red-500 ml-2">← Required</span>}
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="Enter latitude"
                    required
                    className={`w-full px-4 py-3 text-sm border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${isFieldMissing('Latitude')
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                      }`}
                  />
                </div>

                {/* ✅ UPDATED: Clickable Location Icon */}
                <div className="md:col-span-2 flex items-center justify-center h-full pb-2">
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
                    title="Get Current Location"
                  >
                    {isGettingLocation ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    ) : (
                      <FaCrosshairs className="text-white text-xl group-hover:text-blue-100" />
                    )}
                  </button>
                </div>

                <div className="md:col-span-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Longitude *
                    {isFieldMissing('Longitude') && <span className="text-red-500 ml-2">← Required</span>}
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="Enter longitude"
                    required
                    className={`w-full px-4 py-3 text-sm border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${isFieldMissing('Longitude')
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                      }`}
                  />
                </div>
              </div>

              {/* Location Button Info */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl text-sm font-semibold hover:from-green-600 hover:to-teal-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGettingLocation ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Getting Location...
                    </>
                  ) : (
                    <>
                      <FaCrosshairs className="mr-2" />
                      Auto-detect My Location
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Click to automatically fill latitude and longitude using your current location
                </p>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address *
                  {isFieldMissing('Address') && <span className="text-red-500 ml-2">← This field is required</span>}
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter complete pharmacy address"
                  rows={3}
                  required
                  className={`w-full px-4 py-3 text-sm border-2 rounded-xl focus:outline-none focus:ring-2 transition-all resize-none ${isFieldMissing('Address')
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                    }`}
                />
              </div>
            </div>
          </div>

          {/* Rest of the form remains the same */}
          {/* Categories Section */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FaFileSignature className="text-purple-600 mr-3 text-lg" />
                <h2 className="text-xl font-bold text-gray-800">Product Categories</h2>
              </div>
              <button
                type="button"
                onClick={addCategory}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg font-semibold text-sm"
              >
                + Add Category
              </button>
            </div>

            {formData.categories.map((cat, index) => {
              const isCategoryNameMissing = isFieldMissing(`Category ${index + 1} Name`);
              const isCategoryImageMissing = isFieldMissing(`Category ${index + 1} Image`);

              return (
                <div
                  key={index}
                  className={`mb-4 p-4 border-2 rounded-xl bg-white shadow-sm ${isCategoryNameMissing || isCategoryImageMissing
                    ? 'border-red-300 ring-2 ring-red-100'
                    : 'border-purple-100'
                    } transition-all`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category Name *
                        {isCategoryNameMissing && <span className="text-red-500 ml-2">← Required</span>}
                      </label>
                      <input
                        type="text"
                        placeholder="Enter category name"
                        value={cat.name}
                        onChange={(e) => handleChange(e, index, true)}
                        name="name"
                        required
                        className={`w-full px-4 py-3 text-sm border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${isCategoryNameMissing
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50'
                          : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200'
                          }`}
                      />
                    </div>
                    <div className="flex items-end space-x-4">
                      <label
                        htmlFor={`categoryImage${index}`}
                        className={`flex items-center px-4 py-3 text-white rounded-xl cursor-pointer transition-all shadow-lg text-sm font-semibold flex-1 justify-center ${isCategoryImageMissing
                          ? 'bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                          }`}
                      >
                        <FaCloudUploadAlt className="mr-2" /> Upload Image
                      </label>
                      <input
                        id={`categoryImage${index}`}
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={(e) => handleChange(e, index, true)}
                        className="hidden"
                        required
                      />
                      {formData.categories.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCategory(index)}
                          className="text-red-500 hover:text-red-700 text-lg p-2 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                          title="Remove Category"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  </div>
                  <FilePreview
                    file={cat.image}
                    preview={imagePreviews.categoryImages[index]}
                    fieldName="image"
                    categoryIndex={index}
                    isImage={true}
                  />
                </div>
              );
            })}
          </div>

          {/* Vendor Details Section */}
          <div className={`bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-2xl border ${isFieldMissing('Vendor Name') || isFieldMissing('Vendor Email') || isFieldMissing('Vendor Phone')
            ? 'border-red-300 ring-2 ring-red-100'
            : 'border-indigo-100'
            } shadow-sm transition-all`}>
            <div className="flex items-center mb-4">
              <FaUser className="text-indigo-600 mr-3 text-lg" />
              <h2 className="text-xl font-bold text-gray-800">Vendor Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Vendor Name *
                  {isFieldMissing('Vendor Name') && <span className="text-red-500 ml-2">← Required</span>}
                </label>
                <input
                  type="text"
                  name="vendorName"
                  value={formData.vendorName}
                  onChange={handleChange}
                  placeholder="Enter vendor full name"
                  required
                  className={`w-full px-4 py-3 text-sm border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${isFieldMissing('Vendor Name')
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50'
                    : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-200'
                    }`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Vendor Email *
                  {isFieldMissing('Vendor Email') && <span className="text-red-500 ml-2">← Required</span>}
                </label>
                <input
                  type="email"
                  name="vendorEmail"
                  value={formData.vendorEmail}
                  onChange={handleChange}
                  placeholder="Enter vendor email address"
                  required
                  className={`w-full px-4 py-3 text-sm border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${isFieldMissing('Vendor Email')
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50'
                    : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-200'
                    }`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Vendor Phone *
                  {isFieldMissing('Vendor Phone') && <span className="text-red-500 ml-2">← Required</span>}
                </label>
                <input
                  type="text"
                  name="vendorPhone"
                  value={formData.vendorPhone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // digits only
                    if (value.length <= 10) {
                      handleChange({
                        target: { name: "vendorPhone", value }
                      });
                    }
                  }}
                  placeholder="Enter vendor phone number"
                  minLength={10}
                  maxLength={10}
                  required
                  className={`w-full px-4 py-3 text-sm border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${isFieldMissing('Vendor Phone')
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50'
                    : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-200'
                    }`}
                />
              </div>
            </div>
          </div>

          {/* Document Uploads Section */}
          <div className={`bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl border ${isFieldMissing('Aadhar Number') || isFieldMissing('Aadhar Document') || isFieldMissing('PAN Card Number') || isFieldMissing('PAN Card Document') || isFieldMissing('License Number') || isFieldMissing('License Document')
            ? 'border-red-300 ring-2 ring-red-100'
            : 'border-orange-100'
            } shadow-sm transition-all`}>
            <div className="flex items-center mb-4">
              <FaIdCard className="text-orange-600 mr-3 text-lg" />
              <h2 className="text-xl font-bold text-gray-800">Required Documents</h2>
            </div>

            <div className="space-y-6">
              {/* Aadhar - Number and Upload Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Aadhar Number *
                    {isFieldMissing('Aadhar Number') && <span className="text-red-500 ml-2">← Required</span>}
                  </label>
                  <input
                    type="number"
                    name="aadhar"
                    value={formData.aadhar}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ""); // allow only digits
                      if (value.length <= 12) {
                        handleChange({
                          target: { name: "aadhar", value },
                        });
                      }
                    }}
                    placeholder="Enter Aadhar number"
                    maxLength={12}
                    minLength={12}
                    required
                    className={`w-full px-4 py-3 text-sm border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${isFieldMissing('Aadhar Number')
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50'
                      : 'border-gray-200 focus:border-orange-500 focus:ring-orange-200'
                      }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Aadhar Document (image/pdf) *
                    {isFieldMissing('Aadhar Document') && <span className="text-red-500 ml-2">← Required</span>}
                  </label>
                  <label
                    htmlFor="aadharFile"
                    className={`flex items-center px-4 py-3 text-white rounded-xl cursor-pointer transition-all shadow-lg w-full font-semibold justify-center ${isFieldMissing('Aadhar Document')
                      ? 'bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700'
                      : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                      }`}
                  >
                    <FaCloudUploadAlt className="mr-2" /> Upload Aadhar Document
                  </label>
                  <input
                    type="file"
                    name="aadharFile"
                    id="aadharFile"
                    accept="image/*,.pdf"
                    onChange={handleChange}
                    className="hidden"
                    required
                  />
                  <FilePreview
                    file={formData.aadharFile}
                    preview={imagePreviews.aadharFile}
                    fieldName="aadharFile"
                    isImage={formData.aadharFile?.type?.includes('image')}
                  />
                </div>
              </div>

              {/* PAN Card - Number and Upload Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    PAN Card Number *
                    {isFieldMissing('PAN Card Number') && <span className="text-red-500 ml-2">← Required</span>}
                  </label>
                  <input
                    type="text"
                    name="panCard"
                    value={formData.panCard}
                    onChange={handleChange}
                    placeholder="Enter PAN Card number"
                    required
                    className={`w-full px-4 py-3 text-sm border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${isFieldMissing('PAN Card Number')
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50'
                      : 'border-gray-200 focus:border-orange-500 focus:ring-orange-200'
                      }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    PAN Card Document (image/pdf) *
                    {isFieldMissing('PAN Card Document') && <span className="text-red-500 ml-2">← Required</span>}
                  </label>
                  <label
                    htmlFor="panCardFile"
                    className={`flex items-center px-4 py-3 text-white rounded-xl cursor-pointer transition-all shadow-lg w-full font-semibold justify-center ${isFieldMissing('PAN Card Document')
                      ? 'bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700'
                      : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                      }`}
                  >
                    <FaCloudUploadAlt className="mr-2" /> Upload PAN Card
                  </label>
                  <input
                    type="file"
                    name="panCardFile"
                    id="panCardFile"
                    accept="image/*,.pdf"
                    onChange={handleChange}
                    className="hidden"
                    required
                  />
                  <FilePreview
                    file={formData.panCardFile}
                    preview={imagePreviews.panCardFile}
                    fieldName="panCardFile"
                    isImage={formData.panCardFile?.type?.includes('image')}
                  />
                </div>
              </div>

              {/* License - Number and Upload Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    License Number *
                    {isFieldMissing('License Number') && <span className="text-red-500 ml-2">← Required</span>}
                  </label>
                  <input
                    type="text"
                    name="license"
                    value={formData.license}
                    onChange={handleChange}
                    placeholder="Enter License number"
                    required
                    className={`w-full px-4 py-3 text-sm border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${isFieldMissing('License Number')
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50'
                      : 'border-gray-200 focus:border-orange-500 focus:ring-orange-200'
                      }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    License Document (image/pdf) *
                    {isFieldMissing('License Document') && <span className="text-red-500 ml-2">← Required</span>}
                  </label>
                  <label
                    htmlFor="licenseFile"
                    className={`flex items-center px-4 py-3 text-white rounded-xl cursor-pointer transition-all shadow-lg w-full font-semibold justify-center ${isFieldMissing('License Document')
                      ? 'bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700'
                      : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                      }`}
                  >
                    <FaCloudUploadAlt className="mr-2" /> Upload License
                  </label>
                  <input
                    type="file"
                    name="licenseFile"
                    id="licenseFile"
                    accept="image/*,.pdf"
                    onChange={handleChange}
                    className="hidden"
                    required
                  />
                  <FilePreview
                    file={formData.licenseFile}
                    preview={imagePreviews.licenseFile}
                    fieldName="licenseFile"
                    isImage={formData.licenseFile?.type?.includes('image')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div className="text-center pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full max-w-md mx-auto py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-lg font-black hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-2xl hover:shadow-3xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Processing Registration...
                </div>
              ) : (
                "🚀 Register Pharmacy"
              )}
            </button>

            {/* Login Link */}
            <p className="mt-6 text-center text-sm text-gray-600 font-medium">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-800 font-bold underline hover:no-underline transition-colors"
              >
                Login here
              </Link>
            </p>

            <div className="mt-4 text-xs text-gray-500 font-medium">
              <p>All fields marked with * are required</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorRegisterPage;