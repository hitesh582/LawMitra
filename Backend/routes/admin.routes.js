const express = require("express");
const router = express.Router();
const LawyerVerification = require("../models/lawyerVerification.model");


// Get all pending lawyer verifications
router.get("/lawyer-verifications", async (req, res) => {
  try {
    const verifications = await LawyerVerification.find({ status: "pending" });
    res.status(200).json({ success: true, verifications });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Accept lawyer verification
router.post("/lawyer-verifications/:id/accept", async (req, res) => {
  try {
    const verification = await LawyerVerification.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!verification) {
      return res.status(404).json({ success: false, message: "Verification not found" });
    }
    res.status(200).json({ success: true, message: "Lawyer approved" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Decline lawyer verification
router.delete("/lawyer-verifications/:id", async (req, res) => {
  try {
    const result = await LawyerVerification.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: "Verification not found" });
    }
    res.status(200).json({ success: true, message: "Lawyer rejected and removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
