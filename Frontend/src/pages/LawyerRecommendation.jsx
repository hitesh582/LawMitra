import React, { useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import {
  Sparkles,
  Briefcase,
  Award,
  BookOpen,
  GraduationCap,
  Mail,
  Phone,
} from "lucide-react";

const recommendationApiUrl = import.meta.env.VITE_RECOMMENDATION_API_URL;

const LawyerRecommendation = () => {
  const [filters, setFilters] = useState({
    specialization: "",
    minExperience: "",
    maxExperience: "",
    lawSchool: "",
    graduationYear: "",
  });
  const [recommendations, setRecommendations] = useState([]);
  const [errors, setErrors] = useState({});
  const recSectionRef = useRef(null);

  const currentYear = new Date().getFullYear();

  const validateField = (name, value, allFilters) => {
    let error = "";

    if (name === "specialization" && !value) {
      error = "Please select a specialization.";
    }

    if (name === "minExperience" && value !== "") {
      const minExp = Number(value);
      if (isNaN(minExp) || minExp < 0) {
        error = "Minimum experience must be a non-negative number.";
      }
      if (allFilters.graduationYear) {
        const gradYear = Number(allFilters.graduationYear);
        const allowedGradYear = currentYear - minExp;
        if (gradYear > allowedGradYear) {
          error = `For at least ${minExp} years of experience, graduation year must be ${allowedGradYear} or earlier.`;
        }
      }
    }

    if (name === "maxExperience" && value !== "") {
      const maxExp = Number(value);
      if (isNaN(maxExp) || maxExp < 0) {
        error = "Maximum experience must be a non-negative number.";
      }
      if (
        allFilters.minExperience &&
        Number(allFilters.minExperience) > maxExp
      ) {
        error =
          "Maximum experience should be greater than or equal to minimum experience.";
      }
    }

    if (name === "graduationYear" && value !== "") {
      const gradYear = Number(value);
      if (isNaN(gradYear) || gradYear < 1900 || gradYear > currentYear) {
        error = `Graduation year must be between 1900 and ${currentYear}.`;
      }
      if (allFilters.minExperience) {
        const minExp = Number(allFilters.minExperience);
        const allowedGradYear = currentYear - minExp;
        if (gradYear > allowedGradYear) {
          error = `For at least ${minExp} years of experience, graduation year must be ${allowedGradYear} or earlier.`;
        }
      }
    }

    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...filters, [name]: value };
    setFilters(updated);

    const fieldError = validateField(name, value, updated);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));

    // Re-validate dependent fields
    if (name === "minExperience" && updated.graduationYear) {
      const gradError = validateField(
        "graduationYear",
        updated.graduationYear,
        updated
      );
      setErrors((prev) => ({ ...prev, graduationYear: gradError }));
    }
    if (name === "graduationYear" && updated.minExperience) {
      const gradError = validateField("graduationYear", value, updated);
      setErrors((prev) => ({ ...prev, graduationYear: gradError }));
    }
    if (name === "maxExperience" && updated.minExperience) {
      const maxError = validateField("maxExperience", value, updated);
      setErrors((prev) => ({ ...prev, maxExperience: maxError }));
    }
  };

  const validateFilters = () => {
    const errs = {};
    Object.entries(filters).forEach(([k, v]) => {
      const e = validateField(k, v, filters);
      if (e) errs[k] = e;
    });
    return errs;
  };

  const fetchRecommendations = async () => {
    const validationErrors = validateFilters();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      const response = await axios.post(
        `${recommendationApiUrl}/recommend`,
        filters
      );
      if (response.data.success) {
        setRecommendations(response.data.recommendations);

        // Delay scroll slightly to make sure DOM updates
        setTimeout(() => {
          if (recSectionRef.current) {
            const offsetTop = recSectionRef.current.offsetTop;
            window.scrollTo({
              top: offsetTop + 25, // Adjust this to add margin
              behavior: "smooth",
            });
          }
        }, 100); // 100ms delay ensures rendering has happened
      } else {
        toast.error("No recommendations found");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <motion.div
      className="relative h-50px bg-fixed bg-cover bg-center bg-no-repeat text-black p-8 mt-0.5"
      style={{
        backgroundImage: `url('${assets.Rectangle}')`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        className="text-4xl font-bold mb-6 text-center flex justify-center items-center gap-2"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="mt-10 mb-10 text-white">Find Your Ideal Lawyer</h1>
      </motion.h2>

      <motion.div
        className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-black"
        style={{ boxShadow: "0 0 25px rgba(0, 0, 0, 1)" }}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-semibold mb-8 text-black">
          Filter Lawyers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Specialization */}
          <div>
            <label className=" mb-1 font-medium flex items-center gap-1">
              <p>Specialization</p>
            </label>
            <select
              name="specialization"
              value={filters.specialization}
              onChange={handleInputChange}
              className="w-full border-2  border-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Select Specialization</option>
              <option value="criminal">Criminal Law</option>
              <option value="corporate">Corporate Law</option>
              <option value="family">Family Law</option>
              <option value="civil">Civil Law</option>
              <option value="intellectualProperty">
                Intellectual Property
              </option>
            </select>
            {errors.specialization && (
              <span className="text-red-500 text-sm">
                {errors.specialization}
              </span>
            )}
          </div>

          {/* Min Experience */}
          <div>
            <label className=" mb-1 font-medium flex items-center gap-1">
              <p>Min. Experience</p>
            </label>
            <input
              type="number"
              name="minExperience"
              value={filters.minExperience}
              onChange={handleInputChange}
              placeholder="e.g., 5"
              className="w-full border-2 border-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.minExperience && (
              <span className="text-red-500 text-sm">
                {errors.minExperience}
              </span>
            )}
          </div>

          {/* Max Experience */}
          <div>
            <label className=" mb-1 font-medium flex items-center gap-1">
              <p>Max. Experience</p>
            </label>
            <input
              type="number"
              name="maxExperience"
              value={filters.maxExperience}
              onChange={handleInputChange}
              placeholder="e.g., 10"
              className="w-full border-2 border-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.maxExperience && (
              <span className="text-red-500 text-sm">
                {errors.maxExperience}
              </span>
            )}
          </div>

          {/* Law School */}
          <div>
            <label className=" mb-1 font-medium flex items-center gap-1">
              <p>Law School</p>
            </label>
            <input
              type="text"
              name="lawSchool"
              value={filters.lawSchool}
              onChange={handleInputChange}
              placeholder="e.g., Harvard Law"
              className="w-full border-2 border-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Graduation Year */}
          <div className="md:col-span-2">
            <label className=" mb-1 font-medium flex items-center gap-1">
              <p>Graduation Year</p>
            </label>
            <input
              type="number"
              name="graduationYear"
              value={filters.graduationYear}
              onChange={handleInputChange}
              placeholder="e.g., 2010"
              className="w-full border-2 border-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.graduationYear && (
              <span className="text-red-500 text-sm">
                {errors.graduationYear}
              </span>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchRecommendations}
            className="bg-black text-white px-8 py-3 rounded-lg shadow hover:bg-gray-800 transition"
          >
            Get Recommendations
          </motion.button>
        </div>
      </motion.div>

      <div ref={recSectionRef} className="max-w-4xl mx-auto mt-12">
        <h1 className="text-4xl font-bold mb-12 text-center text-white ">
          Recommended Lawyers
        </h1>
        {recommendations.length === 0 ? (
          <p className="text-center text-white">
            No recommendations to display.
          </p>
        ) : (
          recommendations.slice(0, 3).map((lawyer, idx) => (
            <motion.div
              key={lawyer._id || lawyer.id}
              className="bg-white p-6 rounded-lg shadow mb-6 border border-black hover:shadow-xl transition"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
            >
              <h4 className="text-2xl font-bold mb-2 flex items-center gap-2 text-black">
                <Sparkles /> {lawyer.fullName}
              </h4>
              <p className="flex items-center gap-2">
                <Briefcase size={16} /> <strong>Specialization:</strong>{" "}
                {lawyer.specialization}
              </p>
              <p className="flex items-center gap-2 mt-1">
                <Award size={16} /> <strong>Experience:</strong>{" "}
                {lawyer.experience} years
              </p>
              {lawyer.lawSchool && (
                <p className="flex items-center gap-2 mt-1">
                  <BookOpen size={16} /> <strong>Law School:</strong>{" "}
                  {lawyer.lawSchool}
                </p>
              )}
              {lawyer.graduationYear && (
                <p className="flex items-center gap-2 mt-1">
                  <GraduationCap size={16} /> <strong>Graduation Year:</strong>{" "}
                  {lawyer.graduationYear}
                </p>
              )}
              {lawyer.lawFirm && (
                <p className="flex items-center gap-2 mt-1">
                  <Briefcase size={16} /> <strong>Law Firm:</strong>{" "}
                  {lawyer.lawFirm}
                </p>
              )}
              {lawyer.email && (
                <p className="flex items-center gap-2 mt-1">
                  <Mail size={16} /> <strong>Email:</strong> {lawyer.email}
                </p>
              )}
              {lawyer.phone && (
                <p className="flex items-center gap-2 mt-1">
                  <Phone size={16} /> <strong>Phone:</strong> {lawyer.phone}
                </p>
              )}
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default LawyerRecommendation;
