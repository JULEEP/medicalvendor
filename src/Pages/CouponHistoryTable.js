import { useState } from "react";

// Function to generate a random alphanumeric 5-character coupon ID
const generateCouponID = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const CouponHistoryTable = () => {
  const [couponHistory] = useState([
    // 1. Restaurant
    {
      customerId: "C001",
      couponId: generateCouponID(),
      discount: 20,
      couponDownloadDate: "2025-04-01",
      couponRedeemedDate: "2025-04-10",
      couponRedeemedTime: "5:45 PM",
      couponOrderDetails: "Restaurant: Summer Feast, 2 pizzas",
      orderValue: 35.50,
      feedback: "N/A",
      category: "Restaurant",
    },
    // 2. Meat Shop
    {
      customerId: "C002",
      couponId: generateCouponID(),
      discount: 30,
      couponDownloadDate: "2025-03-20",
      couponRedeemedDate: "2025-03-25",
      couponRedeemedTime: "3:00 PM",
      couponOrderDetails: "Meat Shop: Fresh Lamb Chops",
      orderValue: 50.99,
      feedback: "Tender meat, very fresh.",
      category: "Meat Shop",
    },
    // 3. Groceries
    {
      customerId: "C003",
      couponId: generateCouponID(),
      discount: 25,
      couponDownloadDate: "2025-02-20",
      couponRedeemedDate: "2025-03-01",
      couponRedeemedTime: "2:30 PM",
      couponOrderDetails: "Groceries: Organic Vegetables, Fruits",
      orderValue: 85.75,
      feedback: "Great selection of fresh produce!",
      category: "Groceries",
    },
    // 4. Restaurant
    {
      customerId: "C004",
      couponId: generateCouponID(),
      discount: 15,
      couponDownloadDate: "2025-02-15",
      couponRedeemedDate: "N/A",
      couponRedeemedTime: "N/A",
      couponOrderDetails: "N/A",
      orderValue: 0,
      feedback: "N/A",
      category: "Restaurant",
    },
    // 5. Meat Shop
    {
      customerId: "C005",
      couponId: generateCouponID(),
      discount: 10,
      couponDownloadDate: "2025-04-05",
      couponRedeemedDate: "2025-04-08",
      couponRedeemedTime: "4:15 PM",
      couponOrderDetails: "Meat Shop: Chicken Drumsticks",
      orderValue: 25.99,
      feedback: "Delicious chicken, would buy again.",
      category: "Meat Shop",
    },
    // 6. Groceries
    {
      customerId: "C006",
      couponId: generateCouponID(),
      discount: 20,
      couponDownloadDate: "2025-04-10",
      couponRedeemedDate: "2025-04-11",
      couponRedeemedTime: "6:00 PM",
      couponOrderDetails: "Groceries: Fresh Dairy Products, Eggs",
      orderValue: 55.25,
      feedback: "Great value for money, highly recommend.",
      category: "Groceries",
    },
  ]);

  return (
    <div className="p-6 bg-gradient-to-r from-blue-100 to-green-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 text-center">Coupon Usage History</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-green-100 text-gray-600">
              <tr>
                <th className="py-2 px-4 border">SI No</th>
                <th className="py-2 px-4 border">Customer ID</th>
                <th className="py-2 px-4 border">Coupon ID</th>
                <th className="py-2 px-4 border">Discount (%)</th>
                <th className="py-2 px-4 border">Coupon Download Date</th>
                <th className="py-2 px-4 border">Coupon Redeemed Date</th>
                <th className="py-2 px-4 border">Coupon Redeemed Time</th>
                <th className="py-2 px-4 border">Coupon Order Details</th>
                <th className="py-2 px-4 border">Order Value (Amount)</th>
                <th className="py-2 px-4 border">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {couponHistory.map((coupon, index) => (
                <tr key={coupon.couponId || index} className="text-center">
                  <td className="py-2 px-4 border">{index + 1}</td> {/* Serial Number */}
                  <td className="py-2 px-4 border">{coupon.customerId}</td>
                  <td className="py-2 px-4 border">{coupon.couponId}</td>
                  <td className="py-2 px-4 border">{coupon.discount}%</td>
                  <td className="py-2 px-4 border">{coupon.couponDownloadDate}</td>
                  <td className="py-2 px-4 border">{coupon.couponRedeemedDate}</td>
                  <td className="py-2 px-4 border">{coupon.couponRedeemedTime}</td>
                  <td className="py-2 px-4 border">{coupon.couponOrderDetails}</td>
                  <td className="py-2 px-4 border">${coupon.orderValue.toFixed(2)}</td>
                  <td className="py-2 px-4 border">{coupon.feedback}</td>
                </tr>
              ))}
              {couponHistory.length === 0 && (
                <tr>
                  <td colSpan="10" className="py-4 text-gray-500 text-center">
                    No coupon usage history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CouponHistoryTable;
