import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

const InterviewList = () => {
  const [interviews, setInterviews] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [candidates, setCandidates] = useState([]);  // Store list of candidates

  // Fetch interview records and candidates from the server
  useEffect(() => {
    axios.get("https://hr-backend-hifb.onrender.com/api/interviews/get-interviews")
      .then(response => {
        setInterviews(response.data.interviews);
      })
      .catch(error => {
        console.error("Error fetching interviews:", error);
      });

    axios.get("https://hr-backend-hifb.onrender.com/api/candidates/get-candidates")
      .then(response => {
        setCandidates(response.data.candidates); // Store list of candidates for the dropdown
      })
      .catch(error => {
        console.error("Error fetching candidates:", error);
      });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`https://hr-backend-hifb.onrender.com/api/interviews/delete-interview/${id}`)
      .then(() => {
        setInterviews(interviews.filter((interview) => interview._id !== id));
      })
      .catch(error => {
        console.error("Error deleting interview:", error);
      });
  };

  const handleSave = (interview) => {
    if (interview._id) {
      // Update existing interview
      axios.put(`https://hr-backend-hifb.onrender.com/api/interviews/update-interview/${interview._id}`, interview)
        .then(response => {
          setInterviews(interviews.map((i) => (i._id === interview._id ? response.data : i)));
        })
        .catch(error => {
          console.error("Error updating interview:", error);
        });
    } else {
      // Create new interview
      axios.post("https://hr-backend-hifb.onrender.com/api/interviews/create-interview", interview)
        .then(response => {
          setInterviews([...interviews, response.data.interview]);
        })
        .catch(error => {
          console.error("Error creating interview:", error);
        });
    }
    setShowModal(false);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Interview List</h2>
        <button
          className="flex items-center px-4 py-2 text-green-700 bg-green-100 border border-green-600 rounded"
          onClick={() => {
            setModalData(null);  // Clear modal data for new entry
            setShowModal(true);  // Show the modal
          }}
        >
          <FaPlus className="mr-2" /> Add Interview
        </button>
      </div>
      <table className="w-full bg-white rounded shadow-md">
        <thead>
          <tr className="text-left bg-gray-200">
            <th className="p-2">#</th>
            <th className="p-2">Candidate Name</th>
            <th className="p-2">Candidate ID</th>
            <th className="p-2">Job Position</th>
            <th className="p-2">Interview Date</th>
            <th className="p-2">Viva Marks</th>
            <th className="p-2">Written Total Marks</th>
            <th className="p-2">MCQ Total Marks</th>
            <th className="p-2">Total Marks</th>
            <th className="p-2">Selection</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {interviews.map((interview, index) => (
            <tr key={interview._id} className="border-t">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{interview.candidateName}</td>
              <td className="p-2">{interview.candidateId}</td>
              <td className="p-2">{interview.jobPosition}</td>
              <td className="p-2">{interview.interviewDate}</td>
              <td className="p-2">{interview.vivaMarks}</td>
              <td className="p-2">{interview.writtenMarks}</td>
              <td className="p-2">{interview.mcqMarks}</td>
              <td className="p-2">{interview.totalMarks}</td>
              <td className="p-2">{interview.selection}</td>
              <td className="flex gap-2 p-2">
                <button
                  className="text-blue-600"
                  onClick={() => {
                    setModalData(interview);  // Load the interview data to edit
                    setShowModal(true);
                  }}
                >
                  <FaEdit />
                </button>
                <button className="text-red-600" onClick={() => handleDelete(interview._id)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Add/Edit Interview */}
      {showModal && (
        <InterviewModal
          data={modalData}
          candidates={candidates} // Pass candidates for dropdown
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const InterviewModal = ({ data, candidates, onClose, onSave }) => {
  const [candidateName, setCandidateName] = useState(data?.candidateName || "");
  const [candidateId, setCandidateId] = useState(data?.candidateId || "");
  const [jobPosition, setJobPosition] = useState(data?.jobPosition || "");
  const [interviewDate, setInterviewDate] = useState(data?.interviewDate || "");
  const [interviewer, setInterviewer] = useState(data?.interviewer || "");
  const [vivaMarks, setVivaMarks] = useState(data?.vivaMarks || "");
  const [writtenMarks, setWrittenMarks] = useState(data?.writtenMarks || "");
  const [mcqMarks, setMcqMarks] = useState(data?.mcqMarks || "");
  const [totalMarks, setTotalMarks] = useState(data?.totalMarks || 0);
  const [recommendation, setRecommendation] = useState(data?.recommendation || "");
  const [selection, setSelection] = useState(data?.selection || "Shortlisted");
  const [details, setDetails] = useState(data?.details || "");

  const handleTotalMarksCalculation = () => {
    setTotalMarks(Number(vivaMarks) + Number(writtenMarks) + Number(mcqMarks));
  };

  useEffect(() => {
    handleTotalMarksCalculation();
  }, [vivaMarks, writtenMarks, mcqMarks]);

  const handleSubmit = () => {
    if (candidateName && jobPosition && interviewDate && interviewer && vivaMarks && writtenMarks && mcqMarks && totalMarks && recommendation && selection && details) {
      onSave({
        _id: data?._id,
        candidateName,
        candidateId,
        jobPosition,
        interviewDate,
        interviewer,
        vivaMarks,
        writtenMarks,
        mcqMarks,
        totalMarks,
        recommendation,
        selection,
        details,
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 bg-white rounded shadow-lg w-96">
        <h2 className="mb-4 text-xl">{data ? "Edit Interview" : "New Interview"}</h2>
        
        <label className="block mb-2">Candidate Name*</label>
        <select
          className="w-full p-2 border rounded"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
        >
          <option value="">Select Candidate</option>
          {candidates.map(candidate => (
            <option key={candidate._id} value={candidate.name}>{candidate.name}</option>
          ))}
        </select>

        <label className="block mt-2 mb-2">Job Position*</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={jobPosition}
          onChange={(e) => setJobPosition(e.target.value)}
        />

        <label className="block mt-2 mb-2">Interview Date*</label>
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={interviewDate}
          onChange={(e) => setInterviewDate(e.target.value)}
        />

        <label className="block mt-2 mb-2">Interviewer*</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={interviewer}
          onChange={(e) => setInterviewer(e.target.value)}
        />

        <label className="block mt-2 mb-2">Viva Marks*</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={vivaMarks}
          onChange={(e) => setVivaMarks(e.target.value)}
        />

        <label className="block mt-2 mb-2">Written Total Marks*</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={writtenMarks}
          onChange={(e) => setWrittenMarks(e.target.value)}
        />

        <label className="block mt-2 mb-2">MCQ Total Marks*</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={mcqMarks}
          onChange={(e) => setMcqMarks(e.target.value)}
        />

        <label className="block mt-2 mb-2">Total Marks*</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={totalMarks}
          disabled
        />

        <label className="block mt-2 mb-2">Recommendation</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={recommendation}
          onChange={(e) => setRecommendation(e.target.value)}
        />

        <label className="block mt-2 mb-2">Selection*</label>
        <select
          className="w-full p-2 border rounded"
          value={selection}
          onChange={(e) => setSelection(e.target.value)}
        >
          <option value="Shortlisted">Shortlisted</option>
          <option value="Passed">Passed</option>
          <option value="Failed">Failed</option>
        </select>

        <label className="block mt-2 mb-2">Details</label>
        <textarea
          className="w-full p-2 border rounded"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
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

export default InterviewList;
