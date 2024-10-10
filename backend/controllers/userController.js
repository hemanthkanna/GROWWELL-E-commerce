const catchAsyncError = require("../middlewares/catchAsyncError");
const { ErrorHandler } = require("../middlewares/errorHandler");
const User = require("../modals/userModal");
const passport = require("../middlewares/passport");

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
  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: user,
  });
});

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
