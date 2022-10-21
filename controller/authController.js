const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { mail, pwd } = req.body;
  if (!mail || !pwd) {
    return res
      .status(400)
      .json({ message: `Email and password are required.` });
  }

  //해당 이메일 사용자 존재 확인
  const foundUser = await User.findOne({ email: mail }).exec();
  if (!foundUser) {
    //Unauthorized: Wrong Email
    res.status(401).json({ message: "Email not found." });
  }

  //evaluate password
  const comparePwd = await bcrypt.compare(pwd, foundUser.password);
  if (comparePwd) {
    const roles = Object.values(foundUser.roles);

    //create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          _id: foundUser._id,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2m" } //30min
    );

    const refreshToken = jwt.sign(
      { _id: foundUser._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" } //14d
    );

    //save refreshToken in DB
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    //console.log(result);

    //response
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      //secure:"true",
      maxAge: 24 * 60 * 60 * 1000, //24hours
    });
    res.json({ name: foundUser.username, accessToken });
  } else {
    //Unauthorized: wrong password
    res.status(401).json({ message: "Wrong password." });
  }
};

module.exports = { handleLogin };
