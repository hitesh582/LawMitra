import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { LawyerDataContext } from '../context/LawyerContext'
import { assets } from "../assets/assets";

const LawyerLogin = () => {

  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  const { lawyer, setLawyer } = React.useContext(LawyerDataContext)
  const navigate = useNavigate()



  const submitHandler = async (e) => {
    e.preventDefault();
    const lawyer = {
      email: email,
      password    
    }

    const response = await axios.post(`${import.meta.env.VITE_API_URL}/lawyers/login`, lawyer)

    if (response.status === 200) {
      const data = response.data

      setLawyer(data.lawyer)
      localStorage.setItem('lawyer-token', data.token)
      navigate('/lawyerhome')

    }

    setEmail('')
    setPassword('')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${assets.Rectangle})` }}
    >
      <div
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md border border-gray-300"
        style={{ boxShadow: "0 0 20px rgba(0, 0, 0, 0.7)" }}
      >
        <form onSubmit={submitHandler}>
          <h3 className="text-lg font-medium mb-2">What's our Lawyer's email</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="email@example.com"
            className="bg-gray-100 mb-4 rounded-lg px-4 py-2 border w-full text-lg"
          />

          <h3 className="text-lg font-medium mb-2">Enter Password</h3>
          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="password"
            className="bg-gray-100 mb-4 rounded-lg px-4 py-2 border w-full text-lg"
          />

          <button
            type="submit"
            className="bg-black text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg"
          >
            Login
          </button>
        </form>

        <p className="text-center">
          Join us !{" "}
          <Link to="/lawyersignup" className="text-blue-600">
            Register as a Lawyer
          </Link>
        </p>

        <div className="flex justify-center items-center mt-6">
          <Link
            to="/userlogin"
            className="bg-black text-white font-semibold rounded-lg px-4 py-2 w-full text-lg text-center"
          >
            Sign in as User
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LawyerLogin




