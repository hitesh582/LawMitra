import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LawyerDataContext } from "../context/LawyerContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { assets } from "../assets/assets";

const LawyerSignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [firstNameError, setFirstNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const { lawyer, setLawyer } = React.useContext(LawyerDataContext);

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  // Password validation: enforce at least 6 characters, or customize the regex for a stronger policy.
  const validatePassword = (value) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return regex.test(value);
  };

  // First name should be at least 3 characters long.
  const validateFirstName = (value) => {
    return value.trim().length >= 3;
  };

  const handleFirstNameChange = (e) => {
    const value = e.target.value;
    setFirstName(value);
    if (!validateFirstName(value)) {
      setFirstNameError("First name must be at least 3 characters long.");
    } else {
      setFirstNameError("");
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!validateEmail(value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

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

    // Prevent submission if any validation errors exist.
    if (firstNameError || emailError || passwordError) {
      alert("Please fix the errors in the form before submitting.");
      return;
    }
    const lawyerData = {
      fullName: {
        firstName: firstName,
        lastName: lastName,
      },
      email: email,
      password: password,
    };

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/lawyers/register`,
      lawyerData
    );

    if (response.status === 201) {
      const data = response.data;
      setLawyer(data.lawyer);
      localStorage.setItem("lawyer-token", data.token);
      navigate("/lawyerhome");
    }

    setEmail("");
    setFirstName("");
    setLastName("");
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
        <form onSubmit={submitHandler}>
          <h3 className="text-lg font-medium mb-2">What's our Lawyer's name</h3>
          <div className="flex gap-4 mb-4">
            <input
              required
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={handleFirstNameChange}
              className="bg-gray-100 rounded-lg px-4 py-2 border w-full text-lg mb-4"
            />
            <input
              required
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-gray-100 rounded-lg px-4 py-2 border w-full text-lg mb-4"
            />
          </div>
          {firstNameError && (
            <p className="text-red-500 text-sm mt-1">{firstNameError}</p>
          )}

          <h3 className="text-lg font-medium mb-2">
            What's our Lawyer's email
          </h3>
          <input
            required
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={handleEmailChange}
            className="bg-gray-100 rounded-lg px-4 py-2 border w-full text-lg mb-4"
          />
          {emailError && (
            <p className="text-red-500 text-sm mb-2">{emailError}</p>
          )}

          <h3 className="text-lg font-medium mb-2">Enter Password</h3>
          <input
            required
            type="password"
            placeholder="password"
            value={password}
            onChange={handlePasswordChange}
            className="bg-gray-100 rounded-lg px-4 py-2 border w-full text-lg mb-11"
          />
          {passwordError && (
            <p className="text-red-500 text-sm mb-2">{passwordError}</p>
          )}

          <button
            type="submit"
            className="bg-black text-white font-semibold rounded-lg px-4 py-2 w-full text-lg mb-3"
          >
            Create Lawyer Account
          </button>
        </form>
        <p className="text-center">
          Already have a account?{" "}
          <Link to="/lawyerlogin" className="text-blue-600">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LawyerSignUp;
