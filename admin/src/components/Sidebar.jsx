// Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import backgroundImage from "../assets/Rectangle.png";

const Sidebar = () => {
  return (
    <div
      className="h-screen w-[18%] border-r-2 relative overflow-y-auto mt-0.5"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Nav Links Container */}
      <div className="flex flex-col gap-4 pt-6 pl-4 pr-4 text-[15px] relative z-10">
        <NavLink
          className="flex items-center gap-3 border border-gray-300 px-3 py-2 rounded bg-[#d6d6d6]"
          to="/verifications"
        >
          <img className="w-5 h-5" src={assets.order_icon} alt="Order Icon" />
          <p>Lawyer Verifications</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 border border-gray-300 px-3 py-2 rounded bg-[#d6d6d6]"
          to="/approved-lawyers"
        >
          <img className="w-5 h-5" src={assets.order_icon} alt="Order Icon" />
          <p>Approved Lawyers</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
