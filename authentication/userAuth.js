const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = authenticateToken;
