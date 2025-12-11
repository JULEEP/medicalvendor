import React, { useEffect, useState } from "react";
import { FaFileCsv, FaEdit, FaTrash, FaUpload } from "react-icons/fa";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import StaffDetailsForm from "./StaffDetailsForm";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const companiesPerPage = 5;

  const [isEditingCompanyModalOpen, setIsEditingCompanyModalOpen] = useState(false);
  const [isAddingBeneficiaryModalOpen, setIsAddingBeneficiaryModalOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [companyDetails, setCompanyDetails] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch("https://credenhealth.onrender.com/api/admin/companies");
        const result = await response.json();
        if (response.ok) {
          setCompanies(result.companies || []);
        } else {
          console.error("Error fetching companies:", result.message);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = filteredCompanies.slice(indexOfFirstCompany, indexOfLastCompany);
  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const headers = [
    { label: "Name", key: "name" },
    { label: "Company Type", key: "companyType" },
    { label: "Assign By", key: "assignedBy" },
    { label: "Registration Date", key: "registrationDate" },
    { label: "Contract Period", key: "contractPeriod" },
    { label: "Renewal Date", key: "renewalDate" },
    { label: "Insurance Broker", key: "insuranceBroker" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    { label: "Strength", key: "companyStrength" },
  ];


  const handleEdit = (id) => {
    const company = companies.find(c => c._id === id);
    if (company) {
      setCompanyDetails(company);
      setSelectedCompanyId(id);
      setIsEditingCompanyModalOpen(true);
    }
  };


  const handleBulkImport = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Prepare the file for upload
      const formData = new FormData();
      formData.append("file", file);
  
      try {
        // Send the file to the server
        const response = await fetch("http://localhost:4000/api/admin/import-companies", {
          method: "POST",
          body: formData,
        });
  
        const result = await response.json();
  
        if (response.ok) {
          alert("Data imported successfully!");
          console.log("Imported companies:", result.data);
          setCompanies((prevCompanies) => [...prevCompanies, ...result.data]); // Add newly imported companies to state
        } else {
          alert("Error importing data: " + result.error);
          console.error("Error importing data:", result.error);
        }
      } catch (error) {
        console.error("Error during file upload:", error);
        alert("Failed to upload file.");
      }
    }
  };
  

  const handleDelete = (id) => {
    setCompanies(companies.filter(company => company._id !== id));
  };

  const closeCompanyEditModal = () => {
    setIsEditingCompanyModalOpen(false);
    setSelectedCompanyId(null);
    setCompanyDetails({});
  };

  const closeBeneficiaryModal = () => {
    setIsAddingBeneficiaryModalOpen(false);
    setSelectedCompanyId(null);
    setCompanyDetails({});
  };

  const handleViewStaff = (companyId) => {
    navigate(`/stafflist?companyId=${companyId}`);
  };

  const handleViewDiagnostics = (companyId) => {
    navigate(`/alldiagnostic?companyId=${companyId}`);
  };


  const handleAddBeneficiary = (companyId) => {
    setSelectedCompanyId(companyId);
    setIsAddingBeneficiaryModalOpen(true);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    const response = await fetch(`https://credenhealth.onrender.com/api/admin/companies/${selectedCompanyId}`, {
      method: 'PUT',
      body: JSON.stringify(companyDetails),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();
    if (response.ok) {
      alert("Company details updated successfully!");
      setCompanies(companies.map(company => company._id === selectedCompanyId ? result.company : company));
      closeCompanyEditModal();
    } else {
      alert("Failed to update company details");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow text-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Company List</h2>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <input
          type="text"
          className="px-2 py-1 border rounded text-sm w-64"
          placeholder="Search by company name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // Reset to page 1 on search
          }}
        />

        <CSVLink
          data={filteredCompanies}
          headers={headers}
          filename="company_list.csv"
          className="px-3 py-1 bg-green-500 text-white rounded flex items-center gap-1"
        >
          <FaFileCsv /> CSV
        </CSVLink>

        <label
          htmlFor="file-upload"
          className="px-3 py-1 bg-purple-600 text-white rounded flex items-center gap-1 cursor-pointer"
        >
          <FaUpload /> Import
          <input
            id="file-upload"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleBulkImport}
            className="hidden"
          />
        </label>
      </div>

      <div className="overflow-x-auto">
        <div className="max-h-[400px] overflow-y-auto border rounded">
          <table className="min-w-[1000px] border-collapse text-xs">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {headers.map((header, idx) => (
                  <th key={idx} className="p-2 border">{header.label}</th>
                ))}
                <th className="p-2 border">Actions</th>
                <th className="p-2 border">View Staff</th>
                <th className="p-2 border">Add Beneficiary</th>
                <th className="p-2 border">View Diagnostics</th> {/* New column for "View" button */}

              </tr>
            </thead>
            <tbody>
              {currentCompanies.map((company, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-2 border">{company.name}</td>
                  <td className="p-2 border">{company.companyType}</td>
                  <td className="p-2 border">{company.assignedBy}</td>
                  <td className="p-2 border">{company.registrationDate?.slice(0, 10)}</td>
                  <td className="p-2 border">{company.contractPeriod}</td>
                  <td className="p-2 border">{company.renewalDate?.slice(0, 10)}</td>
                  <td className="p-2 border">{company.insuranceBroker}</td>
                  <td className="p-2 border">{company.email}</td>
                  <td className="p-2 border">{company.phone}</td>
                  <td className="p-2 border">{company.companyStrength}</td>
                  <td className="p-2 border text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleEdit(company._id)} className="text-blue-500 hover:text-blue-700">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(company._id)} className="text-red-500 hover:text-red-700">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                  <td className="p-2 border text-center">
                    <button onClick={() => handleViewStaff(company._id)} className="px-4 py-2 bg-purple-900 text-white rounded text-sm">
                      View
                    </button>
                  </td>
                  <td className="p-2 border text-center">
                    <button onClick={() => handleAddBeneficiary(company._id)} className="px-4 py-2 bg-green-500 text-white rounded text-sm">
                      Add
                    </button>
                  </td>
                  {/* New View Diagnostics column with View button */}
                  <td className="p-2 border text-center">
                  <button
                    onClick={() => handleViewDiagnostics(company._id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded text-sm"
                  >
                    View
                  </button>
                </td>
                
                
                </tr>
              ))}
              {currentCompanies.length === 0 && (
                <tr>
                  <td colSpan={headers.length + 3} className="text-center p-3 text-gray-500">
                    No companies found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center items-center gap-2 text-sm">
        <button onClick={prevPage} disabled={currentPage === 1} className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50">
          Previous
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => paginate(idx + 1)}
            className={`px-3 py-1 rounded ${currentPage === idx + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            {idx + 1}
          </button>
        ))}
        <button onClick={nextPage} disabled={currentPage === totalPages} className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50">
          Next
        </button>
      </div>

      {/* Edit Company Modal */}
      {isEditingCompanyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl relative">
            <button className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl font-bold" onClick={closeCompanyEditModal}>×</button>
            <h3 className="text-xl mb-4">Edit Company</h3>
            <form onSubmit={handleSubmitEdit}>
              <div className="mb-4">
                <label className="block text-sm mb-2">Company Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  value={companyDetails.name || ""}
                  onChange={(e) => setCompanyDetails({ ...companyDetails, name: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-2">Company Type</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  value={companyDetails.companyType || ""}
                  onChange={(e) => setCompanyDetails({ ...companyDetails, companyType: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className="px-4 py-2 bg-gray-300 text-black rounded" onClick={closeCompanyEditModal}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Beneficiary Modal */}
      {isAddingBeneficiaryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl relative">
            <button className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl font-bold" onClick={closeBeneficiaryModal}>×</button>
            <StaffDetailsForm companyId={selectedCompanyId} closeModal={closeBeneficiaryModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyList;
