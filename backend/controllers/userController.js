const catchAsyncError = require("../middlewares/catchAsyncError");
const { ErrorHandler } = require("../middlewares/errorHandler");
const User = require("../modals/userModal");
const passport = require("../middlewares/passport");
const crypto = require("crypto");
const { sendEmail } = require("../utils/sendEmail");

//CREATE NEW USER   --   /api/v1/user/auth/new
exports.newUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("Email already in use", 400));
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const otpToken = await user.getOtpToken();
  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail(
      user.email,
      "GrowWell - One Time Password (OTP)",
      `Your OTP for GrowWell is ${otpToken}`
    );
  } catch {
    user.otpToken = undefined;
    user.otpTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler("Failed to send OTP email", 500));
  }

  res.status(201).json({
    success: true,
    message: "OTP email sent successfully",
  });
});

//SEND VERIFY OTP MAIL  --  /api/v1/user/auth/sendOTP
exports.sendOtp = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const otpToken = await user.getOtpToken();
  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail(
      user.email,
      "GrowWell - One Time Password (OTP)",
      `Your OTP for GrowWell is ${otpToken}`
    );
  } catch {
    user.otpToken = undefined;
    user.otpTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler("Failed to send OTP email", 500));
  }

  res.status(200).json({
    success: true,
    message: "OTP email sent successfully",
  });
});

//VERIFY USER EMAIL  --  /api/v1/user/auth/verify
exports.verifyOtp = catchAsyncError(async (req, res, next) => {
  const { otp } = req.body;
  const otpToken = crypto.createHash("sha256").update(otp).digest("hex");
  const user = await User.findOne({
    otpToken,
    otpTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Invalid OTP", 400));
  }
  user.otpToken = undefined;
  user.otpTokenExpire = undefined;
  user.isVerified = true;

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "OTP verified successfully",
  });
});

//LOGIN USER       --    /api/v1/user/auth/login
exports.login = catchAsyncError((req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err); // Handle any errors that occurred during authentication
    }
    if (!user) {
      return next(
        new ErrorHandler(info.message || `Authentication Failed`, 401)
      );
    }
    if (!user.isVerified) {
      return next(
        new ErrorHandler(
          "User is not verified. Please verify your email first",
          401
        )
      );
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err); // Handle errors during login
      }

      res.status(200).json({
        success: true,
        message: "User logged in successfully",
      });
    });
  })(req, res, next);
});

//LOGOUT USER      --   /api/v1/user/auth/logout
exports.logout = catchAsyncError(async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "User is not logged in",
    });
  }
  req.logout((err) => {
    if (err) {
      return next(
        new ErrorHandler("Error logging out user: " + err.message, 500)
      );
    }

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  });
});

//FORGOT PASSWORD  --  /api/v1/user/auth/forgot/password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ErrorHandler(`User not found with the email ${req.body.email}`, 400)
    );
  }

  const resetToken = await user.getResetToken();
  await user.save({ validateBeforeSave: false });

  let BASE_URL = process.env.FRONTEND_URL;

  if (process.env.NODE_ENV == "production") {
    BASE_URL = `${req.protocol}://${req.get("host")}`;
  }

  const resetUrl = `${BASE_URL}/user/auth/resetPassword/${resetToken}`;
  const message = `You are receiving this email because you (or someone else) requested a password reset for your account.
  \n\nPlease click on the following link to complete the process:\n\n${resetUrl}\n\nIf you did not request this, 
  please ignore this email and your password will remain unchanged.`;

  try {
    await sendEmail(user.email, "Password Reset Request", message);
    // Send response after the email has been sent successfully
    return res.status(200).json({
      success: true,
      message: "Password reset email sent successfully.",
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// RESET PASSWORD  --  /api/v1/user/auth/resetPassword/:token
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Invalid or expired reset password token", 400)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Incorrect password. Password does not match", 400)
    );
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;
  await user.save({ validateBeforeSave: false });

  // Send a response after password reset is successful
  return res.status(200).json({
    success: true,
    message: "Password has been reset successfully.",
  });
});

// GET USER PROFILE  --  /api/v1/user/profile
exports.getUserProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// UPDATE USER PROFILE  --  /api/v1/user/profile/update
exports.updateUserProfile = catchAsyncError(async (req, res, next) => {
  let newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// UPDATE USER PASSWORD  --  /api/v1/user/password/change
exports.updateUserPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  if (!(await user.isValidPassword(req.body.oldPassword))) {
    return next(new ErrorHandler("Incorrect old password", 400));
  }
  user.password = req.body.password;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

//ADMIN :  GET ALL USERS    --  /api/v1/admin/users
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

//ADMIN :  GET USER BY ID  --  /api/v1/admin/user/:id
exports.getUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User not found with the ID ${req.params.id}`, 401)
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});

//ADMIN :  UPDATE USER BY ID  --  /api/v1/admin/user/:id
exports.updateUser = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    new ErrorHandler(`User not found with the ID ${req.params.id}`, 401);
  }

  res.status(200).json({
    success: true,
    user,
  });
});

//ADMIN :  DELETE USER BY ID  --  /api/v1/admin/user/:id
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    new ErrorHandler(`User not found with the ID ${req.params.id}`, 401);
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
