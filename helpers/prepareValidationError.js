const { validationResult } = require("express-validator");
const prepareValidationError = (req, res, next) => {
  const validationObj = validationResult(req);
  if (!validationObj.isEmpty()) {
    const { errors } = validationObj;
    const [error] = errors;
    const code = 400;
    return res.status(code).json({
      code,
      message: error.msg,
      errors: { [error.param]: error.msg },
    });
  }
  next();
};

module.exports = prepareValidationError;
