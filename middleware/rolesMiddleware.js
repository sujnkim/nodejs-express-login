const User = require("../model/User");

const rolesMiddleware = (...allowedRoles) => {
  //Use after authMiddleware
  //allowedRoles: ROLES_LIST.***
  //req.body = { _id, roles }

  return async (req, res, next) => {
    if (!req?.roles) {
      return res.status(401).json({ message: "Can't check roles" });
    }
    //console.log(req.roles);

    const rolesAry = [...allowedRoles];

    const result = req.roles
      .map((role) => rolesAry.includes(role))
      .find((val) => val === true);

    if (!result) {
      return res.status(403).json({ message: "Not authorized" });
    }
    //console.log(result);

    next();
  };
};

module.exports = rolesMiddleware;
