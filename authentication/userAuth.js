const jwt = require("jsonwebtoken");
const SECRET_KEY = "your_secret_key";

const authenticateToken = (req, res, next) => {

  const authHeader = req.header("Authorization");

  console.log(authHeader);

  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied, no token provided" });
  }

  
  const token = authHeader.split(" ")[1];

  try {
    
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log(decoded);

    
    req.user = decoded;

    
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = authenticateToken;
