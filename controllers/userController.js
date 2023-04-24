const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const AppError = require("../error/AppError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const jwtWebToken = async (user) => {
  const accessToken = await jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "90d",
    }
  );
  return accessToken;
};

const signup = asyncHandler(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password.includes(" ") || confirmPassword.includes(" ")) {
    return next(
      new AppError(
        "your password or passwordConfirm are not allowed including other characters",
        400
      )
    );
  }

  if (!email) return next(new AppError("please provide a email", 400));

  if (password !== confirmPassword) {
    return next(new AppError("Passwords do not match", 400));
  }

  const user = await User.find({ email });
  if (user.length) {
    return next(new AppError("email already in use", 400));
  }

  const userSignup = await User.create({
    name,
    email,
    password,
  });

  res.json({
    status: "success",
    userSignup,
  });
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("email is not valid",400))
  }

  const pass = await bcrypt.compare(password, user.password);

  if (!pass) return next(new AppError("Invalid password",400));

  const accessToken = await jwtWebToken(user);

  res.status(200).json({
    msg: "You have successfully signed in",
    accessToken,
  });
});

module.exports = {
  signup,
  login,
};
