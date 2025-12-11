import { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Import icons

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

export default function MessagesTable() {
    const [messages, setMessages] = useState(messagesData);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [deleteMessageId, setDeleteMessageId] = useState(null);
    const [search, setSearch] = useState("");
    const [showNewMessageModal, setShowNewMessageModal] = useState(false);
    const [currentMessage, setCurrentMessage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State for the number of items to show
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Define the state for a new message
    const [newMessage, setNewMessage] = useState({
        sender: "",
        subject: "",
        message: "",
        status: "not seen",
    });

    const handleEdit = (id) => {
        const message = messages.find((msg) => msg.id === id);
        setCurrentMessage(message);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        setMessages(messages.map((msg) =>
            msg.id === currentMessage.id ? currentMessage : msg
        ));
        setIsModalOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentMessage({
            ...currentMessage,
            [name]: value,
        });
    };

    // Handle new message creation
    const handleAddMessage = () => {
        if (newMessage.sender && newMessage.subject && newMessage.message) {
            setMessages([...messages, { id: messages.length + 1, ...newMessage }]);
            setShowNewMessageModal(false);
            setNewMessage({ sender: "", subject: "", message: "", status: "not seen" });
        } else {
            alert("All fields are required!");
        }
    };

    const confirmDelete = (id) => {
        setDeleteMessageId(id);
    };

    const handleDelete = () => {
        setMessages(messages.filter((msg) => msg.id !== deleteMessageId));
        setDeleteMessageId(null);
    };

    const filteredMessages = messages.filter(
        (msg) =>
            msg.sender.toLowerCase().includes(search.toLowerCase()) ||
            msg.subject.toLowerCase().includes(search.toLowerCase()) ||
            msg.message.toLowerCase().includes(search.toLowerCase())
    );

    // Limit the messages based on itemsPerPage
    const displayedMessages = filteredMessages.slice(0, itemsPerPage);

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
                <button
                    className="p-2 bg-purple-600 text-white rounded"
                    onClick={() => setShowNewMessageModal(true)}
                >
                    + New Message
                </button>
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
                                            handleEdit(msg.id); // Open the edit modal
                                        }}
                                    >
                                        <FaEdit /> {/* Edit icon */}
                                    </button>
                                    <button
                                        className="text-red-500 hover:underline"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            confirmDelete(msg.id);
                                        }}
                                    >
                                        <FaTrashAlt /> {/* Trash icon */}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {deleteMessageId !== null && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
                        <h2 className="text-lg font-bold mb-4 text-red-900">Are you sure?</h2>
                        <p>You want to delete this message.</p>
                        <div className="mt-4">
                            <button
                                className="mr-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                                onClick={handleDelete}
                            >
                                Yes, Delete it!
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                                onClick={() => setDeleteMessageId(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Message Modal */}
            {isModalOpen && currentMessage && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-sm font-bold mb-4 text-purple-600">Edit Message</h2>

                        <label className="block mb-2 text-sm">
                            Sender:
                            <input
                                type="text"
                                name="sender"
                                value={currentMessage.sender}
                                onChange={handleChange}
                                className="w-full p-2 border"
                            />
                        </label>

                        <label className="block mb-2 text-sm">
                            Subject:
                            <input
                                type="text"
                                name="subject"
                                value={currentMessage.subject}
                                onChange={handleChange}
                                className="w-full p-2 border"
                            />
                        </label>

                        <label className="block mb-2 text-sm">
                            Message:
                            <textarea
                                name="message"
                                value={currentMessage.message}
                                onChange={handleChange}
                                className="w-full p-2 border"
                            />
                        </label>

                        <div className="mt-4">
                            <button
                                onClick={handleSave}
                                className="mr-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* New Message Modal */}
            {showNewMessageModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-sm font-bold mb-4 text-purple-600">New Message</h2>
                        <input
                            type="text"
                            placeholder="Sender"
                            className="w-full p-2 border mb-2"
                            value={newMessage.sender}
                            onChange={(e) => setNewMessage({ ...newMessage, sender: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Subject"
                            className="w-full p-2 border mb-2"
                            value={newMessage.subject}
                            onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                        />
                        <textarea
                            placeholder="Message"
                            className="w-full p-2 border mb-2"
                            value={newMessage.message}
                            onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                        />
                        <button
                            className="mr-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                            onClick={handleAddMessage}
                        >
                            Save
                        </button>
                        <button
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                            onClick={() => setShowNewMessageModal(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
