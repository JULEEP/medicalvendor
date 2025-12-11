import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CompanyLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Simple validation
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://credenhealth.onrender.com/api/admin/login-company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Using the provided credentials
      });

      const data = await response.json();

      if (response.ok) {
        // Login Success
        console.log('Login successful:', data);

        // Save token and company info to localStorage
        if (data.token) {
          localStorage.setItem('authToken', data.token); // Save token
          console.log('Token saved to localStorage:', data.token); // Log the token to the console
        }

        if (data.company && data.company.id) {
          localStorage.setItem('companyId', data.company.id); // Save company ID
          console.log('Company ID saved to localStorage:', data.company.id); // Log the company ID to the console
        }

        if (data.company && data.company.name) {
          localStorage.setItem('companyName', data.company.name); // Save company name
          console.log('Company Name saved to localStorage:', data.company.name); // Log the company name to the console
        }

        // Show success message
        setSuccessMessage('Login successful! Token and Company info saved.');

        // Redirecting to the dashboard
        navigate('/company/companydashboard');
      } else {
        // Handle API errors
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      // Handle network errors
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10">
      <div className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-2xl overflow-hidden max-w-4xl w-full">
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8 space-y-6">
          <h2 className="text-3xl font-bold text-center text-gray-800">Company Login</h2>
          {error && (
            <div className="p-3 text-red-600 bg-red-100 rounded-md shadow-sm">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="p-3 text-green-600 bg-green-100 rounded-md shadow-sm">
              {successMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-teal-500 focus:border-teal-600 transition duration-200"
                placeholder="you@domain.com"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-teal-500 focus:border-teal-600 transition duration-200"
                placeholder="********"
              />
            </div>
            <button
              type="submit"
              className={`w-full p-3 text-white bg-teal-600 rounded-md hover:bg-teal-700 transition duration-200 transform ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-1/2 flex justify-center p-4 md:p-0">
          <img
            src="https://cdn.dribbble.com/users/1484145/screenshots/14189309/media/2fbcc156efddc5d526e6ccab31a7df84.png?compress=1&resize=1200x900"
            alt="Company Login Illustration"
            className="object-cover w-full h-auto rounded-lg md:rounded-none"
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyLoginPage;
