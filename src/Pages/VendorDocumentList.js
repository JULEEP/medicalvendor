import { useState } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { utils, writeFile } from "xlsx";

export default function VendorDocumentList() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadLimit, setDownloadLimit] = useState(50);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [viewedDoc, setViewedDoc] = useState(null);
  const vendorsPerPage = 5;

  const [vendorDocs, setVendorDocs] = useState([
    { id: 1, vendorName: "Vendor One", document: "document1.pdf", status: "Pending" },
    { id: 2, vendorName: "Vendor Two", document: "document2.pdf", status: "Approved" },
    { id: 3, vendorName: "Vendor Three", document: "document3.pdf", status: "Rejected" },
    { id: 4, vendorName: "Vendor Four", document: "document4.pdf", status: "Pending" },
    { id: 5, vendorName: "Vendor Five", document: "document5.pdf", status: "Approved" },
  ]);

  const filteredDocs = vendorDocs.filter((doc) =>
    doc.vendorName.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * vendorsPerPage;
  const indexOfFirst = indexOfLast - vendorsPerPage;
  const currentDocs = filteredDocs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredDocs.length / vendorsPerPage);

  const handleEditClick = (doc) => {
    setSelectedDoc(doc);
    setEditModalOpen(true);
  };

  const handleStatusChange = (e) => {
    setSelectedDoc({ ...selectedDoc, status: e.target.value });
  };

  const handleSave = () => {
    const updated = vendorDocs.map((doc) =>
      doc.id === selectedDoc.id ? selectedDoc : doc
    );
    setVendorDocs(updated);
    setEditModalOpen(false);
  };

  const handleViewClick = (doc) => {
    setViewedDoc(doc);
    setViewModalOpen(true);
  };

  const exportData = (type) => {
    const exportDocs = filteredDocs
      .slice(0, downloadLimit)
      .map(({ id, vendorName, document, status }) => ({
        id,
        vendorName,
        document,
        status,
      }));
    const ws = utils.json_to_sheet(exportDocs);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Vendor Documents");
    writeFile(wb, `vendor_documents.${type}`);
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-900">Vendor Documents</h2>
      </div>

      <div className="flex justify-between mb-4 gap-2">
        <input
          className="w-1/3 p-2 border rounded"
          placeholder="Search by vendor name..."
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
              <th className="p-2 border">Vendor Name</th>
              <th className="p-2 border">Document</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentDocs.map((doc, index) => (
              <tr key={doc.id}>
                <td className="p-2 border">{index + 1 + indexOfFirst}</td>
                <td className="p-2 border">{doc.vendorName}</td>
                <td className="p-2 border">{doc.document}</td>
                <td className="p-2 border">{doc.status}</td>
                <td className="p-2 border flex gap-2">
                  <button
                    className="bg-green-500 text-white p-1 rounded"
                    onClick={() => handleViewClick(doc)}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="bg-blue-500 text-white p-1 rounded"
                    onClick={() => handleEditClick(doc)}
                  >
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
          onClick={() =>
            setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
          }
          disabled={currentPage === totalPages}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Next
        </button>
      </div>

      {/* Edit Modal */}
      {editModalOpen && selectedDoc && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Edit Status</h3>
            <div className="mb-4">
              <label className="block font-medium mb-1">Vendor Name:</label>
              <p className="border p-2 rounded bg-gray-100">{selectedDoc.vendorName}</p>
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Status</label>
              <select
                value={selectedDoc.status}
                onChange={handleStatusChange}
                className="w-full border p-2 rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModalOpen && viewedDoc && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Document Details</h3>
            <p><strong>Vendor Name:</strong> {viewedDoc.vendorName}</p>
            <p><strong>Status:</strong> {viewedDoc.status}</p>
            <p className="mt-2"><strong>Document:</strong> {viewedDoc.document}</p>
            {/* To preview the document: replace this with iframe/pdf viewer if real URLs */}
            <div className="mt-4 flex justify-end">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => setViewModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
