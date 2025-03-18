import React, { useEffect } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const UserLogout = () => {

    const token = localStorage.getItem('token')
    const navigate = useNavigate()

      useEffect(() => {
        if (!token) return;
    axios.get(`${import.meta.env.VITE_API_URL}/users/logout`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        if (response.status === 200) {
            localStorage.removeItem('token')
            navigate('/userlogin')
        }
    }).catch(err => {
        console.error("Logout error:", err);
      });
    }, [token, navigate]);

    return (
        <div>UserLogout</div>
    )
}

export default UserLogout
