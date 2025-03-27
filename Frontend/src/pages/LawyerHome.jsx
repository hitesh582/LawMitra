import React from "react";
import { Link } from "react-router-dom";

const LawyerHome = () => {
  return (
    <div className="bg-white">
      <Link to="/lawyerverification">
        <button className=" cursor-pointer bg-black text-white rounded-4xl mb-4 mt-4">
          <p className="text-2xl mb-1">Get Verified Today</p>
        </button>
      </Link>
    </div>
  );
};

export default LawyerHome;
