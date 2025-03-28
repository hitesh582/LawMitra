import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Chatbotfeatures = () => {
  return (
    <div className="bg-[#F4F4F4]">
      <div className="container mx-auto">
        {/* Feature 1 */}
        <div className="flex flex-col items-center justify-center px-6 py-12 bg-gray-100">
          <h2 className="text-2xl md:text-5xl font-semibold text-center text-gray-800 mb-6">
            Writes, brainstorms, edits, <br /> and explores ideas with you
          </h2>
          <div className="mt-8 w-full max-w-4xl p-4 bg-gray-200 rounded-xl shadow-lg">
            <img
              src={assets.chatbotfeature1image}
              alt="Chatbot Feature"
              className="w-full h-auto rounded-lg transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center justify-center px-6 py-12 bg-gray-100">
          <h2 className="text-2xl md:text-5xl font-semibold text-center text-gray-800 mb-6 mt-2">
            Explore legal topics, simplify complexities, <br /> and apply concepts with LawMitra.
          </h2>
          <div className="mt-8 w-full max-w-4xl p-4 bg-gray-200 rounded-xl shadow-lg">
            <img
              src={assets.chatbotfeature2image}
              alt="Chatbot Feature"
              className="w-full h-auto rounded-lg transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center justify-center px-6 py-12 bg-gray-100">
          <h2 className="text-2xl md:text-5xl font-semibold text-center text-gray-800 mb-6 mt-2">
            Connect with lawyers directly through <br />
            LawMitra’s platform for expert legal advice.
          </h2>
          <div className="mt-8 w-full max-w-4xl p-4 bg-gray-200 rounded-xl shadow-lg">
            <img
              src={assets.chatbotfeature3image}
              alt="Chatbot Feature"
              className="w-full h-auto rounded-lg transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>

        {/* Feature 4 */}
        <div className="flex flex-col items-center justify-center px-6 py-12 bg-gray-100">
          <h2 className="text-2xl md:text-5xl font-semibold text-center text-gray-800 mb-6 mt-2">
            Analyze cases, summarize info, and visualize <br />
            legal data with LawMitra.
          </h2>
          <div className="mt-8 w-full max-w-4xl p-4 bg-gray-200 rounded-xl shadow-lg">
            <img
              src={assets.chatbotfeature4image}
              alt="Chatbot Feature"
              className="w-full h-auto rounded-lg transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>

        {/* Get Started Section */}
        <div className="flex flex-col items-center justify-center px-6 py-12 bg-gray-100">
          <h2 className="text-2xl md:text-5xl font-semibold text-center text-gray-800 mb-6 mt-2">
            Get started with LawMitra today
          </h2>
          <div className="mt-8 mb-20 w-full max-w-4xl p-4 bg-gray-200 rounded-xl shadow-lg">
            <div className="w-full max-w-4xl p-6 bg-white rounded-xl flex flex-col items-center">
              <p className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-6">
                Join hundreds of millions of users and try <br /> LawMitra today.
              </p>
              <Link to="/chatbot">
                <button className="cursor-pointer mt-10 bg-black w-[190px] h-[55px] rounded-full flex items-center justify-center transition-all duration-300 text-white text-2xl hover:text-gray-300 active:text-gray-500 focus:outline-none">
                  <p className="mb-1">Try LawMitra</p>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbotfeatures;
