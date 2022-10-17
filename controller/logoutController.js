const User = require("../model/User");

const handleLogout = async (req, res) => {
  //request에서 cookie 여부 확인
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    //cookies.jwt가 존재하지 않을 경우
    return res.sendStatus(204); //No Content
  }
  const refreshToken = cookies.jwt;

  //refreshToken이 DB에 있는지 확인
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204);
  }

  //console.log(refreshToken);
  //console.log(foundUser.username);

  //refreshToken을 DB에서 삭제
  foundUser.refreshToken = "";

  const result = await foundUser.save();
  console.log(result);

  //response
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
};

module.exports = { handleLogout };
