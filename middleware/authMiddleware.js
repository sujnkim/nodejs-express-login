const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  //request 헤더의 Authorization Bearer 확인
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "There is no Token." }); //Unauthorized... un-authenticated
  }

  const token = authHeader.split(" ")[1];
  //console.log(token);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid Token." }); //Frobidden... invalid token

    req._id = decoded.UserInfo._id;
    req.roles = decoded.UserInfo.roles;
    //console.log(req._id);

    next();
  });
};

module.exports = authMiddleware;
