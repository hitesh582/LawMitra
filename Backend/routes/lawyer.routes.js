const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const lawyerController = require("../controllers/lawyer.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const sendEmail = require("../services/mailer");
const LawyerVerification = require("../models/lawyerVerification.model");

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullName.firstName")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  lawyerController.registerLawyer
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  lawyerController.loginLawyer
);

router.get(
  "/profile",
  authMiddleware.authLawyer,
  lawyerController.getLawyerProfile
);

router.get("/logout", authMiddleware.authLawyer, lawyerController.logoutLawyer);

// Submit verification + send confirmation email
router.post(
  "/submit-verification",
  authMiddleware.authLawyer,
  [
    body("fullName").notEmpty().withMessage("Full name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    // ... add other field validators as needed
  ],
  async (req, res) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      // Save verification request
      const verification = await LawyerVerification.create({
        userId: req.lawyer._id,
        ...req.body,
        status: "pending",
      });

      // Send confirmation email
      await sendEmail({
        to: verification.email,
        subject: "Verification Received – LawMitra",
        text: `Dear ${verification.fullName},\n\nThank you for submitting your verification details to LawMitra. We have received your application and will conduct a thorough review of your credentials. Please expect our decision (approval or decline) within 7 working days.\n\nIf you have any questions, contact us at support@lawmitra.com.\n\nBest regards,\nThe LawMitra Team`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; line-height:1.5;">
            <p>Dear <strong>${verification.fullName}</strong>,</p>
            <p>Thank you for submitting your verification details to <strong>LawMitra</strong>. We have successfully received your application and will conduct a thorough review of your credentials.</p>
            <p>Please expect to receive our formal decision (approval or decline) within <strong>7 working days</strong>.</p>
            <p>If you have any questions or require further assistance, please contact our support team at <a href="mailto:support@lawmitra.com">support@lawmitra.com</a>.</p>
            <p style="margin-top: 20px;">Best regards,<br/>The LawMitra Team</p>
          </div>
        `,
      });

      return res.status(201).json({
        success: true,
        message: "Verification submitted and confirmation email sent.",
      });
    } catch (err) {
      console.error("Error in /submit-verification:", err);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  }
);

module.exports = router;
