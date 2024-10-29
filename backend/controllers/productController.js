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

// CREATE REVIEW   --  /api/v1/reviews/create
exports.createReview = catchAsyncError(async (req, res, next) => {
  const { productId, rating, comment } = req.body;
  const review = {
    user: req.user._id,
    rating,
    comment,
  };

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  //check if the user has already reviewed the product
  const isReviewed = product.reviews.find((review) => {
    return review.user.toString() == req.user._id.toString();
  });

  if (isReviewed) {
    //updating the review
    product.reviews.forEach((review) => {
      if (review.user.toString() == req.user._id.toString()) {
        review.rating = rating;
        review.comment = comment;
      }
    });
  } else {
    //add new review to the product
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  //finding average of product review
  product.ratings =
    product.reviews.reduce((acc, review) => {
      return review.rating + acc;
    }, 0) / product.reviews.length;
  product.ratings = isNaN(product.ratings) ? 0 : product.ratings;

  await product.save({ validateBeforeSave: false });

  res.status(201).json({
    success: true,
    message: "Review created successfully",
  });
});

//GET ALL REVIEWS FOR A PRODUCT  -- /api/v1/reviews?id=productId
exports.getAllReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

//DELETE REVIEW -- api/v1/review?id=reviewId&productId=productId
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  //filtering the reviews which does match the deleting review id
  const reviews = product.reviews.filter((review) => {
    return review._id.toString() !== req.query.id.toString();
  });
  //number of reviews
  const numOfReviews = reviews.length;

  //finding the average with the filtered reviews
  let ratings =
    reviews.reduce((acc, review) => {
      return review.rating + acc;
    }, 0) / reviews.length;
  ratings = isNaN(ratings) ? 0 : ratings;

  //save the product document
  await Product.findByIdAndUpdate(req.query.productId, {
    reviews,
    numOfReviews,
    ratings,
  });
  res.status(200).json({
    success: true,
  });
});
