const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
    maxLength: [100, "Product name cannot exceed 100 characters"],
  },
  prices: [
    {
      weight: String,
      price: {
        type: Number,
        required: [true, "Please enter the original price"],
      },
      offerPrice: {
        type: Number, // Optional, used for special offers
      },
      stock: {
        type: Number,
        required: [true, "Please enter stock for this weight range"],
      },
    },
  ],
  description: {
    overView: { type: String },
    naturalOrigin: { type: String },
    safePacking: { type: String },
    protection: { type: String },
    nutrientDense: { type: String },
    naturalSweetener: { type: String },
    keyIngredients: { type: String },
    healthBenefits: { type: String },
    packaging: { type: String },
    directionForUse: { type: String },
    tasteAndFlavour: { type: String },
    productionProcess: { type: String },
    sourceAndSustainability: { type: String },
    readyToMix: { type: String },
    KeyBenefits: {
      type: Map,
      of: String,
    },
    nutrientPackedGoodness: { type: String },
    spicyMetabolismBoost: { type: String },
    HeartHealthSupport: { type: String },
    PerfectForWeightManagement: { type: String },
    RichInAntioxidants: { type: String },
    BrainAndBoneHealth: { type: String },
    SustainedEnergyAndSatiety: { type: String },
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
        "Spices",
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
  totalStock: {
    type: Number,
    required: [true, "Please enter product stock"],
    maxLength: [50, "Product stock cannot exceed 50"],
  },
  productQuantity: {
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

let schema = mongoose.model("Product", productSchema);

module.exports = schema;
