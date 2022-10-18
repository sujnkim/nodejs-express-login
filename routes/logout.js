const express = require("express");
const router = express.Router();

const logoutController = require("../controller/logoutController");

//로그인
router.get("/", logoutController.handleLogout);

module.exports = router;
