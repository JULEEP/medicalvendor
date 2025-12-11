import { useState } from "react";
import { RiMenu2Line, RiMenu3Line, RiFullscreenLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { MdCleaningServices } from "react-icons/md";

const CompanyNavbar = ({ setIsCollapsed, isCollapsed }) => {
  const navigate = useNavigate();

  const handleDoctorList = () => {
    navigate("/company-doctor-list");
  };

  const handleAppointments = () => {
    navigate("/company-appointments");
  };

  return (
    <nav className="bg-white text-black sticky top-0 w-full p-4 flex items-center shadow-lg z-50">
      <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-xl p-2">
        {isCollapsed ? (
          <RiMenu2Line className="text-2xl text-gray-500" />
        ) : (
          <RiMenu3Line className="text-2xl text-gray-500" />
        )}
      </button>

      <div className="flex justify-between items-center w-full">
        <div className="flex gap-3 ml-4">
          <button className="font-semibold flex gap-2 bg-[#F8FAF8] items-center justify-center p-3 rounded-md text-[#188753] hover:bg-[#D9F3EA] duration-300">
            <MdCleaningServices /> Clear Cache
          </button>
        </div>

        <div className="flex gap-3 items-center">
          <button className="px-2 py-1 rounded-full bg-[#F8FAF8] cursor-pointer hover:bg-[#D9F3EA] hover:text-[#00B074] duration-300">
            <RiFullscreenLine />
          </button>

          <div className="flex flex-col justify-center items-center">
            <img
              className="rounded-full w-[2vw] min-w-[35px] max-w-[45px]"
              src="/CompanyLogo.png"
              alt="Company Logo"
            />
            <h1 className="text-xs font-medium">Company</h1>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CompanyNavbar;
