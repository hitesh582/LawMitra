const mongoose = require("mongoose");

const lawyerVerificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Lawyer", required: true },
    fullName: String,
    dateOfBirth: Date,
    phone: String,
    email: String,
    address: String,
    barLicenseNumber: String,
    stateRegistration: String,
    licenseIssued: Date,
    licenseExpiry: Date,
    lawFirm: String,
    lawSchool: String,
    graduationYear: Number,
    experience: Number,
    specialization: String,
    bio: String,
    references: String,
    documentUrl: String,
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("LawyerVerification", lawyerVerificationSchema);