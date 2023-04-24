const mongoose = require("mongoose");
const validator = require("validator");
const sendEmail = require("../middlewares/email");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "please provide Name"],
  },
  email: {
    type: String,
    lowercase: true,
    require: [true, "please provide Email"],
    unique: [true, "please provide Unique Email"],
    validate: [validator.isEmail, "Please Provide Valid Email",400],
  },
  password: {
    type: String,
    require: [true, "please provide Password"],
    trim: true,
    minlength: 8,
    maxlength: 20,
    validate: [
      validator.isStrongPassword,
      "Password Must alphabet, Special Character",
    ],
  },
  confirmPassword: {
    type: String,
    require: [true, "please provide Confirm Password"],
    trim: true,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords does not match",
    },
  },
});

userSchema.pre("save", async function (next) {
  await sendEmail({
    email: this.email,
    subject: "Registered",
    message: `Your Email ID is ${this.email} and your Login Password is ${this.password}`,
  });
  next();
});

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  console.log(this.password);
  next();
});

module.exports = new mongoose.model("User", userSchema);
