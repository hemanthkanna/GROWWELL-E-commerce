const catchAsyncError = require("../middlewares/catchAsyncError");
const { ErrorHandler } = require("../middlewares/errorHandler");
const Product = require("../modals/productModal");

//ADMIN :  CREATE NEW PRODUCT   --   /api/v1/product/new
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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const skip = (page - 1) * limit;

  const buildQuery = {};

  if (req.query.search) {
    buildQuery.$or = [
      { productName: { $regex: req.query.search, $options: "i" } },
      { "description.overView": { $regex: req.query.search, $options: "i" } },
      {
        "description.naturalOrigin": {
          $regex: req.query.search,
          $options: "i",
        },
      },
      {
        "description.safePacking": { $regex: req.query.search, $options: "i" },
      },
      // Add more nested fields as needed
    ];
  }

  if (req.query.category) {
    buildQuery.category = req.query.category;
  }

  if (req.query.minPrice || req.query.maxPrice) {
    buildQuery["prices"] = {
      $elemMatch: {},
    };

    const minPrice = parseFloat(req.query.minPrice);
    const maxPrice = parseFloat(req.query.maxPrice);

    // Set $gte for minPrice if provided
    if (req.query.minPrice) {
      buildQuery["prices"].$elemMatch.price = { $gte: minPrice };
    }

    // Set $lte for maxPrice if provided and merge it with existing $gte
    if (req.query.maxPrice) {
      buildQuery["prices"].$elemMatch.price = {
        ...buildQuery["prices"].$elemMatch.price,
        $lte: maxPrice,
      };
    }
  }

  if (req.query.ratings) {
    const ratings = parseFloat(req.query.ratings);
    buildQuery.ratings = { $gte: ratings };
  }

  const products = await Product.find(buildQuery).skip(skip).limit(limit);
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

//ADMIN: UPDATE PRODUCT       --   /api/v1/product/:id
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

//ADMIN: DELETE PRODUCT      --   /api/v1/product/:id
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
