import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { assets } from "../assets/assets";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState({});
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { user, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

   // Email must follow a basic valid email structure
   const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  // Password should be at least 6 characters long and include uppercase, lowercase, a digit, and a special character
  const validatePassword = (value) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return regex.test(value);
  };

  // Handler to validate and update email
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!validateEmail(value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  // Handler to validate and update password
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (!validatePassword(value)) {
      setPasswordError(
        "Password must be at least 6 characters long, include uppercase, lowercase, number, and special character."
      );
    } else {
      setPasswordError("");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (emailError || passwordError) {
      alert("Please fix the errors in the form before submitting.");
      return;
    }

    const userData = {
      email: email,
      password: password,
    };

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/users/login`,
      userData
    );

    if (response.status === 200) {
      const data = response.data;
      setUser(data.user);
      localStorage.setItem("token", data.token);
      navigate("/home");
    } 

    setEmail("");
    setPassword("");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${assets.Rectangle})` }}
    >
      <div
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md border border-gray-300"
        style={{ boxShadow: "0 0 20px rgba(0, 0, 0, 0.7)" }}
      >
        <form onSubmit={(e) => {
          submitHandler(e)
        }}>
          <h3 className="text-lg font-medium mb-2">What's our User's email</h3>
          <input
            required
            value={email}
            onChange={handleEmailChange}
            type="email"
            placeholder="email@example.com"
            className="bg-gray-100 mb-4 rounded-lg px-4 py-2 border w-full text-lg"
          />
          {emailError && <p className="text-red-500 text-sm mb-2">{emailError}</p>}

          <h3 className="text-lg font-medium mb-2">Enter Password</h3>
          <input
            required
            value={password}
            onChange={handlePasswordChange}
            type="password"
            placeholder="password"
            className="bg-gray-100 mb-4 rounded-lg px-4 py-2 border w-full text-lg"
          />
          {passwordError && <p className="text-red-500 text-sm mb-2">{passwordError}</p>}

          <button
            type="submit"
            className="bg-black text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg"
          >
            Login
          </button>
        </form>

        <p className="text-center">
          New here?{" "}
          <Link to="/usersignup" className="text-blue-600">
            Create new Account
          </Link>
        </p>

        <div className="flex justify-center items-center mt-6">
          <Link
            to="/lawyerlogin"
            className="bg-black text-white font-semibold rounded-lg px-4 py-2 w-full text-lg text-center"
          >
            Log in as a Lawyer
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
