// Backend/middlewares/admin.middleware.js
module.exports.authAdmin = (req, res, next) => {
    // For simplicity, check for an admin token (this can be replaced with your own admin auth logic)
    const token = req.headers.authorization?.split(" ")[1] || req.cookies["admin-token"];
    if (token === process.env.ADMIN_TOKEN) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized admin" });
    }
  };
  