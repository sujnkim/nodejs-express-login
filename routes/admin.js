const express = require("express");
const router = express.Router();

const User = require("../model/User");
/*
const ROLES_LIST = require("../config/roles_list");
const rolesMiddleware = require("../middleware/rolesMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
*/

//모든 유저 정보(_id, email, username)
router.get(
  "/allusers",
  //authMiddleware,
  //rolesMiddleware(ROLES_LIST.Admin),
  async (req, res) => {
    const users = await User.find(
      {},
      { _id: true, email: true, username: true }
    ).exec();

    if (!users) {
      res.sendStatus(401);
    }

    //console.log(users);
    res.json(users);
  }
);

module.exports = router;
