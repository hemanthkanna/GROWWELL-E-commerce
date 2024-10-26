const express = require("express");
const {
  authorizedRoles,
  isAuthenticatedUser,
} = require("../middlewares/authenticate");
const { newOrder, getSingleOrder } = require("../controllers/orderController");
const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

module.exports = router;
