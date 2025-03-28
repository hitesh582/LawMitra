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

  const navigate = useNavigate();
  const ikUploadRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

    if (!formData.documentUrl) {
      alert("Please upload your verification document before submitting.");
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
            <input
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full border rounded px-3 py-2"
            />
            <input
              name="dateOfBirth"
              type="date"
              required
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            <input
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full border rounded px-3 py-2"
            />
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border rounded px-3 py-2"
            />
            <input
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full border rounded px-3 py-2 md:col-span-2"
            />
          </div>
        </div>

        {/* Professional Credentials */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">
            Professional Credentials
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="barLicenseNumber"
              required
              value={formData.barLicenseNumber}
              onChange={handleChange}
              placeholder="Bar License Number"
              className="w-full border rounded px-3 py-2"
            />
            <input
              name="stateRegistration"
              required
              value={formData.stateRegistration}
              onChange={handleChange}
              placeholder="State Registration"
              className="w-full border rounded px-3 py-2"
            />
            <input
              name="licenseIssued"
              type="date"
              required
              value={formData.licenseIssued}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            <input
              name="licenseExpiry"
              type="date"
              required
              value={formData.licenseExpiry}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            <input
              name="lawFirm"
              required
              value={formData.lawFirm}
              onChange={handleChange}
              placeholder="Law Firm"
              className="w-full border rounded px-3 py-2 md:col-span-2"
            />
          </div>
        </div>

        {/* Education & Experience */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">
            Education & Experience
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="lawSchool"
              required
              value={formData.lawSchool}
              onChange={handleChange}
              placeholder="Law School"
              className="w-full border rounded px-3 py-2"
            />
            <input
              name="graduationYear"
              type="number"
              required
              value={formData.graduationYear}
              onChange={handleChange}
              placeholder="Graduation Year"
              className="w-full border rounded px-3 py-2"
            />
            <input
              name="experience"
              type="number"
              required
              value={formData.experience}
              onChange={handleChange}
              placeholder="Years of Experience"
              className="w-full border rounded px-3 py-2"
            />
            <select
              name="specialization"
              required
              value={formData.specialization}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 md:col-span-2"
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
          </div>
        </div>

        {/* Additional Information & Document Upload */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">
            Additional Information
          </h3>
          <textarea
            name="bio"
            required
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            placeholder="Professional Bio"
            className="w-full border rounded px-3 py-2 mb-2"
          />
          <input
            name="references"
            value={formData.references}
            onChange={handleChange}
            placeholder="References (optional)"
            className="w-full border rounded px-3 py-2"
          />

          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-4">
              Upload verification documents
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
