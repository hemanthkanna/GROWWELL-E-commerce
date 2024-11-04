const express = require("express");
const {
  authorizedRoles,
  isAuthenticatedUser,
} = require("../middlewares/authenticate");
const {
  newOrder,
  getSingleOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getOrdersByStatus,
  getOrdersByUserId,
  deleteOrder,
  getOrdersByDateRange,
} = require("../controllers/orderController");
const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
router.route("/myOrders").get(isAuthenticatedUser, getMyOrders);

//ADMIN ROUTES

router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getAllOrders);

router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizedRoles("admin"), updateOrderStatus);

router
  .route("/admin/orders/status")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getOrdersByStatus);

router
  .route("/admin/orders/user/:userId")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getOrdersByUserId);

router
  .route("/admin/orders/range/:startDate/:endDate")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getOrdersByDateRange);

router
  .route("/admin/order/:id")
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteOrder);

module.exports = router;
