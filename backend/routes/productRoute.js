const express = require("express");
const {
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  newProduct,
  createReview,
  getAllReviews,
  deleteReview,
} = require("../controllers/productController");
const {
  authorizedRoles,
  isAuthenticatedUser,
} = require("../middlewares/authenticate");
const router = express.Router();

router.route("/products").get(isAuthenticatedUser, getProducts);
router.route("/product/:id").get(getSingleProduct);
router.route("/reviews/create").post(isAuthenticatedUser, createReview);
router.route("/reviews").get(getAllReviews);
router.route("/review").delete(deleteReview);

//ADMIN ROUTES
router
  .route("/product/new")
  .post(isAuthenticatedUser, authorizedRoles("admin"), newProduct);
router
  .route("/product/:id")
  .put(isAuthenticatedUser, authorizedRoles("admin"), updateProduct);
router
  .route("/product/:id")
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteProduct);

module.exports = router;
