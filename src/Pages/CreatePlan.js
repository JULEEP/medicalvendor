import React, { useState } from "react";
import axios from "axios";

const CreatePlan = () => {
  const [name, setName] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [duration, setDuration] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [features, setFeatures] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddFeature = () => {
    if (featureInput.trim() !== "") {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (index) => {
    const updatedFeatures = [...features];
    updatedFeatures.splice(index, 1);
    setFeatures(updatedFeatures);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !originalPrice || !offerPrice || !discountPercentage || !duration || features.length === 0) {
      setErrorMessage("Please fill in all fields and add at least one feature.");
      return;
    }

    const data = {
      name,
      originalPrice,
      offerPrice,
      discountPercentage,
      duration,
      features,
    };

    try {
      const response = await axios.post("https://posterbnaobackend.onrender.com/api/plans/create-plan", data);
      alert("Plan created successfully!");
      console.log("Response:", response.data);

      // Reset form
      setName("");
      setOriginalPrice("");
      setOfferPrice("");
      setDiscountPercentage("");
      setDuration("");
      setFeatures([]);
      setErrorMessage("");
    } catch (error) {
      console.error("Error creating plan:", error);
      setErrorMessage("Failed to create plan. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded p-6">
      <h2 className="text-2xl font-semibold mb-4 text-blue-900">Create New Plan</h2>

      {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className="w-full p-3 border rounded"
          placeholder="Plan Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            className="w-full p-3 border rounded"
            placeholder="Original Price"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
          />
          <input
            type="number"
            className="w-full p-3 border rounded"
            placeholder="Offer Price"
            value={offerPrice}
            onChange={(e) => setOfferPrice(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            className="w-full p-3 border rounded"
            placeholder="Discount Percentage"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
          />
          <input
            type="text"
            className="w-full p-3 border rounded"
            placeholder="Duration (e.g. 1 Year)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>

        <div className="border rounded p-3">
          <label className="block text-lg font-medium mb-2">Add Features</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Type a feature and click Add"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAddFeature}
              className="bg-blue-500 text-white px-4 rounded"
            >
              Add
            </button>
          </div>
          <ul className="list-disc list-inside space-y-1">
            {features.map((feature, index) => (
              <li key={index} className="flex justify-between items-center">
                {feature}
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-900 text-white p-3 rounded hover:bg-blue-800 transition"
        >
          Create Plan
        </button>
      </form>
    </div>
  );
};

export default CreatePlan;
