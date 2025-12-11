import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreatePoster = () => {
  const [name, setName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState('');
  const [festivalDate, setFestivalDate] = useState('');
  const [size, setSize] = useState('');
  const [inStock, setInStock] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [categories, setCategories] = useState([]);

  // Fetch categories from the API
  useEffect(() => {
    axios
      .get('https://posterbnaobackend.onrender.com/api/category/getall-cateogry')
      .then((response) => {
        if (response.data.success) {
          setCategories(response.data.categories);
        }
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file)); // Preview images
    setImages(imageUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !categoryName || !price || !images.length || !description || !festivalDate || !size) {
      setErrorMessage('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('categoryName', categoryName);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('festivalDate', festivalDate);
    formData.append('size', size);
    formData.append('inStock', inStock);

    // Append images to the formData
    images.forEach((image) => formData.append('images', image));

    try {
      const response = await axios.post('https://posterbnaobackend.onrender.com/api/poster/create-poster', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Poster created:', response.data);
      alert('Poster created successfully!');
      // Reset form after success
      setName('');
      setCategoryName('');
      setPrice('');
      setImages([]);
      setDescription('');
      setFestivalDate('');
      setSize('');
      setInStock(false);
    } catch (error) {
      console.error('Error creating poster:', error);
      setErrorMessage('Error creating poster. Please try again.');
    }
  };

  return (
    <div className="container p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-6 text-center text-blue-900">Create New Poster</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-lg font-medium mb-2">Poster Name</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter poster name"
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">Category Name</label>
            <select
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            >
              <option value="" disabled>Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category.categoryName}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">Price</label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">Images</label>
            <input
              type="file"
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
            <div className="mt-2">
              {images.length > 0 && (
                <div className="flex space-x-2">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`preview-${index}`}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">Description</label>
            <textarea
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter poster description"
              rows="4"
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">Festival Date</label>
            <input
              type="date"
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={festivalDate}
              onChange={(e) => setFestivalDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">Size</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="Enter size (e.g. A4, A3)"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-lg font-medium mb-2">In Stock</label>
            <input
              type="checkbox"
              className="p-3"
              checked={inStock}
              onChange={() => setInStock(!inStock)}
            />
          </div>
        </div>

        {errorMessage && <p className="text-red-600 text-center">{errorMessage}</p>}

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-900 text-white p-3 rounded-lg shadow-md hover:bg-blue-900 transition duration-300"
          >
            Create Poster
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePoster;
