const express = require("express");
const router = express.Router();

const User = require("../model/User");

const authMiddleware = require("../middleware/authMiddleware");

//for test
router.get("/", (req, res) => {
  res.send("test");
});

//특정 유저 정보
router.get("/mypage", authMiddleware, async (req, res) => {
  const foundUser = await User.findOne({ _id: req._id }).exec();
  const email = foundUser.email;
  const username = foundUser.username;

  return res.status(200).json({ email, username });
});

module.exports = router;
