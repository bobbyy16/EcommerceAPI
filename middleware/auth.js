const jwt = require("jsonwebtoken");
const { User } = require("../models");

/**
 * Middleware to authenticate JWT token
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ error: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ error: "Token expired" });
    }
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

/**
 * Middleware to require admin role
 */
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

/**
 * Middleware to require customer role
 */
const requireCustomer = (req, res, next) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ error: "Customer access required" });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireCustomer,
};
