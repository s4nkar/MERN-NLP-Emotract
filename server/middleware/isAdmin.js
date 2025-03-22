export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "ADMIN") {
      next();
    } else {
      res.status(403).json({ message: "Access denied. Admins only." });
    }
  };
  