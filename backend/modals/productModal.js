const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
    maxLength: [100, "Product name cannot exceed 100 characters"],
  },
  price: {
    "120gm": {
      type: Number,
    },
    "200gm": {
      type: Number,
    },
    "250gm": {
      type: Number,
    },
    "500gm": {
      type: Number,
    },
    "1kg": {
      type: Number,
    },
  },
  description: {
    naturalOrigin: {
      type: String,
    },
    safePacking: {
      type: String,
    },
    protection: {
      type: String,
    },
    nutrientDense: {
      type: String,
    },
    naturalSweetener: {
      type: String,
    },
    overView: {
      type: String,
    },
    keyIngredients: {
      type: String,
    },
    healthBenefits: {
      type: String,
    },
    packaging: {
      type: String,
    },
    directionForUse: {
      type: String,
    },
    tasteAndFlavour: {
      type: String,
    },
    productionProcess: {
      type: String,
    },
    sourceAndSustainability: {
      type: String,
    },
    readyToMix: {
      type: String,
    },
    keyFeatures: {
      type: String,
    },
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      image: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please enter product category"],
    enum: {
      values: [
        "Western Ghats honey",
        "Flavoured Honey",
        "Spices (Seeds & Nuts)",
        "Nutrimix",
        "Millet",
      ],
      message: "Please select the correct category",
    },
  },
  seller: {
    type: String,
    required: [true, "Please enter product seller"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter product stock"],
    maxLength: [20, "Product stock cannot exceed 20"],
  },
  product_quantity: {
    type: [String],
    required: true,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
