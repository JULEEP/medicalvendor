import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const VendorLoginPage = () => {
  const [vendorId, setVendorId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://31.97.206.144:7021/api/vendor/login', {
        vendorId,
        password,
      });

      const { vendor } = response.data;

      // ✅ Use MongoDB _id as vendorId
      localStorage.setItem('vendorId', vendor.id); // <-- this is _id from DB
      localStorage.setItem('vendorName', vendor.vendorName);
      localStorage.setItem('vendorEmail', vendor.vendorEmail);
      localStorage.setItem('vendorPhone', vendor.vendorPhone);
      localStorage.setItem('pharmacyName', vendor.pharmacyName);
      localStorage.setItem('pharmacyImage', vendor.pharmacyImage);
      localStorage.setItem('pharmacyLocation', JSON.stringify(vendor.location));

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4 py-12">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-xl max-w-5xl w-full flex overflow-hidden" style={{ height: '80vh' }}>
        
        {/* Left side - Login Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-10 flex flex-col justify-center h-full">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text mb-6 text-center">
            SIMCURARX Vendor Login
          </h1>

          {error && (
            <div className="p-3 text-red-600 bg-red-100 rounded-md shadow-sm text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="vendorId" className="block text-sm font-medium text-gray-700">
                Vendor ID
              </label>
              <input
                type="text"
                id="vendorId"
                value={vendorId}
                onChange={(e) => setVendorId(e.target.value)}
                placeholder="Enter your Vendor ID"
                required
                className="w-full px-4 py-3 mt-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 mt-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 text-white text-sm font-medium rounded-md transition duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-purple-300 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Register link */}
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
              Register here
            </Link>
          </p>
        </div>

        {/* Right side - Image */}
        <div className="hidden md:block md:w-1/2 h-full">
          <img
            src="https://static.vecteezy.com/system/resources/previews/000/349/137/original/pharmacy-with-nurse-in-counter-vector.jpg"
            alt="Pharmacy with Nurse"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default VendorLoginPage;
