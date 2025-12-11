import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

const CandidateShortlist = () => {
  const [candidates, setCandidates] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch candidates from the server
  useEffect(() => {
    axios.get("https://hr-backend-hifb.onrender.com/api/candidates/get-shortlist")
      .then(response => {
        setCandidates(response.data.candidates);
      })
      .catch(error => {
        console.error("Error fetching candidates:", error);
      });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`https://hr-backend-hifb.onrender.com/api/candidates/delete-shortlist/${id}`)
      .then(() => {
        setCandidates(candidates.filter((candidate) => candidate._id !== id));
      })
      .catch(error => {
        console.error("Error deleting candidate:", error);
      });
  };

  const handleSave = (candidate) => {
    if (candidate._id) {
      // Update existing candidate
      axios.put(`https://hr-backend-hifb.onrender.com/api/candidates/update-shortlist/${candidate._id}`, candidate)
        .then(response => {
          setCandidates(candidates.map((c) => (c._id === candidate._id ? response.data : c)));
        })
        .catch(error => {
          console.error("Error updating candidate:", error);
        });
    } else {
      // Create new candidate
      axios.post("https://hr-backend-hifb.onrender.com/api/candidates/create-shortlist", candidate)
        .then(response => {
          setCandidates([...candidates, response.data.candidate]);
        })
        .catch(error => {
          console.error("Error creating candidate:", error);
        });
    }
    setShowModal(false);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Candidate Shortlist</h2>
        <button
          className="flex items-center px-4 py-2 text-green-700 bg-green-100 border border-green-600 rounded"
          onClick={() => {
            setModalData(null);  // Clear modal data for new entry
            setShowModal(true);  // Show the modal
          }}
        >
          <FaPlus className="mr-2" /> Add Shortlist
        </button>
      </div>
      <table className="w-full bg-white rounded shadow-md">
        <thead>
          <tr className="text-left bg-gray-200">
            <th className="p-2">#</th>
            <th className="p-2">Candidate Name</th>
            <th className="p-2">Candidate ID</th>
            <th className="p-2">Job Position</th>
            <th className="p-2">Shortlist Date</th>
            <th className="p-2">Interview Date</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate, index) => (
            <tr key={candidate._id} className="border-t">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{candidate.name}</td>
              <td className="p-2">{candidate.candidateId}</td>
              <td className="p-2">{candidate.jobPosition}</td>
              <td className="p-2">{candidate.shortlistDate}</td>
              <td className="p-2">{candidate.interviewDate}</td>
              <td className="flex gap-2 p-2">
                <button
                  className="text-blue-600"
                  onClick={() => {
                    setModalData(candidate);
                    setShowModal(true);  // Open the modal for editing
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

      {/* Modal for Add/Edit Shortlist */}
      {showModal && (
        <ShortlistModal
          data={modalData}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const ShortlistModal = ({ data, onClose, onSave }) => {
  const [name, setName] = useState(data?.name || "");
  const [candidateId, setCandidateId] = useState(data?.candidateId || "");
  const [jobPosition, setJobPosition] = useState(data?.jobPosition || "");
  const [shortlistDate, setShortlistDate] = useState(data?.shortlistDate || "");
  const [interviewDate, setInterviewDate] = useState(data?.interviewDate || "");

  const handleSubmit = () => {
    if (name && candidateId && jobPosition && shortlistDate && interviewDate) {
      onSave({ _id: data?._id, name, candidateId, jobPosition, shortlistDate, interviewDate });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 bg-white rounded shadow-lg w-96">
        <h2 className="mb-4 text-xl">{data ? "Edit Shortlist" : "New Shortlist"}</h2>
        <label className="block mb-2">Candidate Name*</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="block mt-2 mb-2">Candidate ID*</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={candidateId}
          onChange={(e) => setCandidateId(e.target.value)}
        />

        <label className="block mt-2 mb-2">Job Position*</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={jobPosition}
          onChange={(e) => setJobPosition(e.target.value)}
        />

        <label className="block mt-2 mb-2">Shortlist Date*</label>
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={shortlistDate}
          onChange={(e) => setShortlistDate(e.target.value)}
        />

        <label className="block mt-2 mb-2">Interview Date*</label>
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={interviewDate}
          onChange={(e) => setInterviewDate(e.target.value)}
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

export default CandidateShortlist;
