// admin/src/pages/LawyerVerifications.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';


const LawyerVerifications = ({ token }) => {
  const [verifications, setVerifications] = useState([]);

  const fetchVerifications = async () => {
    try {
      const res = await axios.get(`${backendUrl}/admin/lawyer-verifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setVerifications(res.data.verifications);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const accept = async (id) => {
    try {
      const res = await axios.post(
        `${backendUrl}/admin/lawyer-verifications/${id}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        fetchVerifications();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const decline = async (id) => {
    try {
      const res = await axios.delete(`${backendUrl}/admin/lawyer-verifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchVerifications();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pending Lawyer Verifications</h2>
      {verifications.length === 0 ? (
        <p>No pending verifications.</p>
      ) : (
        verifications.map((v) => (
          <div key={v._id} className="border p-4 mb-3 rounded">
            <p><strong>Name:</strong> {v.fullName}</p>
            <p><strong>Email:</strong> {v.email}</p>
            <p><strong>Phone:</strong> {v.phone}</p>
            {/* Link to details page */}
            <Link to={`/verifications/${v._id}`} className="text-blue-500 hover:underline">
              View Details
            </Link>
            {/* Add any other fields you want to display */}
            <div className="mt-2">
              <button
                onClick={() => accept(v._id)}
                className="bg-green-500 text-white px-4 py-1 mr-2 rounded"
              >
                Accept
              </button>
              <button
                onClick={() => decline(v._id)}
                className="bg-red-500 text-white px-4 py-1 rounded"
              >
                Decline
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default LawyerVerifications;
