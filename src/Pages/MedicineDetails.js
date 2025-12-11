import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function SingleMedicine() {
  const { medicineId } = useParams();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMedicine = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://31.97.206.144:7021/api/pharmacy/sinle-medicine/${medicineId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch medicine");

        if (data.medicine) {
          setMedicine(data.medicine);
        } else {
          setError("Medicine not found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicine();
  }, [medicineId]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link to="/medicinelist" className="text-blue-500 underline mb-4 inline-block">
        ← Back to Medicines
      </Link>

      {medicine && (
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">{medicine.name}</h1>

          <div className="flex gap-4 mb-4 flex-wrap">
            {medicine.images?.length > 0 ? (
              medicine.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={medicine.name}
                  className="w-32 h-32 rounded object-cover border"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150?text=No+Image";
                  }}
                />
              ))
            ) : (
              <img
                src="https://via.placeholder.com/150?text=No+Image"
                alt="No image"
                className="w-32 h-32 rounded object-cover border"
              />
            )}
          </div>

          <p className="text-lg text-blue-700 font-semibold mb-2">
            Price: ₹{medicine.price}
          </p>
          <p className="mb-2">
            <strong>Category:</strong> {medicine.categoryName || "N/A"}
          </p>
          <p className="mb-4">{medicine.description || "No description"}</p>

          <div>
            <h2 className="text-lg font-bold mb-1">Pharmacy Info</h2>
            <p><strong>Name:</strong> {medicine.pharmacy?.name || "N/A"}</p>
            <p>
              <strong>Location:</strong>{" "}
              {medicine.pharmacy?.location?.coordinates
                ? `${medicine.pharmacy.location.coordinates[1]}, ${medicine.pharmacy.location.coordinates[0]}`
                : "N/A"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
