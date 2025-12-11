import { useState, useEffect } from "react";
import { RiMenu2Line, RiMenu3Line } from "react-icons/ri";
import { 
  MdMedicalServices, 
  MdFullscreen, 
  MdFullscreenExit,
  MdAccountCircle 
} from 'react-icons/md';
import { HiOutlineBell } from 'react-icons/hi';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = ({ setIsCollapsed, isCollapsed }) => {
  const navigate = useNavigate();

  // State to store vendor profile, status, prescriptions, notifications, and error
  const [vendor, setVendor] = useState(null);
  const [status, setStatus] = useState(""); // Vendor status (Active/Inactive)
  const [prescriptions, setPrescriptions] = useState([]); // Store prescriptions
  const [notifications, setNotifications] = useState([]); // Store notifications
  const [error, setError] = useState(""); // For error handling
  const [notificationCount, setNotificationCount] = useState(0); // Notification count
  const [lastNotificationCount, setLastNotificationCount] = useState(0); // Last notification count to track changes
  const [isFullScreen, setIsFullScreen] = useState(false); // Full screen state
  const [showProfileMenu, setShowProfileMenu] = useState(false); // Profile menu state

  // Fetch vendor profile and prescriptions from API on component mount
  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const vendorId = localStorage.getItem("vendorId");

        // Fetch vendor profile
        const vendorRes = await axios.get(
          `http://31.97.206.144:7021/api/vendor/getvendorprofile/${vendorId}`
        );
        setVendor(vendorRes.data.vendor);
        setStatus(vendorRes.data.vendor.status); // Set the initial vendor status

        // Fetch prescriptions
        const prescriptionsRes = await axios.get(
          `http://31.97.206.144:7021/api/vendor/getprescriptions/${vendorId}`
        );
        setPrescriptions(prescriptionsRes.data.prescriptions);

        // Fetch notifications
        const notificationsRes = await axios.get(
          `http://31.97.206.144:7021/api/vendor/notifications/${vendorId}`
        );
        setNotifications(notificationsRes.data.notifications);
        setNotificationCount(notificationsRes.data.notifications.length); // Set initial notification count

      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch vendor data");
      }
    };

    fetchVendorData();
  }, []);

  // Polling mechanism to check for notification count change
  useEffect(() => {
    const interval = setInterval(() => {
      const fetchNotifications = async () => {
        try {
          const vendorId = localStorage.getItem("vendorId");
          const notificationsRes = await axios.get(
            `http://31.97.206.144:7021/api/vendor/notifications/${vendorId}`
          );

          const newNotificationCount = notificationsRes.data.notifications.length;
          setNotificationCount(newNotificationCount);

          // Check if the notification count increased
          if (newNotificationCount > lastNotificationCount) {
            playBeepSound(); // Play sound if the count increased
            setLastNotificationCount(newNotificationCount); // Update last notification count
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };

      fetchNotifications();
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [lastNotificationCount]);

  // Full screen functionality
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      // Enter full screen
      document.documentElement.requestFullscreen().then(() => {
        setIsFullScreen(true);
      }).catch(err => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      // Exit full screen
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullScreen(false);
        }).catch(err => {
          console.error("Error attempting to exit fullscreen:", err);
        });
      }
    }
  };

  // Listen for full screen change events
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  // Function to play a beep sound
  const playBeepSound = () => {
    // Create a more reliable beep sound using HTML5 Audio
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error("Audio context not supported:", error);
      // Fallback: Use HTML5 audio element
      const audio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==");
      audio.play().catch(e => console.log("Audio play failed:", e));
    }
  };

  // Function to handle status toggle
  const toggleStatus = async () => {
    try {
      const vendorId = localStorage.getItem("vendorId");
      const newStatus = status === "Active" ? "Inactive" : "Active";
      setStatus(newStatus);

      const res = await axios.put(
        `http://31.97.206.144:7021/api/vendor/updatestatus/${vendorId}`,
        { status: newStatus }
      );
      console.log(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
      setStatus(status === "Active" ? "Inactive" : "Active");
    }
  };

  // Function to handle Prescriptions click
  const handlePrescriptionsClick = () => {
    navigate("/prescription");
  };

  // Function to handle Notifications click
  const handleNotificationsClick = () => {
    navigate("/notifications");
  };

  // Function to handle profile click
  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("vendorId");
    localStorage.removeItem("vendorToken");
    navigate("/login");
  };

  // Function to handle profile navigation
  const handleProfileNavigation = () => {
    navigate("/vendor-profile");
    setShowProfileMenu(false);
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-menu')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-blue-600 text-white sticky top-0 w-full h-20 px-6 flex items-center shadow-lg z-50 border-b border-blue-700">
      {/* Left Section - Menu, Status, Prescriptions, Notifications */}
      <div className="flex items-center gap-6 flex-1">
        {/* Menu Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="p-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          title={isCollapsed ? "Expand Menu" : "Collapse Menu"}
        >
          {isCollapsed ? (
            <RiMenu2Line className="text-2xl text-white" />
          ) : (
            <RiMenu3Line className="text-2xl text-white" />
          )}
        </button>

        {/* Vendor Status and Quick Actions */}
        {vendor && (
          <div className="flex items-center gap-8">
            {/* Status Toggle */}
            <div className="flex items-center gap-3 bg-blue-700/50 px-4 py-2 rounded-lg">
              <span className="text-white text-sm font-medium">Status:</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${status === "Active" ? "text-green-300" : "text-red-300"}`}>
                  {status}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={status === "Active"}
                    onChange={toggleStatus}
                    className="sr-only peer"
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                    status === "Active" ? "bg-green-500" : "bg-gray-400"
                  }`}></div>
                  <div className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-300 transform ${
                    status === "Active" ? "translate-x-6 bg-white" : "translate-x-0 bg-gray-200"
                  }`}></div>
                </label>
              </div>
            </div>

            {/* Prescriptions Button */}
            <button
              onClick={handlePrescriptionsClick}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200 group"
              title="View Prescriptions"
            >
              <MdMedicalServices className="text-white text-xl group-hover:scale-110 transition-transform" />
              <span className="text-white text-sm font-medium">Prescriptions</span>
              {prescriptions.length > 0 && (
                <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-1 animate-pulse">
                  {prescriptions.length}
                </div>
              )}
            </button>

            {/* Notifications Button */}
            <button
              onClick={handleNotificationsClick}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200 group relative"
              title="View Notifications"
            >
              <HiOutlineBell className="text-white text-xl group-hover:scale-110 transition-transform" />
              <span className="text-white text-sm font-medium">Notifications</span>
              {notificationCount > 0 && (
                <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-1 animate-pulse">
                  {notificationCount}
                </div>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Right Section - Full Screen, Profile, etc. */}
      <div className="flex items-center gap-4">
        {/* Full Screen Toggle Button */}
        <button
          onClick={toggleFullScreen}
          className="p-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 group"
          title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
        >
          {isFullScreen ? (
            <MdFullscreenExit className="text-xl text-white group-hover:scale-110 transition-transform" />
          ) : (
            <MdFullscreen className="text-xl text-white group-hover:scale-110 transition-transform" />
          )}
        </button>

        {/* Profile Section */}
        <div className="relative profile-menu">
          <button
            onClick={handleProfileClick}
            className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200 group"
          >
            <div className="flex flex-col items-end">
              <span className="text-white text-sm font-medium">
                {vendor?.businessName || "CLYNIX"}
              </span>
              <span className="text-blue-200 text-xs">
                {status === "Active" ? "🟢 Online" : "🔴 Offline"}
              </span>
            </div>
            <div className="relative">
              {vendor?.profileImage ? (
                <img
                  className="rounded-full w-10 h-10 object-cover border-2 border-white/30 group-hover:border-white/50 transition-colors"
                  src={vendor.profileImage}
                  alt="Vendor Profile"
                />
              ) : (
                <img
                  className="rounded-full w-10 h-10 object-cover border-2 border-white/30 group-hover:border-white/50 transition-colors"
                  src="/logo.png"
                  alt="CLYNIX Logo"
                />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
            <button 
              onClick={() => setError("")}
              className="ml-4 hover:text-gray-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;