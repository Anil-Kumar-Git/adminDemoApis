const { check } = require("express-validator");
const prepareValidationError = require("../helpers/prepareValidationError");

exports.validateCreateService = [
    check("name", "name field is missing").exists(),
    check("name", "name field is required").notEmpty(),
    check("description", "description field is missing").exists(),
    check("description", "description field is required").notEmpty(),
    check("price", "price field is missing").exists(),
    check("price", "price field is required").notEmpty(),
    check("benefit", "benefit field is missing").exists(),
    check("benefit", "benefit field is required").notEmpty(),
    check("image", "image is required").optional().notEmpty(),
    check("status", "status is required").exists(),
    (req, res, next) => {
      prepareValidationError(req, res, next);
    },
  ]; 