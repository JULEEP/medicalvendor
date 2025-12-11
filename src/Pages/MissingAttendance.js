import React, { useEffect, useState } from "react";

const MissingAttendance = () => {
  const [missingRecords, setMissingRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMissingAttendance = async () => {
      try {
        
        const data = [
          { id: 1, name: "John Doe", date: "2025-02-19", reason: "Forgot to check-in" },
          { id: 2, name: "Jane Smith", date: "2025-02-18", reason: "System error" },
          { id: 3, name: "Mark Taylor", date: "2025-02-17", reason: "Absent without notice" },
          { id: 4, name: "Alice Johnson", date: "2025-02-16", reason: "Medical leave not updated" },
          { id: 5, name: "Michael Brown", date: "2025-02-15", reason: "Technical issue" },
        ];

        setMissingRecords(data);
      } catch (error) {
        console.error("Error fetching missing attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMissingAttendance();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-4xl p-6 bg-white shadow-lg rounded-xl">
        <h3 className="mb-6 text-3xl font-semibold text-center text-gray-800">
          Missing Attendance
        </h3>

        {loading ? (
          <p className="text-lg text-center text-gray-600">Loading records...</p>
        ) : missingRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-lg shadow-md">
              <thead>
                <tr className="text-lg text-white bg-green-500">
                  <th className="p-4 border">Employee</th>
                  <th className="p-4 border">Date</th>
                  <th className="p-4 border">Reason</th>
                </tr>
              </thead>
              <tbody>
                {missingRecords.map((record, index) => (
                  <tr key={record.id} className={`text-lg ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}>
                    <td className="p-4 border">{record.name}</td>
                    <td className="p-4 border">{record.date}</td>
                    <td className="p-4 border">{record.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-lg text-center text-gray-600">
            No missing attendance records found.
          </p>
        )}
      </div>
    </div>
  );
};

export default MissingAttendance;
