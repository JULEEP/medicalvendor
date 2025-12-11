import { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Import icons

const clientsData = [
  { id: 1, clientName: "somnath", companyName: "Xappsoft Technology", email: "somnathsahoo346@gmail.com", country: "India", address: "Address 1" },
  { id: 2, clientName: "Earnify", companyName: "hgygyu", email: "alraqym298@gmail.com", country: "India", address: "Address 2" },
  { id: 3, clientName: "Melodie Horne", companyName: "Eaton Randall Co", email: "pulahu@mailinator.com", country: "Suriname", address: "Address 3" },
  { id: 4, clientName: "Nell Burt", companyName: "Craft and Rollins Co", email: "haca@mailinator.com", country: "Slovenia", address: "Address 4" },
  { id: 5, clientName: "Ivan Bird", companyName: "Vega James Associates", email: "zebagibim@mailinator.com", country: "Trinidad and Tobago", address: "Address 5" },
];

export default function ClientsTable() {
  const [clients, setClients] = useState(clientsData);
  const [search, setSearch] = useState("");
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [newClient, setNewClient] = useState({
    clientName: "",
    companyName: "",
    email: "",
    country: "",
    address: "",
  });
  
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Handle adding new client
  const handleAddClient = () => {
    if (newClient.clientName && newClient.companyName && newClient.email && newClient.country && newClient.address) {
      setClients([...clients, { id: clients.length + 1, ...newClient }]);
      setShowNewClientModal(false);
      setNewClient({ clientName: "", companyName: "", email: "", country: "", address: "" });
    } else {
      alert("All fields are required!");
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.clientName.toLowerCase().includes(search.toLowerCase()) ||
      client.companyName.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase()) ||
      client.country.toLowerCase().includes(search.toLowerCase())
  );

  // Limit the clients based on itemsPerPage
  const displayedClients = filteredClients.slice(0, itemsPerPage);

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <div className="flex space-x-4">
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="p-2 border rounded"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <input
            type="text"
            placeholder="Search clients..."
            className="p-2 border rounded w-3/4"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          className="p-2 bg-purple-600 text-white rounded"
          onClick={() => setShowNewClientModal(true)}
        >
          + New Client
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="p-3 border">Sl</th>
              <th className="p-3 border">Client Name</th>
              <th className="p-3 border">Company Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Country</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedClients.map((client) => (
              <tr key={client.id} className="cursor-pointer hover:bg-gray-50 text-center">
                <td className="p-3 border">{client.id}</td>
                <td className="p-3 border">{client.clientName}</td>
                <td className="p-3 border">{client.companyName}</td>
                <td className="p-3 border">{client.email}</td>
                <td className="p-3 border">{client.country}</td>
                <td className="p-3 border">
                  <button
                    className="text-blue-500 hover:underline mr-2"
                  >
                    <FaEdit /> {/* Edit icon */}
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                  >
                    <FaTrashAlt /> {/* Trash icon */}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Client Modal */}
      {showNewClientModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-sm font-bold mb-4 text-purple-600">New Client</h2>
            <input
              type="text"
              placeholder="Client name"
              className="w-full p-2 border mb-2"
              value={newClient.clientName}
              onChange={(e) => setNewClient({ ...newClient, clientName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Company name"
              className="w-full p-2 border mb-2"
              value={newClient.companyName}
              onChange={(e) => setNewClient({ ...newClient, companyName: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border mb-2"
              value={newClient.email}
              onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Country"
              className="w-full p-2 border mb-2"
              value={newClient.country}
              onChange={(e) => setNewClient({ ...newClient, country: e.target.value })}
            />
            <textarea
              placeholder="Address"
              className="w-full p-2 border mb-2"
              value={newClient.address}
              onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
            />
            <div className="mt-4">
              <button
                className="mr-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                onClick={handleAddClient}
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                onClick={() => setShowNewClientModal(false)}
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
