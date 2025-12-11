import React, { useState } from 'react';

const CreateLogo = () => {
  const [logoName, setLogoName] = useState('');
  const [description, setDescription] = useState('');
  const [logoImage, setLogoImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoImage(URL.createObjectURL(file)); // Preview the image
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!logoName || !description || !logoImage) {
      setErrorMessage('All fields are required');
      return;
    }

    // Submit the form data (For now, just logging to console)
    console.log({
      logoName,
      description,
      logoImage,
    });

    // Reset form after submission
    setLogoName('');
    setDescription('');
    setLogoImage(null);
    setErrorMessage('');
  };

  return (
    <div className="container p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-6 text-center text-blue-900">Create Logo</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-medium mb-2">Logo Name</label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={logoName}
            onChange={(e) => setLogoName(e.target.value)}
            placeholder="Enter logo name"
          />
        </div>

        <div>
          <label className="block text-lg font-medium mb-2">Description</label>
          <textarea
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter logo description"
            rows="4"
          />
        </div>

        <div>
          <label className="block text-lg font-medium mb-2">Logo Image</label>
          <input
            type="file"
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none"
            accept="image/*"
            onChange={handleImageChange}
          />
          <div className="mt-2">
            {logoImage && (
              <img src={logoImage} alt="Logo Preview" className="w-32 h-32 object-cover rounded-lg" />
            )}
          </div>
        </div>

        {errorMessage && <p className="text-red-600 text-center">{errorMessage}</p>}

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-900 text-white p-3 rounded-lg shadow-md hover:bg-blue-900 transition duration-300"
          >
            Create Logo
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateLogo;
