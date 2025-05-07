import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import LawyerVerifications from "./pages/LawyerVerifications.jsx";
import LawyerDetails from "./pages/LawyerDetails.jsx";
import ApprovedLawyers from "./pages/ApprovedLawyers.jsx";
import { ToastContainer } from "react-toastify";
import AdminDashboard from "./components/AdminDashboard.jsx";

export const backendUrl = import.meta.env.VITE_API_URL;
export const currency = "$";

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="bg-grau-50 min-h-screen">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route
                  path="/verifications"
                  element={<LawyerVerifications token={token} />}
                />
                <Route
                  path="/verifications/:id"
                  element={<LawyerDetails token={token} />}
                />
                <Route
                  path="/approved-lawyers"
                  element={<ApprovedLawyers token={token} />}
                />
                <Route
                  path="/approved-lawyers/:id"
                  element={<LawyerDetails token={token} />}
                />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;

