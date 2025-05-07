import React from "react";
import { assets } from "../assets/assets";

const AboutUs = () => {
  return (
    <>
      {/* Custom styles for fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in {
          animation: fadeIn 1s ease-out;
        }
      `}</style>
      
      <div className="flex flex-col items-center text-center p-6 bg-gray-100 min-h-screen">
        
        {/* About Section */}
        <section className="w-full max-w-6xl mb-20 fade-in">
          <h2 className="text-3xl font-bold mb-6 mt-4">About</h2>
          <p className="text-lg text-black max-w-3xl mx-auto mb-8">
            LawMitra is dedicated to revolutionizing legal assistance with AI-driven solutions.
            Our mission is to make legal guidance accessible, precise, and empathetic for everyone in need.
          </p>
          <div className="space-y-8">
            <div className="mx-auto max-w-4xl rounded-xl overflow-hidden shadow-lg transform transition duration-500 hover:scale-105">
              <img
                src={assets.aboutus1}
                alt="Team discussing in a modern office"
                className="w-300 h-200 object-cover"
              />
            </div>
            <div className="mx-auto max-w-4xl rounded-xl overflow-hidden shadow-lg transform transition duration-500 hover:scale-105">
              <img
                src={assets.aboutus2}
                alt="Team collaborating in a modern office"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        {/* Our Products Section (left unchanged as requested) */}
        <section className="w-full max-w-6xl mb-20">
          <h2 className="text-3xl font-bold mb-6">Our Products</h2>
          <p className="text-lg text-black max-w-3xl mx-auto mb-8">
            Our platform provides tools to help users gain insight into legal topics, find relevant resources,
            and connect with legal experts.
          </p>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 rounded-xl overflow-hidden shadow-lg">
              <img
                src={assets.aboutus3}
                alt="LawMitra Assistant"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="flex-1 rounded-xl overflow-hidden shadow-lg">
              <img
                src={assets.aboutus4}
                alt="Legal Recommendation Engine"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        {/* Our Structure and Commitment Section */}
        <section className="w-full max-w-6xl mb-20 fade-in">
          <h2 className="text-3xl font-bold mb-6">
            Our Structure and Commitment to Ethical AI
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
            As a mission-driven company, LawMitra is structured to prioritize ethical AI and ensure our solutions
            align with the highest standards of data privacy, transparency, and fairness.
          </p>
          <div className="mx-auto max-w-2xl rounded-xl overflow-hidden shadow-lg transform transition duration-500 hover:scale-105">
            <img
              src={assets.aboutus5}
              alt="Commitment to Ethical AI"
              className="w-full h-auto object-cover"
            />
          </div>
        </section>
        
      </div>
    </>
  );
};

export default AboutUs;
