
import React, { useState } from "react";
import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";

const initialCandidates = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Candidate ${i + 1}`,
  candidateId: `${Math.floor(1000000000 + Math.random() * 9000000000)}`,
  photograph: i < 2 ? "https://cdn-icons-png.flaticon.com/512/610/610120.png" : "",
  email: `candidate${i + 1}@mail.com`,
  ssn: i % 2 === 0 ? `SSN ${i + 1}` : "-",
  phone: `+1(555) 123-45${i}`,
}));

const Recruitment = () => {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [viewCandidate, setViewCandidate] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [candidateData, setCandidateData] = useState({
    id: null, name: "", email: "", phone: "", photograph: "", ssn: "", candidateId: ""
  });

  const itemsPerPage = 10;
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentCandidates = candidates.slice(firstIndex, lastIndex);

  // Handle Delete
  const handleDelete = (id) => {
    setCandidates(candidates.filter((candidate) => candidate.id !== id));
  };

  // Handle View
  const handleView = (candidate) => {
    setViewCandidate(candidate);
    setShowPopup(true);
  };

  // Handle Edit
  const handleEdit = (candidate) => {
    setEditMode(true);
    setCandidateData(candidate);
    setShowForm(true);
  };

  // Handle Add or Update Candidate
  const handleSave = () => {
    if (!candidateData.name || !candidateData.email || !candidateData.phone) {
      alert("Please fill all fields");
      return;
    }

    if (editMode) {
      setCandidates(
        candidates.map((c) => (c.id === candidateData.id ? candidateData : c))
      );
    } else {
      setCandidates([...candidates, { ...candidateData, id: candidates.length + 1, candidateId: `${Math.floor(1000000000 + Math.random() * 9000000000)}` }]);
    }
    setShowForm(false);
    setCandidateData({ id: null, name: "", email: "", phone: "", photograph: "", ssn: "", candidateId: "" });
    setEditMode(false);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Candidate List</h2>
          <button onClick={() => { setShowForm(true); setEditMode(false); }} className="bg-black text-white p-2 rounded flex items-center">
            <FaPlus className="mr-2" /> Add New Candidate
          </button>
        </div>

        <table className="w-full border text-left">
          <thead>
            <tr className="bg-gray-100 border">
              <th className="p-2 border">SL</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Candidate ID</th>
              <th className="p-2 border">Photograph</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">SSN</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentCandidates.map((candidate, index) => (
              <tr key={candidate.id} className="border">
                <td className="p-2 text-center">{firstIndex + index + 1}</td>
                <td className="p-2">{candidate.name}</td>
                <td className="p-2">{candidate.candidateId}</td>
                <td className="p-2 text-center">
                  {candidate.photograph ? <img src={candidate.photograph} alt="Profile" className="w-10 h-10 rounded-full" /> : "No Image"}
                </td>
                <td className="p-2">{candidate.email}</td>
                <td className="p-2">{candidate.ssn}</td>
                <td className="p-2">{candidate.phone}</td>
                <td className="p-2 flex gap-2 justify-center">
                  <button onClick={() => handleView(candidate)} className="p-2 bg-green-500 text-white rounded"><FaEye /></button>
                  <button onClick={() => handleEdit(candidate)} className="p-2 bg-blue-500 text-white rounded"><FaEdit /></button>
                  <button onClick={() => handleDelete(candidate.id)} className="p-2 bg-red-500 text-white rounded"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">{editMode ? "Edit Candidate" : "Add New Candidate"}</h3>
            {Object.keys(candidateData).map((key) => (
              key !== "id" && (
                <input key={key} type="text" placeholder={key} className="border p-2 w-full mb-2"
                  value={candidateData[key]} onChange={(e) => setCandidateData({ ...candidateData, [key]: e.target.value })} />
              )
            ))}
            <button onClick={handleSave} className="bg-black text-white p-2 rounded mr-2">Save</button>
            <button onClick={() => setShowForm(false)} className="bg-red-500 text-white p-2 rounded">Cancel</button>
          </div>
        </div>
      )}

{showPopup && viewCandidate && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Candidate Details</h3>
            <p><strong>Name:</strong> {viewCandidate.name}</p>
            <p><strong>Email:</strong> {viewCandidate.email}</p>
            <p><strong>Phone:</strong> {viewCandidate.phone}</p>
            <p><strong>SSN:</strong> {viewCandidate.ssn}</p>
            <p><strong>Candidate ID:</strong> {viewCandidate.candidateId}</p>
            <button onClick={() => setShowPopup(false)} className="bg-red-500 text-white p-2 rounded mt-4">Close</button>
          </div>
        </div>
      )}
    </div>
  );
 };

export default Recruitment;




  













