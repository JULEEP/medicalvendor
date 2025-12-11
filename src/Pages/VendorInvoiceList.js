import { useState } from "react";
import { utils, writeFile } from "xlsx";

export default function VendorInvoiceList() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadLimit, setDownloadLimit] = useState(10);
  const vendorsPerPage = 5; // Number of vendors to show per page

  const [invoiceStatus, setInvoiceStatus] = useState({}); // Track invoice status (sent or not)

  const invoices = [
    {
      id: 1,
      vendorName: "Vendor One",
      month: "April 2025",
      redeemedCoupons: 30,
      salePercentage: 0,
      amount: 30,
      status: "Pending",
      city: "New York",
      state: "New York",
    },
    {
      id: 2,
      vendorName: "Vendor Two",
      month: "April 2025",
      redeemedCoupons: 15,
      salePercentage: 0,
      amount: 15,
      status: "Paid",
      city: "Los Angeles",
      state: "California",
    },
    {
      id: 3,
      vendorName: "Vendor Three",
      month: "April 2025",
      redeemedCoupons: 50,
      salePercentage: 0,
      amount: 50,
      status: "Pending",
      city: "Chicago",
      state: "Illinois",
    },
    {
      id: 4,
      vendorName: "Vendor Four",
      month: "April 2025",
      redeemedCoupons: 25,
      salePercentage: 0,
      amount: 25,
      status: "Paid",
      city: "Houston",
      state: "Texas",
    },
    {
      id: 5,
      vendorName: "Vendor Five",
      month: "April 2025",
      redeemedCoupons: 40,
      salePercentage: 0,
      amount: 40,
      status: "Pending",
      city: "Miami",
      state: "Florida",
    },
    {
      id: 6,
      vendorName: "Vendor Six",
      month: "April 2025",
      redeemedCoupons: 60,
      salePercentage: 0,
      amount: 60,
      status: "Pending",
      city: "San Francisco",
      state: "California",
    },
    {
      id: 7,
      vendorName: "Vendor Seven",
      month: "April 2025",
      redeemedCoupons: 20,
      salePercentage: 0,
      amount: 20,
      status: "Paid",
      city: "Dallas",
      state: "Texas",
    },
  ];

  // Filter invoices based on search input
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.vendorName.toLowerCase().includes(search.toLowerCase()) ||
      invoice.city.toLowerCase().includes(search.toLowerCase()) ||
      invoice.state.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastInvoice = currentPage * vendorsPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - vendorsPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);
  const totalPages = Math.ceil(filteredInvoices.length / vendorsPerPage);

  const handleSendInvoice = (id) => {
    if (!invoiceStatus[id]) {
      setInvoiceStatus((prev) => ({ ...prev, [id]: "Sent" }));
      alert(`Invoice sent to vendor ID: ${id}`);
    } else {
      alert(`Invoice already sent to vendor ID: ${id}`);
    }
  };

  const handleDownloadCSV = () => {
    const exportData = filteredInvoices
      .slice(0, downloadLimit)
      .map(({ id, vendorName, month, redeemedCoupons, salePercentage, amount, status, city, state }) => ({
        id,
        vendorName,
        month,
        redeemedCoupons,
        salePercentage,
        amount,
        status,
        city,
        state,
      }));

    const ws = utils.json_to_sheet(exportData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Invoices");
    writeFile(wb, "vendor_invoices.csv");
  };

  const handleDownloadInvoice = (id) => {
    alert(`Downloading invoice for vendor ID: ${id}`);
    // Implement actual download logic here
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-900">Monthly Coupon Invoices</h2>
      </div>

      <div className="flex justify-between mb-4 gap-2">
        <input
          type="text"
          placeholder="Search vendor, city, state..."
          className="border p-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <select
            className="border p-2 rounded"
            value={downloadLimit}
            onChange={(e) => setDownloadLimit(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
          <button className="bg-gray-200 px-4 py-2 rounded" onClick={handleDownloadCSV}>
            Download CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-2 border">Sl</th>
              <th className="p-2 border">Vendor Name</th>
              <th className="p-2 border">Month</th>
              <th className="p-2 border">Coupons Redeemed</th>
              <th className="p-2 border">Sale %</th>
              <th className="p-2 border">Amount ($)</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">City</th>
              <th className="p-2 border">State</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentInvoices.map((invoice, index) => (
              <tr key={invoice.id}>
                <td className="p-2 border">{index + 1 + indexOfFirstInvoice}</td>
                <td className="p-2 border">{invoice.vendorName}</td>
                <td className="p-2 border">{invoice.month}</td>
                <td className="p-2 border">{invoice.redeemedCoupons}</td>
                <td className="p-2 border">{invoice.salePercentage}%</td>
                <td className="p-2 border">${invoice.amount}</td>
                <td className="p-2 border">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      invoice.status === "Paid" ? "bg-green-500 text-white" : "bg-yellow-400 text-black"
                    }`}
                  >
                    {invoice.status}
                  </span>
                </td>
                <td className="p-2 border">{invoice.city}</td>
                <td className="p-2 border">{invoice.state}</td>
                <td className="p-2 border flex gap-2">
                  {invoice.status === "Paid" && (
                    <button
                      className="bg-blue-500 text-white px-4 py-1 rounded"
                      onClick={() => handleDownloadInvoice(invoice.id)}
                    >
                      Download Invoice
                    </button>
                  )}
                  {invoice.status === "Pending" && (
                    <>
                      {invoiceStatus[invoice.id] !== "Sent" ? (
                        <button
                          className="bg-blue-500 text-white px-4 py-1 rounded"
                          onClick={() => handleSendInvoice(invoice.id)}
                        >
                          Send Invoice
                        </button>
                      ) : (
                        <button
                          className="bg-gray-500 text-white px-4 py-1 rounded"
                          disabled
                        >
                          Invoice Sent
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-300 px-4 py-2 rounded"
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
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
