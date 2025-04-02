// Backend/controllers/admin.controller.js
const LawyerVerification = require("../models/lawyerVerification.model");

exports.getPendingVerifications = async (req, res) => {
  try {
    const pending = await LawyerVerification.find({ status: "pending" });
    res.status(200).json({ success: true, verifications: pending });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching verifications" });
  }
};

exports.acceptVerification = async (req, res) => {
  const { id } = req.params;
  try {
    // Update the status to approved
    const verification = await LawyerVerification.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );
    if (!verification) {
      return res.status(404).json({ success: false, message: "Verification not found" });
    }
    // Forward to recommendation system here if needed
    res.status(200).json({ success: true, message: "Verification accepted", verification });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error accepting verification" });
  }
};

exports.declineVerification = async (req, res) => {
  const { id } = req.params;
  try {
    const verification = await LawyerVerification.findByIdAndDelete(id);
    if (!verification) {
      return res.status(404).json({ success: false, message: "Verification not found" });
    }
    res.status(200).json({ success: true, message: "Verification declined and deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error declining verification" });
  }
};

// In Backend/controllers/admin.controller.js or a dedicated admin auth controller
module.exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;
    // Replace with your real admin validation
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      // You could either return a token that equals ADMIN_TOKEN or generate a JWT for admin
      return res.status(200).json({ success: true, token: process.env.ADMIN_TOKEN });
    } else {
      return res.status(401).json({ success: false, message: "Invalid admin credentials" });
    }
  };
  