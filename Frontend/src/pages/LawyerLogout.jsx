import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LawyerLogout = () => {
  const token = localStorage.getItem('lawyer-token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    axios.get(`${import.meta.env.VITE_API_URL}/lawyers/logout`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => {
      if (response.status === 200) {
        localStorage.removeItem('lawyer-token');
        navigate('/lawyerlogin');
      }
    }).catch(err => {
      console.error("Logout error:", err);
    });
  }, [token, navigate]);

  return <div>LawyerLogout</div>;
};

export default LawyerLogout;
