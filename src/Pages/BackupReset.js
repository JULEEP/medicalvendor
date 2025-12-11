import { useState } from "react";

export default function DatabaseBackup() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Database Backup</h2>

      <button
        className="px-4 py-2 text-green-700 bg-green-100 border border-green-600 rounded"
        onClick={() => setShowModal(true)}
      >
        Backup Database
      </button>

      <div className="mt-4 overflow-hidden border rounded-lg">
        <div className="flex justify-between p-4 bg-gray-100">
          <div>
            <label className="mr-2">Show</label>
            <select className="p-1 border rounded">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span className="ml-2">entries</span>
          </div>
          <input type="text" placeholder="Search..." className="p-1 border rounded" />
        </div>

        <table className="w-full border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">SI</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Disk</th>
              <th className="p-2 border">Size</th>
              <th className="p-2 border">Last Modified</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="6" className="p-4 text-center border">
                No data available in table
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-between p-4 bg-gray-100">
          <span>Showing 0 to 0 of 0 entries</span>
          <div>
            <button className="px-4 py-1 mr-2 border rounded">Previous</button>
            <button className="px-4 py-1 border rounded">Next</button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="p-6 text-center bg-white rounded-lg shadow-lg w-96">
            <div className="text-5xl text-orange-400">⚠</div>
            <h3 className="mt-2 text-xl font-semibold">Are you sure?</h3>
            <p className="mt-1 text-gray-600">You want to Backup Your Database</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                className="px-4 py-2 text-blue-700 bg-blue-100 border border-blue-600 rounded"
                onClick={() => setShowModal(false)}
              >
                Yes, Backup it!
              </button>
              <button
                className="px-4 py-2 text-red-700 bg-red-100 border border-red-600 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
