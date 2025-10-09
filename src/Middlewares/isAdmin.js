import jwt from "jsonwebtoken";
import Admin from "../Models/admin.models.js";

const protectAdmin = async (req, res, next) => {
  const token = req.cookies.adminToken;
  
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_STRING);
    req.admin = await Admin.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export default protectAdmin;