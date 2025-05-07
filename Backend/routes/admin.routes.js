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
    const approvedLawyers = await LawyerVerification.find({
      status: "approved",
    });
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
      return res
        .status(404)
        .json({ success: false, message: "Verification not found" });
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
      return res
        .status(404)
        .json({ success: false, message: "Verification not found" });
    }

    // Send approval email
    try {
      await sendEmail({
        to: verification.email,
        subject: "Lawyer Verification Approved – LawMitra",
        text: `Dear ${verification.fullName},\n\nWe are pleased to inform you that your lawyer verification request has been approved. You are now an officially verified member of the LawMitra platform.\n\nYou may now access all features reserved for verified lawyers.\n\nBest regards,\nLawMitra Team`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <p>Dear <strong>${verification.fullName}</strong>,</p>
            <p>We are pleased to inform you that your lawyer verification request has been <strong style="color: black;">approved</strong>.</p>
            <p>You are now officially a verified member of the <strong>LawMitra</strong> platform and can access all features reserved for verified legal professionals.</p>
            <p>If you have any questions, feel free to reach out to us.</p>
            <p style="margin-top: 20px;">Best regards,<br/>The LawMitra Team</p>
          </div>
        `,
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
      return res
        .status(404)
        .json({ success: false, message: "Verification not found" });
    }

    // Send rejection email BEFORE deletion
    try {
      await sendEmail({
        to: verification.email,
        subject: "Lawyer Verification Declined – LawMitra",
        text: `Dear ${verification.fullName},\n\nAfter careful review, we regret to inform you that your lawyer verification request has not been approved at this time.\n\nIf you believe this decision was made in error or wish to reapply, please contact us or submit a new application.\n\nSincerely,\nLawMitra Team`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <p>Dear <strong>${verification.fullName}</strong>,</p>
            <p>After a thorough review, we regret to inform you that your lawyer verification request has been <strong style="color: black;">declined</strong> at this time.</p>
            <p>If you believe this was in error or would like to reapply, please feel free to contact us or submit a new application.</p>
            <p style="margin-top: 20px;">Sincerely,<br/>The LawMitra Team</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr.message);
    }

    // Now delete the record
    await LawyerVerification.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Lawyer rejected and removed" });
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
      return res
        .status(404)
        .json({ success: false, message: "Approved lawyer not found" });
    }

    // Send rejection email informing the lawyer they're no longer part of LawMitra
    try {
      await sendEmail({
        to: verification.email,
        subject: "Notice of Removal – LawMitra",
        text: `Dear ${verification.fullName},\n\nThis is to formally inform you that you are no longer listed as a verified lawyer on the LawMitra platform.\n\nWe appreciate your past association and wish you the best in your future endeavors.\n\nWarm regards,\nLawMitra Team`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <p>Dear <strong>${verification.fullName}</strong>,</p>
            <p>This is to formally inform you that you are no longer listed as a verified lawyer on the <strong>LawMitra</strong> platform.</p>
            <p>We thank you for your previous association and wish you continued success in your professional journey.</p>
            <p style="margin-top: 20px;">Warm regards,<br/>The LawMitra Team</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr.message);
      // Optionally, you can choose to return an error here or proceed with deletion.
    }

    // Delete the lawyer's record from the database
    await LawyerVerification.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Approved lawyer deleted successfully" });
  } catch (err) {
    console.error("Delete approved lawyer error:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
