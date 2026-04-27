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

  const [vendor, setVendor] = useState(null);
  const [status, setStatus] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
  const [lastNotificationCount, setLastNotificationCount] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const vendorId = localStorage.getItem("vendorId");

        const vendorRes = await axios.get(
          `https://api.simcurarx.com/api/vendor/getvendorprofile/${vendorId}`
        );
        setVendor(vendorRes.data.vendor);
        setStatus(vendorRes.data.vendor.status);

        const prescriptionsRes = await axios.get(
          `https://api.simcurarx.com/api/vendor/getprescriptions/${vendorId}`
        );
        setPrescriptions(prescriptionsRes.data.prescriptions);

        const notificationsRes = await axios.get(
          `https://api.simcurarx.com/api/vendor/notifications/${vendorId}`
        );
        setNotifications(notificationsRes.data.notifications || []);
        setNotificationCount(notificationsRes.data.notifications.length);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchVendorData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const fetchNotifications = async () => {
        try {
          const vendorId = localStorage.getItem("vendorId");
          const notificationsRes = await axios.get(
            `https://api.simcurarx.com/api/vendor/notifications/${vendorId}`
          );

          const newNotificationCount = notificationsRes.data.notifications.length;
          setNotificationCount(newNotificationCount);

          if (newNotificationCount > lastNotificationCount) {
            playBeepSound();
            setLastNotificationCount(newNotificationCount);
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };

      fetchNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, [lastNotificationCount]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullScreen(true);
      }).catch(err => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullScreen(false);
        }).catch(err => {
          console.error("Error attempting to exit fullscreen:", err);
        });
      }
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  const playBeepSound = () => {
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
      const audio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==");
      audio.play().catch(e => console.log("Audio play failed:", e));
    }
  };

  const toggleStatus = async () => {
    try {
      const vendorId = localStorage.getItem("vendorId");
      const newStatus = status === "Active" ? "Inactive" : "Active";
      setStatus(newStatus);

      const res = await axios.put(
        `https://api.simcurarx.com/api/vendor/updatestatus/${vendorId}`,
        { status: newStatus }
      );
      console.log(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
      setStatus(status === "Active" ? "Inactive" : "Active");
    }
  };

  const handlePrescriptionsClick = () => {
    navigate("/prescription");
  };

  const handleNotificationsClick = () => {
    navigate("/notifications");
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = () => {
    localStorage.removeItem("vendorId");
    localStorage.removeItem("vendorToken");
    navigate("/login");
  };

  const handleProfileNavigation = () => {
    navigate("/vendorprofile");
    setShowProfileMenu(false);
  };

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
    <>
      <nav className="bg-gradient-to-r from-blue-800 to-blue-600 text-white sticky top-0 w-full h-16 md:h-20 px-3 md:px-6 flex items-center shadow-lg z-40 border-b border-blue-700">
        {/* Left Section */}
        <div className="flex items-center gap-3 md:gap-4 lg:gap-6 flex-1">
          {/* Menu Toggle Button */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className="p-2 md:p-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            title={isCollapsed ? "Expand Menu" : "Collapse Menu"}
          >
            {isCollapsed ? (
              <RiMenu2Line className="text-xl md:text-2xl text-white" />
            ) : (
              <RiMenu3Line className="text-xl md:text-2xl text-white" />
            )}
          </button>

          {/* Business Name/Brand - Mobile View */}
          <div className="flex items-center">
            <span className="text-white text-sm md:text-base font-bold truncate max-w-[100px] md:max-w-[150px]">
              {vendor?.businessName || "CLYNIX"}
            </span>
          </div>

          {/* All Actions - Shows on all screens */}
          {vendor && (
            <div className="flex items-center gap-2 md:gap-4 lg:gap-6 ml-2 md:ml-4">
              {/* Status Toggle - All screens */}
              <div className="flex items-center gap-1 md:gap-2 bg-blue-700/50 px-2 py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-2.5 rounded-lg">
                <span className="text-white text-xs md:text-sm lg:text-base font-medium">Status:</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs md:text-sm lg:text-base font-semibold ${status === "Active" ? "text-green-300" : "text-red-300"}`}>
                    {status}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={status === "Active"}
                      onChange={toggleStatus}
                      className="sr-only peer"
                    />
                    <div className={`w-8 h-4 md:w-10 md:h-5 lg:w-12 lg:h-6 rounded-full transition-colors duration-300 ${
                      status === "Active" ? "bg-green-500" : "bg-gray-400"
                    }`}></div>
                    <div className={`absolute left-0.5 top-0.5 md:left-0.5 md:top-0.5 lg:left-1 lg:top-1 w-3 h-3 md:w-4 md:h-4 lg:w-4 lg:h-4 rounded-full transition-transform duration-300 transform ${
                      status === "Active" ? "translate-x-4 md:translate-x-5 lg:translate-x-6 bg-white" : "translate-x-0 bg-gray-200"
                    }`}></div>
                  </label>
                </div>
              </div>

              {/* Prescriptions Button - All screens */}
              <button
                onClick={handlePrescriptionsClick}
                className="flex items-center gap-1 md:gap-2 bg-white/10 hover:bg-white/20 px-2 py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-2.5 rounded-lg transition-all duration-200 group relative"
                title="View Prescriptions"
              >
                <MdMedicalServices className="text-white text-base md:text-lg lg:text-xl" />
                <span className="text-white text-xs md:text-sm lg:text-base font-medium hidden sm:block">
                  Prescriptions
                </span>
                {prescriptions.length > 0 && (
                  <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-red-500 text-white text-[10px] md:text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center animate-pulse">
                    {prescriptions.length}
                  </div>
                )}
              </button>

              {/* Notifications Button - All screens */}
              <button
                onClick={handleNotificationsClick}
                className="flex items-center gap-1 md:gap-2 bg-white/10 hover:bg-white/20 px-2 py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-2.5 rounded-lg transition-all duration-200 group relative"
                title="View Notifications"
              >
                <HiOutlineBell className="text-white text-base md:text-lg lg:text-xl" />
                <span className="text-white text-xs md:text-sm lg:text-base font-medium hidden sm:block">
                  Notifications
                </span>
                {notificationCount > 0 && (
                  <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-red-500 text-white text-[10px] md:text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center animate-pulse">
                    {notificationCount}
                  </div>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-4 lg:gap-6">
          {/* Full Screen Toggle Button */}
          <button
            onClick={toggleFullScreen}
            className="p-2 md:p-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 group"
            title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
          >
            {isFullScreen ? (
              <MdFullscreenExit className="text-lg md:text-xl lg:text-2xl text-white" />
            ) : (
              <MdFullscreen className="text-lg md:text-xl lg:text-2xl text-white" />
            )}
          </button>

          {/* Profile Section */}
          <div className="relative profile-menu">
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-2 md:gap-3 lg:gap-4 bg-white/10 hover:bg-white/20 px-2 py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-2.5 rounded-lg transition-all duration-200"
            >
              <div className="hidden md:flex flex-col items-end">
                <span className="text-white text-sm md:text-base font-medium truncate max-w-[120px] lg:max-w-[180px]">
                  {vendor?.businessName || "CLYNIX"}
                </span>
                <span className="text-blue-200 text-xs md:text-sm">
                  {status === "Active" ? "🟢 Online" : "🔴 Offline"}
                </span>
              </div>
              <div className="relative">
                {vendor?.profileImage ? (
                  <img
                    className="rounded-full w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 object-cover border-2 border-white/30"
                    src={vendor.profileImage}
                    alt="Vendor Profile"
                  />
                ) : (
                  <img
                    className="rounded-full w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 object-cover border-2 border-white/30"
                    src="/logo.png"
                    alt="CLYNIX Logo"
                  />
                )}
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 md:w-56 bg-white rounded-lg shadow-xl py-2 md:py-3 z-50 border border-gray-200">
                <button
                  onClick={handleProfileNavigation}
                  className="w-full text-left px-3 md:px-4 py-2 md:py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 md:gap-3 transition-colors"
                >
                  <MdAccountCircle className="text-gray-500 text-base md:text-lg" />
                  <span className="font-medium">My Profile</span>
                </button>
                <button
                  onClick={toggleFullScreen}
                  className="w-full text-left px-3 md:px-4 py-2 md:py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 md:gap-3 transition-colors"
                >
                  {isFullScreen ? (
                    <MdFullscreenExit className="text-gray-500 text-base md:text-lg" />
                  ) : (
                    <MdFullscreen className="text-gray-500 text-base md:text-lg" />
                  )}
                  <span className="font-medium">{isFullScreen ? "Exit Full Screen" : "Full Screen"}</span>
                </button>
                <div className="border-t my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 md:px-4 py-2 md:py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 md:gap-3 transition-colors"
                >
                  <i className="ri-logout-box-fill text-base md:text-lg"></i>
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Error Message */}
      {error && (
        <div className="fixed top-16 md:top-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 md:py-3 rounded-lg shadow-lg z-50 animate-bounce w-[90%] max-w-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs md:text-sm">{error}</span>
            </div>
            <button 
              onClick={() => setError("")}
              className="hover:text-gray-200 ml-2"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;