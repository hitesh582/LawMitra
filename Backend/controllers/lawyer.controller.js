const lawyerModel = require("../models/lawyer.model");
const lawyerService = require("../services/lawyer.service");
const LawyerVerification = require("../models/lawyerVerification.model");
const blackListTokenModel = require("../models/blacklistToken.model");
const { validationResult } = require("express-validator");

module.exports.registerLawyer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, password } = req.body;

  const isLawyerAlreadyExist = await lawyerModel.findOne({ email });

  if (isLawyerAlreadyExist) {
    return res.status(400).json({ message: "Lawyer already exist" });
  }

  const hashedPassword = await lawyerModel.hashPassword(password);

  const lawyer = await lawyerService.createLawyer({
    firstName: fullName.firstName,
    lastName: fullName.lastName,
    email,
    password: hashedPassword,
  });

  const token = lawyer.generateAuthToken();

  res.status(201).json({ token, lawyer });
};

module.exports.loginLawyer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const lawyer = await lawyerModel.findOne({ email }).select("+password");

  if (!lawyer) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await lawyer.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = lawyer.generateAuthToken();

  res.cookie("token", token);

  res.status(200).json({ token, lawyer });
};

module.exports.getLawyerProfile = async (req, res) => {
  // 'req.lawyer' is set by authMiddleware.authLawyer
  if (!req.lawyer) {
    return res.status(404).json({ message: "Lawyer not found" });
  }
  res.status(200).json({ lawyer: req.lawyer });
};

module.exports.logoutLawyer = async (req, res) => {
  // Retrieve the token from cookies or headers before clearing
  const token =
    req.cookies["lawyer-token"] || req.headers.authorization?.split(" ")[1];

  // Check if token exists
  if (!token) {
    return res.status(400).json({ message: "No token found for logout" });
  }

  try {
    // Add the token to the blacklist to invalidate it
    await blackListTokenModel.create({ token });

    // Clear the token cookie with the correct name
    res.clearCookie("lawyer-token");

    res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Logout failed due to server error" });
  }
};

module.exports.submitVerification = async (req, res) => {
  try {
      const {
          fullName, dateOfBirth, phone, email, address, barLicenseNumber,
          stateRegistration, licenseIssued, licenseExpiry, lawFirm, lawSchool,
          graduationYear, experience, specialization, bio, references, documentUrl
      } = req.body;

      const lawyerVerification = await LawyerVerification.create({
          userId: req.lawyer._id,
          fullName, dateOfBirth, phone, email, address, barLicenseNumber,
          stateRegistration, licenseIssued, licenseExpiry, lawFirm, lawSchool,
          graduationYear, experience, specialization, bio, references, documentUrl,
          status: "pending"
      });

      res.status(201).json({ message: "Verification submitted successfully", lawyerVerification });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Verification failed" });
  }
};