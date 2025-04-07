const express = require("express");
const router = express.Router();
const LawyerVerification = require("../models/lawyerVerification.model");
const sendEmail = require("../services/mailer");

// Get all pending lawyer verifications
router.get("/lawyer-verifications", async (req, res) => {
  try {
    const verifications = await LawyerVerification.find({ status: "pending" });
    res.status(200).json({ success: true, verifications });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Get all approved lawyer verifications
router.get("/lawyer-approved", async (req, res) => {
  try {
    const approvedLawyers = await LawyerVerification.find({ status: "approved" });
    res.status(200).json({ success: true, approvedLawyers });
  } catch (err) {
    console.error("Error fetching approved lawyers:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Get single lawyer verification details
router.get("/lawyer-verifications/:id", async (req, res) => {
  try {
    const verification = await LawyerVerification.findById(req.params.id);
    if (!verification) {
      return res.status(404).json({ success: false, message: "Verification not found" });
    }
    res.status(200).json({ success: true, verification });
  } catch (err) {
    console.error("Error fetching lawyer details:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});


// Accept lawyer verification and send approval email
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

    // Send approval email
    try {
      await sendEmail({
        to: verification.email,
        subject: "Lawyer Verification Approved",
        text: `Hello ${verification.fullName}, your lawyer verification has been approved.`,
        html: `<p>Hello <strong>${verification.fullName}</strong>,</p><p>Your lawyer verification has been <strong>approved</strong>.</p>`
      });
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr.message);
    }

    res.status(200).json({ success: true, message: "Lawyer approved" });
  } catch (err) {
    console.error("Approve route error:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Decline lawyer verification and send rejection email
router.delete("/lawyer-verifications/:id", async (req, res) => {
  try {
    const verification = await LawyerVerification.findById(req.params.id);
    if (!verification) {
      return res.status(404).json({ success: false, message: "Verification not found" });
    }

    // Send rejection email BEFORE deletion
    try {
      await sendEmail({
        to: verification.email,
        subject: "Lawyer Verification Declined",
        text: `Hello ${verification.fullName}, your lawyer verification has been declined.`,
        html: `<p>Hello <strong>${verification.fullName}</strong>,</p><p>Your lawyer verification has been <strong>declined</strong>.</p>`
      });
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr.message);
    }

    // Now delete the record
    await LawyerVerification.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Lawyer rejected and removed" });
  } catch (err) {
    console.error("Decline route error:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Delete an approved lawyer and send email notification
router.delete("/lawyer-approved/:id", async (req, res) => {
  try {
    // Find the approved lawyer verification document by id
    const verification = await LawyerVerification.findById(req.params.id);
    if (!verification) {
      return res.status(404).json({ success: false, message: "Approved lawyer not found" });
    }
    
    // Send rejection email informing the lawyer they're no longer part of LawMitra
    try {
      await sendEmail({
        to: verification.email,
        subject: "Notice: Removal from LawMitra",
        text: `Hello ${verification.fullName}, we regret to inform you that you will no longer be a part of LawMitra.`,
        html: `<p>Hello <strong>${verification.fullName}</strong>,</p>
               <p>We regret to inform you that you will no longer be a part of <strong>LawMitra</strong>.</p>`
      });
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr.message);
      // Optionally, you can choose to return an error here or proceed with deletion.
    }
    
    // Delete the lawyer's record from the database
    await LawyerVerification.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Approved lawyer deleted successfully" });
  } catch (err) {
    console.error("Delete approved lawyer error:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});



module.exports = router;
