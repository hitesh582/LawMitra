// adminDashboard.jsx
import React from "react";
import { assets } from "../assets/assets";

const AdminDashboard = () => {
  return (
    <div className="flex justify-center items-center">
      <img
        src={assets.LMadmin}
        alt="Admin Panel"
        className="h-150 mt-10"
      />
    </div>
  );
};

export default AdminDashboard;
