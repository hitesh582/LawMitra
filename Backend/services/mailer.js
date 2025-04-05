const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // or use a different service (e.g., 'smtp.ethereal.email' for testing)
  auth: {
    user: process.env.EMAIL_USER,     // Your email address from .env
    pass: process.env.EMAIL_PASSWORD  // Your email password or App Password from .env
  }
});

const sendEmail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
