const express = require("express");
const {
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  newProduct,
} = require("../controllers/productController");
const router = express.Router();

router.route("/product/new").post(newProduct);
router.route("/products").get(getProducts);
router.route("/product/:id").get(getSingleProduct);
router.route("/product/:id").put(updateProduct);
router.route("/product/:id").delete(deleteProduct);

module.exports = router;
