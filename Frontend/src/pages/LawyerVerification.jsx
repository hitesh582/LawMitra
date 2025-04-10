import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IKContext, IKUpload } from "imagekitio-react";
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

  // Validation helper
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Full Name
    if (formData.fullName.trim() === "") {
      newErrors.fullName = "Full Name is required.";
      isValid = false;
    } else if (formData.fullName.trim().split(" ").length < 2) {
      newErrors.fullName = "Please enter your full name (first and last name).";
      isValid = false;
    }

    // Date of Birth
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of Birth is required.";
      isValid = false;
    } else {
      const dob = new Date(formData.dateOfBirth);
      const ageDiffMs = Date.now() - dob.getTime();
      const ageDate = new Date(ageDiffMs);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);
      if (age < 18) {
        newErrors.dateOfBirth = "You must be at least 18 years old.";
        isValid = false;
      }
    }

    // Phone
    if (formData.phone.trim() === "") {
      newErrors.phone = "Phone number is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
      isValid = false;
    }

    // Email
    if (formData.email.trim() === "") {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    // Address
    if (formData.address.trim() === "") {
      newErrors.address = "Address is required.";
      isValid = false;
    }

    // Bar License Number
    if (formData.barLicenseNumber.trim() === "") {
      newErrors.barLicenseNumber = "Bar License Number is required.";
      isValid = false;
    }

    // State Registration
    if (formData.stateRegistration.trim() === "") {
      newErrors.stateRegistration = "State Registration is required.";
      isValid = false;
    }

    // License Issued & Expiry
    if (!formData.licenseIssued) {
      newErrors.licenseIssued = "License Issued Date is required.";
      isValid = false;
    }
    if (!formData.licenseExpiry) {
      newErrors.licenseExpiry = "License Expiry Date is required.";
      isValid = false;
    } else if (
      formData.licenseIssued &&
      new Date(formData.licenseExpiry) < new Date(formData.licenseIssued)
    ) {
      newErrors.licenseExpiry =
        "License expiry must be later than the issued date.";
      isValid = false;
    }

    // Law Firm
    if (formData.lawFirm.trim() === "") {
      newErrors.lawFirm = "Law Firm is required.";
      isValid = false;
    }

    // Law School
    if (formData.lawSchool.trim() === "") {
      newErrors.lawSchool = "Law School is required.";
      isValid = false;
    }

    // Graduation Year
    const currentYear = new Date().getFullYear();
    if (!formData.graduationYear) {
      newErrors.graduationYear = "Graduation Year is required.";
      isValid = false;
    } else if (
      formData.graduationYear < 1900 ||
      formData.graduationYear > currentYear
    ) {
      newErrors.graduationYear = "Enter a valid graduation year.";
      isValid = false;
    }

    // Experience
    if (formData.experience === "") {
      newErrors.experience = "Years of experience is required.";
      isValid = false;
    } else if (formData.experience < 0 || formData.experience > 50) {
      newErrors.experience = "Enter a valid number of years (0-50).";
      isValid = false;
    }

    // Specialization
    if (formData.specialization.trim() === "") {
      newErrors.specialization = "Please select a specialization.";
      isValid = false;
    }

    // Bio
    if (formData.bio.trim() === "") {
      newErrors.bio = "Professional bio is required.";
      isValid = false;
    }

    // Document Upload
    if (!formData.documentUrl) {
      newErrors.documentUrl = "Please upload your verification document.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    // Optional: clear error message as the field is being updated.
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const onError = (err) => {
    console.error("Upload error:", err);
  };

  const onSuccess = (res) => {
    console.log("Upload success:", res);
    const fullUrl = urlEndpoint + res.filePath;
    setFormData((prevData) => ({ ...prevData, documentUrl: fullUrl }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields before submission.
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/lawyers/submit-verification`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("lawyer-token")}`,
          },
        }
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
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Lawyer Verification Form
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white p-6 rounded shadow">
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
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              {errors.dateOfBirth && (
                <span className="text-red-500 text-sm">{errors.dateOfBirth}</span>
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
        <div className="bg-white p-6 rounded shadow">
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
                type="date"
                required
                value={formData.licenseIssued}
                onChange={handleChange}
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
                type="date"
                required
                value={formData.licenseExpiry}
                onChange={handleChange}
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
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">
            Education & Experience
          </h3>
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
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">
            Additional Information
          </h3>
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
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default LawyerVerification;
