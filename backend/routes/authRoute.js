const express = require("express");
const { newUser, login, logout } = require("../controllers/userController");
const router = express.Router();

router.route("/user/auth/new").post(newUser);
router.route("/user/auth/logIn").post(login);
router.route("/user/auth/logout").post(logout);

module.exports = router;
