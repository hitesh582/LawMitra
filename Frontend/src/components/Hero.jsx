import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative w-full">
      <div>
        {/* Background Image */}
        <img
          className="w-full h-[718px] object-cover mt-0.5 relative z-10"
          src={assets.Rectangle}
          alt="Background"
        />
      </div>

      {/* Overlay Image */}
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
          <Link to="/dashboard">
            <button className=" cursor-pointer hover:text-gray-300 transition-all duration-300 absolute top-[90%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[190px] h-[55px] object-contain z-20 bg-black text-white rounded-4xl">
              <p className="text-2xl mb-1">Start Now</p>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
