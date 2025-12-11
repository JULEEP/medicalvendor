import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

const CandidateSelection = () => {
  const [candidates, setCandidates] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [entries, setEntries] = useState(10);

  // Fetch candidates data from the server
  useEffect(() => {
    axios.get("https://hr-backend-hifb.onrender.com/api/candidates/get-candidates")
      .then(response => {
        setCandidates(response.data.candidates);
      })
      .catch(error => {
        console.error("Error fetching candidates:", error);
      });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`https://hr-backend-hifb.onrender.com/api/candidates/delete-candidate/${id}`)
      .then(() => {
        setCandidates(candidates.filter((candidate) => candidate._id !== id));
      })
      .catch(error => {
        console.error("Error deleting candidate:", error);
      });
  };

  const handleSave = (candidate) => {
    if (candidate._id) {
      // Update existing candidate selection
      axios.put(`https://hr-backend-hifb.onrender.com/api/candidates/update-candidate/${candidate._id}`, candidate)
        .then(response => {
          setCandidates(candidates.map((c) => (c._id === candidate._id ? response.data : c)));
        })
        .catch(error => {
          console.error("Error updating candidate:", error);
        });
    } else {
      // Create new candidate selection
      axios.post("https://hr-backend-hifb.onrender.com/api/candidates/create-candidate", candidate)
        .then(response => {
          setCandidates([...candidates, response.data.candidate]);
        })
        .catch(error => {
          console.error("Error creating candidate:", error);
        });
    }
    setShowModal(false);
  };

  const filteredCandidates = candidates.filter((candidate) =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Candidate Selection</h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="p-2 border rounded"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="flex items-center px-4 py-2 text-green-700 bg-green-100 border border-green-600 rounded"
            onClick={() => {
              setModalData(null);  // Clear modal data for new entry
              setShowModal(true);  // Show the modal
            }}
          >
            <FaPlus className="mr-2" /> Add Candidate
          </button>
        </div>
      </div>
      
      {/* Table for Candidate Selection */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded shadow-md">
          <thead>
            <tr className="text-left bg-gray-200">
              <th className="p-2">Sl. No</th>
              <th className="p-2">Candidate Name</th>
              <th className="p-2">Candidate ID</th>
              <th className="p-2">Employee ID</th>
              <th className="p-2">Position</th>
              <th className="p-2">Selection Terms</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.slice(0, entries).map((candidate, index) => (
              <tr key={candidate._id} className="border-t">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{candidate.name}</td>
                <td className="p-2">{candidate.candidateId}</td>
                <td className="p-2">{candidate.employeeId}</td>
                <td className="p-2">{candidate.position}</td>
                <td className="p-2">{candidate.selectionTerms}</td>
                <td className="flex gap-2 p-2">
                  <button
                    className="text-blue-600"
                    onClick={() => {
                      setModalData(candidate);  // Load the candidate data to edit
                      setShowModal(true);
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button className="text-red-600" onClick={() => handleDelete(candidate._id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Entries Selection */}
      <div className="mt-4">
        <label className="mr-2">Show</label>
        <select
          className="p-2 border rounded"
          value={entries}
          onChange={(e) => setEntries(parseInt(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="ml-2">entries</span>
      </div>

      {/* Modal for Add/Edit Candidate */}
      {showModal && (
        <CandidateModal
          data={modalData}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const CandidateModal = ({ data, onClose, onSave }) => {
  const [name, setName] = useState(data?.name || "");
  const [candidateId, setCandidateId] = useState(data?.candidateId || "");
  const [employeeId, setEmployeeId] = useState(data?.employeeId || "");
  const [position, setPosition] = useState(data?.position || "");
  const [selectionTerms, setSelectionTerms] = useState(data?.selectionTerms || "");

  const handleSubmit = () => {
    if (name && position && selectionTerms) {
      onSave({
        _id: data?._id,
        name,
        candidateId,
        employeeId,
        position,
        selectionTerms,
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 bg-white rounded shadow-lg w-96">
        <h2 className="mb-4 text-xl">{data ? "Edit Candidate" : "New Candidate"}</h2>

        <div className="flex flex-wrap gap-4">
          <div className="w-full">
            <label className="block mb-2">Candidate Name*</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="w-full">
            <label className="block mb-2">Candidate ID</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={candidateId}
              onChange={(e) => setCandidateId(e.target.value)}
            />
          </div>

          <div className="w-full">
            <label className="block mb-2">Employee ID</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </div>

          <div className="w-full">
            <label className="block mb-2">Position*</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>

          <div className="w-full">
            <label className="block mb-2">Selection Terms*</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={selectionTerms}
              onChange={(e) => setSelectionTerms(e.target.value)}
            />
          </div>
        </div>

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

export default CandidateSelection;
