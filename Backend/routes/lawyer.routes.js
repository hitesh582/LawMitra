const express = require('express');
const router = express.Router();
const { body } = require("express-validator")
const lawyerController = require('../controllers/lawyer.controller');
const authMiddleware = require('../middlewares/auth.middleware');


router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullName.firstName').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
    lawyerController.registerLawyer
)

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
    lawyerController.loginLawyer
)

router.get('/profile', authMiddleware.authLawyer, lawyerController.getLawyerProfile)

router.get('/logout', authMiddleware.authLawyer, lawyerController.logoutLawyer)

router.post(
    '/submit-verification',
    authMiddleware.authLawyer,
    lawyerController.submitVerification
);

module.exports = router;