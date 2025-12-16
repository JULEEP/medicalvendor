import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

const SidebarVendor = ({ isCollapsed, isMobile }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleLogout = async () => {
  try {
    await axios.post("http://31.97.206.144:7021/api/vendor/logout", {}, { withCredentials: true });
    localStorage.removeItem("authToken");
    localStorage.removeItem("vendorId"); // Also clear vendor ID if stored
    alert("Logout successful");
    window.location.href = "/";
  } catch (error) {
    console.error("Logout error:", error);
    alert("Logout failed. Please try again.");
  }
};

  const elements = [
    {
      icon: <i className="ri-dashboard-fill text-white"></i>,
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <i className="ri-medicine-bottle-fill text-white"></i>,
      name: "Medicines",
      dropdown: [
        { name: "Add Medicine", path: "/add-medicine" },
        { name: "All Medicines", path: "/medicines" },
      ],
    },
    {
      icon: <i className="ri-file-list-3-fill text-white"></i>,
      name: "Orders",
      dropdown: [
        { name: "My Orders", path: "/orders" },
        { name: "Pending Orders", path: "/pendingorders" },
        // { name: "Delivered Orders", path: "/deliveredorders" },
       { name: "Priodic Orders", path: "/priodicorders" },
       { name: "Prescription Orders", path: "/prescriptionorders" },
        { name: "User Prescription", path: "/prescription" },
      ],
    },
   {
    icon: <i className="ri-user-fill text-white"></i>,
      name: "My Profile",
      dropdown: [
        { name: "Profile", path: "/vendorprofile" },
      ],
    },
    {
  icon: <i className="ri-user-fill text-white"></i>,
  name: "Query",
  dropdown: [
    { name: "Add Query", path: "/addquery" },
    { name: "My Queries", path: "/myqueries" },
  ],
},

{
  icon: <i className="ri-notification-2-fill text-white"></i>, // Change the icon for notifications
  name: "Notifications", // Name of the section
  dropdown: [
    { name: "View Notifications", path: "/notifications" },  // View notifications page
  ],
},
    {
      icon: <i className="ri-logout-box-fill text-white"></i>,
      name: "Logout",
      action: handleLogout,
    },
  ];

  return (
    <div
      className={`transition-all duration-300 ${
        isMobile ? (isCollapsed ? "w-0" : "w-64") : isCollapsed ? "w-16" : "w-64"
      } h-screen overflow-y-scroll no-scrollbar flex flex-col bg-blue-800`}
    >
      <div className="sticky top-0 p-4 font-bold text-white flex justify-center text-xl">
        <span>Vendor Panel</span>
      </div>
      <div className="border-b-4 border-gray-800 my-2"></div>

      <nav className={`flex flex-col ${isCollapsed && "items-center"} space-y-4 mt-4`}>
        {elements.map((item, idx) => (
          <div key={idx}>
            {item.dropdown ? (
              <>
                <div
                  className="flex items-center py-3 px-4 font-semibold text-sm text-white mx-4 rounded-lg hover:bg-gray-700 hover:text-[#00B074] duration-300 cursor-pointer"
                  onClick={() => toggleDropdown(item.name)}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className={`ml-4 ${isCollapsed && !isMobile ? "hidden" : "block"}`}>
                    {item.name}
                  </span>
                  <FaChevronDown
                    className={`ml-auto text-xs transform ${
                      openDropdown === item.name ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
                {openDropdown === item.name && (
                  <ul className="ml-10 text-sm text-white">
                    {item.dropdown.map((subItem, subIdx) => (
                      <li key={subIdx}>
                        <Link
                          to={subItem.path}
className="flex items-center space-x-2 py-2 font-medium cursor-pointer text-white hover:text-[#00B074] no-underline hover:no-underline visited:no-underline transition-colors duration-300"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <span className="text-[#00B074]">•</span>
                          <span>{subItem.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <Link
                to={item.path || "#"}
                className="flex items-center py-3 px-4 font-semibold text-sm text-white mx-4 rounded-lg hover:bg-gray-700 hover:text-[#00B074] duration-300 cursor-pointer"
                onClick={item.action || null}
              >
                <span className="text-xl">{item.icon}</span>
                <span className={`ml-4 ${isCollapsed && !isMobile ? "hidden" : "block"}`}>
                  {item.name}
                </span>
              </Link>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default SidebarVendor;
