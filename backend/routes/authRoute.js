const express = require("express");
const {
  newUser,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserPassword,
  updateUserProfile,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const {
  authorizedRoles,
  isAuthenticatedUser,
} = require("../middlewares/authenticate");
const router = express.Router();

router.route("/user/auth/new").post(newUser);
router.route("/user/auth/logIn").post(login);
router.route("/user/auth/logout").post(logout);
router.route("/user/auth/forgot/password").post(forgotPassword);
router.route("/user/auth/resetPassword/:token").post(resetPassword);
router.route("/user/myProfile").get(isAuthenticatedUser, getUserProfile);
router
  .route("/user/password/change")
  .put(isAuthenticatedUser, updateUserPassword);
router
  .route("/user/myProfile/update")
  .put(isAuthenticatedUser, updateUserProfile);

//ADMIN ROUTES
router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getAllUsers);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getUser)
  .put(isAuthenticatedUser, authorizedRoles("admin"), updateUser)
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteUser);

module.exports = router;
