import React from "react";

// Master coupons (same for all users)
const masterCoupons = [
  {
    _id: "1",
    name: "Summer Feast",
    discount: 20,
    validTill: "2025-06-30",
    category: "Restaurant",
  },
  {
    _id: "2",
    name: "Fresh Meat Offer",
    discount: 15,
    validTill: "2025-06-15",
    category: "Meat Shop",
  },
  {
    _id: "3",
    name: "Grocery Saver",
    discount: 10,
    validTill: "2025-07-10",
    category: "Groceries",
  },
];

// Dummy user IDs
const userIds = ["user001", "user002", "user003"];

// Dummy usage data
const usedCoupons = [
  {
    userId: "user001",
    couponId: "1",
    used: true,
    usedAt: "2025-06-01T10:00:00Z",
  },
  {
    userId: "user002",
    couponId: "2",
    used: true,
    usedAt: "2025-06-02T14:30:00Z",
  },
];

// Category colors
const categoryColorMap = {
  Restaurant: "bg-yellow-500",
  "Meat Shop": "bg-red-500",
  Groceries: "bg-green-500",
};

// Code generator
const getCode = (couponId, userId) =>
  `COUP-${couponId}-${userId.slice(-3)}-${couponId.charCodeAt(0) + userId.charCodeAt(0)}`;

const AllUserCoupons = () => {
  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      {/* 🔹 Coupon Grid */}
      <h2 className="text-2xl font-bold text-center text-blue-800 mb-10 mt-10">
        All User Coupons
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-16">
        {masterCoupons.map((coupon) => (
          <div
            key={coupon._id}
            className={`p-5 rounded-lg shadow-md text-white ${categoryColorMap[coupon.category]}`}
          >
            <h3 className="text-xl font-bold mb-1">{coupon.name}</h3>
            <p className="text-sm mb-1">Discount: {coupon.discount}%</p>
            <p className="text-sm mb-1">
              Valid Till: {new Date(coupon.validTill).toLocaleDateString()}
            </p>
            <p className="text-sm mb-3">Category: {coupon.category}</p>

            {/* Coupon codes per user */}
            <div className="bg-white rounded p-2 text-black">
              {userIds.map((userId) => (
                <div
                  key={userId}
                  className="flex justify-between text-sm font-mono border-b border-gray-300 last:border-0 py-1"
                >
                  <span>{userId}</span>
                  <span>{getCode(coupon._id, userId)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 🔻 Usage Table Below */}
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-md shadow">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">Coupon Usage Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-gray-300">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="p-2 border">User ID</th>
                <th className="p-2 border">Coupon Name</th>
                <th className="p-2 border">Coupon Code</th>
                <th className="p-2 border">Used</th>
                <th className="p-2 border">Used At</th>
                <th className="p-2 border">Is Valid</th>
              </tr>
            </thead>
            <tbody>
              {userIds.map((userId) =>
                masterCoupons.map((coupon) => {
                  const usage = usedCoupons.find(
                    (u) => u.userId === userId && u.couponId === coupon._id
                  );
                  const code = getCode(coupon._id, userId);
                  const isUsed = usage?.used || false;
                  const usedAt = usage?.usedAt
                    ? new Date(usage.usedAt).toLocaleString()
                    : "-";
                  const isValid = isUsed ? "❌ No" : "✅ Yes";

                  return (
                    <tr key={`${userId}-${coupon._id}`} className="border-t">
                      <td className="p-2 border">{userId}</td>
                      <td className="p-2 border">{coupon.name}</td>
                      <td className="p-2 border font-mono">{code}</td>
                      <td className="p-2 border">{isUsed ? "Yes" : "No"}</td>
                      <td className="p-2 border">{usedAt}</td>
                      <td className="p-2 border">{isValid}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllUserCoupons;
