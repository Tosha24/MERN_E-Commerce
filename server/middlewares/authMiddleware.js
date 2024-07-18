import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

const authenticate = asyncHandler(async (req, res, next) => {
    
  const token = req.cookies.jwt;
  if (!token) {
    res.status(401);
    throw new Error("Unauthorized");
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId).select("-password"); // this is to exclude the password field from the user object
  if (!user) {
    res.status(401);
    throw new Error("Unauthorized");
  }
  req.user = user; // this is to make the user object available in the request object in the route handler
  next();
});

const authorizeAsAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Unauthorized");
  }
});

export { authenticate, authorizeAsAdmin };
