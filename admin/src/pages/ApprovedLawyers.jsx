import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const ApprovedLawyers = ({ token }) => {
  const [approvedLawyers, setApprovedLawyers] = useState([]);

  const fetchApprovedLawyers = async () => {
    try {
      const res = await axios.get(`${backendUrl}/admin/lawyer-approved`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setApprovedLawyers(res.data.approvedLawyers);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // New function to delete an approved lawyer
  const deleteApprovedLawyer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lawyer?")) return;
    try {
      const res = await axios.delete(
        `${backendUrl}/admin/lawyer-approved/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        // Refresh the list after deletion
        fetchApprovedLawyers();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchApprovedLawyers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Approved Lawyers</h2>
      {approvedLawyers.length === 0 ? (
        <p>No approved lawyers found.</p>
      ) : (
        approvedLawyers.map((lawyer) => (
          <div key={lawyer._id} className="border p-4 mb-3 rounded">
            <p>
              <strong>Name:</strong> {lawyer.fullName}
            </p>
            <p>
              <strong>Email:</strong> {lawyer.email}
            </p>
            <p>
              <strong>Phone:</strong> {lawyer.phone}
            </p>
            {/* Include additional details as required */}
            <Link
              to={`/approved-lawyers/${lawyer._id}`}
              className="text-blue-500 hover:underline"
            >
              View Details
            </Link>

            {/* New Delete Button */}
            <button
              onClick={() => deleteApprovedLawyer(lawyer._id)}
              className="bg-red-500 text-white px-4 py-1 rounded ml-10"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ApprovedLawyers;
