import React from "react";
import { Link } from "react-router-dom";

const LawyerHome = () => {
  return (
    <div className="bg-white">
      <Link to="/dashboard">
        <button className=" cursor-pointer hover:text-gray-300 transition-all duration-300 absolute top-[90%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[190px] h-[55px] object-contain z-20 bg-black text-white rounded-4xl">
          <p className="text-2xl mb-1">Get Verified Today</p>
        </button>
      </Link>
    </div>
  );
};

export default LawyerHome;
