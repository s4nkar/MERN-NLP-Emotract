import jwt from 'jsonwebtoken';

export const verifyAccessToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });
  
    jwt.verify(token, "ACCESS_SECRET", (err, decoded) => {
      if (err) return res.status(403).json({ message: "Token expired, refresh required" });
      req.user = decoded;
      next();
    });
  };
  