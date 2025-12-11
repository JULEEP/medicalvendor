import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function PharmacyDetails() {
  const { pharmacyId } = useParams();
  const navigate = useNavigate();

  const [pharmacy, setPharmacy] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPharmacy = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `http://31.97.206.144:7021/api/pharmacy/singlepharmacy/${pharmacyId}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch pharmacy");

        setPharmacy(data.pharmacy);
        setMedicines(data.medicines || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPharmacy();
  }, [pharmacyId]);

  if (loading) return <p className="p-6">Loading pharmacy details...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
  if (!pharmacy) return <p className="p-6">No pharmacy found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        ← Back
      </button>

      {/* Pharmacy Info Table */}
      <table className="w-full mb-6 border">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-3 text-left">Pharmacy Details</th>
            <th className="p-3 text-left">Info</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3">Name</td>
            <td className="p-3">{pharmacy.name}</td>
          </tr>
          <tr>
            <td className="p-3">Location</td>
            <td className="p-3">
              {pharmacy.latitude}, {pharmacy.longitude}
            </td>
          </tr>
          <tr>
            <td className="p-3">Image</td>
            <td className="p-3">
              <img
                src={pharmacy.image}
                alt={pharmacy.name}
                className="w-32 h-32 rounded object-cover"
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/80?text=No+Image")
                }
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* Categories Table */}
      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      <table className="w-full mb-6 border">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-3 text-left">Category Name</th>
            <th className="p-3 text-left">Image</th>
          </tr>
        </thead>
        <tbody>
          {pharmacy.categories.map((cat) => (
            <tr key={cat._id}>
              <td className="p-3">{cat.name}</td>
              <td className="p-3">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-16 h-16 rounded-full object-cover"
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/80?text=No+Image")
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Medicines Table */}
      <h2 className="text-xl font-semibold mb-4">Medicines</h2>
      <table className="w-full mb-6 border">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-3 text-left">#</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Image</th>
            <th className="p-3 text-left">Price (₹)</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Created At</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((med, index) => (
            <tr key={med._id} className="hover:bg-gray-100">
              <td className="p-3">{index + 1}</td>
              <td className="p-3">{med.name}</td>
              <td className="p-3">
                <img
                  src={med.images[0]}
                  alt={med.name}
                  className="w-16 h-16 rounded object-cover"
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/80?text=No+Image")
                  }
                />
              </td>
              <td className="p-3">{med.price}</td>
              <td className="p-3">{med.categoryName || "Uncategorized"}</td>
              <td className="p-3">{med.description || "No description"}</td>
              <td className="p-3">
                {new Date(med.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
