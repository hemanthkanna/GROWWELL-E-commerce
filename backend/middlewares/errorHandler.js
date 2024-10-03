const errorHandler = (err, req, res, next) => {
  // Default to 500 if no status code is set (internal server error)
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Development Mode Error Handling
  if (process.env.NODE_ENV === "development") {
    return res.status(statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }

  // Production Mode Error Handling
  if (process.env.NODE_ENV === "production") {
    // Handle Validation Errors (e.g., Mongoose validation)
    if (err.name === "ValidationError") {
      statusCode = 400; // Bad request
      message = Object.values(err.errors)
        .map((val) => val.message)
        .join(", ");
    }

    // Handle Cast Errors (invalid ObjectId, etc.)
    else if (err.name === "CastError") {
      statusCode = 400; // Bad request for invalid data type
      message = `Invalid ${err.path}: ${err.value}`;
    }

    // Handle Duplicate Key Errors (MongoDB unique fields)
    else if (err.code && err.code === 11000) {
      statusCode = 400; // Bad request for duplicate field values
      message = `Duplicate field value: ${Object.keys(err.keyValue).join(
        ", "
      )}. Please use another value.`;
    }

    // Handle JWT Authentication Errors (if using JWT)
    else if (err.name === "JsonWebTokenError") {
      statusCode = 401; // Unauthorized access
      message = "Invalid token. Please log in again.";
    }

    // Handle JWT Expired Errors
    else if (err.name === "TokenExpiredError") {
      statusCode = 401; // Unauthorized access
      message = "Your session has expired. Please log in again.";
    }

    // Handle Forbidden Access (e.g., Admin-only routes)
    else if (err.message === "Forbidden") {
      statusCode = 403; // Forbidden
      message = "You do not have permission to perform this action.";
    }

    // Handle Not Found Errors (e.g., when an entity is not found in the DB)
    else if (err.message === "NotFound") {
      statusCode = 404; // Resource not found
      message = "The requested resource was not found.";
    }

    // Handle Payment Processing Errors (for payment gateways like Stripe, PayPal)
    else if (err.message === "PaymentError") {
      statusCode = 402; // Payment required
      message = "Payment processing failed. Please try again.";
    }

    // Handle Stock Availability Errors
    else if (err.message === "OutOfStock") {
      statusCode = 409; // Conflict
      message = "One or more products in your cart are out of stock.";
    }

    // General error fallback for unexpected situations
    return res.status(statusCode).json({
      success: false,
      message,
      stack: process.env.NODE_ENV === "production" ? null : err.stack, // Hide stack trace in production
    });
  }

  // In case no condition matches, send generic error
  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong",
  });
};

module.exports = errorHandler;
