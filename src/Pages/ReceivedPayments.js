import { useState } from "react";
import { utils, writeFile } from "xlsx";

export default function ReceivedPayments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [exportLimit, setExportLimit] = useState(10);

  const [payments] = useState([
    {
      id: 1,
      vendorName: "Vendor One",
      amount: 30,
      couponAmount: 5,
      billAmount: 25,
      date: "2025-04-10",
      status: "Paid",
    },
    {
      id: 2,
      vendorName: "Vendor Two",
      amount: 15,
      couponAmount: 3,
      billAmount: 12,
      date: "2025-04-12",
      status: "Paid",
    },
    {
      id: 3,
      vendorName: "Vendor One",
      amount: 20,
      couponAmount: 4,
      billAmount: 16,
      date: "2025-05-01",
      status: "Paid",
    },
    // Add more dummy payments for testing larger exports
  ]);

  const filteredPayments = payments.filter((payment) =>
    payment.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportCSV = () => {
    const exportData = filteredPayments
      .slice(0, exportLimit)
      .map(({ id, vendorName, amount, couponAmount, billAmount, date, status }) => ({
        ID: id,
        "Vendor Name": vendorName,
        Amount: amount,
        "Coupon Amount": couponAmount,
        "Bill Amount": billAmount,
        Date: date,
        Status: status,
      }));

    const ws = utils.json_to_sheet(exportData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "ReceivedPayments");
    writeFile(wb, `received_payments_${exportLimit}.csv`);
  };

  const handleDownloadInvoice = (id) => {
    alert(`Downloading invoice for payment ID: ${id}`);
    // Ideally, trigger invoice download logic here
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-semibold text-blue-900 mb-4">Received Payments</h2>

      <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by vendor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/3"
        />

        <div className="flex gap-4">
          <select
            value={exportLimit}
            onChange={(e) => setExportLimit(Number(e.target.value))}
            className="border p-2 rounded"
          >
            <option value={10}>Export 10</option>
            <option value={50}>Export 50</option>
            <option value={100}>Export 100</option>
            <option value={200}>Export 200</option>
          </select>

          <button
            onClick={exportCSV}
            className="bg-gray-300 px-4 py-2 rounded text-sm"
          >
            Download CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-2 border">Sl</th>
              <th className="p-2 border">Vendor Name</th>
              <th className="p-2 border">Amount ($)</th>
              <th className="p-2 border">Coupon Amount ($)</th>
              <th className="p-2 border">Bill Amount ($)</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment, index) => (
              <tr key={payment.id}>
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{payment.vendorName}</td>
                <td className="p-2 border">${payment.amount}</td>
                <td className="p-2 border">${payment.couponAmount}</td>
                <td className="p-2 border">${payment.billAmount}</td>
                <td className="p-2 border">{payment.date}</td>
                <td className="p-2 border">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      payment.status === "Paid"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-400 text-black"
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="p-2 border flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-4 py-1 rounded"
                    onClick={() => handleDownloadInvoice(payment.id)}
                  >
                    Download Invoice
                  </button>
                </td>
              </tr>
            ))}
            {filteredPayments.length === 0 && (
              <tr>
                <td className="p-2 border text-center" colSpan="8">
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
