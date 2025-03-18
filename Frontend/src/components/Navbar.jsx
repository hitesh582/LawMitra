// // import React from "react";
// // import { assets } from "../assets/assets";
// // import { Link, NavLink } from "react-router-dom";

// // const Navbar = () => {
// //   return (
// //     <div className="flex items-center justify-between py-4 px-6 bg-black text-white relative z-50">
// //       {/* Logo */}
// //       <Link to="/">
// //         <img src={assets.logo} className="w-36" alt="Logo" />
// //       </Link>

// //       {/* Centered Navigation Links */}
// //       <ul className="hidden sm:flex gap-12 text-md font-medium absolute left-1/2 transform -translate-x-1/2">
// //         <li>
// //           {/* <NavLink 
// //             to="/chatbot" 
// //             className="cursor-pointer hover:text-gray-300 transition-all duration-300"
// //             activeClassName="text-gray-400"
// //           > */}
// //           <NavLink
// //             to="/chatbot"
// //             className={({ isActive }) =>
// //               `cursor-pointer hover:text-gray-300 transition-all duration-300 ${
// //                 isActive ? "text-gray-400" : ""
// //               }`
// //             }
// //           >
// //             Product
// //           </NavLink>
// //         </li>
// //         <li>
// //           {/* <NavLink
// //             to="/safety"
// //             className="cursor-pointer hover:text-gray-300 transition-all duration-300"
// //             activeClassName="text-gray-400"
// //           > */}
// //           <NavLink
// //             to="/safety"
// //             className={({ isActive }) =>
// //               `cursor-pointer hover:text-gray-300 transition-all duration-300 ${
// //                 isActive ? "text-gray-400" : ""
// //               }`
// //             }
// //           >
// //             Safety
// //           </NavLink>
// //         </li>
// //         <li>
// //           {/* <NavLink
// //             to="/aboutus"
// //             className="cursor-pointer hover:text-gray-300 transition-all duration-300"
// //             activeClassName="text-gray-400"
// //           > */}
// //           <NavLink
// //             to="/aboutus"
// //             className={({ isActive }) =>
// //               `cursor-pointer hover:text-gray-300 transition-all duration-300 ${
// //                 isActive ? "text-gray-400" : ""
// //               }`
// //             }
// //           >
// //             Company
// //           </NavLink>
// //         </li>
// //       </ul>

// //       {/* Right Icons (Search & Profile) */}
// //       <div className="flex items-center gap-6">
// //         <img
// //           src={assets.search_icon}
// //           className="w-7 cursor-pointer hover:opacity-80 transition"
// //           alt="Search"
// //         />

// //         {/* Profile Dropdown */}
// //         <div className="group relative">
// //           <img
// //             className="w-8 cursor-pointer hover:opacity-80 transition"
// //             src={assets.profile_icon}
// //             alt="Profile"
// //           />

// //           {/* Dropdown Menu */}
// //           <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-7 z-50">
// //             <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow-lg">
// //               <p className="cursor-pointer hover:text-black">My Profile</p>
// //               <p className="cursor-pointer hover:text-black">Logout</p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Navbar;


// import React, { useContext } from "react";
// import { Link, NavLink, useNavigate } from "react-router-dom";
// import axios from "axios";

// import { assets } from "../assets/assets";
// import { UserDataContext } from "../context/UserContext";
// import { LawyerDataContext } from "../context/LawyerContext";

// const Navbar = () => {
//   const navigate = useNavigate();
  
//   // Access your user/lawyer contexts
//   const { user, setUser } = useContext(UserDataContext);
//   const { lawyer, setLawyer } = useContext(LawyerDataContext);

//   // A unified logout handler that checks which context is currently active
//   const handleLogout = async () => {
//     try {
//       // Retrieve whichever token you consistently store (here 'token')
//       const token = localStorage.getItem("token");
//       if (!token) {
//         // No token found, nothing to do
//         return;
//       }

//       // If you specifically track whether a "lawyer" or a "user" is logged in:
//       if (lawyer) {
//         // Call the lawyer logout route
//         await axios.get(`${import.meta.env.VITE_API_URL}/lawyers/logout`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           // If your backend also uses cookies for auth, you may need:
//           // withCredentials: true
//         });
//         // Clear local storage and context
//         localStorage.removeItem("lawyer-token");
//         setLawyer(null);
//         navigate("/lawyerlogin");
//       } else if (user) {
//         // Call the user logout route
//         await axios.get(`${import.meta.env.VITE_API_URL}/users/logout`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           // withCredentials: true
//         });
//         // Clear local storage and context
//         localStorage.removeItem("token");
//         setUser(null);
//         navigate("/userlogin");
//       }
//     } catch (error) {
//       console.error("Logout failed:", error);
//       // Optionally show some error message to the user
//     }
//   };

//   return (
//     <div className="flex items-center justify-between py-4 px-6 bg-black text-white relative z-50">
//       {/* Logo */}
//       <Link to="/">
//         <img src={assets.logo} className="w-36" alt="Logo" />
//       </Link>

//       {/* Centered Navigation Links */}
//       <ul className="hidden sm:flex gap-12 text-md font-medium absolute left-1/2 transform -translate-x-1/2">
//         <li>
//           <NavLink
//             to="/chatbot"
//             className="cursor-pointer hover:text-gray-300 transition-all duration-300"
//             // In React Router v6, you'd do:
//             // className={({ isActive }) => (isActive ? "text-gray-400" : "")}
//           >
//             Product
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             to="/safety"
//             className="cursor-pointer hover:text-gray-300 transition-all duration-300"
//           >
//             Safety
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             to="/aboutus"
//             className="cursor-pointer hover:text-gray-300 transition-all duration-300"
//           >
//             Company
//           </NavLink>
//         </li>
//       </ul>

//       {/* Right Icons (Search & Profile) */}
//       <div className="flex items-center gap-6">
//         <img
//           src={assets.search_icon}
//           className="w-7 cursor-pointer hover:opacity-80 transition"
//           alt="Search"
//         />

//         {/* Profile Dropdown */}
//         <div className="group relative">
//           <img
//             className="w-8 cursor-pointer hover:opacity-80 transition"
//             src={assets.profile_icon}
//             alt="Profile"
//           />

//           {/* Dropdown Menu */}
//           <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-7 z-50">
//             <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow-lg">
//               <Link to="/profile" className="cursor-pointer hover:text-black">
//                 My Profile
//               </Link>
//               <p
//                 className="cursor-pointer hover:text-black"
//                 onClick={handleLogout}
//               >
//                 Logout
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;


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
      // Determine which token and endpoint to use
      if (lawyer) {
        token = localStorage.getItem("lawyer-token");
        logoutEndpoint = `${import.meta.env.VITE_API_URL}/lawyers/logout`;
        redirectPath = "/lawyerlogin";
      } else if (user) {
        token = localStorage.getItem("token");
        logoutEndpoint = `${import.meta.env.VITE_API_URL}/users/logout`;
        redirectPath = "/userlogin";
      } else {
        // No valid user found, redirect to a default page
        return;
      }

      await axios.get(logoutEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Clear the appropriate token and context
      if (lawyer) {
        localStorage.removeItem("lawyer-token");
        setLawyer(null);
      } else if (user) {
        localStorage.removeItem("token");
        setUser(null);
      }
      
      navigate(redirectPath);
    } catch (error) {
      console.error("Logout error:", error.response || error);
      // Optionally, display an error message to the user
    }
  };

  return (
    <div className="flex items-center justify-between py-4 px-6 bg-black text-white relative z-50">
      {/* Logo */}
      <Link to="/">
        <img src={assets.logo} className="w-36" alt="Logo" />
      </Link>

      {/* Centered Navigation Links */}
      <ul className="hidden sm:flex gap-12 text-md font-medium absolute left-1/2 transform -translate-x-1/2">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `cursor-pointer hover:text-gray-300 transition-all duration-300 ${isActive ? "text-gray-400" : ""}`
            }
          >
            Product
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/safety"
            className={({ isActive }) =>
              `cursor-pointer hover:text-gray-300 transition-all duration-300 ${isActive ? "text-gray-400" : ""}`
            }
          >
            Safety
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/aboutus"
            className={({ isActive }) =>
              `cursor-pointer hover:text-gray-300 transition-all duration-300 ${isActive ? "text-gray-400" : ""}`
            }
          >
            Company
          </NavLink>
        </li>
      </ul>

      {/* Right Icons (Search & Profile Dropdown) */}
      <div className="flex items-center gap-6">
        <img
          src={assets.search_icon}
          className="w-7 cursor-pointer hover:opacity-80 transition"
          alt="Search"
        />

        <div className="group relative">
          <img
            className="w-8 cursor-pointer hover:opacity-80 transition"
            src={assets.profile_icon}
            alt="Profile"
          />
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-7 z-50">
            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow-lg">
              <Link to="/profile" className="cursor-pointer hover:text-black">
                My Profile
              </Link>
              <p className="cursor-pointer hover:text-black" onClick={handleLogout}>
                Logout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
