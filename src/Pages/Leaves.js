import React, { useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

const LeaveTypeList = () => {
  const [leaveTypes, setLeaveTypes] = useState([
    { id: 1, name: "Srfgt", days: 0 },
    { id: 2, name: "Annual Leave", days: 12 },
    { id: 3, name: "Casual Leaves", days: 12 },
  ]);
  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = (id) => {
    setLeaveTypes(leaveTypes.filter((leave) => leave.id !== id));
  };

  const handleSave = (leave) => {
    if (leave.id) {
      setLeaveTypes(
        leaveTypes.map((l) => (l.id === leave.id ? leave : l))
      );
    } else {
      setLeaveTypes([
        ...leaveTypes,
        { ...leave, id: leaveTypes.length + 1 },
      ]);
    }
    setShowModal(false);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex items-center justify-between pb-2 mb-4 border-b">
        <h2 className="text-xl font-semibold">Leave Type List</h2>
        <button
          className="flex items-center px-4 py-2 text-green-700 bg-green-100 border border-green-600 rounded"
          onClick={() => {
            setModalData(null);
            setShowModal(true);
          }}
        >
          <FaPlus className="mr-2" /> Add Leave Type
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded shadow-md">
          <thead>
            <tr className="text-left bg-gray-200">
              <th className="p-2">Sl</th>
              <th className="p-2">Leave Type</th>
              <th className="p-2">Days</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {leaveTypes.map((leave, index) => (
              <tr key={leave.id} className="border-t">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{leave.name}</td>
                <td className="p-2">{leave.days}</td>
                <td className="flex gap-2 p-2">
                  <button
                    className="text-blue-600"
                    onClick={() => {
                      setModalData(leave);
                      setShowModal(true);
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button className="text-red-600" onClick={() => handleDelete(leave.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <LeaveTypeModal
          data={modalData}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const LeaveTypeModal = ({ data, onClose, onSave }) => {
  const [name, setName] = useState(data?.name || "");
  const [days, setDays] = useState(data?.days || "");

  const handleSubmit = () => {
    if (name && days) {
      onSave({ id: data?.id, name, days });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 bg-white rounded shadow-lg w-96">
        <h2 className="mb-4 text-xl">{data ? "Edit Leave Type" : "New Leave Type"}</h2>
        <label className="block mb-2">Leave Type Name*</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label className="block mt-2 mb-2">Number of Days*</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />
        <div className="flex justify-end mt-4">
          <button className="px-4 py-2 mr-2 text-red-700 bg-red-100 border border-red-600 rounded" onClick={onClose}>Close</button>
          <button className="px-4 py-2 text-blue-700 bg-blue-100 border border-blue-600 rounded" onClick={handleSubmit}>
            {data ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveTypeList;
