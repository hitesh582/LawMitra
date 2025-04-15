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
  const [errors, setErrors] = useState({});

  const currentYear = new Date().getFullYear();

  // This function performs per-field instant validation.
  // It uses the current filters (allFilters) because sometimes the validation
  // depends on other field values.
  const validateField = (name, value, allFilters) => {
    let error = "";

    if (name === "specialization") {
      if (!value) {
        error = "Please select a specialization.";
      }
    }

    if (name === "minExperience") {
      if (value !== "") {
        const minExp = Number(value);
        if (isNaN(minExp) || minExp < 0) {
          error = "Minimum experience must be a non-negative number.";
        }
        // If graduationYear is set, validate that graduationYear is consistent.
        if (allFilters.graduationYear !== "") {
          const gradYear = Number(allFilters.graduationYear);
          const allowedGradYear = currentYear - minExp;
          if (gradYear > allowedGradYear) {
            error = `For at least ${minExp} years of experience, graduation year must be ${allowedGradYear} or earlier.`;
          }
        }
      }
    }

    if (name === "maxExperience") {
      if (value !== "") {
        const maxExp = Number(value);
        if (isNaN(maxExp) || maxExp < 0) {
          error = "Maximum experience must be a non-negative number.";
        }
        // Check that maxExperience is not less than minExperience.
        if (allFilters.minExperience !== "" && Number(allFilters.minExperience) > maxExp) {
          error = "Maximum experience should be greater than or equal to minimum experience.";
        }
      }
    }

    if (name === "graduationYear") {
      if (value !== "") {
        const gradYear = Number(value);
        if (isNaN(gradYear) || gradYear < 1900 || gradYear > currentYear) {
          error = `Graduation year must be between 1900 and ${currentYear}.`;
        }
        // Check consistency with minExperience if provided.
        if (allFilters.minExperience !== "") {
          const minExp = Number(allFilters.minExperience);
          const allowedGradYear = currentYear - minExp;
          if (gradYear > allowedGradYear) {
            error = `For at least ${minExp} years of experience, graduation year must be ${allowedGradYear} or earlier.`;
          }
        }
      }
    }

    // Additional validations for lawSchool can be added if needed.
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Update filters immediately.
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);

    // Validate the field with updatedFilters so that any dependent field (e.g., graduationYear vs. minExperience) is checked.
    const fieldError = validateField(name, value, updatedFilters);
    // Update errors state; maintain other errors if any.
    setErrors((prevErrors) => ({ ...prevErrors, [name]: fieldError }));

    // Also, if the changed field is one that affects other validations,
    // re-run validation on the related field.
    if (name === "minExperience" && updatedFilters.graduationYear !== "") {
      const gradError = validateField("graduationYear", updatedFilters.graduationYear, updatedFilters);
      setErrors((prevErrors) => ({ ...prevErrors, graduationYear: gradError }));
    }
    if (name === "graduationYear" && updatedFilters.minExperience !== "") {
      const gradError = validateField("graduationYear", value, updatedFilters);
      setErrors((prevErrors) => ({ ...prevErrors, graduationYear: gradError }));
    }
    if (name === "maxExperience" && updatedFilters.minExperience !== "") {
      const maxError = validateField("maxExperience", value, updatedFilters);
      setErrors((prevErrors) => ({ ...prevErrors, maxExperience: maxError }));
    }
  };

  // Final validation before sending the API request.
  const validateFilters = () => {
    const newErrors = {};

    // Validate every field that we need.
    Object.entries(filters).forEach(([name, value]) => {
      const err = validateField(name, value, filters);
      if (err) {
        newErrors[name] = err;
      }
    });

    return newErrors;
  };

  const fetchRecommendations = async () => {
    // Run complete validation.
    const validationErrors = validateFilters();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear any previous errors.
    setErrors({});
    try {
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
          {/* Specialization as a select */}
          <div>
            <label className="block mb-1 font-medium">Specialization</label>
            <select
              name="specialization"
              value={filters.specialization}
              onChange={handleInputChange}
              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select Specialization</option>
              <option value="criminal">Criminal Law</option>
              <option value="corporate">Corporate Law</option>
              <option value="family">Family Law</option>
              <option value="civil">Civil Law</option>
              <option value="intellectualProperty">Intellectual Property</option>
            </select>
            {errors.specialization && (
              <span className="text-red-500 text-sm">{errors.specialization}</span>
            )}
          </div>

          {/* Minimum Experience */}
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
            {errors.minExperience && (
              <span className="text-red-500 text-sm">{errors.minExperience}</span>
            )}
          </div>

          {/* Maximum Experience */}
          <div>
            <label className="block mb-1 font-medium">Maximum Experience (years)</label>
            <input
              type="number"
              name="maxExperience"
              value={filters.maxExperience}
              onChange={handleInputChange}
              placeholder="e.g., 10"
              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.maxExperience && (
              <span className="text-red-500 text-sm">{errors.maxExperience}</span>
            )}
          </div>

          {/* Law School */}
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

          {/* Graduation Year */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Graduation Year</label>
            <input
              type="number"
              name="graduationYear"
              value={filters.graduationYear}
              onChange={handleInputChange}
              placeholder={`e.g., 2010`}
              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.graduationYear && (
              <span className="text-red-500 text-sm">{errors.graduationYear}</span>
            )}
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
