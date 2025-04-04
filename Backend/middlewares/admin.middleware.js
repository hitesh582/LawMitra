const jwt = require('jsonwebtoken');

module.exports.adminAuth = async (req, res, next) => {
  try {
    // Extract token from cookies, Authorization header, or req.headers.token
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1] || req.headers.token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, login again' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Compare the decoded token with the admin credentials concatenated
    if (decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, message: 'Not authorized, login again' });
    }
    
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ success: false, message: error.message });
  }
};
