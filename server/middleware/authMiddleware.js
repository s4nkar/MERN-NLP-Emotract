import jwt from 'jsonwebtoken';

export const verifyAccessToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      console.error("JWT Verification Error:", error);
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired, please refresh." });
      }
      return res.status(403).json({ message: "Invalid or expired token, refresh required" });
    }
  };
  