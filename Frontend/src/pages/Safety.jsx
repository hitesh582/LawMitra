import React from 'react';
import { assets } from "../assets/assets";

const Safety = () => {
  return (
    <>
      {/* Simple fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>

      <div className="flex flex-col items-center text-center p-8 bg-gray-100">
        <h1 className="text-8xl font-semibold mb-6 mt-4 fade-in">
          Safety at every step
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mb-6 fade-in">
          We believe in AI’s potential to make life better for everyone, which means making it safe for everyone.
        </p>
        
        <div className="grid grid-cols-3 gap-6 mt-8 mb-12 max-w-5xl">
          <div className="bg-white p-6 rounded-lg shadow-md text-center fade-in">
            <img src={assets.safetyimage1} alt="Teach" className="mx-auto mb-4" />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center fade-in">
            <img src={assets.safetyimage2} alt="Test" className="mx-auto mb-4" />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center fade-in">
            <img src={assets.safetyimage3} alt="Share" className="mx-auto mb-4" />
          </div>
        </div>
        
        <h2 className="text-4xl font-bold mt-8 mb-4 fade-in">
          Safety is Ongoing
        </h2>
        <p className="text-lg text-gray-700 max-w-3xl mt-2 mb-15 fade-in">
          Building safe AI is a continuous journey. Every update helps us enhance our safeguards and stay ahead of potential risks.
        </p>
      </div>
    </>
  );
};

export default Safety;
