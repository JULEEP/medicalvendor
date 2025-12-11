import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const PlanList = () => {
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const plansPerPage = 5;

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get("https://posterbnaobackend.onrender.com/api/plans/getallplan");
      setPlans(response.data.plans || []);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setSelectedPlan((prev) => ({
      ...prev,
      [name]: name === "features" ? value.split(",") : value,
    }));
  };

  const handleModalSubmit = async () => {
    try {
      // Add API call to update the plan
      await axios.put(`https://posterbnaobackend.onrender.com/api/plans/update/${selectedPlan._id}`, selectedPlan);
      setIsModalOpen(false);
      fetchPlans();
      alert("Plan updated successfully.");
    } catch (error) {
      console.error("Error updating plan:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        await axios.delete(`https://posterbnaobackend.onrender.com/api/plans/delete/${id}`);
        setPlans(plans.filter((plan) => plan._id !== id));
        alert("Plan deleted successfully.");
      } catch (error) {
        console.error("Error deleting plan:", error);
      }
    }
  };

  const filteredPlans = plans.filter((plan) =>
    plan.name.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastPlan = currentPage * plansPerPage;
  const indexOfFirstPlan = indexOfLastPlan - plansPerPage;
  const currentPlans = filteredPlans.slice(indexOfFirstPlan, indexOfLastPlan);
  const totalPages = Math.ceil(filteredPlans.length / plansPerPage);

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-blue-900">Plan List</h2>
        <input
          type="text"
          className="p-2 border rounded w-1/3"
          placeholder="Search by plan name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-purple-600 text-white">
            <tr>
              <th className="p-2 border">Sl</th>
              <th className="p-2 border">Plan Name</th>
              <th className="p-2 border">Original Price</th>
              <th className="p-2 border">Offer Price</th>
              <th className="p-2 border">Discount (%)</th>
              <th className="p-2 border">Duration</th>
              <th className="p-2 border">Features</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPlans.map((plan, index) => (
              <tr key={plan._id} className="border-b hover:bg-gray-50">
                <td className="p-2 border">{index + 1 + indexOfFirstPlan}</td>
                <td className="p-2 border">{plan.name}</td>
                <td className="p-2 border">₹{plan.originalPrice}</td>
                <td className="p-2 border">₹{plan.offerPrice}</td>
                <td className="p-2 border">{plan.discountPercentage}%</td>
                <td className="p-2 border">{plan.duration}</td>
                <td className="p-2 border">
                  <details>
                    <summary className="cursor-pointer text-blue-600">View</summary>
                    <ul className="list-disc list-inside mt-2 text-sm">
                      {plan.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </details>
                </td>
                <td className="p-2 border text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEdit(plan)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(plan._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Edit Modal */}
      {isModalOpen && selectedPlan && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Edit Plan</h3>
            <div className="space-y-3">
              <input
                type="text"
                name="name"
                value={selectedPlan.name}
                onChange={handleModalChange}
                className="w-full p-2 border rounded"
                placeholder="Plan Name"
              />
              <input
                type="number"
                name="originalPrice"
                value={selectedPlan.originalPrice}
                onChange={handleModalChange}
                className="w-full p-2 border rounded"
                placeholder="Original Price"
              />
              <input
                type="number"
                name="offerPrice"
                value={selectedPlan.offerPrice}
                onChange={handleModalChange}
                className="w-full p-2 border rounded"
                placeholder="Offer Price"
              />
              <input
                type="number"
                name="discountPercentage"
                value={selectedPlan.discountPercentage}
                onChange={handleModalChange}
                className="w-full p-2 border rounded"
                placeholder="Discount %"
              />
              <input
                type="text"
                name="duration"
                value={selectedPlan.duration}
                onChange={handleModalChange}
                className="w-full p-2 border rounded"
                placeholder="Duration"
              />
              <textarea
                name="features"
                value={selectedPlan.features.join(",")}
                onChange={handleModalChange}
                className="w-full p-2 border rounded"
                placeholder="Features (comma separated)"
              />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSubmit}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanList;
