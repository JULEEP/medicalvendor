import React, { useEffect, useState } from "react";
import axios from "axios";

const UsersPlansList = () => {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchUserPlans = async () => {
      try {
        const response = await axios.get("https://posterbnaobackend.onrender.com/api/admin/usersplans");
        if (response.data && response.data.users) {
          setUsersData(response.data.users);
        }
      } catch (err) {
        setError("Error fetching users with subscribed plans.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlans();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-blue-900 mb-6">Users with Subscribed Plans</h2>

      {usersData.length === 0 ? (
        <p>No users with subscribed plans found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="p-2 border">Sl</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Mobile</th>
                <th className="p-2 border">Subscribed Plans</th>
              </tr>
            </thead>
            <tbody>
              {usersData.map((user, index) => (
                <tr key={user.email} className="border-b hover:bg-gray-50">
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border">{user.name}</td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border">{user.mobile}</td>
                  <td className="p-2 border">
                    {user.subscribedPlans && user.subscribedPlans.length > 0 ? (
                      <ul className="list-disc list-inside mt-2 text-sm">
                        {user.subscribedPlans.map((plan, i) => (
                          <li key={i}>
                            <strong>{plan.name}</strong><br />
                            <span>Original Price: ₹{plan.originalPrice}</span><br />
                            <span>Offer Price: ₹{plan.offerPrice}</span><br />
                            <span>Discount: {plan.discountPercentage}%</span><br />
                            <span>Duration: {plan.duration}</span><br />
                            <span>Start Date: {new Date(plan.startDate).toLocaleDateString()}</span><br />
                            <span>End Date: {new Date(plan.endDate).toLocaleDateString()}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span>No subscribed plans</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersPlansList;
