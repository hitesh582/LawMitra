// Backend/routes/admin.routes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { authAdmin } = require("../middlewares/admin.middleware");

router.post("/login", module.exports.adminLogin);


// GET pending lawyer verifications
router.get("/lawyer-verifications", authAdmin, adminController.getPendingVerifications);

// POST to accept a verification
router.post("/lawyer-verifications/:id/accept", authAdmin, adminController.acceptVerification);

// DELETE to decline (delete) a verification
router.delete("/lawyer-verifications/:id", authAdmin, adminController.declineVerification);

module.exports = router;
