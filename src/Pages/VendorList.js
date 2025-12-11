import { useState } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { utils, writeFile } from "xlsx";
import { useNavigate } from "react-router-dom";

export default function VendorList() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadLimit, setDownloadLimit] = useState(50);
  const vendorsPerPage = 5;
  const navigate = useNavigate();

  const dummyVendors = [
    {
      id: 1,
      name: "Vendor One",
      email: "vendor1@example.com",
      phone: "1234567890",
      company: "Company A",
      address: "123 Street, City",
    },
    {
      id: 2,
      name: "Vendor Two",
      email: "vendor2@example.com",
      phone: "2345678901",
      company: "Company B",
      address: "456 Avenue, Town",
    },
    {
      id: 3,
      name: "Vendor Three",
      email: "vendor3@example.com",
      phone: "3456789012",
      company: "Company C",
      address: "789 Road, Village",
    },
    {
      id: 4,
      name: "Vendor Four",
      email: "vendor4@example.com",
      phone: "4567890123",
      company: "Company D",
      address: "321 Boulevard, Metro",
    },
    {
      id: 5,
      name: "Vendor Five",
      email: "vendor5@example.com",
      phone: "5678901234",
      company: "Company E",
      address: "654 Plaza, District",
    },
  ];

  const filteredVendors = dummyVendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastVendor = currentPage * vendorsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
  const currentVendors = filteredVendors.slice(
    indexOfFirstVendor,
    indexOfLastVendor
  );
  const totalPages = Math.ceil(filteredVendors.length / vendorsPerPage);

  const exportData = (type) => {
    const exportVendors = filteredVendors
      .slice(0, downloadLimit)
      .map(({ id, name, email, phone, company, address }) => ({
        id,
        name,
        email,
        phone,
        company,
        address,
      }));
    const ws = utils.json_to_sheet(exportVendors);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Vendors");
    writeFile(wb, `vendors.${type}`);
  };

  const viewVendor = (vendor) => {
    navigate(`/vendor/${vendor.id}`, { state: vendor });
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-900">All Vendors</h2>
      </div>

      <div className="flex justify-between mb-4 gap-2">
        <input
          className="w-1/3 p-2 border rounded"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <select
            value={downloadLimit}
            onChange={(e) => setDownloadLimit(Number(e.target.value))}
            className="p-2 border rounded"
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
          <button
            className="bg-gray-200 px-4 py-2 rounded"
            onClick={() => exportData("csv")}
          >
            Export CSV
          </button>
          <button
            className="bg-gray-200 px-4 py-2 rounded"
            onClick={() => exportData("xlsx")}
          >
            Export Excel
          </button>
        </div>
      </div>

      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-2 border">Sl</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Company</th>
              <th className="p-2 border">Address</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentVendors.map((vendor, index) => (
              <tr key={vendor.id}>
                <td className="p-2 border">{index + 1 + indexOfFirstVendor}</td>
                <td className="p-2 border">{vendor.name}</td>
                <td className="p-2 border">{vendor.email}</td>
                <td className="p-2 border">{vendor.phone}</td>
                <td className="p-2 border">{vendor.company}</td>
                <td className="p-2 border">{vendor.address}</td>
                <td className="p-2 border flex gap-2">
                  <button
                    className="bg-green-500 text-white p-1 rounded"
                    onClick={() => viewVendor(vendor)}
                  >
                    <FaEye />
                  </button>
                  <button className="bg-blue-500 text-white p-1 rounded">
                    <FaEdit />
                  </button>
                  <button className="bg-red-500 text-white p-1 rounded">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() =>
            setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
          }
          disabled={currentPage === totalPages}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
