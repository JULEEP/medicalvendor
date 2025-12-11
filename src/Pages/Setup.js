import { Pencil, Trash } from "lucide-react";

const data = [
  { id: 1, name: "Pa", type: "Tax", amount: "2", onGross: "Yes", onBasic: "No", status: "Active" },
  { id: 2, name: "Dfgdfg", type: "Time", amount: "-", onGross: "No", onBasic: "No", status: "Active" },
  { id: 3, name: "NSSF", type: "Deduction", amount: "2 (%)", onGross: "No", onBasic: "Yes", status: "Active" },
  { id: 4, name: "Mobile Expense", type: "Basic", amount: "5 (%)", onGross: "No", onBasic: "Yes", status: "Active" },
  { id: 5, name: "Iyykjk", type: "Basic", amount: "10", onGross: "Yes", onBasic: "No", status: "Active" },
  { id: 6, name: "Test Deduction", type: "Deduction", amount: "1000", onGross: "Yes", onBasic: "No", status: "Active" },
];

export default function SetupRulesTable() {
  return (
    <div className="p-6 shadow-lg bg-white rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Setup Rules</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 text-left">Sl</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">On Gross</th>
              <th className="p-3 text-left">On Basic</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.type}</td>
                <td className="p-3">{item.amount}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-white ${item.onGross === "Yes" ? "bg-green-500" : "bg-red-500"}`}>
                    {item.onGross}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-white ${item.onBasic === "Yes" ? "bg-green-500" : "bg-red-500"}`}>
                    {item.onBasic}
                  </span>
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-green-500 text-white rounded">{item.status}</span>
                </td>
                <td className="p-3 flex space-x-2">
                  <div className="relative group">
                    <button className="p-2 bg-blue-500 text-white rounded hover:scale-110 transition">
                      <Pencil size={16} />
                    </button>
                    <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded">
                      Edit
                    </span>
                  </div>
                  <div className="relative group">
                    <button className="p-2 bg-red-500 text-white rounded hover:scale-110 transition">
                      <Trash size={16} />
                    </button>
                    <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded">
                      Delete
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
