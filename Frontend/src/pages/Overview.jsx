import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Overview = () => {
  return (
    <>
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
        <section className="w-full max-w-6xl mb-20 fade-in">
          <h2 className="text-3xl font-bold mb-6 mt-4">
            Pioneering Legal AI Research for a Just Future
          </h2>
          <p className="text-lg text-black max-w-3xl mx-auto mb-8">
            We’re committed to developing innovative solutions that empower
            people with accessible legal insights and resources. Our mission is
            to advance AI technology that can understand, process, and simplify
            complex legal information to make law accessible for everyone.
          </p>

          <div className="flex justify-center gap-4">
            <Link to="/index">
              <button className="cursor-pointer hover:text-gray-300 transition-all duration-300 w-[190px] h-[55px] mb-8 bg-black text-white rounded-4xl">
                <p>Explore Research Index</p>
              </button>
            </Link>
            <Link to="/safety">
              <button className="cursor-pointer hover:text-gray-300 transition-all duration-300 w-[190px] h-[55px] mb-8 bg-black text-white rounded-4xl">
                <p>Learn about safety</p>
              </button>
            </Link>
          </div>

          <div className="space-y-8">
            <div className="h-100 w-300px rounded-4xl overflow-hidden shadow-lg transform transition duration-500 hover:scale-105">
              <img
                src={assets.overview1}
                alt="Team discussing in a modern office"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          <p className="text-lg text-black max-w-3xl mx-auto mb-18 mt-8">
            "Aligning AI systems with ethical standards is crucial to LawMitra’s
            mission. Using methods like human feedback and data-driven insights,
            we are advancing towards creating safe, transparent, and helpful
            legal AI systems."
          </p>

          <h2 className="text-3xl font-bold mb-6 mt-6 ">Focus areas</h2>
          <p className="text-lg text-black max-w-3xl mx-auto mb-1">
            We leverage cutting-edge machine learning techniques and extensive
            legal data to power our AI models, bringing new capabilities to the
            legal field.
          </p>
        </section>

        <section className="w-full max-w-6xl mb-20">
          <h2 className="text-3xl font-bold mb-6">Text</h2>
          <p className="text-lg text-black max-w-3xl mx-auto mb-8">
            Our AI models for text enable advanced legal language processing,
            including document analysis, case summaries, and legal
            classifications with exceptional coherence and accuracy.
          </p>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 rounded-xl overflow-hidden shadow-lg">
              <img
                src={assets.overview2}
                alt="LawMitra Assistant"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="flex-1 rounded-xl overflow-hidden shadow-lg">
              <img
                src={assets.overview3}
                alt="Legal Recommendation Engine"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        <section className="w-full max-w-6xl mb-20 fade-in">
          <h2 className="text-3xl font-bold mb-6">Image</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
            We are exploring applications of visual AI, such as analyzing legal
            documents or visual evidence, to make legal analysis more intuitive
            and data-driven.
          </p>
          <div className="mx-auto max-w-2xl rounded-xl overflow-hidden shadow-lg transform transition duration-500 hover:scale-105">
            <img
              src={assets.overview4}
              alt="Commitment to Ethical AI"
              className="w-full h-auto object-cover"
            />
          </div>
        </section>

        <section className="w-full max-w-6xl mb-20 fade-in">
          <h2 className="text-3xl font-bold mb-6">Past Highlights</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
            Our legal AI research builds on prior projects that continue to
            inspire and inform our work today.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/index">
              <button className="cursor-pointer hover:text-gray-300 transition-all duration-300 w-[190px] h-[55px] mb-8 bg-black text-white rounded-4xl">
                <p>Explore Research Index</p>
              </button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Overview;
