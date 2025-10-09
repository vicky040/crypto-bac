import asyncHandler from '../Utils/asyncHandler.js';
import User from '../Models/user.models.js';
import jwt from 'jsonwebtoken';
import CustomError from '../Utils/CustomError.js';

const isLogined = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    console.log('No token found');
    return next(new CustomError("Access denied. Please log in again.", 401));
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET_STRING);
  } catch (err) {
    console.log('Token verification failed:', err.message);
    return next(new CustomError("Invalid or expired token.", 401));
  }

  console.log("Hello World"); // should appear if above passes

  const user = await User.findById(decodedToken.id).select('-password');

  if (!user) {
    console.log('User not found in DB');
    return next(new CustomError("The user associated with this token no longer exists.", 401));
  }

  req.user = user;
  next();
});


export default isLogined;
