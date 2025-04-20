// src/pages/LawyerDetails.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { useParams, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LawyerDetails = ({ token }) => {
  const { id } = useParams();
  const location = useLocation();
  const [lawyer, setLawyer] = useState(null);

  // Determine the "Back" link based on the current URL path
  const isApprovedRoute = location.pathname.startsWith("/approved-lawyers");
  const backLink = isApprovedRoute ? "/approved-lawyers" : "/verifications";
  const backText = isApprovedRoute
    ? "Back to Approved Lawyers"
    : "Back to Pending Verifications";

  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/admin/lawyer-verifications/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data.success) {
          setLawyer(res.data.verification);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchLawyer();
  }, [id, token]);

  if (!lawyer) return <p>Loading lawyer details...</p>;

  return (
    <div className="p-6">
      <Link to={backLink} className="text-blue-500 ">
         {backText}
      </Link>
      <h2 className="text-2xl font-bold my-6 text-black">Lawyer Details</h2>
      <div className="border p-4 rounded shadow text-black">
        <p>
          <strong>Name:</strong> {lawyer.fullName}
        </p>
        <p>
          <strong>Email:</strong> {lawyer.email}
        </p>
        <p>
          <strong>Phone:</strong> {lawyer.phone}
        </p>
        <p>
          <strong>Date of Birth:</strong>{" "}
          {lawyer.dateOfBirth
            ? new Date(lawyer.dateOfBirth).toLocaleDateString()
            : "N/A"}
        </p>
        <p>
          <strong>Address:</strong> {lawyer.address}
        </p>
        <p>
          <strong>Bar License Number:</strong> {lawyer.barLicenseNumber}
        </p>
        <p>
          <strong>State Registration:</strong> {lawyer.stateRegistration}
        </p>
        <p>
          <strong>License Issued:</strong>{" "}
          {lawyer.licenseIssued
            ? new Date(lawyer.licenseIssued).toLocaleDateString()
            : "N/A"}
        </p>
        <p>
          <strong>License Expiry:</strong>{" "}
          {lawyer.licenseExpiry
            ? new Date(lawyer.licenseExpiry).toLocaleDateString()
            : "N/A"}
        </p>
        <p>
          <strong>Law Firm:</strong> {lawyer.lawFirm}
        </p>
        <p>
          <strong>Law School:</strong> {lawyer.lawSchool}
        </p>
        <p>
          <strong>Graduation Year:</strong> {lawyer.graduationYear}
        </p>
        <p>
          <strong>Experience:</strong> {lawyer.experience} years
        </p>
        <p>
          <strong>Specialization:</strong> {lawyer.specialization}
        </p>
        <p>
          <strong>Bio:</strong> {lawyer.bio}
        </p>
        <p>
          <strong>Document URL:</strong>{" "}
          {lawyer.documentUrl && (
            <a
              href={lawyer.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 "
            >
              View Document
            </a>
          )}
        </p>
        {/* Include any other fields you want */}
      </div>
    </div>
  );
};

export default LawyerDetails;
