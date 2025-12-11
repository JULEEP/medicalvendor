import { useState } from "react";

const DocumentTable = () => {
  const [documents] = useState([
    {
      id: 1,
      name: "Aadhaar Card",
      file: "aadhaar_card.pdf",
      uploadedAt: "2025-04-17",
      status: "Verified",
    },
    {
      id: 2,
      name: "PAN Card",
      file: "pan_card.jpg",
      uploadedAt: "2025-04-16",
      status: "Pending",
    },
    {
      id: 3,
      name: "GST Certificate",
      file: "gst_certificate.png",
      uploadedAt: "2025-04-15",
      status: "Verified",
    },
    {
      id: 4,
      name: "Business License",
      file: "license.pdf",
      uploadedAt: "2025-04-14",
      status: "Pending",
    },
  ]);

  const getStatusStyle = (status) => {
    return status === "Verified"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-100 to-green-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 text-center">Uploaded Documents</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-green-100 text-gray-600">
              <tr>
                <th className="py-2 px-4 border">#</th>
                <th className="py-2 px-4 border">Document Name</th>
                <th className="py-2 px-4 border">File</th>
                <th className="py-2 px-4 border">Uploaded On</th>
                <th className="py-2 px-4 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, index) => (
                <tr key={doc.id} className="text-center">
                  <td className="py-2 px-4 border">{index + 1}</td>
                  <td className="py-2 px-4 border font-medium">{doc.name}</td>
                  <td className="py-2 px-4 border text-blue-600 underline cursor-pointer">
                    {doc.file}
                  </td>
                  <td className="py-2 px-4 border">{doc.uploadedAt}</td>
                  <td className="py-2 px-4 border">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(doc.status)}`}>
                      {doc.status}
                    </span>
                  </td>
                </tr>
              ))}
              {documents.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-4 text-gray-500 text-center">
                    No documents uploaded yet.
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

export default DocumentTable;
