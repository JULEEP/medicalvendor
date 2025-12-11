import React, { useState } from 'react';

const CreateBusinessCard = () => {
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [inStock, setInStock] = useState(false);
  const [images, setImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file)); // Preview images
    setImages(imageUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!name || !jobTitle || !company || !phone || !email) {
      setErrorMessage('All fields are required');
      return;
    }

    // Prepare data to be sent to the server (simulate submission here)
    const businessCardData = {
      name,
      jobTitle,
      company,
      phone,
      email,
      inStock,
      images,
    };

    // Simulating API call to create a business card (replace with actual API call)
    try {
      console.log('Business Card Created:', businessCardData);
      alert('Business card created successfully!');
      // Reset form after success
      setName('');
      setJobTitle('');
      setCompany('');
      setPhone('');
      setEmail('');
      setInStock(false);
      setImages([]);
    } catch (error) {
      console.error('Error creating business card:', error);
      setErrorMessage('Error creating business card. Please try again.');
    }
  };

  return (
    <div className="container p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-6 text-center text-blue-900">Create New Business Card</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-medium mb-2">Full Name</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">Job Title</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Enter your job title"
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">Company</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Enter your company name"
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">Phone</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">Email</label>
            <input
              type="email"
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
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
            <span className="ml-2">Available for sale</span>
          </div>

          {/* Image Upload Section */}
          <div className="col-span-2">
            <label className="block text-lg font-medium mb-2">Upload Images</label>
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
        </div>

        {errorMessage && <p className="text-red-600 text-center">{errorMessage}</p>}

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-900 text-white p-3 rounded-lg shadow-md hover:bg-blue-900 transition duration-300"
          >
            Create Business Card
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBusinessCard;
