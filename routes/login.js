const express = require("express");
const router = express.Router();

const authController = require("../controller/authController");

//로그인
router.post("/", authController.handleLogin);

module.exports = router;
