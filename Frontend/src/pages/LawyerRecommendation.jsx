import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const recommendationApiUrl = import.meta.env.VITE_RECOMMENDATION_API_URL;

const LawyerRecommendation = () => {
  const [filters, setFilters] = useState({
    specialization: "",
    minExperience: "",
    maxExperience: "",
    lawSchool: "",
    graduationYear: ""
  });
  const [recommendations, setRecommendations] = useState([]);

  const handleInputChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const fetchRecommendations = async () => {
    try {
      // Update the URL if your Flask service is deployed elsewhere
      const response = await axios.post(`${recommendationApiUrl}/recommend`, filters);
      if (response.data.success) {
        setRecommendations(response.data.recommendations);
      } else {
        toast.error("No recommendations found");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">Find Your Ideal Lawyer</h2>
      
      {/* Filter Section */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Filter Lawyers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Specialization</label>
            <input
              type="text"
              name="specialization"
              value={filters.specialization}
              onChange={handleInputChange}
              placeholder="e.g., Criminal Law"
              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Minimum Experience (years)</label>
            <input
              type="number"
              name="minExperience"
              value={filters.minExperience}
              onChange={handleInputChange}
              placeholder="e.g., 5"
              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Maximum Experience (years)</label>
            <input
              type="number"
              name="maxExperience"
              value={filters.maxExperience}
              onChange={handleInputChange}
              placeholder="e.g., 15"
              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Law School</label>
            <input
              type="text"
              name="lawSchool"
              value={filters.lawSchool}
              onChange={handleInputChange}
              placeholder="e.g., Harvard Law"
              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Graduation Year</label>
            <input
              type="number"
              name="graduationYear"
              value={filters.graduationYear}
              onChange={handleInputChange}
              placeholder="e.g., 2010"
              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={fetchRecommendations}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Get Recommendations
          </button>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="max-w-4xl mx-auto mt-10">
        <h3 className="text-2xl font-semibold mb-4">Recommended Lawyers</h3>
        {recommendations.length === 0 ? (
          <p className="text-center text-gray-600">No recommendations to display.</p>
        ) : (
          recommendations.slice(0, 3).map((lawyer) => (
            <div key={lawyer._id || lawyer.id} className="bg-white p-6 rounded shadow mb-4">
              <h4 className="text-xl font-bold">{lawyer.fullName}</h4>
              <p><strong>Specialization:</strong> {lawyer.specialization}</p>
              <p><strong>Experience:</strong> {lawyer.experience} years</p>
              {lawyer.lawSchool && <p><strong>Law School:</strong> {lawyer.lawSchool}</p>}
              {lawyer.graduationYear && <p><strong>Graduation Year:</strong> {lawyer.graduationYear}</p>}
              {lawyer.lawFirm && <p><strong>Law Firm:</strong> {lawyer.lawFirm}</p>}
              {lawyer.email && <p><strong>Email:</strong> {lawyer.email}</p>}
              {lawyer.phone && <p><strong>Phone:</strong> {lawyer.phone}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LawyerRecommendation;
