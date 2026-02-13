import React, { useEffect, useState } from "react";
import { 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaCheckCircle,
  FaTimesCircle,
  FaMoneyBillWave,
  FaDownload,
  FaPlusCircle,
  FaWallet,
  FaRupeeSign,
  FaExchangeAlt,
  FaListAlt,
  FaUser,
  FaIdCard,
  FaBuilding,
  FaMapMarkerAlt,
  FaQrcode,
  FaCreditCard,
  FaHistory,
  FaFilter,
  FaArrowUp,
  FaArrowDown,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationTriangle
} from "react-icons/fa";

export default function VendorWallet() {
  const [walletData, setWalletData] = useState({
    walletBalance: 0,
    walletTransactions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10);
  
  // Account Management states
  const [showAddAccountPopup, setShowAddAccountPopup] = useState(false);
  const [showViewAccountPopup, setShowViewAccountPopup] = useState(false);
  const [showEditAccountPopup, setShowEditAccountPopup] = useState(false);
  const [selectedAccountForView, setSelectedAccountForView] = useState(null);
  const [selectedAccountForEdit, setSelectedAccountForEdit] = useState(null);
  const [accountDetails, setAccountDetails] = useState({
    upi: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
    accountType: "savings",
    branchName: ""
  });
  const [editAccountDetails, setEditAccountDetails] = useState({
    upi: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
    accountType: "savings",
    branchName: ""
  });
  const [accountLoading, setAccountLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  
  // Withdrawal states
  const [showWithdrawalPopup, setShowWithdrawalPopup] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [savedAccounts, setSavedAccounts] = useState([]);
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);

  const vendorId = localStorage.getItem("vendorId");

  // Fetch all data
  useEffect(() => {
    if (!vendorId) {
      setError("Vendor ID not found. Please login again.");
      setLoading(false);
      return;
    }

    const fetchAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchWalletData(),
          fetchSavedAccounts(),
          fetchWithdrawalRequests()
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [vendorId]);

  // Fetch wallet data
  const fetchWalletData = async () => {
    try {
      const response = await fetch(`http://31.97.206.144:7021/api/vendor/getwallet/${vendorId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch wallet data.");
      }

      setWalletData({
        walletBalance: data.walletBalance || 0,
        walletTransactions: data.walletTransactions || []
      });
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch saved accounts
  const fetchSavedAccounts = async () => {
    try {
      const response = await fetch(`http://31.97.206.144:7021/api/vendor/accounts/${vendorId}`);
      const data = await response.json();
      if (response.ok) {
        const accounts = data.accounts || [];
        setSavedAccounts(accounts);
        if (accounts.length > 0) {
          setSelectedAccount(accounts[0]._id);
        }
      }
    } catch (err) {
      console.error("Error fetching accounts:", err);
    }
  };

  // Fetch withdrawal requests
  const fetchWithdrawalRequests = async () => {
    try {
      const response = await fetch(`http://31.97.206.144:7021/api/vendor/withdrawals/${vendorId}?limit=50`);
      const data = await response.json();
      if (response.ok) {
        setWithdrawalRequests(data.withdrawals || []);
      }
    } catch (err) {
      console.error("Error fetching withdrawals:", err);
    }
  };

  // View account details
  const viewAccountDetails = (account) => {
    setSelectedAccountForView(account);
    setShowViewAccountPopup(true);
  };

  // Edit account
  const editAccount = (account) => {
    setSelectedAccountForEdit(account);
    setEditAccountDetails({
      upi: account.upiId || "",
      bankName: account.bankName || "",
      accountNumber: account.accountNumber || "",
      ifscCode: account.ifscCode || "",
      accountHolderName: account.accountHolderName || "",
      accountType: account.accountType || "savings",
      branchName: account.branchName || ""
    });
    setShowEditAccountPopup(true);
  };

  // Update account
  const updateBankAccount = async () => {
    if (!editAccountDetails.bankName || !editAccountDetails.accountNumber || !editAccountDetails.ifscCode || !editAccountDetails.accountHolderName) {
      alert("Please fill all required account details");
      return;
    }

    setAccountLoading(true);

    try {
      const response = await fetch(`http://31.97.206.144:7021/api/vendor/accounts/${vendorId}/${selectedAccountForEdit._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountHolderName: editAccountDetails.accountHolderName,
          bankName: editAccountDetails.bankName,
          accountNumber: editAccountDetails.accountNumber,
          ifscCode: editAccountDetails.ifscCode.toUpperCase(),
          accountType: editAccountDetails.accountType,
          upiId: editAccountDetails.upi,
          branchName: editAccountDetails.branchName
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update account");
      }

      alert("Account updated successfully!");
      await fetchSavedAccounts();
      setShowEditAccountPopup(false);
      setSelectedAccountForEdit(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setAccountLoading(false);
    }
  };

  const addBankAccount = async () => {
    if (!accountDetails.bankName || !accountDetails.accountNumber || !accountDetails.ifscCode || !accountDetails.accountHolderName) {
      alert("Please fill all required account details");
      return;
    }

    setAccountLoading(true);

    try {
      const addAccountResponse = await fetch(`http://31.97.206.144:7021/api/vendor/add-account/${vendorId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountHolderName: accountDetails.accountHolderName,
          bankName: accountDetails.bankName,
          accountNumber: accountDetails.accountNumber,
          ifscCode: accountDetails.ifscCode.toUpperCase(),
          accountType: accountDetails.accountType,
          upiId: accountDetails.upi,
          branchName: accountDetails.branchName,
          isDefault: savedAccounts.length === 0
        })
      });

      const addAccountData = await addAccountResponse.json();

      if (!addAccountResponse.ok) {
        throw new Error(addAccountData.message || "Failed to add account");
      }

      alert("Account added successfully!");
      await fetchSavedAccounts();
      setShowAddAccountPopup(false);
      resetAccountForm();

    } catch (err) {
      alert(err.message || "An error occurred");
    } finally {
      setAccountLoading(false);
    }
  };

  // Delete bank account
  const deleteBankAccount = async (accountId) => {
    try {
      const response = await fetch(`http://31.97.206.144:7021/api/vendor/accounts/${vendorId}/${accountId}`, {
        method: "DELETE"
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete account");
      }

      alert("Account deleted successfully!");
      await fetchSavedAccounts();
      setShowDeleteConfirm(null);
    } catch (err) {
      alert(err.message);
    }
  };

  // Set default account
  const setDefaultAccount = async (accountId) => {
    try {
      const response = await fetch(`http://31.97.206.144:7021/api/vendor/accounts/${vendorId}/${accountId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isDefault: true
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to set default account");
      }

      alert("Default account updated!");
      await fetchSavedAccounts();
    } catch (err) {
      alert(err.message);
    }
  };

  // Reset account form
  const resetAccountForm = () => {
    setAccountDetails({
      upi: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      accountHolderName: "",
      accountType: "savings",
      branchName: ""
    });
  };

  // Handle withdrawal submission
  const handleWithdrawalSubmit = async () => {
    if (!withdrawalAmount || isNaN(withdrawalAmount) || parseFloat(withdrawalAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (parseFloat(withdrawalAmount) < 100) {
      alert("Minimum withdrawal amount is ₹100");
      return;
    }

    if (parseFloat(withdrawalAmount) > walletData.walletBalance) {
      alert("Insufficient balance");
      return;
    }

    if (savedAccounts.length === 0) {
      alert("Please add a bank account first");
      setShowAddAccountPopup(true);
      return;
    }

    if (!selectedAccount) {
      alert("Please select a bank account");
      return;
    }

    setWithdrawalLoading(true);

    try {
      const withdrawalResponse = await fetch(`http://31.97.206.144:7021/api/vendor/withdraw/${vendorId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vendorId,
          amount: parseFloat(withdrawalAmount),
          accountId: selectedAccount,
          paymentMethod: 'bank_transfer'
        })
      });

      const withdrawalData = await withdrawalResponse.json();
      
      if (!withdrawalResponse.ok) {
        throw new Error(withdrawalData.message || withdrawalData.message || "Withdrawal request failed");
      }

      alert("Withdrawal request submitted successfully!");
      
      await Promise.all([
        fetchWalletData(),
        fetchWithdrawalRequests()
      ]);
      
      setWithdrawalAmount("");
      setShowWithdrawalPopup(false);
    } catch (err) {
      alert(err.message || "An error occurred");
    } finally {
      setWithdrawalLoading(false);
    }
  };

  // Cancel withdrawal request
  const cancelWithdrawalRequest = async (requestId) => {
    if (!window.confirm("Are you sure you want to cancel this withdrawal request?")) {
      return;
    }

    try {
      const response = await fetch(`http://31.97.206.144:7021/api/vendor/withdrawals/cancel/${vendorId}/${requestId}`, {
        method: "PUT"
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel withdrawal");
      }

      alert("Withdrawal request cancelled successfully!");
      await fetchWithdrawalRequests();
      await fetchWalletData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Download statement
  const downloadStatement = async () => {
    try {
      const response = await fetch(`http://31.97.206.144:7021/api/vendor/getwallet/${vendorId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch statement data");
      }

      let csvContent = "Date,Description,Order ID,Type,Amount,Status\n";
      
      walletData.walletTransactions.forEach(transaction => {
        const date = new Date(transaction.createdAt).toLocaleDateString();
        const description = transaction.description || (transaction.type === 'credit' ? 'Payment received' : 'Withdrawal');
        const orderId = transaction.order?.orderNumber || transaction.orderId?.slice(-8) || 'N/A';
        const type = transaction.type;
        const amount = transaction.amount;
        const status = transaction.status || 'completed';
        
        csvContent += `${date},"${description}",${orderId},${type},${amount},${status}\n`;
      });

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wallet-statement-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      alert("Statement downloaded successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  // Pagination for transactions
  const filteredTransactions = walletData.walletTransactions.filter(transaction => {
    if (filter === "all") return true;
    return transaction.type === filter;
  });

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getTransactionTypeStyle = (type) => {
    switch (type?.toLowerCase()) {
      case "credit":
        return "bg-green-50 text-green-700 border-green-200";
      case "debit":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getTransactionIcon = (type) => {
    if (type === 'credit') {
      return <FaArrowUp className="w-4 h-4 text-green-600" />;
    } else if (type === 'debit') {
      return <FaArrowDown className="w-4 h-4 text-red-600" />;
    } else {
      return <FaExchangeAlt className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const calculateTotal = (type) => {
    return walletData.walletTransactions
      .filter(t => t.type === type)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getWithdrawalStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
      case "failed":
        return "bg-red-100 text-red-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Mobile-friendly filter buttons
  const FilterButtons = () => (
    <div className="flex space-x-2 overflow-x-auto pb-2">
      <button
        onClick={() => setFilter("all")}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center whitespace-nowrap ${filter === "all" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
      >
        <FaFilter className="mr-1 text-sm" />
        All
      </button>
      <button
        onClick={() => setFilter("credit")}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center whitespace-nowrap ${filter === "credit" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
      >
        <FaArrowUp className="mr-1 text-sm" />
        Credits
      </button>
      <button
        onClick={() => setFilter("debit")}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center whitespace-nowrap ${filter === "debit" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
      >
        <FaArrowDown className="mr-1 text-sm" />
        Debits
      </button>
    </div>
  );

  // Account Detail Modal Components
  const ViewAccountModal = () => {
    if (!selectedAccountForView) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <FaEye className="mr-2 text-blue-600" />
                Account Details
              </h3>
              <button 
                onClick={() => {
                  setShowViewAccountPopup(false);
                  setSelectedAccountForView(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimesCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Bank Name</p>
                  <p className="font-medium">{selectedAccountForView.bankName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <FaUser className="text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Account Holder</p>
                  <p className="font-medium">{selectedAccountForView.accountHolderName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <FaIdCard className="text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Account Number</p>
                  <p className="font-mono font-medium">****{selectedAccountForView.accountNumber?.slice(-4)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <FaQrcode className="text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">IFSC Code</p>
                  <p className="font-mono font-medium">{selectedAccountForView.ifscCode}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <FaBuilding className="text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Account Type</p>
                  <p className="font-medium capitalize">{selectedAccountForView.accountType}</p>
                </div>
              </div>

              {selectedAccountForView.branchName && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FaMapMarkerAlt className="text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Branch Name</p>
                    <p className="font-medium">{selectedAccountForView.branchName}</p>
                  </div>
                </div>
              )}

              {selectedAccountForView.upiId && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FaCreditCard className="text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">UPI ID</p>
                    <p className="font-medium">{selectedAccountForView.upiId}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className={`p-3 rounded-lg ${selectedAccountForView.isDefault ? 'bg-green-100 border border-green-200' : 'bg-gray-100'}`}>
                  <p className="text-sm text-gray-600">Default Account</p>
                  <div className="flex items-center mt-1">
                    {selectedAccountForView.isDefault ? (
                      <>
                        <FaCheckCircle className="text-green-600 mr-2" />
                        <span className="text-green-700 font-medium">Yes</span>
                      </>
                    ) : (
                      <span className="text-gray-700 font-medium">No</span>
                    )}
                  </div>
                </div>

                <div className={`p-3 rounded-lg ${selectedAccountForView.status === 'active' ? 'bg-green-100 border border-green-200' : 'bg-yellow-100'}`}>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className={`font-medium capitalize ${selectedAccountForView.status === 'active' ? 'text-green-700' : 'text-yellow-700'}`}>
                    {selectedAccountForView.status}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowViewAccountPopup(false);
                setSelectedAccountForView(null);
              }}
              className="w-full mt-6 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const EditAccountModal = () => {
    if (!selectedAccountForEdit) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <FaEdit className="mr-2 text-blue-600" />
                Edit Account
              </h3>
              <button 
                onClick={() => {
                  setShowEditAccountPopup(false);
                  setSelectedAccountForEdit(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimesCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaUser className="mr-2" />
                  Account Holder Name *
                </label>
                <input
                  type="text"
                  value={editAccountDetails.accountHolderName}
                  onChange={(e) => setEditAccountDetails(prev => ({...prev, accountHolderName: e.target.value}))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  Bank Name *
                </label>
                <input
                  type="text"
                  value={editAccountDetails.bankName}
                  onChange={(e) => setEditAccountDetails(prev => ({...prev, bankName: e.target.value}))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter bank name"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number *
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={editAccountDetails.accountNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setEditAccountDetails(prev => ({...prev, accountNumber: value}));
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1234567890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Type *
                  </label>
                  <select
                    value={editAccountDetails.accountType}
                    onChange={(e) => setEditAccountDetails(prev => ({...prev, accountType: e.target.value}))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="savings">Savings</option>
                    <option value="current">Current</option>
                    <option value="salary">Salary</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaQrcode className="mr-2" />
                  IFSC Code *
                </label>
                <input
                  type="text"
                  value={editAccountDetails.ifscCode}
                  onChange={(e) => setEditAccountDetails(prev => ({...prev, ifscCode: e.target.value.toUpperCase()}))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="SBIN0001234"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaMapMarkerAlt className="mr-2" />
                  Branch Name
                </label>
                <input
                  type="text"
                  value={editAccountDetails.branchName}
                  onChange={(e) => setEditAccountDetails(prev => ({...prev, branchName: e.target.value}))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter branch name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaCreditCard className="mr-2" />
                  UPI ID (Optional)
                </label>
                <input
                  type="text"
                  value={editAccountDetails.upi}
                  onChange={(e) => setEditAccountDetails(prev => ({...prev, upi: e.target.value.toLowerCase()}))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="username@upi"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEditAccountPopup(false);
                  setSelectedAccountForEdit(null);
                }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={accountLoading}
              >
                Cancel
              </button>
              <button
                onClick={updateBankAccount}
                disabled={accountLoading || !editAccountDetails.bankName || !editAccountDetails.accountNumber || !editAccountDetails.ifscCode || !editAccountDetails.accountHolderName}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {accountLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="mr-2" />
                    Update Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AddAccountPopup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <FaPlusCircle className="mr-2 text-green-600" />
              Add Bank Account
            </h3>
            <button 
              onClick={() => {
                setShowAddAccountPopup(false);
                resetAccountForm();
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimesCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaUser className="mr-2" />
                Account Holder Name *
              </label>
              <input
                type="text"
                value={accountDetails.accountHolderName}
                onChange={(e) => setAccountDetails(prev => ({...prev, accountHolderName: e.target.value}))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                Bank Name *
              </label>
              <input
                type="text"
                value={accountDetails.bankName}
                onChange={(e) => setAccountDetails(prev => ({...prev, bankName: e.target.value}))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter bank name"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number *
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={accountDetails.accountNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setAccountDetails(prev => ({...prev, accountNumber: value}));
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type *
                </label>
                <select
                  value={accountDetails.accountType}
                  onChange={(e) => setAccountDetails(prev => ({...prev, accountType: e.target.value}))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="savings">Savings</option>
                  <option value="current">Current</option>
                  <option value="salary">Salary</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaQrcode className="mr-2" />
                IFSC Code *
              </label>
              <input
                type="text"
                value={accountDetails.ifscCode}
                onChange={(e) => setAccountDetails(prev => ({...prev, ifscCode: e.target.value.toUpperCase()}))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="SBIN0001234"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                Branch Name
              </label>
              <input
                type="text"
                value={accountDetails.branchName}
                onChange={(e) => setAccountDetails(prev => ({...prev, branchName: e.target.value}))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter branch name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaCreditCard className="mr-2" />
                UPI ID (Optional)
              </label>
              <input
                type="text"
                value={accountDetails.upi}
                onChange={(e) => setAccountDetails(prev => ({...prev, upi: e.target.value.toLowerCase()}))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="username@upi"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
            <button
              onClick={() => {
                setShowAddAccountPopup(false);
                resetAccountForm();
              }}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={accountLoading}
            >
              Cancel
            </button>
            <button
              onClick={addBankAccount}
              disabled={accountLoading || !accountDetails.bankName || !accountDetails.accountNumber || !accountDetails.ifscCode || !accountDetails.accountHolderName}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {accountLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                <>
                  <FaCheckCircle className="mr-2" />
                  Add Account
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const WithdrawalPopup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <FaMoneyBillWave className="mr-2 text-blue-600" />
              Withdraw Funds
            </h3>
            <button 
              onClick={() => {
                setShowWithdrawalPopup(false);
                setWithdrawalAmount("");
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimesCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Available Balance:</span>
              <span className="text-xl font-bold text-blue-600 flex items-center">
                <FaRupeeSign className="mr-1" />
                {formatCurrency(walletData.walletBalance)}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount to Withdraw (₹)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaRupeeSign className="text-gray-500" />
              </div>
              <input
                type="text"
                inputMode="decimal"
                value={withdrawalAmount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  const decimalCount = (value.match(/\./g) || []).length;
                  if (decimalCount <= 1) {
                    setWithdrawalAmount(value);
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value && !isNaN(e.target.value)) {
                    const num = parseFloat(e.target.value);
                    setWithdrawalAmount(num.toFixed(2));
                  }
                }}
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Minimum withdrawal: ₹100 | Maximum: {formatCurrency(walletData.walletBalance)}
            </p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Select Account *
              </label>
              <button
                onClick={() => {
                  setShowWithdrawalPopup(false);
                  setShowAddAccountPopup(true);
                }}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <FaPlusCircle className="w-4 h-4 mr-1" />
                Add New Account
              </button>
            </div>

            {savedAccounts.length === 0 ? (
              <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500 mb-2">No bank accounts saved</p>
                <button
                  onClick={() => {
                    setShowWithdrawalPopup(false);
                    setShowAddAccountPopup(true);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center"
                >
                  <FaPlusCircle className="mr-1" />
                  Add your first account
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {savedAccounts.map((account) => (
                  <div key={account._id} className="flex items-start">
                    <input
                      type="radio"
                      id={`withdrawal-account-${account._id}`}
                      name="withdrawalAccount"
                      checked={selectedAccount === account._id}
                      onChange={() => setSelectedAccount(account._id)}
                      className="mt-1 mr-3"
                    />
                    <label htmlFor={`withdrawal-account-${account._id}`} className="flex-1 cursor-pointer">
                      <div className={`p-3 rounded-lg border ${selectedAccount === account._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <span className="font-medium truncate block">{account.bankName}</span>
                            <p className="text-sm text-gray-600 mt-1 truncate">
                              ****{account.accountNumber?.slice(-4)} • {account.accountHolderName}
                            </p>
                          </div>
                          {account.isDefault && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded flex items-center ml-2 flex-shrink-0">
                              <FaCheckCircle className="mr-1" />
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => {
                setShowWithdrawalPopup(false);
                setWithdrawalAmount("");
              }}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={withdrawalLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleWithdrawalSubmit}
              disabled={withdrawalLoading || !withdrawalAmount || parseFloat(withdrawalAmount) < 100 || parseFloat(withdrawalAmount) > walletData.walletBalance || !selectedAccount}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {withdrawalLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FaMoneyBillWave className="mr-2" />
                  Confirm Withdrawal
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
            <FaTrash className="mr-2 text-red-600" />
            Delete Account
          </h3>
          <p className="text-gray-600">Are you sure you want to delete this bank account? This action cannot be undone.</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => setShowDeleteConfirm(null)}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteBankAccount(showDeleteConfirm)}
            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
          >
            <FaTrash className="mr-2" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
      {showAddAccountPopup && <AddAccountPopup />}
      {showViewAccountPopup && <ViewAccountModal />}
      {showEditAccountPopup && <EditAccountModal />}
      {showWithdrawalPopup && <WithdrawalPopup />}
      {showDeleteConfirm && <DeleteConfirmationModal />}
      
      <div className="max-w-7xl mx-auto">
        {/* Mobile Header */}
        <div className="md:hidden mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <FaWallet className="mr-2 text-blue-600 text-2xl" />
              <h1 className="text-xl font-bold text-gray-800">
                Wallet
              </h1>
            </div>
          </div>
          
          {/* Mobile Balance Card */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white shadow-lg mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Available Balance</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(walletData.walletBalance)}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <FaWallet className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FaWallet className="mr-3 text-blue-600" />
            Vendor Wallet
          </h1>
          <p className="text-gray-600 mt-2 ml-10">Track your earnings and transactions</p>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaExclamationTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Desktop Stats Cards */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Balance</p>
                    <p className="text-3xl font-bold mt-2">{formatCurrency(walletData.walletBalance)}</p>
                    <p className="text-blue-100 text-sm mt-2">Available for withdrawal</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <FaWallet className="w-8 h-8" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Earnings</p>
                    <p className="text-2xl font-bold text-gray-800 mt-2">{formatCurrency(calculateTotal('credit'))}</p>
                    <p className="text-green-600 text-sm mt-2 flex items-center">
                      <FaArrowUp className="mr-1" />
                      All-time credits
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-full">
                    <FaMoneyBillWave className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Transactions</p>
                    <p className="text-2xl font-bold text-gray-800 mt-2">{walletData.walletTransactions.length}</p>
                    <p className="text-gray-600 text-sm mt-2">
                      {walletData.walletTransactions.filter(t => t.type === 'credit').length} credits • 
                      {walletData.walletTransactions.filter(t => t.type === 'debit').length} debits
                    </p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-full">
                    <FaListAlt className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Stats Cards */}
            <div className="md:hidden grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white rounded-xl p-4 shadow">
                <div className="flex items-center">
                  <div className="bg-green-50 p-2 rounded-lg mr-3">
                    <FaMoneyBillWave className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Earnings</p>
                    <p className="text-lg font-bold text-gray-800">{formatCurrency(calculateTotal('credit'))}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow">
                <div className="flex items-center">
                  <div className="bg-purple-50 p-2 rounded-lg mr-3">
                    <FaListAlt className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Transactions</p>
                    <p className="text-lg font-bold text-gray-800">{walletData.walletTransactions.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex mb-8 flex-wrap gap-4 justify-center">
              <button 
                onClick={() => setShowWithdrawalPopup(true)}
                disabled={walletData.walletBalance < 100}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaMoneyBillWave className="mr-2" />
                Withdraw Funds
              </button>
              <button 
                onClick={downloadStatement}
                disabled={walletData.walletTransactions.length === 0}
                className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors flex items-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaDownload className="mr-2" />
                Download Statement
              </button>
              <button 
                onClick={() => setShowAddAccountPopup(true)}
                className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center shadow-md"
              >
                <FaPlusCircle className="mr-2" />
                Add Bank Account
              </button>
            </div>

            {/* Mobile Action Buttons - NOT FIXED */}
            <div className="md:hidden mb-8 flex flex-col space-y-3">
              <button 
                onClick={() => setShowWithdrawalPopup(true)}
                disabled={walletData.walletBalance < 100}
                className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaMoneyBillWave className="mr-2" />
                Withdraw Funds
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={downloadStatement}
                  disabled={walletData.walletTransactions.length === 0}
                  className="px-4 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaDownload className="mr-2" />
                  Statement
                </button>
                <button 
                  onClick={() => setShowAddAccountPopup(true)}
                  className="px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center shadow-md"
                >
                  <FaPlusCircle className="mr-2" />
                  Add Account
                </button>
              </div>
            </div>

            {/* Bank Accounts Section */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden mb-8">
              <div className="px-4 md:px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div className="flex items-center mb-3 md:mb-0">
                    <div>
                      <h2 className="text-lg md:text-xl font-bold text-gray-800">
                        Bank Accounts
                      </h2>
                      <p className="text-gray-600 text-xs md:text-sm">Manage your saved bank accounts</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      {savedAccounts.length} account{savedAccounts.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                {savedAccounts.length === 0 ? (
                  <div className="text-center py-8 md:py-12">
                    <div className="mx-auto w-16 h-16 md:w-24 md:h-24 text-gray-300 mb-4">
                    </div>
                    <p className="text-gray-500 mb-4">No bank accounts saved</p>
                    <button
                      onClick={() => setShowAddAccountPopup(true)}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center"
                    >
                      <FaPlusCircle className="mr-1" />
                      Add your first bank account
                    </button>
                  </div>
                ) : (
                  <div className="md:hidden">
                    {/* Mobile Account Cards */}
                    {savedAccounts.map((account) => (
                      <div key={account._id} className="border-b border-gray-200 p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center">
                              <FaBuilding className="mr-2 text-gray-400" />
                              <span className="font-medium text-gray-900">{account.bankName}</span>
                            </div>
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <FaUser className="mr-1 text-gray-400" />
                              {account.accountHolderName}
                            </div>
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <FaIdCard className="mr-1 text-gray-400" />
                              ****{account.accountNumber?.slice(-4)}
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${account.isDefault ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {account.isDefault ? 'Default' : 'Additional'}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${account.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {account.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
                          <button
                            onClick={() => viewAccountDetails(account)}
                            className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => editAccount(account)}
                            className="text-yellow-600 hover:text-yellow-900 p-2 rounded-lg hover:bg-yellow-50"
                            title="Edit Account"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(account._id)}
                            className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50"
                            title="Delete Account"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Desktop Table View */}
                {savedAccounts.length > 0 && (
                  <div className="hidden md:block">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Details</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Info</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {savedAccounts.map((account) => (
                          <tr key={account._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div>
                                <div className="font-medium text-gray-900 flex items-center">
                                  <FaBuilding className="mr-2 text-gray-400" />
                                  {account.bankName}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center mt-1">
                                  <FaMapMarkerAlt className="mr-1 text-gray-400" />
                                  {account.branchName || 'Main Branch'}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <div className="font-medium text-gray-900 flex items-center">
                                  <FaUser className="mr-2 text-gray-400" />
                                  {account.accountHolderName}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center mt-1">
                                  <FaIdCard className="mr-1 text-gray-400" />
                                  {account.accountType} • ****{account.accountNumber?.slice(-4)}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col space-y-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full w-fit flex items-center ${account.isDefault ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                  {account.isDefault ? <FaCheckCircle className="mr-1" /> : null}
                                  {account.isDefault ? 'Default' : 'Additional'}
                                </span>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full w-fit flex items-center ${account.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                  {account.status === 'active' ? <FaCheckCircle className="mr-1" /> : null}
                                  {account.status}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => viewAccountDetails(account)}
                                  className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition-colors"
                                  title="View Details"
                                >
                                  <FaEye />
                                </button>
                                <button
                                  onClick={() => editAccount(account)}
                                  className="text-yellow-600 hover:text-yellow-900 p-2 rounded-full hover:bg-yellow-50 transition-colors"
                                  title="Edit Account"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => setShowDeleteConfirm(account._id)}
                                  className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors"
                                  title="Delete Account"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Withdrawal Requests Section */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden mb-8">
              <div className="px-4 md:px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <FaHistory className="mr-2 text-blue-600 text-lg" />
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-gray-800">
                      Withdrawal Requests
                    </h2>
                    <p className="text-gray-600 text-xs md:text-sm">Track your withdrawal requests and their status</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                {withdrawalRequests.length === 0 ? (
                  <div className="text-center py-8 md:py-12">
                    <div className="mx-auto w-16 h-16 md:w-24 md:h-24 text-gray-300 mb-4">
                      <FaMoneyBillWave className="w-full h-full" />
                    </div>
                    <p className="text-gray-500">No withdrawal requests yet</p>
                    <button 
                      onClick={() => setShowWithdrawalPopup(true)}
                      className="mt-4 text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center"
                    >
                      <FaMoneyBillWave className="mr-1" />
                      Make your first withdrawal
                    </button>
                  </div>
                ) : (
                  <div className="md:hidden">
                    {/* Mobile Withdrawal Cards */}
                    {withdrawalRequests.slice(0, 5).map((request) => (
                      <div key={request._id} className="border-b border-gray-200 p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-medium text-gray-900 flex items-center">
                              <FaMoneyBillWave className="mr-2 text-green-600" />
                              {formatCurrency(request.amount)}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getWithdrawalStatusStyle(request.status)}`}>
                            {request.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 flex items-center mt-2">
                          {request.bankAccount?.bankName || 'Bank'} • ****{request.bankAccount?.accountNumber?.slice(-4)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Desktop Table View */}
                {withdrawalRequests.length > 0 && (
                  <div className="hidden md:block">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Details</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {withdrawalRequests.map((request) => (
                          <tr key={request._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-mono text-gray-900">
                                {request.transactionId || request._id.slice(-8)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-semibold text-gray-900 flex items-center">
                                <FaRupeeSign className="mr-1" />
                                {formatCurrency(request.amount)}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 flex items-center">
                                {request.bankAccount?.bankName || 'Bank'}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center mt-1">
                                <FaIdCard className="mr-1 text-gray-400" />
                                ****{request.bankAccount?.accountNumber?.slice(-4) || '****'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {new Date(request.createdAt).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(request.createdAt).toLocaleTimeString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center w-fit ${getWithdrawalStatusStyle(request.status)}`}>
                                {request.status === 'completed' || request.status === 'approved' ? (
                                  <FaCheckCircle className="mr-1" />
                                ) : null}
                                {request.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Transaction History Section */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden mb-24 md:mb-8">
              <div className="px-4 md:px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex items-center mb-4 md:mb-0">
                    <FaHistory className="mr-2 text-blue-600 text-lg" />
                    <div>
                      <h2 className="text-lg md:text-xl font-bold text-gray-800">
                        Transaction History
                      </h2>
                      <p className="text-gray-600 text-xs md:text-sm">Track all your earnings and payments</p>
                    </div>
                  </div>
                  
                  <FilterButtons />
                </div>
              </div>

              <div className="overflow-x-auto">
                {currentTransactions.length === 0 ? (
                  <div className="text-center py-8 md:py-12">
                    <div className="mx-auto w-16 h-16 md:w-24 md:h-24 text-gray-300 mb-4">
                      <FaHistory className="w-full h-full" />
                    </div>
                    <p className="text-gray-500">No transactions found for the selected filter</p>
                  </div>
                ) : (
                  <div className="md:hidden">
                    {/* Mobile Transaction Cards */}
                    {currentTransactions.map((transaction) => (
                      <div key={transaction._id} className="border-b border-gray-200 p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-start">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${getTransactionTypeStyle(transaction.type)}`}>
                              {getTransactionIcon(transaction.type)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 capitalize">
                                {transaction.type} 
                                {transaction.type === 'credit' ? ' Received' : ' Processed'}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {transaction.description?.slice(0, 40) || (transaction.type === 'credit' ? 'Payment received' : 'Withdrawal')}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {new Date(transaction.createdAt).toLocaleDateString()} • 
                                {new Date(transaction.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>
                          <div className={`text-right ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                            <div className="font-semibold flex items-center">
                              {transaction.type === 'credit' ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                              {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </div>
                            <span className={`mt-1 px-2 py-1 rounded-full text-xs font-medium ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {transaction.status || 'completed'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Desktop Table View */}
                {currentTransactions.length > 0 && (
                  <div className="hidden md:block">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentTransactions.map((transaction) => (
                          <tr key={transaction._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getTransactionTypeStyle(transaction.type)}`}>
                                  {getTransactionIcon(transaction.type)}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 capitalize">
                                    {transaction.type} 
                                    {transaction.type === 'credit' ? ' Received' : ' Processed'}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {transaction.description || (transaction.type === 'credit' ? 'Payment received' : 'Withdrawal')}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-1 rounded">
                                {transaction.referenceId?.slice(-8) || transaction.orderId?.slice(-8) || 'N/A'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`text-sm font-semibold flex items-center ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                {transaction.type === 'credit' ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                                {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {new Date(transaction.createdAt).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(transaction.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center w-fit ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' : transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                {transaction.status === 'completed' ? <FaCheckCircle className="mr-1" /> : null}
                                {transaction.status || 'completed'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {currentTransactions.length > 0 && (
                <>
                  {/* Mobile Summary */}
                  <div className="md:hidden px-4 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </div>
                      <div className="text-sm font-semibold">
                        <span className={`flex items-center ${filter === 'debit' ? 'text-red-600' : 'text-green-600'}`}>
                          {filter === 'debit' ? <FaArrowDown className="mr-1" /> : <FaArrowUp className="mr-1" />}
                          {filter === 'all' ? formatCurrency(
                            currentTransactions.reduce((sum, t) => 
                              t.type === 'credit' ? sum + t.amount : sum - t.amount, 0
                            )
                          ) : filter === 'credit' ? 
                            formatCurrency(currentTransactions.reduce((sum, t) => sum + t.amount, 0)) : 
                            formatCurrency(-currentTransactions.reduce((sum, t) => sum + t.amount, 0))}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Summary */}
                  <div className="hidden md:block px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        Showing {indexOfFirstTransaction + 1}-{Math.min(indexOfLastTransaction, filteredTransactions.length)} of {filteredTransactions.length} transactions
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm font-semibold">
                          Filtered Total: 
                          <span className={`ml-2 flex items-center ${filter === 'debit' ? 'text-red-600' : 'text-green-600'}`}>
                            {filter === 'debit' ? <FaArrowDown className="mr-1" /> : <FaArrowUp className="mr-1" />}
                            {filter === 'all' ? formatCurrency(
                              filteredTransactions.reduce((sum, t) => 
                                t.type === 'credit' ? sum + t.amount : sum - t.amount, 0
                              )
                            ) : filter === 'credit' ? 
                              formatCurrency(calculateTotal('credit')) : 
                              formatCurrency(-calculateTotal('debit'))}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center mt-4">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-3 py-2 mx-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                          <FaChevronLeft className="mr-1" />
                          Previous
                        </button>
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-3 py-2 mx-1 text-sm font-medium rounded-lg ${
                                currentPage === pageNum
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-100'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 mx-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                          Next
                          <FaChevronRight className="ml-1" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Fixed Mobile Action Buttons at Bottom */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-lg z-30">
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => setShowWithdrawalPopup(true)}
                  disabled={walletData.walletBalance < 100}
                  className="px-3 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex flex-col items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                >
                  <FaMoneyBillWave className="mb-1" />
                  Withdraw
                </button>
                <button 
                  onClick={downloadStatement}
                  disabled={walletData.walletTransactions.length === 0}
                  className="px-3 py-2 bg-white text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                >
                  <FaDownload className="mb-1" />
                  Statement
                </button>
                <button 
                  onClick={() => setShowAddAccountPopup(true)}
                  className="px-3 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex flex-col items-center justify-center text-xs"
                >
                  <FaPlusCircle className="mb-1" />
                  Add Account
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}