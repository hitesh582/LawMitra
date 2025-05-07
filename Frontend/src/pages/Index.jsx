import React from "react";
import { assets } from "../assets/assets";

const Index = () => {
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

      <div className="flex flex-col items-center text-center p-8">
        <h3 className="text-lg text-gray-800 mt-4 mb-6 fade-in">News</h3>
        <h2 className="text-4xl font-bold mb-10 fade-in">Research</h2>

        <div className="grid grid-cols-2 gap-4 w-full max-w-4xl">
          <div className="relative fade-in">
            <a
              href="https://github.com/hitesh582/LawMitra"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={assets.indeximage1}
                alt="Chatbot Code"
                className="w-full h-full object-cover rounded-lg cursor-pointer"
              />
            </a>
          </div>
          <div className="relative fade-in">
            <a
              href="https://drive.google.com/drive/folders/1qTm6JwluT4exSS45drM0Tvfn1AtSOac6?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={assets.indeximage2}
                alt="Datasets"
                className="w-full h-full object-cover rounded-lg cursor-pointer"
              />
            </a>
          </div>
        </div>

        <div className="relative mt-4 w-full max-w-4xl mb-20 fade-in">
          <a
            href="https://github.com/hitesh582/LawMitra"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={assets.indeximage3}
              alt="Lawyer Connect Platform Code"
              className="w-full h-full object-cover rounded-lg cursor-pointer"
            />
          </a>
        </div>
      </div>
    </>
  );
};

export default Index;
