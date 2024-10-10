const catchAsyncError = require("./catchAsyncError");
const { ErrorHandler } = require("./errorHandler");

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next(new ErrorHandler("Not authenticated", 401));
  }
  next();
});

exports.authorizedRoles = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(
        new ErrorHandler(`role ${req.user.role} is not allowed`, 401)
      );
    }
    next();
  };
};
