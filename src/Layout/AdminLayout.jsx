import { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";

export default function AdminLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // Auto-collapse on mobile for better UX
      if (mobile) setIsCollapsed(true);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#EFF0F1]">
      {/* SIDEBAR WRAPPER
         1. We keep it in the DOM but transition its width/transform.
         2. On mobile, we use 'fixed' to overlay it.
      */}
      <div
        className={`transition-all duration-300 ease-in-out z-50 ${
          isMobile
            ? `fixed inset-y-0 left-0 transform ${isCollapsed ? "-translate-x-full" : "translate-x-0"}`
            : `${isCollapsed ? "w-20" : "w-64"}`
        }`}
      >
        <Sidebar
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          setIsCollapsed={setIsCollapsed}
        />
      </div>

      {/* MAIN CONTENT AREA 
         1. flex-1: Takes up all remaining space.
         2. min-w-0: CRITICAL fix for flexbox overflow.
      */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <Navbar 
          setIsCollapsed={setIsCollapsed} 
          isCollapsed={isCollapsed} 
          isMobile={isMobile} 
        />

        <main className="p-4 overflow-y-auto no-scrollbar flex-1">
          {children}
        </main>

        {/* Mobile Overlay: Closes sidebar when clicking outside */}
        {!isCollapsed && isMobile && (
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={() => setIsCollapsed(true)}
          />
        )}
      </div>
    </div>
  );
}