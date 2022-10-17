const User = require("../model/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  //cookie에 저장된 refreshToken 추출
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(401); //Unauthorized
  }
  const refreshToken = cookies.jwt;
  //console.log("refreshToken: ", refreshToken);

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    return res.sendStatus(403); //Forbidden
  }
  //console.log("username: ", foundUser.username);

  //evaluate refreshToken
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || !foundUser._id.equals(decoded._id)) {
      return res.sendStatus(403); //Forbidden
    }

    //accessToken 재발급
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          _id: decoded._id,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2m" } //30min
    );
    //console.log("accessToken :", accessToken);

    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
