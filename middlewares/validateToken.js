const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../error/AppError");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;

  let authHeader = req.headers.Authorization || req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return next(new AppError("User is not Authorized", 401));
      } else {
        const userExists = await User.findById(decoded._id);

        if (!userExists) {
          return next(new AppError("User does not exists", 401));
        }
        req.user = userExists;
        next();
      }
    });
  } else {
    return next(new AppError("Please login", 401));
  }
});

module.exports = validateToken;
