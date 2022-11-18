const jwt = require("jsonwebtoken");
const User = require("../models/users");

const makeid = require("../helpers/numericId");

exports.auth = async (req, res, next) => {
  const code = 401;
  if (req.headers.authorization) {
    try {
      const authorization = req.headers.authorization;
      const data = jwt.verify(authorization, process.env.JWTSECRET);
      if (data.user) {
        let user = await User.findById(data.user._id);

        if (!user) {
          return res.status(code).json({
            code,
            message: "Authentication token is invalid",
            errors: {},
          });
        } else if (user.status == "suspended") {
          return res.status(code).json({
            code,
            message: "Your account has been suspended!",
            errors: {},
          });
        } else if (user.status == "archived") {
          return res.status(code).json({
            code,
            message: "Your account has been archived by the admin!",
            errors: {},
          });
        } else {
          req.user = user;
          return next();
        }
      }
      return res
        .status(code)
        .json({ code, message: "Authentication token is invalid", errors: {} });
    } catch (err) {
      return res.status(code).json({
        code,
        message: "Authentication token is invalid",
        errors: { error: err.message },
      });
    }
  } else {
    return res
      .status(code)
      .json({ code, message: "Authentication token is invalid", errors: {} });
  }
};

exports.adminAuth = (req, res, next) => {
  const code = 401;
  try {
    const { user } = req;
    if (user.role == "admin") {
      return next();
    }
    return res
      .status(code)
      .json({ code, message: "You are not an admin", errors: {} });
  } catch (err) {
    return res
      .status(code)
      .json({ code, message: "Authentication token is invalid", errors: {} });
  }
};

exports.beforeAuth = (req, res, next) => {
  const code = 401;
  if (req.headers.authorization) {
    try {
      const authorization = req.headers.authorization;
      const data = jwt.verify(authorization, process.env.JWTSECRET);

      if (data._id) {
        req._id = data._id;
        return next();
      }
      return res
        .status(code)
        .json({ code, message: "Authentication token is invalid", errors: {} });
    } catch (err) {
      return res
        .status(code)
        .json({ code, message: "Authentication token is invalid", errors: {} });
    }
  } else {
    return res
      .status(code)
      .json({ code, message: "Authentication token is invalid", errors: {} });
  }
};
