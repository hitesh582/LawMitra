import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { assets } from "../assets/assets";
import { UserDataContext } from "../context/UserContext";
import { LawyerDataContext } from "../context/LawyerContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);
  const { lawyer, setLawyer } = useContext(LawyerDataContext);

  const handleLogout = async () => {
    try {
      let token, logoutEndpoint, redirectPath;
      if (lawyer) {
        token = localStorage.getItem("lawyer-token");
        logoutEndpoint = `${import.meta.env.VITE_API_URL}/lawyers/logout`;
        redirectPath = "/lawyerlogin";
      } else if (user) {
        token = localStorage.getItem("token");
        logoutEndpoint = `${import.meta.env.VITE_API_URL}/users/logout`;
        redirectPath = "/userlogin";
      } else return;

      await axios.get(logoutEndpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (lawyer) {
        localStorage.removeItem("lawyer-token");
        setLawyer(null);
      } else {
        localStorage.removeItem("token");
        setUser(null);
      }
      navigate(redirectPath);
    } catch (err) {
      console.error("Logout error:", err.response || err);
    }
  };

  const dropdownOptions = lawyer
    ? [
        { name: "Verification", to: "/lawyerverification" },
        { name: "Documentation System", to: "/upload-document" },
      ]
    : user
    ? [
        { name: "Chatbot", to: "/dashboard" },
        { name: "Lawyer Recommendation", to: "/recommendations" },
      ]
    : [];

  return (
    <nav className="bg-black text-white p-4 flex items-center justify-between relative z-50 py-4 px-6">
      {/* Logo */}
      <Link to="/home">
        <img src={assets.logo} alt="Logo" className="w-36" />
      </Link>

      {/* Links */}
      <ul className="hidden sm:flex items-center space-x-10 absolute left-1/2 transform -translate-x-1/2">
        <li className="relative group">
          <button className="flex items-center space-x-1 hover:text-gray-300 transition">
            <span>Product</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className=" mt-1 h-4 w-4 transform group-hover:rotate-180 transition-transform"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {dropdownOptions.length > 0 && (
            <ul className="opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transform transition-all duration-200 origin-top-left absolute left-1.5 mt-2 w-64 bg-white rounded-lg shadow-xl text-black overflow-hidden">
              {dropdownOptions.map((opt, idx) => (
                <li
                  key={opt.to}
                  className={idx !== dropdownOptions.length - 1 ? "" : ""}
                >
                  <NavLink
                    to={opt.to}
                    className={({ isActive }) =>
                      `block w-full px-6 py-3 hover:bg-gray-100 transition ${
                        isActive ? "font-semibold text-blue-600" : ""
                      }`
                    }
                  >
                    {opt.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </li>
        <li>
          <NavLink
            to="/safety"
            className={({ isActive }) =>
              `hover:text-gray-300 transition ${
                isActive ? "text-gray-400 font-medium" : ""
              }`
            }
          >
            Safety
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/aboutus"
            className={({ isActive }) =>
              `hover:text-gray-300 transition ${
                isActive ? "text-gray-400 font-medium" : ""
              }`
            }
          >
            Company
          </NavLink>
        </li>
      </ul>

      {/* Right Icons */}
      <div className="flex items-center space-x-6">
        <div className="relative group">
          <button>
            <img
              src={assets.profile_icon}
              alt="Profile"
              className="w-8 hover:opacity-80 transition"
            />
          </button>
          <div
            className="opacity-0 group-hover:opacity-100 transform -translate-y-2
             group-hover:translate-y-0 transition-all duration-200
             absolute right-0 mt-3 w-44 bg-white rounded-lg shadow-lg text-gray-700"
          >
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-3 cursor-pointer
               hover:bg-gray-100 transition rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
