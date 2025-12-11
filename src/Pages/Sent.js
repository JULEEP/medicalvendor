import { useState } from "react";
import { FaEye } from "react-icons/fa"; // Import eye icon

const messagesData = [
    { id: 1, sender: "Admin", subject: "Fired", message: "Fired", status: "not seen" },
    { id: 2, sender: "Admin", subject: "nn", message: "mmm", status: "not seen" },
    { id: 3, sender: "Admin", subject: "Fff", message: "Ggg", status: "not seen" },
    { id: 4, sender: "Admin", subject: "test", message: "fgfg", status: "not seen" },
    { id: 5, sender: "Admin", subject: "important", message: "come tomorrow early", status: "not seen" },
    { id: 6, sender: "Admin", subject: "Test", message: "Test message", status: "not seen" },
    { id: 7, sender: "Admin", subject: "Update", message: "Check the updates", status: "not seen" },
    { id: 8, sender: "Admin", subject: "Reminder", message: "Don't forget", status: "not seen" },
    { id: 9, sender: "Admin", subject: "Alert", message: "New alert", status: "not seen" },
    { id: 10, sender: "Admin", subject: "Notice", message: "Important notice", status: "not seen" },
    { id: 11, sender: "Admin", subject: "Update", message: "System update", status: "not seen" },
    { id: 12, sender: "Admin", subject: "Info", message: "Info message", status: "not seen" },
    { id: 13, sender: "Admin", subject: "Event", message: "Upcoming event", status: "not seen" },
    { id: 14, sender: "Admin", subject: "Meeting", message: "Meeting scheduled", status: "not seen" },
    { id: 15, sender: "Admin", subject: "Alert", message: "Alert details", status: "not seen" },
];

export default function SentMessagesTable() {
    const [messages, setMessages] = useState(messagesData);
    const [viewMessage, setViewMessage] = useState(null); // State to hold message details for viewing
    const [search, setSearch] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const filteredMessages = messages.filter(
        (msg) =>
            msg.sender.toLowerCase().includes(search.toLowerCase()) ||
            msg.subject.toLowerCase().includes(search.toLowerCase()) ||
            msg.message.toLowerCase().includes(search.toLowerCase())
    );

    const displayedMessages = filteredMessages.slice(0, itemsPerPage);

    const handleView = (id) => {
        const message = messages.find((msg) => msg.id === id);
        setViewMessage(message);
    };

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
                        placeholder="Search messages..."
                        className="p-2 border rounded w-3/4"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
                    <thead>
                        <tr className="bg-gray-100 text-center">
                            <th className="p-3 border">Sl</th>
                            <th className="p-3 border">Sender</th>
                            <th className="p-3 border">Subject</th>
                            <th className="p-3 border">Message</th>
                            <th className="p-3 border">Status</th>
                            <th className="p-3 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedMessages.map((msg) => (
                            <tr key={msg.id} className="cursor-pointer hover:bg-gray-50 text-center">
                                <td className="p-3 border">{msg.id}</td>
                                <td className="p-3 border">{msg.sender}</td>
                                <td className="p-3 border">{msg.subject}</td>
                                <td className="p-3 border">{msg.message}</td>
                                <td className="p-3 border text-yellow-500 font-semibold">{msg.status}</td>
                                <td className="p-3 border">
                                    <button
                                        className="text-blue-500 hover:underline mr-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleView(msg.id); // View message details
                                        }}
                                    >
                                        <FaEye /> {/* Eye icon for View */}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* View Message Modal */}
            {viewMessage && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-sm font-bold mb-4 text-purple-600">View Message</h2>
                        <p><strong>Sender:</strong> {viewMessage.sender}</p>
                        <p><strong>Subject:</strong> {viewMessage.subject}</p>
                        <p><strong>Message:</strong> {viewMessage.message}</p>
                        <p><strong>Status:</strong> {viewMessage.status}</p>

                        <div className="mt-4">
                            <button
                                onClick={() => setViewMessage(null)} // Close view modal
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
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
