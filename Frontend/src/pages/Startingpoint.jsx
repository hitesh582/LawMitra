import React from 'react';
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Startingpoint = () => {
  return (
    // Set the container to full viewport height and hide overflow to disable scrolling.
    <div className="relative w-full h-screen overflow-hidden">
      <div>
        {/* Background Image covering the full page */}
        <img
          className="w-full h-screen object-cover relative z-10"
          src={assets.Rectangle}
          alt="Background"
        />
      </div>

      {/* Overlay Images and Button */}
      <div>
        <div>
          <img
            className="absolute top-[33%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] object-contain z-20"
            src={assets.LM}
            alt="Overlay"
          />
        </div>
        <div>
          <img
            className="absolute top-[75%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] object-contain z-20"
            src={assets.text_back}
            alt="Overlay"
          />
        </div>
        <div>
          <Link to="/userlogin">
            <button className="cursor-pointer hover:text-gray-300 transition-all duration-300 absolute top-[90%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[210px] h-[55px] object-contain z-20 bg-black text-white rounded-4xl">
              <p className="text-2xl mb-1">Let's Get Started</p>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Startingpoint;
