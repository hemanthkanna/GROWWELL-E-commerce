const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    trim: true,
    maxLength: [50, "Name cannot exceed 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [8, "Password should be at least 8 characters long"],
    select: false,
  },
  avatar: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordTokenExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isValidPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetToken = async function () {
  //Generate the token
  const token = crypto.randomBytes(20).toString("hex");

  //Hash the token and set it as the resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  //Set the expiration time for the token
  this.resetPasswordTokenExpire = Date.now() + 10 * 60 * 1000;
  return token;
};

let schema = mongoose.model("User", userSchema);
module.exports = schema;
