import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";


const CompanyDetailsForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [assignedBy, setAssignedBy] = useState("");
  const [registrationDate, setRegistrationDate] = useState("");
  const [contractPeriod, setContractPeriod] = useState("");
  const [renewalDate, setRenewalDate] = useState("");
  const [insuranceBroker, setInsuranceBroker] = useState("");
  const [email, setEmail] = useState("varma@gmail.com");
  const [phone, setPhone] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [companyStrength, setCompanyStrength] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [password, setPassword] = useState("");
  const [documents, setDocuments] = useState([]);
  const [diagnostic, setDiagnostic] = useState([]);
  
  // const [contactPerson, setContactPerson] = useState({
  //   name: "",
  //   designation: "",
  //   gender: "",
  //   contactEmail: "",
  //   contactNumber: "",
  //   diagnostic: [], // Initialize as an empty array to hold multiple selections

  // });
  const [contactPerson, setContactPerson] = useState({
    diagnostic: [],
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleCheckboxChange = (diagnostic) => {
    const selected = contactPerson.diagnostic.includes(diagnostic)
      ? contactPerson.diagnostic.filter((d) => d !== diagnostic)
      : [...contactPerson.diagnostic, diagnostic];
  
    setContactPerson({ ...contactPerson, diagnostic: selected });
  };
  

  const handleRemoveDiagnostic = (diagnosticToRemove) => {
    const updated = contactPerson.diagnostic.filter((d) => d !== diagnosticToRemove);
    setContactPerson({ ...contactPerson, diagnostic: updated });
  };

  const [diagnosticsList, setDiagnosticsList] = useState([]);
const [selectedDiagnostics, setSelectedDiagnostics] = useState([]);


// Fetch diagnostics on mount
useEffect(() => {
  const fetchDiagnostics = async () => {
    try {
      const res = await fetch("https://credenhealth.onrender.com/api/admin/alldiagnostics");
      const data = await res.json();
      setDiagnosticsList(data.diagnostics || []);
    } catch (err) {
      console.error("Error fetching diagnostics:", err);
    }
  };
  fetchDiagnostics();
}, []);

// Close dropdown on outside click
useEffect(() => {
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

const handleDiagnosticClick = (diagnosticName) => {
  const selectedDiagnostic = diagnosticsList.find((item) => item.name === diagnosticName);

  if (selectedDiagnostic && !diagnostic.includes(selectedDiagnostic._id)) {
    setDiagnostic([...diagnostic, selectedDiagnostic._id]);
    setSelectedDiagnostics([...selectedDiagnostics, diagnosticName]);
  }
};

const handleRemove = (name) => {
  const selectedDiagnostic = diagnosticsList.find((item) => item.name === name);
  if (!selectedDiagnostic) return;

  setSelectedDiagnostics(selectedDiagnostics.filter((item) => item !== name));
  setDiagnostic(diagnostic.filter((id) => id !== selectedDiagnostic._id));
};



  // const handleDiagnosticChange = (e) => {
  //   const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
  //   setContactPerson({ ...contactPerson, diagnostic: selectedOptions });
  // };

  // const handleRemoveDiagnostic = (diagnosticToRemove) => {
  //   const updatedDiagnostics = contactPerson.diagnostic.filter(
  //     (diagnostic) => diagnostic !== diagnosticToRemove
  //   );
  //   setContactPerson({ ...contactPerson, diagnostic: updatedDiagnostics });
  // };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setDocuments(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("companyType", companyType);
    formData.append("assignedBy", assignedBy);
    formData.append("registrationDate", registrationDate);
    formData.append("contractPeriod", contractPeriod);
    formData.append("renewalDate", renewalDate);
    formData.append("insuranceBroker", insuranceBroker);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("gstNumber", gstNumber);
    formData.append("companyStrength", companyStrength);
    formData.append("country", country);
    formData.append("state", state);
    formData.append("city", city);
    formData.append("pincode", pincode);
    formData.append("password", password);
    formData.append("diagnostic", JSON.stringify(diagnostic));




    const contactPersonData = {
      name: contactPerson.name,
      designation: contactPerson.designation,
      gender: contactPerson.gender,
      email: contactPerson.contactEmail,
      phone: contactPerson.contactNumber,
      address: {
        country,
        state,
        city,
        pincode,
        street: "Not Provided",
      },
    };

    formData.append("contactPerson", JSON.stringify(contactPersonData));

    documents.forEach((doc) => {
      formData.append("documents", doc);
    });

    try {
      const res = await fetch("https://credenhealth.onrender.com/api/admin/create-company", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Company created successfully!");
        console.log("Created:", data);
      } else {
        alert("❌ Failed: " + data.message);
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h3 className="text-lg font-bold mb-4">Company Details</h3>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4 mb-4">
          <div className="w-1/4">
            <label className="block text-sm mb-1">Name</label>
            <input className="p-2 border rounded" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          </div>
          <div className="w-1/4">
            <label className="block text-sm mb-1">Company Type</label>
            <input className="p-2 border rounded" value={companyType} onChange={(e) => setCompanyType(e.target.value)} placeholder="Company Type" />
          </div>
          <div className="w-1/4">
            <label className="block text-sm mb-1">Assign by</label>
            <select className="p-2 border rounded" value={assignedBy} onChange={(e) => setAssignedBy(e.target.value)}>
              <option value="">--Select--</option>
              <option value="Sales Manager">Sales Manager</option>
              <option value="Key Account Manager">Key Account Manager</option>
            </select>
          </div>
          <div className="w-1/4">
            <label className="block text-sm mb-1">Date of Registration</label>
            <input type="date" className="p-2 border rounded" value={registrationDate} onChange={(e) => setRegistrationDate(e.target.value)} />
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="w-1/4">
            <label className="block text-sm mb-1">Contract Period</label>
            <input type="text" className="p-2 border rounded" value={contractPeriod} onChange={(e) => setContractPeriod(e.target.value)} />
          </div>
          <div className="w-1/4">
            <label className="block text-sm mb-1">Renewal Date</label>
            <input type="date" className="p-2 border rounded" value={renewalDate} onChange={(e) => setRenewalDate(e.target.value)} />
          </div>
          <div className="w-1/4">
            <label className="block text-sm mb-1">Insurance Broker</label>
            <input className="p-2 border rounded" value={insuranceBroker} onChange={(e) => setInsuranceBroker(e.target.value)} />
          </div>
          <div className="w-1/4">
            <label className="block text-sm mb-1">Email</label>
            <input className="p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="w-1/4">
            <label className="block text-sm mb-1">Phone</label>
            <input className="p-2 border rounded" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="w-1/4">
            <label className="block text-sm mb-1">GST Number</label>
            <input className="p-2 border rounded" value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} />
          </div>
          <div className="w-1/4">
            <label className="block text-sm mb-1">Company Strength</label>
            <input className="p-2 border rounded" value={companyStrength} onChange={(e) => setCompanyStrength(e.target.value)} />
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="w-1/4">
            <label className="block text-sm mb-1">Country</label>
            <select className="p-2 border rounded" value={country} onChange={(e) => setCountry(e.target.value)}>
              <option value="">Select Country</option>
              <option value="India">India</option>
            </select>
          </div>
          <div className="w-1/4">
            <label className="block text-sm mb-1">State</label>
            <select className="p-2 border rounded" value={state} onChange={(e) => setState(e.target.value)}>
              <option value="">Select State</option>
              <option value="State 1">State 1</option>
              <option value="State 2">State 2</option>
            </select>
          </div>
          <div className="w-1/4">
            <label className="block text-sm mb-1">City</label>
            <select className="p-2 border rounded" value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">Select City</option>
              <option value="City 1">City 1</option>
              <option value="City 2">City 2</option>
            </select>
          </div>
          <div className="w-1/4">
            <label className="block text-sm mb-1">Pincode</label>
            <input className="p-2 border rounded" value={pincode} onChange={(e) => setPincode(e.target.value)} />
          </div>
        </div>

        <h4 className="font-semibold mb-2">Contact Person Details</h4>
        <div className="mb-4 border p-4 rounded">
          <div className="flex gap-4 mb-4">
            <div className="w-1/4">
              <label className="block text-sm mb-1">Name</label>
              <input className="p-1 border rounded" value={contactPerson.name} onChange={(e) => setContactPerson({ ...contactPerson, name: e.target.value })} />
            </div>
            <div className="w-1/4">
              <label className="block text-sm mb-1">Designation</label>
              <input className="p-1 border rounded" value={contactPerson.designation} onChange={(e) => setContactPerson({ ...contactPerson, designation: e.target.value })} />
            </div>
            <div className="w-1/4">
              <label className="block text-sm mb-1">Gender</label>
              <select className="p-1 border rounded" value={contactPerson.gender} onChange={(e) => setContactPerson({ ...contactPerson, gender: e.target.value })}>
                <option value="">--Select--</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="w-1/4">
              <label className="block text-sm mb-1">Contact Email</label>
              <input className="p-1 border rounded" value={contactPerson.contactEmail} onChange={(e) => setContactPerson({ ...contactPerson, contactEmail: e.target.value })} />
            </div>
            <div className="w-1/4">
              <label className="block text-sm mb-1">Contact Number</label>
              <input className="p-1 border rounded" value={contactPerson.contactNumber} onChange={(e) => setContactPerson({ ...contactPerson, contactNumber: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Upload Documents (Max 5)</label>
          <input type="file" className="p-2 border rounded" multiple onChange={handleFileUpload} />
          {documents.length > 0 && (
            <ul className="text-sm mt-1 list-disc pl-4">
              {documents.map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex gap-4 mb-4">
        <div className="w-1/4">
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            className="p-2 border rounded w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="w-1/4 relative" ref={dropdownRef}>
        <label className="block text-sm mb-1">Diagnostic</label>
      
        {/* Trigger Dropdown */}
        <div
          className="p-2 border rounded bg-white cursor-pointer"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          --Select--
        </div>
      
        {/* Dropdown Menu - opens upward */}
        {showDropdown && (
          <div className="absolute z-10 bg-white border rounded shadow max-h-40 overflow-y-auto w-full top-0 translate-y-[-100%]">
            {diagnosticsList.map((item) => (
              <div
                key={item._id}
                onClick={() => handleDiagnosticClick(item.name)}
                className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
              >
                {item.name}
              </div>
            ))}
          </div>
        )}
      
        {/* Selected diagnostics shown below */}
        {selectedDiagnostics.length > 0 && (
          <div className="mt-2">
            <p className="font-semibold">Selected Diagnostics:</p>
            <ul className="list-disc pl-5">
              {selectedDiagnostics.map((name, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  {name}
                  <button
                    type="button"
                    onClick={() => handleRemove(name)}
                    className="text-red-500 ml-2"
                  >
                    <RxCross1 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>    
</div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-4 py-2 text-red-700 bg-red-100 border border-red-600 rounded"
          >
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 text-blue-700 bg-blue-100 border border-blue-600 rounded">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyDetailsForm;
