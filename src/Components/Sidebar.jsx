import React, { useState, useEffect } from "react";
import { FaChevronDown, FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const SidebarVendor = ({ isCollapsed, isMobile, setIsCollapsed }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const location = useLocation();

  // Handle mobile sidebar state
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isSidebarOpen && !event.target.closest('.sidebar-container') && !event.target.closest('.mobile-menu-btn')) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, isSidebarOpen]);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://31.97.206.144:7021/api/vendor/logout", {}, { withCredentials: true });
      localStorage.removeItem("authToken");
      localStorage.removeItem("vendorId");
      alert("Logout successful");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const elements = [
    {
      icon: <i className="ri-dashboard-fill text-white text-xl"></i>,
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <i className="ri-medicine-bottle-fill text-white text-xl"></i>,
      name: "Medicines",
      dropdown: [
        { name: "Add Medicine", path: "/add-medicine" },
        { name: "All Medicines", path: "/medicines" },
      ],
    },
    {
      icon: <i className="ri-file-list-3-fill text-white text-xl"></i>,
      name: "Orders",
      dropdown: [
        { name: "My Orders", path: "/orders" },
        { name: "Pending Orders", path: "/pendingorders" },
        { name: "Priodic Orders", path: "/priodicorders" },
        { name: "Prescription Orders", path: "/prescriptionorders" },
        { name: "User Prescription", path: "/prescription" },
      ],
    },
    {
      icon: <i className="ri-user-fill text-white text-xl"></i>,
      name: "My Profile",
      dropdown: [
        { name: "Profile", path: "/vendorprofile" },
      ],
    },
    {
  icon: <i className="ri-wallet-fill text-white text-xl"></i>, // wallet icon
  name: "My Wallet",
  dropdown: [
    { name: "Wallet", path: "/mywallet" },
  ],
},
    {
      icon: <i className="ri-user-fill text-white text-xl"></i>,
      name: "Query",
      dropdown: [
        { name: "Add Query", path: "/addquery" },
        { name: "My Queries", path: "/myqueries" },
      ],
    },
    {
      icon: <i className="ri-notification-2-fill text-white text-xl"></i>,
      name: "Notifications",
      dropdown: [
        { name: "View Notifications", path: "/notifications" },
      ],
    },
    {
      icon: <i className="ri-logout-box-fill text-white text-xl"></i>,
      name: "Logout",
      action: handleLogout,
    },
  ];

  // Mobile sidebar width - small screen ke liye compact
  const sidebarWidth = isMobile 
    ? (isSidebarOpen ? 'w-56' : 'w-0') 
    : (isCollapsed ? '20' : 'w-64');

  return (
    <>
      {/* Mobile Menu Button - Thoda upar left side */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="mobile-menu-btn fixed top-2 left-2 z-50 p-2 bg-blue-700 text-white rounded-lg shadow-lg md:hidden hover:bg-blue-600 transition-colors"
          aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
        >
          {isSidebarOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>
      )}

      {/* Sidebar Container - Thoda upar position */}
      <div
        className={`sidebar-container transition-all duration-300 ease-in-out
          ${sidebarWidth}
          ${isMobile ? 'fixed top-0 left-0 h-screen z-40 overflow-y-auto' : 'relative h-full'}
          flex flex-col bg-gradient-to-b from-blue-800 to-blue-900
          ${isMobile && isSidebarOpen ? 'shadow-2xl' : ''}
        `}
      >
        {/* Header - Thoda upar aur compact */}
        <div className="pt-3 pb-3 px-4 font-bold text-white flex items-center justify-between border-b border-blue-700/50">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
              <span className="text-blue-800 font-bold text-sm">V</span>
            </div>
            <span className={`${(isCollapsed && !isMobile) ? 'hidden' : 'block'} text-base whitespace-nowrap`}>
              Vendor Panel
            </span>
          </div>
          
          {/* Desktop Toggle Button */}
          {!isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-white hover:text-blue-200 p-1 transition-colors"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <FaChevronDown className={`transform transition-transform duration-300 ${isCollapsed ? 'rotate-90' : '-rotate-90'}`} />
            </button>
          )}
          
          {/* Mobile Close Button */}
          {isMobile && isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-white hover:text-blue-200 p-1 transition-colors"
              aria-label="Close sidebar"
            >
              <FaTimes size={14} />
            </button>
          )}
        </div>

        {/* Navigation Items - More compact */}
        <div className="flex-1 overflow-y-auto py-3 px-3">
          <nav className="space-y-1.5">
            {elements.map((item, idx) => (
              <div key={idx} className="mb-1.5">
                {item.dropdown ? (
                  <>
                    {/* Dropdown Trigger */}
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className={`w-full flex items-center p-3 text-white rounded-lg hover:bg-blue-700/50 transition-all duration-200
                        ${openDropdown === item.name ? 'bg-blue-700/50' : ''}
                        ${(isCollapsed && !isMobile) ? 'justify-center' : ''}
                      `}
                      aria-expanded={openDropdown === item.name}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span className={`ml-3 flex-1 text-left text-sm ${(isCollapsed && !isMobile) ? 'hidden' : 'block'} truncate no-underline`}>
                        {item.name}
                      </span>
                      {!isCollapsed && (
                        <FaChevronDown
                          className={`ml-2 transform transition-transform duration-200 text-sm no-underline
                            ${openDropdown === item.name ? 'rotate-180' : ''}
                          `}
                        />
                      )}
                    </button>

                    {/* Dropdown Content */}
                    {openDropdown === item.name && !(isCollapsed && !isMobile) && (
                      <div className="mt-1.5 ml-3 pl-3 border-l-2 border-blue-600/30">
                        {item.dropdown.map((subItem, subIdx) => (
                          <Link
                            key={subIdx}
                            to={subItem.path}
                            onClick={handleLinkClick}
                            className="block py-2 px-2.5 text-xs text-blue-100 hover:text-white hover:bg-blue-700/30 rounded-lg transition-colors duration-200 no-underline"
                          >
                            <div className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                              <span className="truncate no-underline">{subItem.name}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  /* Regular Link */
                  <Link
                    to={item.path || "#"}
                    onClick={(e) => {
                      if (item.action) {
                        e.preventDefault();
                        item.action();
                      }
                      handleLinkClick();
                    }}
                    className={`flex items-center p-3 text-white rounded-lg hover:bg-blue-700/50 transition-all duration-200 no-underline
                      ${(isCollapsed && !isMobile) ? 'justify-center' : ''}
                    `}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className={`ml-3 text-sm ${(isCollapsed && !isMobile) ? 'hidden' : 'block'} truncate no-underline`}>
                      {item.name}
                    </span>
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer/Version Info - More compact */}
        <div className="p-3 border-t border-blue-700/50">
          <div className={`text-center ${(isCollapsed && !isMobile) ? 'hidden' : 'block'}`}>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Custom CSS for scrollbar */}
      <style jsx>{`
        .sidebar-container::-webkit-scrollbar {
          width: 1px;
        }
        .sidebar-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .sidebar-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 10px;
        }
        .sidebar-container::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </>
  );
};

export default SidebarVendor;