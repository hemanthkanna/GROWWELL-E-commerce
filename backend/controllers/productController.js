const catchAsyncError = require("../middlewares/catchAsyncError");
const { ErrorHandler } = require("../middlewares/errorHandler");
const Product = require("../modals/productModal");

// CREATE NEW PRODUCT   --   /api/v1/product/new
exports.newProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});

// GET ALL PRODUCTS      --   /api/v1/products
exports.getProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find();
  res.status(201).json({
    success: true,
    data: products,
  });
});

// GET SINGLE PRODUCT    --   /api/v1/product/:id
exports.getSingleProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

// UPDATE PRODUCT       --   /api/v1/product/:id
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
});

// DELETE PRODUCT      --   /api/v1/product/:id
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});
