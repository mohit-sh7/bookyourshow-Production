import jwt from "jsonwebtoken";

// Normal user protection
export const protect = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token)
      return res.json({ success: false, message: "Not logged in" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    return res.json({ success: false, message: "Invalid token" });
  }
};

// Admin protection (proper fix)
export const protectAdmin = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token)
      return res.json({ success: false, message: "Not logged in" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.isAdmin)
      return res.json({ success: false, message: "Admin only" });

    req.user = decoded;
    next();
  } catch (err) {
    return res.json({ success: false, message: "Invalid admin token" });
  }
};
