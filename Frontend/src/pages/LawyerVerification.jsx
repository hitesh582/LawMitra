import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IKContext, IKUpload } from "imagekitio-react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";

const urlEndpoint = import.meta.env.VITE_IMAGE_KIT_ENDPOINT;
const publicKey = import.meta.env.VITE_IMAGE_KIT_PUBLIC_KEY;

const authenticator = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }
    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const LawyerVerification = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    address: "",
    barLicenseNumber: "",
    stateRegistration: "",
    licenseIssued: "",
    licenseExpiry: "",
    lawFirm: "",
    lawSchool: "",
    graduationYear: "",
    experience: "",
    specialization: "",
    bio: "",
    references: "",
    documentUrl: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const ikUploadRef = useRef(null);
  const currentYear = new Date().getFullYear();

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "fullName":
        if (value.trim() === "") {
          error = "Full Name is required.";
        } else if (value.trim().split(" ").length < 2) {
          error = "Please enter your full name (first and last name).";
        }
        break;
      case "dateOfBirth":
        if (!value) {
          error = "Date of Birth is required.";
        } else {
          // Enforce the proper format
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!dateRegex.test(value)) {
            error = "Date must be in the format DD-MM-YYYY.";
          } else {
            const dob = new Date(value);
            if (isNaN(dob.getTime())) {
              error = "Invalid date provided.";
            } else {
              const year = dob.getFullYear();
              if (year < 1900) {
                error = "Year must be 1900 or later.";
              } else if (dob > new Date()) {
                error = "Date of birth cannot be in the future.";
              } else {
                // Calculate age and check if the person is at least 18
                const ageDiffMs = Date.now() - dob.getTime();
                const ageDate = new Date(ageDiffMs);
                const age = Math.abs(ageDate.getUTCFullYear() - 1970);
                if (age < 18) {
                  error = "You must be at least 18 years old.";
                }
              }
            }
          }
        }
        break;

      case "phone":
        if (value.trim() === "") {
          error = "Phone number is required.";
        } else if (!/^\d{10}$/.test(value)) {
          error = "Phone number must be exactly 10 digits.";
        }
        break;
      case "email":
        if (value.trim() === "") {
          error = "Email is required.";
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
          error = "Please enter a valid email address.";
        }
        break;
      case "address":
        if (value.trim() === "") {
          error = "Address is required.";
        }
        break;
      case "barLicenseNumber":
        if (value.trim() === "") {
          error = "Bar License Number is required.";
        }
        break;
      case "stateRegistration":
        if (value.trim() === "") {
          error = "State Registration is required.";
        }
        break;
      case "licenseIssued":
        if (!value) {
          error = "License Issued Date is required.";
        } else {
          const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
          if (!dateRegex.test(value)) {
            error = "Date must be in the format DD-MM-YYYY.";
          } else {
            const issued = parseDate(value);
            if (isNaN(issued.getTime())) {
              error = "Invalid date provided.";
            } else if (issued > new Date()) {
              error = "License issued date cannot be in the future.";
            }
          }
        }
        break;

      case "licenseExpiry":
        if (!value) {
          error = "License Expiry Date is required.";
        } else {
          const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
          if (!dateRegex.test(value)) {
            error = "Date must be in the format DD-MM-YYYY.";
          } else {
            const expiry = parseDate(value);
            if (isNaN(expiry.getTime())) {
              error = "Invalid date provided.";
            } else if (formData.licenseIssued) {
              const issued = parseDate(formData.licenseIssued);
              if (isNaN(issued.getTime())) {
                error = "Invalid License Issued Date.";
              } else if (expiry <= issued) {
                error = "License expiry must be later than the issued date.";
              }
            }
          }
        }
        break;

      case "lawFirm":
        if (value.trim() === "") {
          error = "Law Firm is required.";
        }
        break;
      case "lawSchool":
        if (value.trim() === "") {
          error = "Law School is required.";
        }
        break;
      case "graduationYear":
        if (!value) {
          error = "Graduation Year is required.";
        } else if (value < 1900 || value > currentYear) {
          error = "Enter a valid graduation year.";
        } else if (formData.experience !== "" && !errors.experience) {
          // If experience is provided, check graduation year versus experience.
          const exp = parseInt(formData.experience, 10);
          const gradYear = parseInt(value, 10);
          if (gradYear > currentYear - exp) {
            error = `Graduation year must be ${
              currentYear - exp
            } or before, given ${exp} years of experience.`;
          }
        }
        break;
      case "experience":
        if (value === "") {
          error = "Years of experience is required.";
        } else if (value < 0 || value > 50) {
          error = "Enter a valid number of years (0-50).";
        } else if (formData.graduationYear && !errors.graduationYear) {
          // Check graduation year against experience.
          const exp = parseInt(value, 10);
          const gradYear = parseInt(formData.graduationYear, 10);
          if (gradYear > currentYear - exp) {
            error = `Graduation year must be ${
              currentYear - exp
            } or before, given ${exp} years of experience.`;
          }
        }
        break;
      case "specialization":
        if (value.trim() === "") {
          error = "Please select a specialization.";
        }
        break;
      case "bio":
        if (value.trim() === "") {
          error = "Professional bio is required.";
        }
        break;
      case "documentUrl":
        if (!value) {
          error = "Please upload your verification document.";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    const fieldError = validateField(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: fieldError }));
    if (name === "experience" || name === "graduationYear") {
      const expError = validateField(
        "experience",
        name === "experience" ? value : formData.experience
      );
      const gradError = validateField(
        "graduationYear",
        name === "graduationYear" ? value : formData.graduationYear
      );
      setErrors((prevErrors) => ({
        ...prevErrors,
        experience: expError,
        graduationYear: gradError,
      }));
    }
  };

  const onError = (err) => console.error("Upload error:", err);
  const onSuccess = (res) => {
    const fullUrl = urlEndpoint + res.filePath;
    setFormData((prevData) => ({ ...prevData, documentUrl: fullUrl }));
    setErrors((prevErrors) => ({ ...prevErrors, documentUrl: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    Object.entries(formData).forEach(([name, value]) => {
      const errMsg = validateField(name, value);
      if (errMsg) {
        newErrors[name] = errMsg;
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/lawyers/submit-verification`,
        formData,
        { headers: { Authorization: `Bearer ${localStorage.getItem("lawyer-token")}` } }
      );
      if (response.status === 200 || response.status === 201) {
        navigate("/timerpage");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong during verification.");
    }
  };

  return (
    <motion.div
      className="relative h-50px bg-fixed bg-no-repeat bg-cover bg-center flex items-center justify-center p-6 mt-0.5"
      style={{
        backgroundImage: `url('${assets.Rectangle}')`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="bg-white bg-opacity-90 rounded-2xl shadow-xl w-full max-w-4xl p-8 backdrop-blur-sm"
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Lawyer Verification Form
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ... all existing form sections unchanged ... */}
                  {/* Personal Information */}
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full border rounded px-3 py-2"
              />
              {errors.fullName && (
                <span className="text-red-500 text-sm">{errors.fullName}</span>
              )}
            </div>
            <div>
              <input
                name="dateOfBirth"
                type="date" // now text so invalid strings can be captured
                required
                value={formData.dateOfBirth}
                onChange={handleChange}
                placeholder="DD-MM-YYYY"
                className="w-full border rounded px-3 py-2"
              />

              {errors.dateOfBirth && (
                <span className="text-red-500 text-sm">
                  {errors.dateOfBirth}
                </span>
              )}
            </div>
            <div>
              <input
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full border rounded px-3 py-2"
              />
              {errors.phone && (
                <span className="text-red-500 text-sm">{errors.phone}</span>
              )}
            </div>
            <div>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border rounded px-3 py-2"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email}</span>
              )}
            </div>
            <div className="md:col-span-2">
              <input
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full border rounded px-3 py-2"
              />
              {errors.address && (
                <span className="text-red-500 text-sm">{errors.address}</span>
              )}
            </div>
          </div>
        </div>

        {/* Professional Credentials */}
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-4">
            Professional Credentials
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                name="barLicenseNumber"
                required
                value={formData.barLicenseNumber}
                onChange={handleChange}
                placeholder="Bar License Number"
                className="w-full border rounded px-3 py-2"
              />
              {errors.barLicenseNumber && (
                <span className="text-red-500 text-sm">
                  {errors.barLicenseNumber}
                </span>
              )}
            </div>
            <div>
              <input
                name="stateRegistration"
                required
                value={formData.stateRegistration}
                onChange={handleChange}
                placeholder="State Registration"
                className="w-full border rounded px-3 py-2"
              />
              {errors.stateRegistration && (
                <span className="text-red-500 text-sm">
                  {errors.stateRegistration}
                </span>
              )}
            </div>
            <div>
              <input
                name="licenseIssued"
                type="text"
                required
                value={formData.licenseIssued}
                onChange={handleChange}
                placeholder="License Issued Date" // Updated placeholder
                className="w-full border rounded px-3 py-2"
              />
              {errors.licenseIssued && (
                <span className="text-red-500 text-sm">
                  {errors.licenseIssued}
                </span>
              )}
            </div>
            <div>
              <input
                name="licenseExpiry"
                type="text"
                required
                value={formData.licenseExpiry}
                onChange={handleChange}
                placeholder="License Expiry Date" // Updated placeholder
                className="w-full border rounded px-3 py-2"
              />
              {errors.licenseExpiry && (
                <span className="text-red-500 text-sm">
                  {errors.licenseExpiry}
                </span>
              )}
            </div>
            <div className="md:col-span-2">
              <input
                name="lawFirm"
                required
                value={formData.lawFirm}
                onChange={handleChange}
                placeholder="Law Firm"
                className="w-full border rounded px-3 py-2"
              />
              {errors.lawFirm && (
                <span className="text-red-500 text-sm">{errors.lawFirm}</span>
              )}
            </div>
          </div>
        </div>

        {/* Education & Experience */}
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-4">Education & Experience</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                name="lawSchool"
                required
                value={formData.lawSchool}
                onChange={handleChange}
                placeholder="Law School"
                className="w-full border rounded px-3 py-2"
              />
              {errors.lawSchool && (
                <span className="text-red-500 text-sm">{errors.lawSchool}</span>
              )}
            </div>
            <div>
              <input
                name="graduationYear"
                type="number"
                required
                value={formData.graduationYear}
                onChange={handleChange}
                placeholder="Graduation Year"
                className="w-full border rounded px-3 py-2"
              />
              {errors.graduationYear && (
                <span className="text-red-500 text-sm">
                  {errors.graduationYear}
                </span>
              )}
            </div>
            <div>
              <input
                name="experience"
                type="number"
                required
                value={formData.experience}
                onChange={handleChange}
                placeholder="Years of Experience"
                className="w-full border rounded px-3 py-2"
              />
              {errors.experience && (
                <span className="text-red-500 text-sm">
                  {errors.experience}
                </span>
              )}
            </div>
            <div className="md:col-span-2">
              <select
                name="specialization"
                required
                value={formData.specialization}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
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
          </div>
        </div>

        {/* Additional Information & Document Upload */}
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-4">Additional Information</h3>
          <div>
            <textarea
              name="bio"
              required
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              placeholder="Professional Bio"
              className="w-full border rounded px-3 py-2 mb-2"
            />
            {errors.bio && (
              <span className="text-red-500 text-sm">{errors.bio}</span>
            )}
          </div>
          <input
            name="references"
            value={formData.references}
            onChange={handleChange}
            placeholder="References (optional)"
            className="w-full border rounded px-3 py-2"
          />
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-4">
              Upload Verification Documents
            </h3>
            <IKContext
              urlEndpoint={urlEndpoint}
              publicKey={publicKey}
              authenticator={authenticator}
            >
              <IKUpload
                fileName="lawyer-verification-doc.png"
                onError={onError}
                onSuccess={onSuccess}
                useUniqueFileName={true}
                style={{ display: "none" }}
                ref={ikUploadRef}
              />
              <label
                onClick={() => ikUploadRef.current.click()}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={assets.gallery_icon}
                  alt="Upload Document"
                  className="w-5 h-5"
                />
              </label>
            </IKContext>
            {formData.documentUrl && (
              <p className="text-green-600 text-sm mt-1">
                Document Uploaded ✅
              </p>
            )}
            {errors.documentUrl && (
              <span className="text-red-500 text-sm">{errors.documentUrl}</span>
            )}
          </div>
        </div>
          {/* Submit Button */}
          <div className="flex justify-center">
            <motion.button
              type="submit"
              className="bg-black hover:bg-gray-700 cursor-pointer text-white font-semibold py-2 px-6 rounded-2xl shadow-md  mt-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default LawyerVerification;

