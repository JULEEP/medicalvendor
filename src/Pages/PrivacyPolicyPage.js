import React, { useState, useEffect } from "react";

const PrivacyPolicyPage = () => {
  const [privacyPolicy, setPrivacyPolicy] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedPolicy, setEditedPolicy] = useState({ title: "", content: "", date: "" });

  const dummyData = {
    title: "Privacy Policy",
    content: `This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you use our services. We value your privacy and are committed to protecting your personal data. Our policy includes details about the information we collect, how we use it, and your rights regarding your information.

1. **Information Collection**: We collect personal data such as name, email address, phone number, etc.
2. **Use of Information**: We use your information to provide and improve our services.
3. **Sharing Information**: We may share your information with third-party partners to enhance our services.
4. **Security**: We take necessary measures to ensure your data is protected from unauthorized access or disclosure.

By using our services, you agree to the collection and use of your information in accordance with this policy.`,
    date: "2025-05-05",
  };

  useEffect(() => {
    setPrivacyPolicy(dummyData);
  }, []);

  const handleEditClick = () => {
    setEditedPolicy(privacyPolicy);
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    setPrivacyPolicy(editedPolicy);
    setIsEditModalOpen(false);
  };

  if (!privacyPolicy) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-semibold text-blue-900">{privacyPolicy.title}</h2>
        <button
          onClick={handleEditClick}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Edit
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-4">Effective Date: {privacyPolicy.date}</p>
      <div className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
        {privacyPolicy.content}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">Edit Privacy Policy</h3>

            <label className="block text-gray-700 mb-1">Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded mb-4"
              value={editedPolicy.title}
              onChange={(e) => setEditedPolicy({ ...editedPolicy, title: e.target.value })}
            />

            <label className="block text-gray-700 mb-1">Effective Date</label>
            <input
              type="date"
              className="w-full p-2 border rounded mb-4"
              value={editedPolicy.date}
              onChange={(e) => setEditedPolicy({ ...editedPolicy, date: e.target.value })}
            />

            <label className="block text-gray-700 mb-1">Content</label>
            <textarea
              rows={10}
              className="w-full p-2 border rounded mb-4"
              value={editedPolicy.content}
              onChange={(e) => setEditedPolicy({ ...editedPolicy, content: e.target.value })}
            ></textarea>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacyPolicyPage;
